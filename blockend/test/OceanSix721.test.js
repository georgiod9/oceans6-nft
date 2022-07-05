const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

//chai assert
const {assert} = chai;

// chai promises
chai.use(chaiAsPromised);

// utils
const { toTokens } = require("../utils/test-utils")(web3);

// file system
const fs = require("fs");

// Hash tree
const { MerkleTree } = require("merkletreejs");

// hashing function 
const keccak256 = require("keccak256");

// load contract artifact
const oceanSixCont = artifacts.require("OceanSix721");
const StakeHolderPoolCont = artifacts.require("StakeHoldersPool");

// Root created and saved on migration
const tree = JSON.parse(fs.readFileSync("./merkle/tree.json"));
const Mroot = fs.readFileSync("./merkle/root.dat");

// MerkleTree object from our saved root
const merkleTreeObj = Object.setPrototypeOf(tree, MerkleTree.prototype);

// leaves - object to buffer
merkleTreeObj.leaves =tree.leaves.map((leaf) => Buffer.from(leaf));

// layers - object to buffer
merkleTreeObj.layers = tree.layers.map((layer) => 
    layer.map((item) => Buffer.from(item))
);

// OceanSix721 contract test spec
contract("OceanSix721", ([owner, user, whitelistedUser, notWhitelistedUser, ...others]) => {
    let ocean;
    let pool;
    let txStack = [];

    const HexProof = (account) => {
        return merkleTreeObj.getHexProof(keccak256(account));
    };

    before(async () => {
        ocean = await oceanSixCont.deployed();
        pool = await StakeHolderPoolCont.deployed();
    });

    describe("OceanSix721 Deployment", async () => {
        // Check name and symbol
        it("Name is Ocean6 and symbol is OCN", async () => {
            let name = await ocean.name();
            let symbol = await ocean.symbol();
            assert.equal(name, "Ocean6");
            assert.equal(symbol, "OCN");
        });

        // Check minting costs
        it("Minting price must be 0.01 ether", async () => {
            let mintPrice = await ocean._mintPrice(0);
            assert.equal(mintPrice, toTokens("0.01"));
        });
    });

    describe("Updating addresses, transfering ownership and managing parameters", async () => {
        // Transfer ownership only Owner
        it("Ownership transfer & address changes", async () => {
            try {
                let tx = await ocean.updateAddressesAndTransferOwnership(
                    others[0],
                    others[1],
                    {from: owner}
                );
                txStack.push(tx);
                tx = await ocean.updateAddressesAndTransferOwnership(
                    pool.address,
                    owner,
                    { from: others[1] }
                );
                txStack.push(tx);
            }   catch(e) {
                console.log(e);
                assert.fail();
            }

        });

        // change mint price only owner
        it("changing the minting price", async () => {
            let tx = await ocean
                .changeMintCost(toTokens("0.3"), {from: owner})
                .catch(() => {
                    assert.fail("could not update minting price");
                });
            txStack.push(tx);
        });

        // change mint price invalid since it is from user
        it("Changing the minting price should fail from user", async() => {
            let tx = await ocean
                .changeMintCost(toTokens("0.1"), {from: user})
                .then(() => {
                    assert.fail("user shouldnt be able to change minting price");
                })
                .catch(r=>{
                    assert.ok("user was not able to change minting price");
                    return r;
                });
            txStack.push(tx);
            tx = await ocean
                .changeMintCost(toTokens("0.1"), {from: owner})
                .catch(() => {
                    assert.fail("Could not update minting price");
                });
            txStack.push(tx);
        });

        // change base URI only owner
        it("Changing the base URI", async () => {
            let tx = await ocean
                .changeBaseURI("ipfs://testurl/", {from: owner})
                .catch(() => {
                    assert.fail("could not update base URI");
                });
            txStack.push(tx);
        });

        // Changing the not revealed URI only Owner
        it("Changing the not reavelead URI", async () => {
            let tx = await ocean
                .changeNotRevealedURI("ipfs://testurl/1.json", { from: owner})
                .catch(() => {
                    assert.fail("Could not update the not revealed URI");
                });
            txStack.push(tx);
        });

        // change base URI invalid 
        it("Changing the base URI should fail from user", async () => {
            let tx = await ocean
                .changeBaseURI("ipfs://untesturl/", {from:user})
                .then(() => {
                    assert.fail("user was not able to change base URI");
                })
                .catch(r => {
                    assert.ok("user was not able to change base URI");
                    return r;
                });
            txStack.push(tx);
        });

        // change not revealed URI invalid
        it("Changing the not revealed URI should fail from the user", async () => {
            let tx = await ocean
                .changeNotRevealedURI("ipfs://testurl/1.json", {from: user})
                .then(() => {
                    assert.fail("User was not able to change not revealed URI");
                })
                .catch(r => {
                    assert.ok("User was not able to change not revealed URI");
                    return r;
                });
            txStack.push(tx);
        });

        // change merkle root only owner
        it("Changing merkle root onely the owner", async () => {
            let tx = await ocean
                .changeMerkleRoot("0xf19cba932303088ee08ccdf705cc51dc5fcddc05af672df8fbb04a4123651115",
                    {from: owner}
                )
                .catch(() => {
                assert.fail("Owner could not change merkle root");
                });
            txStack.push(tx);
            tx = await ocean
                .changeMerkleRoot(
                    Mroot.toString(),
                    {from:owner}
                )
                .catch(() => {
                    assert.fail("Owner could not change merkle root");
                });
            txStack.push(tx);
        });

         // change merkleRoot should fail from user
        it("Changing the merkleRoot should fail from user", async () => {
            let tx = await ocean
            .changeMerkleRoot(
                "0xf19cba932303088ee08ccdf705cc51dc5fcddc05af672df8fbb04a4123651115",
                { from: user }
            )
            .catch(r => {
                assert.ok("User was not able to change merkle root");
                return r;
            });
            txStack.push(tx);
        });

    });

    describe("Validating, presale minting & locking metadata", async () => {
        //Try adming mint, should be able to mint
        it("Admin can mint", async () => {
            let tx = await ocean.adminMint(owner, {from: owner});
            let own = await ocean.ownerOf(1);
            txStack.push(tx);
            assert.equal(own, owner);
        });

        //Checking token URI
        it("Checking token URI", async () => {
            let tokenURI = await ocean.tokenURI(1);
            assert.equal(tokenURI, "ipfs://testurl/1.json")
        });

        // attempts user mint
        it("Whitelisted user can mint during Presale", async () => {
            let tx = await ocean.mint(whitelistedUser, 3, HexProof(whitelistedUser), {
            from: whitelistedUser,
            value: toTokens("0.3"),
            });
            let own = await ocean.ownerOf(2);
            txStack.push(tx);
            assert.equal(own, whitelistedUser);
        });

        // attemps user mint more than 3
        it("Whitelisted user cannot mint during presale more than 3", async () => {
            let tx= await ocean.mint(whitelistedUser, 5, HexProof(whitelistedUser), {
                from: whitelistedUser,
                value: toTokens("0.5"),
            }).catch((r) => {
                assert.ok('User was not able to mint more than allowed');
            });
            txStack.push(tx);
        });

        // attemps user mint
        it("Not whitelisted user cannot mint during presale", async() => {
            let tx = await ocean
                .mint(notWhitelistedUser, 1, HexProof(notWhitelistedUser), {
                    from: notWhitelistedUser,
                    value: toTokens("0.1"),
                })
                .then(() => {
                    assert.fail("notWhitelisted user should not have been able to mint");
                })
                .catch(r => {
                    assert.ok(
                        "During presale, not whitelisted user was not able to mint"
                    );
                    return r;
                });
            txStack.push(tx);
        });

        // Checks funds splitter balance
        it("Pool balance should be >= 0.1 ether", async () => {
            let bal = await web3.eth.getBalance(pool.address);
            assert.ok(bal >= toTokens("0.3"));
        });

        // attemps user mint invalid eth amount
        it("User cannot mint invalid amount", async () => {
            let tx = await ocean
                .mint(user, 1, { from:user, value: toTokens("0.05") })
                .then(() => {
                    assert.fail("User should not have been able to mint");
                })
                .catch(r => {
                    assert.ok("User was not able to mint with less eth amount");
                    return r;
                });
            txStack.push(tx);
        });

        // attemps Admin lock metadata
        it("lock metadata should fail if notRevealed", async () => {
            let tx = await ocean
                .lockMetadata({ from: owner })
                .then(() => {
                    assert.fail("owner shouldnt be able to lock metadata");
                })
                .catch(r => {
                    assert.ok("owner was not able to lock metadata");
                    return r;
                });
            txStack.push(tx);
        });

        // attempts Admin lock metadata
        it("Admin can lock metdata after reveal", async () => {
            let tx = await ocean.reveal({ from: owner });
            let revealed = await ocean.revealed();
            assert.ok(revealed);
            txStack.push(tx);

            tx = await ocean.lockMetadata({ from: owner});
            txStack.push(tx);
            let locked = await ocean.locked();
            assert.ok(locked);
        });

        // locked, cannot change base URI
        it("Locked, cannot change base URI", async () => {
            let tx = await ocean
                .changeBaseURI("ipfs://untesturl/", { from: owner })
                .then(() => {
                    assert.fail("owner shouldnt be able to change locked base URI");
                })
                .catch(r => {
                    assert.ok("owner was not abel to change locked base URI");
                    return r;
                });
            txStack.push(tx);
        });

        //locked, cannot change not Revealed URI
        it("Revealed, cannot change not revealed URI", async() => {
            let tx = await ocean
                .changeNotRevealedURI("ipfs://untesturl/10.json", {from: owner })
                .then(() => {
                    assert.fail("owner shouldnt be able to chagne revealed art uri");
                })
                .catch(r => {
                    assert.ok("owner was not able to change revealed art uri");
                    return r;
                });
            txStack.push(tx);
        });

    });

    describe("Changing Phase, public mint testing", async () => {
        // Change minting phase to public sale
        it("Minting phase change to public sale", async () => {
            let tx = await ocean
                .setPhase(1, toTokens("0.15"), 2, { from: owner })
                .catch(() => {
                    assert.fail("Could not update minting phase");
                });
            let phase = Number(await ocean.getPhase());
            let mintPrice = Number(await ocean._mintPrice(phase));
            txStack.push(tx);
            assert.equal(phase, 1);
            assert.equal(mintPrice, toTokens("0.15"));
        });

        // Attempts user mint during public sale
        it("Any user can mint during public sale", async () => {
            let tx = await ocean.mint(notWhitelistedUser, 1, [], {
                from: notWhitelistedUser,
                value: toTokens("0.15"),
            });
            txStack.push(tx);
            let own = await ocean.ownerOf(5);
            assert.equal(own, notWhitelistedUser);
        });

        // Change mint price only owner during public sale 
        it("Changing the minting price", async () => {
            let tx = await ocean.changeMintCost(toTokens("0.1"), { from: owner }).catch(() => {
                assert.fail("could not update minting price");
            });
            txStack.push(tx);
        });

        //Attempts user mint during public slae
        it("Any user can mint during public sale", async () => {
            let tx = await ocean.mint(notWhitelistedUser, 1, [], {
                from: notWhitelistedUser,
                value: toTokens("0.1"),
            });
            txStack.push(tx);
            let own = await ocean.ownerOf(6);
            assert.equal(own, notWhitelistedUser);
        });

    });
});