const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const BlockBuzzConstants = require("../constants/BlockBuzzConstants");

const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;
const PostABI = require("../artifacts/contracts/Post.sol/Post.json").abi;

const { deployPostFactoryTestWithLinkedLibraries } = require("../scripts/deploy-utils");

describe("PostFactoryTest", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const deployedPostFactoryTest = await deployPostFactoryTestWithLinkedLibraries(accounts[0].address);
        const randomPostContent = ethers.utils.toUtf8Bytes("RANDOM POST CONTENT");

        const createValidPost = async (author, postContentData = []) => {
            const tx = await deployedPostFactoryTest.createPost(author, postContentData);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");

            const PostInterface = new ethers.utils.Interface(PostABI);
            const validPost = new ethers.Contract(event.args.newPost, PostInterface, accounts[0]);
            return validPost;
        };

        const createValidComment = async (author, postContentData = []) => {
            const referencedPost = await createValidPost(author, postContentData);
            const tx = await deployedPostFactoryTest.createComment(author, postContentData, referencedPost.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");

            const PostInterface = new ethers.utils.Interface(PostABI);
            const validComment = new ethers.Contract(event.args.newPost, PostInterface, accounts[0]);
            return { referencedPost, validComment };
        };

        return {
            accounts,
            deployedPostFactoryTest,
            randomPostContent,
            createValidPost,
            createValidComment,
        };
    };

    describe("function createPost(address _author, bytes calldata _data, address[] calldata _taggedUsers) external returns (address)", () => {
        it("Should create instance of Post contract and emit CreatedPost event", async () => {
            const { accounts, deployedPostFactoryTest, randomPostContent } = await loadFixture(deployFixture);

            await expect(deployedPostFactoryTest.createPost(accounts[0].address, randomPostContent, []))
                .to.emit(deployedPostFactoryTest, "CreatedPost")
                .withArgs(accounts[0].address, anyValue);
        });

        it(`Should create valid instance of Post which supports the interface id: ${BlockBuzzConstants.INTERFACE_IDS.Post}`, async () => {
            const { accounts, deployedPostFactoryTest, randomPostContent } = await loadFixture(deployFixture);
            const tx = await deployedPostFactoryTest.createPost(accounts[0].address, randomPostContent, []);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");
            expect(event).not.to.be.null;
            expect(event.args.author).to.eql(accounts[0].address);

            const erc165 = new ethers.Contract(event.args.newPost, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(BlockBuzzConstants.INTERFACE_IDS.Post)).to.be.equal(true);
        });

        it(`Should have MAIN (${BlockBuzzConstants.PostType.MAIN}) as post type`, async () => {
            const { accounts, randomPostContent, createValidPost } = await loadFixture(deployFixture);

            const validPost = await createValidPost(accounts[0].address, randomPostContent);
            expect(await validPost.postType()).to.eql(BlockBuzzConstants.PostType.MAIN);
        });
    });

    describe("function createComment(address _author, bytes calldata _data, address _referencedPost) external returns (address)", () => {
        it(`Should create valid instance of Post if param _referencedPost is a valid instance of the Post contract and thus both support the interface id: ${BlockBuzzConstants.INTERFACE_IDS.Post}`, async () => {
            const { accounts, deployedPostFactoryTest, randomPostContent, createValidPost } = await loadFixture(deployFixture);

            const validPost = await createValidPost(accounts[0].address, randomPostContent);

            const tx = await deployedPostFactoryTest.createComment(accounts[0].address, randomPostContent, [], validPost.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedPost");
            expect(event).not.to.be.null;
            expect(event.args.author).to.eql(accounts[0].address);

            const erc165 = new ethers.Contract(event.args.newPost, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(BlockBuzzConstants.INTERFACE_IDS.Post)).to.be.equal(true);
        });

        it(`Should have COMMENT (${BlockBuzzConstants.PostType.COMMENT}) as post type`, async () => {
            const { accounts, randomPostContent, createValidComment } = await loadFixture(deployFixture);

            const { validComment } = await createValidComment(accounts[0].address, randomPostContent);
            expect(await validComment.postType()).to.eql(BlockBuzzConstants.PostType.COMMENT);
        });
    });
});