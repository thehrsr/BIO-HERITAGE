import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';


function Profile() {
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
    <Container className="text-center mt-5">
    {userData ? (
      <Row className="justify-content-center">
        <Col md={4}>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>City:</strong> {userData.city}</p>
          
        </Col>
      </Row>
    ) : (
      <p>Loading...</p>
    )}
  </Container>
  );
}

export default Profile;
