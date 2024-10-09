// CreateFlightPage.js
import React, { useState, useEffect } from 'react';
import RoutesService from '../services/RoutesService';
import PassengersService from '../services/PassengersService';
import FlightForm from '../components/FlightForm';
import FlightListAdmin from '../components/FlightListAdmin';
import PassengersForm from '../components/PassengersForm';
import RouteForm from '../components/RouteForm';
import '../styles/CreateFlightPage.css'; 

const CreateFlightPage = () => {
    const [routes, setRoutes] = useState([]);
    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routesData = await RoutesService.getAllRoutes();
                setRoutes(routesData);
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        };

        const fetchPassengers = async () => {
            try {
                const passengersData = await PassengersService.getAllPassengers();
                setPassengers(passengersData);
            } catch (error) {
                console.error('Error fetching passengers:', error);
            }
        };

        fetchRoutes();
        fetchPassengers();
    }, []);

    const handlePassengerAdded = (newPassenger) => {
        setPassengers((prevPassengers) => [...prevPassengers, newPassenger]);
    };

    const handleRouteAdded = (newRoute) => {
        setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
    };

    return (
        <div>
        <div className="create-flight-page-container">
            <h2>Add Passenger</h2>
            <PassengersForm onPassengerAdded={handlePassengerAdded} />

            <h2>Add Route</h2>
            <RouteForm onRouteAdded={handleRouteAdded} />

            <h1>Create Flight</h1>
        </div>
        <FlightForm passengers={passengers} routes={routes} />
        <FlightListAdmin /> 
        </div>
    );
};

export default CreateFlightPage;
