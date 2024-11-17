import React from 'react';
import ReserveService from '../services/ReserveService';
import WalletService from '../services/WalletService';
import FlightImageService from '../services/FlightImageService';
import SeatSelection from './SeatSelection';
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
            flightImages: {},
            selectedFlightId: null,
            showSeatSelection: false,
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

    toggleSeatSelection = (flightId) => {
        this.setState((prevState) => ({
            selectedFlightId: prevState.selectedFlightId === flightId ? null : flightId,
            showSeatSelection: prevState.selectedFlightId !== flightId,
            error: ''
        }));
    };

    handleSeatSelectionSuccess = () => {
        this.fetchWalletBalance();
        this.setState({
            selectedFlightId: null,
            showSeatSelection: false
        });
    };

    render() {
        const { flights } = this.props;
        const { error, selectedFlightId, showSeatSelection } = this.state;

        return (
            <div className="flight-list">
                <h2>Search Results</h2>
                {error && <p className="error-message">{error}</p>}
                
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
                                <p><strong>Passengers Capacity:</strong> {flight.capacity || 'N/A'}</p>
                                <p><strong>Reserved Seats:</strong> {flight.reservedSeats || '0'}</p>
                                <p><strong>Available Seats:</strong> {flight.capacity - flight.reservedSeats}</p>
                                {flight.capacity - flight.reservedSeats > 0 ? (
                                    <p className="available-seats">Seats available</p>
                                ) : (
                                    <p className="no-seats">Fully booked</p>
                                )}
                                <p><strong>Cost:</strong> {flight.costEuro} EUR</p>
                                
                                {flight.capacity - flight.reservedSeats > 0 && (
                                    <div>
                                        <button 
                                            onClick={() => this.toggleSeatSelection(flight.id)}
                                            className="select-seats-btn"
                                        >
                                            {selectedFlightId === flight.id ? 'Hide Seats' : 'Select Seats'}
                                        </button>
                                        
                                        {selectedFlightId === flight.id && showSeatSelection && (
                                            <SeatSelection 
                                                flightId={flight.id}
                                                onSuccess={this.handleSeatSelectionSuccess}
                                            />
                                        )}
                                    </div>
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