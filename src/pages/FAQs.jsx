import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FAQs = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')

    // مصفوفة الأسئلة الشائعة لسهولة البحث والتحكم
    const faqData = [
        {
            id: 1,
            question: "كيف أقوم بحجز موعد؟",
            answer: "اختر الطبيب المناسب ثم حدد التاريخ والوقت المتاحين وأرسل طلب الحجز.",
            icon: (
                <svg className="w-5 h-5 stroke-[#138C9F]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            )
        },
        {
            id: 2,
            question: "هل يمكنني إلغاء الموعد؟",
            answer: "نعم، يمكنك إلغاء الموعد من صفحة حجوزاتي قبل وقت الموعد.",
            icon: (
                <svg className="w-5 h-5 stroke-[#138C9F]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            )
        },
        {
            id: 3,
            question: "هل بياناتي الطبية آمنة؟",
            answer: "نعم، يتم التعامل مع بياناتك الطبية بسرية وحمايتها داخل المنصة.",
            icon: (
                <svg className="w-5 h-5 stroke-[#138C9F]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            )
        },
        {
            id: 4,
            question: "كيف أحصل على الدعم؟",
            answer: "اضغط على زر تواصل معنا وأرسل استفسارك لفريق الدعم.",
            icon: (
                <svg className="w-5 h-5 stroke-[#138C9F]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M12 7a1.5 1.5 0 0 1 1.5 1.5c0 .72-.38 1.12-.87 1.45-.49.34-.63.63-.63 1.05"></path>
                    <line x1="12" y1="14" x2="12.01" y2="14"></line>
                </svg>
            )
        }
    ]

    // تصفية الأسئلة بناءً على مدخلات البحث
    const filteredFaqs = faqData.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-white font-['Cairo'] antialiased text-[#1e293b]" dir="rtl">
            <main className="max-w-233.75 w-full mx-auto px-4 sm:px-6 py-8 md:py-12 bg-white pb-10">

                {/* زر العودة للرئيسية */}
                <div className="flex justify-start mb-10">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 h-6 text-[#64748b] text-base font-extrabold cursor-pointer hover:text-[#1e293b] transition-colors duration-200"
                    >
                        <span className="w-6 h-6 rounded-lg bg-[#e8edf5] flex items-center justify-center text-[#64748b]">
                            <svg className="w-3.75 h-3.75" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span>العودة للرئيسية</span>
                    </button>
                </div>

                {/* الهيدر (العنوان والشعار) */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 text-center sm:text-right sm:pr-8">
                    <div className="grid place-items-center w-17.5 h-17.5 border border-dashed stroke-2 border-[#5aef82] rounded-full bg-linear-to-b from-[rgba(240,253,250,0.5)] to-transparent shadow-md">
                        {/* ضع هنا مسار الصورة الصحيح أو اترك التاج البديل */}
                        <img className="w-12.5 h-12.5 object-contain" src="870c5ef9b10a7de6a3b826b3c6e38dc490efaeae.png" alt="علامة استفهام" />
                    </div>

                    <div className="flex flex-col">
                        <h1 className="m-0 text-[#1e293b] text-2xl sm:text-3xl font-extrabold leading-10 tracking-wide">
                            الأسئلة الشائعة
                        </h1>
                        <p className="m-0 text-[#64748b] text-base font-semibold leading-7.5">
                            إجابات عن الاستفسارات الأكثر تكراراً
                        </p>
                    </div>
                </div>

                {/* لوحة الأسئلة والبحث */}
                <section className="w-full max-w-196.5 mx-auto mb-12">
                    {/* حقل البحث الفوري */}
                    <div className="flex items-center gap-3 w-full h-16 px-5 mb-4 border border-[#f3f4f6] rounded-xl bg-white shadow-xs focus-within:border-[#c7e6f3] transition-all duration-200">
                        <input
                            type="search"
                            placeholder="ابحث عن سؤالك هنا..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full border-0 outline-hidden bg-transparent text-sm font-semibold text-right placeholder-[#94a3b8]"
                        />
                        <svg className="w-5 h-5 text-[#94a3b8] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="6"></circle>
                            <path d="m20 20-4.2-4.2"></path>
                        </svg>
                    </div>

                    {/* قائمة الأسئلة المطاطية (Accordion) */}
                    <div className="grid gap-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq) => (
                                <details
                                    key={faq.id}
                                    className="group overflow-hidden border border-[#f3f4f6] open:border-[#c7e6f3] rounded-xl bg-white shadow-xs transition-all duration-200"
                                >
                                    <summary className="relative flex items-center w-full h-16 cursor-pointer list-none select-none pr-20 pl-14 text-right">
                                        <span className="absolute top-2 right-4 grid place-items-center w-12 h-12 rounded-xl bg-[#F0FDFA]">
                                            {faq.icon}
                                        </span>
                                        <span className="text-[#1e293b] text-base font-semibold">
                                            {faq.question}
                                        </span>
                                        <span className="absolute top-5.5 left-4.5 w-5 h-5 grid place-items-center transition-transform duration-200 group-open:rotate-180">
                                            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                                                <path d="M6 9L12 15L18 9" stroke="#138C9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="text-[#64748b] text-sm font-semibold leading-7">
                                        <p className="m-0 pr-20 pl-6 pb-4.5 text-right">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </details>
                            ))
                        ) : (
                            <p className="text-center text-[#64748b] py-6">لا توجد نتائج تطابق بحثك.</p>
                        )}
                    </div>
                </section>

                {/* قسم الدعم والمساعدة الإضافية */}
                <section className="w-full max-w-211.5 mx-auto p-6 sm:p-10 rounded-2xl bg-linear-to-r from-[#fafdfd] via-[#f3f8f8] to-[#eaf2f2] border border-[#edf3f7] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    <div className="flex-1 text-center md:text-right order-2 md:order-1">
                        <h2 className="m-0 text-[#1e293b] text-2xl sm:text-3xl font-extrabold leading-10 mb-2">
                            لا زلت بحاجة للمساعدة؟
                        </h2>
                        <p className="m-0 text-[#64748b] text-sm sm:text-base font-semibold leading-7 mb-6 max-w-139.5">
                            فريق الخبراء لدينا جاهز لمساعدتك في أي استفسار تقني أو طبي. لا تتردد في مراسلتنا وسنقوم بالرد عليك في أسرع وقت ممكن.
                        </p>
                        <button
                            type="button"
                            className="w-full sm:w-88.25 h-13 rounded-xl bg-[#0c65a9] text-white text-base font-extrabold shadow-md hover:bg-[#0a548c] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                            تواصل معنا
                        </button>
                    </div>

                    <div className="w-30 h-30 rounded-full bg-[#ddeeff] flex items-center justify-center flex-none order-1 md:order-2 animate-pulse-slow">
                        <svg className="w-20.5 h-20.5" viewBox="0 0 192 192" fill="none">
                            <path d="M93 123V117H117V95.7C117 89.85 114.963 84.8875 110.888 80.8125C106.812 76.7375 101.85 74.7 96 74.7C90.15 74.7 85.1875 76.7375 81.1125 80.8125C77.0375 84.8875 75 89.85 75 95.7V114H72C70.35 114 68.9375 113.412 67.7625 112.237C66.5875 111.062 66 109.65 66 108V102C66 100.95 66.2625 99.9625 66.7875 99.0375C67.3125 98.1125 68.05 97.375 69 96.825L69.225 92.85C69.625 89.45 70.6125 86.3 72.1875 83.4C73.7625 80.5 75.7375 77.975 78.1125 75.825C80.4875 73.675 83.2125 72 86.2875 70.8C89.3625 69.6 92.6 69 96 69C99.4 69 102.625 69.6 105.675 70.8C108.725 72 111.45 73.6625 113.85 75.7875C116.25 77.9125 118.225 80.425 119.775 83.325C121.325 86.225 122.325 89.375 122.775 92.775L123 96.675C123.95 97.125 124.688 97.8 125.213 98.7C125.738 99.6 126 100.55 126 101.55V108.45C126 109.45 125.738 110.4 125.213 111.3C124.688 112.2 123.95 112.875 123 113.325V117C123 118.65 122.412 120.062 121.237 121.237C120.062 122.412 118.65 123 117 123H93ZM87 102C86.15 102 85.4375 101.713 84.8625 101.138C84.2875 100.562 84 99.85 84 99C84 98.15 84.2875 17.4375 84.8625 96.8625C85.4375 96.2875 86.15 96 87 96C87.85 96 88.5625 96.2875 89.1375 96.8625C89.7125 97.4375 90 98.15 90 99C90 99.85 89.7125 100.562 89.1375 101.138C88.5625 101.713 87.85 102 87 102ZM105 102C104.15 102 103.438 101.713 102.862 101.138C102.287 100.562 102 99.85 102 99C102 98.15 102.2875 97.4375 102.862 96.8625C103.438 96.2875 104.15 96 105 96C105.85 96 106.562 96.2875 107.138 96.8625C107.713 97.4375 108 98.15 108 99C108 99.85 107.713 100.562 107.138 101.138C106.562 101.713 105.85 102 105 102ZM78.075 97.35C77.725 92.05 79.325 87.5 82.875 83.7C86.425 79.9 90.85 78 96.15 78C100.6 78 104.513 79.4125 107.888 82.2375C111.263 85.0625 113.3 88.675 114 93.075C109.45 93.025 105.263 91.8 101.438 89.4C97.6125 87 94.675 83.75 92.625 79.65C91.825 83.65 90.1375 87.2125 87.5625 90.3375C84.9875 93.4625 81.825 95.8 78.075 97.35Z" fill="#0C65A9" />
                        </svg>
                    </div>
                </section>

            </main>
        </div>
    )
}

export default FAQs