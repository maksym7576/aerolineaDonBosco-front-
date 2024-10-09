import axios from 'axios';

class WalletService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/wallet'; 

        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });
    }

    async getWalletByUserId(userId) {
        try {
            const response = await this.api.get(`/user/${userId}`);
            return response.data; 
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            throw error; 
        }
    }

    async addMoneyToWallet(userId, amount) {
        try {
            const response = await this.api.put(
                `/user/addMoney/${userId}?money=${amount}`
            );
            return response.data; 
        } catch (error) {
            console.error('Error adding money to wallet:', error);
            throw error; 
        }
    }
}

export default new WalletService();
