const erc165 = require("erc165");
const blockbuzzabi = require('../artifacts/contracts/BlockBuzz.sol/BlockBuzz.json');
const profileAbi = require('../artifacts/contracts/ProfileData.sol/ProfileData.json');
const postAbi = require('../artifacts/contracts/Post.sol/Post.json');

const blockbuzz_interface_id = erc165.interfaceIdFromABI( blockbuzzabi.abi ) // 0x2f317079
const profile_data_interface_id = erc165.interfaceIdFromABI( profileAbi.abi ) // 0x969417ce
const post_interface_id = erc165.interfaceIdFromABI( postAbi.abi ) // 0xeb17ad5

console.log( blockbuzz_interface_id, profile_data_interface_id, post_interface_id )

