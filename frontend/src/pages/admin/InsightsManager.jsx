import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import RichTextEditor from '../../components/admin/RichTextEditor';

const InsightsManager = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  const defaultForm = {
    title: '',
    slug: '',
    excerpt: '',
    sections: [],
    author: '',
    featuredImage: '',
    category: '',
    featured: false,
    isPublished: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    status: 'PUBLISHED'
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("File too large. Max 1MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'insights');

      const uploadRes = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData({ ...formData, featuredImage: uploadRes.data.url });
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Create a payload that ensures sections is passed safely
      const payload = {
        ...formData
      };

      if (isEditing) {
        await api.put(`/api/insights/${formData.slug}`, payload);
      } else {
        await api.post('/api/insights', payload);
      }
      fetchInsights();
      setCurrentView('list');
      navigate('/insights');
    } catch (error) {
      console.error('Failed to save insight', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error || 'Validation error');
      } else {
        alert('Error saving insight');
      }
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

  const handleGenerateSEO = async () => {
    setIsGeneratingSEO(true);
    try {
      const rawText = formData.sections
        .map(sec => {
          let text = '';
          if (sec.heading) text += sec.heading + ' ';
          if (sec.content) text += sec.content.replace(/<[^>]*>?/gm, '') + ' ';
          return text;
        })
        .join(' ');

      if (!rawText.trim()) {
        alert('Please add some content to the sections first before generating SEO.');
        setIsGeneratingSEO(false);
        return;
      }

      const res = await api.post('/api/seo/generate', { 
        title: formData.title, 
        sections: formData.sections 
      });
      
      if (res.data) {
        setFormData(prev => ({
          ...prev,
          seoTitle: res.data.seoTitle || prev.seoTitle,
          seoDescription: res.data.seoDescription || prev.seoDescription,
          seoKeywords: res.data.seoKeywords || prev.seoKeywords,
          googleSchema: typeof res.data.googleSchema === 'object' ? JSON.stringify(res.data.googleSchema, null, 2) : (res.data.googleSchema || prev.googleSchema)
        }));
        alert('SEO generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate SEO', error);
      alert('Failed to generate SEO. Please try again.');
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const editInsight = (insight) => {
    let parsedSections = [];
    if (insight.sections && Array.isArray(insight.sections) && insight.sections.length > 0) {
      parsedSections = insight.sections;
    } else if (insight.sections && typeof insight.sections === 'string' && insight.sections !== '[]') {
      try { parsedSections = JSON.parse(insight.sections); } catch(e){}
    } else if (insight.content) {
      // Legacy content migration
      parsedSections = [{ 
        id: Date.now().toString(), 
        type: 'standard', 
        heading: '', 
        content: insight.content 
      }];
    }

    setFormData({
      ...insight,
      excerpt: insight.excerpt || '',
      author: insight.author || '',
      featuredImage: insight.featuredImage || '',
      category: insight.category || '',
      featured: insight.featured || false,
      sections: parsedSections,
      seoTitle: insight.seoTitle || '',
      seoDescription: insight.seoDescription || '',
      seoKeywords: insight.seoKeywords || '',
      status: insight.status || 'PUBLISHED'
    });
    setIsEditing(true);
    setCurrentView('form');
  };

  const createNew = () => {
    setFormData(defaultForm);
    setIsEditing(false);
    setCurrentView('form');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading insights...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
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
        <form onSubmit={handleSave} className="space-y-8">
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border font-mono" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border font-medium"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                type="text" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g. Policy, Lifestyle, Career Advice"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <label className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden">
                {uploadingImage ? (
                  <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
                ) : formData.featuredImage ? (
                  <img src={formData.featuredImage} alt="Featured" className="h-16 object-contain mb-2" />
                ) : (
                  <i className="fa-solid fa-image text-2xl text-gray-400 mb-2"></i>
                )}
                <span className="text-sm text-gray-500">{uploadingImage ? 'Uploading...' : (formData.featuredImage ? 'Click to change image' : 'Click to upload image')}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center">
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
            <div className="flex items-center">
              <input 
                id="featured"
                type="checkbox" 
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 font-medium">
                Feature Article (Highlight on Homepage)
              </label>
            </div>
          </div>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Blog Sections Builder</h3>
            </div>
            <div className="flex gap-2 flex-wrap mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <button type="button" onClick={() => addSection('standard')} className="text-xs bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"><i className="fa-solid fa-align-left mr-1"></i> Standard Paragraph</button>
              <button type="button" onClick={() => addSection('dropcap')} className="text-xs bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"><i className="fa-solid fa-text-height mr-1"></i> Drop Cap Paragraph</button>
              <button type="button" onClick={() => addSection('heading')} className="text-xs bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"><i className="fa-solid fa-heading mr-1"></i> Heading</button>
              <button type="button" onClick={() => addSection('quote')} className="text-xs bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"><i className="fa-solid fa-quote-right mr-1"></i> Styled Quote</button>
              <button type="button" onClick={() => addSection('verdict')} className="text-xs bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"><i className="fa-solid fa-stamp mr-1"></i> Verdict Stamp</button>
              <button type="button" onClick={() => addSection('counter')} className="text-xs bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"><i className="fa-solid fa-stopwatch mr-1"></i> Live Counter</button>
            </div>

            <div className="space-y-6">
              {formData.sections.length === 0 && (
                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 bg-gray-50/50">
                  <i className="fa-solid fa-puzzle-piece text-3xl mb-3 text-gray-300"></i>
                  <p>No sections added yet. Click a button above to start building.</p>
                </div>
              )}
              {formData.sections.map((section, index) => (
                <div key={section.id} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      <i className={`fa-solid mr-2 text-gray-400 ${
                        section.type === 'standard' ? 'fa-align-left' :
                        section.type === 'dropcap' ? 'fa-text-height' :
                        section.type === 'heading' ? 'fa-heading' :
                        section.type === 'quote' ? 'fa-quote-right' :
                        section.type === 'verdict' ? 'fa-stamp' : 'fa-stopwatch'
                      }`}></i>
                      {section.type} Section
                    </span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => moveSection(index, -1)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><i className="fa-solid fa-arrow-up"></i></button>
                      <button type="button" onClick={() => moveSection(index, 1)} disabled={index === formData.sections.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><i className="fa-solid fa-arrow-down"></i></button>
                      <button type="button" onClick={() => removeSection(index)} className="p-1.5 text-red-400 hover:text-red-600 ml-2"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {['standard', 'dropcap'].includes(section.type) && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                        <RichTextEditor value={section.content || ''} onChange={(val) => updateSection(index, 'content', val)} />
                      </div>
                    )}
                    {section.type === 'heading' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Heading Text</label>
                        <input type="text" value={section.heading || ''} onChange={(e) => updateSection(index, 'heading', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Your heading here" />
                      </div>
                    )}
                    {section.type === 'quote' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Quote Text</label>
                        <textarea rows="3" value={section.content || ''} onChange={(e) => updateSection(index, 'content', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter quote"></textarea>
                      </div>
                    )}
                    {section.type === 'verdict' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Stamp Text</label>
                        <input type="text" value={section.heading || ''} onChange={(e) => updateSection(index, 'heading', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. FEB DEADLINE" />
                      </div>
                    )}
                    {section.type === 'counter' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                          <input type="text" value={section.heading || ''} onChange={(e) => updateSection(index, 'heading', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. Visas Approved" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Target Number</label>
                          <input type="text" value={section.subheading || ''} onChange={(e) => updateSection(index, 'subheading', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. 5000" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Metadata */}
          <section className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">SEO Metadata</h3>
              <button 
                type="button" 
                onClick={handleGenerateSEO} 
                disabled={isGeneratingSEO}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isGeneratingSEO ? <><i className="fa-solid fa-spinner fa-spin"></i> Generating...</> : <>✨ Auto-Generate with AI</>}
              </button>
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => { setCurrentView('list'); navigate('/insights'); }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i> Save Insight
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => handleDelete(formData.slug)}
                className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none flex items-center gap-2"
              >
                <i className="fa-solid fa-trash-can"></i> Delete
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default InsightsManager;
