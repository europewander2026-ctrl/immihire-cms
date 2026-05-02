import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import RichTextEditor from '../../components/admin/RichTextEditor';

const PagesManager = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    sections: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
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
      
      let parsedSections = [];
      if (res.data.sections && Array.isArray(res.data.sections) && res.data.sections.length > 0) {
        parsedSections = res.data.sections;
      } else if (res.data.sections && typeof res.data.sections === 'string' && res.data.sections !== '[]') {
        try { parsedSections = JSON.parse(res.data.sections); } catch(e){}
      } else if (res.data.content) {
        // Legacy content migration
        parsedSections = [{ 
          id: Date.now().toString(), 
          type: 'standard', 
          heading: 'Legacy Content', 
          content: res.data.content 
        }];
      }

      setFormData({
        title: res.data.title || '',
        sections: parsedSections,
        seoTitle: res.data.seoTitle || '',
        seoDescription: res.data.seoDescription || '',
        seoKeywords: res.data.seoKeywords || res.data.focusKeywords || '',
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
        title: '', sections: [], seoTitle: '', seoDescription: '', seoKeywords: '', googleSchema: '{}'
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
      setTimeout(() => { 
        setMessage(''); 
        setSelectedPage(null); 
        navigate('/pages'); 
      }, 1500);
    } catch (err) {
      setMessage(err.message || 'Failed to save page.');
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      type,
      heading: '',
      subheading: '',
      content: '',
      image: ''
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const removeSection = (index) => {
    const newSections = [...formData.sections];
    newSections.splice(index, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const moveSection = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === formData.sections.length - 1)) return;
    const newSections = [...formData.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;
    setFormData({ ...formData, sections: newSections });
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
              <div className="flex items-center">
                <button type="button" onClick={() => { setSelectedPage(null); navigate('/pages'); }} className="text-gray-500 hover:text-gray-700 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors mr-3">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                  <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Saving...' : 'Save Page'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Page Title */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </section>

              {/* Section Builder */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Section Builder</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => addSection('hero')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors"><i className="fa-solid fa-image mr-1"></i> Add Hero</button>
                    <button type="button" onClick={() => addSection('featureList')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors"><i className="fa-solid fa-list mr-1"></i> Add Features</button>
                    <button type="button" onClick={() => addSection('standard')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors"><i className="fa-solid fa-align-left mr-1"></i> Add Content</button>
                  </div>
                </div>

                <div className="space-y-6">
                  {formData.sections.length === 0 && (
                    <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                      No sections added yet. Click a button above to start building.
                    </div>
                  )}
                  {formData.sections.map((section, index) => (
                    <div key={section.id} className="border border-gray-200 rounded-xl bg-gray-50/30 shadow-sm overflow-hidden">
                      <div className="bg-gray-100/80 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{section.type} Section</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveSection(index, -1)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><i className="fa-solid fa-arrow-up"></i></button>
                          <button type="button" onClick={() => moveSection(index, 1)} disabled={index === formData.sections.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><i className="fa-solid fa-arrow-down"></i></button>
                          <button type="button" onClick={() => removeSection(index)} className="p-1.5 text-red-400 hover:text-red-600 ml-2"><i className="fa-solid fa-trash"></i></button>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Heading</label>
                            <input type="text" value={section.heading || ''} onChange={(e) => updateSection(index, 'heading', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Section Heading" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Subheading</label>
                            <input type="text" value={section.subheading || ''} onChange={(e) => updateSection(index, 'subheading', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Optional subheading" />
                          </div>
                        </div>
                        {['hero', 'featureList'].includes(section.type) && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                            <input type="text" value={section.image || ''} onChange={(e) => updateSection(index, 'image', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="https://" />
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                          <RichTextEditor value={section.content || ''} onChange={(val) => updateSection(index, 'content', val)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SEO Metadata */}
              <section className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">SEO Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title Tag</label>
                    <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keywords (comma separated)</label>
                    <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
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
