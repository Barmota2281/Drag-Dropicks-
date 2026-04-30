import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(
    (config) => {
        // НЕ добавляем токен для auth эндпоинтов — они публичные
        const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register')
        if (!isAuthEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Перехватчик ответов — если 401 и не auth эндпоинт, значит токен протух
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || ''
            if (!url.includes('/auth/')) {
                // Токен протух — чистим и редиректим на логин
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error);
    }
);

export default api;