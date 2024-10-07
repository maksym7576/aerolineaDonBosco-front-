import React from 'react';
import ReserveService from '../services/ReserveService';
import WalletService from '../services/WalletService';
import FlightImageService from '../services/FlightImageService';
import '../styles/FlightList.css';

class FlightList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVisibility: {},
            inputValues: {},
            error: '',
            userId: null,
            walletBalance: null,
            flightImages: {}
        };
    }

    componentDidMount() {
        this.fetchUserId();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.flights !== this.props.flights) {
            console.log('Received flights:', this.props.flights);
            this.fetchFlightImages();
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
    };

    fetchWalletBalance = async () => {
        try {
            const walletData = await WalletService.getWalletByUserId(this.state.userId);
            this.setState({ walletBalance: walletData.euro });
        } catch (error) {
            this.setState({ error: 'Failed to fetch wallet balance' });
        }
    };

    fetchFlightImages = async () => {
        const { flights } = this.props;
        for (const flight of flights) {
            try {
                const image = await FlightImageService.getImageByFlightId(flight.id);
                this.setState((prevState) => ({
                    flightImages: {
                        ...prevState.flightImages,
                        [flight.id]: image
                    }
                }));
            } catch (error) {
                console.error(`Error fetching image for flight ${flight.id}:`, error);
            }
        }
    };

    toggleInput = (flightId) => {
        this.setState((prevState) => {
            const isVisible = !prevState.inputVisibility[flightId];
            return {
                inputVisibility: {
                    ...prevState.inputVisibility,
                    [flightId]: isVisible,
                },
                inputValues: {
                    ...prevState.inputValues,
                    [flightId]: '',
                },
                error: '',
            };
        });
    };

    handleInputChange = (flightId, e) => {
        const value = e.target.value;
        if (value === '' || Number(value) >= 1) {
            this.setState((prevState) => ({
                inputValues: {
                    ...prevState.inputValues,
                    [flightId]: value,
                },
                error: '',
            }));
        } else {
            this.setState({ error: 'Value must be greater than 0' });
        }
    };

    handleReserve = async (flight) => {
        const flightId = flight.id;
        const reservedSeats = Number(this.state.inputValues[flightId]);

        if (!this.state.userId) {
            this.setState({ error: 'User not authenticated. Please log in again.' });
            return;
        }

        if (reservedSeats < 1) {
            this.setState({ error: "You can't reserve less than 1 seat" });
            return;
        }

        const reservationData = {
            reservedSeats,
            flight: { id: flightId },
            user: { id: this.state.userId },
        };

        try {
            const response = await ReserveService.createReservation(reservationData);
            if (response && response.id) {
                alert('Reservation successful!');
                await this.fetchWalletBalance();
                this.toggleInput(flightId); // Hide the input after reservation
            } else {
                this.setState({ error: 'Unexpected response from server' });
            }
        } catch (error) {
            console.error('Error while reserving:', error);
            this.setState({ error: 'Failed to make reservation: ' + (error.response?.data?.message || error.message) });
        }
    };

    render() {
        const { flights } = this.props;
        const { inputVisibility, inputValues, error, userId, flightImages } = this.state;

        return (
            <div className="flight-list">
                <h2>Search Results</h2>
                {flights && flights.length > 0 ? (
                    flights.map((flight) => (
                        <div key={flight.id} className="flight-card">
                            <div className="flight-photo-container">
                                {flight.images && flight.images.length > 0 ? (
                                    <img
                                        src={`data:image/jpeg;base64,${flight.images[0].imageData}`}
                                        alt={`Flight from ${flight.origin.city} to ${flight.destination.city}`}
                                        className="flight-photo"
                                    />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="flight-details">
                                <h3 className="flight-route">
                                    {flight.origin.country || 'Unknown Country'} {flight.origin.city || 'Unknown City'} to{' '}
                                    {flight.destination.country || 'Unknown Country'} {flight.destination.city || 'Unknown City'}
                                </h3>
                                <p><strong>Departure Time:</strong> {flight.departureTime ? new Date(flight.departureTime).toLocaleString() : 'N/A'}</p>
                                <p><strong>Passengers Capacity:</strong> {flight.passengers?.capacity || 'N/A'}</p>
                                <p><strong>Reserved Seats:</strong> {flight.passengers?.reservedSeats || 'N/A'}</p>
                                {flight.availableSeat ? (
                                    <p className="available-seats">Seats available</p>
                                ) : (
                                    <p className="no-seats">Fully booked</p>
                                )}
                                <p><strong>Cost:</strong> {flight.costEuro} EUR</p>
                                {flight.availableSeat && !inputVisibility[flight.id] ? (
                                    <button onClick={() => this.toggleInput(flight.id)}>Buy</button>
                                ) : (
                                    inputVisibility[flight.id] && flight.availableSeat && (
                                        <div>
                                            <input
                                                type="number"
                                                value={inputValues[flight.id] || ''}
                                                onChange={(e) => this.handleInputChange(flight.id, e)}
                                                placeholder="Number of Passengers"
                                                min="1"
                                            />
                                            {error && <p style={{ color: 'red' }}>{error}</p>}
                                            <button onClick={() => this.handleReserve(flight)}>
                                                Buy
                                            </button>
                                            <button className="cancel-btn" onClick={() => this.toggleInput(flight.id)}>
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
