import axios from 'axios';
const API_URL = 'http://localhost:3001/api/usuarios';
const getUsuarios = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
const getUsuarioById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
const updateUsuario = async (id, usuario) => {
    const response = await axios.put(`${API_URL}/${id}`, usuario);
    return response.data;
};
const createUsuario = async (usuario) => {
    const response = await axios.post(API_URL, usuario);
    return response.data;
};
const deleteUsuario = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
export default {
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    createUsuario,
    deleteUsuario
};
