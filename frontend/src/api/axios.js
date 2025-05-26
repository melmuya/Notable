import axios from 'axios';

const BASE_URL = process.env.VITE_APP_API_URL;
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

export default axiosInstance;