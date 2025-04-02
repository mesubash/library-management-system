import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; 

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('accessToken', token); // Store in localStorage
    } else {
        delete api.defaults.headers['Authorization'];
        localStorage.removeItem('accessToken');
    }
};

export default api;