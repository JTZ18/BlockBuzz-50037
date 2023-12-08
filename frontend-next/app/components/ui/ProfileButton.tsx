'use client';
import React, { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { IWeb3Context, useWeb3Context } from '../../context/Web3Context'
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import EthersContext from "../../context/EthersContext/EthersContext";
import Link from "next/link";

const ProfileButton = () => {
  // const {
  //   connectWallet,
  //   disconnect,
  //   state: { isAuthenticated, address, currentChain, provider },
  // } = useWeb3Context() as IWeb3Context;
  const { logout, universalProfile } = useContext(EthersContext)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={universalProfile?.profileImage?.[0]?.url} />
          <AvatarFallback>{universalProfile?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" ><Link href={`/profile/${universalProfile?.address}`}>Profile</Link></DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;