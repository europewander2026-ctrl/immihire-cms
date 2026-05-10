import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { adminApi } from '../../services/adminApi';
import RichTextEditor from '../../components/admin/RichTextEditor';

// Reusable Image Upload Field
const ImageUploadField = ({ label, value, onChange, uploading }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    {value && <img src={value} alt="Preview" className="w-full max-h-32 object-cover rounded-lg mb-2 border" />}
    <div className="flex gap-2">
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="https://... or upload" />
      <label className={`cursor-pointer bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`}></i>
        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const res = await adminApi.uploadImage(file);
            onChange(res.url);
          } catch (err) { alert('Upload failed: ' + err.message); }
        }} />
      </label>
    </div>
  </div>
);

const PagesManager = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
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
        slug: res.data.slug || '',
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlug, setNewSlug] = useState('');

  const handleCreateNew = () => {
    setNewSlug('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (newSlug) {
      const newPage = { slug: newSlug, title: 'New Page', isNew: true };
      setPages(prev => [newPage, ...prev]);
      setSelectedPage(newPage);
      setFormData({
        title: '', slug: newSlug, sections: [], seoTitle: '', seoDescription: '', seoKeywords: '', googleSchema: '{}'
      });
      setMessage('');
      setIsModalOpen(false);
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

      const payload = {
        id: selectedPage.id,
        type: 'page',
        slug: formData.slug || selectedPage.slug,
        title: formData.title,
        hero_image_url: formData.sections.find(s => s.type === 'hero')?.image || '',
        content: {
          sections: formData.sections,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          seoKeywords: formData.seoKeywords,
          googleSchema: parsedSchema
        }
      };

      await adminApi.saveContent(payload, !selectedPage.isNew);

      setMessage('Published Successfully!');
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
        setMessage('SEO generated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to generate SEO', error);
      setMessage('Failed to generate SEO. Please try again.');
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const addSection = (type) => {
    let newSection = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      type,
      heading: '',
      subheading: '',
      content: '',
      image: ''
    };

    // Initialize component-specific default data
    if (type === 'kinetic-accordion') {
      newSection.heading = 'Our Core Values';
      newSection.subheading = 'The principles that drive every decision we make.';
      newSection.content = { panels: [] };
    } else if (type === 'spotlight-cinema') {
      newSection.content = { categories: [] };
    } else if (type === 'eligibility-pulse') {
      newSection.heading = 'What are your odds?';
    } else if (type === 'home-hero') {
      newSection.data = { titlePart1: 'Best Immigration', titleHighlight: 'Services in Dubai', subtitle: 'ImmiHire Immigration and Management Consultants', description: '', bgImage: '' };
    } else if (type === 'home-about') {
      newSection.data = { badgeNumber: '10+', badgeText: 'Years of\nExcellence', tagline: 'Who We Are', titleStandard: 'Bridging Talent to', titleHighlight: 'Global Opportunity', description: '', image: '', features: ['Licensed & Certified Consultants', 'Transparent, Flat-Fee Pricing', 'End-to-End Resettlement Support'], ctaText: 'Read Our Story', ctaLink: '/about' };
    } else if (type === 'countries-bento') {
      newSection.data = { title: 'Our Countries', subtitle: 'Migrate for a better future. Explore your options.', countries: [] };
    } else if (type === 'journey-section') {
      newSection.data = { tagline: 'The Journey', titleStandard: 'How We', titleHighlight: 'Make It Happen', steps: [] };
    } else if (['about-hero', 'core-values', 'immihire-standard', 'services-hero', 'services-grid', 'boarding-pass', 'faq-accordion', 'contact-hero', 'contact-form', 'global-offices', 'blog-hero', 'global-pulse', 'latest-articles', 'newsletter-dispatch'].includes(type)) {
      newSection.data = {};
    }

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
              
              {/* Page Title & Slug */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Slug (URL)</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono" />
                </div>
              </section>

              {/* Section Builder */}
              <section className="space-y-4">
                <div className="flex flex-col gap-3 border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Section Builder</h3>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-20 uppercase">Core:</span>
                    <button type="button" onClick={() => addSection('hero')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-2 py-1 rounded transition-colors"><i className="fa-solid fa-image mr-1"></i> Hero</button>
                    <button type="button" onClick={() => addSection('featureList')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-2 py-1 rounded transition-colors"><i className="fa-solid fa-list mr-1"></i> Features</button>
                    <button type="button" onClick={() => addSection('standard')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-2 py-1 rounded transition-colors"><i className="fa-solid fa-align-left mr-1"></i> Content</button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-20 uppercase">Home:</span>
                    <button type="button" onClick={() => addSection('home-hero')} className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium px-2 py-1 rounded transition-colors"><i className="fa-solid fa-plane mr-1"></i> Home Hero</button>
                    <button type="button" onClick={() => addSection('home-about')} className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium px-2 py-1 rounded transition-colors"><i className="fa-solid fa-users mr-1"></i> Home About</button>
                    <button type="button" onClick={() => addSection('countries-bento')} className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium px-2 py-1 rounded transition-colors"><i className="fa-solid fa-globe mr-1"></i> Countries Bento</button>
                    <button type="button" onClick={() => addSection('journey-section')} className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium px-2 py-1 rounded transition-colors"><i className="fa-solid fa-route mr-1"></i> Journey</button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-20 uppercase">About:</span>
                    <button type="button" onClick={() => addSection('about-hero')} className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium px-2 py-1 rounded transition-colors">About Hero</button>
                    <button type="button" onClick={() => addSection('core-values')} className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium px-2 py-1 rounded transition-colors">Core Values</button>
                    <button type="button" onClick={() => addSection('immihire-standard')} className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium px-2 py-1 rounded transition-colors">ImmiHire Standard</button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-20 uppercase">Services:</span>
                    <button type="button" onClick={() => addSection('services-hero')} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2 py-1 rounded transition-colors">Services Hero</button>
                    <button type="button" onClick={() => addSection('services-grid')} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2 py-1 rounded transition-colors">Services Grid</button>
                    <button type="button" onClick={() => addSection('spotlight-cinema')} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2 py-1 rounded transition-colors">Cinema</button>
                    <button type="button" onClick={() => addSection('boarding-pass')} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2 py-1 rounded transition-colors">Boarding Pass</button>
                    <button type="button" onClick={() => addSection('eligibility-pulse')} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2 py-1 rounded transition-colors">Pulse</button>
                    <button type="button" onClick={() => addSection('faq-accordion')} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2 py-1 rounded transition-colors">FAQ</button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-20 uppercase">Contact:</span>
                    <button type="button" onClick={() => addSection('contact-hero')} className="text-xs bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 font-medium px-2 py-1 rounded transition-colors">Contact Hero</button>
                    <button type="button" onClick={() => addSection('contact-form')} className="text-xs bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 font-medium px-2 py-1 rounded transition-colors">Contact Form</button>
                    <button type="button" onClick={() => addSection('global-offices')} className="text-xs bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 font-medium px-2 py-1 rounded transition-colors">Global Offices</button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-20 uppercase">Insights:</span>
                    <button type="button" onClick={() => addSection('blog-hero')} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded transition-colors">Blog Hero</button>
                    <button type="button" onClick={() => addSection('global-pulse')} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded transition-colors">Pulse Map</button>
                    <button type="button" onClick={() => addSection('latest-articles')} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded transition-colors">Articles</button>
                    <button type="button" onClick={() => addSection('newsletter-dispatch')} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded transition-colors">Newsletter</button>
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
                        {/* Interactive Component Placeholders */}
                        {section.type === 'kinetic-accordion' ? (
                          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
                            <i className="fa-solid fa-bars-staggered text-3xl text-indigo-400 mb-3"></i>
                            <h4 className="font-bold text-indigo-800 mb-1">Kinetic Accordion Component</h4>
                            <p className="text-sm text-indigo-600 mb-4">Renders an interactive expanding panel accordion on the public page.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-indigo-500 mb-1">Heading</label>
                                <input type="text" value={section.heading || ''} onChange={(e) => updateSection(index, 'heading', e.target.value)} className="w-full px-3 py-2 border border-indigo-200 rounded-md text-sm" placeholder="e.g. Our Core Values" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-indigo-500 mb-1">Subtitle</label>
                                <input type="text" value={section.subheading || ''} onChange={(e) => updateSection(index, 'subheading', e.target.value)} className="w-full px-3 py-2 border border-indigo-200 rounded-md text-sm" placeholder="Optional subtitle" />
                              </div>
                            </div>
                            <p className="text-xs text-indigo-400 mt-3">Uses default panels. Custom panels can be configured via JSON.</p>
                          </div>
                        ) : section.type === 'spotlight-cinema' ? (
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                            <i className="fa-solid fa-film text-3xl text-purple-400 mb-3"></i>
                            <h4 className="font-bold text-purple-800 mb-1">Spotlight Cinema Component</h4>
                            <p className="text-sm text-purple-600">Full-screen interactive service category selector with cinematic background transitions.</p>
                            <p className="text-xs text-purple-400 mt-3">Uses default categories. Custom categories can be configured via JSON.</p>
                          </div>
                        ) : section.type === 'eligibility-pulse' ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                            <i className="fa-solid fa-gauge-high text-3xl text-emerald-400 mb-3"></i>
                            <h4 className="font-bold text-emerald-800 mb-1">Eligibility Pulse Calculator</h4>
                            <p className="text-sm text-emerald-600">Interactive gauge calculator with experience slider and education selector.</p>
                            <p className="text-xs text-emerald-400 mt-3">Self-contained component — no configuration needed.</p>
                          </div>
                        ) : section.type === 'home-hero' ? (
                          <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2"><i className="fa-solid fa-plane text-2xl text-sky-400"></i><h4 className="font-bold text-sky-800">Homepage Hero Widget</h4></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className="block text-xs font-medium text-sky-600 mb-1">Title Part 1</label><input type="text" value={section.data?.titlePart1 || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), titlePart1: e.target.value})} className="w-full px-3 py-2 border border-sky-200 rounded-md text-sm" /></div>
                              <div><label className="block text-xs font-medium text-sky-600 mb-1">Title Highlight</label><input type="text" value={section.data?.titleHighlight || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), titleHighlight: e.target.value})} className="w-full px-3 py-2 border border-sky-200 rounded-md text-sm" /></div>
                            </div>
                            <div><label className="block text-xs font-medium text-sky-600 mb-1">Subtitle</label><input type="text" value={section.data?.subtitle || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), subtitle: e.target.value})} className="w-full px-3 py-2 border border-sky-200 rounded-md text-sm" /></div>
                            <div><label className="block text-xs font-medium text-sky-600 mb-1">Description</label><textarea value={section.data?.description || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), description: e.target.value})} rows="2" className="w-full px-3 py-2 border border-sky-200 rounded-md text-sm" /></div>
                            <ImageUploadField label="Background Image" value={section.data?.bgImage || ''} onChange={(url) => updateSection(index, 'data', {...(section.data||{}), bgImage: url})} uploading={uploadingImage} />
                          </div>
                        ) : section.type === 'home-about' ? (
                          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2"><i className="fa-solid fa-users text-2xl text-teal-400"></i><h4 className="font-bold text-teal-800">About Section</h4></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div><label className="block text-xs font-medium text-teal-600 mb-1">Badge Number</label><input type="text" value={section.data?.badgeNumber || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), badgeNumber: e.target.value})} className="w-full px-3 py-2 border border-teal-200 rounded-md text-sm" /></div>
                              <div><label className="block text-xs font-medium text-teal-600 mb-1">Badge Text</label><input type="text" value={section.data?.badgeText || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), badgeText: e.target.value})} className="w-full px-3 py-2 border border-teal-200 rounded-md text-sm" /></div>
                              <div><label className="block text-xs font-medium text-teal-600 mb-1">Tagline</label><input type="text" value={section.data?.tagline || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), tagline: e.target.value})} className="w-full px-3 py-2 border border-teal-200 rounded-md text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className="block text-xs font-medium text-teal-600 mb-1">Title Standard</label><input type="text" value={section.data?.titleStandard || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), titleStandard: e.target.value})} className="w-full px-3 py-2 border border-teal-200 rounded-md text-sm" /></div>
                              <div><label className="block text-xs font-medium text-teal-600 mb-1">Title Highlight</label><input type="text" value={section.data?.titleHighlight || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), titleHighlight: e.target.value})} className="w-full px-3 py-2 border border-teal-200 rounded-md text-sm" /></div>
                            </div>
                            <div><label className="block text-xs font-medium text-teal-600 mb-1">Description</label><textarea value={section.data?.description || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), description: e.target.value})} rows="3" className="w-full px-3 py-2 border border-teal-200 rounded-md text-sm" /></div>
                            <ImageUploadField label="About Image" value={section.data?.image || ''} onChange={(url) => updateSection(index, 'data', {...(section.data||{}), image: url})} uploading={uploadingImage} />
                            <div><label className="block text-xs font-medium text-teal-600 mb-1">Features (one per line)</label><textarea value={(section.data?.features || []).join('\n')} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), features: e.target.value.split('\n').filter(Boolean)})} rows="3" className="w-full px-3 py-2 border border-teal-200 rounded-md text-sm" placeholder="Licensed & Certified\nTransparent Pricing" /></div>
                          </div>
                        ) : section.type === 'countries-bento' ? (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2"><i className="fa-solid fa-globe text-2xl text-amber-500"></i><h4 className="font-bold text-amber-800">Countries Bento Grid</h4></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className="block text-xs font-medium text-amber-600 mb-1">Section Title</label><input type="text" value={section.data?.title || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), title: e.target.value})} className="w-full px-3 py-2 border border-amber-200 rounded-md text-sm" /></div>
                              <div><label className="block text-xs font-medium text-amber-600 mb-1">Subtitle</label><input type="text" value={section.data?.subtitle || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), subtitle: e.target.value})} className="w-full px-3 py-2 border border-amber-200 rounded-md text-sm" /></div>
                            </div>
                            <div className="mt-6">
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-amber-700">Countries List</label>
                                <button type="button" onClick={() => {
                                  const list = section.data?.countries || [];
                                  updateSection(index, 'data', {...(section.data||{}), countries: [...list, { name: 'New Country', image: '' }]});
                                }} className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-2 py-1 rounded">
                                  <i className="fa-solid fa-plus mr-1"></i> Add Country
                                </button>
                              </div>
                              <div className="space-y-3">
                                {(!section.data?.countries || section.data.countries.length === 0) && (
                                  <div className="text-xs text-amber-500 italic p-3 border border-amber-200 border-dashed rounded text-center">No countries added. Will use default placeholders.</div>
                                )}
                                {(section.data?.countries || []).map((country, cIdx) => (
                                  <div key={cIdx} className="p-3 border border-amber-200 bg-white rounded-lg relative group">
                                    <button type="button" onClick={() => {
                                      const list = [...section.data.countries];
                                      list.splice(cIdx, 1);
                                      updateSection(index, 'data', {...section.data, countries: list});
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-times"></i></button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Country Name</label>
                                        <input type="text" value={country.name || ''} onChange={(e) => {
                                          const list = [...section.data.countries];
                                          list[cIdx] = { ...list[cIdx], name: e.target.value };
                                          updateSection(index, 'data', {...section.data, countries: list});
                                        }} className="w-full px-3 py-2 border border-gray-200 rounded text-sm" />
                                      </div>
                                      <ImageUploadField label="Flag/Background Image" value={country.image || ''} onChange={(url) => {
                                          const list = [...section.data.countries];
                                          list[cIdx] = { ...list[cIdx], image: url };
                                          updateSection(index, 'data', {...section.data, countries: list});
                                      }} uploading={uploadingImage} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : section.type === 'journey-section' ? (
                          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2"><i className="fa-solid fa-route text-2xl text-violet-400"></i><h4 className="font-bold text-violet-800">Journey Section</h4></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div><label className="block text-xs font-medium text-violet-600 mb-1">Tagline</label><input type="text" value={section.data?.tagline || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), tagline: e.target.value})} className="w-full px-3 py-2 border border-violet-200 rounded-md text-sm" /></div>
                              <div><label className="block text-xs font-medium text-violet-600 mb-1">Title Standard</label><input type="text" value={section.data?.titleStandard || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), titleStandard: e.target.value})} className="w-full px-3 py-2 border border-violet-200 rounded-md text-sm" /></div>
                              <div><label className="block text-xs font-medium text-violet-600 mb-1">Title Highlight</label><input type="text" value={section.data?.titleHighlight || ''} onChange={(e) => updateSection(index, 'data', {...(section.data||{}), titleHighlight: e.target.value})} className="w-full px-3 py-2 border border-violet-200 rounded-md text-sm" /></div>
                            </div>
                            <div className="mt-6">
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-violet-700">Journey Steps</label>
                                <button type="button" onClick={() => {
                                  const list = section.data?.steps || [];
                                  updateSection(index, 'data', {...(section.data||{}), steps: [...list, { step: '01', title: 'New Step', description: '' }]});
                                }} className="text-xs bg-violet-100 hover:bg-violet-200 text-violet-800 font-medium px-2 py-1 rounded">
                                  <i className="fa-solid fa-plus mr-1"></i> Add Step
                                </button>
                              </div>
                              <div className="space-y-3">
                                {(!section.data?.steps || section.data.steps.length === 0) && (
                                  <div className="text-xs text-violet-500 italic p-3 border border-violet-200 border-dashed rounded text-center">No steps added. Will use default placeholders.</div>
                                )}
                                {(section.data?.steps || []).map((stepObj, sIdx) => (
                                  <div key={sIdx} className="p-3 border border-violet-200 bg-white rounded-lg relative group">
                                    <button type="button" onClick={() => {
                                      const list = [...section.data.steps];
                                      list.splice(sIdx, 1);
                                      updateSection(index, 'data', {...section.data, steps: list});
                                    }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-times"></i></button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <div className="md:col-span-1">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Step Number</label>
                                        <input type="text" value={stepObj.step || ''} onChange={(e) => {
                                          const list = [...section.data.steps];
                                          list[sIdx] = { ...list[sIdx], step: e.target.value };
                                          updateSection(index, 'data', {...section.data, steps: list});
                                        }} className="w-full px-3 py-2 border border-gray-200 rounded text-sm" placeholder="e.g. 01" />
                                      </div>
                                      <div className="md:col-span-3">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                        <input type="text" value={stepObj.title || ''} onChange={(e) => {
                                          const list = [...section.data.steps];
                                          list[sIdx] = { ...list[sIdx], title: e.target.value };
                                          updateSection(index, 'data', {...section.data, steps: list});
                                        }} className="w-full px-3 py-2 border border-gray-200 rounded text-sm" placeholder="e.g. Initial Assessment" />
                                      </div>
                                      <div className="md:col-span-4">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                        <textarea value={stepObj.description || ''} onChange={(e) => {
                                          const list = [...section.data.steps];
                                          list[sIdx] = { ...list[sIdx], description: e.target.value };
                                          updateSection(index, 'data', {...section.data, steps: list});
                                        }} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded text-sm" placeholder="Step description..." />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Default editor for standard section types */
                          <>
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
                              <ImageUploadField label="Image" value={section.image || ''} onChange={(url) => updateSection(index, 'image', url)} uploading={uploadingImage} />
                            )}
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                              <RichTextEditor value={section.content || ''} onChange={(val) => updateSection(index, 'content', val)} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SEO Metadata */}
              <section className="space-y-4 pt-4">
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

      {/* Create New Page Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Page</h3>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g., about, services"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  autoFocus
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This will be the URL path (e.g., /about).</p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PagesManager;
