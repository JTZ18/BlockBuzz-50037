const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const BlockBuzzConstants = require("../constants/BlockBuzzConstants");

const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;

// Helper
const { deployPostWithLinkedLibraries } = require("../scripts/deploy-utils");

describe("Post", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const randomPostContent = ethers.utils.toUtf8Bytes("RANDOM POST CONTENT DATA");

        const createPost = async (profile, referencedPost = ethers.constants.AddressZero) => {
            return await deployPostWithLinkedLibraries(accounts[0].address, profile, BlockBuzzConstants.PostType.MAIN, randomPostContent, referencedPost);
        };

        const createComment = async (profile, referencedPost) => {
            return await deployPostWithLinkedLibraries(accounts[0].address, profile, BlockBuzzConstants.PostType.COMMENT, randomPostContent, referencedPost);
        };

        return {
            accounts,
            createPost,
            createComment,
            randomPostContent
        };
    };

    describe("constructor(address _owner, address _profile, SocialNetworkPostType _postType, bytes memory _data, address _referencedPost) ERC725YEnumerableSetUtil(_owner)", () => {
        it(`Should create valid instance of Post which supports the interface id: ${BlockBuzzConstants.INTERFACE_IDS.Post} (MAIN)`, async () => {
            const { accounts, createPost } = await loadFixture(deployFixture);
            const post = await createPost(accounts[0].address, []);

            const erc165 = new ethers.Contract(post.address, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(BlockBuzzConstants.INTERFACE_IDS.Post)).to.be.equal(true);
        });

        it(`Should have MAIN (${BlockBuzzConstants.PostType.MAIN}) as post type`, async () => {
            const { accounts, createPost } = await loadFixture(deployFixture);

            const post = await createPost(accounts[0].address, []);

            expect(await post.postType()).to.eql(BlockBuzzConstants.PostType.MAIN);
        });

        it(`Should have COMMENT (${BlockBuzzConstants.PostType.COMMENT}) as post type`, async () => {
            const { accounts, createPost, createComment } = await loadFixture(deployFixture);

            const post = await createPost(accounts[0].address, []);
            const comment = await createComment(accounts[0].address, [], post.address);

            expect(await comment.postType()).to.eql(BlockBuzzConstants.PostType.COMMENT);
        });

        it("Should set deployer's address as owner of post (owner != profile)", async () => {
            const { accounts, createPost } = await loadFixture(deployFixture);

            const post = await createPost(accounts[0].address, []);

            expect(await post.owner()).to.eql(accounts[0].address);
        });

        it("Should set the PostContent ERC725Y key value to param _data", async () => {
            const { accounts, createPost, randomPostContent } = await loadFixture(deployFixture);

            const post = await createPost(accounts[0].address, []);
            const value = await post["getData(bytes32)"](BlockBuzzConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata.PostContent);
            expect(ethers.getBytes(value)).to.eql(randomPostContent);
        });
    });
});