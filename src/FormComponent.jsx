import React, { useState } from 'react';
import axios from 'axios';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/data', formData);
      alert('Form submitted successfully!');
      setFormData({ name: '', latitude: '', longitude: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        });
      }, (error) => {
        console.error('Error fetching location:', error);
        alert('Unable to fetch your current location.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="latitude"
        placeholder="Latitude"
        value={formData.latitude}
        onChange={handleChange}
      />
      <input
        type="text"
        name="longitude"
        placeholder="Longitude"
        value={formData.longitude}
        onChange={handleChange}
      />
      <button type="button" onClick={fetchLocation}>Fetch Location</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormComponent;
