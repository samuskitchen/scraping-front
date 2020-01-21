import axios from 'axios'

const API_URL = 'http://localhost:8005'
const SCRAPING_API_URL = `${API_URL}/`

class DataServeService {
    
    getByAddress(id) {
        return axios.get(`${SCRAPING_API_URL}scraping/address=${id}`);
    }

    getAll() {
        return axios.get(`${SCRAPING_API_URL}scraping/`);
    }
}

export default new DataServeService()