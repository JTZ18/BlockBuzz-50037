const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const BlockBuzzConstants = require("../constants/BlockBuzzConstants");

const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;

const { deployProfileDataWithLinkedLibraries } = require("../util/deploy");

describe("ProfileData", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const createProfileData = async (user) => {
            return await deployProfileDataWithLinkedLibraries(accounts[0].address, user);
        };

        return {
            accounts,
            createProfileData
        };
    };

    describe("constructor(address _owner, address _user) ERC725YEnumerableSetUtil(_owner)", () => {
        it(`Should create valid instance of ProfileData which supports the interface id: ${BlockBuzzConstants.INTERFACE_IDS.ProfileData}`, async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);
            const profileData = await createProfileData(accounts[1].address);

            const erc165 = new ethers.Contract(profileData.address, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(BlockBuzzConstants.INTERFACE_IDS.ProfileData)).to.be.equal(true);
        });

        it("Should assign param _user to storage variable user", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[1].address);

            expect(await profileData.user()).to.eql(accounts[1].address);
        });

        it("Should set deployer's address as owner of post (owner != author)", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[1].address);

            expect(await profileData.owner()).to.eql(accounts[0].address);
        });
    });

    describe("function isProfileOf(address _post) external view returns (bool)", () => {
        it("Should return true if the user is author of the given address", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            profileData.addPost(accounts[1].address);

            expect(await profileData.isProfileOf(accounts[1].address)).to.eql(true);
        });

        it("Should return false if the user is not author of the given address", async () => {
            const { accounts, createProfileData } = await loadFixture(deployFixture);

            const profileData = await createProfileData(accounts[0].address);

            expect(await profileData.isProfileOf(accounts[1].address)).to.eql(false);
        });
    });
});