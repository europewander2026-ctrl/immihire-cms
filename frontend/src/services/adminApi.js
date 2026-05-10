const API_BASE = `${import.meta.env.VITE_API_URL || 'https://immihire-cms.vercel.app'}/api/admin`;

const getHeaders = () => {
  let rawToken = localStorage.getItem('admin_token') || '';
  let cleanToken = rawToken.replace(/^"|"$/g, '');
  cleanToken = cleanToken.replace(/^Bearer\s+/i, '');

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cleanToken}`
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

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.includes("text/html")) {
        throw new Error("API Route Not Found (404) - Server returned HTML instead of JSON. Check deployment environment.");
      }
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
  },

  uploadImage: async (file) => {
    let rawToken = localStorage.getItem('admin_token') || '';
    let cleanToken = rawToken.replace(/^"|"$/g, '');
    cleanToken = cleanToken.replace(/^Bearer\s+/i, '');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanToken}`
      },
      body: formData,
    });
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Upload API not found. Check Vercel deployment.");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Upload failed');
    }
    return response.json();
  }
};
