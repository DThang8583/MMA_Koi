import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, UserResponse } from './types';

const API_URL = 'http://192.168.137.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Register User
export const registerUser = async (
    email: string,
    password: string,
    phone: string,
    name: string,
    address: string
): Promise<UserResponse> => {
    try {
        const response = await api.post<UserResponse>('/auth/register', {
            email,
            password,
            phone,
            name,
            address,
        });
        console.log('User registered successfully:', response.data);
        return response.data;
    } catch (error: any) {
        // Log the complete error response to inspect its structure
        console.error('Full registration error:', error.response?.data);

        // Try to retrieve error details, or provide more context
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to register';
        console.error('Registration error:', errorMessage);
        throw new Error(errorMessage);
    }
};

// Login User with Token Management
export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
    try {
        const response = await api.post<ApiResponse>('/auth/login', { email, password });
        const { token } = response.data;

        if (token) {
            // Store token in AsyncStorage
            await AsyncStorage.setItem('token', token);

            // Set the token in the header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

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

// Logout User
export const logoutUser = async (): Promise<void> => {
    try {
        // Remove token from AsyncStorage
        await AsyncStorage.removeItem('token');

        // Clear the authorization header
        delete api.defaults.headers.common['Authorization'];

        console.log('User logged out successfully');
    } catch (error) {
        console.error('Error logging out:', error);
        throw new Error('Unable to log out.');
    }
};

// Get Koi List (Using Token)
export const getKoiList = async (): Promise<any> => {
    try {
        const response = await api.get('/fish');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch koi list:', error);
        throw error;
    }
};

export default api;
