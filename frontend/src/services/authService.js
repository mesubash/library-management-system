import api, { setAuthToken } from '../utils/api';

// Login function
export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });

        if (response.data.accessToken) {
            setAuthToken(response.data.accessToken);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

// Logout function
export const logout = () => {
    setAuthToken(null);
};
