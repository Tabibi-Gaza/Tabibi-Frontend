import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';

const DoctorLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#ecf8fa] flex flex-col" dir="rtl">
            {/* تمرير دالة التبديل للنافبار */}
            <DoctorNavbar onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

            <div className="flex flex-1 relative">
                {/* تمرير الحالة ودالة الإغلاق للسايدبار */}
                <DoctorSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                {/* التعديل: إزالة w-full و حصر الـ overflow داخل الـ main نفسه لضمان استقرار العرض الجانبي */}
                <main className="flex-1 p-4 md:p-8 md:pr-72 min-h-[calc(100vh-86.26px)] text-right transition-all duration-300 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;