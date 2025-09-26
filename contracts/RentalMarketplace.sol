// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RentalMarketplace {
    struct Property {
        uint256 id;
        string title;
        string description;
        uint256 pricePerDay;
        string location;
        address owner;
        bool isAvailable;
        string propertyType;
        uint256 bedrooms;
        uint256 bathrooms;
        uint256 area;
        uint256 createdAt;
    }

    struct RentalAgreement {
        uint256 id;
        uint256 propertyId;
        address tenant;
        address landlord;
        uint256 startDate;
        uint256 endDate;
        uint256 totalPrice;
        uint256 securityDeposit;
        RentalStatus status;
        uint256 createdAt;
    }

    enum RentalStatus {
        Pending,
        Active,
        Completed,
        Cancelled
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => RentalAgreement) public rentalAgreements;
    mapping(address => uint256[]) public userProperties;
    mapping(address => uint256[]) public userRentals;

    uint256 public nextPropertyId = 1;
    uint256 public nextRentalId = 1;

    event PropertyListed(uint256 indexed propertyId, address indexed owner, uint256 pricePerDay);
    event PropertyUpdated(uint256 indexed propertyId, bool isAvailable);
    event RentalRequested(uint256 indexed rentalId, uint256 indexed propertyId, address indexed tenant);
    event RentalConfirmed(uint256 indexed rentalId, address indexed landlord);
    event RentalCompleted(uint256 indexed rentalId);

    modifier onlyPropertyOwner(uint256 _propertyId) {
        require(properties[_propertyId].owner == msg.sender, "Not the property owner");
        _;
    }

    modifier propertyExists(uint256 _propertyId) {
        require(properties[_propertyId].id != 0, "Property does not exist");
        _;
    }

    function listProperty(
        string memory _title,
        string memory _description,
        uint256 _pricePerDay,
        string memory _location,
        string memory _propertyType,
        uint256 _bedrooms,
        uint256 _bathrooms,
        uint256 _area
    ) external returns (uint256) {
        uint256 propertyId = nextPropertyId++;
        
        properties[propertyId] = Property({
            id: propertyId,
            title: _title,
            description: _description,
            pricePerDay: _pricePerDay,
            location: _location,
            owner: msg.sender,
            isAvailable: true,
            propertyType: _propertyType,
            bedrooms: _bedrooms,
            bathrooms: _bathrooms,
            area: _area,
            createdAt: block.timestamp
        });

        userProperties[msg.sender].push(propertyId);

        emit PropertyListed(propertyId, msg.sender, _pricePerDay);
        return propertyId;
    }

    function updatePropertyAvailability(uint256 _propertyId, bool _isAvailable) 
        external 
        onlyPropertyOwner(_propertyId) 
        propertyExists(_propertyId) 
    {
        properties[_propertyId].isAvailable = _isAvailable;
        emit PropertyUpdated(_propertyId, _isAvailable);
    }

    function requestRental(
        uint256 _propertyId,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _securityDeposit
    ) external payable propertyExists(_propertyId) {
        Property storage property = properties[_propertyId];
        require(property.isAvailable, "Property is not available");
        require(_startDate > block.timestamp, "Start date must be in the future");
        require(_endDate > _startDate, "End date must be after start date");
        require(msg.sender != property.owner, "Cannot rent your own property");

        uint256 rentalId = nextRentalId++;
        uint256 totalPrice = calculateTotalPrice(_propertyId, _startDate, _endDate);

        rentalAgreements[rentalId] = RentalAgreement({
            id: rentalId,
            propertyId: _propertyId,
            tenant: msg.sender,
            landlord: property.owner,
            startDate: _startDate,
            endDate: _endDate,
            totalPrice: totalPrice,
            securityDeposit: _securityDeposit,
            status: RentalStatus.Pending,
            createdAt: block.timestamp
        });

        userRentals[msg.sender].push(rentalId);

        emit RentalRequested(rentalId, _propertyId, msg.sender);
    }

    function confirmRental(uint256 _rentalId) external {
        RentalAgreement storage rental = rentalAgreements[_rentalId];
        require(rental.landlord == msg.sender, "Not the landlord");
        require(rental.status == RentalStatus.Pending, "Rental is not pending");

        rental.status = RentalStatus.Active;
        properties[rental.propertyId].isAvailable = false;

        emit RentalConfirmed(_rentalId, msg.sender);
    }

    function completeRental(uint256 _rentalId) external {
        RentalAgreement storage rental = rentalAgreements[_rentalId];
        require(
            rental.landlord == msg.sender || rental.tenant == msg.sender,
            "Not authorized"
        );
        require(rental.status == RentalStatus.Active, "Rental is not active");
        require(block.timestamp >= rental.endDate, "Rental period not ended");

        rental.status = RentalStatus.Completed;
        properties[rental.propertyId].isAvailable = true;

        emit RentalCompleted(_rentalId);
    }

    function calculateTotalPrice(
        uint256 _propertyId,
        uint256 _startDate,
        uint256 _endDate
    ) public view propertyExists(_propertyId) returns (uint256) {
        uint256 duration = _endDate - _startDate;
        uint256 days = duration / 1 days;
        return days * properties[_propertyId].pricePerDay;
    }

    function getUserProperties(address _user) external view returns (uint256[] memory) {
        return userProperties[_user];
    }

    function getUserRentals(address _user) external view returns (uint256[] memory) {
        return userRentals[_user];
    }

    function getProperty(uint256 _propertyId) external view propertyExists(_propertyId) returns (Property memory) {
        return properties[_propertyId];
    }

    function getRentalAgreement(uint256 _rentalId) external view returns (RentalAgreement memory) {
        require(rentalAgreements[_rentalId].id != 0, "Rental agreement does not exist");
        return rentalAgreements[_rentalId];
    }
}
