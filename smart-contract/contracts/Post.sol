// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IERC725Y} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {ERC725YCore} from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";

import {ERC725YEnumerableSetUtil} from "./utils/ERC725YEnumerableSetUtil.sol";
import {IPost} from "./interfaces/IPost.sol";
import {PostType} from "./enums/PostType.sol";

import "./utils/BlockBuzzConstants.sol";

/**
 * @title Post Implementation
 * @dev Implements a post as an LSP8 Identifiable Asset
 */
contract Post is IPost, ERC725YEnumerableSetUtil {
    uint public timestamp;
    address public author;
    PostType public postType;
    address public referencedPost;

    /**
     * @notice Sets the contract variables and the ERC725Y JSONURL key that references the post
     * @dev Initializes a new post with specified details.
     * @param _ownerAddress Owner address of the post
     * @param _authorAddress Author address of the post
     * @param _postType Type of the post (MAIN, COMMENT)
     * @param _content JSON URL formatted content according to LSP2
     * @param _referencedPostAddress Address of the post referenced (if applicable)
     */
    constructor(
        address _ownerAddress,
        address _authorAddress,
        PostType _postType,
        bytes memory _content,
        address _referencedPostAddress
    ) ERC725YEnumerableSetUtil(_ownerAddress) {
        require(
            _postType == PostType.MAIN ||
                IERC165(_referencedPostAddress).supportsInterface(
                    _INTERFACEID_POST
                ),
            "Target post address must support the POST interface (ERC165)"
        );

        author = _authorAddress;
        postType = _postType;
        referencedPost = _postType == PostType.MAIN
            ? address(0)
            : _referencedPostAddress;
        timestamp = block.timestamp;

        setData(
            _LSP8_TOKEN_ID_METADATA_MINTED_BY,
            abi.encode(_authorAddress)
        );
        setData(
            _LSP8_TOKEN_ID_METADATA_TOKEN_ID,
            bytes.concat(bytes12(0), bytes20(address(this)))
        );
        setData(_LSP8_TOKEN_ID_METADATA_POST_CONTENT, _content);
    }

    /**
     * @inheritdoc IPost
     */
    function isLikedBy(address _userAddress) external view returns (bool) {
        return isAddressInEnumerableSet(_LIKES_MAP_KEY, _userAddress);
    }

    /**
     * @inheritdoc IPost
     */
    function addLike(address _userAddress) external onlyOwner {
        addElementToEnumerableSet(
            _LIKES_MAP_KEY,
            _LIKES_ARRAY_KEY,
            _userAddress
        );
    }

    /**
     * @inheritdoc IPost
     */
    function removeLike(address _userAddress) external onlyOwner {
        removeElementFromEnumerableSet(
            _LIKES_MAP_KEY,
            _LIKES_ARRAY_KEY,
            _userAddress
        );
    }

    /**
     * @inheritdoc IPost
     */
    function addComment(address _comment) external onlyOwner {
        addElementToEnumerableSet(
            _COMMENTS_MAP_KEY,
            _COMMENTS_ARRAY_KEY,
            _comment
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
            interfaceId == _INTERFACEID_POST ||
            super.supportsInterface(interfaceId);
    }
}
