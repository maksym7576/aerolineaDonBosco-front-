import axios from 'axios';

class UserService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';

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
            return response.data; 
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
            return response.data; 
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }

    async getWalletByUserId(userId) {
        try {
            const response = await this.api.get(`/wallet/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching wallet:', error);
            throw error;
        }
    }
    
}

export default new UserService();
