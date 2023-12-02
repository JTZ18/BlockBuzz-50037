// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";

import {ERC725YEnumerableSetUtil} from "./utils/ERC725YEnumerableSetUtil.sol";
import {IProfileData} from "./interfaces/IProfileData.sol";

import "./utils/BlockBuzzConstants.sol";

 /**
 * @title Profile Data Implementation
 * @dev Implements profile data linked to a universal profile. 
 * This separate storage design prevents data manipulation by universal profile owners 
 * and reduces gas costs by avoiding intermediary KeyManager verification. 
 * It also simplifies user onboarding by requiring only CALL permission for the managing contract 
 * and confirms successful registration through the existence of a ProfileData contract instance. 
 * No validation modifiers are necessary as validation is handled in the managing contract.
 */
contract ProfileData is
    IProfileData,
    ERC725YEnumerableSetUtil
{
    address public profile; // Universal profile
    uint public timestamp;

    /**
     * @dev Initializes the profile data contract.
     * @param _ownerAddress Owner of the profile data
     * @param _profileAddress Profile linked to this profile data
     */
    constructor(address _ownerAddress, address _profileAddress)
        ERC725YEnumerableSetUtil(_ownerAddress)
    {
        profile = _profileAddress;
        timestamp = block.timestamp;
    }

    /**
     * @inheritdoc IProfileData
     */
    function isProfileOf(address _postAddress) external view returns (bool) {
        return isAddressInEnumerableSet(_POSTS_MAP_KEY, _postAddress);
    }

    /**
     * @inheritdoc IProfileData
     */
    function addPost(address _postAddress) external onlyOwner {
        addElementToEnumerableSet(
            _POSTS_MAP_KEY,
            _POSTS_ARRAY_KEY,
            _postAddress
        );
    }

    /**
     * @inheritdoc IProfileData
     */
    function hasLiked(address _postAddress) external view returns (bool) {
        return isAddressInEnumerableSet(_LIKES_MAP_KEY, _postAddress);
    }

    /**
     * @inheritdoc IProfileData
     */
    function addLike(address _postAddress) external onlyOwner {
        addElementToEnumerableSet(
            _LIKES_MAP_KEY,
            _LIKES_ARRAY_KEY,
            _postAddress
        );
    }

    /**
     * @inheritdoc IProfileData
     */
    function removeLike(address _postAddress) external onlyOwner {
        removeElementFromEnumerableSet(
            _LIKES_MAP_KEY,
            _LIKES_ARRAY_KEY,
            _postAddress
        );
    }

    /**
     * @inheritdoc IProfileData
     */
    function isFollowedBy(address _profileAddress) external view returns (bool) {
        return isAddressInEnumerableSet(_FOLLOWERS_MAP_KEY, _profileAddress);
    }

    /**
     * @inheritdoc IProfileData
     */
    function addFollower(address _profileAddress) external onlyOwner {
        addElementToEnumerableSet(
            _FOLLOWERS_MAP_KEY,
            _FOLLOWERS_ARRAY_KEY,
            _profileAddress
        );
    }

    /**
     * @inheritdoc IProfileData
     */
    function removeFollower(address _profileAddress) external onlyOwner {
        removeElementFromEnumerableSet(
            _FOLLOWERS_MAP_KEY,
            _FOLLOWERS_ARRAY_KEY,
            _profileAddress
        );
    }

    /**
     * @inheritdoc IProfileData
     */
    function isFollowerOf(address _profileAddress) external view returns (bool) {
        return isAddressInEnumerableSet(_FOLLOWING_MAP_KEY, _profileAddress);
    }

    /**
     * @inheritdoc IProfileData
     */
    function addFollowing(address _profileAddress) external onlyOwner {
        addElementToEnumerableSet(
            _FOLLOWING_MAP_KEY,
            _FOLLOWING_ARRAY_KEY,
            _profileAddress
        );
    }

    /**
     * @inheritdoc IProfileData
     */
    function removeFollowing(address _profileAddress) external onlyOwner {
        removeElementFromEnumerableSet(
            _FOLLOWING_MAP_KEY,
            _FOLLOWING_ARRAY_KEY,
            _profileAddress
        );
    }

    /**
     * @inheritdoc ERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, ERC725YCore)
        returns (bool)
    {
        return
            interfaceId == _INTERFACEID_PROFILE_DATA ||
            super.supportsInterface(interfaceId);
    }
}
