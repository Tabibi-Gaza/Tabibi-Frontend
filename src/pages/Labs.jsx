import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const Labs = () => {
  const [search, setSearch] = useState('');
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const { data } = await axiosInstance.get('/public/facilities', { params: { Type: 'Lab' } });
        if (data.succeeded && data.data) {
          setLabs(data.data);
        }
      } catch (error) {
        // silently keep empty list
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const filtered = labs.filter(l =>
    l.facilityName?.includes(search) || l.area?.includes(search) || l.detailedAddress?.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] dark:text-white mb-3">المختبرات الطبية</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">ابحث عن أقرب مختبر للتحاليل الطبية</p>
        </div>

        <div className="max-w-lg mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مختبر..."
              className="w-full h-14 pr-12 pl-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-[#138C9F] focus:ring-2 focus:ring-[#138C9F]/20 transition-all"
            />
            <svg className="w-5 h-5 absolute right-4 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(lab => (
              <div key={lab.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-[#1e293b] dark:text-white mb-2">{lab.facilityName}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {lab.detailedAddress ? `${lab.area} — ${lab.detailedAddress}` : lab.area}
                </p>
                {lab.phoneNumber && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 flex items-center gap-2" dir="ltr">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {lab.phoneNumber}
                  </p>
                )}
                {lab.description && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-3 leading-relaxed">{lab.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-sm">لا توجد مختبرات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
