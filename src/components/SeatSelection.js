import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeatSelection = ({ flightId }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, [flightId]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/seats/flight/${flightId}`);
      setSeats(response.data);
    } catch (err) {
      setError('Failed to fetch seats data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat) => {
    if (!seat.available) return;

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      const newSelection = isSelected
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat];
      
      const newTotal = newSelection.reduce((sum, s) => 
        sum + (s.costOfSeat * (1 - s.discount / 100)), 0);
      setTotalCost(newTotal);
      
      return newSelection;
    });
  };

  const handleConfirmPurchase = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
  
    try {
      setLoading(true);
  
      // Retrieve the user from localStorage and extract the userId
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;
  
      if (!userId) {
        setError('User not authenticated');
        return;
      }
  
      const reservationData = {
        seatIdList: selectedSeats.map(seat => seat.id),
        flightId: flightId,
        userId: userId // Use the extracted userId
      };
      console.log(reservationData);
  
      const response = await axios.post('http://localhost:8080/api/seats/new/reservation', 
        reservationData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data === "Successful") {
        setSuccess('Your seats have been successfully reserved!');
        setSelectedSeats([]);
        setTotalCost(0);
        fetchSeats(); // Refresh seats data
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to complete reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seat-selection-container">
      <h2>Select Your Seats</h2>
      {error && (
        <div className="alert alert-error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <h3>Success</h3>
          <p>{success}</p>
        </div>
      )}

      <div className="seat-grid">
        {seats.map((seat) => (
          <div
            key={seat.id}
            onClick={() => handleSeatSelect(seat)}
            className={`seat ${!seat.available ? 'disabled' : 
              selectedSeats.find(s => s.id === seat.id) ? 'selected' : 'available'}`}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      <div className="summary">
        <h3>Selected Seats: {selectedSeats.map(s => s.seatNumber).join(', ')}</h3>
        <h4>Total Cost: €{totalCost.toFixed(2)}</h4>
        <button 
          onClick={handleConfirmPurchase}
          disabled={loading || selectedSeats.length === 0}
        >
          {loading ? 'Processing...' : 'Confirm Purchase'}
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
