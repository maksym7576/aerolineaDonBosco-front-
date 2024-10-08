import axios from 'axios';

class FlightService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/flight';
        this.token = localStorage.getItem('token');

        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
        });

        this.api.interceptors.response.use(
            response => response,
            async error => {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: Token might be expired or invalid. Please log in again.');
                    localStorage.removeItem('token');
                    window.location.href = '/login'; 
                }
                return Promise.reject(error);
            }
        );
    }

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post('http://localhost:8080/api/auth/refresh', {
                token: refreshToken
            });
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            this.api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
            console.error('Error refreshing token:', error);
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }

    async getAllFlights() {
        try {
            const response = await this.api.get('/get');
            return response.data;
        } catch (error) {
            console.error('Error fetching flights:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async createFlight(flight) {
        try {
            const response = await this.api.post('/create', flight);
            return response.data;
        } catch (error) {
            console.error('Error creating flight:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async deleteFlight(id) {
        try {
            await this.api.delete(`/delete/${id}`);
        } catch (error) {
            console.error('Error deleting flight:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async getFlight(id) {
        try {
            const response = await this.api.get(`/get/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching flight:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async updateFlight(id, flight) {
        try {
            const response = await this.api.put(`/update/${id}`, flight);
            return response.data;
        } catch (error) {
            console.error('Error updating flight:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default new FlightService();
