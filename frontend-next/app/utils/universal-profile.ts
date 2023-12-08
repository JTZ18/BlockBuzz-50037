// Crypto
import { ethers } from "ethers";
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js";
import erc725schema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import UniversalProfileArtifact from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import LSP6Schema from "@erc725/erc725.js/schemas/LSP6KeyManager.json";

// Custom
import { ERC725JsonRpcProvider } from "./ERC725JsonRpcProvider";

// Config
import {
  CONTROLLING_ADDRESS,
  IPFS_GATEWAY,
  RPC_URL,
  SOCIAL_NETWORK_CONTRACT_ADDRESS,
} from "../config";

// Contract
import { SocialNetwork } from "./social-network";

// Helper
import { fetchSocialProfileStatsByUniversalProfileAddress } from "./social-network-profile-data";
import { getImagesWithIPFSGateway } from "./ipfs-client";

// Types
import type { SocialNetworkProfile } from "../types/SocialNetworkProfile";
import type { UniversalProfile } from '../types/UniversalProfile';

const createPermissionFunctions = async (
  provider: ethers.providers.Web3Provider,
  profile: ethers.Contract
) => {
  const IUniversalProfile = new ethers.utils.Interface(
    UniversalProfileArtifact.abi
  );

  // const keyManagerAddress = await profile.owner();
  const keyManagerERC725 = new ERC725(
    LSP6Schema as ERC725JSONSchema[],
    profile.address,
    provider.provider
  );

  const addressPermissionsArray = await keyManagerERC725.getData('AddressPermissions[]');
  const controllers = addressPermissionsArray.value;
  // console.log(controllers)

  const permissionData = keyManagerERC725.encodeData([
    {
      keyName: "AddressPermissions:Permissions:<address>",
      dynamicKeyParts: SOCIAL_NETWORK_CONTRACT_ADDRESS,
      value: keyManagerERC725.encodePermissions({ CALL: true }),
    },
    {
      keyName: "AddressPermissions[]",
      value: [...controllers as string[], SOCIAL_NETWORK_CONTRACT_ADDRESS],
    },
  ]);
  console.log(permissionData)

  const hasNecessaryPermissions = async () => {
    if (!profile.address) return false;

    const upContract = new ethers.Contract(
      profile.address,
      IUniversalProfile,
      provider.getSigner()
    );
    const data = await upContract["getDataBatch(bytes32[])"](permissionData.keys);

    try {
      const addresses = ethers.utils.defaultAbiCoder.decode(
        ["address[]"],
        data[1]
      )[0];

      return (
        keyManagerERC725.decodePermissions(data[0]).CALL &&
        Boolean(
          addresses.find(
            (address: string) =>
              address.toLowerCase() ===
              SOCIAL_NETWORK_CONTRACT_ADDRESS.toLowerCase()
          )
        )
      );
    } catch (e) {
      console.error(e);
    }

    return false;
  };

  const setNecessaryPermissions = async (): Promise<boolean> => {
    const up = new ethers.Contract(
      profile.options.address as string,
      IUniversalProfile,
      provider.getSigner()
    );
    try {
      const tx = await up["setData(bytes32[],bytes[])"](
        permissionData.keys,
        permissionData.values,
        { gasLimit: 3000000 }
      );
      await tx.wait();
      return true;
    } catch (e) {}
    return false;
  };

  return {
    hasNecessaryPermissions,
    setNecessaryPermissions,
  };
};

export const initAuthenticatedProfile = async (
  provider: ethers.providers.Web3Provider,
  address: string
): Promise<null | UniversalProfile> => {
  if (!ethers.utils.isAddress(address)) {
    return null;
  }

  try {
    const contract = new ethers.Contract(
      address,
      UniversalProfileArtifact.abi,
      provider,
    );

    const profile = await fetchProfile(address);
    const permissionFunctions = await createPermissionFunctions(
      provider,
      contract
    );

    return {
      ...profile,
      ...permissionFunctions,
    } as UniversalProfile;
  } catch (error) {
    console.error(
      "initAuthenticatedProfile failed: This is not an ERC725 Contract",
      error
    );
  }

  return null;
};

export const fetchProfile = async (
  address: string,
  isInProfilePage?: boolean
): Promise<null | SocialNetworkProfile> => {
  if (!ethers.utils.isAddress(address)) return null;

  try {
    const contract = new ERC725(
      erc725schema as ERC725JSONSchema[],
      address,
      new ERC725JsonRpcProvider(RPC_URL),
      { ipfsGateway: IPFS_GATEWAY }
    );

  let profile: any = await contract.fetchData("LSP3Profile");
    profile = {
      address,
      ...(profile?.value?.LSP3Profile ?? {}),
    };

    if (profile.profileImage) {
      profile.profileImage = getImagesWithIPFSGateway(profile.profileImage);
    }

  // only do this when in profile page
    if (isInProfilePage) {
      if (profile.backgroundImage) {
        profile.backgroundImage = getImagesWithIPFSGateway(
          profile.backgroundImage
        );
      }

      profile.socialProfileStats =
        await fetchSocialProfileStatsByUniversalProfileAddress(address);
  }

    return profile as SocialNetworkProfile;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSocialNetworkProfileDataAddress = async (
  address: string
): Promise<string | null> => {
  const socialNetworkProfileDataContractAddress =
  await SocialNetwork.registeredUsers(address);

  return socialNetworkProfileDataContractAddress !==
    ethers.constants.AddressZero
    ? socialNetworkProfileDataContractAddress
    : null;
};
