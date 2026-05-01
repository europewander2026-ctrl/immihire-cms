import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  
  // Blog form states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check auth by attempting to fetch secure data (e.g., consultations)
    // In a real app, you might have a dedicated /api/auth/me route
    const checkAuthAndFetchData = async () => {
      try {
        // We'll use a hypothetical secure route or rely on interceptor
        // Let's assume we fetch consultations, which should be protected
        // For this scaffold, we'll pretend /api/admin/consultations exists
        // or we just handle 401 globally
        
        // Simulating the fetch:
        // const res = await api.get('/api/admin/consultations');
        // setConsultations(res.data);
        
        // Mock data for scaffold
        setConsultations([
          { id: '1', name: 'John Doe', email: 'john@example.com', status: 'PENDING', createdAt: new Date().toISOString() },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'REVIEWED', createdAt: new Date().toISOString() }
        ]);

        setIsAuthenticated(true);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          console.error("Failed to load data", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;

      // 1. Upload image to protected /api/upload
      if (blogImage) {
        const formData = new FormData();
        // The endpoint expects binary data, but we can send as needed.
        // According to our backend, we use @vercel/blob put which accepts request body
        // So we send the file with the x-vercel-filename header
        const uploadRes = await api.post('/api/upload', blogImage, {
          headers: {
            'x-vercel-filename': blogImage.name,
            'Content-Type': blogImage.type
          }
        });
        imageUrl = uploadRes.data.url;
      }

      // 2. Submit new blog post
      const blogData = {
        title: blogTitle,
        slug: blogSlug,
        content: blogContent,
        imageUrl,
        published: true // Default to true for now
      };

      // Hypothetical endpoint since it wasn't requested in Phase 2
      await api.post('/api/blogs', blogData);

      alert('Blog created successfully!');
      
      // Reset form
      setBlogTitle('');
      setBlogSlug('');
      setBlogContent('');
      setBlogImage(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Failed to create blog:', error);
      alert('Error creating blog. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={() => {
              // Handle logout logic here (e.g., clear cookies, redirect)
              navigate('/login');
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Consultations Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Consultations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {consultations.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-4 font-medium text-gray-900">{c.name}</td>
                      <td className="py-4 px-4 text-gray-600">{c.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${
                          c.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          c.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secure Form: Upload Blog Post */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Blog</h2>
            <form onSubmit={handleBlogSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={blogTitle}
                  onChange={e => setBlogTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="E.g., Canada Express Entry 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input 
                  type="text" 
                  required
                  value={blogSlug}
                  onChange={e => setBlogSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="canada-express-entry-2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={e => setBlogImage(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rich Text Content (HTML)</label>
                <textarea 
                  required
                  rows={6}
                  value={blogContent}
                  onChange={e => setBlogContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
                  placeholder="<p>Write your content here...</p>"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">HTML content is safely sanitized on display.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading & Creating...' : 'Publish Blog Post'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
