// Hardhat
const { ethers, lspFactory } = require("hardhat");

// Constants
const { OPERATION_TYPE } = require("@erc725/smart-contracts/constants");

// ABI
const LSP0ERC725AccountABI = require("@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json").abi;
const LSP6KeyManagerABI = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json").abi;
const IBlockBuzzABI = require("../../artifacts/contracts/interfaces/IBlockBuzz.sol/IBlockBuzz.json").abi;
const PostABI = require("../../artifacts/contracts/Post.sol/Post.json").abi;
const ProfileDataABI = require("../../artifacts/contracts/ProfileData.sol/ProfileData.json").abi;

const createUniversalProfile = async (universalProfileOwner, blockBuzz) => {
    const universalProfile = await lspFactory.UniversalProfile.deploy({ controllerAddresses: [universalProfileOwner.address] });
    const universalProfileAddress = universalProfile.LSP0ERC725Account.address;

    const IBlockBuzzInterface = new ethers.utils.Interface(IBlockBuzzABI);
    const LSP0ERC725AccountABIInterface = new ethers.utils.Interface(LSP0ERC725AccountABI);

    const LSP6KeyManager = new ethers.Contract(universalProfile.LSP6KeyManager.address, LSP6KeyManagerABI, universalProfileOwner);
    const executeCallThroughKeyManager = async (functionName, ...params) => {
        const encodedBlockBuzzCall = IBlockBuzzInterface.encodeFunctionData(functionName, params);
        const encodedExecuteCall = LSP0ERC725AccountABIInterface.encodeFunctionData("execute", [OPERATION_TYPE.CALL, blockBuzz.address, 0, encodedBlockBuzzCall]);
        const tx = await LSP6KeyManager.execute(encodedExecuteCall);
        await tx.wait();
        return tx;
    };

    const register = async () => {
        await executeCallThroughKeyManager("register");

        const eventFilter = blockBuzz.filters.UserRegistered();

        const events = await blockBuzz.queryFilter(eventFilter);

        const ProfileDataInterface = new ethers.utils.Interface(ProfileDataABI);

        console.log("here", events[events.length-1].args.socialProfileData, ProfileDataInterface, universalProfileOwner);


        return new ethers.Contract(events[events.length-1].args.socialProfileData, ProfileDataInterface, universalProfileOwner);
    };

    const createPost = async (postContentData = []) => {
        await executeCallThroughKeyManager("createPost", postContentData);

        const eventFilter = blockBuzz.filters.UserCreatedPost();
        const events = await blockBuzz.queryFilter(eventFilter);

        const PostInterface = new ethers.utils.Interface(PostABI);
        return new ethers.Contract(events[events.length-1].args.newPost, PostInterface, universalProfileOwner);
    };

    const createComment = async (postContentData, referencedPostAddress = []) => {
        await executeCallThroughKeyManager("createComment", postContentData, referencedPostAddress);

        const eventFilter = blockBuzz.filters.UserCreatedPost();
        const events = await blockBuzz.queryFilter(eventFilter);

        const PostInterface = new ethers.utils.Interface(PostABI);
        return new ethers.Contract(events[events.length-1].args.newPost, PostInterface, universalProfileOwner);
    };

    return {
        universalProfileOwner, // EOA (= Owner -> KeyManager -> Universal Profile)
        universalProfile, // Universal Profile contract instance
        universalProfileAddress, // Universal Profile address
        executeCallThroughKeyManager, // Universal Profile helper function for calling methods through the KeyManager
        register,
        createPost, // Creates a post of type MAIN with this universal profile
        createComment, // Creates a post of type COMMENT with this universal profile
    };
};

// Local constant
const MAX_ACCOUNTS = 10;
const getOwnerAndUniversalProfiles = async (blockBuzz) => {
    const signers = await ethers.getSigners();
    const owner = signers[0];

    const accounts = [];
    for (let i = 1; i < MAX_ACCOUNTS && i < signers.length; i++) {
        accounts.push(await createUniversalProfile(signers[i], blockBuzz));
    }

    return { owner, accounts };
};

module.exports = {
    createUniversalProfile,
    getOwnerAndUniversalProfiles
};