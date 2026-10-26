import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const MedicalCenters = () => {
  const [search, setSearch] = useState('');
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await axiosInstance.get('/public/facilities', { params: { Type: 'MedicalCenter' } });
        if (data.succeeded && data.data) {
          setCenters(data.data);
        }
      } catch (error) {
        // silently keep empty list
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filtered = centers.filter(c =>
    c.facilityName?.includes(search) || c.area?.includes(search) || c.detailedAddress?.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] dark:text-white mb-3">المراكز الطبية</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">اكتشف المراكز الطبية المعتمدة على المنصة</p>
        </div>

        <div className="max-w-lg mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مركز طبي..."
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
            {filtered.map(center => (
              <div key={center.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-[#1e293b] dark:text-white mb-2">{center.facilityName}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {center.detailedAddress ? `${center.area} — ${center.detailedAddress}` : center.area}
                </p>
                {center.phoneNumber && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 flex items-center gap-2" dir="ltr">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {center.phoneNumber}
                  </p>
                )}
                {center.description && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-3 leading-relaxed">{center.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-sm">لا توجد مراكز طبية تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalCenters;
