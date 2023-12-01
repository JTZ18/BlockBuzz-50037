pragma solidity ^0.8.9;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";

/**
 * @title Profile Data Interface
 * @dev Describes the profile data linked to a universal profile. Separate storage offers several advantages:
 * - Protects against data manipulation by universal profile owners.
 * - Reduces gas costs by avoiding the KeyManager.
 * - Simplifies user onboarding by requiring only CALL permission for the managing contract.
 * - Presence of ProfileData instance implies successful registration.
 */
interface IProfileData is IERC165, IERC725Y {
    /**
     * @notice Gets the address of the linked user profile
     */
    function user() external view returns (address);

    /**
     * @notice Gets the timestamp of profile creation
     */
    function timestamp() external view returns (uint);

    /**
     * @notice Determines if the profile authored a specific post
     * @param _postAddress Address of the post to check
     */
    function isAuthorOf(address _postAddress) external view returns (bool);

    /**
     * @notice Associates a new post with the profile
     * @param _postAddress Address of the new post
     */
    function addPost(address _postAddress) external;

    /**
     * @notice Checks if the profile has liked a specific post
     * @param _postAddress Address of the post to check
     */
    function hasLiked(address _postAddress) external view returns (bool);

    /**
     * @notice Records a post as liked by the profile
     * @param _postAddress Address of the liked post
     */
    function addLike(address _postAddress) external;

    /**
     * @notice Removes a post from the profile's liked posts
     * @param _postAddress Address of the post to be removed
     */
    function removeLike(address _postAddress) external;

    /**
     * @notice Checks if a user is followed by the profile
     * @param _userAddress Address of the user to check
     */
    function isFollowedBy(address _userAddress) external view returns (bool);

    /**
     * @notice Adds a user to the profile's followers
     * @param _userAddress Address of the new follower
     */
    function addFollower(address _userAddress) external;

    /**
     * @notice Removes a user from the profile's followers
     * @param _userAddress Address of the follower to be removed
     */
    function removeFollower(address _userAddress) external;

    /**
     * @notice Checks if the profile is following a specific user
     * @param _userAddress Address of the user to check
     */
    function isFollowerOf(address _userAddress) external view returns (bool);

    /**
     * @notice Adds a user to the profile's followings
     * @param _userAddress Address of the user to follow
     */
    function addFollowing(address _userAddress) external;

    /**
     * @notice Removes a user from the profile's followings
     * @param _userAddress Address of the following to be removed
     */
    function removeFollowing(address _userAddress) external;
}
