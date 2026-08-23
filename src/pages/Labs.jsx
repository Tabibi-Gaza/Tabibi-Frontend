import React, { useState } from 'react';

const labs = [
  { id: 1, name: "مختبر الأمل", address: "مدينة غزة، شارع عمر المختار", phone: "0591234001", services: ["تحاليل الدم", "تحاليل البول", "الأشعة"], hours: "7:00 - 20:00" },
  { id: 2, name: "مختبر البراء", address: "شمال غزة، بيت لاهيا", phone: "0591234002", services: ["تحاليل الدم", "الزجاج المجهري", "التحاليل الهرمونية"], hours: "8:00 - 18:00" },
  { id: 3, name: "مختبر الحياة", address: "النصيرات، شارع الرئيسي", phone: "0591234003", services: ["تحاليل شاملة", "الأشعة", "التحاليل الجينية"], hours: "24 ساعة" },
  { id: 4, name: "مختبر الشفاء", address: "دير البلح", phone: "0591234004", services: ["تحاليل الدم", "تحاليل الكلى", "السكري"], hours: "7:30 - 19:00" },
  { id: 5, name: "مختبر النور", address: "خان يونس، شارع الشهداء", phone: "0591234005", services: ["تحاليل شاملة", "التحاليل الدموية", "البكتريولوجية"], hours: "8:00 - 20:00" },
  { id: 6, name: "مختبر الفلاح", address: "رفح، شارع الشهداء", phone: "0591234006", services: ["تحاليل الدم", "الزجاج المجهري", "تحاليل الطفيليات"], hours: "7:00 - 18:00" },
];

const Labs = () => {
  const [search, setSearch] = useState('');

  const filtered = labs.filter(l =>
    l.name.includes(search) || l.address.includes(search) || l.services.some(s => s.includes(search))
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] mb-3">المختبرات الطبية</h1>
          <p className="text-gray-500 text-sm md:text-base">ابحث عن أقرب مختبر للتحاليل الطبية</p>
        </div>

        <div className="max-w-lg mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مختبر أو خدمة..."
              className="w-full h-14 pr-12 pl-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:border-[#138C9F] focus:ring-2 focus:ring-[#138C9F]/20 transition-all"
            />
            <svg className="w-5 h-5 absolute right-4 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(lab => (
            <div key={lab.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#1e293b] mb-2">{lab.name}</h3>
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {lab.address}
              </p>
              <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {lab.phone}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {lab.services.map((service, i) => (
                  <span key={i} className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">{service}</span>
                ))}
              </div>
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{lab.hours}</span>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">لا توجد مختبرات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
