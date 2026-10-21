import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  Layers,

  FileText,
  MessageSquare,
  TrendingUp,
  Mail,
  LogOut,
  CreditCard,
} from 'lucide-react';

const NavItem = ({ item, onClick }) => (
  <NavLink
    to={item.path}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
        isActive
          ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-r-[3px] border-teal-600 dark:border-teal-400'
          : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-800 dark:hover:text-white'
      }`
    }
  >
    {item.icon}
    <span className="leading-none">{item.name}</span>
  </NavLink>
);

const SidebarSection = ({ title, children }) => (
  <div className="space-y-1">
    {title && (
      <p className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
        {title}
      </p>
    )}
    {children}
  </div>
);

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setToken } = useContext(AppContext);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken('');
    navigate('/login');
    if (setSidebarOpen) setSidebarOpen(false);
  };

  const mainMenuItems = [
    {
      name: t('adminNav.dashboard'),
      path: '/admin-dashboard',
      icon: <LayoutDashboard size={20} strokeWidth={1.75} />,
    },
  ];

  const managementMenuItems = [
    {
      name: t('adminNav.users'),
      path: '/admin/users-management',
      icon: <Users size={20} strokeWidth={1.75} />,
    },
    {
      name: t('adminNav.departments'),
      path: '/admin/departments-management',
      icon: <Layers size={20} strokeWidth={1.75} />,
    },
    {
      name: t('adminNav.joinRequests'),
      path: '/admin/join-requests',
      icon: <FileText size={20} strokeWidth={1.75} />,
    },
    {
      name: t('adminNav.chats'),
      path: '/admin/chats',
      icon: <MessageSquare size={20} strokeWidth={1.75} />,
    },
  ];

  const financialMenuItems = [
    {
      name: t('adminNav.financialReports'),
      path: '/admin/financial-transactions',
      icon: <TrendingUp size={20} strokeWidth={1.75} />,
    },
    {
      name: t('adminNav.paymentSubs'),
      path: '/admin/payment-methods',
      icon: <CreditCard size={20} strokeWidth={1.75} />,
    },
    {
      name: t('adminNav.contactUs'),
      path: '/admin/contact-us',
      icon: <Mail size={20} strokeWidth={1.75} />,
    },
  ];

  return (
    <aside
      className={`
        fixed top-16 right-0 bottom-0 w-[288px] h-[calc(100vh-64px)] bg-[#e2f4f7] dark:bg-gray-800 border-l border-slate-200 dark:border-gray-700
        flex flex-col justify-between z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
        md:translate-x-0 md:flex md:w-[288px] md:min-h-[calc(100vh-86px)] md:h-auto md:sticky md:top-21.5 md:shadow-none md:z-10
      `}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarSection>
          {mainMenuItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
            />
          ))}
        </SidebarSection>

        <div className="my-3 mx-4 border-t border-slate-200 dark:border-gray-700" />

        <SidebarSection title={t('adminNav.management')}>
          {managementMenuItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
            />
          ))}
        </SidebarSection>

        <div className="my-3 mx-4 border-t border-slate-200 dark:border-gray-700" />

        <SidebarSection title={t('adminNav.financeContact')}>
          {financialMenuItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
            />
          ))}
        </SidebarSection>
      </div>

      <div className="px-3 pb-4">
        <div className="mx-1 mb-2 border-t border-slate-200 dark:border-gray-700" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[15px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={20} strokeWidth={1.75} />
          <span className="font-medium">{t('adminNav.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
