import api from '../utils/api';

const API_BASE = '/api/admin';

export const adminApi = {
  saveContent: async (data, isEditing = false) => {
    const method = isEditing ? 'put' : 'post';
    const response = await api[method](`${API_BASE}/content`, data);
    return response.data;
  },

  deleteContent: async (id) => {
    const response = await api.delete(`${API_BASE}/content?id=${id}`);
    return response.data;
  },

  getLeads: async () => {
    const response = await api.get(`${API_BASE}/leads`);
    return response.data;
  },

  updateLeadStatus: async (id, status) => {
    const response = await api.put(`${API_BASE}/leads`, { id, status });
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`${API_BASE}/upload?filename=${encodeURIComponent(file.name)}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      const contentType = error.response?.headers?.['content-type'];
      if (error.response?.status === 404 || (contentType && contentType.includes("text/html"))) {
        throw new Error("Upload API not found. Check Vercel deployment.");
      }
      throw new Error(error.response?.data?.error || 'Upload failed');
    }
  }
};
