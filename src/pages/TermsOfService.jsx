import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();

    // بيانات شروط الاستخدام
    const termsData = [
        {
            id: 1,
            title: "1. القبول",
            content: "باستخدامك منصة طبيبي فإنك توافق على هذه الشروط والأحكام. إن كنت لا توافق عليها، يرجى عدم استخدام الخدمة. نحتفظ بحق تعديل هذه الشروط في أي وقت، ويعتبر استمرارك في استخدام المنصة بعد التعديل موافقة منك على النسخة المحدثة."
        },
        {
            id: 2,
            title: "2. وصف الخدمة",
            content: "توفر منصة طبيبي وسيلة إلكترونية لحجز المواعيد الطبية وإدارتها والتواصل بين المرضى والأطباء المسجلين. العلاقة العلاجية هي بين المريض والطبيب المعالج، والمنصة تعمل كوسيط تنظيمي فقط ولا تقدم أي استشارات أو تشخيصات طبية."
        },
        {
            id: 3,
            title: "3. خصوصية البيانات الطبية",
            content: "نلتزم بحماية بياناتك الطبية والشخصية وفقاً لقوانين حماية البيانات المعمول بها. لا نقوم بمشاركة معلوماتك الطبية مع أي طرف ثالث دون موافقتك الصريحة، إلا إذا تطلب الأمر ذلك قانوناً. جميع البيانات مشفرة ومحفوظة بشكل آمن."
        },
        {
            id: 4,
            title: "4. تنبيه طبي",
            content: "منصة طبيبي أداة تنظيمية فقط ولا تحل محل الاستشارة الطبية المتخصصة. المعلومات المتوفرة على المنصة هي لأغراض عامة فقط ولا يجب الاعتماد عليها كنصيحة طبية. يُنصح دائماً باستشارة طبيب مختص للحصول على تشخيص وعلاج مناسب لحالتك."
        },
        {
            id: 5,
            title: "5. التزامات المستخدم",
            content: "يلتزم المستخدم بتقديم معلومات دقيقة ومحدثة عند التسجيل وحجز المواعيد. يُمنع استخدام المنصة لأي غرض غير قانوني أو مخالف للآداب العامة. كما يلتزم المستخدم بحماية حسابه وكلمة المرور وعدم مشاركتها مع أي شخص آخر."
        },
        {
            id: 6,
            title: "6. إلغاء وتعديل المواعيد",
            content: "يمكن للمستخدم إلغاء أو تعديل مواعيده وفقاً لسياسة الإلغاء المحددة لكل طبيب. يُنصح بالإلغاء قبل موعد الحجز بوقت كافٍ لتجنب أي رسوم إلغاء قد يحددها الطبيب المعالج."
        },
        {
            id: 7,
            title: "7. المحادثات والتواصل",
            content: "المحادثات بين المرضى والأطباء عبر المنصة سرية ومحمية. يُمنع استخدام المحادثات لإرسال محتوى مخالف أو مضايقة أي طرف. تحتفظ المنصة بحق حذف أي محتوى يخالف هذه الشروط."
        },
        {
            id: 8,
            title: "8. المسؤولية",
            content: "المنصة تسعى لتوفير خدمة مستقرة وآمنة دون ضمان عدم حدوث أخطاء أو انقطاع. لا تتحمل المنصة المسؤولية عن أي أضرار غير مباشرة قد تنشأ عن استخدام الخدمة أو عدم القدرة على الوصول إليها."
        }
    ];

    return (
        <div className="min-h-screen bg-white font-['Cairo'] antialiased text-[#1e293b] pb-16" dir="rtl">
            <main className="max-w-[935px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12 bg-white">

                {/* زر العودة للرئيسية */}
                <div className="flex justify-end mb-10">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 h-6 text-[#64748b] text-base font-extrabold cursor-pointer hover:text-[#1e293b] transition-colors duration-200"
                    >
                        <span>العودة للرئيسية</span>
                        <span className="w-6 h-6 rounded-lg bg-[#e8edf5] flex items-center justify-center text-[#64748b]">
                            <svg className="w-3.75 h-3.75" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* الهيدر الرئيسي */}
                <div className="flex items-center justify-end gap-4 mb-10 text-right pr-2 sm:pr-6">
                    <div className="flex flex-col items-end">
                        <h1 className="m-0 text-[#1e293b] text-3xl sm:text-4xl font-extrabold leading-10 tracking-wide">
                            شروط الاستخدام
                        </h1>
                        <p className="m-0 text-[#64748b] text-base font-semibold leading-7.5 mt-1">
                            آخر تحديث: <span className="font-mono">2026</span>
                        </p>
                    </div>
                    {/* أيقونة الورقة الخضراء الجانبية */}
                    <div className="w-14 h-11 bg-[#A1DBB2] rounded-md shadow-xs transform rotate-2 shrink-0 relative">
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-200 transform -rotate-45 origin-bottom-left"></div>
                    </div>
                </div>

                {/* قائمة الشروط والبنود */}
                <section className="w-full max-w-[786px] mx-auto space-y-5 mb-14">
                    {termsData.map((term) => (
                        <div
                            key={term.id}
                            className="terms-card w-full p-6 sm:p-8 bg-white border border-[#f3f4f6] rounded-2xl shadow-xs hover:shadow-xs transition-all duration-200"
                        >
                            <div className="w-full flex items-center justify-between mb-3">
                                <h2 className="text-xl font-extrabold text-[#1e293b]">
                                    {term.title}
                                </h2>
                                <span className="w-9 h-9 rounded-xl bg-[#F0FDFA] flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-[#138C9F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </div>
                            
                            <p className="w-full text-[#64748b] text-base font-semibold leading-8">
                                {term.content}
                            </p>
                        </div>
                    ))}
                </section>

                {/* بنر تواصل معنا السفلي */}
                <section className="w-full max-w-[786px] mx-auto p-6 sm:p-10 rounded-2xl bg-[#318CA9] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    {/* زر التواصل */}
                    <button
                        onClick={() => navigate('/contact')}
                        type="button"
                        className="w-full md:w-auto px-10 h-13 rounded-xl bg-white text-[#318CA9] text-base font-extrabold shadow-xs hover:bg-slate-50 active:scale-[0.99] transition-all duration-200 cursor-pointer whitespace-nowrap order-2 md:order-1"
                    >
                        تواصل معنا
                    </button>

                    {/* النصوص */}
                    <div className="text-center md:text-right order-1 md:order-2">
                        <h2 className="m-0 text-white text-2xl sm:text-3xl font-extrabold leading-10 mb-2">
                            هل لديك استفسار حول الشروط؟
                        </h2>
                        <p className="m-0 text-cyan-50/90 text-sm sm:text-base font-semibold leading-7">
                            فريقنا القانوني متاح لمساعدتك في فهم حقوقك والتزاماتك.
                        </p>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default TermsOfService;