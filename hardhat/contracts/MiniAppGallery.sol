// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MiniAppGallery
 * @dev A smart contract for registering and managing Farcaster mini-apps
 */
contract MiniAppGallery {
    // Contract owner
    address public owner;
    
    // App registration fee in wei
    uint256 public registrationFee = 0.01 ether;
    
    // App structure
    struct App {
        uint256 id;
        string name;
        string description;
        string developer;
        string category;
        string appUrl;
        string iconUrl;
        address developerAddress;
        bool isFeatured;
        uint256 registrationDate;
        bool isActive;
    }
    
    // Store apps by ID
    mapping(uint256 => App) public apps;
    
    // Mapping of developer addresses to their app IDs
    mapping(address => uint256[]) public developerApps;
    
    // Array of all app IDs
    uint256[] public allAppIds;
    
    // Featured app IDs
    uint256[] public featuredAppIds;
    
    // Category list
    string[] public categories;
    
    // Total apps counter (also used as ID generator)
    uint256 public totalApps;
    
    // Events
    event AppRegistered(uint256 indexed appId, string name, address indexed developer);
    event AppUpdated(uint256 indexed appId, string name);
    event AppFeatured(uint256 indexed appId, bool isFeatured);
    event AppStatusChanged(uint256 indexed appId, bool isActive);
    event FeeUpdated(uint256 newFee);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event CategoryAdded(string category);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
    
    modifier onlyAppDeveloper(uint256 _appId) {
        require(apps[_appId].developerAddress == msg.sender, "Only the app developer can call this function");
        _;
    }
    
    modifier appExists(uint256 _appId) {
        require(_appId > 0 && _appId <= totalApps, "App does not exist");
        require(apps[_appId].registrationDate > 0, "App does not exist");
        _;
    }
    
    /**
     * @dev Constructor: initializes the contract with default categories
     */
    constructor() {
        owner = msg.sender;
        
        // Add default categories
        categories.push("Social");
        categories.push("Finance");
        categories.push("NFTs");
        categories.push("Games");
        categories.push("Developer Tools");
        categories.push("Communication");
        categories.push("Entertainment");
        categories.push("News");
        categories.push("Governance");
        categories.push("Shopping");
    }
    
    /**
     * @dev Register a new app
     * @param _name App name
     * @param _description App description
     * @param _developer Developer name
     * @param _category App category
     * @param _appUrl App URL
     * @param _iconUrl App icon URL
     */
    function registerApp(
        string memory _name,
        string memory _description,
        string memory _developer,
        string memory _category,
        string memory _appUrl,
        string memory _iconUrl
    ) external payable {
        require(bytes(_name).length > 0, "App name cannot be empty");
        require(bytes(_description).length > 0, "App description cannot be empty");
        require(bytes(_developer).length > 0, "Developer name cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");
        require(bytes(_appUrl).length > 0, "App URL cannot be empty");
        require(msg.value >= registrationFee, "Insufficient registration fee");
        
        // Increment app counter
        totalApps++;
        
        // Create new app
        App memory newApp = App({
            id: totalApps,
            name: _name,
            description: _description,
            developer: _developer,
            category: _category,
            appUrl: _appUrl,
            iconUrl: _iconUrl,
            developerAddress: msg.sender,
            isFeatured: false,
            registrationDate: block.timestamp,
            isActive: true
        });
        
        // Store app
        apps[totalApps] = newApp;
        
        // Add to developer's apps
        developerApps[msg.sender].push(totalApps);
        
        // Add to all apps
        allAppIds.push(totalApps);
        
        // Emit event
        emit AppRegistered(totalApps, _name, msg.sender);
        
        // Return excess payment if any
        uint256 excessPayment = msg.value - registrationFee;
        if (excessPayment > 0) {
            payable(msg.sender).transfer(excessPayment);
        }
    }
    
    /**
     * @dev Update an existing app's details
     * @param _appId ID of the app to update
     * @param _name Updated app name
     * @param _description Updated app description
     * @param _developer Updated developer name
     * @param _category Updated app category
     * @param _appUrl Updated app URL
     * @param _iconUrl Updated app icon URL
     */
    function updateApp(
        uint256 _appId,
        string memory _name,
        string memory _description,
        string memory _developer,
        string memory _category,
        string memory _appUrl,
        string memory _iconUrl
    ) external appExists(_appId) onlyAppDeveloper(_appId) {
        require(bytes(_name).length > 0, "App name cannot be empty");
        require(bytes(_description).length > 0, "App description cannot be empty");
        require(bytes(_developer).length > 0, "Developer name cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");
        require(bytes(_appUrl).length > 0, "App URL cannot be empty");
        
        App storage app = apps[_appId];
        
        app.name = _name;
        app.description = _description;
        app.developer = _developer;
        app.category = _category;
        app.appUrl = _appUrl;
        app.iconUrl = _iconUrl;
        
        emit AppUpdated(_appId, _name);
    }
    
    /**
     * @dev Set app as featured or not (only owner)
     * @param _appId ID of the app
     * @param _isFeatured Whether the app should be featured
     */
    function setAppFeatured(uint256 _appId, bool _isFeatured) external onlyOwner appExists(_appId) {
        App storage app = apps[_appId];
        
        // Only process if status is changing
        if (app.isFeatured != _isFeatured) {
            app.isFeatured = _isFeatured;
            
            // Update featured apps list
            if (_isFeatured) {
                featuredAppIds.push(_appId);
            } else {
                // Remove from featured list
                for (uint256 i = 0; i < featuredAppIds.length; i++) {
                    if (featuredAppIds[i] == _appId) {
                        // Replace with last element and pop
                        featuredAppIds[i] = featuredAppIds[featuredAppIds.length - 1];
                        featuredAppIds.pop();
                        break;
                    }
                }
            }
            
            emit AppFeatured(_appId, _isFeatured);
        }
    }
    
    /**
     * @dev Set app active/inactive status (developer or owner)
     * @param _appId ID of the app
     * @param _isActive Whether the app should be active
     */
    function setAppStatus(uint256 _appId, bool _isActive) external appExists(_appId) {
        App storage app = apps[_appId];
        
        // Only owner or app developer can change status
        require(
            msg.sender == owner || msg.sender == app.developerAddress,
            "Only owner or developer can change app status"
        );
        
        app.isActive = _isActive;
        
        emit AppStatusChanged(_appId, _isActive);
    }
    
    /**
     * @dev Add a new category (only owner)
     * @param _category Name of the new category
     */
    function addCategory(string memory _category) external onlyOwner {
        require(bytes(_category).length > 0, "Category cannot be empty");
        
        // Check if category already exists
        bool categoryExists = false;
        for (uint256 i = 0; i < categories.length; i++) {
            if (keccak256(bytes(categories[i])) == keccak256(bytes(_category))) {
                categoryExists = true;
                break;
            }
        }
        
        require(!categoryExists, "Category already exists");
        
        categories.push(_category);
        emit CategoryAdded(_category);
    }
    
    /**
     * @dev Update registration fee (only owner)
     * @param _newFee New registration fee in wei
     */
    function updateRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
        emit FeeUpdated(_newFee);
    }
    
    /**
     * @dev Withdraw contract funds (only owner)
     * @param _amount Amount to withdraw (0 for all)
     */
    function withdraw(uint256 _amount) external onlyOwner {
        uint256 amount = _amount;
        
        // If amount is 0 or greater than balance, withdraw all
        if (amount == 0 || amount > address(this).balance) {
            amount = address(this).balance;
        }
        
        require(amount > 0, "Nothing to withdraw");
        
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }
    
    /**
     * @dev Transfer contract ownership (only owner)
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
    
    /**
     * @dev Get all apps
     * @return Array of all app IDs
     */
    function getAllApps() external view returns (uint256[] memory) {
        return allAppIds;
    }
    
    /**
     * @dev Get featured apps
     * @return Array of featured app IDs
     */
    function getFeaturedApps() external view returns (uint256[] memory) {
        return featuredAppIds;
    }
    
    /**
     * @dev Get apps by developer
     * @param _developer Developer address
     * @return Array of app IDs by the developer
     */
    function getAppsByDeveloper(address _developer) external view returns (uint256[] memory) {
        return developerApps[_developer];
    }
    
    /**
     * @dev Get apps by category
     * @param _category Category to filter by
     * @return Array of app IDs in the specified category
     */
    function getAppsByCategory(string memory _category) external view returns (uint256[] memory) {
        // Count apps in category first
        uint256 count = 0;
        for (uint256 i = 0; i < allAppIds.length; i++) {
            if (keccak256(bytes(apps[allAppIds[i]].category)) == keccak256(bytes(_category))) {
                count++;
            }
        }
        
        // Create result array
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        // Fill result array
        for (uint256 i = 0; i < allAppIds.length; i++) {
            if (keccak256(bytes(apps[allAppIds[i]].category)) == keccak256(bytes(_category))) {
                result[resultIndex] = allAppIds[i];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get all categories
     * @return Array of all categories
     */
    function getAllCategories() external view returns (string[] memory) {
        return categories;
    }
    
    /**
     * @dev Get contract balance (only owner)
     * @return Contract balance in wei
     */
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get detailed app information
     * @param _appId ID of the app
     * @return App detailed information
     */
    function getAppDetails(uint256 _appId) external view appExists(_appId) returns (App memory) {
        return apps[_appId];
    }
}
