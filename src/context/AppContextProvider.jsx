import React, { useEffect, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets";
// استيراد الـ Context من ملفه المنفصل
import { AppContext } from "./AppContext";

const AppContextProvider = (props) => {
    // الرابط الافتراضي للـ Backend (سيتم قراءته من ملف .env لاحقاً)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    // حالات تسجيل الدخول والتوكن (يمكنك ربطها مع الـ LocalStorage)
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : 'mock_token_for_testing');
    const [userData, setUserData] = useState({ name: "عبد الله محمد", email: "abdullah@example.com" });

    // مصفوفة لتخزين معرفات (IDs) الأطباء المضافين للمفضلة
    const [favorites, setFavorites] = useState(() => {
        const localData = localStorage.getItem('favorites');
        return localData ? JSON.parse(localData) : [];
    });

    // العملة الافتراضية للعيادة
    const currencySymbol = 'شيكل';

    // حفظ المفضلة في التخزين المحلي عند تغييرها
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // دالة إضافة أو حذف طبيب من المفضلة (Toggle)
    const toggleFavorite = (docId) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(docId)) {
                return prevFavorites.filter(id => id !== docId); // حذف إذا كان موجوداً
            } else {
                return [...prevFavorites, docId]; // إضافة إذا لم يكن موجوداً
            }
        });
    };

    // دالة تحديث بيانات الأطباء (تستدعى بعد الحجز لتحديث المواعيد مثلاً)
    const getDoctorsData = async () => {
        try {
            // هنا مستقبلاً ستضع كود axios لجلب البيانات الحية من زميلك مطور الـ Laravel
            // const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            // if (data.success) setDoctors(data.doctors);
        } catch (error) {
            console.error("خطأ في جلب بيانات الأطباء:", error);
        }
    };

    const [notifications, setNotifications] = useState([
        { id: 1, message: "تم تأكيد موعدك بنجاح مع د. أحمد العوضي", time: "منذ 5 دقائق", isRead: false },
        { id: 2, message: "لديك رسالة جديدة من عيادة غزة الطبية", time: "منذ ساعة", isRead: false },
        { id: 3, message: "تذكير: موعدك القادم غداً الساعة 4:00 مساءً", time: "منذ يوم", isRead: true }
    ]);

    // دالة لتحديد كل الإشعارات كمقروءة وإخفاء النقطة الحمراء
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };


    // تجميع كل القيم والدوال لتمريرها عبر الـ Context لكل مكونات المشروع
    const value = {
        doctors,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        favorites,
        toggleFavorite,
        getDoctorsData,
        notifications,
        setNotifications,
        markAllAsRead

    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;