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
export const AccountInfo = async () => {
    try {
      const response = await api.get('/account');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Nếu error là một instance của Error, thì trả về message của nó
        throw new Error(error.message || 'Không thể lấy thông tin tài khoản');
      } else {
        // Nếu error không phải instance của Error
        throw new Error('Không thể lấy thông tin tài khoản');
      }
    }
  };
  
  export const updateAccountInfo = async (field: string, value: string) => {
    try {
      const response = await api.put(`/account/update`, { field, value });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Nếu error là một instance của Error, thì trả về message của nó
        throw new Error(error.message || 'Không thể cập nhật thông tin tài khoản');
      } else {
        // Nếu error không phải instance của Error
        throw new Error('Không thể cập nhật thông tin tài khoản');
      }
    }
  };
