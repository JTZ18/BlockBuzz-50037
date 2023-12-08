'use client';
import React from 'react';
import { IWeb3Context, useWeb3Context } from '../context/Web3Context'
import { Button } from './ui/button';

const ConnectWalletButton: React.FC = () => {

  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChain, provider },
  } = useWeb3Context() as IWeb3Context;

  return (
    <div>
        {!isAuthenticated ? (
        <Button
          onClick={connectWallet}
          variant="default"
        >
          Connect wallet
        </Button>
      ) : (
        <Button
          onClick={disconnect}
          variant="destructive"
        >
          Disconnect
        </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
