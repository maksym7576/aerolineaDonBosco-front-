import axios from 'axios';

class WalletService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/wallet'; // Основний URL для API гаманців
    }

    // Отримати гаманець за ID користувача
    async getWalletByUserId(userId) {
        try {
            const response = await axios.get(`${this.baseURL}/user/${userId}`);
            return response.data; // Повертає дані гаманця
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            throw error; // Пробросити помилку
        }
    }
}

export default new WalletService();
