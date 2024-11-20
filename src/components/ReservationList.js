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

    handleCancelSeat = async (seatId, flightId) => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            this.setState({ returnMessage: 'User not found in local storage.' });
            return;
        }

        const requestData = {
            seatId,
            userId: user.id,
            isConfirmed: true,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/seats/cancel', requestData);

            this.setState((prevState) => ({
                returnMessage: 'Seat successfully cancelled',
                reservations: prevState.reservations.map((dto) => 
                    dto.flight.id === flightId 
                    ? {
                        ...dto,
                        seatsList: dto.seatsList.filter((seat) => seat.id !== seatId),
                        flight: {
                            ...dto.flight,
                            reservedSeats: dto.flight.reservedSeats - 1
                        }
                    }
                    : dto
                ),
            }));

            setTimeout(() => {
                this.setState({ returnMessage: '' });
            }, 3000);

        } catch (error) {
            console.error('Error cancelling seat:', error);
            this.setState({ 
                returnMessage: error.response?.data?.message || 'Failed to cancel seat' 
            });

            setTimeout(() => {
                this.setState({ returnMessage: '' });
            }, 3000);
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
                                <div className="flight-details">
                                    <h4>Flight Details</h4>
                                    {dto.flight.images && dto.flight.images.length > 0 && (
                                        <img
                                            src={`data:image/jpeg;base64,${dto.flight.images[0].imageData}`}
                                            alt="Flight"
                                            className="flight-image"
                                        />
                                    )}
                                    <p>
                                        <strong>From:</strong>{' '}
                                        {dto.flight?.origin?.city || 'N/A'},{' '}
                                        {dto.flight?.origin?.country || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>To:</strong>{' '}
                                        {dto.flight?.destination?.city || 'N/A'},{' '}
                                        {dto.flight?.destination?.country || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Departure Time:</strong>{' '}
                                        {dto.flight?.departureTime
                                            ? new Date(dto.flight.departureTime).toLocaleString()
                                            : 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Reserved Seats:</strong> {dto.flight?.reservedSeats || 0}/{dto.flight?.capacity || 'N/A'}
                                    </p>
                                </div>
                                <div className="seats-details">
                                    <h4>Seats</h4>
                                    {dto.seatsList && dto.seatsList.length > 0 ? (
                                        <ul>
                                            {dto.seatsList.map((seat) => (
                                                <li key={seat.id} className="seat-info">
                                                    <p><strong>Seat:</strong> {seat.seatName}</p>
                                                    <p>
                                                        <strong>Available:</strong>{' '}
                                                        {seat.available ? 'Yes' : 'No'}
                                                    </p>
                                                    <button
                                                        className="cancel-btn"
                                                        onClick={() => this.handleCancelSeat(seat.id, dto.flight.id)}
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