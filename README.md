# Flight Booking Frontend

This is the frontend application for a flight booking system. It provides a user interface for searching flights, booking tickets, managing user accounts, and administrator functions.

## Backend Repository

For the original backend code, please refer to the following repository:
[https://github.com/Jrdevangel/aerolineaDonBosco.git]

## Technologies Used

- React
- React Router for navigation
- Axios for API calls
- Local Storage for client-side data persistence

## Features

1. **Search Page**: Users can search for available flights.
   - API: `GET http://localhost:8080/api/flight/search`
   - Parameters: originCountry, originCity, destinationCountry, destinationCity, localDate
   - Description: Searches for flights based on provided criteria
   - ![Search Page](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Start_page.jpg?raw=true)

2. **Search Results Page**: Displays the results of a flight search.
   - Uses local storage to pass search results
   - ![Search Results](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Search_result.jpg?raw=true)

3. **Login Page**: Allows users to log into their accounts.
   - API: `POST http://localhost:8080/api/auth/login`
   - Body: { username, password }
   - Description: Authenticates user and returns a token
   - ![Login Page](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Login.jpg?raw=true)

4. **Registration Page**: Allows new users to create an account.
   - API: `POST http://localhost:8080/api/auth/register`
   - Body: { username, email, password }
   - Description: Registers a new user
   - ![Registration Page](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Registe.jpg?raw=true)

5. **Update Username Page**: Allows users to change their username.
   - API: `PUT http://localhost:8080/api/user/updateUsername/{userId}`
   - Parameters: username
   - Description: Updates the username for a given user ID
   - ![Update Username Page](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Update_username.jpg?raw=true)

6. **Update Password Page**: Allows users to change their password.
   - API: `PUT http://localhost:8080/api/user/updatePassword/{userId}`
   - Parameters: oldPassword, password
   - Description: Updates the password for a given user ID
   - ![Update Password Page](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Update_password.jpg?raw=true)

7. **My Flights Page**: Shows users their booked flights.
   - API: `GET http://localhost:8080/api/v1/reservation/user/{userId}`
   - Description: Retrieves all reservations for a given user ID
   - ![My Flights Page](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/My_resorvation.jpg?raw=true)

8. **Import Money Page**: Allows users to add funds to their wallet.
   - API: `PUT http://localhost:8080/api/wallet/user/addMoney/{userId}`
   - Parameters: money
   - Description: Adds money to the wallet of a given user ID
   - ![Import Money Page](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Add_money.jpg?raw=true)

9. **Admin Page**: Allows administrators to manage flights, routes, and passengers.
   - Create Flight API: `POST http://localhost:8080/api/flight/create`
     - Body: { flight details }
     - Description: Creates a new flight
   - Create Route API: `POST http://localhost:8080/api/v1/new/routes`
     - Body: { route details }
     - Description: Creates a new route
   - Create Passenger API: `POST http://localhost:8080/api/v1/new/passengers`
     - Body: { passenger details }
     - Description: Creates a new passenger
   - ![Admin Page 1](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Admin_1.jpg?raw=true)
   - ![Admin Page 2](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Admin_2.jpg?raw=true)
   - ![Admin Page 3](https://github.com/maksym7576/aerolineaDonBosco-front-/blob/main/src/Images/Admin_3.jpg?raw=true)

## Setup and Installation

1. Clone the repository:
   ```
   git clone [repository URL]
   ```

2. Navigate to the project directory:
   ```
   cd flight-booking-frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## API Services

The application uses several services to communicate with the backend:

- `AuthService`: Handles user authentication and registration.
- `FlightService`: Manages flight-related operations.
- `PassengersService`: Handles passenger data.
- `ReserveService`: Manages flight reservations.
- `RoutesService`: Handles flight route data.
- `SearchService`: Provides flight search functionality.
- `UserService`: Manages user profile operations.
- `WalletService`: Handles user wallet operations.

Each service contains methods that make specific API calls to the backend. For detailed information about each API call, refer to the Features section above.
