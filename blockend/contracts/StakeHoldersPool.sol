// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice Payment Splitter
import "../node_modules/@openzeppelin/contracts/finance/PaymentSplitter.sol";

/// @title OceanSix721 Funds and Royalties Splitter 
/// @notice Split Ether payments amoung a group of accounts
/// @author cryptoware.eth | Ocean6

contract StakeHoldersPool is PaymentSplitter {
    /// @notice Creates an instance of 'PaymentSplitter' where each account in 'payees' is assigned the number of shares at the matching 
    /// positions in the 'shares' array
    /// @param payees accounts to be paid
    /// @param shares_ funds share for each account

    constructor(address[] memory payees, uint256[] memory shares_)
        PaymentSplitter(payees, shares_)
    {}

    function getDuePayment(address account) external view returns (uint256) {
        return ((address(this).balance + totalReleased()) * shares(account)) / totalShares() - released(account);
    }
}
