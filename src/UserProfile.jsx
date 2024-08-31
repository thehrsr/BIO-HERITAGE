import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve authentication token from local storage
        const authToken = localStorage.getItem('authToken');
        // If authentication token is not present, redirect to login page
        if (!authToken) {
          navigate('/login');
          return;
        }
        // Fetch user data from backend using the authentication token
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // Set user data state
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle unauthorized or other errors
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]); // Dependency on navigate to ensure redirection works

  return (
    <div>
      {userData ? (
        <div>
          <h2>User Profile</h2>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>City: {userData.city}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfile;
