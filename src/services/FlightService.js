import axios from 'axios';

class FlightService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/flight';
        
        // Отримання токена з localStorage
        const token = localStorage.getItem('token');

        // Створити екземпляр axios з налаштуваннями
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        // Додати обробник для автоматичного оновлення токена при необхідності
        this.api.interceptors.response.use(
            response => response,
            async error => {
                // Тут можна додати логіку для обробки помилок, якщо токен недійсний
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: Please log in again.');
                    // Тут можна скинути токен і перевести на сторінку логіну
                }
                return Promise.reject(error);
            }
        );
    }

    // Метод для отримання всіх рейсів
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
}

export default new FlightService();
