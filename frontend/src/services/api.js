import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const token = localStorage.getItem('access_token');
                if (token) {
                    const response = await axios.post(
                        `${api.defaults.baseURL}/auth/refresh`,
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    const newToken = response.data.access_token;
                    localStorage.setItem('access_token', newToken);

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear auth data and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ============================================================================
// Authentication API
// ============================================================================

export const authAPI = {
    register: async (email, username, password) => {
        const response = await api.post('/auth/register', {
            email,
            username,
            password,
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password,
        });

        // Store token
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post('/auth/refresh');
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
        }
        return response.data;
    },
};

// ============================================================================
// User Profile API
// ============================================================================

export const userAPI = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/users/stats');
        return response.data;
    },

    getRecommendations: async () => {
        const response = await api.get('/users/recommendations');
        return response.data;
    },
};

// ============================================================================
// Predictions API
// ============================================================================

export const predictionsAPI = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/predictions/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    create: async (predictionData) => {
        const response = await api.post('/predictions/', predictionData);
        return response.data;
    },

    getAll: async (params = {}) => {
        const { skip = 0, limit = 100, sort_by = 'created_at', order = 'desc' } = params;
        const response = await api.get('/predictions/', {
            params: { skip, limit, sort_by, order },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/predictions/${id}`);
        return response.data;
    },

    update: async (id, updateData) => {
        const response = await api.put(`/predictions/${id}`, updateData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/predictions/${id}`);
    },

    getCount: async () => {
        const response = await api.get('/predictions/count');
        return response.data;
    },
};

// ============================================================================
// ML Prediction API (existing endpoint)
// ============================================================================

export const mlAPI = {
    predict: async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await api.post('/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getClasses: async () => {
        const response = await api.get('/classes');
        return response.data;
    },

    healthCheck: async () => {
        const response = await api.get('/health');
        return response.data;
    },

    validateImage: async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await api.post('/api/validate-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

export const getToken = () => {
    return localStorage.getItem('access_token');
};

export default api;
