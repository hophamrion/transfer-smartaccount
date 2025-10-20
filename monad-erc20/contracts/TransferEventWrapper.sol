// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TransferEventWrapper
 * @dev Contract to emit transfer events for Smart Account transfers
 * This allows Envio to index only relevant transfer events instead of all UserOperations
 */
contract TransferEventWrapper {
    
    // Events for different types of transfers
    event TransferExecuted(
        address indexed smartAccount,
        address indexed to,
        uint256 value,
        string transferType, // "native" or "erc20"
        address tokenAddress, // address(0) for native transfers
        uint256 timestamp,
        bytes32 indexed userOpHash
    );
    
    event BatchTransferExecuted(
        address indexed smartAccount,
        uint256 recipientCount,
        uint256 totalValue,
        string transferType,
        address tokenAddress,
        uint256 timestamp,
        bytes32 indexed userOpHash
    );
    
    event TransferFailed(
        address indexed smartAccount,
        address indexed to,
        uint256 value,
        string transferType,
        address tokenAddress,
        string reason,
        uint256 timestamp,
        bytes32 indexed userOpHash
    );
    
    // Modifier to ensure only Smart Accounts can call
    modifier onlySmartAccount() {
        require(msg.sender.code.length > 0, "Only Smart Accounts allowed");
        _;
    }
    
    /**
     * @dev Emit event for native MON transfer
     * @param to Recipient address
     * @param value Amount to transfer
     * @param userOpHash UserOperation hash for tracking
     */
    function emitNativeTransferEvent(
        address to,
        uint256 value,
        bytes32 userOpHash
    ) external onlySmartAccount {
        emit TransferExecuted(
            msg.sender, // Smart Account address
            to,
            value,
            "native",
            address(0), // address(0) for native transfers
            block.timestamp,
            userOpHash
        );
    }
    
    /**
     * @dev Emit event for ERC-20 token transfer
     * @param token Token contract address
     * @param to Recipient address
     * @param value Amount to transfer
     * @param userOpHash UserOperation hash for tracking
     */
    function emitERC20TransferEvent(
        address token,
        address to,
        uint256 value,
        bytes32 userOpHash
    ) external onlySmartAccount {
        emit TransferExecuted(
            msg.sender, // Smart Account address
            to,
            value,
            "erc20",
            token,
            block.timestamp,
            userOpHash
        );
    }
    
    /**
     * @dev Emit event for batch transfer
     * @param recipients Array of recipient addresses
     * @param values Array of amounts
     * @param transferType "native" or "erc20"
     * @param tokenAddress Token address (address(0) for native)
     * @param userOpHash UserOperation hash for tracking
     */
    function emitBatchTransferEvent(
        address[] calldata recipients,
        uint256[] calldata values,
        string calldata transferType,
        address tokenAddress,
        bytes32 userOpHash
    ) external onlySmartAccount {
        require(recipients.length == values.length, "Arrays length mismatch");
        require(recipients.length > 0, "No recipients");
        
        uint256 totalValue = 0;
        for (uint256 i = 0; i < values.length; i++) {
            totalValue += values[i];
        }
        
        emit BatchTransferExecuted(
            msg.sender, // Smart Account address
            recipients.length,
            totalValue,
            transferType,
            tokenAddress,
            block.timestamp,
            userOpHash
        );
    }
    
    /**
     * @dev Emit event for failed transfer
     * @param to Recipient address
     * @param value Amount that failed to transfer
     * @param transferType "native" or "erc20"
     * @param tokenAddress Token address
     * @param reason Failure reason
     * @param userOpHash UserOperation hash for tracking
     */
    function emitTransferFailedEvent(
        address to,
        uint256 value,
        string calldata transferType,
        address tokenAddress,
        string calldata reason,
        bytes32 userOpHash
    ) external onlySmartAccount {
        emit TransferFailed(
            msg.sender, // Smart Account address
            to,
            value,
            transferType,
            tokenAddress,
            reason,
            block.timestamp,
            userOpHash
        );
    }
    
    /**
     * @dev Get contract version
     * @return version Contract version string
     */
    function getVersion() external pure returns (string memory) {
        return "1.0.0";
    }
    
    /**
     * @dev Check if address is a Smart Account
     * @param account Address to check
     * @return isSmartAccount True if address has code (is a contract)
     */
    function isSmartAccount(address account) external view returns (bool) {
        return account.code.length > 0;
    }
}
