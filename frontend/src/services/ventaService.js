import axios from 'axios';

const API_URL = 'http://localhost:3001/api/ventas';

const crearVenta = async (ventaData) => {
    // ventaData debe tener: { idUsuario, total, productos: [...] }
    const response = await axios.post(API_URL, ventaData);
    return response.data;
};

export default {
    crearVenta
};