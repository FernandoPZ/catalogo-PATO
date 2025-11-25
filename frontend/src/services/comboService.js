import axios from 'axios';

const API_URL = 'http://localhost:3001/api/combos';

const getCombos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export default {
    getCombos
};