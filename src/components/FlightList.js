import React from 'react';
import ReserveService from '../services/ReserveService';
import WalletService from '../services/WalletService';
import '../styles/FlightList.css';

class FlightList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInputVisible: false,
            inputValue: '',
            error: '',
            userId: null,
            walletBalance: null
        };
    }

    componentDidMount() {
        this.fetchUserId();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.flights !== this.props.flights) {
            console.log('Received flights:', this.props.flights);
        }
        if (prevState.userId !== this.state.userId && this.state.userId) {
            this.fetchWalletBalance();
        }
    }

    fetchUserId = () => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            this.setState({ userId: storedUserId }, this.fetchWalletBalance);
        } else {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                this.setState({ userId: user.id }, () => {
                    localStorage.setItem('userId', user.id);
                    this.fetchWalletBalance();
                });
            } else {
                this.setState({ error: 'User not authenticated. Please log in again.' });
            }
        }
    }

    fetchWalletBalance = async () => {
        try {
            const walletData = await WalletService.getWalletByUserId(this.state.userId);
            this.setState({ walletBalance: walletData.euro });
        } catch (error) {
            this.setState({ error: 'Failed to fetch wallet balance' });
        }
    }

    toggleInput = () => {
        this.setState(prevState => ({ isInputVisible: !prevState.isInputVisible, inputValue: '', error: '' }));
    }

    handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || Number(value) >= 1) {
            this.setState({ inputValue: value, error: '' });
        } else {
            this.setState({ error: 'Value must be greater than 0' });
        }
    }

    handleReserve = async (flight) => {
        if (!this.state.userId) {
            this.setState({ error: 'User not authenticated. Please log in again.' });
            return;
        }

        const reservationData = {
            reservedSeats: Number(this.state.inputValue),
            flight: { id: flight.id },
            user: { id: this.state.userId },
        };

        try {
            const response = await ReserveService.createReservation(reservationData); // викликаємо без токена
            if (response && response.id) {
                alert('Reservation successful!');
                await this.fetchWalletBalance();
            } else {
                this.setState({ error: 'Unexpected response from server' });
            }
        } catch (error) {
            console.error('Error while reserving:', error); // Додано для дебагу
            this.setState({ error: 'Failed to make reservation: ' + (error.response?.data?.message || error.message) });
        }
    }

    render() {
        const { flights } = this.props;
        const { isInputVisible, inputValue, error, userId } = this.state;

        return (
            <div className="flight-list">
                <h2>Search Results</h2>
                {flights && flights.length > 0 ? (
                    flights.map((flight) => (
                        <div key={flight.id} className="flight-card">
                            <div className="flight-photo-container">
                                {flight.url ? (
                                    <img
                                        src={flight.url}
                                        alt={`Flight from ${flight.origin.city} to ${flight.destination.city}`}
                                        className="flight-photo"
                                    />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="flight-details">
                                <h3 className="flight-route">
                                    {flight.origin.city}, {flight.origin.country} to {flight.destination.city}, {flight.destination.country}
                                </h3>
                                <p><strong>Departure Time:</strong> {flight.departureTime ? new Date(flight.departureTime).toLocaleString() : 'N/A'}</p>
                                <p><strong>Passengers Capacity:</strong> {flight.passengers.capacity}</p>
                                <p><strong>Reserved Seats:</strong> {flight.passengers.reservedSeats}</p>

                                {/* Display availability based on availableSeat */}
                                {flight.availableSeat ? (
                                    <p className="available-seats">Seats available</p>
                                ) : (
                                    <p className="no-seats">Fully booked</p>
                                )}
                                 <p><strong>Cost:</strong> {flight.costEuro} EUR</p>

                                {/* Only show the reserve option if seats are available */}
                                {flight.availableSeat && !isInputVisible ? (
                                    <button onClick={this.toggleInput}>
                                        Buy
                                    </button>
                                ) : (
                                    isInputVisible && flight.availableSeat && (
                                        <div>
                                            <input
                                                type="number"
                                                value={inputValue}
                                                onChange={this.handleInputChange}
                                                placeholder="Number of Passengers"
                                                min="1"
                                            />
                                            {error && <p style={{ color: 'red' }}>{error}</p>}
                                            <button
                                                onClick={() => {
                                                    if (inputValue && Number(inputValue) >= 1) {
                                                        this.handleReserve(flight);
                                                    } else {
                                                        this.setState({ error: "You can't input less than 1 person" });
                                                    }
                                                }}
                                                disabled={!inputValue || Number(inputValue) < 1 || !userId}
                                            >
                                                Buy
                                            </button>
                                            <button className="cancel-btn" onClick={this.toggleInput}>
                                                Cancel
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No flights found</p>
                )}
            </div>
        );
    }
}

export default FlightList;
