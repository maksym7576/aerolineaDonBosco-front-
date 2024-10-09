import axios from 'axios';

class FlightImageService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/image';
    }

    async uploadFlightImage(flightId, formData, token) {
        try {
            const response = await axios.post(`${this.baseURL}/create/${flightId}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading flight image:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async getImageByFlightId(flightId) {
        try {
            const response = await axios.get(`${this.baseURL}/flight/${flightId}`);
            return response.data; 
        } catch (error) {
            console.error('Error fetching image:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

export default new FlightImageService();
