import axios from 'axios';

class UserService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';

        // Створити екземпляр axios з налаштуваннями
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Додати обробник для автоматичного додавання токена
        this.api.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });
    }

    // Отримання профілю користувача
    async getUserProfile() {
        try {
            const response = await this.api.get('/user');

            const user = response.data;
            if (user && user.id) {
                localStorage.setItem('userId', user.id); 
            }

            return user;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    // Створення гаманця після реєстрації
    async createWalletForUser(userId) {
        try {
            const response = await this.api.post(`/wallet/create/${userId}`, null);
            return response.data;
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    }

    async updateUsername(userId, username) {
        try {
            const response = await this.api.put(`/user/updateUsername/${userId}`, null, {
                params: { username }
            });
            return response.data; // Повертає оновленого користувача
        } catch (error) {
            console.error('Error updating username:', error);
            throw error;
        }
    }

    async updatePassword(userId, oldPassword, newPassword) {
        try {
            const response = await this.api.put(`/user/updatePassword/${userId}`, null, {
                params: { oldPassword, password: newPassword },
            });
            return response.data; // Повертає оновленого користувача
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }
}

export default new UserService();
