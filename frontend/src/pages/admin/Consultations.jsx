import React from 'react';

const Consultations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Recent Inquiries</h1>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
          <i className="fa-solid fa-download"></i> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <i className="fa-regular fa-folder-open text-3xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No consultations found yet</h3>
        <p className="text-gray-500 text-sm max-w-sm">
          When candidates submit inquiry forms on the public site, they will appear here for your review.
        </p>
      </div>
    </div>
  );
};

export default Consultations;
