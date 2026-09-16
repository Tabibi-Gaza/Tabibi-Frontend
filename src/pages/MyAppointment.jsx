import React, { useContext, useEffect, useState } from "react";
import { AppContext } from '../context/AppContext'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCalendarCheck,
  faPlus,
  faEye,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from '../utils/imageUrl';
import { formatTimeArabic } from '../utils/dateFormatter';

const FILES_BASE = import.meta.env.VITE_Files_URL || '';

const STATUS_MAP = {
  'PendingPayment': { labelKey: 'appointment.pendingPayment', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  'PendingVerification': { labelKey: 'appointment.pendingVerification', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  'Confirmed': { labelKey: 'appointment.confirmed', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  'Completed': { labelKey: 'appointment.completed', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
  'Rejected': { labelKey: 'appointment.rejected', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
};

const MyAppointment = () => {
  const { token } = useContext(AppContext)
  const { t } = useTranslation()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState(null)
  const navigate = useNavigate()

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch { return ""; }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return formatTimeArabic(dateStr);
  };

  const getStatus = (status) => STATUS_MAP[status] || { labelKey: null, label: status, bg: 'bg-gray-50 dark:bg-gray-900', text: 'text-gray-600 dark:text-gray-400 dark:text-gray-500', border: 'border-gray-100 dark:border-gray-700' };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm(t('appointment.deleteConfirm'))) return;
    try {
      const { data } = await axiosInstance.delete(`/patient/appointments/${appointmentId}`);
      if (data.succeeded) {
        toast.success(t('appointment.deleteSuccess'));
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
      } else {
        toast.error(data.errors?.[0]?.message || t('appointment.deleteFailed'));
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.message || t('appointment.deleteError'));
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancelId(appointmentId);
      const { data } = await axiosInstance.post('/patient/appointments/cancel', { appointmentId })
      if (data.succeeded) {
        toast.success(data.message || t('appointment.cancelSuccess'))
        setAppointments(prev => prev.filter(a => a.id !== appointmentId))
      } else {
        toast.error(data.errors?.[0]?.message || data.message || t('appointment.cancelError'))
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || error.message)
    } finally {
      setCancelId(null);
    }
  }

  useEffect(() => {
    if (!token) return;
    let ignore = false;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/patient/appointments");
        if (!ignore && data.succeeded && data.data) {
          setAppointments(data.data);
        }
      } catch (error) {

      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchAppointments();
    return () => { ignore = true; };
  }, [token]);

  const upcoming = appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled' && a.status !== 'Rejected');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Rejected');

  return (
    <div className="w-full p-4 pt-40 max-w-5xl mx-auto text-right mb-16" dir="rtl">
      <div className="flex justify-between items-center mb-8 pb-4">
        <div>
          <h1 className="text-2xl mb-3 font-bold text-gray-800 dark:text-gray-200">{t('appointment.myAppointments')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('appointment.appointmentsList')}</p>
        </div>
        <button
          onClick={() => navigate("/doctors")}
          className="flex items-center gap-1.5 bg-[#138c9f] hover:bg-[#0c5f6c] text-white px-4 py-2 rounded-xl text-md font-medium transition-all shadow-sm"
        >
          <span>{t('appointment.bookNew')}</span>
          <span className="text-sm font-bold"><FontAwesomeIcon icon={faPlus} /></span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#138C9F]"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center my-6">
          <div className="w-40 h-40 bg-[#f4faff] dark:bg-gray-800 rounded-full flex items-center justify-center relative mb-6">
            <span className="absolute top-4 right-4 bg-[#138c9f] text-white p-1 rounded-md text-sm">
              <FontAwesomeIcon icon={faCalendarDays} />
            </span>
            <div className="text-5xl text-[#138c9f]">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{t('appointment.noAppointments')}</h2>
          <p className="text-sm text-gray-800 dark:text-gray-300 dark:text-gray-500 max-w-sm leading-relaxed mb-6">
            {t('appointment.noAppointmentsDescription')}
          </p>
          <button onClick={() => navigate("/doctors")} className="flex items-center gap-2 bg-[#138c9f] hover:bg-[#0c5f6c] text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md">
            <span>{t('appointment.bookFirst')}</span>
            <span><FontAwesomeIcon icon={faPlus} /></span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {upcoming.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 dark:border-gray-700 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-1.5">
                {t('appointment.upcomingAppointments')} ({upcoming.length})
              </h3>
              <div className="flex flex-col gap-3">
                {upcoming.map((item) => {
                  const st = getStatus(item.status);
                  return (
                    <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
                          <img loading="lazy" decoding="async" width="48" height="48" className="w-full h-full object-cover" src={item.doctorImageUrl ? resolveImageUrl(item.doctorImageUrl) : 'https://ui-avatars.com/api/?name=Doctor&background=138C9F&color=fff'} alt="" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.doctorName}</h4>
                          <p className="text-xs text-[#138c9f] font-medium mt-0.5">{item.specializationName}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                            <span>📅 {formatDate(item.startTime)}</span>
                            <span className="mx-1">|</span>
                            <span>🕒 {formatTime(item.startTime)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                        <span className={`text-xs font-bold ${st.bg} ${st.text} border ${st.border} px-3 py-1.5 rounded-lg`}>
                          {st.labelKey ? t(st.labelKey) : st.label}
                        </span>
                        <button
                          onClick={() => navigate(`/medical-files`)}
                          className="text-gray-400 dark:text-gray-500 hover:text-[#138c9f] p-2 rounded-lg hover:bg-gray-50 dark:bg-gray-900 transition-all"
                          title={t('appointment.viewDetails')}
                        >
                          <FontAwesomeIcon icon={faEye} className="text-sm" />
                        </button>
                        <button
                          onClick={() => cancelAppointment(item.id)}
                          disabled={cancelId === item.id}
                          className="bg-[#e06666] hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                          {cancelId === item.id ? t('appointment.cancelling') : t('appointment.cancelBooking')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 dark:border-gray-700 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-1.5">
                {t('appointment.pastAppointments')} ({past.length})
              </h3>
              <div className="flex flex-col gap-3">
                {past.map((item) => {
                  const st = getStatus(item.status);
                  return (
                    <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm opacity-85">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600 grayscale">
                          <img loading="lazy" decoding="async" width="48" height="48" className="w-full h-full object-cover" src={item.doctorImageUrl ? resolveImageUrl(item.doctorImageUrl) : 'https://ui-avatars.com/api/?name=Doctor&background=138C9F&color=fff'} alt="" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.doctorName}</h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">{item.specializationName}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                            📅 {formatDate(item.startTime)} | 🕒 {formatTime(item.startTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <button
                          onClick={() => navigate(`/medical-files`)}
                          className="text-gray-400 dark:text-gray-500 hover:text-[#138c9f] p-2 rounded-lg hover:bg-gray-50 dark:bg-gray-900 transition-all"
                          title={t('appointment.viewDetails')}
                        >
                          <FontAwesomeIcon icon={faEye} className="text-sm" />
                        </button>
                        <span className={`text-xs font-bold ${st.bg} ${st.text} border ${st.border} px-4 py-1.5 rounded-lg`}>
                          {st.labelKey ? t(st.labelKey) : st.label}
                        </span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title={t('appointment.deleteAppointment')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer border border-red-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyAppointment
