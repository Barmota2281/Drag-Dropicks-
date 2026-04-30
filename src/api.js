import axios from 'axios';
import { isTokenExpired, refreshToken } from './tokenManager';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(async (config) => {
    const isAuthEndpoint = config.url?.includes('/auth/login') ||
        config.url?.includes('/auth/register');
    if (!isAuthEndpoint) {
        let token = localStorage.getItem('token');

        if (isTokenExpired()) {
            token = await refreshToken();
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
            const url = error.config?.url || '';
            if (!url.includes('/auth/') && !error.config._retried) {
                error.config._retried = true;
                const newToken = await refreshToken();
                if (newToken) {
                    error.config.headers['Authorization'] = `Bearer ${newToken}`;
                    return api.request(error.config);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiresAt');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;