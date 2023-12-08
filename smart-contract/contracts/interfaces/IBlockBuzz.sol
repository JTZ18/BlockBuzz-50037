pragma solidity ^0.8.9;

import {ILSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/ILSP8IdentifiableDigitalAsset.sol";

import {PostType} from "../enums/PostType.sol";

/**
 * @title BlockBuzz Interface
 * @dev Defines the interface for a BlockBuzz contract, including events and functions
 */
interface IBlockBuzz is ILSP8IdentifiableDigitalAsset {
    /**
     * @dev Triggers when a new user registers
     * @param profileAddress Address of the registered user
     * @param profileDataAddress Address of the user's profile data contract
     * @param userId Unique ID of the user
     * @param timestamp Time of registration
     */
    event UserRegistered(
        address indexed profileAddress,
        address indexed profileDataAddress,
        uint indexed userId,
        uint timestamp
    );

    /**
     * @dev Triggers when a user likes a post
     * @param profileAddress Address of the user liking the post
     * @param targetPost Address of the liked post
     * @param timestamp Time of the like event
     */
    event UserLikedPost(
        address indexed profileAddress,
        address indexed targetPost,
        uint timestamp
    );

    /**
     * @dev Triggers when a user unlikes a post
     * @param profileAddress Address of the user unliking the post
     * @param targetPost Address of the unliked post
     * @param timestamp Time of the unlike event
     */
    event UserUnlikedPost(
        address indexed profileAddress,
        address indexed targetPost,
        uint timestamp
    );

    /**
     * @dev Triggers when a user follows another user
     * @param profileAddress Address of the follower
     * @param targetUser Address of the followed user
     * @param timestamp Time of the follow event
     */
    event UserFollowedUser(
        address indexed profileAddress,
        address indexed targetUser,
        uint timestamp
    );

    /**
     * @dev Triggers when a user unfollows another user
     * @param profileAddress Address of the unfollower
     * @param targetUser Address of the unfollowed user
     * @param timestamp Time of the unfollow event
     */
    event UserUnfollowedUser(
        address indexed profileAddress,
        address indexed targetUser,
        uint timestamp
    );

    /**
     * @dev Triggers when a user creates a new post
     * @param postType Type of the created post
     * @param profileAddress Address of the post creator
     * @param newPost Address of the new post
     * @param targetPost Address of the targeted post (for comments/shares)
     * @param timestamp Time of post creation
     */
    event UserCreatedPost(
        PostType indexed postType,
        address indexed profileAddress,
        address indexed targetPost,
        address newPost,
        uint timestamp
    );

    /**
     * @notice Register a new user
     */
    function register() external returns (address);

    /**
     * @notice Like a post
     * @param _postAddress Address of the post to like
     */
    function likePost(address _postAddress) external;

    /**
     * @notice Unlike a post
     * @param _postAddress Address of the post to unlike
     */
    function unlikePost(address _postAddress) external;

    /**
     * @notice Follow another user
     * @param _profileAddress Address of the user to follow
     */
    function followUser(address _profileAddress) external;

    /**
     * @notice Unfollow another user
     * @param _profileAddress Address of the user to unfollow
     */
    function unfollowUser(address _profileAddress) external;

    /**
     * @notice Create a new post
     * @param _content Content of the post
     */
    function createPost(bytes calldata _content) external returns (address);

    /**
     * @notice Comment on a post
     * @param _content Content of the comment
     * @param _targetPost Address of the post being commented on
     */
    function commentPost(
        bytes calldata _content,
        address _targetPost
    ) external returns (address);
}
