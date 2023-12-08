'use client';
// React
import React, { FC, useContext, useEffect,useState } from "react";

// Contexts
import EthersContext from "../context/EthersContext/EthersContext";

// Custom Component
import { LoadingButton } from "./ui/LoadingButton";
import { Button } from "./ui/button";
import CachedProfilesAndPostsContext from "../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import { SocialNetwork } from "../utils/social-network";


const ConnectUniversalProfileButton = () => {
  const { connectUniversalProfile, loading, universalProfile } =
    useContext(EthersContext);
  const [hasNecessaryPermissions, setHasPermissions] = useState<
  undefined | boolean
  >(undefined);

  const { refetchAll } = useContext(CachedProfilesAndPostsContext);
  const {
    provider,
    initSocialProfileData,
    logout,
  } = useContext(EthersContext);

  useEffect(() => {
    if (!universalProfile) {
      setHasPermissions(false);
    } else {
      setHasPermissions(undefined);
      universalProfile.hasNecessaryPermissions().then(setHasPermissions);
    }
  }, [universalProfile]);



  return (
    (loading || (!!universalProfile && !universalProfile?.socialNetworkProfileDataContract)) ? <LoadingButton /> : <Button onClick={connectUniversalProfile}>{universalProfile ? "SWITCH PROFILE" : "CONNECT PROFILE"}</Button>
  );
};

export default ConnectUniversalProfileButton;
