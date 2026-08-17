import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const FILES_URL = import.meta.env.VITE_Files_URL || "";

const AR_DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
const AR_MONTHS = {
    "يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "مايو": 5, "يونيو": 6,
    "يوليو": 7, "أغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "نوفمبر": 11, "ديسمبر": 12,
};

const arabicDateToIso = (str = "") => {
    const normalized = String(str).replace(/[٠-٩]/g, (d) => AR_DIGITS[d] || d);
    const match = normalized.match(/(\d+)\s+(\S+)\s+(\d+)/);
    if (!match) return "";
    const day = match[1].padStart(2, "0");
    const month = String(AR_MONTHS[match[2]] || "").padStart(2, "0");
    return month ? `${match[3]}-${month}-${day}` : "";
};

const mapBackendGender = (gender) => {
    if (gender === "أنثى") return "Female";
    if (gender === "ذكر") return "Male";
    return "Male";
};

const mapBackendDoctor = (doc) => ({
    _id: doc.id,
    userId: doc.userId,
    name: doc.fullName,
    image: doc.profileImageUrl ? `${FILES_URL}/${doc.profileImageUrl}` : "",
    speciality: doc.specializationName || "",
    degree: doc.specializationName || "",
    experience: doc.yearsOfExperience ? `${doc.yearsOfExperience} سنوات` : "",
    about: doc.bio || "",
    fees: doc.sessionPrice || 0,
    rating: doc.averageRating || 0,
    reviewsCount: doc.totalReviews || 0,
    address: {
        line1: doc.clinicAddress || "",
        line2: doc.clinicName || "",
    },
    availableToday: doc.availableToday || false,
});

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_API_URL;
    const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
    const [doctors, setDoctors] = useState([]);

    const [userData, setUserData] = useState({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      address: { line1: "" },
      image: null,
    });

    const [doctorData, setDoctorData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        experienceYears: "",
        specialization: "",
        image: ""
    });

    const [dashboardData, setDashboardData] = useState({
        stats: { totalDoctors: 0, totalPatients: 0, todayAppointments: 0, pendingRequests: 0, totalRevenue: 0, revenueGrowth: 0 },
        doctorRequests: [],
        latestAppointments: [],
        appointmentTrend: []
    });

    const loadDashboardData = async () => {
        try {
            const [overviewRes, pendingAppsRes, recentApptsRes] = await Promise.all([
                axiosInstance.get("/admin/dashboard/overview"),
                axiosInstance.get("/admin/doctor-applications/pending", { params: { PageSize: 5 } }),
                axiosInstance.get("/admin/dashboard/appointments/recent", { params: { limit: 5 } })
            ]);

            const overview = overviewRes.data;
            const pendingApps = pendingAppsRes.data;
            const recentAppts = recentApptsRes.data;

            let doctorRequests = [];
            if (pendingApps.succeeded && pendingApps.data?.items) {
                doctorRequests = pendingApps.data.items.map(app => ({
                    id: app.id,
                    name: app.fullName,
                    specialty: app.specialization,
                    img: app.photoPath ? `${FILES_URL}/${app.photoPath}` : null,
                }));
            }

            let latestAppointments = [];
            if (recentAppts.succeeded && recentAppts.data) {
                latestAppointments = recentAppts.data.map(appt => ({
                    id: appt.id,
                    patient: appt.patientName,
                    doctor: appt.doctorName,
                    specialty: appt.specialty,
                    slotDate: appt.startTime?.split('T')[0] || '',
                    slotTime: appt.startTime ? new Date(appt.startTime).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }) : '',
                    amount: appt.amount,
                    isCompleted: appt.status === 'Completed',
                    cancelled: appt.status === 'Cancelled',
                }));
            }

            if (overview.succeeded && overview.data) {
                setDashboardData({
                    stats: {
                        totalDoctors: overview.data.totalDoctors || 0,
                        totalPatients: overview.data.totalPatients || 0,
                        todayAppointments: overview.data.todayAppointments || 0,
                        pendingRequests: overview.data.pendingDoctorApplications || 0,
                        totalRevenue: overview.data.totalRevenue || 0,
                        revenueGrowth: overview.data.revenueGrowth || 0,
                    },
                    doctorRequests,
                    latestAppointments,
                    appointmentTrend: overview.data.appointmentTrend || []
                });
            }
        } catch (error) {
            console.error("خطأ في جلب بيانات لوحة التحكم:", error);
        }
    };

    const changeDoctorStatus = async (doctorId, status) => {
        try {
            const approved = status === "approve" || status === "approved";
            const endpoint = approved
                ? `/admin/doctor-applications/approve`
                : `/admin/doctor-applications/reject`;
            const body = (status === "reject" || status === "rejected")
                ? { Id: doctorId, Reason: "مرفوض من الإدارة" }
                : { Id: doctorId };
            const { data } = await axiosInstance.post(endpoint, body);
            if (data.succeeded) {
                toast.success(data.message || "تم تحديث الحالة بنجاح");
                await loadDashboardData();
                return true;
            } else {
                toast.error(data.errors?.[0]?.message || "حدث خطأ");
                return false;
            }
        } catch (error) {
            console.error("خطأ في تغيير حالة الطبيب:", error);
            toast.error(error.response?.data?.errors?.[0]?.message || error.message);
            return false;
        }
    };

    const loadDoctorProfileData = async () => {
        try {
            const { data } = await axiosInstance.get("/doctor/profile");
            if (data.succeeded && data.data) {
                const d = data.data;
                setDoctorData({
                    firstname: d.fullName?.split(" ")[0] || "",
                    lastname: d.fullName?.split(" ").slice(1).join(" ") || "",
                    email: d.email || "",
                    phone: d.phoneNumber || "",
                    gender: d.gender || "",
                    dob: d.dateOfBirth || "",
                    experienceYears: d.yearsOfExperience || "",
                    specialization: d.specialization || "",
                    image: d.profileImageUrl ? `${FILES_URL}/${d.profileImageUrl}` : "",
                    clinicName: d.clinicName || "",
                    clinicAddress: d.clinicAddress || "",
                    detailedAddress: d.detailedAddress || "",
                    bio: d.bio || "",
                    sessionPrice: d.sessionPrice || 0,
                });
            }
        } catch (error) {
            console.error("خطأ في جلب بيانات الطبيب:", error);
        }
    };

    const updateDoctorProfileData = async (formData, localUpdates) => {
        try {
            if (localUpdates) {
                setDoctorData(prev => ({ ...prev, ...localUpdates }));
            }
            const { data } = await axiosInstance.put("/doctor/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (data.succeeded) {
                toast.success("تم حفظ تعديلات الطبيب بنجاح");
                await loadDoctorProfileData();
            } else {
                toast.error(data.message || "فشل تحديث بيانات الطبيب");
            }
            return true;
        } catch (error) {
            console.error("خطأ في تحديث بيانات الطبيب:", error);
            const msg = error?.response?.data?.message || error?.message || "فشل تحديث بيانات الطبيب";
            toast.error(msg);
            return false;
        }
    };

    const loadUserProfileData = async () => {
        try {
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const roles = user?.roles || [];

            if (roles.includes("Admin")) {
                try {
                    const { data } = await axiosInstance.get("/admin/profile");
                    if (data.succeeded && data.data) {
                        const d = data.data;
                        const nameParts = (d.fullName || "").split(" ");
                        setUserData({
                            firstname: nameParts[0] || "",
                            lastname: nameParts.slice(1).join(" ") || "",
                            email: d.email || "",
                            phone: d.phoneNumber || "",
                            gender: d.gender || "",
                            dob: d.dateOfBirth || "",
                            image: d.profileImageUrl
                                ? `${FILES_URL}/${d.profileImageUrl}`
                                : null,
                        });
                        return;
                    }
                } catch (e) {
                    console.error("خطأ في جلب بيانات المسؤول:", e);
                }
            }

            if (roles.includes("Patient")) {
                try {
                    const { data } = await axiosInstance.get("/patient/profile");
                    if (data.succeeded && data.data) {
                        const d = data.data;
                        const nameParts = (d.fullName || "").split(" ");
                        setUserData({
                            firstname: nameParts[0] || "",
                            lastname: nameParts.slice(1).join(" ") || "",
                            email: d.email || "",
                            phone: d.phoneNumber || "",
                            gender: mapBackendGender(d.gender),
                            dob: arabicDateToIso(d.dateOfBirth),
                            address: d.address ? { line1: d.address } : { line1: "" },
                            image: d.profileImageUrl
                                ? `${FILES_URL}/${d.profileImageUrl}`
                                : null,
                        });
                        return;
                    }
                } catch (e) {
                    console.error("خطأ في جلب بيانات المريض:", e);
                }
            }

            if (userStr) {
                const nameParts = (user.fullName || "").split(" ");
                setUserData({
                    firstname: nameParts[0] || "",
                    lastname: nameParts.slice(1).join(" ") || "",
                    email: user.email || "",
                    phone: "",
                    gender: "",
                    dob: "",
                    image: null,
                });
            }
        } catch (error) {
            console.error("خطأ في جلب بيانات الملف الشخصي:", error);
        }
    };

    const updateAdminProfileData = async (formData, localUpdates) => {
        try {
            if (localUpdates) {
                setUserData(prev => ({ ...prev, ...localUpdates }));
            }
            const { data } = await axiosInstance.put("/admin/profile/update", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (data.succeeded) {
                toast.success("تم حفظ تعديلات المسؤول بنجاح");
                await loadUserProfileData();
            } else {
                toast.error(data.errors?.[0]?.message || data.message || "فشل حفظ التعديلات");
            }
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.errors?.[0]?.message || error.message || "حدث خطأ أثناء الحفظ");
            return true;
        }
    };

    const getDoctorsData = async () => {
        try {
            const { data } = await axiosInstance.get("/Doctors/get-all-doctors", {
                params: { PageSize: 100 },
            });
            if (data.succeeded && data.data) {
                const items = data.data.items || [];
                setDoctors(items.map(mapBackendDoctor));
            }
        } catch (error) {
            console.error("خطأ في جلب بيانات الأطباء:", error);
        }
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (token) {
                const userStr = localStorage.getItem("user");
                const user = userStr ? JSON.parse(userStr) : null;
                const roles = user?.roles || [];

                await loadUserProfileData();

                if (roles.includes("Doctor")) {
                    await loadDoctorProfileData();
                }
                if (roles.includes("Secretary")) {
                    await loadDoctorProfileData();
                }
                if (roles.includes("Admin")) {
                    await loadDashboardData();
                }
            }
        };
        fetchInitialData();
    }, [token]);

    // Secretary permissions
    const [secretaryPermissions, setSecretaryPermissions] = useState(null);
    const [secretaryDoctorInfo, setSecretaryDoctorInfo] = useState(null);
    const [secretaryPermsLoaded, setSecretaryPermsLoaded] = useState(false);

    const loadSecretaryPermissions = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/secretary/permissions");
            if (data.succeeded && data.data) {
                setSecretaryPermissions(data.data.permissionsFlags);
                setSecretaryDoctorInfo({
                    doctorId: data.data.doctorId,
                    doctorName: data.data.doctorName,
                    doctorEmail: data.data.doctorEmail,
                });
            }
        } catch (error) {
            console.error("خطأ في جلب صلاحيات السكرتير:", error);
        } finally {
            setSecretaryPermsLoaded(true);
        }
    }, []);

    const hasPermission = useCallback((flag) => {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const isSecretary = user?.roles?.includes("Secretary");
        if (!isSecretary) return true;
        if (!secretaryPermsLoaded) return false;
        if (secretaryPermissions === null) return false;
        return (secretaryPermissions & flag) === flag;
    }, [secretaryPermissions, secretaryPermsLoaded]);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        if (token && user?.roles?.includes("Secretary")) {
            loadSecretaryPermissions();
        }
    }, [token, loadSecretaryPermissions]);

    const currencySymbol = '₪';
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/notifications/paged", {
                params: { PageNumber: 1, PageSize: 20 }
            });
            if (data.succeeded && data.data?.items) {
                setNotifications(data.data.items);
            }
        } catch (error) {
            console.error("خطأ في جلب الإشعارات:", error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await axiosInstance.put("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("خطأ في تعيين الإشعارات كمقروءة:", error);
        }
    }, []);

    const deleteNotification = useCallback(async (id) => {
        try {
            await axiosInstance.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("خطأ في حذف الإشعار:", error);
        }
    }, []);

    // تجميع الإشعارات المتشابهة (نفس الرسالة) في إشعار واحد مع عداد
    const groupedNotifications = useMemo(() => {
        const groups = new Map();
        for (const n of notifications || []) {
            const key = n.message || "إشعار";
            if (!groups.has(key)) {
                groups.set(key, { ...n, count: 1 });
            } else {
                const g = groups.get(key);
                g.count += 1;
                g.isRead = g.isRead && n.isRead;
            }
        }
        return Array.from(groups.values());
    }, [notifications]);

    useEffect(() => {
        if (token) {
            loadNotifications();
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        doctorData,
        setDoctorData,
        updateDoctorProfileData,
        loadUserProfileData,
        updateAdminProfileData,
        dashboardData,
        setDashboardData,
        loadDashboardData,
        changeDoctorStatus,
        notifications,
        groupedNotifications,
        loadNotifications,
        markAllAsRead,
        deleteNotification,
        secretaryPermissions,
        secretaryDoctorInfo,
        hasPermission,
        loadSecretaryPermissions,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;