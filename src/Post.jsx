import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
export default function Post() {
    const [title, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);
  
    const encodeImageFileAsURL = (file) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      }
      reader.readAsDataURL(file);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const name = userData.name
        axios.post('http://localhost:5000/post', {
          title,
          description,
          photo,
          name,
        })
        .then(alert('successfull'))
        .catch(err => console.log(err));
      }
  return (
    <>
    <h1 style={{textAlign : 'center'}}>Post</h1>

    <Container className="d-flex justify-content-center mt-5">
      <Form onSubmit={onSubmit} style={{ width: '400px' }}>

      <Form.Group controlId="photo">
          <Form.Label>Upload Photo</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => encodeImageFileAsURL(e.target.files[0])} />
        </Form.Group>
        <br />

        {photo && (
            <div className="text-center mb-3">
              <Image
                src={photo}
                alt="Preview"
                fluid
                rounded
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
        <Form.Group controlId="name">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter a title" value={title} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <br/>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Add description to your post" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <br/>

        <Button variant="secondary" type="submit">
          Post
        </Button>
        
      </Form>
      
    </Container>
    
    </>
  )
}
