const { ethers } = require("hardhat");

const deployLSP2KeyUtil = async () => {
    const LSP2KeyUtil = await ethers.getContractFactory("LSP2KeyUtil");
    console.log("Start deploying LSP2KeyUtil");
    const deployedLSP2KeyUtil = await LSP2KeyUtil.deploy();
    await deployedLSP2KeyUtil.deployed();
    console.log(deployedLSP2KeyUtil.address)
    console.log("Successfully deployed LSP2KeyUtil:", deployedLSP2KeyUtil.address);
    return deployedLSP2KeyUtil;
};

const deployERC725YEnumerableSetUtilWithLinkedLibraries = async (ownerAddress) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const ERC725YEnumerableSetUtil = await ethers.getContractFactory("ERC725YEnumerableSetUtil", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address
        }
    });
    return await ERC725YEnumerableSetUtil.deploy(ownerAddress);
};

const deployPostFactory = async (deployedLSP2KeyUtil) => {
    const PostFactory = await ethers.getContractFactory("PostFactory", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });
    console.log("Start deploying PostFactory");
    const deployedPostFactory = await PostFactory.deploy();
    await deployedPostFactory.deployed();
    console.log("Successfully deployed PostFactory:", deployedPostFactory.address);
    return deployedPostFactory;
};

const deployPostWithLinkedLibraries = async (owner, profile, postType, content, referencedPost) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const Post = await ethers.getContractFactory("Post", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });
    return await Post.deploy(owner, profile, postType, content, referencedPost);
};

const deployProfileDataFactory = async (deployedLSP2KeyUtil) => {
    const ProfileDataFactory = await ethers.getContractFactory("ProfileDataFactory", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });

    console.log("Start deploying ProfileDataFactory");
    const deployedProfileDataFactory = await ProfileDataFactory.deploy();
    await deployedProfileDataFactory.deployed();
    console.log("Successfully deployed ProfileDataFactory:", deployedProfileDataFactory.address);
    return deployedProfileDataFactory;
};

const deployProfileDataWithLinkedLibraries = async (owner, user) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const ProfileData = await ethers.getContractFactory("ProfileData", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.address,
        }
    });
    return await ProfileData.deploy(owner, user);
};

const deployBlockBuzz = async (constructorParam, deployedPostFactory, deployedProfileDataFactory) => {
    const BlockBuzz = await ethers.getContractFactory("BlockBuzz", {
        libraries: {
            PostFactory: deployedPostFactory.address,
            ProfileDataFactory: deployedProfileDataFactory.address
        }
    });

    console.log("Start deploying BlockBuzz");
    const deployedBlockBuzz = await BlockBuzz.deploy(constructorParam);
    await deployedBlockBuzz.deployed();
    console.log("Successfully deployed BlockBuzz:", deployedBlockBuzz.address);
    return deployedBlockBuzz;
};

const deployBlockBuzzWithLinkedLibraries = async (constructorParam) => {
    const lsp2KeyUtil = await deployLSP2KeyUtil();
    const PostFactory = await deployPostFactory(lsp2KeyUtil);
    const ProfileDataFactory = await deployProfileDataFactory(lsp2KeyUtil);
    const blockBuzz = await deployBlockBuzz(constructorParam, PostFactory, ProfileDataFactory);

    return {
        blockBuzz,
        libraries: {
            lsp2KeyUtil,
            PostFactory,
            ProfileDataFactory,
        }
    };
};

module.exports = {
    deployLSP2KeyUtil,
    deployERC725YEnumerableSetUtilWithLinkedLibraries,
    deployPostFactory,
    deployPostWithLinkedLibraries,
    deployPostFactoryTestWithLinkedLibraries,
    deployProfileDataFactory,
    deployProfileDataWithLinkedLibraries,
    deployProfileDataFactoryTestWithLinkedLibraries,
    deployBlockBuzz,
    deployBlockBuzzWithLinkedLibraries
};