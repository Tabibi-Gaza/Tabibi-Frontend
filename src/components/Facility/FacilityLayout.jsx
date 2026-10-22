import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import FacilitySidebar from './FacilitySidebar';
import FacilityNavbar from './FacilityNavbar';
import { useTheme } from '../../context/ThemeContext';

const ROLE_BY_TYPE = {
    pharmacy: 'Pharmacy',
    lab: 'Lab',
    medicalCenter: 'MedicalCenter',
};

const DASHBOARD_PATH_BY_TYPE = {
    pharmacy: '/pharmacy-dashboard',
    lab: '/lab-dashboard',
    medicalCenter: '/medical-center-dashboard',
};

const FacilityLayout = ({ type }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { lang } = useTheme();

    const userStr = localStorage.getItem('user');
    const user = (() => { try { return JSON.parse(userStr); } catch { return null; } })();
    const roles = user?.roles || [];
    const requiredRole = ROLE_BY_TYPE[type] || '';

    if (!user || !roles.includes(requiredRole)) {
        if (roles.includes('Admin')) return <Navigate to="/admin-dashboard" />;
        if (roles.includes('Doctor') || roles.includes('Secretary')) return <Navigate to="/doctor-dashboard" />;
        if (roles.includes('Patient')) return <Navigate to="/user-dashboard" />;
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-[#ecf8fa] dark:bg-gray-900 flex flex-col transition-colors" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <FacilityNavbar type={type} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

            <div className="flex flex-1 relative">
                <FacilitySidebar type={type} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <main className="flex-1 p-4 md:p-8 md:pr-72 min-h-[calc(100vh-64px)] text-right transition-all duration-300">
                    <Outlet context={{ type, dashboardPath: DASHBOARD_PATH_BY_TYPE[type] }} />
                </main>
            </div>
        </div>
    );
};

export default FacilityLayout;
