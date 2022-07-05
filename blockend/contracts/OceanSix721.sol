// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice ERC721
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

/// @notice peripheral
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @notice libraries
import "../node_modules/@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

/* 
    @title Ocean6
    @notice ERC721-ready OceanSix721 contract
    @author cryptoware.eth | Ocean6
*/

contract OceanSix721 is Ownable, ERC721, ERC721Burnable, ERC721Pausable {
    /// @notice using safe math for uints (uints might cause an overflow ==> reverts transaction when an oveflow occurs!)
    using SafeMath for uint256;
    using SafeMath for uint32;

    /// @notice using Strings for uints conversions such as => tokenId
    using Strings for uint256;

    /// @notice using Address for addresses extended functionality
    using Address for address;

    /// @notice using MerkleProof library to verify Merkle proofs
    using MerkleProof for bytes32[];

    /// @notice using a counter to increment next Id to be minted
    using Counters for Counters.Counter;

    /// @notice Enum representing the minting phases
    enum Phase {
        Presale, 
        Public
    }

    /// @notice EIP721-required Base URI
    /// This is a Uniform Resource Identifier, distinct used to identify each unique nft from the other. 
    string private _baseTokenURI;

    /// @notice URI to hide NFTS during minting 
    string public _notRevealedURI;

    /// @notice Base extension for metadata
    string private _baseExtension;

    /// @notice the current phase of the minting 
    Phase private _phase;

    /// @notice token id to be minted next
    Counters.Counter private _tokenIdTracker;

    /// @notice root of the Merkle tree
    bytes32 private _merkleRoot;

    /// @notice The rate of minting per phase
    mapping(Phase => uint256) public _mintPrice;

    /// @notice The rate of mints per user
    mapping(Phase => mapping(address => uint256)) public _mintsPerUser;

    /// @notice Max number of NFTs to be minted
    uint32 private _maxTokenId;

    /// @notice max amount of nfts that can be minted per wallet address
    uint32 private _mintingLimit;

    /// @notice Splitter Contract that will collect mint fees;
    address payable private _mintingBeneficiary;

    /// @notice public metadata locked flag
    bool public locked;

    /// @notice public revealed state
    bool public revealed;

    /// @notice Minting events definition
    event AdminMinted(address indexed to, uint indexed tokenId);
    event Minted(address indexed to, uint indexed tokenId);

    /// @notice Event published when a phase is triggered 
    /// @param phase next minting phase
    /// @param mintCost minting cost in next phase 
    /// @param mintingLimit minting limit per wallet address

    event PhaseTriggered(Phase indexed phase, uint256 indexed mintCost, uint indexed mintingLimit);

    /// @notice metadata not locked modifier
    /// Require function, the first parameter is the condition, if it is not met, then the second parameter is will be outputed
    modifier notLocked(){
        require(!locked, "OceanSix721: Metadata URIs are locked");
        /// The uncommon instruction specified where the function should be executed
        _;
    }

    /// @notice Art is not revealed modifier
    modifier notRevealed() {
        require(!revealed, "OceanSix721: Art is already revealed");
        _;
    }

    /// @notice Art is already revealed
    modifier Revealed() {
        require(revealed, "OceanSix721: Art is not revealed");
        _;
    }

    /// @notice constructor 
    /// @param name the name of the EIP721 contract
    /// @param symbol the token symbol
    /// @param baseTokenURI EIP721-required Base URI
    /// @param notRevealedURI URI ot hide NFTs during minting
    /// @param merkleRoot merkle tree root of the hashed whitelist addresses
    /// @param mbeneficiary the contract splitter that will receive minting funds

    constructor(
        string memory name, 
        string memory symbol,
        string memory baseTokenURI,
        string memory notRevealedURI,
        bytes32 merkleRoot,
        address mbeneficiary
    ) ERC721(name, symbol) Ownable() {
        _phase = Phase.Presale;
        _mintPrice[_phase] = 0.01 ether;

        _mintingLimit = 3;
        _maxTokenId = 22;

        _merkleRoot = merkleRoot;
        _baseExtension = ".json";
        _baseTokenURI = baseTokenURI;
        _notRevealedURI = notRevealedURI;
        _mintingBeneficiary = payable(mbeneficiary);
        _tokenIdTracker.increment();
    }

    /// @notice receive fallback should revert 
    /// @notice receive payement address without any minting.

    receive() external payable {
        revert("OceanSix721: Please use Mint or Admin calls");
    }

    /// @notice default fallback should revert
    fallback() external payable {
        revert("OceanSix721: Please use Mint or Admin calls");
    }

    /// @notice returnd the base URI for the contract
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /// @dev See {IERC721Metadata-tokenURI}
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return revealed ?
            string(abi.encodePacked(super.tokenURI(tokenId), _baseExtension)): _notRevealedURI;
    }

    /// @notice updates the 2 addresses involved in the contract flow
    /// @param mintingBeneficiary the contract Splitter that will receive minting and royalties funds
    /// @param _owner the new admin address

    function updateAddressesAndTransferOwnership(
        address mintingBeneficiary,
        address _owner
    ) public onlyOwner {
        changeMintBeneficiary(mintingBeneficiary);
        transferOwnership(_owner);
    }

    /// @notice changes the minting beneficiary payable address
    /// @notice beneficiary the contract Splitter that will receive minting funds

    /**
     * @notice a function for admins to mint cost-free
     * @param to the address to send the minted token to
    **/

    function adminMint(address to) external whenNotPaused onlyOwner {
        require (to != address(0), "OceanSix721: Address cannot be 0");
        maxSupplyNotExceeded(1);
        _safeMint(to, _tokenIdTracker.current());
        emit AdminMinted(to, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    /// @notice the public minting function -- requires 1 ether sent 
    /// @param to the address to send the minted token to
    /// @param amount amount of tokens to mint
    /// @param _proof verify if msg.sender is whitelisted whenever presale

    function mint(address to, uint32 amount, bytes32[] memory _proof)
        external
        payable
        whenNotPaused
    {
        uint256 received = msg.value;
        require(to != address(0), "OceanSix721: Address cannot be 0");
        require(
            received == _mintPrice[_phase].mul(amount), "OceanSix721: Ether sent is not the right amount"
        );

        maxSupplyNotExceeded(amount);

        if(_phase == Phase.Presale){
            // require (amount <= _mintingLimit, "OceanSix721: Allowed amount to mint exceeded");
            isAllowedToMint(_proof);
            // walletLimitNotExceeded(to, amount);
            checkLimit(to, amount);
            _mintsPerUser[_phase][to]+=amount;
        } else {
            checkLimit(to, amount);
            _mintsPerUser[_phase][to]+=amount;
            // require(amount <= _mintingLimit, "OceanSix721: Allowed amount to mint exceeded");
            // walletLimitNotExceeded(to, amount);
        }
        for(uint32 i=amount; i>0; i--){
            _safeMint(to, _tokenIdTracker.current());
            emit Minted(to, _tokenIdTracker.current());
            _tokenIdTracker.increment();
        }

        _forwardFunds(received);
    }    

    /// @notice pausing the cotract minting and token transfer
    function pause() public virtual onlyOwner{
        _pause();
    }

    /// @notice unpausing the contract minting and token transfer
    function unpause() public virtual onlyOwner{
        _unpause();
    }

    function changeMintBeneficiary(address beneficiary) public onlyOwner {
        require(
            beneficiary != address(0),
            "OceanSix721: Minting beneficiary cannot be address 0"
        );

        require(
            beneficiary != _mintingBeneficiary,
            "OceanSix721: beneficiary cannot be the same as previous"
        );
        _mintingBeneficiary = payable(beneficiary);
    }

    /// @notice Updates the phase and minting cost 
    /// @param phase the phase ID to set next
    /// @param mintCost the cost of minting next phase
    /// @param mintingLimit set limit per wallet address

    function setPhase(
        Phase phase, 
        uint256 mintCost,
        uint32 mintingLimit
    ) public onlyOwner {
        require(mintCost>0, "OceanSix721: rate is 0");
        require(_phase != phase, "OceanSix721: Phase cannot be the same");

        /// @notice set phase 
        _phase = phase;
        _mintingLimit = mintingLimit;

        /// @notice set phase cost
        changeMintCost(mintCost);
        emit PhaseTriggered(_phase, mintCost, mintingLimit);
    }

    /// @notice gets the current phase of the minting
    function getPhase() public view returns (Phase) {
        return _phase;
    }

    ///@notice gets the amounts of mints per wallet address
    function getMintingLimit() public view returns (uint256) {
        return _mintingLimit;
    }

    /// @notice changes the minting cost 
    /// @param mintCost new minting cost

    function changeMintCost(uint256 mintCost) public onlyOwner {
        require(
            mintCost != _mintPrice[_phase],
            "OceanSix721: mint cost cannot be same as previous"
        );
        _mintPrice[_phase] = mintCost;
    }

    function changeBaseURI(string memory newBaseURI)
        public 
        onlyOwner
        notLocked
    {
        require((keccak256(abi.encodePacked((_baseTokenURI))) != keccak256(abi.encodePacked((newBaseURI)))), "OceanSix721: Base URI cannot be same as previous");
        _baseTokenURI = newBaseURI;
    }

    /**
     * @notice changes to not revealed URI
     * @param newNotRevealedUri the new notRevealed URI
    **/
    function changeNotRevealedURI(string memory newNotRevealedUri)
        public
        onlyOwner
        notRevealed
    {
        require((keccak256(abi.encodePacked((newNotRevealedUri))) != keccak256(abi.encodePacked((_notRevealedURI)))), "MPRN721: Base URI cannot be same as previous");
        _notRevealedURI = newNotRevealedUri;
    }

    ///@notice reveal NFTs
    function reveal() public onlyOwner notRevealed {
        revealed = true;
    }

    /// @notice lock metadata forever
    function lockMetadata()
        public 
        onlyOwner
        notLocked
        Revealed
    {
        locked = true;
    }
    
    /**
     * @notice changes merkleRoot in case whitelist updated
     * @param merkleRoot root of the Merkle tree
    **/
    function changeMerkleRoot(bytes32 merkleRoot)
        public
        onlyOwner
    {
        require(
            merkleRoot != _merkleRoot, 
            "OceanSix721: Merkle root cannot be same as previous"
        );
        _merkleRoot = merkleRoot;
    }

    ///@notice the public function for checking if more tokens can be minted
    function maxSupplyNotExceeded(uint32 amount) public view returns (bool) {
        require(_tokenIdTracker.current().add(amount.sub(1)) <= _maxTokenId, "OceanSix721: max NFT limit exceeded");
        return true;
    }

    /// @notice the public function validating addresses to presale phase
    /// @param _proof hashes validating that a leaf exists inside merkle tree aka _merkleRoot

    function isAllowedToMint(bytes32[] memory _proof) internal view returns (bool){
        require(
            MerkleProof.verify(_proof, _merkleRoot, keccak256(abi.encodePacked(msg.sender))),
            "OceanSix721: Caller is not whitelisted for Presale"
        );
        return true;
    }

    // /// @notice checks if an address reached limit per wallet
    // /// @param minter address user minting nf
    // /// @param amount nfts amount to mint

    // function walletLimitNotExceeded(address minter, uint32 amount) internal view returns (bool) {
    //     require(balanceOf(minter).add(amount) <= _mintingLimit, "OceanSix721: max NFT per address exceeded");
    //     return true;
    // }

    /// @notice Current totalSupply
    function totalSupply() external view returns (uint256) {
        return(_tokenIdTracker.current()).sub(1);
    }

    /// @notice Determines how ETH is stored/forwarded on purchases.
    /// @param received amount to forward

    function _forwardFunds(uint256 received) internal {
        /// @notice forward fund to Splitter contract using CALL to avoid 2300 stipend limit
        (bool success, ) = _mintingBeneficiary.call{value: received}("");
        require(success, "OceanSix721: Failed to forward funds");
    }

    /// @notice before transfer hook function
    /// @param from the address to send the token from
    /// @param to the address to send the token to
    /// @param tokenId to token ID to be sent

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override (ERC721, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function checkLimit(address minter, uint32 amount) internal view returns (bool) {
        require(_mintsPerUser[_phase][minter].add(amount)<=_mintingLimit, "OCN: Max NFT per address exceeded");
        return true;
    }




}

