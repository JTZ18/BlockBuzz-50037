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
    // <LoadingButton
    //   loading={
    //     loading ||
    //     (!!universalProfile &&
    //       !universalProfile?.socialNetworkProfileDataContract)
    //   }
    //   loadingText="Waiting..."
    //   sx={{
    //     width: "100%",
    //     pt: 1,
    //     pb: 1,
    //     bgcolor: "black",
    //     color: (theme) => theme.palette.secondary.main,
    //     "&:hover": {
    //       bgcolor: "rgba(0,0,0,0.7)",
    //     },
    //     fontSize: "0.75rem",
    //     ...(sx ?? {}),
    //   }}
    //   onClick={connectUniversalProfile}
    //   buttonProps={{ variant: "contained" }}
    // >
    //   {universalProfile ? "SWITCH PROFILE" : "CONNECT PROFILE"}
    // </LoadingButton>

    (loading || (!!universalProfile && !universalProfile?.socialNetworkProfileDataContract)) ? <LoadingButton /> : <Button onClick={connectUniversalProfile}>{universalProfile ? "SWITCH PROFILE" : "CONNECT PROFILE"}</Button>
  );
};

export default ConnectUniversalProfileButton;
