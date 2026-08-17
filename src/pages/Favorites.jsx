import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  }, []);

  const removeFavorite = (doctorId) => {
    const updated = favorites.filter(f => f.id !== doctorId);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] pt-28 pb-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] mb-3">المفضلة</h1>
          <p className="text-gray-500 text-sm md:text-base">الأطباء المحفوظون في قائمة المفضلة</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm mb-2">لا يوجد أطباء في المفضلة بعد</p>
            <button
              onClick={() => navigate('/doctors')}
              className="text-[#138C9F] text-sm font-bold hover:underline cursor-pointer"
            >
              تصفح الأطباء ←
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map(doc => (
              <div
                key={doc.id}
                className="bg-white border border-gray-150 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col relative"
              >
                {/* شارة التوفر */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 text-[10px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse"></span>
                  <span>متاح اليوم</span>
                </div>

                {/* زر القلب */}
                <div className="absolute top-3 left-3 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFavorite(doc.id); }}
                    className="p-1.5 rounded-full border transition-all duration-200 shadow-xs bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                </div>

                {/* صورة الطبيب */}
                <div className="bg-gray-50/50 h-52 w-full flex items-center justify-center relative border-b border-gray-100">
                  {doc.image ? (
                    <img src={doc.image} alt={doc.name} className="h-full object-contain object-bottom pt-2" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#138C9F]/10 flex items-center justify-center">
                      <span className="text-[#138C9F] text-3xl font-bold">{doc.name?.[0]}</span>
                    </div>
                  )}
                </div>

                {/* تفاصيل الطبيب */}
                <div className="p-4 flex-1 flex flex-col justify-between text-right bg-white relative">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-900 font-black text-sm">{doc.name}</h3>
                      <div className="flex items-center gap-0.5 text-[10px] text-gray-500 font-bold">
                        <span className="text-amber-500 text-xs">★</span>
                        <span>{doc.rating || "4.8"}</span>
                      </div>
                    </div>

                    <p className="text-[#138C9F] font-bold text-xs">{doc.specialty || "طبيب متخصص"}</p>

                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 pt-2 pb-1 text-[11px] text-gray-500 font-bold border-b border-gray-50">
                      <div className="flex items-center gap-1 justify-start">
                        <FontAwesomeIcon icon={faClock} className="text-gray-400 text-xs" />
                        <span>{doc.experience || "8 سنوات خبرة"}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end truncate">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs" />
                        <span>{doc.address || "غزة"}</span>
                      </div>
                    </div>
                  </div>

                  {/* الكشفية والأزرار */}
                  <div className="flex items-center justify-between pt-3 mt-2">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold leading-none">كشفية</p>
                      <p className="text-xs font-black text-[#138C9F] mt-0.5">{doc.fees || "50"} ILS</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/appointment/${doc.id}`)}
                        className="bg-[#138C9F] hover:bg-[#2c7792] text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        احجز الآن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
