const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const BlockBuzzConstants = require("../constants/BlockBuzzConstants");
const { ERC725YKeys } = require("@lukso/lsp-smart-contracts/constants");

// ABI
const IERC165ABI =
  require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;
const PostABI =
  require("../artifacts/contracts/Post.sol/Post.json").abi;
const IProfileDataABI =
  require("../artifacts/contracts/interfaces/IProfileData.sol/IProfileData.json").abi;

const { deployBlockBuzzWithLinkedLibraries } = require("../scripts/deploy-utils");
const {
  getOwnerAndUniversalProfiles,
} = require("./test-utils/universal-profile");

describe("BlockBuzz", () => {
  const deployFixture = async () => {
    const constructorParam = ethers.utils.arrayify(
      "0x6f357c6ad575b7fd3a648e998af8851efb8fc396805b73a3f72016df79dfedce79c76a53697066733a2f2f516d6563726e6645464c4d64573642586a4a65316e76794c6450655033435967516258774e6d593850374c666553"
    );
    const deployedBlockBuzzWithLinkedLibraries =
      await deployBlockBuzzWithLinkedLibraries(constructorParam);

    const ownerAndUniversalProfiles = await getOwnerAndUniversalProfiles(
      deployedBlockBuzzWithLinkedLibraries.blockBuzz
    );

    const randomPostContent = ethers.utils.toUtf8Bytes("");

    return {
      ...ownerAndUniversalProfiles,
      ...deployedBlockBuzzWithLinkedLibraries,
      constructorParam,
      randomPostContent,
    };
  };

  describe("function register() external returns (address)", async () => {
    it("Should deploy instance of ProfileData after successful registration", async () => {
      const { owner, blockBuzz, accounts } = await loadFixture(deployFixture);

      await accounts[0].register();

      const ProfileDataAddress = await blockBuzz.registeredUsers(accounts[0].universalProfileAddress);
      const erc165 = new ethers.Contract(ProfileDataAddress, IERC165ABI, owner);

      expect(await erc165.supportsInterface(BlockBuzzConstants.INTERFACE_IDS.ProfileData)).to.be.equal(true);
    });
  });

  describe("function likePost(address _postAddress) external onlyRegisteredUser(msg.sender) onlyValidPost(_post) onlyNotPostAuthor(msg.sender, _post) onlyNotLikedPost(msg.sender, _post)", () => {
    it("Should add like to post and emit 'UserLikedPost' event if user has not already liked it", async () => {
      const { blockBuzz, accounts, randomPostContent } = await loadFixture(
        deployFixture
      );

      await accounts[0].register();
      const post = await accounts[0].createPost(randomPostContent);

      const socialProfile = await accounts[1].register();
      await expect(
        accounts[1].executeCallThroughKeyManager("likePost", post.address)
      )
        .to.emit(blockBuzz, "UserLikedPost")
        .withArgs(accounts[1].universalProfileAddress, post.address, anyValue);

      expect(
        await post.isLikedBy(accounts[1].universalProfileAddress)
      ).to.be.equal(true);
      expect(await socialProfile.hasLiked(post.address)).to.be.equal(true);
    });

    it(`Should revert with '${BlockBuzzConstants.Errors.BlockBuzz.UserLikedPost}' if a user has already liked a post`, async () => {
      const { accounts, randomPostContent } = await loadFixture(deployFixture);

      await accounts[0].register();
      const post = await accounts[0].createPost(randomPostContent);

      await accounts[1].register();
      await accounts[1].executeCallThroughKeyManager("likePost", post.address);

      await expect(
        accounts[1].executeCallThroughKeyManager("likePost", post.address)
      ).to.be.revertedWith(
        BlockBuzzConstants.Errors.BlockBuzz.UserLikedPost
      );
    });
  });

  describe("function unlikePost(address _postAddress) external onlyRegisteredUser(msg.sender) onlyValidPost(_post) onlyNotPostAuthor(msg.sender, _post) onlyLikedPost(msg.sender, _post)", () => {
    it("Should remove like from post and emit 'UserUnlikedPost' event if user has liked it before", async () => {
      const { blockBuzz, accounts, randomPostContent } = await loadFixture(
        deployFixture
      );

      await accounts[0].register();
      const post = await accounts[0].createPost(randomPostContent);

      const socialProfile = await accounts[1].register();
      await accounts[1].executeCallThroughKeyManager("likePost", post.address);
      await expect(
        accounts[1].executeCallThroughKeyManager("unlikePost", post.address)
      )
        .to.emit(blockBuzz, "UserUnlikedPost")
        .withArgs(accounts[1].universalProfileAddress, post.address, anyValue);

      expect(
        await post.isLikedBy(accounts[1].universalProfileAddress)
      ).to.be.equal(false);
      expect(await socialProfile.hasLiked(post.address)).to.be.equal(false);
    });

    it(`Should revert with '${BlockBuzzConstants.Errors.BlockBuzz.UserNotLikedPost}' if user has not liked the post`, async () => {
      const { accounts, randomPostContent } = await loadFixture(deployFixture);

      await accounts[0].register();
      const post = await accounts[0].createPost(randomPostContent);

      await accounts[1].register();

      await expect(
        accounts[1].executeCallThroughKeyManager("unlikePost", post.address)
      ).to.be.revertedWith(
        BlockBuzzConstants.Errors.BlockBuzz.UserNotLikedPost
      );
    });
  });

  describe("function followUser(address _userAddress) external onlyRegisteredUser(msg.sender) onlyRegisteredUser(_user) onlyNotFollowedUser(msg.sender, _user)", () => {
    it("Should add subscription and emit 'UserFollowedUser' event if user has not already followed the target user", async () => {
      const { blockBuzz, accounts } = await loadFixture(deployFixture);

      const socialProfile1 = await accounts[0].register();
      const socialProfile2 = await accounts[1].register();

      await expect(
        accounts[1].executeCallThroughKeyManager(
          "followUser",
          accounts[0].universalProfileAddress
        )
      )
        .to.emit(blockBuzz, "UserFollowedUser")
        .withArgs(
          accounts[1].universalProfileAddress,
          accounts[0].universalProfileAddress,
          anyValue
        );

      expect(
        await socialProfile1.isFollowedBy(accounts[1].universalProfileAddress)
      ).to.be.equal(true);
      expect(
        await socialProfile2.isFollowerOf(accounts[0].universalProfileAddress)
      ).to.be.equal(true);
    });

    it(`Should revert with '${BlockBuzzConstants.Errors.BlockBuzz.UserIsFollower}' if user has already followed the target user`, async () => {
      const { accounts } = await loadFixture(deployFixture);

      await accounts[0].register();

      await accounts[1].register();
      await accounts[1].executeCallThroughKeyManager(
        "followUser",
        accounts[0].universalProfileAddress
      );

      await expect(
        accounts[1].executeCallThroughKeyManager(
          "followUser",
          accounts[0].universalProfileAddress
        )
      ).to.be.revertedWith(
        BlockBuzzConstants.Errors.BlockBuzz.UserIsFollower
      );
    });
  });

  describe("function unFollow(address _userAddress) external onlyRegisteredUser(msg.sender) onlyRegisteredUser(_user) onlyFollowedUser(msg.sender, _user)", () => {
    it("Should remove subscription and emit 'UserUnfollowedUser' event if user has followed the target user before", async () => {
      const { blockBuzz, accounts } = await loadFixture(deployFixture);

      const socialProfile1 = await accounts[0].register();
      const socialProfile2 = await accounts[1].register();

      await accounts[1].executeCallThroughKeyManager(
        "followUser",
        accounts[0].universalProfileAddress
      );
      await expect(
        accounts[1].executeCallThroughKeyManager(
          "unfollowUser",
          accounts[0].universalProfileAddress
        )
      )
        .to.emit(blockBuzz, "UserUnfollowedUser")
        .withArgs(
          accounts[1].universalProfileAddress,
          accounts[0].universalProfileAddress,
          anyValue
        );

      expect(
        await socialProfile1.isFollowedBy(accounts[1].universalProfileAddress)
      ).to.be.equal(false);
      expect(
        await socialProfile2.isFollowerOf(accounts[0].universalProfileAddress)
      ).to.be.equal(false);
    });

    it(`Should revert with '${BlockBuzzConstants.Errors.BlockBuzz.UserNotFollower}' if user has not followed the target user`, async () => {
      const { accounts } = await loadFixture(deployFixture);

      await accounts[0].register();

      await accounts[1].register();

      await expect(
        accounts[1].executeCallThroughKeyManager(
          "unfollowUser",
          accounts[0].universalProfileAddress
        )
      ).to.be.revertedWith(
        BlockBuzzConstants.Errors.BlockBuzz.UserNotFollower
      );
    });
  });

  describe("function createPost(bytes calldata _content, address[] calldata _taggedUsers) external onlyRegisteredUser(msg.sender) returns (address)", () => {
    it("Should create a post of type MAIN and emit 'UserCreatedPost' event", async () => {
      const { blockBuzz, accounts, randomPostContent } = await loadFixture(
        deployFixture
      );

      const socialProfile = await accounts[0].register();

      await expect(
        accounts[0].executeCallThroughKeyManager(
          "createPost",
          randomPostContent
        )
      )
        .to.emit(blockBuzz, "UserCreatedPost")
        .withArgs(
          BlockBuzzConstants.PostType.MAIN,
          accounts[0].universalProfileAddress,
          ethers.constants.AddressZero,
          anyValue,
          anyValue
        );

      const eventFilter = blockBuzz.filters.UserCreatedPost();
      const events = await blockBuzz.queryFilter(eventFilter);

      const PostInterface = new ethers.utils.Interface(
        PostABI
      );
      const post = new ethers.Contract(
        events[events.length - 1].args.newPost,
        PostInterface,
        accounts[0].universalProfileOwner
      );

      expect(await socialProfile.isProfileOf(post.address)).to.be.equal(true);
      expect(await post.profile()).to.hexEqual(
        accounts[0].universalProfileAddress
      );
      expect(await post.owner()).to.hexEqual(blockBuzz.address);
      expect(
        ethers.utils.hexDataSlice(
          await post["getData(bytes32)"](
            BlockBuzzConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy
          ),
          12
        )
      ).to.hexEqual(accounts[0].universalProfileAddress);
      expect(
        ethers.utils.hexDataSlice(
          await post["getData(bytes32)"](
            BlockBuzzConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId
          ),
          12
        )
      ).to.hexEqual(post.address);
      expect(
        ethers.utils.arrayify(
          await post["getData(bytes32)"](
            BlockBuzzConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata
              .PostContent
          )
        )
      ).to.eql(randomPostContent);
    });

    it("Should mint a LSP8  NFT (Post) with the address as the token id and emit 'Transfer' event", async () => {
      const { blockBuzz, accounts, randomPostContent } = await loadFixture(
        deployFixture
      )

      await accounts[0].register();

      expect(await blockBuzz.totalSupply()).to.equal(0);

      await expect(
        accounts[0].executeCallThroughKeyManager(
          "createPost",
          randomPostContent
        )
      )
        .to.emit(blockBuzz, "Transfer")
        .withArgs(
          accounts[0].universalProfileAddress,
          ethers.constants.AddressZero,
          accounts[0].universalProfileAddress,
          anyValue,
          false,
          anyValue
        );

      const eventFilter = blockBuzz.filters.UserCreatedPost();
      const events = await blockBuzz.queryFilter(eventFilter);

      const PostInterface = new ethers.utils.Interface(
        PostABI
      );
      const post = new ethers.Contract(
        events[events.length - 1].args.newPost,
        PostInterface,
        accounts[0].universalProfileOwner
      );

      expect(await blockBuzz.totalSupply()).to.equal(1);
      expect(
        await blockBuzz.tokenOwnerOf(
          ethers.utils.hexZeroPad(post.address, 32)
        )
      ).to.hexEqual(accounts[0].universalProfileAddress);
    });
  });

  describe("function commentPost(bytes calldata _content, address _targetPost) external onlyRegisteredUser(msg.sender) onlyValidPost(_targetPost) returns (address)", () => {
    it("Should create a post of type COMMENT and emit 'UserCreatedPost' event", async () => {
      const { blockBuzz, accounts, randomPostContent } = await loadFixture(
        deployFixture
      );

      const socialProfile = await accounts[0].register();
      const referencedPost = await accounts[0].createPost(
        randomPostContent
      );

      await expect(
        accounts[0].executeCallThroughKeyManager(
          "commentPost",
          randomPostContent,
          referencedPost.address
        )
      )
        .to.emit(blockBuzz, "UserCreatedPost")
        .withArgs(
          BlockBuzzConstants.PostType.COMMENT,
          accounts[0].universalProfileAddress,
          referencedPost.address,
          anyValue,
          anyValue
        );

      const eventFilter = blockBuzz.filters.UserCreatedPost();
      const events = await blockBuzz.queryFilter(eventFilter);

      const PostInterface = new ethers.utils.Interface(
        PostABI
      );
      const post = new ethers.Contract(
        events[events.length - 1].args.newPost,
        PostInterface,
        accounts[0].universalProfileOwner
      );

      expect(await socialProfile.isProfileOf(post.address)).to.be.equal(true);
      expect(await post.profile()).to.hexEqual(
        accounts[0].universalProfileAddress
      );
      expect(await post.owner()).to.hexEqual(blockBuzz.address);
      expect(
        ethers.utils.hexDataSlice(
          await post["getData(bytes32)"](
            BlockBuzzConstants.ERC725YKeys.LSP8.TokenId.Metadata.MintedBy
          ),
          12
        )
      ).to.hexEqual(accounts[0].universalProfileAddress);
      expect(
        ethers.utils.hexDataSlice(
          await post["getData(bytes32)"](
            BlockBuzzConstants.ERC725YKeys.LSP8.TokenId.Metadata.TokenId
          ),
          12
        )
      ).to.hexEqual(post.address);
      expect(
        ethers.utils.arrayify(
          await post["getData(bytes32)"](
            BlockBuzzConstants.ERC725YKeys.LSP8Custom.TokenId.Metadata
              .PostContent
          )
        )
      ).to.eql(randomPostContent);
    });

    it("Should mint a LSP8  NFT (Post) with the address as the token id and emit 'Transfer' event", async () => {
      const { blockBuzz, accounts, randomPostContent } = await loadFixture(
        deployFixture
      );

      await accounts[0].register();

      expect(await blockBuzz.totalSupply()).to.equal(0);

      const referencedPost = await accounts[0].createPost(
        randomPostContent
      );

      expect(await blockBuzz.totalSupply()).to.equal(1);

      await expect(
        accounts[0].executeCallThroughKeyManager(
          "commentPost",
          randomPostContent,
          referencedPost.address
        )
      )
        .to.emit(blockBuzz, "Transfer")
        .withArgs(
          accounts[0].universalProfileAddress,
          ethers.constants.AddressZero,
          accounts[0].universalProfileAddress,
          anyValue,
          false,
          anyValue
        );

      const eventFilter = blockBuzz.filters.UserCreatedPost();
      const events = await blockBuzz.queryFilter(eventFilter);

      const PostInterface = new ethers.utils.Interface(
        PostABI
      );
      const post = new ethers.Contract(
        events[events.length - 1].args.newPost,
        PostInterface,
        accounts[0].universalProfileOwner
      );

      expect(await blockBuzz.totalSupply()).to.equal(2);
      expect(
        await blockBuzz.tokenOwnerOf(
          ethers.utils.hexZeroPad(post.address, 32)
        )
      ).to.hexEqual(accounts[0].universalProfileAddress);
    });

    it(`Should revert with '${BlockBuzzConstants.Errors.BlockBuzz.PostAddressNotValid}' if referenced post address is not an instance of Post`, async () => {
      const { accounts, randomPostContent } = await loadFixture(deployFixture);

      await accounts[0].register();

      await expect(
        accounts[0].executeCallThroughKeyManager(
          "commentPost",
          randomPostContent,
          accounts[1].universalProfileAddress
        )
      ).to.be.revertedWith(
        BlockBuzzConstants.Errors.BlockBuzz.PostAddressNotValid
      );
    });
  });
});
