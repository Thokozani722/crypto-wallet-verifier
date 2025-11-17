import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('cryptoguard-auth');
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  return new Error('Unexpected error, please try again.');
};

export default api;
