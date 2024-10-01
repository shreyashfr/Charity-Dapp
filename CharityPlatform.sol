// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityPlatform {
    struct Charity {
        address payable charityAddress;
        string name;
        string description;
        uint256 goalAmount;
        uint256 currentAmount;
        bool isActive;
    }

    mapping(uint256 => Charity) public charities;
    uint256 public charityCount;

    event CharityRegistered(uint256 charityId, string name, uint256 goalAmount);
    event DonationReceived(uint256 charityId, address donor, uint256 amount);
    event FundsReleased(uint256 charityId, uint256 amount);

    function registerCharity(string memory _name, string memory _description, uint256 _goalAmount) external {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        
        charityCount++;
        charities[charityCount] = Charity({
            charityAddress: payable(msg.sender),
            name: _name,
            description: _description,
            goalAmount: _goalAmount,
            currentAmount: 0,
            isActive: true
        });

        emit CharityRegistered(charityCount, _name, _goalAmount);
    }

    function donate(uint256 _charityId) external payable {
        Charity storage charity = charities[_charityId];
        require(charity.isActive, "Charity is not active");
        require(msg.value > 0, "Donation amount must be greater than 0");

        charity.currentAmount += msg.value;
        emit DonationReceived(_charityId, msg.sender, msg.value);

        if (charity.currentAmount >= charity.goalAmount) {
            charity.isActive = false;
            releaseFunds(_charityId);
        }
    }

    function releaseFunds(uint256 _charityId) internal {
        Charity storage charity = charities[_charityId];
        uint256 amount = charity.currentAmount;
        charity.currentAmount = 0;
        charity.charityAddress.transfer(amount);
        emit FundsReleased(_charityId, amount);
    }

    function getCharityDetails(uint256 _charityId) external view returns (
        address charityAddress,
        string memory name,
        string memory description,
        uint256 goalAmount,
        uint256 currentAmount,
        bool isActive
    ) {
        Charity storage charity = charities[_charityId];
        return (
            charity.charityAddress,
            charity.name,
            charity.description,
            charity.goalAmount,
            charity.currentAmount,
            charity.isActive
        );
    }
}