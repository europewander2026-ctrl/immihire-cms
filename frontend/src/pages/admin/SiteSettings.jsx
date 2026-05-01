import React from 'react';

const SiteSettings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-4">Site Branding</h2>
        
        <form className="space-y-6">
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

          <div className="pt-4 flex justify-end">
            <button type="button" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Save Branding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteSettings;
