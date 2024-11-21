import React, { useState, useEffect } from 'react';
import FlightService from '../services/FlightService';
import SeatsForm from './SeatsForm'; // Імпортуємо SeatsForm
import '../styles/FlightListAdmin.css';

const FlightListAdmin = () => {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');
    const [selectedFlightId, setSelectedFlightId] = useState(null); // Для управління вибором польоту

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

    const handleAddSeats = (flightId) => {
        setSelectedFlightId(flightId); // Встановлюємо ID польоту для додавання місць
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
                                <p><strong>Passengers Capacity:</strong> {flight.capacity || 'N/A'}</p>
                                <p><strong>Reserved Seats:</strong> {flight.reservedSeats || '0'}</p>
                                <p><strong>Available Seats:</strong> {flight.capacity - flight.reservedSeats}</p>
                                <button onClick={() => handleDelete(flight.id)}>Delete</button>
                                <button onClick={() => handleAddSeats(flight.id)}>Add Seats</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No flights found</p>
                )}
            </div>

            {selectedFlightId && (
                <div className="seats-panel">
                    <h3>Add Seats for Flight ID: {selectedFlightId}</h3>
                    <SeatsForm flightId={selectedFlightId} />
                    <button onClick={() => setSelectedFlightId(null)} className="close-panel">
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlightListAdmin;
