import axios from 'axios';

class UserService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
    }

    // Отримання профілю користувача
    async getUserProfile() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

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
            const token = localStorage.getItem('token');
            const response = await axios.post(`${this.baseURL}/wallet/create/${userId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    }
    async updateUsername(userId, username) {
        const response = await axios.put(`http://localhost:8080/api/user/updateUsername/${userId}`, null, {
            params: { username }
        });
        return response.data; // Повертає оновленого користувача
    }

    async updatePassword(userId, oldPassword, newPassword) {
        const token = localStorage.getItem('token'); // Отримання токена
        const response = await axios.put(`${this.baseURL}/user/updatePassword/${userId}`, null, {
            params: { oldPassword, password: newPassword },
            headers: {
                'Authorization': `Bearer ${token}`, // Додаємо заголовок
            },
        });
        return response.data; // Повертає оновленого користувача
    }
    
}

export default new UserService();
