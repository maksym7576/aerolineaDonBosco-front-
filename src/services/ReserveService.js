import axios from 'axios';

class ReserveService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/v1'; // Основний URL для API
    }

    // Створення нової броні
    async createReservation(reservationData) {
        try {
            const token = localStorage.getItem('token'); // Отримати токен з локального сховища
            const userId = localStorage.getItem('userId'); // Отримати ID користувача

            if (!token || !userId) {
                throw new Error('User not authenticated'); // Перевірка на аутентифікацію
            }
            console.log('Token:', token);
            console.log('UserId:', userId);
            const response = await axios.post(`${this.baseURL}/new/reservation`, reservationData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data; // Повертає дані бронювання
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error; // Пробросити помилку
        }
    }

    // Отримання списку резервувань користувача
    async getAllReservationByUserId(userId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/reservation/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data; // Повертає список бронювань
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw error; // Пробросити помилку
        }
    }

    // Відміна резервування і повернення коштів
    async cancelReservation(reservationId) {
        try {
            const token = localStorage.getItem('token'); // Отримати токен з локального сховища
            const response = await axios.put(`${this.baseURL}/return/${reservationId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data; // Повертає повідомлення про успішне скасування
        } catch (error) {
            console.error('Error canceling reservation:', error);
            throw error; // Пробросити помилку
        }
    }
}

export default new ReserveService();
