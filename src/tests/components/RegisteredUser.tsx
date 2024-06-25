import React, { useEffect, useState } from 'react';
import { backend } from '../../declarations/backend';
import { Principal } from '@dfinity/principal';

interface User {
  user_principal: Principal;
  eth_address: string;
  icp_address: string;
  registered_at: bigint;
}

function RegisteredUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData: [User] | [] = await backend.get_registered_user();
      if (userData && userData[0]) {
        setUser(userData[0]);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <pre>{JSON.stringify({
          user_principal: user.user_principal.toString(),
          icp_address: user.icp_address,
          eth_address: user.eth_address,
          registered_at: user.registered_at.toString()
        }, null, 2)}</pre>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
}

export default RegisteredUser;
