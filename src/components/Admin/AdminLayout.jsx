import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const roles = user?.roles || [];
    const isAdmin = roles.includes('Admin');

    if (!user || !isAdmin) {
        if (roles.includes('Doctor') || roles.includes('Secretary')) return <Navigate to="/doctor-dashboard" />;
        return <Navigate to="/" />;
    }

    return (
      <div
        className="min-h-screen bg-[#ecf8fa] flex flex-col relative"
        dir="rtl"
      >
        <AdminNavbar
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
        />

        <div className="flex flex-1 w-full relative overflow-hidden">
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="flex-1 p-4 md:p-8 overflow-y-auto md:max-h-[calc(100vh-86px)] text-right w-full md:w-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
};

export default AdminLayout;