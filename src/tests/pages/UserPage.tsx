import React from 'react';
import { useNavigate } from 'react-router-dom';
import { backend } from '../../declarations/backend';
import RegisteredUser from "../components/RegisteredUser";

function UserPage() {
  const navigate = useNavigate();

  const deleteUser = async () => {
    try {
      await backend.delete_user();
      console.log('User deleted successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return(
      <div className="AuthPage">
        <h1 className="text-3xl font-bold underline">Users</h1>
        <div className="wallet-connect-buttons">
          {/* display registered Users */}
          <RegisteredUser />

          <button onClick={deleteUser} className="delete-button">
            Delete User
          </button>
        </div>
      </div>
  );
}

export default UserPage;