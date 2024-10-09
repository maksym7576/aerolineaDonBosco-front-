// RouteForm.js
import React, { useState } from 'react';
import RoutesService from '../services/RoutesService';
import '../styles/RouteForm.css'; 

const RouteForm = ({ onRouteAdded }) => {
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!country || !city) {
            setError('Country and City are required.');
            return;
        }

        try {
            const newRoute = { country, city };
            const createdRoute = await RoutesService.createRoute(newRoute);
            onRouteAdded(createdRoute); 
            setCountry('');
            setCity('');
            setError('');
        } catch (err) {
            setError('Failed to create route.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="route-form-container">
            <input 
                type="text" 
                placeholder="Country" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="City" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
            />
            {error && <p>{error}</p>}
            <button type="submit">Add Route</button>
        </form>
    );
};

export default RouteForm;
