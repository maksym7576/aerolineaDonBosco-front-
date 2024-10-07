import React from 'react';
import ReserveService from '../services/ReserveService';
import WalletService from '../services/WalletService';
import '../styles/ReservationList.css'; // Import CSS file for styling

class ReservationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            returnMessage: '',
            localReservations: props.reservations || [],
            walletBalance: null
        };
    }

    componentDidMount() {
        this.fetchWalletBalance();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.reservations !== this.props.reservations) {
            this.setState({ localReservations: this.props.reservations });
        }
    }

    fetchWalletBalance = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const walletData = await WalletService.getWalletByUserId(userId);
            this.setState({ walletBalance: walletData.euro });
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    }

    handleCancel = async (reservationId) => {
        try {
            await ReserveService.cancelReservation(reservationId);
            this.setState(prevState => ({
                returnMessage: 'Reservation canceled successfully.',
                localReservations: prevState.localReservations.filter(res => res.id !== reservationId)
            }));
            this.props.onReservationChange();
            this.fetchWalletBalance();
            setTimeout(() => this.setState({ returnMessage: '' }), 5000);
        } catch (error) {
        }
    }

    createReservation = async (flight) => {
        const reservationData = {
            reservedSeats: flight.reservedSeats, // Number of seats reserved
            flight: { id: flight.flight.id }, // Flight ID
            user: { id: localStorage.getItem('userId') } // User ID
        };

        try {
            const result = await ReserveService.createReservation(reservationData);
            this.setState(prevState => ({
                returnMessage: 'Reservation created successfully.',
                localReservations: [...prevState.localReservations, result]
            }));
            this.props.onReservationChange();
            this.fetchWalletBalance();
            setTimeout(() => this.setState({ returnMessage: '' }), 5000);
        } catch (error) {
            console.error('Error creating reservation:', error);
            this.setState({ returnMessage: 'Failed to create reservation.' });
        }
    }

    render() {
        const { returnMessage, localReservations, walletBalance } = this.state;
        return (
            <div className="reservation-list">
                <h3>My Reservations</h3>
                {returnMessage && <div className="alert">{returnMessage}</div>}
                <p className="wallet-balance">
                    Wallet Balance: {walletBalance !== null ? `${walletBalance} EUR` : 'Loading...'}
                </p>
                <ul className="reservations">
                    {localReservations.length > 0 ? (
                        localReservations.map((reservation) => (
                            <li key={reservation.id} className="reservation-card">
                                <div className="reservation-image">
                                    {reservation.flight.images && reservation.flight.images.length > 0 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${reservation.flight.images[0].imageData}`}
                                            alt={`Flight from ${reservation.flight.origin.city} to ${reservation.flight.destination.city}`}
                                            className="airplane-image"
                                        />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </div>
                                <div className="reservation-details">
                                    <p><strong>Flight:</strong> {reservation.flight.origin.city} to {reservation.flight.destination.city}</p>
                                    <p><strong>Reserved Seats:</strong> {reservation.reservedSeats}</p>
                                    <p><strong>Price per Seat:</strong> {reservation.flight.costEuro} EUR</p>
                                    <p><strong>Total Cost:</strong> {reservation.flight.costEuro * reservation.reservedSeats} EUR</p>
                                    <p><strong>Date:</strong> {new Date(reservation.flight.departureTime).toLocaleDateString()}</p>
                                </div>
                                {new Date(reservation.flight.departureTime) >= new Date() && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => this.handleCancel(reservation.id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="no-reservations">No reservations found</p>
                    )}
                </ul>
            </div>
        );
    }
}

export default ReservationList;
