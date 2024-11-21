import React, { useState } from 'react';
import ReserveService from '../services/ReserveService'; 
import '../styles/SeatsForm.css';

const SeatsForm = ({ flightId }) => {
    const [seatsList, setSeatsList] = useState([]);
    const [seatName, setSeatName] = useState('');
    const [costOfSeat, setCostOfSeat] = useState('');
    const [discount, setDiscount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);  // Added state for submit button

    const handleAddSeat = () => {
        if (!seatName || !costOfSeat) {
            setError('Seat name and cost are required!');
            return;
        }

        // Check if costOfSeat and discount are valid numbers
        const cost = parseFloat(costOfSeat);
        const disc = parseFloat(discount);

        if (isNaN(cost) || cost <= 0) {
            setError('Cost of seat must be a valid number greater than zero!');
            return;
        }

        if (discount && (isNaN(disc) || disc < 0)) {
            setError('Discount must be a valid number (optional but non-negative).');
            return;
        }

        // Create a new seat object based on the SeatDTO structure
        const newSeat = {
            seatName,
            isAvailable: true, // By default true
            costOfSeat: cost,
            discount: disc || 0,  // Default discount to 0 if not provided
            reservedByUserId: null, // Set to null, since user assignment isn't done here
            flightId, // Pass the flight ID from props
        };

        setSeatsList([...seatsList, newSeat]);
        setSeatName('');
        setCostOfSeat('');
        setDiscount('');
        setError('');
    };

    const handleSubmit = async () => {
        if (seatsList.length === 0) {
            setError('Please add at least one seat!');
            return;
        }

        setIsSubmitting(true);  // Disable the button when submitting
        setError('');  // Clear any previous errors

        try {
            // Use the ReserveService to create seats
            await ReserveService.createSeats(seatsList);
            setSuccess('Seats created successfully!');
            setSeatsList([]); // Clear the seats list
            setTimeout(() => setSuccess(''), 5000); // Clear success message after 5 seconds
        } catch (err) {
            setError(`Failed to create seats: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsSubmitting(false);  // Re-enable the button after the request
        }
    };

    return (
        <div className="seats-form-container">
            <h3>Create Seats for Flight ID: {flightId}</h3>

            <div className="seat-input-container">
                <input
                    type="text"
                    placeholder="Seat Name"
                    value={seatName}
                    onChange={(e) => setSeatName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Cost of Seat"
                    value={costOfSeat}
                    onChange={(e) => setCostOfSeat(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Discount (optional)"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                />
                <button onClick={handleAddSeat}>Add Seat</button>
            </div>

            {seatsList.length > 0 && (
                <div className="seats-list">
                    <h4>Seats List:</h4>
                    <ul>
                        {seatsList.map((seat, index) => (
                            <li key={index}>
                                {seat.seatName} - €{seat.costOfSeat} {seat.discount > 0 && `(Discount: ${seat.discount}%)`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={isSubmitting}  // Disable the button during submission
            >
                {isSubmitting ? 'Submitting...' : 'Submit Seats'}
            </button>
        </div>
    );
};

export default SeatsForm;
