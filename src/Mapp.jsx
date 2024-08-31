import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import osm from './osp-providers';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import lion from './lion.png';
import tiger from './tiger.png';
import iconn from "./default_marker.png"
import axios from "axios";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // Maximum image size: 5 MB

// Default icon
const defaultIcon = new L.Icon({
    iconUrl: iconn,
    iconSize: [40, 40],
});

const Mapp = () => {
    const [center, setCenter] = useState({ lat: 13.084622, lng: 80.248357 });
    const [markerss, setMarkerss] = useState([]);
    const mapRef = useRef();

    useEffect(() => {
        axios.get('http://localhost:5000/maps')
            .then(response => {
                setMarkerss(response.data);
            })
            .catch(error => {
                console.error('Error fetching markers', error);
            });
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const name = formData.get('name');
        const location = formData.get('location');
        const imageFile = formData.get('image');
        // const iconFile = formData.get('icon');

        if (imageFile && imageFile.size <= MAX_IMAGE_SIZE) {
            try {
                const imageDataURL = await encodeImageFileAsURL(imageFile);

                // let iconDataURL = defaultIcon.options.iconUrl;
                // if (iconFile && iconFile.size <= MAX_IMAGE_SIZE) {
                //     iconDataURL = await convertImageToDataURL(iconFile);
                // }

                const marker = {
                    name: name,
                    location: location,
                    image: imageDataURL,
                    // icon: iconDataURL,
                };

                setCenter(marker.location);
                await axios.post('http://localhost:5000/report', { marker });
                alert('Marker added successfully');
            } catch (error) {
                console.error('Error handling form submission:', error);
                alert('Error adding marker. Please try again.');
            }
        } else {
            alert('Please upload an image of valid size (up to 5 MB).');
        }
    };

    const encodeImageFileAsURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };



    const convertImageToDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="col">
                    <MapContainer
                        center={center}
                        zoom={9}
                        ref={mapRef}
                        style={{ height: "100vh", width: "100%" }}
                    >
                        <TileLayer
                            url={osm.maptiler.url}
                            attribution={osm.maptiler.attribution}
                        />

                        {markerss.map((marker, index) => {
                            const locationParts = marker.location.split(",");
                            const lat = parseFloat(locationParts[0]);
                            const lng = parseFloat(locationParts[1]);
                            const isValidLocation = !isNaN(lat) && !isNaN(lng);

                            return (
                                <Marker key={index} position={{ lat: lat, lng: lng }} icon={marker.icon || defaultIcon}>
                                    <Popup>
                                        <div style ={{ textAlign: 'center' }}>
                                            <p>Name: {marker.name}</p>
                                            {isValidLocation && (
                                                <p>Location: {lat}, {lng}</p>
                                            )}
                                            <img src={marker.photo1} alt="Species" style={{ maxWidth: '100px'}} />
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-container">
                    <h2>Enter Details</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Species Name:</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location (Lat, Long):</label>
                            <input type="text" id="location" name="location" placeholder="e.g., 13.084622, 80.248357" required />
                            &nbsp;&nbsp;
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Upload Species Image:</label>
                            <input type="file" id="image" name="image" accept="image/*" required />
                        </div>
                        {/* <div className="form-group">
                            <label htmlFor="icon">Upload Icon (optional):</label>
                            <input type="file" id="icon" name="icon" accept="image/*" />
                        </div> */}
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Mapp;
