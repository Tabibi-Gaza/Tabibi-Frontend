import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';

const DoctorLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const roles = user?.roles || [];
    const isDoctorOrSecretary = roles.includes('Doctor') || roles.includes('Secretary');

    if (!user || !isDoctorOrSecretary) {
        if (roles.includes('Admin')) return <Navigate to="/admin-dashboard" />;
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-[#ecf8fa] flex flex-col" dir="rtl">
            <DoctorNavbar onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

            <div className="flex flex-1 relative">
                <DoctorSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <main className="flex-1 p-4 md:p-8 md:pr-72 min-h-[calc(100vh-86.26px)] text-right transition-all duration-300 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;