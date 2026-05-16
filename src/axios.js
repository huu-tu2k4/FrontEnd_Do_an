import axios from 'axios';
require('dotenv').config();

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

// in-memory access token (preferred)
let inMemoryToken = null;
// initialize in-memory token from localStorage so reloads keep token
try {
    const stored = localStorage.getItem('bearer_token');
    if (stored) inMemoryToken = stored;
} catch (e) {}
export const setAuthToken = (token) => { inMemoryToken = token; };
export const clearAuthToken = () => { inMemoryToken = null; };

// Attach JWT token from memory (fallback to localStorage) to every request if present
instance.interceptors.request.use((config) => {
    try {
        const token = inMemoryToken || localStorage.getItem('bearer_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {
        // ignore
    }
    return config;
});

// Response interceptor: try to refresh access token on 401/403 and retry original request
instance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        if (error && error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            // do not try to refresh if the request was to refresh-token endpoint
            if (originalRequest.url && originalRequest.url.includes('/api/refresh-token')) {
                try { clearAuthToken(); localStorage.removeItem('bearer_token'); localStorage.removeItem('refresh_token'); } catch (e) {}
                if (typeof window !== 'undefined') window.location.href = '/login';
                return Promise.reject(error);
            }
            originalRequest._retry = true;
            try {
                // request new token (refresh token is in HttpOnly cookie)
                const resp = await instance.post('/api/refresh-token');
                if (resp && resp.errCode === 0 && resp.token) {
                    const newToken = resp.token;
                    // store access token in memory
                    setAuthToken(newToken);
                    // update header and retry original request
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return instance(originalRequest);
                }
                // fallback: remove tokens and redirect
                clearAuthToken();
                localStorage.removeItem('bearer_token');
                localStorage.removeItem('refresh_token');
                if (typeof window !== 'undefined') window.location.href = '/login';
            } catch (e) {
                try { clearAuthToken(); localStorage.removeItem('bearer_token'); localStorage.removeItem('refresh_token'); } catch (e) {}
                if (typeof window !== 'undefined') window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
