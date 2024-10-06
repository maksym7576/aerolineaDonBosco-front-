import axios from 'axios';

class SearchService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/flight';
    }

    // Пошук рейсів
    async searchFlights(searchParams) {
        try {
            const response = await axios.get(`${this.baseURL}/search`, {
                params: {
                    originCountry: searchParams.originCountry,
                    originCity: searchParams.originCity,
                    destinationCountry: searchParams.destinationCountry,
                    destinationCity: searchParams.destinationCity,
                    localDate: searchParams.localDate || undefined,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching flights:', error);
            throw error;
        }
    }
}

export default new SearchService();
