import axios from 'axios';

class WalletService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/wallet'; // Основний URL для API гаманців

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

    // Отримати гаманець за ID користувача
    async getWalletByUserId(userId) {
        try {
            const response = await this.api.get(`/user/${userId}`);
            return response.data; // Повертає дані гаманця
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            throw error; // Пробросити помилку
        }
    }

    // Додати гроші до гаманця
    async addMoneyToWallet(userId, amount) {
        try {
            const response = await this.api.put(
                `/user/addMoney/${userId}?money=${amount}`
            );
            return response.data; // Повертає дані після успішного додавання грошей
        } catch (error) {
            console.error('Error adding money to wallet:', error);
            throw error; // Пробросити помилку
        }
    }
}

export default new WalletService();
