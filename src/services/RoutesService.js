import axios from 'axios';

class RoutesService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/v1'; // Основний URL для API маршрутів

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

    // Отримати всі маршрути
    async getAllRoutes() {
        try {
            const response = await this.api.get('/routes');
            return response.data;
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    }

    // Додати новий маршрут
    async createRoute(route) {
        try {
            const response = await this.api.post('/new/routes', route);
            return response.data;
        } catch (error) {
            console.error('Error creating route:', error);
            throw error;
        }
    }
}

export default new RoutesService();
