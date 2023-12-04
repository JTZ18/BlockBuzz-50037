// React
import React, { FC, useEffect, useMemo, useState } from "react";

// Crypto
import { ethers } from "ethers";

// React Toast
// import { Id, toast } from "react-toastify";
import { useToast } from "@/app/components/ui/use-toast";

// Context
import EthersContext from "./EthersContext";

// Constants
import {
  ADDRESS_IS_NOT_UNIVERSAL_PROFILE,
  LUKSO_L16_CHAIN_ID,
  REQUESTING_PENDING,
  USER_REJECTED_REQUEST,
} from "./EthersConstants";

// Contract Functions
import {
  getSocialNetworkProfileDataAddress,
  initAuthenticatedProfile,
} from "../../utils/universal-profile";
import {
  createSocialNetworkProfileDataContract,
  createSocialNetworkProfileDataERC725Contract,
  fetchSocialProfileStatsByUniversalProfileAddress,
} from "../../utils/social-network-profile-data";

// Contract
import { SocialNetwork } from "../../utils/social-network";

// Types
import type {
  UniversalProfile,
  SocialNetworkProfileDataContracts,
} from "../../types/UniversalProfile";
import type { EthersContextValue } from "./EthersContext";
import type { MyError } from "@/app/types/MyError";

export interface Props {
  children: React.ReactNode;
}

// Context Provider
const EthersContextProvider: FC<Props> = ({ children }) => {
  const [provider] = useState<null | ethers.providers.Web3Provider>(
    window?.ethereum
      ? new ethers.providers.Web3Provider(
          window?.ethereum as ethers.providers.ExternalProvider
        )
      : null
  );
  const { toast } = useToast()

  const [isUniversalProfileExtension, setIsUniversalProfileExtension] =
    useState<boolean>(false);
  const [universalProfile, setUniversalProfile] =
    useState<null | UniversalProfile>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const showError = (content: null | string | React.ReactNode) => {
    if (error) {
      toast({
        title: "Error",
        description: `${error}`,
      })
    }

    if (content) {
      setError(toast({ title: "Error", description: `${content}`}).id);
    }
  };

  const clearError = () => showError(null);

  const createSocialNetworkProfileDataContracts = async (
    universalProfile: null | UniversalProfile
  ): Promise<SocialNetworkProfileDataContracts> => {
    const contracts: SocialNetworkProfileDataContracts = {
      socialNetworkProfileDataContract: null,
      socialNetworkProfileDataERC725Contract: null,
    };

    if (!universalProfile) return contracts;

    let socialNetworkProfileDataContractAddress: null | string =
      await getSocialNetworkProfileDataAddress(universalProfile.address);
    if (!socialNetworkProfileDataContractAddress) return contracts;

    contracts.socialNetworkProfileDataContract =
      createSocialNetworkProfileDataContract(
        socialNetworkProfileDataContractAddress
      );
    contracts.socialNetworkProfileDataERC725Contract =
      createSocialNetworkProfileDataERC725Contract(
        socialNetworkProfileDataContractAddress
      );

    return contracts;
  };

  const initSocialProfileData = async () => {
    if (!universalProfile) return;

    const socialNetworkProfileDataContracts =
      await createSocialNetworkProfileDataContracts(universalProfile);

    const socialProfileStats =
      await fetchSocialProfileStatsByUniversalProfileAddress(
        universalProfile.address
      );

    setUniversalProfile((universalProfile) =>
      universalProfile
        ? {
            ...universalProfile,
            ...socialNetworkProfileDataContracts,
            socialProfileStats,
          }
        : null
    );
  };

  const requestingAccountSucceeded = async () => {
    if (!provider) return;

    const universalProfileAddress = await provider.getSigner().getAddress();
    let universalProfile = await initAuthenticatedProfile(
      provider,
      universalProfileAddress
    );

    if (!universalProfile) {
      setUniversalProfile(null);
      console.error(
        "❌ fetching universal profile data failed: ",
        ADDRESS_IS_NOT_UNIVERSAL_PROFILE(universalProfileAddress)
      );
      showError(
        <>
          Fetching universal profile data for {universalProfileAddress} failed.
          Please make sure that you are using the{" "}
            Lukso UP browser extension
        </>
      );
      return;
    }

    universalProfile = {
      ...universalProfile,
      ...(await createSocialNetworkProfileDataContracts(universalProfile)),
      socialProfileStats:
        await fetchSocialProfileStatsByUniversalProfileAddress(
          universalProfile.address
        ),
    };

    setUniversalProfile(universalProfile);

    clearError();

    console.log(
      "✅ eth_requestAccounts succeeded: ",
      universalProfileAddress,
      universalProfile
    );
  };

  const requestingAccountPending = () => clearError();

  const requestingAccountFailed = async (code: number, message: string) => {
    showError(message as string);
    console.error("❌ eth_requestAccounts failed: ", message, code);
  };

  const connectUniversalProfile = async () => {
    if (!provider) return;
    if (loading) return;

    if (!isUniversalProfileExtension) {
      showError(
        <>
          We are sorry, but this DApp only supports the Lukso UP browser
          extension.{" "}
        </>
      );
      return;
    }

    clearError();
    setUniversalProfile(null);
    setLoading(true);

    try {
      await provider?.send("eth_requestAccounts", []);
      await requestingAccountSucceeded();
      setLoading(false);
      // set localStorage to true
      localStorage.setItem("isUniversalProfileExtension", "true");
    } catch (error) {
      const { code, message } = error as MyError;
      if (code === REQUESTING_PENDING) {
        requestingAccountPending();
        return;
      } else if (code === USER_REJECTED_REQUEST) {
        setLoading(false);
        return;
      }

      await requestingAccountFailed(code as number, message as string);
      setLoading(false);
    }
  };

  const logout = () => setUniversalProfile(null);

  useEffect(() => {
    if (!provider) return;

    provider!.on("network", () => {
      setIsUniversalProfileExtension(
        provider!._network?.chainId === LUKSO_L16_CHAIN_ID &&
          !provider!.provider.isMetaMask
      );
    });

    return () => {
      provider!.removeAllListeners("network");
    };
  }, []);

  const value: EthersContextValue = useMemo<EthersContextValue>(
    () => ({
      provider,
      isUniversalProfileExtension,
      universalProfile,
      connectUniversalProfile,
      initSocialProfileData,
      logout,
      loading,
    }),
    [provider, isUniversalProfileExtension, universalProfile, loading, error]
  );

  return (
    <EthersContext.Provider value={value}>{children}</EthersContext.Provider>
  );
};

export default EthersContextProvider;