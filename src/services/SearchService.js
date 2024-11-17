import axios from 'axios';

class SearchService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api/flight';
  }

  async searchFlights(searchParams) {
    try {
      const response = await axios.post(`${this.baseURL}/search`, searchParams, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  }
}

export default new SearchService();
