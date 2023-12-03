
import { LSPFactory } from '@lukso/lsp-factory.js';
import { create } from "ipfs-http-client";
import { ethers } from 'ethers';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';
const IPFS_UPLOAD_GATEWAY = 'https://api.2eff.lukso.dev/api/v0'

// Step 1 - Create a new LSP3Profile JSON file
import jsonFile from '../misc/lsp4metadata.json' assert { type: 'json' };

const ipfsClient = create({ url: IPFS_UPLOAD_GATEWAY });

// const getLSP2JSONURL = (json, ipfsURL) => {
//   const hashFunction = ethers.dataSlice(
//     ethers.keccak256(ethers.toUtf8Bytes("keccak256(utf8)")),
//     0,
//     4
//   );
//   const hashedJSON = ethers
//     .keccak256(ethers.toUtf8Bytes(JSON.stringify(json)))
//     .substring(2);

//   const hexlifiedIpfsURL = ethers
//     .toBeHex(ethers.toUtf8Bytes(ipfsURL))
//     .substring(2);

//   const jsonURL = hashFunction + hashedJSON + hexlifiedIpfsURL;

//   return jsonURL;
// };

// const uploadJSONToIPFSAndGetLSP2JSONURL = async (json) => {
//   const cid = await uploadJSONToIPFS(json);
//   if(!cid) return null;
//   return await getLSP2JSONURL(json, `ipfs://${cid}`);
// };

const uploadJSONToIPFS = async (json) => {
  const uploadResult = await ipfsClient.add(JSON.stringify(json));
  if(!uploadResult?.cid) return null;
  return uploadResult.cid.toString();
};

const main = async () => {
  // const jsonurl = await uploadJSONToIPFSAndGetLSP2JSONURL(jsonFile);
  const jsonurl = await uploadJSONToIPFS(jsonFile)
  console.log(jsonurl);
}

main()