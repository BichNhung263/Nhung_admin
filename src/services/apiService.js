import axios from 'axios';

const API_BASE_URL = 'http://localhost:5223/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: () => api.get('/Products'),
  getById: (id) => api.get(`/Products/${id}`),
  create: (data) => api.get('/Products', data), // Re-check if it's POST or GET in Controller, usually POST
  update: (id, data) => api.put(`/Products/${id}`, data),
  delete: (id) => api.delete(`/Products/${id}`),
};

// Fixing the create method based on standard REST (it should be post)
productService.create = (data) => api.post('/Products', data);

export const categoryService = {
  getAll: () => api.get('/Categories'),
  getById: (id) => api.get(`/Categories/${id}`),
  create: (data) => api.post('/Categories', data),
  update: (id, data) => api.put(`/Categories/${id}`, data),
  delete: (id) => api.delete(`/Categories/${id}`),
};

export const orderService = {
  getAll: () => api.get('/Orders'),
  getById: (id) => api.get(`/Orders/${id}`),
  update: (id, data) => api.put(`/Orders/${id}`, data),
  delete: (id) => api.delete(`/Orders/${id}`),
};

export const userService = {
  getAll: () => api.get('/User'),
  getById: (id) => api.get(`/User/${id}`),
};

export default api;
