// React
import React, { useState, useContext, useEffect } from "react";

import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

import { Input } from "./ui/input"
import { Label } from "./ui/label"

// Toast
import { toast, useToast } from "./ui/use-toast"


// Context
import EthersContext from "../context/EthersContext/EthersContext";
import CachedProfilesAndPostsContext from "../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";

// Contract
import { SocialNetwork } from "../utils/social-network";

const RegistrationDialog = ({showModal, setShowModal}) => {
  const [hasNecessaryPermissions, setHasPermissions] = useState<
    undefined | boolean
  >(undefined);
  const { refetchAll } = useContext(CachedProfilesAndPostsContext);
  const {
    provider,
    universalProfile,
    initSocialProfileData,
    logout,
  } = useContext(EthersContext);

  const [registrationInProgress, setRegistrationInProgress] =
    useState<boolean>(false);
  const [settingPermissionsInProgress, setSettingPermissionsInProgress] =
    useState<boolean>(false);

  useEffect(() => {
    if (!universalProfile) {
      setHasPermissions(false);
    } else {
      setHasPermissions(undefined);
      universalProfile.hasNecessaryPermissions().then(setHasPermissions);
    }
  }, [universalProfile]);

  const validate = (): boolean =>
    Boolean(provider) && Boolean(universalProfile);

  const register = async (): Promise<boolean> => {
    if (!validate()) return false;
    if (universalProfile!.socialNetworkProfileDataERC725Contract) return true; // already registered

    setRegistrationInProgress(true);
    try {
      const tx = await SocialNetwork.connect(provider!.getSigner()).register();
      await tx.wait();
      await initSocialProfileData();
    } catch (e) {
      // console.error("❌ register failed: ", e);
      setRegistrationInProgress(false);
      return false;
    }

    await refetchAll();
    setRegistrationInProgress(false);
    return true;
  };

  const setPermissions = async (): Promise<boolean> => {
    if (!validate()) return false;
    if (await universalProfile!.hasNecessaryPermissions()) return true;

    setSettingPermissionsInProgress(true);
    const hasPermissions = await universalProfile!.setNecessaryPermissions();
    setHasPermissions(hasPermissions);
    setSettingPermissionsInProgress(false);

    return hasPermissions;
  };

  const onDisagree = () => {
    setRegistrationInProgress(false);
    setSettingPermissionsInProgress(false);
    logout();
  };

  const onAgree = async () => {
    if (!(await register())) {
      // toast.error(`Registration failed`);
      return;
    }
    if (!(await setPermissions())) {
      // toast.error(`Setting necessary permissions failed`);
      return;
    }
  };

  return (
    <>
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hello!</AlertDialogTitle>
            <AlertDialogDescription>
              To register you to our platform, we require you to give our platform permissions to register your account to BlockBuzz. Please take a look at your UP to confirm the registration transaction
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onDisagree}>Disagree</AlertDialogCancel>
            <AlertDialogAction onClick={onAgree}>Agree</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RegistrationDialog;
