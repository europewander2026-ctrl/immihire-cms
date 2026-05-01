import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    contactAddress: '',
    contactEmail: '',
    contactPhone: '',
    copyrightText: '',
    headerNav: '[]',
    footerNav: '[]'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/settings/global');
        if (res.data) {
          setSettings({
            siteName: res.data.siteName || '',
            contactAddress: res.data.contactAddress || '',
            contactEmail: res.data.contactEmail || '',
            contactPhone: res.data.contactPhone || '',
            copyrightText: res.data.copyrightText || '',
            headerNav: typeof res.data.headerNav === 'string' ? res.data.headerNav : JSON.stringify(res.data.headerNav, null, 2),
            footerNav: typeof res.data.footerNav === 'string' ? res.data.footerNav : JSON.stringify(res.data.footerNav, null, 2)
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      // Parse JSON before sending
      let headerNavParsed = [];
      let footerNavParsed = [];
      try {
        headerNavParsed = JSON.parse(settings.headerNav || '[]');
        footerNavParsed = JSON.parse(settings.footerNav || '[]');
      } catch (e) {
        throw new Error('Invalid JSON format in navigation settings.');
      }

      await api.put('/api/settings/global', {
        ...settings,
        headerNav: headerNavParsed,
        footerNav: footerNavParsed
      });
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Branding section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">Site Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-400 mb-2"></i>
                <span className="text-sm text-gray-500">Click to upload image</span>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-400 mb-2"></i>
                <span className="text-sm text-gray-500">Click to upload icon</span>
                <input type="file" className="hidden" accept="image/x-icon,image/png,image/svg+xml" />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address</label>
                <input type="text" name="contactAddress" value={settings.contactAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Navigation & Legal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">Navigation & Legal</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Header Navigation (JSON Array)</label>
                <textarea name="headerNav" rows="4" value={settings.headerNav} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-blue-500 focus:border-blue-500" placeholder='[{"label": "Home", "url": "/"}]'></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Navigation (JSON Array)</label>
                <textarea name="footerNav" rows="4" value={settings.footerNav} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:ring-blue-500 focus:border-blue-500" placeholder='[{"label": "Privacy Policy", "url": "/privacy"}]'></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                <input type="text" name="copyrightText" value={settings.copyrightText} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md text-sm font-medium ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
              <i className="fa-solid fa-save"></i> {saving ? 'Saving...' : 'Save Global Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteSettings;
