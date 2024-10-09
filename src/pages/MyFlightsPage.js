import React, { useState, useEffect } from 'react';
import ReserveService from '../services/ReserveService';
import ReservationList from '../components/ReservationList'; 

const MyFlightsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not authenticated');
          return;
        }
        
        const response = await ReserveService.getAllReservationByUserId(userId);
        setReservations(response);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to fetch reservations');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ReservationList reservations={reservations} /> 
    </div>
  );
};

export default MyFlightsPage;
