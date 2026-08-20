import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { AppContext } from "../../context/AppContext";

const FILES_URL = import.meta.env.VITE_Files_URL || "";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { doctorData } = useContext(AppContext);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetailsLoading, setPaymentDetailsLoading] = useState(false);

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [stats, setStats] = useState({ todayCount: 0, pendingCount: 0, completedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [todayRes, pendingsRes, statsRes] = await Promise.all([
        axiosInstance.get("/doctor/appointments/today"),
        axiosInstance.post("/doctor/appointments/get-pendings", {}),
        axiosInstance.get("/doctor/appointments/stats"),
      ]);

      if (todayRes.data.succeeded) {
        setTodayAppointments(todayRes.data.data || []);
      }
      if (pendingsRes.data.succeeded) {
        setPaymentRequests(pendingsRes.data.data || []);
      }
      if (statsRes.data.succeeded) {
        setStats({
          todayCount: statsRes.data.data.todayAppointmentsCount || 0,
          pendingCount: statsRes.data.data.pendingVerificationCount || 0,
          completedCount: statsRes.data.data.completedAppointmentsCount || 0,
        });
      }
    } catch (error) {
      console.error("خطأ في جلب بيانات لوحة التحكم:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleViewAllAppointments = () => navigate("/doctor/appointments");
  const handleViewPatientProfile = (id) => navigate(`/doctor/medical-file/${id}`);
  const handleStartConsultation = (appointmentId, patientId) => navigate(`/doctor/medical-examination/${patientId}`);

  const handleReviewPayment = async (appointmentId) => {
    setPaymentDetailsLoading(true);
    setIsPaymentModalOpen(true);
    setSelectedPayment(null);
    try {
      const { data } = await axiosInstance.post("/doctor/appointments/get-pending-details", { Id: appointmentId });
      if (data.succeeded && data.data) {
        setSelectedPayment(data.data);
      } else {
        toast.error("فشل جلب تفاصيل الدفع");
        setIsPaymentModalOpen(false);
      }
    } catch (error) {
      toast.error("خطأ في جلب التفاصيل");
      setIsPaymentModalOpen(false);
    } finally {
      setPaymentDetailsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      const { data } = await axiosInstance.post("/doctor/appointments/verify-payment", {
        AppointmentId: selectedPayment.appointmentId,
        IsApproved: true,
      });
      if (data.succeeded) {
        toast.success("تم تأكيد الدفع بنجاح!");
        setIsPaymentModalOpen(false);
        setSelectedPayment(null);
        fetchDashboardData();
      } else {
        toast.error(data.errors?.[0]?.message || data.message || "فشل تأكيد الدفع");
      }
    } catch (error) {
      toast.error("خطأ في تأكيد الدفع");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      const { data } = await axiosInstance.post("/doctor/appointments/verify-payment", {
        AppointmentId: selectedPayment.appointmentId,
        IsApproved: false,
        RejectionReason: rejectionReason || "تم رفض الدفع من قبل الطبيب",
      });
      if (data.succeeded) {
        toast.success("تم رفض الدفع");
        setIsPaymentModalOpen(false);
        setSelectedPayment(null);
        setRejectModalOpen(false);
        setRejectionReason("");
        fetchDashboardData();
      } else {
        toast.error(data.errors?.[0]?.message || data.message || "فشل رفض الدفع");
      }
    } catch (error) {
      toast.error("خطأ في رفض الدفع");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="font-['Cairo'] space-y-6 md:space-y-8 w-full pb-8 pr-4 relative" dir="rtl">
      <div className="space-y-1 text-right md:pl-4">
        <h2 className="text-2xl md:text-4xl font-black text-[#0B1C30] tracking-tight">
          {new Date().getHours() < 12 ? 'صباح الخير' : 'مساء الخير'} دكتور، {doctorData?.firstname || ''} {doctorData?.lastname || ''}
        </h2>
        <p className="text-sm md:text-base text-[#526069] font-medium">
          لديك {stats.todayCount} مواعيد اليوم. ابدأ يومك بنشاط.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
        <div className="bg-[#138C9F] p-5 md:p-6 rounded-2xl flex flex-col justify-between h-24 md:h-[15vh] text-white relative overflow-hidden shadow-sm">
          <div className="flex justify-between items-start w-full">
            <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <h4 className="text-3xl font-black">{stats.todayCount}</h4>
            <p className="text-xs font-bold text-white/90 mt-0.5">مواعيد اليوم</p>
          </div>
        </div>

        <div className="bg-white border border-[#C3C6D6] p-5 md:p-6 rounded-2xl flex flex-col justify-between h-24 md:h-[15vh] shadow-xs">
          <div className="text-left">
            <svg className="w-6 h-6 text-[#526069]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <h4 className="text-3xl font-black text-[#0B1C30]">{stats.completedCount}</h4>
            <p className="text-xs font-bold text-[#526069] mt-0.5">مواعيد مكتملة</p>
          </div>
        </div>

        <div className="bg-[#FFF0EE] border border-[#FFDAD6] p-5 md:p-6 rounded-2xl flex flex-col justify-between h-24 md:h-[15vh] shadow-xs">
          <div className="text-2xl text-[#BA1A1A] font-light">!</div>
          <div className="text-left">
            <h4 className="text-3xl font-black text-[#BA1A1A]">{paymentRequests.length}</h4>
            <p className="text-xs font-bold text-[#BA1A1A] mt-0.5">طلبات معلقة</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#C3C6D6] rounded-2xl shadow-xs overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[#C3C6D6] flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#138C9F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base md:text-lg font-black text-[#138C9F]">جدول مواعيد اليوم</h3>
          </div>
          <button onClick={handleViewAllAppointments} className="text-xs font-bold text-[#138C9F] hover:underline cursor-pointer flex items-center gap-1">
            عرض الكل <span>◀</span>
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          {todayAppointments.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">لا توجد مواعيد اليوم</p>
          ) : (
            <table className="w-full text-right border-collapse max-w-full">
              <thead>
                <tr className="bg-white border-b border-[#C3C6D6] text-[#526069]">
                  <th className="p-3 md:p-4 text-xs font-bold">المريض</th>
                  <th className="p-3 md:p-4 text-xs font-bold">التوقيت</th>
                  <th className="hidden md:table-cell p-3 md:p-4 text-xs font-bold">الحالة</th>
                  <th className="p-3 md:p-4 text-xs font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C3C6D6]/40">
                {todayAppointments.map((appt) => {
                  const patientName = (appt.patientName || "").replace(/^undefined\s*/i, "").trim() || "مريض";
                  const patientImage = appt.patientImage || appt.patientImageUrl || "";
                  return (
                  <tr key={appt.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-3 md:p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {patientImage && patientImage !== "undefined" ? (
                          <img
                            src={patientImage.startsWith("http") ? patientImage : `${FILES_URL}/${patientImage}`}
                            alt={patientName}
                            className="w-9 h-9 rounded-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                          />
                        ) : null}
                        <div
                          className={`w-9 h-9 rounded-full bg-[#C4D2FF] text-[#0B1C30] flex items-center justify-center font-bold text-xs ${patientImage && patientImage !== "undefined" ? "hidden" : ""}`}
                        >
                          {getInitials(patientName)}
                        </div>
                        <span className="font-bold text-[#0B1C30] text-xs md:text-sm">{patientName}</span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-xs md:text-sm font-bold text-[#0B1C30]">
                      {appt.startTime} - {appt.endTime}
                    </td>
                    <td className="hidden md:table-cell p-3 md:p-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        appt.status === "مؤكد" ? "bg-[#D1F7EC] text-[#00875A]"
                          : appt.status === "قيد الانتظار" ? "bg-[#FFF0EE] text-[#BA1A1A]"
                            : "bg-[#F4F5F7] text-[#526069]"
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleStartConsultation(appt.id, appt.patientId || appt.id)}
                        className="bg-[#138C9F] text-white text-xs font-bold px-4 py-3 rounded-xl min-h-[44px] transition-all cursor-pointer hover:bg-[#0f7282]"
                      >
                        بدء الكشف
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#C3C6D6] rounded-2xl shadow-xs overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[#C3C6D6] flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#138C9F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="text-base md:text-lg font-black text-[#138C9F]">طلبات بانتظار تأكيد الدفع</h3>
          </div>
          <span className="bg-[#FFF0EE] text-[#BA1A1A] text-xs font-bold px-3 py-1 rounded-full">
            {paymentRequests.length} مدفوعات بانتظار الدفع
          </span>
        </div>
        <div className="w-full overflow-x-auto">
          {paymentRequests.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">لا توجد مدفوعات بانتظار التأكيد</p>
          ) : (
            <table className="w-full text-right border-collapse max-w-full">
              <thead>
                <tr className="bg-white border-b border-[#C3C6D6] text-[#526069]">
                  <th className="p-3 md:p-4 text-xs font-bold">Patient</th>
                  <th className="p-3 md:p-4 text-xs font-bold">Time</th>
                  <th className="hidden md:table-cell p-3 md:p-4 text-xs font-bold">Status</th>
                  <th className="p-3 md:p-4 text-xs font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C3C6D6]/40">
                {paymentRequests.map((req) => {
                  const cleanName = (req.patientName || "").replace(/^undefined\s*/i, "").trim() || "Patient";
                  const imgUrl = req.patientImageUrl || "";
                  return (
                  <tr key={req.appointmentId} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-3 md:p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {imgUrl && imgUrl !== "undefined" ? (
                          <img
                            src={imgUrl.startsWith("http") ? imgUrl : `${FILES_URL}/${imgUrl}`}
                            alt={cleanName}
                            className="w-9 h-9 rounded-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                          />
                        ) : null}
                        <div
                          className={`w-9 h-9 rounded-full bg-[#C4D2FF] text-[#0B1C30] flex items-center justify-center font-bold text-xs ${imgUrl && imgUrl !== "undefined" ? "hidden" : ""}`}
                        >
                          {getInitials(cleanName)}
                        </div>
                        <span className="font-bold text-[#0B1C30] text-xs md:text-sm">{cleanName}</span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-xs md:text-sm font-bold text-[#0B1C30]">
                      {new Date(req.startTime).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </td>
                    <td className="hidden md:table-cell p-3 md:p-4 whitespace-nowrap">
                      <span className="bg-[#FFF0EE] text-[#BA1A1A] px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {req.status === "PendingVerification" ? "Pending Confirmation" : req.status}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleReviewPayment(req.appointmentId)}
                        className="bg-[#138C9F] text-white text-xs font-bold px-4 py-3 rounded-xl min-h-[44px] transition-all cursor-pointer hover:bg-[#0f7282]"
                      >
                        Review & Confirm
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-14 bg-[#0B1C30]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-[calc(100%-2rem)] sm:max-w-[500px] border border-[#C3C6D6] overflow-hidden shadow-xl">
            <div className="bg-[#ecf8fa] px-6 py-4 border-b border-[#C3C6D6]/50 flex justify-between items-center">
              <h3 className="text-base font-black text-[#0B1C30]">Invoice Details & Payment Review</h3>
              <button onClick={() => { setIsPaymentModalOpen(false); setSelectedPayment(null); }} className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="p-6 space-y-5 text-right max-h-[60vh] overflow-y-auto">
              {paymentDetailsLoading ? (
                <div className="text-center py-8 text-gray-400">جاري تحميل التفاصيل...</div>
              ) : selectedPayment ? (
                <>
                  <div className="flex items-center gap-3 bg-[#F4F6FC] p-4 rounded-xl">
                    {selectedPayment.patientImageUrl && selectedPayment.patientImageUrl !== "undefined" ? (
                      <img
                        src={selectedPayment.patientImageUrl.startsWith("http") ? selectedPayment.patientImageUrl : `${FILES_URL}/${selectedPayment.patientImageUrl}`}
                        alt={selectedPayment.patientName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                      />
                    ) : null}
                    <div
                      className={`w-10 h-10 rounded-full bg-[#C4D2FF] text-[#0B1C30] flex items-center justify-center font-black text-sm ${selectedPayment.patientImageUrl && selectedPayment.patientImageUrl !== "undefined" ? "hidden" : ""}`}
                    >
                      {getInitials(selectedPayment.patientName)}
                    </div>
                    <div>
                      <h4 className="font-black text-[#0B1C30] text-base">{selectedPayment.patientName}</h4>
                      <p className="text-xs font-bold text-[#526069] mt-0.5">
                        Appointment time: {new Date(selectedPayment.startTime).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-[#526069]">Amount:</span>
                      <span className="font-black text-[#0B1C30]">{selectedPayment.amount} ILS</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-[#526069]">حالة المستند المرفق:</span>
                      <span className="bg-[#FFF0EE] text-[#BA1A1A] px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {selectedPayment.status === "PendingVerification" ? "بانتظار التأكيد" : selectedPayment.status === "Approved" ? "تم التأكيد" : selectedPayment.status === "Rejected" ? "مرفوض" : selectedPayment.status}
                      </span>
                    </div>
                  </div>

                  {selectedPayment.paymentMethodType && (
                    <div className="bg-[#ecf8fa] border border-[#138C9F]/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        {selectedPayment.paymentMethodType === "Bank" ? (
                          <svg className="w-5 h-5 text-[#138C9F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[#138C9F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                        <span className="font-black text-[#0B1C30] text-sm">
                          {selectedPayment.paymentMethodType === "Bank" ? "Bank Transfer" : "Electronic Wallet"}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#526069]">Name:</span>
                          <span className="font-bold text-[#0B1C30]">{selectedPayment.paymentMethodName}</span>
                        </div>
                        {selectedPayment.accountHolderName && (
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#526069]">Account Holder:</span>
                            <span className="font-bold text-[#0B1C30]">{selectedPayment.accountHolderName}</span>
                          </div>
                        )}
                        {selectedPayment.phoneNumber && (
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#526069]">Phone:</span>
                            <span className="font-bold text-[#0B1C30]">{selectedPayment.phoneNumber}</span>
                          </div>
                        )}
                        {selectedPayment.iban && (
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#526069]">IBAN:</span>
                            <span className="font-bold text-[#0B1C30] font-mono text-xs">{selectedPayment.iban}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedPayment.senderAccountHolderName && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                      <span className="font-black text-[#0B1C30] text-sm">بيانات المرسل</span>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#526069]">Account Holder:</span>
                          <span className="font-bold text-[#0B1C30]">{selectedPayment.senderAccountHolderName}</span>
                        </div>
                        {selectedPayment.senderPhoneNumber && (
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#526069]">Phone:</span>
                            <span className="font-bold text-[#0B1C30]">{selectedPayment.senderPhoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedPayment.attachmentUrl && (
                    <div className="space-y-2">
                      <span className="font-bold text-[#526069] text-sm">صورة الإيصال المرفوعة:</span>
                      <div className="border border-[#C3C6D6] rounded-xl overflow-hidden">
                        <img
                          src={`${FILES_URL}/${selectedPayment.attachmentUrl}`}
                          alt="Receipt image"
                          className="w-full max-h-[20vh] object-contain bg-gray-50"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <div className="hidden items-center justify-center p-8 bg-gray-50 text-gray-400 text-sm">
                          Unable to load receipt image
                        </div>
                      </div>
                    </div>
                  )}

                  {!selectedPayment.attachmentUrl && (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400 text-sm">
                      No receipt image uploaded yet
                    </div>
                  )} 
                </>
              ) : null}

              <div className="px-6 py-4 bg-[#ecf8fa] border-t border-[#C3C6D6]/40 flex items-center gap-3">
                <button
                  onClick={handleConfirmPayment}
                  disabled={actionLoading || !selectedPayment}
                  className="flex-1 h-[3vh] bg-[#138C9F] hover:bg-[#0f7282] active:scale-[0.98] text-white font-black rounded-xl text-sm transition-all cursor-pointer text-center disabled:opacity-50"
                >
                  {actionLoading ? "Confirming..." : "Confirm & Receive Payment 👍"}
                </button>
                <button
                  onClick={() => setRejectModalOpen(true)}
                  disabled={actionLoading || !selectedPayment}
                  className="px-4 h-[3vh] border border-[#BA1A1A] bg-white hover:bg-[#FFF0EE] text-[#BA1A1A] font-bold rounded-xl text-sm transition-all cursor-pointer text-center disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => { setIsPaymentModalOpen(false); setSelectedPayment(null); }}
                  className="px-4 h-[3vh] border border-gray-300 bg-white hover:bg-gray-50 text-[#526069] font-bold rounded-xl text-sm transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pb-14 bg-[#0B1C30]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-[calc(100%-2rem)] sm:max-w-[400px] border border-[#C3C6D6] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#C3C6D6]/50">
              <h3 className="text-base font-black text-[#BA1A1A]">رفض الدفع</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#526069] font-bold">هل أنت متأكد من رفض هذا الدفع؟ يرجى إدخال سبب الرفض:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Rejection reason (optional)"
                className="w-full border border-[#C3C6D6] rounded-xl p-3 text-sm text-right resize-none h-[6vh] focus:outline-none focus:border-[#138C9F]"
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-[#C3C6D6]/40 flex items-center gap-3">
              <button
                onClick={handleRejectPayment}
                disabled={actionLoading}
                className="flex-1 h-[3vh] bg-[#BA1A1A] hover:bg-[#9a1515] text-white font-black rounded-xl text-sm transition-all cursor-pointer text-center disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
              </button>
              <button
                onClick={() => { setRejectModalOpen(false); setRejectionReason(""); }}
                className="px-4 h-[3vh] border border-gray-300 bg-white hover:bg-gray-50 text-[#526069] font-bold rounded-xl text-sm transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;