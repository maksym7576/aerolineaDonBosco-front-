import React, { useState } from 'react';
import FlightService from '../services/FlightService';
import FlightImageService from '../services/FlightImageService';

const FlightForm = ({ passengers, routes }) => {
    const [selectedOriginId, setSelectedOriginId] = useState('');
    const [selectedDestinationId, setSelectedDestinationId] = useState('');
    const [selectedPassengerId, setSelectedPassengerId] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [costEuro, setCostEuro] = useState('');
    const [file, setFile] = useState(null); // Зберігаємо файл
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Зберігаємо обраний файл
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Перевірка всіх полів
        if (!selectedOriginId || !selectedDestinationId || !selectedPassengerId || !departureTime || !costEuro || !file) {
            setError('All fields are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Отримуємо токен з localStorage

            // Створення нового польоту
            const newFlight = { 
                departureTime, 
                availableSeat: true,
                destination: { id: selectedDestinationId },
                origin: { id: selectedOriginId },
                passengers: { id: selectedPassengerId },
                costEuro: parseFloat(costEuro)
            };

            // Відправка запиту на створення польоту
            const createdFlight = await FlightService.createFlight(newFlight, token);
            console.log('Flight created successfully:', createdFlight);

            // Завантаження зображення після створення польоту
            const formData = new FormData(); // Використовуємо form-data
            formData.append('file', file);

            // Відправка запиту на завантаження зображення
            await FlightImageService.uploadFlightImage(createdFlight.id, formData, token);
            console.log('Flight image uploaded successfully.');

            // Очищення форми після успішного запиту
            setSelectedOriginId('');
            setSelectedDestinationId('');
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
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="origin">Select Origin:</label>
                <select onChange={(e) => setSelectedOriginId(e.target.value)} value={selectedOriginId}>
                    <option value="">Select Origin</option>
                    {routes.map(route => (
                        <option key={route.id} value={route.id}>
                            {route.country}, {route.city}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="destination">Select Destination:</label>
                <select onChange={(e) => setSelectedDestinationId(e.target.value)} value={selectedDestinationId}>
                    <option value="">Select Destination</option>
                    {routes.map(route => (
                        <option key={route.id} value={route.id}>
                            {route.country}, {route.city}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="passenger">Select Passenger:</label>
                <select onChange={(e) => setSelectedPassengerId(e.target.value)} value={selectedPassengerId}>
                    <option value="">Select Passenger</option>
                    {passengers.map(passenger => (
                        <option key={passenger.id} value={passenger.id}>
                            Capacity: {passenger.capacity}, Reserved Seats: {passenger.reservedSeats}
                        </option>
                    ))}
                </select>
            </div>
            <input 
                type="datetime-local" 
                value={departureTime} 
                onChange={(e) => setDepartureTime(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="Cost in Euro" 
                value={costEuro} 
                onChange={(e) => setCostEuro(e.target.value)} 
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Create Flight</button>
        </form>
    );
};

export default FlightForm;
