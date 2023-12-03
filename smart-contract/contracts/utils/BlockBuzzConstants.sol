// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;


// >> ERC165 INTERFACE ID
bytes4 constant _INTERFACEID_BLOCKBUZZ = 0x2f317079; // calculated according to https://eips.ethereum.org/EIPS/eip-165
bytes4 constant _INTERFACEID_POST = 0x0eb17ad5; // added leading 0 as there were only 7 hex characters
bytes4 constant _INTERFACEID_PROFILE_DATA = 0x969417ce;


// >> ERC725Y entries
bytes32 constant _LSP8_TOKEN_ID_TYPE = 0x715f248956de7ce65e94d9d836bfead479f7e70d69b718d47bfe7b00e05b4fe4; // FIXME: unused?
bytes32 constant _LSP8_TOKEN_ID_TYPE_ADDRESS = bytes32(uint256(1)); // see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md
bytes32 constant _LSP8_TOKEN_ID_METADATA_TOKEN_ID = 0xcc7fc562b44177c340d03220c28fe518580f9d8e319743c51448fe1a6d5f1f05;
bytes32 constant _LSP8_TOKEN_ID_METADATA_MINTED_BY = 0xe86e057a4b6f736b9b671b1cd08c477e3af376d16d6695e0b4889f1d4cd7c431;

// ERC725Y LSP8 Metadata Contract - Post Content Key
// {"name":"PostContent","key":"3b4d830ee342ad4b33c99f522ce66fc49abba86849a9c6119df0f4d8d4a8a9fb","keyType":"Singleton","valueType":"bytes","valueContent":"JSONURL"}
bytes32 constant _LSP8_TOKEN_ID_METADATA_POST_CONTENT = 0x3b4d830ee342ad4b33c99f522ce66fc49abba86849a9c6119df0f4d8d4a8a9fb;

// ERC725Y EnumerableSet keys for Likes (map points to index in array, array contains universal profile addresses)
bytes12 constant _LIKES_MAP_KEY = 0x33056ac494aeec7d10b40000; // bytes10(keccak256('Likes')) + bytes2(0)
bytes32 constant _LIKES_ARRAY_KEY = 0x2618be4346d7c58321b84c074d793ec841444429da923dbe063e28174fdcdd7d; // keccak256('Likes[]')

// ERC725Y EnumerableSet keys for Comments (map points to index in array, array contains post addresses)
bytes12 constant _COMMENTS_MAP_KEY = 0x17973b9f7bb6d8486c560000; // bytes10(keccak256('Comments')) + bytes2(0)
bytes32 constant _COMMENTS_ARRAY_KEY = 0x8be2c4605ed4300eb51cf76cbc67f9297b3b477fbda4a5075c2bc040e9b1795a; // keccak256('Comments[]')

// ERC725Y EnumerableSet keys for Posts (map points to index in array, array contains post addresses)
bytes12 constant _POSTS_MAP_KEY = 0x6d292adc21db9c851ef70000; // bytes10(keccak256('Posts')) + bytes2(0)
bytes32 constant _POSTS_ARRAY_KEY = 0x067346167c5f38eac01466c62e425368e2edcbadafc53440635bc00e6b4bc455; // keccak256('Posts[]')

// ERC725Y EnumerableSet keys for followers (map points to index in array, array contains universal profile addresses)
bytes12 constant _FOLLOWERS_MAP_KEY = 0xfe5a4754b62469c4d3150000; // bytes10(keccak256('Followers')) + bytes2(0)
bytes32 constant _FOLLOWERS_ARRAY_KEY = 0x36a7eae2539dfc5adf8c03b49e8e5df03333dc10e9a75a62cdc65913ce9e58f9; // keccak256('Followers[]')

// ERC725Y EnumerableSet keys for following (map points to index in array, array contains universal profile addresses)
bytes12 constant _FOLLOWING_MAP_KEY = 0x4298e2fc0090ce9fdefb0000; // bytes10(keccak256('Following')) + bytes2(0)
bytes32 constant _FOLLOWING_ARRAY_KEY = 0xf172ee6286e64ccd01ff23babef14b88666e2730f522bf251f1fb6a47ccf8afb; // keccak256('Following[]')

