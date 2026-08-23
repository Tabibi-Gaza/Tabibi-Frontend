import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_frontend/assets';
import { FiX, FiMenu } from 'react-icons/fi';
import { FiBell } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import { Calendar, Wallet, MessageSquare, Info, CheckCheck, ChevronLeft } from 'lucide-react';

const FILES_URL = import.meta.env.VITE_Files_URL || '';

const getDoctorImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.includes(FILES_URL)) return image;
  return `${FILES_URL}/${image}`;
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'الآن';
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  if (diffHr < 24) return `منذ ${diffHr} ساعة`;
  if (diffDay < 7) return `منذ ${diffDay} يوم`;
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
};

const getNotificationConfig = (type) => {
  const lowerType = String(type || '').toLowerCase();
  if (lowerType.includes('appointment') || lowerType.includes('موعد')) {
    return { icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
  }
  if (lowerType.includes('payment') || lowerType.includes('financial') || lowerType.includes('مدفوع')) {
    return { icon: Wallet, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
  }
  if (lowerType.includes('chat') || lowerType.includes('رسال')) {
    return { icon: MessageSquare, bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' };
  }
  return { icon: Info, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' };
};

const DoctorNavbar = ({ onMenuToggle, isMenuOpen }) => {
  const navigate = useNavigate();

  const { doctorData } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isSecretary = user?.roles?.includes('Secretary');

  const { secretaryDoctorInfo } = useContext(AppContext);
  const doctorName = isSecretary ? (secretaryDoctorInfo?.doctorName || user?.fullName || 'الطبيب') : '';

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axiosInstance.get('/notifications/unread-count');
      if (data.succeeded) {
        setUnreadCount(data.data || 0);
      }
    } catch (err) {

    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const { data } = await axiosInstance.get('/notifications', { params: { Count: 5 } });
      if (data.succeeded) {
        setRecentNotifications(data.data || []);
      }
    } catch (err) {

    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put('/notifications/read-all');
      setRecentNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {

    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchRecentNotifications();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDropdown) {
      fetchRecentNotifications();
    }
  }, [showDropdown]);

  const handleGoToNotificationsPage = () => {
    setShowDropdown(false);
    navigate("/doctor/notifications");
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    if (isSecretary) {
      toast.error(`${doctorName} لم يمنحك صلاحية الاطلاع على الملف الشخصي`);
      return;
    }
    navigate("/doctor/profile");
  };

  return (
    <div
      className="h-16 md:h-21.5 bg-white border-b border-[#C3C6D6] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-45 w-full"
      dir="rtl"
    >
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden transition-colors"
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
          onClick={() => navigate("/doctor/dashboard")}
        />
        <span className="bg-[#e2f4f7] text-[#138C9F] text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-[#138C9F]/20 whitespace-nowrap">
          {isSecretary ? 'بوابة السكرتير' : 'بوابة الطبيب'}
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative cursor-pointer transition-all hover:text-[#138C9F] p-1 rounded-full hover:bg-gray-50"
          >
            <div className="w-[30px] h-[30px] flex items-center justify-center text-amber-500 relative">
              <FiBell className="h-5 md:h-6 w-5 md:w-6 text-gray-600 hover:text-[#138C9F] transition-colors cursor-pointer" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-pulse"
                  style={{ direction: "ltr" }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </div>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 bg-black/20 z-40 md:hidden"
                onClick={() => setShowDropdown(false)}
              />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[360px] bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 text-right overflow-hidden md:absolute md:top-12 md:left-0 md:translate-x-0 md:translate-y-0 md:w-[360px]">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h3
                    onClick={handleGoToNotificationsPage}
                    className="text-sm font-black text-[#0B1C30] cursor-pointer hover:text-[#138C9F]"
                  >
                    الإشعارات {unreadCount > 0 && <span className="text-[#138C9F]">({unreadCount})</span>}
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                        className="text-[11px] font-bold text-[#138C9F] hover:bg-[#e2f4f7] px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <CheckCheck size={13} />
                        تحديد الكل
                      </button>
                    )}
                    <button
                      onClick={() => setShowDropdown(false)}
                      className="text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                {recentNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiBell className="w-5 h-5 text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">لا توجد إشعارات</p>
                  </div>
                ) : (() => {
                  const groups = {};
                  recentNotifications.forEach(n => {
                    const key = n.type;
                    if (!groups[key]) {
                      groups[key] = { type: n.type, title: n.title, message: n.message, count: 1, isRead: n.isRead, latestDate: n.createdAt, latestId: n.id };
                    } else {
                      groups[key].count++;
                      if (!n.isRead) groups[key].isRead = false;
                    }
                  });
                  const groupedArr = Object.values(groups).sort((a, b) => a.isRead ? 1 : b.isRead ? -1 : 0);
                  return groupedArr.slice(0, 5).map((group) => {
                    const config = getNotificationConfig(group.type);
                    const Icon = config.icon;
                    return (
                      <div
                        key={group.type}
                        onClick={handleGoToNotificationsPage}
                        className={`p-3.5 hover:bg-slate-50/70 cursor-pointer block border-b border-gray-50 last:border-0 transition-all ${
                          !group.isRead ? 'bg-blue-50/30' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                            <Icon size={16} className={config.text} strokeWidth={2} />
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {!group.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                              <p className="text-[13px] font-bold text-gray-800 leading-relaxed truncate">
                                {group.title}
                                {group.count > 1 && (
                                  <span className="text-[10px] font-bold text-[#138C9F] bg-[#e2f4f7] px-1.5 py-0.5 rounded-full mr-1.5">
                                    {group.count}
                                  </span>
                                )}
                              </p>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{group.message}</p>
                            <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                              {getRelativeTime(group.latestDate)}
                            </span>
                          </div>
                          {/* Arrow */}
                          <ChevronLeft size={16} className="text-gray-300 mt-1 shrink-0" />
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Footer */}
                {recentNotifications.length > 0 && (
                  <div
                    onClick={handleGoToNotificationsPage}
                    className="p-3 text-center border-t border-gray-100 cursor-pointer hover:bg-slate-50 transition-all"
                  >
                    <span className="text-xs font-bold text-[#138C9F] flex items-center justify-center gap-1">
                      عرض الكل
                      <ChevronLeft size={14} />
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer p-1.5 px-2.5 rounded-xl border border-transparent hover:bg-gray-50/60 hover:border-[#138C9F] transition-all duration-300 select-none"
          onClick={handleProfileClick}
        >
          <div
            className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-[#C3C6D6] bg-slate-100 overflow-hidden relative group transition-all duration-300 hover:border-[#138C9F] shadow-sm shrink-0 flex items-center justify-center"
            title="عرض الملف الشخصي"
          >
            {doctorData && getDoctorImageUrl(doctorData.image) ? (
              <img
                loading="lazy"
                decoding="async"
                width="44"
                height="44"
                className="w-full h-full object-cover"
                src={getDoctorImageUrl(doctorData.image)}
                alt="Profile"
              />
            ) : (
              <div className="w-full h-full bg-[#138C9F] text-white flex items-center justify-center font-bold text-sm md:text-base select-none">
                {doctorData ? `${doctorData.firstname.slice(0, 2) || ""}` : "?"}
              </div>
            )}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs md:text-sm font-black text-[#138C9F] whitespace-nowrap">
              {doctorData
                ? `${doctorData.firstname} ${doctorData.lastname}`
                : "عمر حمد"}
            </p>
            <p className="text-[10px] md:text-[11px] font-bold text-slate-500">
              {doctorData.email ? doctorData.email : "doctor@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorNavbar;
