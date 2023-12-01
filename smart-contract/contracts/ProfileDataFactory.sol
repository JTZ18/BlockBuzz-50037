pragma solidity ^0.8.9;

import {ProfileData} from "./ProfileData.sol";

/**
 * @title ProfileData Contract Instance Factory
 * @dev Facilitates the creation of new ProfileData contract instances. 
 * This library provides a method to generate individual ProfileData contracts, each linked to a specific user and owned by a specified contract.
 */
library ProfileDataFactory {
    /**
     * @notice Deploys a new ProfileData contract
     * @dev Creates a ProfileData instance, assigning it to a user and setting its owner.
     * @param _owner Address of the owning contract (usually a social media or identity management contract)
     * @param _user Address of the user linked to this profile data
     * @return address Address of the newly created ProfileData contract
     */
    function createProfileData(
        address _owner,
        address _user
    ) public returns (address) {
        return
            address(
                new ProfileData(
                    _owner,
                    _user
                )
            );
    }
}


