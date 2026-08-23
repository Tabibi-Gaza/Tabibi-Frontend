import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const TABS = [
  { key: 'doctors', label: 'الأطباء', emptyMsg: 'لا يوجد أطباء في المفضلة بعد', browseMsg: 'تصفح الأطباء ←', browsePath: '/doctors' },
  { key: 'centers', label: 'المراكز', emptyMsg: 'لا توجد مراكز طبية في المفضلة بعد', browseMsg: 'تصفح المراكز ←', browsePath: '/medical-centers' },
  { key: 'pharmacies', label: 'الصيدليات', emptyMsg: 'لا توجد صيدليات في المفضلة بعد', browseMsg: 'تصفح الصيدليات ←', browsePath: '/pharmacies' },
  { key: 'labs', label: 'المختبرات', emptyMsg: 'لا توجد مختبرات في المفضلة بعد', browseMsg: 'تصفح المختبرات ←', browsePath: '/labs' },
];

const Favorites = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors');
  const [favorites, setFavorites] = useState({ doctors: [], centers: [], pharmacies: [], labs: [] });

  useEffect(() => {
    const doctors = JSON.parse(localStorage.getItem('favorites') || '[]');
    const centers = JSON.parse(localStorage.getItem('favorites_centers') || '[]');
    const pharmacies = JSON.parse(localStorage.getItem('favorites_pharmacies') || '[]');
    const labs = JSON.parse(localStorage.getItem('favorites_labs') || '[]');
    setFavorites({ doctors, centers, pharmacies, labs });
  }, []);

  const removeFavorite = (key, id) => {
    const storageKey = key === 'doctors' ? 'favorites' : `favorites_${key}`;
    const updated = favorites[key].filter(f => f.id !== id);
    setFavorites(prev => ({ ...prev, [key]: updated }));
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const currentTab = TABS.find(t => t.key === activeTab);
  const currentItems = favorites[activeTab] || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-[#1e293b]">المفضلة <span className="text-red-500">❤</span></h1>
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all cursor-pointer">
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
          {TABS.map(tab => {
            const count = favorites[tab.key]?.length || 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-[#138C9F] text-white shadow-md'
                    : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Content */}
        {currentItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm mb-2">{currentTab.emptyMsg}</p>
            <button
              onClick={() => navigate(currentTab.browsePath)}
              className="text-[#138C9F] text-sm font-bold hover:underline cursor-pointer"
            >
              {currentTab.browseMsg}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentItems.map(item => (
              <div
                key={item.id}
                className="bg-white border border-gray-150 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col relative"
              >
                {/* شارة التوفر */}
                {item.available !== false && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 text-[10px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse"></span>
                    <span>متاح اليوم</span>
                  </div>
                )}

                {/* زر القلب */}
                <div className="absolute top-3 left-3 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFavorite(activeTab, item.id); }}
                    className="p-1.5 rounded-full border transition-all duration-200 shadow-xs bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                </div>

                {/* الصورة */}
                <div className="bg-gray-50/50 h-52 w-full flex items-center justify-center relative border-b border-gray-100">
                  {item.image ? (
                    <img loading="lazy" decoding="async" width="120" height="120" src={item.image} alt={item.name} className="h-full object-contain object-bottom pt-2" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#138C9F]/10 flex items-center justify-center">
                      <span className="text-[#138C9F] text-3xl font-bold">{item.name?.[0]}</span>
                    </div>
                  )}
                </div>

                {/* التفاصيل */}
                <div className="p-4 flex-1 flex flex-col justify-between text-right bg-white relative">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-900 font-black text-sm">{item.name}</h3>
                      {item.rating && (
                        <div className="flex items-center gap-0.5 text-[10px] text-gray-500 font-bold">
                          <span className="text-amber-500 text-xs">★</span>
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[#138C9F] font-bold text-xs">{item.specialty || item.type || ""}</p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-bold pt-1">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs" />
                      <span>{item.address || item.location || ""}</span>
                    </div>
                    {item.phone && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 font-bold">
                        <FontAwesomeIcon icon={faClock} className="text-gray-400 text-xs" />
                        <span>{item.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50">
                    {item.fees && (
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold leading-none">كشفية</p>
                        <p className="text-xs font-black text-[#138C9F] mt-0.5">{item.fees} ILS</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const paths = { doctors: `/appointment/${item.id}`, centers: `/medical-centers/${item.id}`, pharmacies: `/pharmacies/${item.id}`, labs: `/labs/${item.id}` };
                          navigate(paths[activeTab] || '/');
                        }}
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
