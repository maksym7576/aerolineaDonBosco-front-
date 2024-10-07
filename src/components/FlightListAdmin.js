import React, { useState, useEffect } from 'react';
import FlightService from '../services/FlightService';
import '../styles/FlightListAdmin.css';

const FlightListAdmin = () => {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');

    const fetchAllFlights = async () => {
        try {
            const flightData = await FlightService.getAllFlights();
            setFlights(flightData);
        } catch (error) {
            setError('Failed to fetch flights');
        }
    };

    useEffect(() => {
        fetchAllFlights();
    }, []);

    const handleDelete = async (id) => {
        try {
            await FlightService.deleteFlight(id);
            fetchAllFlights();
        } catch (error) {
            setError('Failed to delete flight');
        }
    };

    const handleUpdate = (flight) => {
        console.log('Update flight:', flight);
    };

    return (
        <div className="flight-list-admin">
            <div className="flight-list">
                <h2>Flight List</h2>
                {error && <p className="error-message">{error}</p>}
                {flights.length > 0 ? (
                    <div className="flights-grid">
                        {flights.map((flight) => (
                            <div key={flight.id} className="flight-card">
                                <div className="flight-photo-container">
                                    {flight.images && flight.images.length > 0 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${flight.images[0].imageData}`}
                                            alt={`Flight from ${flight.origin.city} to ${flight.destination.city}`}
                                            className="flight-photo"
                                        />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </div>
                                <h3 className="flight-route">
                                    {flight.origin.country || 'Unknown Country'} {flight.origin.city || 'Unknown City'} to{' '}
                                    {flight.destination.country || 'Unknown Country'} {flight.destination.city || 'Unknown City'}
                                </h3>
                                <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString() || 'N/A'}</p>
                                <p><strong>Cost:</strong> {flight.costEuro ? `${flight.costEuro} EUR` : 'N/A'}</p>
                                {/* <button onClick={() => handleUpdate(flight)}>Update</button> */}
                                <button onClick={() => handleDelete(flight.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No flights found</p>
                )}
            </div>
        </div>
    );
};

export default FlightListAdmin;
