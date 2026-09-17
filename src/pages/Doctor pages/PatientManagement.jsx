import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiSliders,
    FiFileText,
    FiFolder,
    FiUserCheck,
    FiUsers,
    FiChevronLeft,
    FiChevronRight,
    FiSearch
} from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import { useTranslation } from 'react-i18next';

const FILES_URL = import.meta.env.VITE_Files_URL || '';

export default function PatientManagement() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axiosInstance.get('/doctor/appointments/my-patients');
                if (res.data.succeeded && res.data.data) {
                    setPatients(res.data.data.map(p => ({
                        id: p.id,
                        name: p.fullName,
                        email: p.email,
                        avatar: p.profileImageUrl ? (p.profileImageUrl.startsWith('http') ? p.profileImageUrl : `${FILES_URL}/${p.profileImageUrl}`) : null,
                        age: p.age,
                        gender: p.gender === 'Male' ? t('profile.male') : t('profile.female'),
                        lastVisit: p.lastVisit ? (() => { const d = new Date(p.lastVisit); const day = String(d.getDate()).padStart(2, '0'); const month = String(d.getMonth() + 1).padStart(2, '0'); const year = d.getFullYear(); return `${day}/${month}/${year}`; })() : '—',
                        isActive: true
                    })));
                }
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // حالات التحكم
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // عدد العناصر في كل صفحة
    const itemsPerPage = 3;

    // معالجة التغيير في البحث مع تصفير الصفحة تلقائياً
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // معالجة التغيير في الفلتر مع تصفير الصفحة تلقائياً
    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    // حساب الفلترة بأمان تام داخل الـ useMemo (بدون أي State Side-effects)
    const filteredPatients = useMemo(() => {
        return patients.filter(patient => {
            const matchesSearch = patient.name.includes(searchTerm) || patient.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'active' ? patient.isActive : !patient.isActive);
            return matchesSearch && matchesStatus;
        });
    }, [patients, searchTerm, statusFilter]);

    // حساب إجمالي الصفحات ديناميكياً
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;

    // اقتطاع البيانات الحالية المعروضة بناءً على الترقيم الذكي (Pagination Slice)
    const currentTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPatients.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPatients, currentPage]);

    const handleMedicalRecord = (id) => navigate(`/doctor/medical-file/${id}`);
    const handleMedicalFile = (id) => navigate(`/doctor/medical-examination/${id}?tab=medical_file`);

    if (loading) {
        return (
            <div className="w-full bg-gray-50 dark:bg-gray-900/50 pb-8 pr-4 flex items-center justify-center h-64" dir="rtl">
                <p className="text-gray-400 dark:text-gray-500 font-bold">{t('patientManagement.loading')}</p>
            </div>
        );
    }

    return (
      <div className="w-full bg-gray-50 dark:bg-gray-900/50  pb-8 pr-4" dir="rtl">
        {/* العناوين والإحصائيات */}
        {/*    <div
        className="space-y-6 md:space-y-8 w-full pb-8 pr-4 relative"
        dir="rtl"
      >
        {/* قسم الترحيب - تم ضبط المسافة الجانبية هنا لمنع التداخل 
         className="space-y-6 text-right */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#138C9F]">
              {t('patientManagement.title')}
            </h1>
            <p className="text-sm font-semibold text-[#434654]">
              {t('patientManagement.totalAvailable', { count: filteredPatients.length })}
            </p>
          </div>
        </div>

        {/* الحاوية الرئيسية للقائمة */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {/* شريط التحكم بالبحث والتصفية */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 ">
            <h2 className="text-lg md:text-xl font-bold text-[#0B1C30] dark:text-gray-200">
              {t('patientManagement.patientList')}
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                  <FiSearch className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder={t('patientManagement.searchPlaceholder')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full h-10 ps-9 pe-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-right focus:outline-none focus:border-[#138C9F]"
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={handleFilterChange}
                  className="w-full sm:w-auto h-10 px-8 bg-white dark:bg-gray-800 rounded-lg text-sm font-bold text-right cursor-pointer focus:outline-none"
                >
                  <option value="all">{t('patientManagement.allStatuses')}</option>
                  <option value="active">{t('patientManagement.active')}</option>
                  <option value="inactive">{t('patientManagement.inactive')}</option>
                </select>
                <FiSliders className="absolute inset-y-0 start-3 my-auto text-gray-400 dark:text-gray-500 pointer-events-none transform rotate-90 w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* عرض الجدول للشاشات الكبيرة */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#e2f4f7] dark:bg-gray-800  text-xs font-bold text-[#434654]">
                  <th className="p-4 w-[30%]">{t('patientManagement.nameHeader')}</th>
                  <th className="p-4 text-center">{t('patientManagement.ageGenderHeader')}</th>
                  <th className="p-4 text-center">{t('patientManagement.lastVisitHeader')}</th>
                  <th className="p-4 text-center">{t('patientManagement.statusHeader')}</th>
                  <th className="p-4 text-center w-[30%]">{t('patientManagement.actionsHeader')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C3C6D6]/60">
                {currentTableData.length > 0 ? (
                  currentTableData.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 dark:bg-gray-900/70 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            loading="lazy"
                            decoding="async"
                            width="40"
                            height="40"
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-[#0B1C30] dark:text-gray-200">
                              {patient.name}
                            </span>
                            <span className="text-xs text-[#434654]">
                              {patient.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-sm font-medium">
                        {patient.age} {t('patientManagement.years')} / {patient.gender}
                      </td>
                      <td className="p-4 text-center text-sm font-medium">
                        {patient.lastVisit}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-4 py-1 text-xs font-bold rounded-full ${patient.isActive ? "bg-[#138C9F]/20 text-[#138C9F]" : "bg-[#526069]/10 text-[#526069] dark:text-gray-400"}`}
                        >
                          {patient.isActive ? t('patientManagement.statusCompleted') : t('patientManagement.statusIncomplete')}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleMedicalRecord(patient.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#138C9F] text-white text-xs font-extrabold rounded-lg hover:bg-[#107585] shadow-sm cursor-pointer"
                          >
                            <span>{t('patientManagement.personalMedicalRecord')}</span>
                            <FiFileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMedicalFile(patient.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#138C9F] text-[#138C9F] text-xs font-extrabold rounded-lg hover:bg-[#138C9F]/5 cursor-pointer"
                          >
                            <span>{t('patientManagement.medicalHistory')}</span>
                            <FiFolder className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-8 text-sm text-gray-400"
                    >
                      {t('patientManagement.noMatchingPatients')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* عرض كروت بديلة للموبايل */}
          <div className="block md:hidden divide-y divide-[#C3C6D6]/60 bg-white">
            {currentTableData.map((patient) => (
              <div key={patient.id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      loading="lazy"
                      decoding="async"
                      width="44"
                      height="44"
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-11 h-11 rounded-full object-cover border"
                    />
                    <div>
                      <h4 className="text-base font-bold text-[#0B1C30] dark:text-gray-200">
                        {patient.name}
                      </h4>
                      <p className="text-xs text-[#434654]">{patient.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-0.5 text-[11px] font-bold rounded-full ${patient.isActive ? "bg-[#138C9F]/20 text-[#138C9F]" : "bg-[#526069]/10 text-[#526069] dark:text-gray-400"}`}
                  >
                    {patient.isActive ? t('patientManagement.active') : t('patientManagement.inactive')}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl text-xs font-bold text-slate-700">
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 block mb-0.5">
                      {t('patientManagement.ageGender')}
                    </span>
                    {patient.age} {t('patientManagement.years')} / {patient.gender}
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 block mb-0.5">
                      {t('patientManagement.lastVisitHeader')}
                    </span>
                    {patient.lastVisit}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 w-full pt-1">
                  <button
                    onClick={() => handleMedicalRecord(patient.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-[#138C9F] text-white text-xs font-extrabold rounded-xl cursor-pointer"
                  >
                    <span>{t('patientManagement.personalMedicalRecord')}</span>
                    <FiFileText className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMedicalFile(patient.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-[#138C9F] text-[#138C9F] text-xs font-extrabold rounded-xl bg-white dark:bg-gray-800 cursor-pointer"
                  >
                    <span>{t('patientManagement.medicalHistory')}</span>
                    <FiFolder className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* شريط التنقل السفلي المعدل (Pagination Fixed) */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-t border-[#C3C6D6] dark:border-gray-700 text-sm text-[#434654]">
            <div className="font-semibold text-center sm:text-right">
              {t('patientManagement.showing')}{" "}
              {filteredPatients.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}
              -{Math.min(currentPage * itemsPerPage, filteredPatients.length)}{" "}
              {t('patientManagement.ofTotal', { count: filteredPatients.length })}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`p-2 bg-white dark:bg-gray-800 rounded-lg transition-colors cursor-pointer ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
              >
                <FiChevronRight className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${currentPage === index + 1 ? "bg-[#138C9F] text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-100"}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`p-2 bg-white dark:bg-gray-800 rounded-lg transition-colors cursor-pointer ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}