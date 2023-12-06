'use client';
// React
import React, { FC, useContext } from "react";

// Contexts
import EthersContext from "@/app/context/EthersContext/EthersContext";

// Custom Component
import { LoadingButton } from "./ui/LoadingButton";
import { Button } from "./ui/button";


const ConnectUniversalProfileButton = () => {
  const { connectUniversalProfile, loading, universalProfile } =
    useContext(EthersContext);

  return (
    (loading || (!!universalProfile && !universalProfile?.socialNetworkProfileDataContract)) ? <LoadingButton /> : <Button onClick={connectUniversalProfile}>{universalProfile ? "SWITCH PROFILE" : "CONNECT PROFILE"}</Button>
  );
};

export default ConnectUniversalProfileButton;
