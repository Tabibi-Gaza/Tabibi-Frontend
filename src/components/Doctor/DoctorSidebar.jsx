import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  CreditCard,
  Users,
  MessageSquare,
  Wallet,
  LogOut,
  UserCheck,
  FileText,
} from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const PERMISSION_MANAGE_APPOINTMENTS = 1;
const PERMISSION_MANAGE_PATIENTS = 2;
const PERMISSION_MANAGE_SCHEDULES = 4;
const PERMISSION_MANAGE_PAYMENTS = 8;
const PERMISSION_VIEW_CHATS = 16;
const PERMISSION_START_CONSULTATION = 32;

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

const DoctorSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setToken, hasPermission, secretaryPermissions } = useContext(AppContext);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isSecretary = user?.roles?.includes('Secretary');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('doctorId');
    setToken('');
    navigate('/login');
    if (onClose) onClose();
  };

  const allMenuItems = [
    {
      name: 'لوحة التحكم',
      path: '/doctor-dashboard',
      icon: <LayoutDashboard size={20} strokeWidth={1.75} />,
      permission: null,
    },
    {
      name: 'إدارة المواعيد',
      path: '/doctor/appointments',
      icon: <Calendar size={20} strokeWidth={1.75} />,
      permission: PERMISSION_MANAGE_APPOINTMENTS,
    },
    {
      name: 'إدارة ساعات العمل',
      path: '/doctor/schedule',
      icon: <Clock size={20} strokeWidth={1.75} />,
      permission: PERMISSION_MANAGE_SCHEDULES,
    },
    {
      name: 'إدارة طرق الدفع',
      path: '/doctor/payments',
      icon: <CreditCard size={20} strokeWidth={1.75} />,
      permission: PERMISSION_MANAGE_PAYMENTS,
    },
    {
      name: 'إدارة المرضى',
      path: '/doctor/patients',
      icon: <Users size={20} strokeWidth={1.75} />,
      permission: PERMISSION_MANAGE_PATIENTS,
    },
    {
      name: 'المحادثات',
      path: '/doctor/chats',
      icon: <MessageSquare size={20} strokeWidth={1.75} />,
      permission: PERMISSION_VIEW_CHATS,
    },
    {
      name: 'اشتراكي',
      path: '/doctor/subscription',
      icon: <FileText size={20} strokeWidth={1.75} />,
      permission: null,
    },
  ];

  const mainMenuItems = isSecretary
    ? allMenuItems.filter(item => item.permission === null || hasPermission(item.permission))
    : allMenuItems;

  const financialMenuItems = isSecretary
    ? [{ name: 'السجلات المالية', path: '/doctor/financials', icon: <Wallet size={20} strokeWidth={1.75} />, permission: PERMISSION_MANAGE_PAYMENTS }]
        .filter(item => hasPermission(item.permission))
    : [{ name: 'السجلات المالية', path: '/doctor/financials', icon: <Wallet size={20} strokeWidth={1.75} /> }];

  const doctorOnlyItems = !isSecretary ? [
    { name: 'إدارة السكرتير', path: '/doctor/secretary-management', icon: <UserCheck size={20} strokeWidth={1.75} /> },
  ] : [];

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
          fixed top-[86.26px] right-0 z-48
          w-72 h-[calc(100vh-86.26px)] bg-[#e2f4f7] border-l border-slate-200
          flex flex-col justify-between font-['Tajawal']
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
        dir="rtl"
      >
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarSection>
            {mainMenuItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
                onClick={() => {
                  if (onClose) onClose();
                }}
              />
            ))}
          </SidebarSection>

          {doctorOnlyItems.length > 0 && (
            <>
              <div className="my-3 mx-4 border-t border-slate-200" />
              <SidebarSection title="الإعدادات">
                {doctorOnlyItems.map((item, index) => (
                  <NavItem
                    key={index}
                    item={item}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                  />
                ))}
              </SidebarSection>
            </>
          )}

          <div className="my-3 mx-4 border-t border-slate-200" />

          <SidebarSection title="المالية">
            {financialMenuItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
                onClick={() => {
                  if (onClose) onClose();
                }}
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
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DoctorSidebar;
