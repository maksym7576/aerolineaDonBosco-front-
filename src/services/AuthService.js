import axios from 'axios';

class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/auth';
    }

    // Реєстрація користувача
    async register(userData) {
        try {
            const response = await axios.post(`${this.baseURL}/register`, userData);
            return response.data;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    // Логін користувача
    async login(credentials) {
        try {
            const response = await axios.post(`${this.baseURL}/login`, credentials);
            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token); // Зберігаємо токен
                return token;
            }
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    // Отримання даних профілю користувача
    async getUserProfile() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }
}

export default new AuthService();
