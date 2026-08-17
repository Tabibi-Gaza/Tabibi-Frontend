import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AdminNotifications = () => {
    const navigate = useNavigate();
    const { groupedNotifications, deleteNotification } = useContext(AppContext);

    const handleNotificationClick = (notif) => {
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const handleDelete = async (e, notifId) => {
        e.stopPropagation();
        await deleteNotification(notifId);
        toast.success('تم حذف الإشعار');
    };

    return (
        <main className="w-full min-h-screen bg-[#ecf8fa] p-4 md:p-10 font-['Cairo']" dir="rtl">
            <div className="max-w-4xl mx-auto">

                <div className="flex justify-start mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-bold text-sm border border-[#C3C6D6] bg-white px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-all duration-150">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        <span>العودة</span>
                    </button>
                </div>

                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col items-center justify-center text-center gap-3 mb-8">
                    <div className="p-4 bg-[#E5EEFF] rounded-full border border-blue-100 shadow-xs text-[#138C9F]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#0B1C30]">مركز الإشعارات والتنبيهات</h1>
                    <p className="text-sm text-[#526069]">تابع أحدث الأنشطة، عمليات الحجز، والتحديثات الواردة للنظام.</p>
                </div>

                <div className="flex flex-col gap-4">
                    {groupedNotifications && groupedNotifications.length > 0 ? (
                        groupedNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`bg-white border rounded-xl p-5 shadow-xs transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#C3C6D6] hover:border-[#138C9F]/50 ${notif.link ? 'cursor-pointer hover:shadow-md' : ''}`}
                            >
                                <div className="flex-1 text-right">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-bold text-[#0B1C30]">
                                            {notif.title || "إشعار نظام"}
                                        </h3>
                                        {notif.count > 1 && (
                                            <span className="text-xs font-black bg-[#138C9F] text-white px-2.5 py-0.5 rounded-full">
                                                {notif.count}
                                            </span>
                                        )}
                                        {!notif.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-blue-600 block shrink-0 animate-pulse"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{notif.message}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 justify-end sm:justify-start min-w-[90px]">
                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{notif.time || notif.createdAt}</span>
                                    {notif.link && (
                                        <span className="text-[10px] text-[#138C9F] font-bold bg-[#138C9F]/10 px-2 py-0.5 rounded-full">عرض</span>
                                    )}
                                    <button
                                        onClick={(e) => handleDelete(e, notif.id)}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                        title="حذف الإشعار"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-[#C3C6D6] rounded-xl p-10 text-center text-gray-400 font-medium">
                            لا توجد إشعارات حالياً.
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
};

export default AdminNotifications;
