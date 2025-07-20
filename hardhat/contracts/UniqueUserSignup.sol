// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {AttestationId} from "@selfxyz/contracts/contracts/constants/AttestationId.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UniqueUserSignup
 * @dev A contract that ensures user uniqueness during sign-up using Self SDK verification
 * Prevents duplicate registrations by tracking verified user identifiers
 */
contract UniqueUserSignup is SelfVerificationRoot, Ownable {
    
    // Configuration ID for Self verification
    bytes32 public configId;
    
    // Mapping to track registered users by their verified identifier
    mapping(uint256 => bool) public registeredUsers;
    
    // Mapping to track user addresses by their verified identifier
    mapping(uint256 => address) public userAddresses;
    
    // Mapping to track verified identifier by user address
    mapping(address => uint256) public addressToIdentifier;
    
    // Counter for total registered users
    uint256 public totalRegisteredUsers;
    
    // Events
    event UserRegistered(
        address indexed userAddress,
        uint256 indexed userIdentifier,
        string name,
        string nationality,
        uint256 timestamp
    );
    
    event ConfigIdUpdated(bytes32 oldConfigId, bytes32 newConfigId);
    
    // Errors
    error UserAlreadyRegistered(uint256 userIdentifier);
    error AddressAlreadyRegistered(address userAddress);
    error ConfigIdNotSet();
    error InvalidUserData();
    
    constructor(
        address _identityVerificationHubV2, // V2 Hub address
        uint256 _scope // Application-specific scope identifier
    )
        SelfVerificationRoot(_identityVerificationHubV2, _scope)
        Ownable(msg.sender)
    {}
    
    /**
     * @dev Required override to provide configId for verification
     * @param destinationChainId Chain ID where verification occurs
     * @param userIdentifier User's unique identifier
     * @param userDefinedData Custom data from QR code configuration
     * @return bytes32 The configuration ID
     */
    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier,
        bytes memory userDefinedData
    ) public view override returns (bytes32) {
        if (configId == bytes32(0)) {
            revert ConfigIdNotSet();
        }
        return configId;
    }
    
    /**
     * @dev Override to handle successful verification and ensure uniqueness
     * @param output Verified user data from Self SDK
     * @param userData Additional user-provided data
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal virtual override {
        // Handle name field (known to be string[])
        string memory userName;
        if (output.name.length > 0) {
            userName = output.name[0];
        }
        
        // For now, skip nationality validation until we confirm its structure
        // You can uncomment and modify based on the actual field type:
        // string memory userNationality = output.nationality; // if it's string
        // string memory userNationality = output.nationality[0]; // if it's string[]
        
        // Basic validation - at least check that we have a name
        if (bytes(userName).length == 0) {
            revert InvalidUserData();
        }
        
        // Check if user identifier is already registered
        if (registeredUsers[output.userIdentifier]) {
            revert UserAlreadyRegistered(output.userIdentifier);
        }
        
        // Check if the current address is already associated with a different identifier
        if (addressToIdentifier[msg.sender] != 0) {
            revert AddressAlreadyRegistered(msg.sender);
        }
        
        // Register the user
        registeredUsers[output.userIdentifier] = true;
        userAddresses[output.userIdentifier] = msg.sender;
        addressToIdentifier[msg.sender] = output.userIdentifier;
        totalRegisteredUsers++;
        
        // Emit registration event (using empty string for nationality for now)
        emit UserRegistered(
            msg.sender,
            output.userIdentifier,
            userName,
            "", // nationality placeholder
            block.timestamp
        );
        
        // Execute any additional custom logic
        _onUserRegistered(output, userData);
    }
    
    /**
     * @dev Internal function for additional custom logic after registration
     * Can be overridden in derived contracts for specific business logic
     * @param output Verified user data
     * @param userData Additional user data
     */
    function _onUserRegistered(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal virtual {
        // Override in derived contracts for custom logic
        // Examples: mint NFT, allocate tokens, grant access, etc.
    }
    
    /**
     * @dev Set the configuration ID (only owner)
     * @param _configId The new configuration ID from Self Configuration Tools
     */
    function setConfigId(bytes32 _configId) external onlyOwner {
        bytes32 oldConfigId = configId;
        configId = _configId;
        emit ConfigIdUpdated(oldConfigId, _configId);
    }
    
    /**
     * @dev Update the scope (only owner)
     * @param _scope The new scope value
     */
    function setScope(uint256 _scope) external onlyOwner {
        _setScope(_scope);
    }
    
    /**
     * @dev Check if a user identifier is already registered
     * @param userIdentifier The user identifier to check
     * @return bool True if registered, false otherwise
     */
    function isUserRegistered(uint256 userIdentifier) external view returns (bool) {
        return registeredUsers[userIdentifier];
    }
    
    /**
     * @dev Get the address associated with a user identifier
     * @param userIdentifier The user identifier
     * @return address The associated address (zero address if not found)
     */
    function getUserAddress(uint256 userIdentifier) external view returns (address) {
        return userAddresses[userIdentifier];
    }
    
    /**
     * @dev Get the user identifier associated with an address
     * @param userAddress The user address
     * @return uint256 The associated identifier (zero if not found)
     */
    function getUserIdentifier(address userAddress) external view returns (uint256) {
        return addressToIdentifier[userAddress];
    }
    
    /**
     * @dev Check if the calling address is registered
     * @return bool True if registered, false otherwise
     */
    function isCurrentUserRegistered() external view returns (bool) {
        return addressToIdentifier[msg.sender] != 0;
    }
    
    /**
     * @dev Emergency function to remove a registered user (only owner)
     * Use with caution - this is for handling edge cases or disputes
     * @param userIdentifier The user identifier to remove
     */
    function removeUser(uint256 userIdentifier) external onlyOwner {
        require(registeredUsers[userIdentifier], "User not registered");
        
        address userAddress = userAddresses[userIdentifier];
        
        // Clean up all mappings
        registeredUsers[userIdentifier] = false;
        delete userAddresses[userIdentifier];
        delete addressToIdentifier[userAddress];
        
        if (totalRegisteredUsers > 0) {
            totalRegisteredUsers--;
        }
    }
}
