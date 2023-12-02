// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// Local imports
import {Post} from "./Post.sol";
import {PostType} from "./enums/PostType.sol";

/**
 * @title Post Contract Instance Factory
 * @dev Facilitates the creation of new Post contract instances.
 */
library PostFactory {
    /**
     * @notice Creates a new MAIN type post
     * @dev Deploys a Post contract with MAIN post type.
     * @param _ownerAddress Address of the contract owning the new post
     * @param _profileAddress Address of the profile creating the post
     * @param _content Post content in LSP2 JSONURL format
     * @return address The address of the newly created Post contract
     */
    function createPost(
        address _ownerAddress,
        address _profileAddress,
        bytes calldata _content
    ) public returns (address) {
        return
            address(
                new Post(
                    _ownerAddress,
                    _profileAddress,
                    PostType.MAIN,
                    _content,
                    address(0)
                )
            );
    }

    /**
     * @notice Creates a new COMMENT type post
     * @dev Deploys a Post contract with COMMENT post type, referencing an existing post.
     * @param _ownerAddress Address of the contract owning the new comment
     * @param _profileAddress Address of the profile creating the comment
     * @param _content Comment content in LSP2 JSONURL format
     * @param _referencedPostAddress Address of the post being commented on
     * @return address The address of the newly created Post contract
     */
    function createCommentPost(
        address _ownerAddress,
        address _profileAddress,
        bytes calldata _content,
        address _referencedPostAddress
    ) public returns (address) {
        return
            address(
                new Post(
                    _ownerAddress,
                    _profileAddress,
                    PostType.COMMENT,
                    _content,
                    _referencedPostAddress
                )
            );
    }
}
