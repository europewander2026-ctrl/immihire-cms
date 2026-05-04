const API_BASE = '/api/admin';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const adminApi = {
  saveContent: async (data, isEditing = false) => {
    const method = isEditing ? 'PUT' : 'POST';
    const response = await fetch(`${API_BASE}/content`, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save content');
    }
    return response.json();
  },

  deleteContent: async (id) => {
    const response = await fetch(`${API_BASE}/content?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete content');
    return response.json();
  },

  getLeads: async () => {
    const response = await fetch(`${API_BASE}/leads`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
  },

  updateLeadStatus: async (id, status) => {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ id, status })
    });
    if (!response.ok) throw new Error('Failed to update lead status');
    return response.json();
  }
};
