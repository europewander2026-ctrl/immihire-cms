import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import RichTextEditor from '../../components/admin/RichTextEditor';

const ServicesManager = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  
  const defaultForm = {
    title: '',
    slug: '',
    shortValidation: '',
    sections: [],
    icon: '',
    isPublished: false,
    customFormConfig: { enabled: false, type: 'basic' },
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  };
  
  const [formData, setFormData] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/services');
      setServices(res.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
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
        await api.put(`/api/services/${formData.slug}`, formData);
      } else {
        await api.post('/api/services', formData);
      }
      fetchServices();
      setCurrentView('list');
      navigate('/services');
    } catch (error) {
      console.error('Failed to save service', error);
      alert('Error saving service');
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/api/services/${slug}`);
        fetchServices();
      } catch (error) {
        console.error('Failed to delete service', error);
        alert('Error deleting service');
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

      const res = await api.post('/api/seo/generate', { content: rawText });
      
      if (res.data) {
        setFormData(prev => ({
          ...prev,
          seoTitle: res.data.seoTitle || prev.seoTitle,
          seoDescription: res.data.seoDescription || prev.seoDescription,
          seoKeywords: res.data.seoKeywords || prev.seoKeywords
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

  const editService = (service) => {
    let parsedSections = [];
    if (service.sections && Array.isArray(service.sections) && service.sections.length > 0) {
      parsedSections = service.sections;
    } else if (service.sections && typeof service.sections === 'string' && service.sections !== '[]') {
      try { parsedSections = JSON.parse(service.sections); } catch(e){}
    } else if (service.content) {
      parsedSections = [{ id: Date.now().toString(), type: 'standard', heading: 'Service Details', content: service.content }];
    }

    let parsedFormConfig = { enabled: false, type: 'basic' };
    if (service.customFormConfig && typeof service.customFormConfig === 'object') {
      parsedFormConfig = service.customFormConfig;
    } else if (typeof service.customFormConfig === 'string' && service.customFormConfig !== 'null') {
      try { parsedFormConfig = JSON.parse(service.customFormConfig); } catch(e){}
    }

    setFormData({
      ...service,
      shortValidation: service.shortValidation || '',
      icon: service.icon || '',
      sections: parsedSections,
      customFormConfig: parsedFormConfig,
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
      seoKeywords: service.seoKeywords || '',
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading services...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Services Manager</h2>
        {currentView === 'list' && (
          <button 
            onClick={createNew}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            <i className="fa-solid fa-plus mr-2"></i> Add New Service
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {service.icon && <i className={`${service.icon} mr-3 text-gray-400 w-5 text-center`}></i>}
                      <span className="font-medium text-gray-900">{service.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {service.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => editService(service)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(service.slug)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No services found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Validation (Summary)</label>
              <textarea 
                value={formData.shortValidation}
                onChange={(e) => setFormData({...formData, shortValidation: e.target.value})}
                rows="2"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border" 
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FontAwesome Icon Class</label>
              <input 
                type="text" 
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                placeholder="e.g. fa-solid fa-passport"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border" 
              />
            </div>
            <div className="flex flex-col justify-center space-y-3 mt-1">
              <div className="flex items-center">
                <input 
                  id="isPublished"
                  type="checkbox" 
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900 font-medium">
                  Publish this Service publicly
                </label>
              </div>
            </div>
          </div>

          {/* Section Builder */}
          <section className="space-y-4 border-t pt-6 border-gray-200">
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

          {/* Custom Form Configuration */}
          <section className="space-y-4 border-t pt-6 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Custom Form Configuration</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
              <div className="flex items-center">
                <input 
                  id="enableForm"
                  type="checkbox" 
                  checked={formData.customFormConfig?.enabled}
                  onChange={(e) => setFormData({
                    ...formData, 
                    customFormConfig: { ...formData.customFormConfig, enabled: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
                <label htmlFor="enableForm" className="ml-2 block text-sm text-gray-900 font-medium">
                  Enable Custom Form on this Service Page
                </label>
              </div>
              
              {formData.customFormConfig?.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Type</label>
                  <select 
                    value={formData.customFormConfig?.type || 'basic'}
                    onChange={(e) => setFormData({
                      ...formData, 
                      customFormConfig: { ...formData.customFormConfig, type: e.target.value }
                    })}
                    className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white"
                  >
                    <option value="basic">Basic Consultation (Name, Email, Message)</option>
                    <option value="detailed">Detailed Questionnaire (Full Application)</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* SEO Metadata */}
          <section className="space-y-4 border-t pt-6 border-gray-200">
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
                <input type="text" name="seoTitle" value={formData.seoTitle} onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keywords (comma separated)</label>
                <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => { setCurrentView('list'); navigate('/services'); }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Save Service
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServicesManager;
