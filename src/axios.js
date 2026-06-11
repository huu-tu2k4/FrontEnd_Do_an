import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

let inMemoryToken = null;

try {
    const stored = localStorage.getItem('bearer_token');
    if (stored) inMemoryToken = stored;
} catch (e) {}
export const setAuthToken = (token) => { inMemoryToken = token; };
export const clearAuthToken = () => { inMemoryToken = null; };

instance.interceptors.request.use((config) => {
    try {
        const token = inMemoryToken || localStorage.getItem('bearer_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {

    }
    return config;
});

instance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        if (error && error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {

            if (originalRequest.url && originalRequest.url.includes('/api/refresh-token')) {
                try { clearAuthToken(); localStorage.removeItem('bearer_token'); localStorage.removeItem('refresh_token'); } catch (e) {}
                if (typeof window !== 'undefined') window.location.href = '/login';
                return Promise.reject(error);
            }
            originalRequest._retry = true;
            try {

                const resp = await instance.post('/api/refresh-token');
                if (resp && resp.errCode === 0 && resp.token) {
                    const newToken = resp.token;

                    setAuthToken(newToken);

                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return instance(originalRequest);
                }

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
