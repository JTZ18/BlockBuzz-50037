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

  const constructorParam = hre.ethers.getBytes("0x6f357c6ad575b7fd3a648e998af8851efb8fc396805b73a3f72016df79dfedce79c76a53697066733a2f2f516d514c6361627352395a54554b65456435556937335132677846683579506e7565443275765456765059517138");
  const { blockBuzz } = await deployBlockBuzzWithLinkedLibraries(constructorParam);
  await blockBuzz.deployed();

  console.log("BlockBuzz deployed to:", blockBuzz.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/**
 * Testnet deployment: logs
Start deploying LSP2KeyUtil
0x622a857ca3870cBb16B90E6c91581406e312e95f
Successfully deployed LSP2KeyUtil:  0x622a857ca3870cBb16B90E6c91581406e312e95f
Start deploying PostFactory
Successfully deployed PostFactory:  0x9e3C132aF0E1404A72e9b09FD14442D74422Aa7c
Start deploying ProfileDataFactory
Successfully deployed ProfileDataFactory:  0x1285B5c3D90cA8fDDe68E9611e8edDC536ff3BA1
Start deploying BlockBuzz
Successfully deployed BlockBuzz:  0x36dB9B36E5cf4cc4A77105F547ADA074Bb9c7b28
BlockBuzz deployed to: 0x36dB9B36E5cf4cc4A77105F547ADA074Bb9c7b28
 */