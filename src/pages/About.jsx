import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faLock, faUsers, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const About = () => {
    return (
        <main className="min-h-screen bg-[#F8FAFC] font-['Cairo']" style={{ direction: 'rtl' }}>
            <div className="w-[85%] mx-auto">
                <div className="bg-[#F8FAFC] py-10 px-7.5 mt-0">

                    {/* ===== Heading ===== */}
                    <div className="mb-12.5">
                        <div className="flex gap-5 items-center mb-3.75">
                            <div className="w-7.5 h-7.5 bg-[#F8FAFC] rounded-[5px] flex justify-center items-center cursor-pointer mt-3.75">
                                <FontAwesomeIcon icon={faArrowRight} className="text-[#1F2937] text-[20px] bg-zinc-200 rounded p-2" />
                            </div>
                            <h1 className="text-[#1F2937] text-[28px] font-bold mt-2.5">من نحن</h1>
                        </div>
                        <p className="text-[#6B7280] text-[14px] leading-[1.9] max-w-175 mt-3.75">
                            منصة{' '}
                            <a href="#" className="text-[#138C9F] font-extrabold hover:underline">طبيبي</a>{' '}
                            هي الحل الرقمي المتكامل لتسهيل حجز المواعيد الطبية في فلسطين وتحديداً في قطاع غزة. نسعى لربط المرضى بالأطباء بكفاءة عالية لتوفير تجربة صحية سهلة.
                        </p>
                    </div>

                    {/* ===== Features Section ===== */}
                    <div className="mt-16.25">
                        <ul className="p-5 my-5 mx-0 flex flex-col md:flex-col gap-5">

                            {/* Feature Card 1 */}
                            <li className="bg-white border border-[#E2E8F0] rounded-[18px] p-6.25 flex gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
                                {/* دائرية الأيقونة مع الحلقة الرمادية المحيطة بها */}
                                <div className="relative w-15.5 h-15.5 min-w-15.5 rounded-full bg-[#EFF6FF] flex justify-center items-center">
                                    <div className="absolute w-19.5 h-19.5 rounded-full border border-[#E2E8F0] z-0"></div>
                                    <FontAwesomeIcon icon={faHeart} className="text-[#138C9F] text-[20px] relative z-10" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-[20px] font-bold mb-2.5">
                                        <a href="#" className="text-[#138C9F] font-extrabold hover:underline">رعاية صحية أسهل</a>
                                    </h2>
                                    <p className="text-[#64748B] text-[15px] leading-[1.8]">احجز موعدك مع الطبيب المناسب في دقائق معدودة وبكل يسر.</p>
                                </div>
                            </li>

                            {/* Feature Card 2 */}
                            <li className="bg-white border border-[#E2E8F0] rounded-[18px] p-6.25 flex gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
                                <div className="relative w-15.5 h-15.5 min-w-15.5 rounded-full bg-[#EFF6FF] flex justify-center items-center">
                                    <div className="absolute w-19.5 h-19.5 rounded-full border border-[#E2E8F0] z-0"></div>
                                    <FontAwesomeIcon icon={faLock} className="text-[#138C9F] text-[20px] relative z-10" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-[20px] font-bold mb-2.5">
                                        <a href="#" className="text-[#138C9F] font-extrabold hover:underline">حماية البيانات</a>
                                    </h2>
                                    <p className="text-[#64748B] text-[15px] leading-[1.8]">نلتزم بحماية خصوصية بياناتك وتطبيق أعلى معايير الأمان الرقمي.</p>
                                </div>
                            </li>

                            {/* Feature Card 3 */}
                            <li className="bg-white border border-[#E2E8F0] rounded-[18px] p-6.25 flex gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
                                <div className="relative w-15.5 h-15.5 min-w-15.5 rounded-full bg-[#EFF6FF] flex justify-center items-center">
                                    <div className="absolute w-19.5 h-19.5 rounded-full border border-[#E2E8F0] z-0"></div>
                                    <FontAwesomeIcon icon={faUsers} className="text-[#138C9F] text-[20px] relative z-10" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-[20px] font-bold mb-2.5">
                                        <a href="#" className="text-[#138C9F] font-extrabold hover:underline">نخبة من الأطباء</a>
                                    </h2>
                                    <p className="text-[#64748B] text-[15px] leading-[1.8]">شبكة واسعة من الأخصائيين المعتمدين في مختلف التخصصات الطبية.</p>
                                </div>
                            </li>

                            {/* Feature Card 4 */}
                            <li className="bg-white border border-[#E2E8F0] rounded-[18px] p-6.25 flex gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
                                <div className="relative w-15.5 h-15.5 min-w-15.5 rounded-full bg-[#EFF6FF] flex justify-center items-center">
                                    <div className="absolute w-19.5 h-19.5 rounded-full border border-[#E2E8F0] z-0"></div>
                                    <FontAwesomeIcon icon={faClock} className="text-[#138C9F] text-[20px] relative z-10" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-[20px] font-bold mb-2.5">
                                        <a href="#" className="text-[#138C9F] font-extrabold hover:underline">مواعيد مرنة</a>
                                    </h2>
                                    <p className="text-[#64748B] text-[15px] leading-[1.8]">اختر الوقت واليوم المناسب لجدولك الشخصي بكل مرونة.</p>
                                </div>
                            </li>

                        </ul>
                    </div>

                    {/* ===== Action Buttons ===== */}
                    <div className="flex flex-col sm:flex-row justify-start gap-3 mt-8.75 mb-11.25 mr-0 md:mr-7.5">
                        <a href="#" className="inline-flex items-center justify-center h-10.5 padding-[0_22px] px-5.5 bg-[#138C9F] color-white text-white rounded-lg text-[14px] font-bold border border-[#138C9F] transition-transform duration-300 hover:-translate-y-0.5">
                            تصفح الأطباء
                        </a>
                        <a href="#" className="inline-flex items-center justify-center h-10.5 padding-[0_22px] px-5.5 bg-white text-[#138C9F] rounded-lg text-[14px] font-bold border border-[#138C9F] transition-transform duration-300 hover:-translate-y-0.5">
                            تواصل معنا
                        </a>
                    </div>

                    {/* ===== Statistics Section ===== */}
                    <div className="mt-8.75 bg-[#2563EB] rounded-[20px] padding-[38px_25px] py-9.5 px-6.25 grid grid-cols-2 md:grid-cols-4 gap-7.5 md:gap-0 text-center">
                        <div className="flex flex-col items-center">
                            <h2 className="text-white text-[34px] font-bold mb-2.5">+12</h2>
                            <p className="text-[rgba(255,255,255,0.9)] text-[15px]">طبيب متخصص</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <h2 className="text-white text-[34px] font-bold mb-2.5">1k+</h2>
                            <p className="text-[rgba(255,255,255,0.9)] text-[15px]">مريض مسجل</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <h2 className="text-white text-[34px] font-bold mb-2.5">12+</h2>
                            <p className="text-[rgba(255,255,255,0.9)] text-[15px]">عيادة طبية</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <h2 className="text-white text-[34px] font-bold mb-2.5">24/7</h2>
                            <p className="text-[rgba(255,255,255,0.9)] text-[15px]">دعم فني</p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default About;