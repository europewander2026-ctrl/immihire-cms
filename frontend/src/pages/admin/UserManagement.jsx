import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const UserManagement = () => {
  return (
    <div className="space-y-8">

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
                        EW
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
