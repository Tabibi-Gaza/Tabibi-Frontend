import React, { useContext, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'

const Doctors = () => {
    const { speciality } = useParams()
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)
    
    const [searchQuery, setSearchQuery] = useState('')
    
    // جعل الحالة الافتراضية false لتكون الفلاتر مخفية حتى يضغط المستخدم على الزر
    const [showFilter, setShowFilter] = useState(false)
    
    // 1. حالة الصفحة الحالية
    const [currentPage, setCurrentPage] = useState(1)
    const doctorsPerPage = 6 // 2 في العرض × 3 في الطول

    // قاموس ترجمة وتطابق التخصصات مع النظام وقاعدة البيانات
    const specialityLabels = {
        'General physician': 'طبيب عام',
        'Gynecologist': 'أخصائية نساء وتوليد',
        'Dermatologist': 'أخصائي جلدية وتجميل',
        'Pediatricians': 'أخصائي أطفال',
        'Neurologist': 'مخ وأعصاب',
        'Gastroenterologist': 'جهاز هضمي',
        'Cardiology': 'أخصائي قلب وأوعية دموية',
        'Ophthalmology': 'أخصائي عيون'
    }

    // 2. تصفية الأطباء بناءً على التخصص المختار + نص البحث المدخل
    const filterDoc = useMemo(() => {
        let result = doctors;
        if (speciality) {
            result = result.filter(doc => doc.speciality === speciality);
        }
        if (searchQuery.trim() !== '') {
            result = result.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return result;
    }, [doctors, speciality, searchQuery])

    // 3. حسابات الـ Pagination الرياضية وحل مشكلة الـ ESLint ذكياً
    const totalPages = Math.ceil(filterDoc.length / doctorsPerPage)
    
    // حماية تفاعلية: إذا قل عدد العناصر بسبب البحث، نرجع تلقائياً للصفحة الأولى
    const activePage = currentPage > totalPages ? 1 : currentPage;
    
    const displayedDoctors = useMemo(() => {
        const indexOfLastDoctor = activePage * doctorsPerPage
        const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
        return filterDoc.slice(indexOfFirstDoctor, indexOfLastDoctor)
    }, [filterDoc, activePage])

    return (
        <div className="px-4 sm:px-6 lg:px-8 my-8 text-gray-800 font-['Cairo']" dir="rtl">
            
            {/* الجزء العلوي */}
            <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-black text-[#0c2340]">احجز موعدك مع أفضل الأطباء</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-bold">أكثر من {filterDoc.length} طبيب متاح لمساعدتك.</p>
            </div>

            {/* شريط البحث المطور */}
            <div className="max-w-xl mx-auto mb-6 space-y-4">
                <div className="flex items-center gap-2 justify-end text-xs font-bold text-[#3a96b7] cursor-pointer hover:underline mb-1">
                    <span>البحث عن طبيب</span>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="ابحث عن طبيب ..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent outline-none shadow-xs text-right"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    </div>
                    {/* زر التحكم في إظهار وإخفاء التخصصات */}
                    <button 
                        onClick={() => setShowFilter(!showFilter)}
                        className={`p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                            showFilter ? 'bg-[#2c7792] text-white' : 'bg-[#3a96b7] text-white hover:bg-[#2c7792]'
                        }`}
                        title="إظهار/إخفاء التخصصات"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h8" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* أزرار التصفية السريعة (Badges) العلوية - تظهر وتختفي ديناميكياً مع إضافة تأثير أنيميشن خفيف */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showFilter ? 'max-h-40 opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0 pointer-events-none'
            }`}>
                <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto pb-2">
                    <button 
                        onClick={() => navigate('/doctors')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${!speciality ? 'bg-[#3a96b7] text-white' : 'bg-gray-200/70 text-gray-700 hover:bg-gray-200'}`}
                    >
                        الكل
                    </button>
                    {Object.entries(specialityLabels).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => speciality === key ? navigate('/doctors') : navigate(`/doctors/${key}`)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${speciality === key ? 'bg-[#3a96b7] text-white' : 'bg-gray-200/70 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* شبكة عرض الأطباء المحسنة: قطعتين في العرض md:grid-cols-2 */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-gray-200">
                {displayedDoctors.length > 0 ? (
                    displayedDoctors.map((item, index) => (
                        <div 
                            key={index}
                            className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col relative"
                        >
                            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 text-[10px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse"></span>
                                <span>متاح اليوم</span>
                            </div>

                            <div className="bg-gray-50/50 h-52 w-full flex items-center justify-center relative border-b border-gray-100">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-full object-contain object-bottom pt-2"
                                />
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between text-right bg-white relative">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-gray-900 font-black text-sm">{item.name}</h3>
                                        <div className="flex items-center gap-0.5 text-[10px] text-gray-500 font-bold">
                                            <span>{item.rating || '4.8'}</span>
                                            <span className="text-amber-500 text-xs">★</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[#3a96b7] font-bold text-xs">{specialityLabels[item.speciality] || item.speciality}</p>
                                    
                                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 pt-2 pb-1 text-[11px] text-gray-500 font-bold border-b border-gray-50">
                                        <div className="flex items-center gap-1 justify-start">
                                            <span>🕒</span>
                                            <span>{item.experience || '8 سنة خبرة'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 justify-end truncate">
                                            <span>📍</span>
                                            <span>{item.address?.line1 || 'غزة، الرمال'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 mt-2">
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-bold leading-none">كشفية</p>
                                        <p className="text-xs font-black text-[#3a96b7] mt-0.5">{item.fees || '50'} ILS</p>
                                    </div>
                                    <button 
                                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0,0); }}
                                        className="bg-[#3a96b7] hover:bg-[#2c7792] text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                                    >
                                        احجز الآن
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                        <span className="text-3xl">🔍</span>
                        <h3 className="text-gray-800 font-black text-sm">عذراً، لا يوجد نتائج مطابقة للبحث</h3>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">يرجى التحقق من نص البحث أو اختيار تخصص طبي آخر.</p>
                        <button onClick={() => { setSearchQuery(''); navigate('/doctors'); }} className="mt-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold text-xs transition-all">إعادة تعيين الفلاتر</button>
                    </div>
                )}
            </div>

            {/* نظام الـ Pagination الديناميكي والمصلح */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-10 text-xs font-bold text-gray-500 select-none">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={activePage === 1}
                        className={`p-1 px-2 rounded-md transition-all ${activePage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
                    >
                        ‹
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => { setCurrentPage(pageNumber); window.scrollTo(0, 300); }}
                                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                                    activePage === pageNumber 
                                    ? 'bg-[#3a96b7] text-white shadow-xs font-black' 
                                    : 'hover:bg-gray-100 text-gray-500'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        )
                    })}

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={activePage === totalPages}
                        className={`p-1 px-2 rounded-md transition-all ${activePage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
                    >
                        ›
                    </button>
                </div>
            )}

        </div>
    )
}

export default Doctors;