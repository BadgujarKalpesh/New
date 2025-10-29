// src/api.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken');
        const tempToken = sessionStorage.getItem('tempToken');
        if (config.headers) {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else if (tempToken) {
                config.headers.Authorization = `Bearer ${tempToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('tempToken');
            sessionStorage.removeItem('currentUser');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

const api = {
    get: (url, config) => axiosInstance.get(url, config),
    post: (url, data, config) => axiosInstance.post(url, data, config),
    put: (url, data, config) => axiosInstance.put(url, data, config),
    patch: (url, data, config) => axiosInstance.patch(url, data, config),
    delete: (url, config) => axiosInstance.delete(url, config),
};

export default api;
