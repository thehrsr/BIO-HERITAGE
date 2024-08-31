import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    username: '',
    password: '',
  });

//   const [name,setName] = useState("");
//   const [email,setEmail] = useState("");
//   const [city,setCity] = useState("");
//   const [username,setUsername] = useState("");
//   const [password,setPassword] = useState("");




  const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });

//     if(e.target.name == "name"){
//         setName(e.target.value);
//     }
//     if(e.target.name == "email"){
//         setEmail(e.target.value);
//     }
//     if(e.target.name == "city"){
//         setCity(e.target.value);
//     }
//     if(e.target.name == "username"){
//         setUsername(e.target.value);
//     }
//     if(e.target.name == "password"){
//         setPassword(e.target.value);
//     }
   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', formData);
      alert('Signup successful!');
      // Redirect or show success message to the user
    } catch (error) {
      console.error('Error:', error);
      alert('Signup failed. Please try again later.');
      // Handle error, show error message to the user, etc.
    }
  };

  return (
    <Container className="mt-5">
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter your name" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCity">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" name="city" placeholder="Enter your city" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" placeholder="Enter username" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}
export default SignupPage;
