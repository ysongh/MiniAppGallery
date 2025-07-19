// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MiniAppGallery
 * @dev A smart contract for registering and managing Farcaster mini-apps with rating system
 */
contract MiniAppGallery {
    // Contract owner
    address public owner;
    
    // App structure
    struct App {
        uint256 id;
        string name;
        string description;
        string category;
        string appUrl;
        address developerAddress;
        bool isFeatured;
        uint256 registrationDate;
        bool isActive;
        uint256 totalRating;     // Sum of all ratings
        uint256 ratingCount;     // Number of ratings received
    }
    
    // Rating structure
    struct Rating {
        address user;
        uint256 value;          // 1-5
        string comment;
        uint256 timestamp;
    }
    
    // Store apps by ID
    mapping(uint256 => App) public apps;
    
    // Store app ratings
    mapping(uint256 => Rating[]) public appRatings;
    
    // Track user ratings
    mapping(uint256 => mapping(address => uint256)) public userRatingIndex;
    mapping(uint256 => mapping(address => bool)) public hasUserRated;

    mapping(address => uint256) public totalDonationsSent;
    
    // Mapping of developer addresses to their app IDs
    mapping(address => uint256[]) public developerApps;
    
    // Array of all app IDs
    uint256[] public allAppIds;
    
    // Featured app IDs
    uint256[] public featuredAppIds;
    
    // Category list
    string[] public categories;
    
    // Total apps counter
    uint256 public totalApps;

    // Platform fee
    uint256 public platformFeeRate = 0;
    
    // Events
    event AppRegistered(uint256 indexed appId, string name, address indexed developer);
    event AppUpdated(uint256 indexed appId, string name);
    event AppFeatured(uint256 indexed appId, bool isFeatured);
    event AppStatusChanged(uint256 indexed appId, bool isActive);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event CategoryAdded(string category);
    event RatingSubmitted(uint256 indexed appId, address indexed user, uint256 rating);
    event RatingUpdated(uint256 indexed appId, address indexed user, uint256 newRating);
    event DonationSent(uint256 indexed appId, address indexed from, address indexed to, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }
    
    modifier onlyAppDeveloper(uint256 _appId) {
        require(apps[_appId].developerAddress == msg.sender, "Only app developer can call");
        _;
    }
    
    modifier appExists(uint256 _appId) {
        require(_appId > 0 && _appId <= totalApps && apps[_appId].registrationDate > 0, "App does not exist");
        _;
    }
    
    modifier validRating(uint256 _rating) {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        _;
    }
    
    /**
     * @dev Constructor: initializes the contract
     */
    constructor() {
        owner = msg.sender;
        
        // Add default categories
        categories = ["Social", "Finance", "NFTs", "Games", "Developer Tools", 
                      "Communication", "Entertainment", "News", "Governance", "Shopping"];
    }
    
    /**
     * @dev Register a new app
     */
    function registerApp(
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _appUrl
    ) external {
        require(bytes(_name).length > 0, "Name empty");
        require(bytes(_description).length > 0, "Description empty");
        require(bytes(_category).length > 0, "Category empty");
        require(bytes(_appUrl).length > 0, "URL empty");
        
        totalApps++;
        
        apps[totalApps] = App({
            id: totalApps,
            name: _name,
            description: _description,
            category: _category,
            appUrl: _appUrl,
            developerAddress: msg.sender,
            isFeatured: false,
            registrationDate: block.timestamp,
            isActive: true,
            totalRating: 0,
            ratingCount: 0
        });
        
        developerApps[msg.sender].push(totalApps);
        allAppIds.push(totalApps);
        
        emit AppRegistered(totalApps, _name, msg.sender);
    }
    
    /**
     * @dev Submit a rating for an app
     */
    function rateApp(
        uint256 _appId, 
        uint256 _rating, 
        string memory _comment
    ) external appExists(_appId) validRating(_rating) {
        App storage app = apps[_appId];
        
        require(msg.sender != app.developerAddress, "Devs can't rate own apps");
        require(app.isActive, "App inactive");
        
        if (hasUserRated[_appId][msg.sender]) {
            uint256 index = userRatingIndex[_appId][msg.sender];
            uint256 oldRating = appRatings[_appId][index].value;
            
            appRatings[_appId][index].value = _rating;
            appRatings[_appId][index].comment = _comment;
            appRatings[_appId][index].timestamp = block.timestamp;
            
            app.totalRating = app.totalRating - oldRating + _rating;
            
            emit RatingUpdated(_appId, msg.sender, _rating);
        } else {
            appRatings[_appId].push(Rating({
                user: msg.sender,
                value: _rating,
                comment: _comment,
                timestamp: block.timestamp
            }));
            
            userRatingIndex[_appId][msg.sender] = appRatings[_appId].length - 1;
            hasUserRated[_appId][msg.sender] = true;
            
            app.totalRating += _rating;
            app.ratingCount++;
            
            emit RatingSubmitted(_appId, msg.sender, _rating);
        }
    }
    
    /**
     * @dev Get the average rating for an app
     * @return Average rating (0-5 with 2 decimal precision, multiplied by 100)
     */
    function getAverageRating(uint256 _appId) external view appExists(_appId) returns (uint256) {
        App memory app = apps[_appId];
        if (app.ratingCount == 0) return 0;
        return (app.totalRating * 100) / app.ratingCount;
    }
    
    /**
     * @dev Get all ratings for an app
     */
    function getAppRatings(uint256 _appId) external view appExists(_appId) returns (Rating[] memory) {
        return appRatings[_appId];
    }
    
    /**
     * @dev Get a user's rating for an app
     */
    function getUserRating(uint256 _appId, address _user) external view appExists(_appId) returns (Rating memory) {
        require(hasUserRated[_appId][_user], "User hasn't rated");
        return appRatings[_appId][userRatingIndex[_appId][_user]];
    }
    
    /**
     * @dev Update an existing app's details
     */
    function updateApp(
        uint256 _appId,
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _appUrl
    ) external appExists(_appId) onlyAppDeveloper(_appId) {
        require(bytes(_name).length > 0, "Name empty");
        require(bytes(_description).length > 0, "Description empty");
        require(bytes(_category).length > 0, "Category empty");
        require(bytes(_appUrl).length > 0, "URL empty");
        
        App storage app = apps[_appId];
        
        app.name = _name;
        app.description = _description;
        app.category = _category;
        app.appUrl = _appUrl;
        
        emit AppUpdated(_appId, _name);
    }
    
    /**
     * @dev Set app as featured or not (only owner)
     */
    function setAppFeatured(uint256 _appId, bool _isFeatured) external onlyOwner appExists(_appId) {
        App storage app = apps[_appId];
        
        if (app.isFeatured != _isFeatured) {
            app.isFeatured = _isFeatured;
            
            if (_isFeatured) {
                featuredAppIds.push(_appId);
            } else {
                // Remove from featured list
                for (uint256 i = 0; i < featuredAppIds.length; i++) {
                    if (featuredAppIds[i] == _appId) {
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
     * @dev Donate to a user who gave a good review (developer only)
     * @param _appId The app ID
     * @param _user The user address who wrote the review
     */
    function donateToReviewer(
        uint256 _appId, 
        address _user
    ) external payable appExists(_appId) onlyAppDeveloper(_appId) {
        require(_user != address(0), "Invalid user address");
        require(_user != msg.sender, "Can't donate to yourself");
        require(msg.value > 0, "Must send ETH");
        require(hasUserRated[_appId][_user], "User hasn't rated this app");
        
        // Calculate platform fee
        uint256 platformFee = (msg.value * platformFeeRate) / 10000;
        uint256 donationAmount = msg.value - platformFee;
        
        // Update totals
        totalDonationsSent[msg.sender] += donationAmount;
        
        // Transfer ETH to reviewer
        payable(_user).transfer(donationAmount);
        
        emit DonationSent(_appId, msg.sender, _user, donationAmount);
    }
    
    /**
     * @dev Set app active/inactive status (developer or owner)
     */
    function setAppStatus(uint256 _appId, bool _isActive) external appExists(_appId) {
        App storage app = apps[_appId];
        
        require(
            msg.sender == owner || msg.sender == app.developerAddress,
            "Only owner or developer"
        );
        
        app.isActive = _isActive;
        
        emit AppStatusChanged(_appId, _isActive);
    }
    
    /**
     * @dev Add a new category (only owner)
     */
    function addCategory(string memory _category) external onlyOwner {
        require(bytes(_category).length > 0, "Category empty");
        
        // Check if category exists
        for (uint256 i = 0; i < categories.length; i++) {
            if (keccak256(bytes(categories[i])) == keccak256(bytes(_category))) {
                revert("Category exists");
            }
        }
        
        categories.push(_category);
        emit CategoryAdded(_category);
    }
    
    /**
     * @dev Withdraw contract funds (only owner)
     */
    function withdraw(uint256 _amount) external onlyOwner {
        uint256 amount = _amount;
        
        if (amount == 0 || amount > address(this).balance) {
            amount = address(this).balance;
        }
        
        require(amount > 0, "Nothing to withdraw");
        
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }
    
    /**
     * @dev Transfer contract ownership (only owner)
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
    
    // View functions
    
    function getAllApps() external view returns (uint256[] memory) {
        return allAppIds;
    }
    
    function getFeaturedApps() external view returns (uint256[] memory) {
        return featuredAppIds;
    }
    
    function getAppsByDeveloper(address _developer) external view returns (uint256[] memory) {
        return developerApps[_developer];
    }
    
    /**
     * @dev Get apps by category
     */
    function getAppsByCategory(string memory _category) external view returns (uint256[] memory) {
        // Count apps in category first
        uint256 count = 0;
        for (uint256 i = 0; i < allAppIds.length; i++) {
            if (keccak256(bytes(apps[allAppIds[i]].category)) == keccak256(bytes(_category))) {
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < allAppIds.length; i++) {
            if (keccak256(bytes(apps[allAppIds[i]].category)) == keccak256(bytes(_category))) {
                result[resultIndex] = allAppIds[i];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get top-rated apps (limited to specified count)
     */
    function getTopRatedApps(uint256 _count) external view returns (uint256[] memory) {
        uint256 resultCount = _count;
        if (resultCount > totalApps) {
            resultCount = totalApps;
        }
        
        // Arrays for sorting
        uint256[] memory appIds = new uint256[](totalApps);
        uint256[] memory ratings = new uint256[](totalApps);
        
        // Fill with app IDs and ratings
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allAppIds.length; i++) {
            uint256 appId = allAppIds[i];
            App memory app = apps[appId];
            
            if (app.isActive && app.ratingCount > 0) {
                appIds[activeCount] = appId;
                ratings[activeCount] = (app.totalRating * 100) / app.ratingCount;
                activeCount++;
            }
        }
        
        if (resultCount > activeCount) {
            resultCount = activeCount;
        }
        
        // Sort by rating (bubble sort)
        for (uint256 i = 0; i < activeCount; i++) {
            for (uint256 j = i + 1; j < activeCount; j++) {
                if (ratings[j] > ratings[i]) {
                    // Swap ratings
                    uint256 tempRating = ratings[i];
                    ratings[i] = ratings[j];
                    ratings[j] = tempRating;
                    
                    // Swap app IDs
                    uint256 tempId = appIds[i];
                    appIds[i] = appIds[j];
                    appIds[j] = tempId;
                }
            }
        }
        
        // Create result with top N apps
        uint256[] memory result = new uint256[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = appIds[i];
        }
        
        return result;
    }
    
    function getAllCategories() external view returns (string[] memory) {
        return categories;
    }
    
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
    
    function getAppDetails(uint256 _appId) external view appExists(_appId) returns (App memory) {
        return apps[_appId];
    }
}
