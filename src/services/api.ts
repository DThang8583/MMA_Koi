import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Register User
export const registerUser = async (email: string, password: string) => {
    try {
        const response = await api.post('/register', { email, password });
        console.log('User registered successfully:', response.data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Error from the server
            console.error('Registration error:', error.response.data.message);
            throw new Error(error.response.data.message || 'Failed to register');
        } else {
            // Network or other error
            console.error('Network error during registration:', error.message);
            throw new Error('Network error: Unable to register user.');
        }
    }
};

// Login User with Token Management
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await api.post('/login', { email, password });
        const { token } = response.data;

        // Store token in local storage (or secure storage)
        localStorage.setItem('token', token);

        // Set the token in the header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log('Login successful:', response.data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Login error:', error.response.data.message);
            throw new Error(error.response.data.message || 'Failed to login');
        } else {
            console.error('Network error during login:', error.message);
            throw new Error('Network error: Unable to log in.');
        }
    }
};

// Get Koi List (Using Token)
export const getKoiList = async () => {
    try {
        const response = await api.get('/koi');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch koi list:', error);
        throw error;
    }
};

// Get User Info (Using Token)
export const getUserInfo = async () => {
    try {
        const response = await api.get('/user');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw error;
    }
};

export default api;
