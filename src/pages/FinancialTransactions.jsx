import React, { useState } from 'react';

const FinancialTransactions = () => {
    // بيانات تجريبية لتسهيل ربطها مع الباكيند لاحقاً
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: '12 أكتوبر 2023',
            doctor: 'د.عبدالله المناعمه',
            role: 'قائد الفرونت',
            avatar: 'ع',
            amount: '50.00 ILS',
            status: 'تم الدفع',
        },
        {
            id: 2,
            date: '08 أكتوبر 2023',
            doctor: 'ا.د. مازن أبوسيف',
            role: 'القائد العام',
            avatar: 'م',
            amount: '30.00 ILS',
            status: 'تم الدفع',
        },
        {
            id: 3,
            date: '25 سبتمبر 2023',
            doctor: 'باقي التيم',
            role: 'احلى تحيه',
            avatar: 'ت',
            amount: '40.00 ILS',
            status: 'تم الدفع',
        },
    ]);

    return (
        <div className="p-5 md:p-10 bg-[#f7f9fc] min-h-screen font-['Cairo']" dir="rtl">
            <div className="max-w-6xl mx-auto bg-[#f8fafc] p-6 border border-[#cfd9e8] rounded-xl shadow-xs">

                {/* الكارت الرئيسي */}
                <section className="bg-white border border-[#cfd9e8] rounded-xl p-6 md:p-10">

                    {/* العناوين والوصف */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#0087a8] mb-3 leading-tight">
                        المعاملات المالية
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 mb-8 leading-relaxed">
                        تتبع جميع المعاملات المالية الفورية وحالة المدفوعات الخاصة بك بسهولة.
                    </p>

                    {/* شريط الأدوات (الفلاتر والإجمالي) */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-xl font-extrabold text-[#0087a8]">
                                المعاملات الأخيرة
                            </span>
                            <span className="text-sm md:text-base font-bold text-slate-700">
                                إجمالي المدفوعات (1,000.00 ILS)
                            </span>
                        </div>

                        {/* الفلاتر - مع الحفاظ على اتجاه الـ LTR لحقول التواريخ كما بملفك الأصلي */}
                        <div className="flex items-center gap-3" dir="ltr">
                            <input
                                type="text"
                                defaultValue="2023/07/01"
                                className="w-36 h-11 border border-[#bcd3ee] rounded-lg bg-[#edf6ff] text-[#1680b0] text-sm font-semibold text-center outline-none focus:border-[#0087a8]"
                            />
                            <span className="text-sm font-semibold text-slate-500">إلى</span>
                            <input
                                type="date"
                                className="w-36 h-11 border border-[#bcd3ee] rounded-lg bg-[#edf6ff] text-[#1680b0] text-sm font-semibold text-center outline-none focus:border-[#0087a8] cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* جدول المعاملات متجاوب */}
                    <div className="overflow-x-auto border border-[#e7edf6] rounded-t-xl mt-4">
                        <table className="w-full table-fixed min-w-[700px] border-collapse">
                            <thead>
                                <tr className="h-14 bg-[#edf4ff]">
                                    <th className="w-[20%] text-sm font-bold text-slate-700 text-center px-4">التاريخ</th>
                                    <th className="w-[40%] text-sm font-bold text-slate-700 text-center px-4">الطبيب/الخدمة</th>
                                    <th className="w-[15%] text-sm font-bold text-slate-700 text-center px-4">المبلغ</th>
                                    <th className="w-[15%] text-sm font-bold text-slate-700 text-center px-4">الحالة</th>
                                    <th className="w-[10%] text-sm font-bold text-slate-700 text-center px-4">الإجراءات</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((item) => (
                                    <tr key={item.id} className="border-b border-[#edf1f7] hover:bg-slate-50/50 transition-colors">
                                        {/* التاريخ */}
                                        <td className="px-4 py-5 text-center text-base font-bold text-[#0087a8] align-middle">
                                            {item.date}
                                        </td>

                                        {/* الطبيب / الخدمة */}
                                        <td className="px-4 py-5 align-middle">
                                            <div className="flex items-center justify-start gap-4 pr-6">
                                                <span className="w-12 h-12 rounded-full bg-[#dcecff] text-[#0087a8] grid place-items-center text-lg font-bold shrink-0 select-none">
                                                    {item.avatar}
                                                </span>
                                                <div className="text-right">
                                                    <strong className="block text-[#0087a8] text-base font-bold leading-normal">
                                                        {item.doctor}
                                                    </strong>
                                                    <small className="block text-gray-500 text-xs mt-0.5 font-medium">
                                                        {item.role}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* المبلغ */}
                                        <td className="px-4 py-5 text-center text-[17px] font-extrabold text-[#0087a8] align-middle">
                                            {item.amount}
                                        </td>

                                        {/* الحالة */}
                                        <td className="px-4 py-5 text-center align-middle">
                                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e7f5ee] text-[#0087a8] text-xs font-bold whitespace-nowrap">
                                                {item.status}
                                            </span>
                                        </td>

                                        {/* الإجراءات (تحميل) */}
                                        <td className="px-4 py-5 align-middle text-center">
                                            <div className="flex justify-center items-center">
                                                <svg
                                                    className="w-6 h-6 stroke-[#0087a8] stroke-[2.2] fill-none cursor-pointer hover:scale-115 transition-transform duration-200"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M5 17v4" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M19 17v4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* زر عرض المزيد */}
                    <div className="h-14 grid place-items-center bg-[#edf4ff] text-[#0087a8] text-base font-extrabold border border-[#e7edf6] border-top-0 cursor-pointer rounded-b-xl hover:bg-[#deecff] transition-colors duration-200">
                        عرض المزيد من المعاملات
                    </div>

                </section>
            </div>
        </div>
    );
};

export default FinancialTransactions;