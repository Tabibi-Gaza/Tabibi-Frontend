import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pharmacies = [
  { id: 1, name: "صيدلية الشفاء", address: "مدينة غزة، شارع الشهداء", phone: "0591234567", hours: "8:00 - 22:00", image: null },
  { id: 2, name: "صيدلية الدواء", address: "النصيرات، شارع وسط البلد", phone: "0599876543", hours: "24 ساعة", image: null },
  { id: 3, name: "صيدلية الحياة", address: "رفح، شارع الشهداء", phone: "0598765432", hours: "9:00 - 21:00", image: null },
  { id: 4, name: "صيدلية بيت لاهيا", address: "بيت لاهيا، شارع الرئيسي", phone: "0597654321", hours: "8:00 - 20:00", image: null },
  { id: 5, name: "صيدلية النور", address: "جباليا، شارع الشهداء", phone: "0596543210", hours: "7:00 - 23:00", image: null },
  { id: 6, name: "صيدلية السلام", address: "دير البلح، شارع الوسطى", phone: "0595432109", hours: "9:00 - 21:00", image: null },
];

const Pharmacies = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = pharmacies.filter(p =>
    p.name.includes(search) || p.address.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] mb-3">الصيدليات</h1>
          <p className="text-gray-500 text-sm md:text-base">ابحث عن أقرب صيدلية إليك</p>
        </div>

        <div className="max-w-lg mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن صيدلية..."
              className="w-full h-14 pr-12 pl-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:border-[#138C9F] focus:ring-2 focus:ring-[#138C9F]/20 transition-all"
            />
            <svg className="w-5 h-5 absolute right-4 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(pharmacy => (
            <div key={pharmacy.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#1e293b] mb-2">{pharmacy.name}</h3>
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {pharmacy.address}
              </p>
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {pharmacy.phone}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full">{pharmacy.hours}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">لا توجد صيدليات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pharmacies;
