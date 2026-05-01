import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const [consultations, setConsultations] = useState([]);
  
  // Blog form states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Branding states
  const [settings, setSettings] = useState({ logoUrl: null, faviconUrl: null });
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [isBrandingSubmitting, setIsBrandingSubmitting] = useState(false);
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  // Admin Management States
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const meRes = await api.get('/api/me');
        setUser(meRes.data);
        
        // Mock data for scaffold (You can replace this with actual /api/consultations fetch later)
        setConsultations([
          { id: '1', name: 'John Doe', email: 'john@example.com', status: 'PENDING', createdAt: new Date().toISOString() },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'REVIEWED', createdAt: new Date().toISOString() }
        ]);

        const settingsRes = await api.get('/api/settings');
        setSettings(settingsRes.data);

        if (meRes.data.role === 'SUPERADMIN') {
          const adminsRes = await api.get('/api/admins');
          setAdmins(adminsRes.data);
        }

        setIsAuthenticated(true);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
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

      if (blogImage) {
        const uploadRes = await api.post('/api/upload', blogImage, {
          headers: {
            'x-vercel-filename': blogImage.name,
            'Content-Type': blogImage.type
          }
        });
        imageUrl = uploadRes.data.url;
      }

      const blogData = {
        title: blogTitle,
        slug: blogSlug,
        content: blogContent,
        category: blogCategory,
        author: blogAuthor,
        read_time: blogReadTime,
        imageUrl,
        published: true
      };

      await api.post('/api/blogs', blogData);
      alert('Blog created successfully!');
      
      setBlogTitle('');
      setBlogSlug('');
      setBlogContent('');
      setBlogCategory('');
      setBlogAuthor('');
      setBlogReadTime('');
      setBlogImage(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Failed to create blog:', error);
      alert('Error creating blog. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandingSubmit = async (e) => {
    e.preventDefault();
    setIsBrandingSubmitting(true);
    
    try {
      let logoUrl = settings.logoUrl;
      let faviconUrl = settings.faviconUrl;

      if (logoFile) {
        const uploadRes = await api.post('/api/upload', logoFile, {
          headers: {
            'x-vercel-filename': logoFile.name,
            'Content-Type': logoFile.type
          }
        });
        logoUrl = uploadRes.data.url;
      }

      if (faviconFile) {
        const uploadRes = await api.post('/api/upload', faviconFile, {
          headers: {
            'x-vercel-filename': faviconFile.name,
            'Content-Type': faviconFile.type
          }
        });
        faviconUrl = uploadRes.data.url;
      }

      const updatedSettings = await api.post('/api/settings', { logoUrl, faviconUrl });
      setSettings(updatedSettings.data);
      alert('Site branding updated successfully! Please refresh to see changes globally.');
      
      setLogoFile(null);
      setFaviconFile(null);
      if(logoInputRef.current) logoInputRef.current.value = '';
      if(faviconInputRef.current) faviconInputRef.current.value = '';
      
    } catch (error) {
      console.error('Failed to update branding:', error);
      alert('Error updating branding. Check console.');
    } finally {
      setIsBrandingSubmitting(false);
    }
  };

  // Admin Management Handlers
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/admins', { email: newAdminEmail, password: newAdminPassword });
      setAdmins([...admins, res.data]);
      setNewAdminEmail('');
      setNewAdminPassword('');
      alert('Admin created successfully.');
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating admin');
    }
  };

  const handleToggleAdmin = async (adminId, currentStatus) => {
    try {
      const res = await api.patch(`/api/admins/${adminId}/status`, { isActive: !currentStatus });
      setAdmins(admins.map(a => a.id === adminId ? { ...a, isActive: res.data.isActive } : a));
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating status');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to permanently delete this admin?')) {
      try {
        await api.delete(`/api/admins/${adminId}`);
        setAdmins(admins.filter(a => a.id !== adminId));
      } catch (err) {
        alert(err.response?.data?.error || 'Error deleting admin');
      }
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Logged in as {user?.email} ({user?.role})</p>
          </div>
          <button 
            onClick={() => {
              document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" required value={blogTitle} onChange={e => setBlogTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Canada Express Entry 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input 
                  type="text" required value={blogSlug} onChange={e => setBlogSlug(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="canada-express-entry-2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    type="text" value={blogCategory} onChange={e => setBlogCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                  <input 
                    type="text" value={blogReadTime} onChange={e => setBlogReadTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input 
                  type="text" value={blogAuthor} onChange={e => setBlogAuthor(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <input 
                  type="file" accept="image/*" ref={fileInputRef} onChange={e => setBlogImage(e.target.files[0])}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (Rich Text)</label>
                <div className="bg-white">
                  <ReactQuill theme="snow" value={blogContent} onChange={setBlogContent} className="h-40 mb-10" />
                </div>
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 mt-4"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
              </button>
            </form>
          </div>

          {/* Secure Form: Site Branding */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Site Branding Settings</h2>
            <form onSubmit={handleBrandingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo</label>
                  {settings.logoUrl && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Current Logo:</p>
                      <img src={settings.logoUrl} alt="Current Logo" className="h-12 w-auto object-contain border p-1 rounded" />
                    </div>
                  )}
                  <input 
                    type="file" accept="image/*" ref={logoInputRef} onChange={e => setLogoFile(e.target.files[0])}
                    className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Favicon</label>
                  {settings.faviconUrl && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Current Favicon:</p>
                      <img src={settings.faviconUrl} alt="Current Favicon" className="h-8 w-8 object-contain border p-1 rounded" />
                    </div>
                  )}
                  <input 
                    type="file" accept="image/x-icon,image/png,image/svg+xml" ref={faviconInputRef} onChange={e => setFaviconFile(e.target.files[0])}
                    className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={isBrandingSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                {isBrandingSubmitting ? 'Saving...' : 'Save Branding'}
              </button>
            </form>
          </div>

          {/* User Management (SUPERADMIN only) */}
          {user?.role === 'SUPERADMIN' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 lg:col-span-3">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Admin User Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Admin List */}
                <div className="lg:col-span-2 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {admins.map(a => (
                        <tr key={a.id} className="hover:bg-gray-50/50 transition">
                          <td className="py-4 px-4 font-medium text-gray-900">{a.email}</td>
                          <td className="py-4 px-4 text-xs font-bold text-gray-500">{a.role}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${a.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {a.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-4 px-4 flex gap-2">
                            {a.id !== user.id && (
                              <>
                                <button 
                                  onClick={() => handleToggleAdmin(a.id, a.isActive)}
                                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition"
                                >
                                  Toggle
                                </button>
                                <button 
                                  onClick={() => handleDeleteAdmin(a.id)}
                                  className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded transition"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Create Admin Form */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-fit">
                  <h3 className="font-bold text-gray-800 mb-4">Create New Admin</h3>
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" required value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        type="password" required value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-md transition text-sm"
                    >
                      Create Admin
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
