import { Card, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Community() {

  const [Posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/community')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <br />
      <Row xs={1} md={4} className="g-4">
        {Posts.map((post, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src={post.photo} style={{ height: "300px" }} />
              <Card.Body style={{ textAlign: "center" }}>
                <Card.Title>{post.title}</Card.Title>
                {/* <Card.Text>
                </Card.Text> */}

                <Card.Text>
                  {post.description}
                </Card.Text>
                <Card.Text>
                  ~{post.name}
                </Card.Text>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
