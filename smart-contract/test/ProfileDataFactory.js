// Hardhat
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

// Constants
const BlockBuzzConstants = require("../constants/BlockBuzzConstants");

// ABI
const IERC165ABI = require("@openzeppelin/contracts/build/contracts/IERC165.json").abi;
const ProfileDataABI = require("../artifacts/contracts/ProfileData.sol/ProfileData.json").abi;

// Helper
const { deployProfileDataFactoryTestWithLinkedLibraries } = require("../scripts/deploy-utils");

describe("ProfileDataFactoryTest", () => {
    const deployFixture = async () => {
        const accounts = await ethers.getSigners();

        const deployedProfileDataFactoryTest = await deployProfileDataFactoryTestWithLinkedLibraries(accounts[0].address);

        const createValidProfileData = async (owner) => {
            const tx = await deployedProfileDataFactoryTest.createProfileData(owner.address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedProfileData");
            const ProfileDataInterface = new ethers.utils.Interface(ProfileDataABI);
            return new ethers.Contract(event.args.newProfileData, ProfileDataInterface, owner);
        };

        return {
            accounts,
            deployedProfileDataFactoryTest,
            createValidProfileData
        };
    };

    describe("function createProfileData(address _user) public returns (address)", () => {
        it("Should create instance of ProfileData contract and emit CreatedProfileData event", async () => {
            const { accounts, deployedProfileDataFactoryTest } = await loadFixture(deployFixture);

            await expect(deployedProfileDataFactoryTest.createProfileData(accounts[0].address))
                .to.emit(deployedProfileDataFactoryTest, "CreatedProfileData")
                .withArgs(accounts[0].address, anyValue);
        });

        it(`Should create valid instance of ProfileData which supports the interface id ${BlockBuzzConstants.INTERFACE_IDS.ProfileData}`, async () => {
            const { accounts, deployedProfileDataFactoryTest } = await loadFixture(deployFixture);
            const tx = await deployedProfileDataFactoryTest.createProfileData(accounts[0].address);
            const receipt = await tx.wait();
            const event = receipt.events.find(element => element.event === "CreatedProfileData");
            expect(event).not.to.be.null;
            expect(event.args.user).to.eql(accounts[0].address);

            const erc165 = new ethers.Contract(event.args.newProfileData, IERC165ABI, accounts[0]);
            expect(await erc165.supportsInterface(BlockBuzz.INTERFACE_IDS.ProfileData)).to.be.equal(true);
        });

        it("Should set ProfileDataFactory contract instance's address as owner of profile data (owner != user)", async () => {
            const { accounts, deployedProfileDataFactoryTest, createValidProfileData } = await loadFixture(deployFixture);

            const profileData = await createValidProfileData(accounts[0]);

            expect(await profileData.owner()).to.eql(deployedProfileDataFactoryTest.address);
        });
    });
});