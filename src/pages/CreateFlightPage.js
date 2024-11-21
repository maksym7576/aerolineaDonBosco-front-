// CreateFlightPage.js
import React, { useState, useEffect } from 'react';
import RoutesService from '../services/RoutesService';
import FlightForm from '../components/FlightForm';
import FlightListAdmin from '../components/FlightListAdmin';
import RouteForm from '../components/RouteForm';
import '../styles/CreateFlightPage.css'; 

const CreateFlightPage = () => {
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routesData = await RoutesService.getAllRoutes();
                setRoutes(routesData);
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        };

        fetchRoutes();
    }, []);

    const handleRouteAdded = (newRoute) => {
        setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
    };

    return (
        <div>
        <div className="create-flight-page-container">

            <h2>Add Route</h2>
            <RouteForm onRouteAdded={handleRouteAdded} />

            <h1>Create Flight</h1>
        </div>
        <FlightForm routes={routes} />
        <FlightListAdmin /> 
        </div>
    );
};

export default CreateFlightPage;
