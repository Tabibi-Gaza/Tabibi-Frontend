import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Package, ClipboardList, Star, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FacilityDashboard = ({ type }) => {
    const { t } = useTranslation();

    const userStr = localStorage.getItem('user');
    const user = (() => { try { return JSON.parse(userStr); } catch { return null; } })();
    const facilityName = user?.fullName || t(`facilityNav.gate.${type}`);

    const stats = [
        { icon: ClipboardList, label: t('facilityDashboard.stats.orders'), value: 0 },
        { icon: Package, label: t('facilityDashboard.stats.products'), value: 0 },
        { icon: Star, label: t('facilityDashboard.stats.reviews'), value: 0 },
        { icon: Clock, label: t('facilityDashboard.stats.soon'), value: 0 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0B1C30] dark:text-gray-100">
                    {t('facilityDashboard.welcome', { name: facilityName })}
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm font-semibold mt-1">
                    {t(`facilityDashboard.subtitles.${type}`)}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white dark:bg-gray-800 border border-[#cfd9e8] dark:border-gray-700 rounded-2xl p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-3">
                                <span className="w-10 h-10 rounded-xl bg-[#e2f4f7] dark:bg-teal-900/30 flex items-center justify-center">
                                    <Icon size={18} className="text-[#138C9F] dark:text-teal-300" />
                                </span>
                            </div>
                            <p className="text-3xl font-black text-slate-800 dark:text-gray-100">{stat.value}</p>
                            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-gray-800 border border-[#cfd9e8] dark:border-gray-700 rounded-2xl p-8 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#e2f4f7] dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} className="text-[#138C9F] dark:text-teal-300" />
                </div>
                <h2 className="text-lg font-black text-[#0B1C30] dark:text-gray-100 mb-2">
                    {t('facilityDashboard.comingSoonTitle')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold max-w-md mx-auto">
                    {t('facilityDashboard.comingSoonBody')}
                </p>
            </div>
        </div>
    );
};

export default FacilityDashboard;
