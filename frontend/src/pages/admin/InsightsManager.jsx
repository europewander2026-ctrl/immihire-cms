import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import RichTextEditor from '../../components/admin/RichTextEditor';

const InsightsManager = () => {
  const [insights, setInsights] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [loading, setLoading] = useState(true);
  
  const defaultForm = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    featuredImage: '',
    isPublished: false
  };
  
  const [formData, setFormData] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/insights');
      setInsights(res.data);
    } catch (error) {
      console.error('Failed to fetch insights', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: !isEditing ? generateSlug(title) : formData.slug
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/api/insights/${formData.slug}`, formData);
      } else {
        await api.post('/api/insights', formData);
      }
      fetchInsights();
      setCurrentView('list');
    } catch (error) {
      console.error('Failed to save insight', error);
      alert('Error saving insight');
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this insight?')) {
      try {
        await api.delete(`/api/insights/${slug}`);
        fetchInsights();
      } catch (error) {
        console.error('Failed to delete insight', error);
        alert('Error deleting insight');
      }
    }
  };

  const editInsight = (insight) => {
    setFormData({
      ...insight,
      excerpt: insight.excerpt || '',
      author: insight.author || '',
      featuredImage: insight.featuredImage || ''
    });
    setIsEditing(true);
    setCurrentView('form');
  };

  const createNew = () => {
    setFormData(defaultForm);
    setIsEditing(false);
    setCurrentView('form');
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading insights...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Insights Manager</h2>
        {currentView === 'list' && (
          <button 
            onClick={createNew}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            <i className="fa-solid fa-plus mr-2"></i> Add New Insight
          </button>
        )}
      </div>

      {currentView === 'list' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insights.map((insight) => (
                <tr key={insight.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{insight.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insight.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insight.author || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${insight.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {insight.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => editInsight(insight)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(insight.slug)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {insights.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No insights found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
              <input 
                type="text" 
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                disabled={isEditing}
                className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border disabled:opacity-50" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Summary)</label>
              <textarea 
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows="2"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border" 
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input 
                type="text" 
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="e.g. John Doe"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input 
                type="text" 
                value={formData.featuredImage}
                onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                placeholder="https://..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border" 
              />
            </div>
            <div className="flex items-center mt-6">
              <input 
                id="isPublished"
                type="checkbox" 
                checked={formData.isPublished}
                onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900 font-medium">
                Publish this Insight publicly
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <RichTextEditor 
              value={formData.content} 
              onChange={(val) => setFormData({...formData, content: val})} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => setCurrentView('list')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Save Insight
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default InsightsManager;
