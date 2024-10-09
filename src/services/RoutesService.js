import axios from 'axios';

class RoutesService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/v1'; 

        const token = localStorage.getItem('token');

        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    async getAllRoutes() {
        try {
            const response = await this.api.get('/routes');
            return response.data;
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    }

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
