import React from 'react'
import { useNavigate } from 'react-router-dom'

const PrivacyPolicy = () => {
    const navigate = useNavigate()

    // دالة التعامل مع زر العودة للرئيسية
    const handleBack = (e) => {
        e.preventDefault()
        // إذا كنت تفضل الانتقال لصفحة رئيسية محددة يمكنك كتابة navigate('/')
        // هنا قمنا بعمل نفس سلوك الكود القديم (العودة لآخر صفحة في التاريخ)
        window.history.length > 1 ? navigate(-1) : navigate('/')
    }

    // مصفوفة تحتوي على كروت السياسة لتسهيل صيانتها أو جلبها مستقبلاً من API
    const policies = [
        {
            id: 1,
            title: "1. البيانات التي نجمعها",
            desc: "نجمع البيانات التي تقدمها عند التسجيل والحجز مثل الاسم، البريد الإلكتروني، رقم الهاتف، والعنوان والجنس والدفع اللازمة لتشغيل الخدمة."
        },
        {
            id: 2,
            title: "2. استخدام البيانات",
            desc: "نستخدم بياناتك لتقديم خدمة الحجز، إدارة المواعيد، التواصل معك، وتحسين تجربة الاستخدام. لا نبيع بياناتك الشخصية لأطراف ثالثة لأغراض تسويقية."
        },
        {
            id: 3,
            title: "3. الحماية والأمان",
            desc: "نطبق إجراءات تقنية وإدارية مناسبة لحماية بياناتك من الوصول أو الاستخدام غير المصرح به."
        },
        {
            id: 4,
            title: "4. التواصل",
            desc: "لأي استفسار بخصوص الخصوصية يمكنك التواصل معنا عبر صفحة «تواصل معنا»."
        }
    ]

    return (
        <div className="min-h-screen bg-white text-[#1E293B] antialiased" dir="rtl">
            <main className="max-w-152.5 w-full mx-auto px-5 sm:px-0 py-10 md:py-11 pb-15">

                {/* صف زر العودة */}
                <div className="text-right sm:translate-x-5">
                    <a
                        href="/"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 flex-row-reverse text-[#4B5563] text-lg font-semibold leading-7 hover:text-[#1E293B] transition-colors duration-200"
                    >
                        <span className="text-right">العودة للرئيسية</span>

                        <span className="w-7 h-7 grid place-items-center rounded-lg bg-[#E8EDF5] text-[#64748B]">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M8 5L15 12L8 19"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </a>
                </div>

                <section>
                    {/* صف العنوان والقفل المحدث */}
                    <div className="mt-6 text-right sm:translate-x-5">
                        <div className="inline-flex items-center gap-3.5 flex-row-reverse">

                            <div className="w-full max-w-72.5 sm:max-w-none text-right">
                                <h1 className="m-0 text-[#1E293B] text-3xl sm:text-4xl font-bold leading-12">
                                    سياسة الخصوصية
                                </h1>
                                <p className="m-0 text-[#6B7280] text-sm sm:text-base font-semibold leading-7">
                                    آخر تحديث: 2026
                                </p>
                            </div>

                            {/* تم استبدال الصورة بأيقونة درع وقفل احترافية وبألوان متناسقة مع الهوية */}
                            <div className="w-13 h-13 sm:w-15 sm:h-15 flex-none grid place-items-center rounded-xl bg-cyan-50 text-cyan-600 shadow-xs">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    <rect x="9" y="11" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.2"/>
                                    <path d="M10 11V9a2 2 0 1 1 4 0v2"/>
                                </svg>
                            </div>

                        </div>
                    </div>

                    {/* شبكة كروت السياسة الشروط */}
                    <div className="w-full mt-7 grid gap-4">
                        {policies.map((policy) => (
                            <article
                                key={policy.id}
                                className="min-h-30 last:min-h-26 sm:last:min-h-auto p-4 sm:p-5 border border-[#F3F4F6] rounded-xl bg-white shadow-xs"
                            >
                                <h2 className="m-0 text-[#1E293B] text-base sm:text-lg font-bold leading-7 text-right">
                                    {policy.title}
                                </h2>
                                <p className="m-0 mt-1.5 text-[#6B7280] text-[11.5px] sm:text-xs font-medium leading-5 sm:leading-6 text-right">
                                    {policy.desc}
                                </p>
                            </article>
                        ))}
                    </div>

                </section>
            </main>
        </div>
    )
}

export default PrivacyPolicy