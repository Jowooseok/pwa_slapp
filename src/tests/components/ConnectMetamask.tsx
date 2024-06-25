import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useStore } from '../app/store';
import { backend } from '../../declarations/backend';
import { useNavigate } from 'react-router-dom';

function ConnectMetamask() {
  const { ethAddress, icpAddress, setEthAddress, setIcpAddress } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (ethAddress && icpAddress) {
      // Call backend to register user
      registerUser(ethAddress, icpAddress);
    }
  }, [ethAddress, icpAddress]);

  const connectMetamask = async () => {
    if (window.ethereum && window.ethereum.request) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setEthAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // 이후의 signer를 사용한 로직을 추가할 수 있습니다.

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
      navigate('/user');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <button onClick={connectMetamask}>
      {ethAddress ? `Connected: ${ethAddress}` : 'Connect Metamask'}
    </button>
  );
}

export default ConnectMetamask;
