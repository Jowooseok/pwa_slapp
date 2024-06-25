import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { backend } from '../../declarations/backend';
import { useStore } from '../app/store';

function ConnectDfinityWallet() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { icpAddress, ethAddress, setIcpAddress, setEthAddress } = useStore();

  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create();

      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
      }
    };

    initAuthClient();
  }, []);

  useEffect(() => {
    if (icpAddress && ethAddress) {
      // Call backend to register user
      registerUser(ethAddress, icpAddress);
    }
  }, [icpAddress, ethAddress]);

  const handleAuthenticated = async (authClient: AuthClient) => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();
    setIcpAddress(principal);
    setIsAuthenticated(true);
  };

  const login = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: 'https://identity.ic0.app',
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  };

  const connectMetamask = async () => {
    if (window.ethereum && window.ethereum.request) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setEthAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting to Metamask:', error);
      }
    } else {
      console.error('Metamask is not installed. Please install it to use this feature.');
    }
  };

  const registerUser = async (ethAddress: string, icpAddress: string) => {
    try {
      await backend.register_user(ethAddress, icpAddress);
      console.log(`Registered user: ETH Address - ${ethAddress}, ICP Address - ${icpAddress}`);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Connected: {icpAddress}</p>
        </div>
      ) : (
        <div>
          <button onClick={login}>Connect Dfinity Wallet</button>
          <button onClick={connectMetamask}>Connect Metamask</button>
        </div>
      )}
    </div>
  );
}

export default ConnectDfinityWallet;
