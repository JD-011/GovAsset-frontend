import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error normalization
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred. Please try again.';
        const status = error.response?.status;
        return Promise.reject({ message, status, originalError: error });
    }
);

// AUTH API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
};

// USER MANAGEMENT API (Admin)
export const userAPI = {
    getAllUsers: (params) => api.get('/users', { params }),
    getUser: (id) => api.get(`/users/${id}`),
    createUser: (data) => api.post('/users', data),
    updateUser: (id, data) => api.patch(`/users/${id}`, data),
};

// DEPARTMENT API
export const departmentAPI = {
    getAllDepartments: () => api.get('/departments'),
    getDepartment: (id) => api.get(`/departments/${id}`),
    createDepartment: (data) => api.post('/departments', data),
    updateDepartment: (id, data) => api.patch(`/departments/${id}`, data),
};

// ASSET MANAGEMENT API
export const assetAPI = {
    getAssets: (params) => api.get('/assets', { params }),
    getAsset: (id) => api.get(`/assets/${id}`),
    createAsset: (formData) =>
        api.post('/assets', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    updateAsset: (id, formData) =>
        api.patch(`/assets/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    deleteAssetPhoto: (id, publicId) =>
        api.delete(`/assets/${id}/photos`, { data: { publicId } }),
    getAssetHistory: (id) => api.get(`/assets/${id}/history`),
};

// COMPLAINT API
export const complaintAPI = {
    createComplaint: (formData) =>
        api.post('/complaints', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getMyComplaints: () => api.get('/complaints/my'),
    getAssetComplaints: (assetId) => api.get(`/complaints/asset/${assetId}`),
    getComplaint: (id) => api.get(`/complaints/${id}`),
    updateStatus: (id, status) => api.patch(`/complaints/${id}/status`, { status }),
    deletePhoto: (id, publicId) =>
        api.delete(`/complaints/${id}/photos`, { data: { publicId } }),
};

// MAINTENANCE TASK API
export const maintenanceAPI = {
    createTask: (data) => api.post('/maintenance', data),
    getMyTasks: () => api.get('/maintenance/my'),
    getAssetTasks: (assetId) => api.get(`/maintenance/asset/${assetId}`),
    getTask: (id) => api.get(`/maintenance/${id}`),
    updateTask: (id, data) => api.patch(`/maintenance/${id}`, data),
};

// NOTIFICATION API
export const notificationAPI = {
    getMyNotifications: () => api.get('/notifications'),
    markRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllRead: () => api.patch('/notifications/read-all'),
};

// DASHBOARD API
export const dashboardAPI = {
    getSummary: () => api.get('/dashboard/summary'),
};

export default api;
