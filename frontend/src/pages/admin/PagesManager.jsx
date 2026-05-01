import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const PagesManager = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    focusKeywords: '',
    googleSchema: '{}'
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await api.get('/api/pages');
      setPages(res.data);
      if (res.data.length > 0 && !selectedPage) {
        handleSelectPage(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = async (pageSummary) => {
    try {
      const res = await api.get(`/api/pages/${pageSummary.slug}`);
      setSelectedPage(res.data);
      setFormData({
        title: res.data.title || '',
        content: res.data.content || '',
        seoTitle: res.data.seoTitle || '',
        seoDescription: res.data.seoDescription || '',
        focusKeywords: res.data.focusKeywords || '',
        googleSchema: typeof res.data.googleSchema === 'string' ? res.data.googleSchema : JSON.stringify(res.data.googleSchema || {}, null, 2)
      });
      setMessage('');
    } catch (err) {
      console.error('Failed to load page details:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNew = () => {
    const slug = prompt("Enter new page slug (e.g., 'about', 'services'):");
    if (slug) {
      const newPage = { slug, title: 'New Page', isNew: true };
      setPages(prev => [newPage, ...prev]);
      setSelectedPage(newPage);
      setFormData({
        title: '', content: '', seoTitle: '', seoDescription: '', focusKeywords: '', googleSchema: '{}'
      });
      setMessage('');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      // Validate schema format
      let parsedSchema = {};
      try {
        parsedSchema = JSON.parse(formData.googleSchema || '{}');
      } catch (err) {
        throw new Error('Invalid JSON in Google Schema field.');
      }

      await api.put(`/api/pages/${selectedPage.slug}`, {
        ...formData,
        googleSchema: parsedSchema
      });

      setMessage('Page saved successfully!');
      fetchPages(); // Refresh list to update titles
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Failed to save page.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10">Loading CMS...</div>;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      
      {/* Sidebar List */}
      <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="font-semibold text-gray-800">Pages</h2>
          <button onClick={handleCreateNew} className="text-blue-600 hover:text-blue-700 bg-blue-50 p-1.5 rounded-md transition-colors" title="Create New Page">
            <i className="fa-solid fa-plus w-4 h-4 flex items-center justify-center text-xs"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {pages.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No pages yet.</div>
          ) : (
            pages.map(page => (
              <button
                key={page.slug}
                onClick={() => handleSelectPage(page)}
                className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-50 transition-colors ${selectedPage?.slug === page.slug ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {page.title || page.slug}
                <div className="text-xs font-normal text-gray-400 mt-0.5">/{page.slug}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor Main */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {selectedPage ? (
          <form onSubmit={handleSave} className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Editing: /{selectedPage.slug}</h2>
                {message && <span className={`text-sm ml-4 font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</span>}
              </div>
              <button type="submit" disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Saving...' : 'Save Page'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Content Editor */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Content Editor</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Content (HTML/Text)</label>
                  <textarea name="content" value={formData.content} onChange={handleChange} rows="10" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"></textarea>
                </div>
              </section>

              {/* SEO Metadata */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">SEO Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title Tag</label>
                    <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keywords (comma separated)</label>
                    <input type="text" name="focusKeywords" value={formData.focusKeywords} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                    <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5 transition-colors">
                      <i className="fa-solid fa-wand-magic-sparkles"></i> AI Generate
                    </button>
                  </div>
                  <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>
              </section>

              {/* Advanced GSEO */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Advanced GSEO</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Structured Data (JSON-LD)</label>
                  <p className="text-xs text-gray-500 mb-2">Input valid JSON for schema.org structured data.</p>
                  <textarea name="googleSchema" value={formData.googleSchema} onChange={handleChange} rows="6" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono bg-gray-50" placeholder="{}"></textarea>
                </div>
              </section>

            </div>
          </form>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <i className="fa-regular fa-file-lines text-4xl mb-4"></i>
            <p>Select a page to edit or create a new one.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PagesManager;
