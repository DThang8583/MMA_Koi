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
export interface Blog {
  _id: string;
  fish: string;
  title: string;
  description: string;
  image: string;
  postInfo: string;
}
export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await api.get('/post'); // assuming endpoint is /post
    return response.data.posts;
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch blogs');
  }
};

// Get Blog Detail
export const getBlogDetail = async (id: string): Promise<Blog> => {
  try {
    const response = await api.get(`/post/${id}`); // assuming endpoint is /post/:id
    return response.data;
  } catch (error: any) {
    console.error('Error fetching blog detail:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch blog detail');
  }
};

// Create Blog Post
export const createBlog = async (blogData: Partial<Blog>): Promise<Blog> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.post('/post', blogData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating blog:', error);
    throw new Error(error.response?.data?.message || 'Failed to create blog');
  }
};

// Update Blog Post
export const updateBlog = async (id: string, blogData: Partial<Blog>): Promise<Blog> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.put(`/post/${id}`, blogData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating blog:', error);
    throw new Error(error.response?.data?.message || 'Failed to update blog');
  }
};

// Delete Blog Post
export const deleteBlog = async (id: string): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    await api.delete(`/post/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    console.log('Blog deleted successfully');
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete blog');
  }
};

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
  phone: string | null;
  dob: string | null;
  address: string;
  role?: string;
}

// Define RootStackParamList for navigation 
export type RootStackParamList = {
  LoadingPage: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  KoiDetail: { id: string };
  AccountScreen: undefined;
  HomeScreen: undefined;
  MainTabs: undefined;
  BlogListScreen: undefined;
  BlogDetail: { _id: string };
  CartScreen: undefined;
};

// Interface for API responses
export interface ApiResponse {
  token: string;
  [key: string]: any;
}

export interface UserResponse {
  [key: string]: any;
}

export interface AccountInfo {
  email: string;
  name: string;
  phone: string | null;
  dob: string | null;
  address: string;
  role?: string;
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
    const { accessToken } = response.data;

    if (accessToken) {
      await AsyncStorage.setItem('token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      console.log('Token saved to AsyncStorage:', accessToken);
    }

    console.log('Login successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

// Logout User
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('Token removed from AsyncStorage and header deleted');
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

// Fetch Account Information
export const getAccountInfo = async (): Promise<{ info: User }> => {
  try {
    const accessToken = await AsyncStorage.getItem('token');
    const response = await api.get<{ info: User }>('/auth/infoUser', {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    console.log('Fetched account info:', response.data.info);
    return response.data; // Trả về toàn bộ response để có lớp "info"
  } catch (error: any) {
    console.error('Error fetching account info:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch account information');
  }
};

// Update Account Information
export const updateAccountInfo = async (field: string, value: string): Promise<void> => {
  try {
    const accessToken = await AsyncStorage.getItem('token');
    if (!accessToken) {
      console.error('No access token found');
      throw new Error('Authorization token missing');
    }

    console.log(`Updating ${field} with value: ${value}`);
    await api.put(
      '/auth/infoUser',
      { [field]: value },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(`${field} updated successfully`);
  } catch (error: any) {
    console.error(`Error updating ${field}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to update ${field}`);
  }
};

export const fetchKoiInCart = async (): Promise<Koi[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.get('/cart', {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data.cartItems;
  } catch (error: any) {
    console.error('Error fetching koi in cart:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart items');
  }
};

// Fetch available vouchers
export interface Voucher {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  expirationDate: string;
}

export const fetchAvailableVouchers = async (): Promise<Voucher[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.get('/vouchers', {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data.vouchers;
  } catch (error: any) {
    console.error('Error fetching vouchers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vouchers');
  }
};

// Apply voucher to total
export const applyVoucherToTotal = (total: number, voucher: Voucher): number => {
  const discount = (total * voucher.discountPercentage) / 100;
  return total - Math.min(discount, voucher.maxDiscount);
};

export default api;
