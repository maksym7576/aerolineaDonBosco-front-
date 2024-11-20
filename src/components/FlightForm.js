import React, { useState } from 'react';
import FlightService from '../services/FlightService';
import FlightImageService from '../services/FlightImageService';
import '../styles/FlightForm.css';

const FlightForm = ({ passengers, routes }) => {
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [capacity, setCapacity] = useState('');
    const [reservedSeats, setReservedSeats] = useState(0);
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

        if (selectedRoutes.length !== 2 || !departureTime || !capacity || !costEuro || !file) {
            setError('All fields are required.');
            return;
        }

        const [origin, destination] = selectedRoutes;

        try {
            const token = localStorage.getItem('token');

            const newFlight = {
                departureTime,
                origin: { id: origin.id },
                destination: { id: destination.id },
                capacity: parseInt(capacity),
                reservedSeats: parseInt(reservedSeats),
                costEuro: parseFloat(costEuro),
            };

            // Create flight
            const createdFlight = await FlightService.createFlight(newFlight, token);
            console.log('Flight created successfully:', createdFlight);

            // Upload flight image
            const formData = new FormData();
            formData.append('file', file);
            await FlightImageService.uploadFlightImage(createdFlight.id, formData, token);
            console.log('Flight image uploaded successfully.');

            // Reset form
            setSelectedRoutes([]);
            setCapacity('');
            setReservedSeats(0);
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

                <div className="input-container">
                    <input
                        type="datetime-local"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        placeholder="Departure Time"
                    />
                    <input
                        type="number"
                        placeholder="Capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Reserved Seats"
                        value={reservedSeats}
                        onChange={(e) => setReservedSeats(e.target.value)}
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
