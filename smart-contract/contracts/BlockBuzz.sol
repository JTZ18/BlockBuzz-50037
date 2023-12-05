// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {_INTERFACEID_ERC725Y, _INTERFACEID_ERC725X} from "@erc725/smart-contracts/contracts/constants.sol";
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {OwnableUnset} from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";

import {IBlockBuzz} from "./interfaces/IBlockBuzz.sol";
import {ProfileDataFactory} from "./ProfileDataFactory.sol";
import {IProfileData} from "./interfaces/IProfileData.sol";
import {PostFactory} from "./PostFactory.sol";
import {IPost} from "./interfaces/IPost.sol";
import {PostType} from "./enums/PostType.sol";

import "./utils/BlockBuzzConstants.sol";

/**
 * @title Social Network Implementation
 * @dev Contract module represents a social network.
 */
contract BlockBuzz is
    IBlockBuzz,
    LSP8IdentifiableDigitalAsset("BlockBuzzPost", "BBP", msg.sender, 2, 1) // TODO: need to find out
{
    mapping(address => address) public registeredUsers; // mapping from universal profile to social network profile data
    uint public registeredUserCount = 0; // incremented with each registration

    constructor(bytes memory _LSP4MetadataJSONURL) {
        // set token id type to be address (tokens => instances of Post contract)
        setData(
            _LSP8_TOKEN_ID_TYPE,
            bytes(abi.encode(_LSP8_TOKEN_ID_TYPE_ADDRESS))
        );
        setData(_LSP4_METADATA_KEY, _LSP4MetadataJSONURL);
    }

    /**
     * @notice Validates that the given address is a registered user
     * @param _profileAddress the user address to be checked
     */
    modifier onlyRegisteredProfile(address _profileAddress) {
        require(
            registeredUsers[_profileAddress] != address(0),
            "Profile address is not registered"
        );
        _;
    }

    /**
     * @notice Validates that the given address is a valid post (instance of Post contract)
     * @param _postAddress the post address to be checked
     */
    modifier onlyValidPost(address _postAddress) {
        require(
            IERC165(_postAddress).supportsInterface(_INTERFACEID_POST),
            "Post address is not pointing to a valid post (Post interface not available)"
        );
        require(
            OwnableUnset(_postAddress).owner() == address(this),
            "Post address is not owned by current  contract instance"
        );
        _;
    }

    /**
     * @notice Validates that the user has liked the post
     * @param _profileAddress the address of the user
     * @param _referencePost the address of the post
     */
    modifier onlyLikedPost(address _profileAddress, address _referencePost) {
        require(
            IPost(_referencePost).isLikedBy(_profileAddress),
            "User did not like the post yet"
        );
        _;
    }

    /**
     * @notice Validates that the user has not liked the post
     * @param _profileAddress the address of the user
     * @param _referencePost the address of the post
     */
    modifier onlyNotLikedPost(address _profileAddress, address _referencePost) {
        require(
            !IPost(_referencePost).isLikedBy(_profileAddress),
            "User has already liked the post"
        );
        _;
    }

    /**
     * @notice Validates that the user has followed the target user
     * @param _profileAddress the address of the user
     * @param _targetUser the address of the target user
     */
    modifier onlyFollowedUser(address _profileAddress, address _targetUser) {
        require(_profileAddress != _targetUser, "Users must be different");
        require(
            IProfileData(registeredUsers[_profileAddress]).isFollowerOf(
                _targetUser
            ),
            "User is not a follower yet"
        );
        _;
    }

    /**
     * @notice Validates that the user has not followed the target user
     * @param _profileAddress the address of the user
     * @param _targetUser the address of the target user
     */
    modifier onlyNotFollowedUser(address _profileAddress, address _targetUser) {
        require(_profileAddress != _targetUser, "Users must be different");
        require(
            !IProfileData(registeredUsers[_profileAddress]).isFollowerOf(
                _targetUser
            ),
            "User is already a follower"
        );
        _;
    }

    /**
     * @notice Validates that the user is the author of the post
     * @param _profileAddress the address of the user
     * @param _referencePost the address of the post
     */
    modifier onlyPostProfile(address _profileAddress, address _referencePost) {
        require(
            _profileAddress == IPost(_referencePost).profile(),
            "User must be the profile author"
        );
        _;
    }

    /**
     * @notice Requires that the user is not the author of the post
     * @param _profileAddress the address of the user
     * @param _referencePost the address of the post
     */
    modifier onlyNotPostProfile(address _profileAddress, address _referencePost) {
        require(
            _profileAddress != IPost(_referencePost).profile(),
            "User must not be the post author"
        );
        _;
    }

    /**
     * @inheritdoc IBlockBuzz
     * @dev Creates a new instance of the ProfileData contract and links it to the sender address.
     * Fails if the sender address is not a universal profile or if the sender address is already registered.
     */
    function register() external returns (address) {
        require(
            registeredUsers[msg.sender] == address(0),
            "User address is already registered"
        );
        require(
            msg.sender.code.length > 0,
            "User address is an EOA - Only smart contract based accounts are supported"
        );

        // TODO: Find a way to check supportsInterface LSP0ERC725Account instead
        // require(
        //     IERC165(msg.sender).supportsInterface(_INTERFACEID_ERC725Y) &&
        //         IERC165(msg.sender).supportsInterface(_INTERFACEID_ERC725X),
        //     "User address is not an universal profile (ERC725X and/or ERC725Y interfaces not available)"
        // );

        ++registeredUserCount;
        registeredUsers[msg.sender] = ProfileDataFactory
            .createProfileData(address(this), msg.sender);
        emit UserRegistered(
            msg.sender,
            registeredUsers[msg.sender],
            registeredUserCount,
            block.timestamp
        );

        return registeredUsers[msg.sender];
    }

    /**
     * @inheritdoc IBlockBuzz
     */
    function likePost(address _postAddress)
        external
        onlyRegisteredProfile(msg.sender)
        onlyValidPost(_postAddress)
        onlyNotPostProfile(msg.sender, _postAddress)
        onlyNotLikedPost(msg.sender, _postAddress)
    {
        IPost(_postAddress).addLike(msg.sender);
        IProfileData(registeredUsers[msg.sender]).addLike(_postAddress);
        emit UserLikedPost(msg.sender, _postAddress, block.timestamp);
    }

    /**
     * @inheritdoc IBlockBuzz
     */
    function unlikePost(address _postAddress)
        external
        onlyRegisteredProfile(msg.sender)
        onlyValidPost(_postAddress)
        onlyNotPostProfile(msg.sender, _postAddress)
        onlyLikedPost(msg.sender, _postAddress)
    {
        IPost(_postAddress).removeLike(msg.sender);
        IProfileData(registeredUsers[msg.sender]).removeLike(
            _postAddress
        );
        emit UserUnlikedPost(msg.sender, _postAddress, block.timestamp);
    }

    /**
     * @inheritdoc IBlockBuzz
     */
    function followUser(address _profileAddress)
        external
        onlyRegisteredProfile(msg.sender)
        onlyRegisteredProfile(_profileAddress)
        onlyNotFollowedUser(msg.sender, _profileAddress)
    {
        IProfileData(registeredUsers[msg.sender]).addFollowing(
            _profileAddress
        );
        IProfileData(registeredUsers[_profileAddress]).addFollower(
            msg.sender
        );
        emit UserFollowedUser(msg.sender, _profileAddress, block.timestamp);
    }

    /**
     * @inheritdoc IBlockBuzz
     */
    function unfollowUser(address _profileAddress)
        external
        onlyRegisteredProfile(msg.sender)
        onlyRegisteredProfile(_profileAddress)
        onlyFollowedUser(msg.sender, _profileAddress)
    {
        IProfileData(registeredUsers[msg.sender])
            .removeFollowing(_profileAddress);
        IProfileData(registeredUsers[_profileAddress]).removeFollower(
            msg.sender
        );
        emit UserUnfollowedUser(msg.sender, _profileAddress, block.timestamp);
    }

    /**
     * @inheritdoc IBlockBuzz
     */
    function createPost(bytes calldata _data)
        external
        onlyRegisteredProfile(msg.sender)
        returns (address)
    {
        address post = PostFactory.createPost(address(this), msg.sender, _data);

        _mint(
            msg.sender,
            bytes32(bytes.concat(bytes12(0), bytes20(post))),
            false,
            ""
        );

        IProfileData(registeredUsers[msg.sender]).addPost(post);

        emit UserCreatedPost(PostType.MAIN, msg.sender, address(0), post, block.timestamp);

        return post;
    }

    /**
     * @inheritdoc IBlockBuzz
     */
    function commentPost(
        bytes calldata _data,
        address _referencePost
    )
        external
        onlyRegisteredProfile(msg.sender)
        onlyValidPost(_referencePost)
        returns (address)
    {
        address post = PostFactory.createCommentPost(
            address(this),
            msg.sender,
            _data,
            _referencePost
        );

        _mint(
            msg.sender,
            bytes32(bytes.concat(bytes12(0), bytes20(post))),
            false,
            ""
        );

        IPost(_referencePost).addComment(post);
        IProfileData(registeredUsers[msg.sender]).addPost(post);

        emit UserCreatedPost(PostType.COMMENT, msg.sender, _referencePost, post, block.timestamp);

        return post;
    }

    /**
     * @inheritdoc ERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, LSP8IdentifiableDigitalAsset)
        returns (bool)
    {
        return
            interfaceId == _INTERFACEID_BLOCKBUZZ ||
            super.supportsInterface(interfaceId);
    }
}
