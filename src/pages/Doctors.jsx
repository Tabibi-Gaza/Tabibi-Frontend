import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDoctors } from "../hooks/doctors/useDoctors";
import { useSpecializations } from "../hooks/specializations/useSpecializations";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DoctorCard from "./../components/Doctors/DoctorCard";
import {
  faSearch,
  faMapMarkerAlt,
  faClock,
  faTriangleExclamation,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

const Doctors = () => {
  const { t } = useTranslation();
  const { speciality } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage =12;

  // 1. الـ Debounce ينحصر فقط في تحديث قيمة البحث المفلترة بدون لمس رقم الصفحة هنا
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // دالة التعامل مع تغيير نص البحث: تحدث النص وتعيد الصفحة إلى 1 بالتزامن لحل مشكلة الرندرة
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // دالة موحدة للتعامل مع الانتقال وتصفير الحالة عند تغيير التخصص
  const handleSpecialityChange = (targetPath) => {
    setCurrentPage(1);
    setSearchQuery("");
    setDebouncedSearch("");
    navigate(targetPath);
  };

  const { data: specializationsList = [], isLoading: isSpecsLoading } =
    useSpecializations();

  // 2. جلب البيانات بناءً على المعاملات المحدثة
  const doctorsParams = useMemo(() => {
    const params = {
      SpecializationId: speciality || "",
      Search: debouncedSearch,
      Page: currentPage,
      PageSize: doctorsPerPage,
    };
    if (sortBy) {
      params.SortBy = sortBy;
      params.Desc = sortBy === "rating" || sortBy === "experience";
    }
    return params;
  }, [speciality, debouncedSearch, currentPage, sortBy]);

  const {
    data: apiResponse,
    isLoading: isDoctorsLoading,
    isError,
  } = useDoctors(doctorsParams);

  const doctorsList = apiResponse?.data?.items || apiResponse?.items || [];
  const totalPages =
    apiResponse?.data?.totalPages || apiResponse?.totalPages || 1;
  const activePage = currentPage;

  // تأثير الانتقال السلس لأعلى الصفحة عند تغيير الصفحة (تأثير مرئي مسموح به في الـ Effects)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

if (isError)
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4 pt-40 font-['Cairo'] dark:bg-gray-900 dark:text-gray-200"
      dir="rtl"
    >
      <div className="bg-white border border-red-100 shadow-sm rounded-3xl p-8 max-w-md w-full text-center dark:bg-gray-800 dark:border-gray-700">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-3xl text-red-500"
          />
        </div>

        <h2 className="text-lg font-black text-gray-800 mb-2 dark:text-gray-200">
          تعذر تحميل بيانات الأطباء
        </h2>

        <p className="text-sm text-gray-500 font-bold leading-relaxed mb-6 dark:text-gray-400">
          حدث خطأ أثناء الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت والمحاولة
          مرة أخرى.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="bg-[#138C9F] hover:bg-[#0f7282] text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
  return (
    <div
      className="px-4 sm:px-6 lg:px-8 pt-30 my-8 text-gray-800 font-['Cairo'] dark:bg-gray-900 dark:text-gray-200"
      dir="rtl"
    >
      {/* الجزء العلوي */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] dark:text-gray-200">
          {t('doctors.title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-bold dark:text-gray-400">
          تصفح الأطباء المتاحين لمساعدتك الآن.
        </p>
      </div>

      {/* شريط البحث + زر الفلتر + قائمة الترتيب */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('doctors.search')}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#138C9F] focus:border-transparent outline-none shadow-xs text-right dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => { setShowSortMenu(!showSortMenu); setShowFilters(false); }}
              className={`p-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer text-xs font-bold ${sortBy ? "bg-[#138C9F] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              title="ترتيب حسب"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 min-w-[200px] text-right dark:bg-gray-800 dark:border-gray-600">
                  <button onClick={() => { setSortBy(""); setShowSortMenu(false); setCurrentPage(1); }} className={`w-full px-4 py-2.5 text-xs font-bold text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!sortBy ? "text-[#138C9F] bg-[#138C9F]/5" : "text-gray-700 dark:text-gray-300"}`}>الافتراضي</button>
                  <button onClick={() => { setSortBy("rating"); setShowSortMenu(false); setCurrentPage(1); }} className={`w-full px-4 py-2.5 text-xs font-bold text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${sortBy === "rating" ? "text-[#138C9F] bg-[#138C9F]/5" : "text-gray-700 dark:text-gray-300"}`}>⭐ الأعلى تقييماً</button>
                  <button onClick={() => { setSortBy("price"); setShowSortMenu(false); setCurrentPage(1); }} className={`w-full px-4 py-2.5 text-xs font-bold text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${sortBy === "price" ? "text-[#138C9F] bg-[#138C9F]/5" : "text-gray-700 dark:text-gray-300"}`}>💰 الأقل سعراً</button>
                  <button onClick={() => { setSortBy("experience"); setShowSortMenu(false); setCurrentPage(1); }} className={`w-full px-4 py-2.5 text-xs font-bold text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${sortBy === "experience" ? "text-[#138C9F] bg-[#138C9F]/5" : "text-gray-700 dark:text-gray-300"}`}>🏆 الأكثر خبرة</button>
                  <button onClick={() => { setSortBy("region"); setShowSortMenu(false); setCurrentPage(1); }} className={`w-full px-4 py-2.5 text-xs font-bold text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${sortBy === "region" ? "text-[#138C9F] bg-[#138C9F]/5" : "text-gray-700 dark:text-gray-300"}`}>📍 حسب المنطقة</button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => { setShowFilters(!showFilters); setShowSortMenu(false); }}
            className="p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer bg-[#2c7792] text-white"
            title="إظهار/إخفاء التخصصات"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h8" />
            </svg>
          </button>
        </div>
      </div>

      {/* أزرار التصفية - تظهر عند الضغط على زر الفلتر */}
      {showFilters && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleSpecialityChange("/doctors")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${!speciality ? "bg-[#138C9F] text-white" : "bg-gray-200/70 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"}`}
            >
              {t('doctors.all')}
            </button>

            {isSpecsLoading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-16 bg-gray-200 animate-pulse rounded-lg dark:bg-gray-700"
                  />
                ))
              : specializationsList.map((spec) => {
                  const isSelected = speciality === String(spec.id);
                  return (
                    <button
                      key={spec.id}
                      onClick={() => {
                        if (isSelected) {
                          handleSpecialityChange("/doctors");
                        } else {
                          handleSpecialityChange(`/doctors/${spec.id}`);
                        }
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isSelected ? "bg-[#138C9F] text-white" : "bg-gray-200/70 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"}`}
                    >
                      {spec.name}
                    </button>
                  );
                })}
          </div>
        </div>
      )}

      {/* شبكة عرض الأطباء أو الـ Skeleton */}
      <div
        className="w-full grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-gray-200 dark:text-gray-300"
      >
        {isDoctorsLoading ? (
          [...Array(doctorsPerPage)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs flex flex-col relative animate-pulse dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="bg-gray-100 h-52 w-full dark:bg-gray-700" />
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-600" />
                    <div className="h-3 bg-gray-200 rounded w-8 dark:bg-gray-600" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 dark:bg-gray-600" />
                  <div className="border-t border-gray-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 dark:border-gray-600">
                    <div className="h-3 bg-gray-200 rounded w-3/4 dark:bg-gray-600" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 justify-self-end dark:bg-gray-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-1 w-1/4">
                    <div className="h-2 bg-gray-200 rounded dark:bg-gray-600" />
                    <div className="h-3 bg-gray-200 rounded dark:bg-gray-600" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded-xl w-24 dark:bg-gray-600" />
                </div>
              </div>
            </div>
          ))
        ) : doctorsList.length > 0 ? (
          doctorsList.map((item, index) => (
            <DoctorCard key={item.id || item._id || index} item={item} />
          ))
        ) : (
          <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 dark:bg-gray-800 dark:border-gray-700">
            <span className="text-3xl">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-1xl text-gray-400"
              />
            </span>
            <h3 className="text-gray-800 font-black text-sm dark:text-gray-200">
              {t('doctors.noDoctors')}
            </h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed dark:text-gray-400">
              يرجى التحقق من نص البحث أو اختيار تخصص طبي آخر.
            </p>
            <button
              onClick={() => handleSpecialityChange("/doctors")}
              className="mt-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold text-xs transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* نظام الـ Pagination */}
      {!isDoctorsLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-10 text-xs font-bold text-gray-500 select-none dark:text-gray-400">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={activePage === 1}
            className={`p-1 px-2 rounded-md transition-all ${activePage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"}`}
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => {
                  setCurrentPage(pageNumber);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  activePage === pageNumber
                    ? "bg-[#138C9F] text-white shadow-xs font-black"
                    : "hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            disabled={activePage === totalPages}
            className={`p-1 px-2 rounded-md transition-all ${activePage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"}`}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Doctors;
