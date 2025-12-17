import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  (typeof process !== 'undefined' ? process.env.REACT_APP_API_URL : undefined) ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured/homepage'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
};

// Admin API
export const adminAPI = {
  login: (password) => api.post('/admin/login', { password }),
  getStats: (password) => api.post('/admin/stats', { password }),
  getOrders: (password, params = {}) => api.post('/admin/orders', { password, ...params }),
  updateOrderStatus: (id, password, status, notes) => 
    api.put(`/admin/orders/${id}`, { password, status, notes }),
  createProduct: (password, productData) => 
    api.post('/admin/products', { password, ...productData }),
  updateProduct: (id, password, productData) => 
    api.put(`/admin/products/${id}`, { password, ...productData }),
  deleteProduct: (id, password) => 
    api.delete(`/admin/products/${id}`, { data: { password } }),
};

export default api;
