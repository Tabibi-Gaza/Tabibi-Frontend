import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, BarChart3, LogOut, Lock } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const FacilitySidebar = ({ type, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setToken } = useContext(AppContext);

  const dashboardPath = type === 'pharmacy' ? '/pharmacy-dashboard' : type === 'lab' ? '/lab-dashboard' : '/medical-center-dashboard';

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken('');
    navigate('/login');
    if (onClose) onClose();
  };

  const soonLabel = t('facilityNav.soon');
  const itemIcons = [<Package size={20} strokeWidth={1.75} />, <ClipboardList size={20} strokeWidth={1.75} />, <BarChart3 size={20} strokeWidth={1.75} />];
  const soonItems = [1, 2, 3].map((i) => ({
    name: t(`facilityNav.items.${type}.i${i}`),
    icon: itemIcons[i - 1],
  }));

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`
          fixed top-16 right-0 z-48
          w-72 h-[calc(100vh-64px)] bg-[#e2f4f7] dark:bg-gray-800 border-l border-slate-200 dark:border-gray-700
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLink
            to={dashboardPath}
            onClick={onClose}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-r-[3px] border-teal-600 dark:border-teal-400'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <LayoutDashboard size={20} strokeWidth={1.75} />
            <span className="leading-none">{t('facilityNav.dashboard')}</span>
          </NavLink>

          <div className="my-3 mx-4 border-t border-slate-200 dark:border-gray-700" />

          <p className="px-4 pt-1 pb-1 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
            {t('facilityNav.management')}
          </p>
          <div className="space-y-1">
            {soonItems.map((item, index) => (
              <button
                key={index}
                disabled
                title={soonLabel}
                className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[15px] font-bold text-slate-400 dark:text-gray-500 cursor-not-allowed opacity-70"
              >
                {item.icon}
                <span className="leading-none flex-1 text-right">{item.name}</span>
                <Lock size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 pb-4">
          <div className="mx-1 mb-2 border-t border-slate-200 dark:border-gray-700" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[15px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={20} strokeWidth={1.75} />
            <span className="font-medium">{t('facilityNav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default FacilitySidebar;
