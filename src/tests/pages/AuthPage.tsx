import React from 'react';
import ConnectMetamask from '../components/ConnectMetamask';
import ConnectDfinityWallet from '../components/ConnectDifinityWallet';

function AuthPage() {
  return (
    <div className="AuthPage">
      <h1 className="text-3xl font-bold underline">Login / Sign Up</h1>
      <div className="wallet-connect-buttons">
        <ConnectMetamask />
        <ConnectDfinityWallet/>
      </div>
    </div>
  );
}

export default AuthPage;
