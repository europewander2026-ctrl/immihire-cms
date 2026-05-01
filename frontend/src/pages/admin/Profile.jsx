import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'profiles');

      const uploadRes = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedRes = await api.put('/api/profile', {
        name: profile.name,
        profileImage: uploadRes.data.url
      });

      setProfile(updatedRes.data);
      setMessage('Profile picture updated!');
      window.dispatchEvent(new Event('profileUpdated'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updatedRes = await api.put('/api/profile', {
        name: profile.name,
        profileImage: profile.profileImage
      });
      setProfile(updatedRes.data);
      setMessage('Profile details saved!');
      window.dispatchEvent(new Event('profileUpdated'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save profile details.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="p-10">Loading profile...</div>;

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">My Profile</h2>
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden border-4 border-white shadow-sm">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile.email.substring(0, 2).toUpperCase()
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
              <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-camera'} text-sm`}></i>
              <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{profile.name || 'Admin User'}</h3>
            <p className="text-gray-500">{profile.email}</p>
            <span className="inline-flex mt-2 px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {profile.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveDetails} className="space-y-6 border-t border-gray-100 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input 
              type="text" 
              value={profile.name || ''} 
              onChange={(e) => setProfile({...profile, name: e.target.value})} 
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={profile.email} 
              disabled 
              className="w-full max-w-md px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm" 
            />
          </div>
          
          {message && <div className={`text-sm font-medium ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</div>}
          
          <div className="pt-2">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
              <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
