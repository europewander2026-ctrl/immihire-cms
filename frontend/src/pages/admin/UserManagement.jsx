import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const UserManagement = () => {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile picture.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* My Profile Section */}
      {profile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">My Profile</h2>
          <div className="flex items-center gap-6">
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
          {message && <div className="mt-4 text-sm font-medium text-green-600">{message}</div>}
        </div>
      )}

      {/* Admin Users Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Admin Users</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <i className="fa-solid fa-user-plus"></i> Add User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-6 font-medium">Email</th>
                  <th className="py-3 px-6 font-medium">Role</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                        {profile?.profileImage ? (
                          <img src={profile.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          'EW'
                        )}
                      </div>
                      europe.wander2026@gmail.com
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      SUPERADMIN
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100 p-1">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
