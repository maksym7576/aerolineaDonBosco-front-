import axios from 'axios';

class ReserveService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/v1'; // Основний URL для API

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

    // Створення нової броні
    async createReservation(reservationData) {
        try {
            const userId = localStorage.getItem('userId'); // Отримати ID користувача
            if (!userId) {
                throw new Error('User not authenticated'); // Перевірка на аутентифікацію
            }
            const response = await this.api.post(`/new/reservation`, reservationData);
            return response.data; // Повертає дані бронювання
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error; // Пробросити помилку
        }
    }

    // Отримання списку резервувань користувача
    async getAllReservationByUserId(userId) {
        try {
            const response = await this.api.get(`/reservation/user/${userId}`);
            return response.data; // Повертає список бронювань
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw error; // Пробросити помилку
        }
    }

    // Відміна резервування і повернення коштів
    async cancelReservation(reservationId) {
        try {
            const response = await this.api.put(`/return/${reservationId}`, null);
            return response.data; // Повертає повідомлення про успішне скасування
        } catch (error) {
            console.error('Error canceling reservation:', error);
            throw error; // Пробросити помилку
        }
    }
}

export default new ReserveService();
