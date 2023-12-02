// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { lspFactory } = require("hardhat");
const { deployBlockBuzzWithLinkedLibraries } = require("./deploy-utils");

async function main() {
  const accounts = await hre.ethers.getSigners();

  const constructorParam = hre.ethers.getBytes("0x6f357c6ad575b7fd3a648e998af8851efb8fc396805b73a3f72016df79dfedce79c76a53697066733a2f2f516d6563726e6645464c4d64573642586a4a65316e76794c6450655033435967516258774e6d593850374c666553");
  const { blockBuzz } = await deployBlockBuzzWithLinkedLibraries(constructorParam);
  await blockBuzz.waitForDeployment();

  console.log("BlockBuzz deployed to:", blockBuzz.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
