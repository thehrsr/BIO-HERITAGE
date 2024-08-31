import React, { useState } from 'react';
import axios from 'axios';
import data from './animaldata.json';
import './animal.css';
 
function Animal() {
  const [animal, setAnimal] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const encodeImageFileAsURL = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPredictions([]);
    setLoading(true);
 
    try {
      const res = await axios.post('http://localhost:5000/search', {
        image,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
 
      if (res.status === 200) {
        const firstWord = res.data.className.split(',')[0]; 
        setPredictions(firstWord);
        const foundAnimal = data.find(animal => animal.Animal.toLowerCase() === firstWord.toLowerCase());
        setAnimal(foundAnimal);
      } else {
        setError('Error: ' + res.statusText);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={(e) => encodeImageFileAsURL(e.target.files[0])} />
        <input type="submit" value="Submit" />
      </form>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {animal && (
        <div className="animal-card">
          <img src={image} alt="Uploaded" className="uploaded-image" />
          <div className="animal-details">
            <h2>{animal["Animal"]}</h2>
            <p><strong>Color:</strong> {animal["Color"]}</p>
            <p><strong>Lifespan:</strong> {animal["Lifespan"]} years</p>
            <p><strong>Height:</strong> {animal["Height"]} cm</p>
            <p><strong>Weight:</strong> {animal["Weight"]} kg</p>
            <p><strong>Diet:</strong> {animal["Diet"]}</p>
            <p><strong>Habitat:</strong> {animal["Habitat"]}</p>
            <p><strong>Predators:</strong> {animal["Predators"]}</p>
            <p><strong>Countries Found:</strong> {animal["Countries Found"]}</p>
            <p><strong>Conservation Status:</strong> {animal["Conservation Status"]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default Animal;
 