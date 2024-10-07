// PassengersForm.js
import React, { useState } from 'react';
import PassengersService from '../services/PassengersService';
import '../styles/PassengersForm.css'; // Імпортуємо стилі

const PassengersForm = ({ onPassengerAdded }) => {
    const [capacity, setCapacity] = useState('');
    const [reservedSeats, setReservedSeats] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!capacity || !reservedSeats) {
            setError('Capacity and Reserved Seats are required.');
            return;
        }

        try {
            const newPassenger = { 
                capacity: parseInt(capacity, 10), 
                reservedSeats: parseInt(reservedSeats, 10) 
            };
            const createdPassenger = await PassengersService.createPassenger(newPassenger);
            onPassengerAdded(createdPassenger); // Викликаємо callback для оновлення
            setCapacity('');
            setReservedSeats('');
            setError('');
        } catch (err) {
            setError('Failed to create passenger.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="passengers-form-container">
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
            {error && <p>{error}</p>}
            <button type="submit">Add Passenger</button>
        </form>
    );
};

export default PassengersForm;
