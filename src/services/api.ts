import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL
const API_URL = 'http://192.168.1.6:8000/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set timeout to 10 seconds
});

export interface AccountInfo {
  _id: string;
  email: string;
  name: string;
  phone: string;
  dob: string | null;
  address: string;
  role: string
}
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

// Blog details interface
export interface Blog {
  _id: string;
  fish: string;  
  title: string;
  description: string;
  image: string;
  postInfo: string;
}


// Get Blog List
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
export const getAccountInfo = async (): Promise<any> => {
  try {
    // Lấy token từ AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token not found in AsyncStorage');
      throw new Error('Token not found');
    }

    // Gọi API với token trong header
    const response = await api.get('/auth/infoUser', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Kiểm tra dữ liệu trả về và truy cập vào "info"
    if (response.status === 200 && response.data?.info) {
      console.log('Fetched account info:', response.data.info);
      return response.data.info; // Trả về chỉ dữ liệu trong "info"
    } else {
      console.error('Invalid response structure from server:', response);
      throw new Error('Invalid response structure from server');
    }
  } catch (error: any) {
    // Kiểm tra nếu lỗi là do không có phản hồi hoặc lỗi mạng
    if (!error.response) {
      console.error('Network error or server did not respond:', error);
      throw new Error('Network error: Unable to reach the server.');
    }

    // Ghi lại lỗi từ phản hồi của máy chủ
    console.error('Error fetching account info:', error.response.data || error.message);
    throw new Error(error.response.data?.message || 'Unable to fetch account information');
  }
};

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
  KoiScreen: undefined;
  KoiDetail: { id: string };
  AccountScreen: undefined;
  HomeScreen: {_id:string};
  BlogListScreen: undefined;
  BlogDetail:{_id:string}  
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
    const response = await api.get('/fish', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.data || !response.data.fishes) {
      throw new Error('No fishes data found');
    }

    return response.data.fishes;
  } catch (error: any) {
    console.error('Error fetching koi list:', error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Get Koi Detail
export const getKoiDetail = async (id: string): Promise<Koi> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.get(`/fish/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.data || !response.data.fishInfo) {
      throw new Error('No fish details found');
    }

    console.log('Fetched koi details:', response.data.fishInfo);
    return response.data.fishInfo;
  } catch (error: any) {
    console.error('Error fetching koi detail:', error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export default api;
