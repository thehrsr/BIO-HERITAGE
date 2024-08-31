import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Animal from './Animal';
import Home from './Home';
import Community from './Community';
import Login from './Login';
import Signup from './Signup';
import a from './abcd.png';
import Post from './Post';
import Mapp from './Mapp';
import Features from './Features';

function Navv() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log("no token found");
        }
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          console.log('login');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = "http://localhost:3000/login";
  };

  return (
    <>
      <Router>
        <Navbar bg="dark" variant="dark" className="sticky-top">
          <Container>
            <Nav className="justify-content-start">
              <Navbar.Brand as={Link} to="/home">EcoSafari by</Navbar.Brand>
              <img style={{ width: "170px" }} src={a} alt="" />
            </Nav>

            <Nav className="justify-content-center">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/animal">Find</Nav.Link>
              <Nav.Link as={Link} to="/community">Community</Nav.Link>
              <Nav.Link as={Link} to="/post">Post</Nav.Link>
              <Nav.Link as={Link} to="/map">Map</Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              {userData ? (
                <>
                  <Nav.Item style={{ color: "white" }}>Hello, {userData.name}</Nav.Item>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" default element={<><Home /><Features/></>} />
          <Route path="/animal" element={<Animal />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post" element={<Post />} />
          <Route path="/map" element={<Mapp />} />
        </Routes>
      </Router>
    </>
  );
}

export default Navv;
