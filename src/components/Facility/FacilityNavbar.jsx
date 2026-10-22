import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets_frontend/assets';
import { FiX, FiMenu } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const FacilityNavbar = ({ type, onMenuToggle, isMenuOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, lang, toggleTheme, toggleLang } = useTheme();

  const userStr = localStorage.getItem('user');
  const user = (() => { try { return JSON.parse(userStr); } catch { return null; } })();
  const displayName = user?.fullName || user?.email || t('facilityNav.facilityFallback');
  const displayEmail = user?.email || '';

  return (
    <div
      className="h-16 bg-white dark:bg-gray-800 border-b border-[#C3C6D6] dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-45 w-full transition-colors"
    >
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isMenuOpen ? (
            <FiX className="w-6 h-6 text-[#138C9F]" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
        <img
          decoding="async"
          width="40"
          height="40"
          src={assets.logo}
          alt="شعار طبيبي غزة"
          className="h-7 md:h-10 w-auto cursor-pointer object-contain"
          onClick={() => navigate(type === 'pharmacy' ? '/pharmacy-dashboard' : type === 'lab' ? '/lab-dashboard' : '/medical-center-dashboard')}
        />
        <span className="bg-[#e2f4f7] dark:bg-gray-700 text-[#138C9F] dark:text-teal-300 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-[#138C9F]/20 dark:border-teal-400/20 whitespace-nowrap">
          {t(`facilityNav.gate.${type}`)}
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={toggleLang}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 font-bold text-xs cursor-pointer"
          title={t('common.language')}
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 cursor-pointer"
          title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2 md:gap-3 p-1.5 px-2.5 rounded-xl select-none">
          <div
            className="w-9 h-9 rounded-full bg-[#138C9F] text-white flex items-center justify-center font-bold text-sm shrink-0"
            title={t('facilityNav.profileTitle')}
          >
            {displayName.slice(0, 2) || '?'}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs md:text-sm font-black text-[#138C9F] dark:text-teal-300 whitespace-nowrap max-w-[160px] truncate">
              {displayName}
            </p>
            {displayEmail && (
              <p className="text-[10px] font-bold text-slate-500 dark:text-gray-400 max-w-[160px] truncate">
                {displayEmail}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityNavbar;
