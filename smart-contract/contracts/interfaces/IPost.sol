pragma solidity ^0.8.9;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";

import {PostType} from "../enums/PostType.sol";

/**
 * @title Post Interface
 * @dev Defines the interface for a Post contract (LSP8 Token instance).
 */
interface IPost is IERC165, IERC725Y {
    /**
     * @notice Gets the address of the post's author
     */
    function author() external view returns (address);

    /**
     * @notice Gets the timestamp of the post
     */
    function timestamp() external view returns (uint);

    /**
     * @notice Gets the type of the post
     */
    function postType() external view returns (PostType);

    /**
     * @notice Gets the address of the referenced post, if any
     */
    function referencedPost() external view returns (address);

    /**
     * @notice Determines if a specific user has liked the post
     * @param _userAddress Address of the user to check
     */
    function isLikedBy(address _userAddress) external view returns (bool);

    /**
     * @notice Records a like from a user on the post
     * @param _userAddress Address of the user who liked the post
     */
    function addLike(address _userAddress) external;

    /**
     * @notice Removes a user's like from the post
     * @param _userAddress Address of the user whose like is to be removed
     */
    function removeLike(address _userAddress) external;

    /**
     * @notice Adds a comment to the post
     * @param _commentAddress Address of the comment post
     */
    function addComment(address _commentAddress) external;
}
