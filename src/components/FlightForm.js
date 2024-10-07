// FlightForm.js
import React, { useState } from 'react';
import FlightService from '../services/FlightService';
import FlightImageService from '../services/FlightImageService';
import '../styles/FlightForm.css';

const FlightForm = ({ passengers, routes }) => {
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [selectedPassengerId, setSelectedPassengerId] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [costEuro, setCostEuro] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleRouteClick = (route) => {
        const index = selectedRoutes.findIndex(r => r.id === route.id);

        if (index === -1) {
            if (selectedRoutes.length < 2) {
                setSelectedRoutes([...selectedRoutes, route]);
            }
        } else {
            const updatedRoutes = selectedRoutes.filter(r => r.id !== route.id);
            setSelectedRoutes(updatedRoutes);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedRoutes.length < 2 || !selectedPassengerId || !departureTime || !costEuro || !file) {
            setError('All fields are required.');
            return;
        }

        const [origin, destination] = selectedRoutes;

        try {
            const token = localStorage.getItem('token');

            const newFlight = {
                departureTime,
                availableSeat: true,
                destination: { id: destination.id },
                origin: { id: origin.id },
                passengers: { id: selectedPassengerId },
                costEuro: parseFloat(costEuro),
            };

            const createdFlight = await FlightService.createFlight(newFlight, token);
            console.log('Flight created successfully:', createdFlight);

            const formData = new FormData();
            formData.append('file', file);
            await FlightImageService.uploadFlightImage(createdFlight.id, formData, token);
            console.log('Flight image uploaded successfully.');

            setSelectedRoutes([]);
            setSelectedPassengerId('');
            setDepartureTime('');
            setCostEuro('');
            setFile(null);
            setError('');
        } catch (err) {
            setError('Failed to create flight or upload image: ' + (err.response?.data?.message || err.message));
            console.error(err);
        }
    };

    return (
        <div className="flight-form-container">
            <form onSubmit={handleSubmit} className="flight-form">
                <h4>Select Routes:</h4>
                <div className="button-group">
                    {routes.map((route) => (
                        <button
                            key={route.id}
                            className={`route-button ${selectedRoutes.find(r => r.id === route.id) ? 'active' : ''}`}
                            onClick={() => handleRouteClick(route)}
                            type="button"
                        >
                            {route.country}, {route.city}
                        </button>
                    ))}
                </div>

                <h4>Select Passenger:</h4>
                <div className="button-group">
                    {passengers.map((passenger) => (
                        <button
                            key={passenger.id}
                            className={`passenger-button ${selectedPassengerId === passenger.id ? 'active' : ''}`}
                            onClick={() => setSelectedPassengerId(passenger.id)}
                            type="button"
                        >
                            Capacity: {passenger.capacity}, Reserved: {passenger.reservedSeats}
                        </button>
                    ))}
                </div>

                <div className="input-container">
                    <input
                        type="datetime-local"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        placeholder="Departure Time"
                    />
                    <input
                        type="number"
                        placeholder="Cost in Euro"
                        value={costEuro}
                        onChange={(e) => setCostEuro(e.target.value)}
                    />
                </div>

                <div className="file-input-container">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="file-input-label">
                        Upload Image
                    </label>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="submit-button-container">
                    <button type="submit" className="submit-button">Create Flight</button>
                </div>
            </form>
        </div>
    );
};

export default FlightForm;
