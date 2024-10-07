import axios from 'axios';

class PassengersService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/v1'; // Основний URL для API пасажирів

        // Отримати токен з localStorage
        const token = localStorage.getItem('token');

        // Створити екземпляр axios з налаштуваннями
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // Отримати всіх пасажирів
    async getAllPassengers() {
        try {
            const response = await this.api.get('/passengers');
            return response.data;
        } catch (error) {
            console.error('Error fetching passengers:', error);
            throw error;
        }
    }

    // Додати нового пасажира
    async createPassenger(passenger) {
        try {
            const response = await this.api.post('/new/passengers', passenger);
            return response.data;
        } catch (error) {
            console.error('Error creating passenger:', error);
            throw error;
        }
    }
}

export default new PassengersService();
