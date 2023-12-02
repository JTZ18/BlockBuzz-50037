const { ethers } = require("hardhat");

const deployLSP2KeyUtil = async () => {
    const LSP2KeyUtil = await ethers.getContractFactory("LSP2KeyUtil");
    console.log("Start deploying LSP2KeyUtil");
    const deployedLSP2KeyUtil = await LSP2KeyUtil.deploy();
    await deployedLSP2KeyUtil.waitForDeployment();
    console.log(deployedLSP2KeyUtil.target)
    console.log("Successfully deployed LSP2KeyUtil: ", deployedLSP2KeyUtil.target);
    return deployedLSP2KeyUtil;
};

const deployERC725YEnumerableSetUtilWithLinkedLibraries = async (ownerAddress) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const ERC725YEnumerableSetUtil = await ethers.getContractFactory("ERC725YEnumerableSetUtil", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.target
        }
    });
    return await ERC725YEnumerableSetUtil.deploy(ownerAddress);
};

const deployPostFactory = async (deployedLSP2KeyUtil) => {
    const PostFactory = await ethers.getContractFactory("PostFactory", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.target,
        }
    });
    console.log("Start deploying PostFactory");
    const deployedPostFactory = await PostFactory.deploy();
    await deployedPostFactory.waitForDeployment();
    console.log("Successfully deployed PostFactory: ", deployedPostFactory.target);
    return deployedPostFactory;
};

const deployPostFactoryTestWithLinkedLibraries = async () => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const deployedPostFactory = await deployPostFactory(deployedLSP2KeyUtil);
    const PostFactoryTest = await ethers.getContractFactory("PostFactoryTest", {
        libraries: {
            PostFactory: deployedPostFactory.target,
        }
    });
    return await PostFactoryTest.deploy();
};

const deployPostWithLinkedLibraries = async (owner, author, postType, taggedUsers, data, referencedPost) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const Post = await ethers.getContractFactory("Post", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.target,
        }
    });
    return await Post.deploy(owner, author, postType, taggedUsers, data, referencedPost);
};

const deployProfileDataFactory = async (deployedLSP2KeyUtil) => {
    const ProfileDataFactory = await ethers.getContractFactory("ProfileDataFactory", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.target,
        }
    });

    console.log("Start deploying ProfileDataFactory");
    const deployedProfileDataFactory = await ProfileDataFactory.deploy();
    await deployedProfileDataFactory.waitForDeployment();
    console.log("Successfully deployed ProfileDataFactory: ", deployedProfileDataFactory.target);
    return deployedProfileDataFactory;
};

const deployProfileDataFactoryTestWithLinkedLibraries = async () => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const deployedProfileDataFactory = await deployProfileDataFactory(deployedLSP2KeyUtil);
    const ProfileDataFactoryTest = await ethers.getContractFactory("ProfileDataFactoryTest", {
        libraries: {
            ProfileDataFactory: deployedProfileDataFactory.target,
        }
    });
    return await ProfileDataFactoryTest.deploy();
};

const deployProfileDataWithLinkedLibraries = async (owner, user) => {
    const deployedLSP2KeyUtil = await deployLSP2KeyUtil();
    const ProfileData = await ethers.getContractFactory("ProfileData", {
        libraries: {
            LSP2KeyUtil: deployedLSP2KeyUtil.target,
        }
    });
    return await ProfileData.deploy(owner, user);
};

const deployBlockBuzz = async (constructorParam, deployedPostFactory, deployedProfileDataFactory) => {
    const BlockBuzz = await ethers.getContractFactory("BlockBuzz", {
        libraries: {
            PostFactory: deployedPostFactory.target,
            ProfileDataFactory: deployedProfileDataFactory.target
        }
    });

    console.log("Start deploying BlockBuzz");
    const deployedBlockBuzz = await BlockBuzz.deploy(constructorParam);
    await deployedBlockBuzz.waitForDeployment();
    console.log("Successfully deployed BlockBuzz: ", deployedBlockBuzz.target);
    return deployedBlockBuzz;
};

const deployBlockBuzzWithLinkedLibraries = async (constructorParam) => {
    const lsp2KeyUtil = await deployLSP2KeyUtil();
    const PostFactory = await deployPostFactory(lsp2KeyUtil);
    const ProfileDataFactory = await deployProfileDataFactory(lsp2KeyUtil);
    const BlockBuzz = await deployBlockBuzz(constructorParam, PostFactory, ProfileDataFactory);

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
    deployProfileDataFactory,
    deployProfileDataWithLinkedLibraries,
    deployBlockBuzz,
    deployBlockBuzzWithLinkedLibraries
};