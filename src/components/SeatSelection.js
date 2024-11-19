// SeatSelection.js
import React, { useState, useEffect } from 'react';
import ReserveService from '../services/ReserveService'; // Імпорт сервісу
import '../styles/SeatSelection.css';

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
      const data = await ReserveService.fetchSeats(flightId); // Виклик методу з сервісу
      setSeats(data);
    } catch (err) {
      setError('Failed to fetch seats data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat) => {
    if (!seat.seats.available) return;

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.seats.id === seat.seats.id);
      const newSelection = isSelected
        ? prev.filter(s => s.seats.id !== seat.seats.id)
        : [...prev, seat];

      const newTotal = newSelection.reduce((sum, s) => {
        return sum + (s.discountedPrice > 0 ? s.discountedPrice : s.originalPrice);
      }, 0);

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
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;

      if (!userId) {
        setError('User not authenticated');
        return;
      }

      const reservationData = {
        seatIdList: selectedSeats.map(seat => seat.seats.id),
        flightId: flightId,
        userId: userId
      };
      console.log(reservationData);

      const response = await ReserveService.createReservation(reservationData);

      if (response === "Successful") {
        setSuccess('Your seats have been successfully reserved!');
        setSelectedSeats([]);
        setTotalCost(0);
        fetchSeats();
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to complete reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seat-selection-wrapper">
      <h2>Select Your Seats</h2>
      
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <p>{success}</p>
        </div>
      )}

      <div className="seat-selection-grid">
        {seats.map((seat) => (
          <div
            key={seat.seats.id}
            onClick={() => handleSeatSelect(seat)}
            className={`seat-selection-item 
              ${!seat.seats.available ? 'disabled' : 
              selectedSeats.find(s => s.seats.id === seat.seats.id) ? 'selected' : 'available'}`}
          >
            <div className="seat-name">{seat.seats.seatName}</div>
            <div className="seat-price-container">
              {seat.discountedPrice > 0 ? (
                <>
                  <span className="original-price">€{seat.originalPrice.toFixed(2)}</span>
                  <span className="final-price">€{seat.discountedPrice.toFixed(2)}</span>
                  <div className="discount-badge">{Math.abs(seat.percentage).toFixed(0)}% OFF</div>
                </>
              ) : (
                <span className="final-price">€{seat.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-selection-summary">
        <h3>Selected Seats: {selectedSeats.map(s => s.seats.seatName).join(', ')}</h3>
        <h4>Total Cost: €{totalCost.toFixed(2)}</h4>
        <button
          className="confirm-purchase-btn"
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
