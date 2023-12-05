// >> ERC165 INTERFACE ID

// calculated according to https://eips.ethereum.org/EIPS/eip-165
const INTERFACE_IDS = {
  BlockBuzz: "0x2f317079",
  ProfileData: "0x969417ce",
  Post: "0x0eb17ad5"
};

// >> ERC725Y
const LSP8TokenIdTypeAddress = 1;
const ERC725YKeys = {
  LSP8: { // see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md
      TokenId: {
          Type: "0x715f248956de7ce65e94d9d836bfead479f7e70d69b718d47bfe7b00e05b4fe4",
          Metadata: {
              MintedBy: "0xe86e057a4b6f736b9b671b1cd08c477e3af376d16d6695e0b4889f1d4cd7c431",
              TokenId: "0xcc7fc562b44177c340d03220c28fe518580f9d8e319743c51448fe1a6d5f1f05"
          }
      }
  },
  LSP8Custom: { // {"name":"PostContent","key":"0x3b4d830ee342ad4b33c99f522ce66fc49abba86849a9c6119df0f4d8d4a8a9fb","keyType":"Singleton","valueType":"bytes","valueContent":"JSONURL"}
      TokenId: {
          Metadata: {
              PostContent: "0x3b4d830ee342ad4b33c99f522ce66fc49abba86849a9c6119df0f4d8d4a8a9fb"
          }
      }
  },
  EnumerableSet: { // Custom ERC725Y EnumerableSet
      Likes: {
          Array: {
              length: "0x2618be4346d7c58321b84c074d793ec841444429da923dbe063e28174fdcdd7d",
              index: "0x2618be4346d7c58321b84c074d793ec8"
          }, // keccak256('Likes[]')
          Map: "0x33056ac494aeec7d10b40000" // bytes10(keccak256('Likes')) + bytes2(0)
      },
      Comments: {
          Array: {
              length: "0x8be2c4605ed4300eb51cf76cbc67f9297b3b477fbda4a5075c2bc040e9b1795a",
              index: "0x8be2c4605ed4300eb51cf76cbc67f929"
          }, // keccak256('Comments[]')
          Map: "0x17973b9f7bb6d8486c560000" // bytes10(keccak256('Comments')) + bytes2(0)
      },
      Following: {
          Array: {
              length: "0xf172ee6286e64ccd01ff23babef14b88666e2730f522bf251f1fb6a47ccf8afb",
              index: "0xf172ee6286e64ccd01ff23babef14b88"
          }, // keccak256('Following[]')
          Map: "0x4298e2fc0090ce9fdefb0000" // bytes10(keccak256('Following')) + bytes2(0)
      },
      Followers: {
          Array: {
              length: "0x36a7eae2539dfc5adf8c03b49e8e5df03333dc10e9a75a62cdc65913ce9e58f9",
              index: "0x36a7eae2539dfc5adf8c03b49e8e5df0"
          }, // keccak256('Followers[]')
          Map: "0xfe5a4754b62469c4d3150000" // bytes10(keccak256('Followers')) + bytes2(0)
      },
      Posts: {
          Array: {
              length: "0x067346167c5f38eac01466c62e425368e2edcbadafc53440635bc00e6b4bc455",
              index: "0x067346167c5f38eac01466c62e425368"
          }, // keccak256('Posts[]')
          Map: "0x6d292adc21db9c851ef70000" // bytes10(keccak256('Posts')) + bytes2(0)
      }
  }
};


const ERC725YValues = {
  LSP4: {
      TokenName: "BlockBuzzPost",
      TokenSymbol: "BBP"
  }
};

const Errors = {
  Modifier: {
      OnlyOwner: "Ownable: caller is not the owner",
  },
  BlockBuzz: {
      UserNotLikedPost: "User did not like the post yet",
      UserLikedPost: "User has already liked the post",
      UserNotFollower: "User is not a follower yet",
      UserIsFollower: "User is already a follower",
      PostAddressNotValid: "Post address is not pointing to a valid post (Post interface not available)",
  },
  Post: {
      constructor: {
          UnsupportedInterface: "Target post address must support the POST interface (ERC165)",
      }
  }
};

const PostType = {
  MAIN: 0,
  COMMENT: 1,
};

module.exports = {
  INTERFACE_IDS,
  LSP8TokenIdTypeAddress,
  ERC725YKeys,
  ERC725YValues,
  Errors,
  PostType
};