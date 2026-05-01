import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import defaultLogo from '../../assets/images/immihire-logo.webp';

const AdminDashboard = () => {
  const location = useLocation();

  const handleLogout = async () => {
    // In a real app, you might ping an /api/logout endpoint first to clear HTTP-only cookies
    // For now, we clear any potential JS cookies and force a hard redirect
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/immihire-cms/immi-admin/login';
  };

  // Helper to determine the current page title based on the route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Consultations';
      case '/pages':
        return 'Pages Manager';
      case '/settings':
        return 'Global Settings';
      case '/users':
        return 'User Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-10 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <img src={defaultLogo} alt="ImmiHire Logo" className="h-8 w-auto object-contain mr-2" />
          <span className="font-bold text-gray-900 text-lg tracking-tight">Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="fa-solid fa-comments w-5 text-center"></i>
            Consultations
          </NavLink>
          
          <NavLink 
            to="/pages" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="fa-solid fa-file-lines w-5 text-center"></i>
            Pages
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="fa-solid fa-sliders w-5 text-center"></i>
            Site Settings
          </NavLink>
          
          <NavLink 
            to="/users" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="fa-solid fa-users-gear w-5 text-center"></i>
            User Management
          </NavLink>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Admin User</span>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-inner">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
