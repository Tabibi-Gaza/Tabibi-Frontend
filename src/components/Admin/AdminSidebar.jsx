import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
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
          ? 'bg-teal-50 text-teal-700 border-r-[3px] border-teal-600'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
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
      <p className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {title}
      </p>
    )}
    {children}
  </div>
);

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
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
      name: 'لوحة التحكم',
      path: '/admin-dashboard',
      icon: <LayoutDashboard size={20} strokeWidth={1.75} />,
    },
  ];

  const managementMenuItems = [
    {
      name: 'المستخدمين',
      path: '/admin/users-management',
      icon: <Users size={20} strokeWidth={1.75} />,
    },
    {
      name: 'الأقسام',
      path: '/admin/departments-management',
      icon: <Layers size={20} strokeWidth={1.75} />,
    },
    {
      name: 'طلبات الإنضمام',
      path: '/admin/join-requests',
      icon: <FileText size={20} strokeWidth={1.75} />,
    },
    {
      name: 'المحادثات',
      path: '/admin/chats',
      icon: <MessageSquare size={20} strokeWidth={1.75} />,
    },
  ];

  const financialMenuItems = [
    {
      name: 'التقارير المالية',
      path: '/admin/financial-transactions',
      icon: <TrendingUp size={20} strokeWidth={1.75} />,
    },
    {
      name: 'طرق الدفع والاشتراكات',
      path: '/admin/payment-methods',
      icon: <CreditCard size={20} strokeWidth={1.75} />,
    },
    {
      name: 'تواصل معنا',
      path: '/admin/contact-us',
      icon: <Mail size={20} strokeWidth={1.75} />,
    },
  ];

  return (
    <aside
      className={`
        fixed top-16 right-0 bottom-0 w-[288px] h-[calc(100vh-64px)] bg-[#e2f4f7] border-l border-slate-200
        flex flex-col justify-between z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
        md:static md:translate-x-0 md:flex md:w-[288px] md:min-h-[calc(100vh-86px)] md:h-auto md:sticky md:top-21.5 md:shadow-none md:z-10
      `}
      dir="rtl"
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

        <div className="my-3 mx-4 border-t border-slate-200" />

        <SidebarSection title="الإدارة">
          {managementMenuItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
            />
          ))}
        </SidebarSection>

        <div className="my-3 mx-4 border-t border-slate-200" />

        <SidebarSection title="المالية والتواصل">
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
        <div className="mx-1 mb-2 border-t border-slate-200" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-[15px] text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={20} strokeWidth={1.75} />
          <span className="font-medium">تسجيل خروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
