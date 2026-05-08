import axios from 'axios';

// ✅ Tự động nhận diện môi trường: Localhost hoặc Render
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BASE_URL = isLocal 
  ? 'https://localhost:7038' 
  : 'https://hothibichnhung-2123110314.onrender.com';

const API_BASE_URL = `${BASE_URL}/api`;

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.includes('localhost:7038') || url.includes('onrender.com')) {
    // Nếu là link tuyệt đối, chỉ cần đảm bảo nó dùng đúng BASE_URL hiện tại
    const path = url.split('/api/')[1] || url.split('/uploads/')[1];
    if (path) return `${BASE_URL}/uploads/${path.split('/').pop()}`;
  }
  if (url.startsWith('/')) {
    return `${BASE_URL}${url}`;
  }
  return url;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: () => api.get('/Products'),
  getById: (id) => api.get(`/Products/${id}`),
  create: (data) => api.post('/Products', data),
  update: (id, data) => api.put(`/Products/${id}`, data),
  delete: (id) => api.delete(`/Products/${id}`),
};

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
  getAll: () => api.get('/Users'),
  getById: (id) => api.get(`/Users/${id}`),
};

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/Uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export default api;
