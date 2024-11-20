// ReserveService.js
import axios from 'axios';

class ReserveService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/seats'; 

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

    // Method for creating seats
    async createSeats(seatsList) {
        try {
            const response = await this.api.post('/create/all', seatsList);
            return response.data;
        } catch (error) {
            console.error('Error creating seats:', error);
            throw error;
        }
    }

    async createReservation(reservationData) {
        try {
            const response = await this.api.post(`/new/reservation`, reservationData);
            return response.data; 
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error; 
        }
    }

    async getAllReservationByUserId(userId) {
        try {
            const response = await this.api.get(`/user/${userId}`);
            return response.data; 
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw error; 
        }
    }

    async cancelReservation(reservationId) {
        try {
            const response = await this.api.put(`/return/${reservationId}`, null);
            return response.data; 
        } catch (error) {
            console.error('Error canceling reservation:', error);
            throw error; 
        }
    }

    async fetchSeats(flightId) {
        try {
            const response = await this.api.get(`/countDiscount/flight/${flightId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching seats:', error);
            throw error;
        }
    }
}

export default new ReserveService();
