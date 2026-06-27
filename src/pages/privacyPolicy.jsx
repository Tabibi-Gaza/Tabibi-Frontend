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
        <div className="min-h-screen bg-white text-[#1E293B] font-['Cairo'] antialiased" dir="rtl">
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
                    {/* صف العنوان والقفل */}
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

                            <img
                                className="w-13 h-13 sm:w-15 sm:h-15 flex-none object-contain"
                                alt="قفل الخصوصية"
                                src="data:image/png;base64,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"
                            />
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