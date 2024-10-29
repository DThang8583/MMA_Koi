import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL
const API_URL = 'http://192.168.2.16:8000/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Koi details interfaces
export interface KoiType {
  _id: string;
  name: string;
  origin: string;
}

export interface Koi {
  _id: string;
  name: string;
  origin: string;
  image: string;
  description: string;
  gender: string;
  size: number;
  type: KoiType;
  feedingAmount: number;
  screeningRate: number;
  category: string;
  price: number;
  sold: boolean;
  certificates: string[];
  yob: number;
  consignmentStatus: string;
  createdAt: string;
  updatedAt: string;
  age: number;
}

// User details interface
export interface User {
  id: string;
  name: string;
  email: string;
}

// Define RootStackParamList for navigation 
export type RootStackParamList = {
  LoadingPage: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  // KoiScreen: undefined;
  KoiDetail: { id: string };
  AccountScreen: undefined;
  HomeScreen: undefined;
  MainTabs: undefined;
};

// Interface for API responses
export interface ApiResponse {
  token: string;
  [key: string]: any;
}

export interface UserResponse {
  [key: string]: any;
}

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
    console.error('Full registration error:', error.response?.data);
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
      await AsyncStorage.setItem('token', token);
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
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Unable to log out.');
  }
};

// Get Koi List
export const getKoiList = async (): Promise<Koi[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/fish`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch koi list:', errorData);
      throw new Error(errorData.message || 'Failed to fetch koi list');
    }

    const data = await response.json();
    if (!data.fishes) {
      throw new Error('No fishes data found');
    }

    return data.fishes;
  } catch (error: any) {
    console.error('Error fetching koi list:', error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Get Koi Detail
export const getKoiDetail = async (id: string): Promise<Koi> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/fish/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch koi details:', errorData);
      throw new Error(errorData.message || 'Failed to fetch koi details');
    }

    const data = await response.json();
    console.log('Fetched koi details:', data.fishInfo);
    return data.fishInfo;
  } catch (error: any) {
    console.error('Error fetching koi detail:', error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export default api;
