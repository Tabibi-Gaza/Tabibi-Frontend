import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
  Calendar, Wallet, MessageSquare, Info, CheckCheck,
  Trash2, Bell, Clock
} from 'lucide-react';

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
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getNotificationConfig = (type) => {
  const lowerType = String(type || '').toLowerCase();
  if (lowerType.includes('appointment') || lowerType.includes('موعد')) {
    return { icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'مواعيد' };
  }
  if (lowerType.includes('payment') || lowerType.includes('financial') || lowerType.includes('مدفوع')) {
    return { icon: Wallet, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: 'مدفوعات' };
  }
  if (lowerType.includes('chat') || lowerType.includes('رسال')) {
    return { icon: MessageSquare, bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', label: 'محادثات' };
  }
  return { icon: Info, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', label: 'نظام' };
};

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/notifications', { params: { Count: 100 } });
      if (data.succeeded) {
        setNotifications(data.data || []);
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {

    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {

    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {

    }
  };

  const deleteGroup = async (type) => {
    try {
      const groupNotifs = notifications.filter(n => n.type === type);
      for (const n of groupNotifs) {
        await axiosInstance.delete(`/notifications/${n.id}`);
      }
      setNotifications(prev => prev.filter(n => n.type !== type));
    } catch (err) {

    }
  };

  const markGroupAsRead = async (type) => {
    try {
      const groupNotifs = notifications.filter(n => n.type === type && !n.isRead);
      for (const n of groupNotifs) {
        await axiosInstance.put(`/notifications/${n.id}/read`);
      }
      setNotifications(prev =>
        prev.map(n => n.type === type ? { ...n, isRead: true } : n)
      );
    } catch (err) {

    }
  };

  const groupNotifications = (notifs) => {
    const groups = {};
    notifs.forEach(n => {
      const key = n.type;
      if (!groups[key]) {
        groups[key] = {
          type: n.type,
          title: n.title,
          message: n.message,
          latestDate: n.createdAt,
          count: 1,
          isRead: n.isRead,
          ids: [n.id],
          allRead: n.isRead,
        };
      } else {
        groups[key].count++;
        groups[key].ids.push(n.id);
        if (!n.isRead) groups[key].allRead = false;
        if (!groups[key].isRead && !n.isRead) {
          groups[key].message = n.message;
        }
      }
    });
    return Object.values(groups).sort((a, b) => {
      if (a.allRead !== b.allRead) return a.allRead ? 1 : -1;
      return 0;
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const grouped = groupNotifications(notifications);

  return (
    <div className="min-h-screen bg-[#ecf8fa] p-4 md:p-8" dir="rtl">
      <div className="max-w-[900px] mx-auto bg-white border border-[#C3C6D6] rounded-2xl shadow-xs overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-xs relative">
            <Bell size={26} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="text-center sm:text-right flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
              الإشعارات
            </h1>
            <p className="text-sm sm:text-base font-semibold text-[#434654] mt-1">
              إدارة التحديثات الخاصة بمعاملاتك ومواعيدك
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-[#138C9F] hover:bg-[#0f6f7f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCheck size={16} />
              تحديد الكل كمقروء ({unreadCount})
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-6 space-y-3 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold">جاري التحميل...</div>
          ) : grouped.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell size={28} className="text-gray-300" strokeWidth={1.75} />
              </div>
              <p className="text-base font-bold text-gray-400">لا توجد إشعارات</p>
              <p className="text-sm text-gray-300 mt-1">ستظهر الإشعارات الجديدة هنا</p>
            </div>
          ) : (
            grouped.map((group) => {
              const config = getNotificationConfig(group.type);
              const Icon = config.icon;
              return (
                <div
                  key={group.type}
                  className={`p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition-all duration-200 group ${
                    group.allRead
                      ? 'bg-slate-50 border-slate-100'
                      : 'bg-white border-blue-100 shadow-sm'
                  }`}
                >
                  <div className="space-y-1 w-full flex-1">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                        <Icon size={18} className={config.text} strokeWidth={1.75} />
                      </div>
                      {/* Title */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {!group.allRead && (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0" />
                          )}
                          <h3 className="text-base font-bold text-[#0B1C30] group-hover:text-[#138C9F] transition-colors">
                            {group.title}
                          </h3>
                          {group.count > 1 && (
                            <span className="text-[11px] font-bold text-[#138C9F] bg-[#e2f4f7] px-2 py-0.5 rounded-full">
                              {group.count}
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border} border`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#434654]/80 mt-0.5 pr-5">
                          {group.message}
                        </p>
                      </div>
                    </div>
                    {/* Time */}
                    <div className="flex items-center gap-3 pr-[52px]">
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {getRelativeTime(group.latestDate)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pr-[52px] sm:pr-0">
                    {!group.allRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markGroupAsRead(group.type);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 transition-all cursor-pointer"
                        title="تحديد كمقروء"
                      >
                        <CheckCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(group.type);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer"
                      title="حذف المجموعة"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorNotifications;
