import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await api.post('/register', { email, password });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
export const loginUser = async (email: string, password: string) => {
    try {
        const data = await loginUser(email, password);
        console.log('Login successful:', data);
    } catch (error) {
        console.error('Login error:', error);
    }
};
