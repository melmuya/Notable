import axios from 'axios';

// const BASE_URL = process.env.VITE_APP_API_URL;
const BASE_URL = "https://notable-backend-rqt3.onrender.com" || "http://localhost:5000";
console.log('AXIOS BASE_URL:', BASE_URL); // Debug: check what base URL is being used

const axiosInstance = axios.create({ baseURL: BASE_URL})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Add a response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;