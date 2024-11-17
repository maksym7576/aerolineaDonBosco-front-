import React from 'react';
import axios from 'axios';
import '../styles/ReservationList.css'; 

class ReservationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            returnMessage: '',
            reservations: props.reservations || [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.reservations !== this.props.reservations) {
            this.setState({ reservations: this.props.reservations });
        }
    }

    handleCancelSeat = async (seatId) => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            this.setState({ returnMessage: 'User not found in local storage.' });
            return;
        }

        const requestData = {
            seatId,
            userId: user.id,
            isConfirmed: true, // За замовчуванням підтверджуємо
        };

        try {
            const response = await axios.post('http://localhost:8080/api/seats/cancel', requestData);
            const responseData = response.data;

            if (responseData.totalReturn) {
                this.setState(prevState => ({
                    returnMessage: responseData.text,
                    reservations: prevState.reservations.map(dto => ({
                        ...dto,
                        seatsList: dto.seatsList.filter(seat => seat.id !== seatId),
                    })),
                }));
            } else {
                this.setState({ returnMessage: responseData.text });
            }

            setTimeout(() => this.setState({ returnMessage: '' }), 5000);
        } catch (error) {
            console.error('Error cancelling seat:', error);
            this.setState({ returnMessage: 'Failed to cancel seat.' });
        }
    };

    render() {
        const { returnMessage, reservations } = this.state;

        return (
            <div className="reservation-list">
                <h3>Available Flights and Seats</h3>
                {returnMessage && <div className="alert">{returnMessage}</div>}
                <ul className="reservations">
                    {reservations.length > 0 ? (
                        reservations.map((dto, index) => (
                            <li key={index} className="reservation-card">
                                {/* Інформація про рейс */}
                                <div className="flight-details">
                                    <h4>Flight Details</h4>
                                    <p>
                                        <strong>From:</strong> {dto.flight.origin.city}, {dto.flight.origin.country}
                                    </p>
                                    <p>
                                        <strong>To:</strong> {dto.flight.destination.city}, {dto.flight.destination.country}
                                    </p>
                                    <p>
                                        <strong>Departure Time:</strong>{' '}
                                        {new Date(dto.flight.departureTime).toLocaleString()}
                                    </p>
                                </div>
                                {/* Інформація про місця */}
                                <div className="seats-details">
                                    <h4>Seats</h4>
                                    {dto.seatsList.length > 0 ? (
                                        <ul>
                                            {dto.seatsList.map((seat) => (
                                                <li key={seat.id} className="seat-info">
                                                    <p><strong>Seat:</strong> {seat.seatName}</p>
                                                    <p><strong>Cost:</strong> {seat.costOfSeat} EUR</p>
                                                    <p>
                                                        <strong>Available:</strong>{' '}
                                                        {seat.available ? 'Yes' : 'No'}
                                                    </p>
                                                    <button
                                                        className="cancel-btn"
                                                        onClick={() => this.handleCancelSeat(seat.id)}
                                                    >
                                                        Cancel Seat
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No seats available for this flight.</p>
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No flights found.</p>
                    )}
                </ul>
            </div>
        );
    }
}

export default ReservationList;
