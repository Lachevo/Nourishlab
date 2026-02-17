import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        // Axios will automatically set Content-Type correctly for FormData or JSON
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        // Skip adding token for authentication endpoints
        const isAuthUrl = config.url?.includes('/auth/');
        if (!isAuthUrl) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh (basic implementation)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip token refresh for auth-related endpoints
        const isAuthUrl = originalRequest?.url?.includes('/auth/');

        if (error.response?.status === 401 && !originalRequest?._retry && !isAuthUrl) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const baseUrl = import.meta.env.VITE_API_URL || '';
                const refreshUrl = baseUrl.startsWith('http') ? new URL('/api/auth/refresh/', baseUrl).toString() : '/api/auth/refresh/';

                const response = await axios.post(refreshUrl, { refresh: refreshToken });
                const { access } = response.data;
                localStorage.setItem('accessToken', access);
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (err) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Only redirect if not already on login/register pages
                if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
