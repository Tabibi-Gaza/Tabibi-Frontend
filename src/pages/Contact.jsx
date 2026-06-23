import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faHouseMedicalCircleCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
    // حالة (State) لإدارة بيانات النموذج
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] font-['Cairo']" style={{ direction: 'rtl' }}>
            <div className="w-[85%] mx-auto">
                <div className="bg-[#F8FAFC] py-10 px-7.5 mt-0">

                    {/* ===== Heading ===== */}
                    <div className="mb-12.5">
                        <div className="flex gap-5 items-center mb-3.75">
                            <div className="w-7.5 h-7.5 bg-[#E5E7EB] rounded-[5px] flex justify-center items-center cursor-pointer">
                                <FontAwesomeIcon icon={faArrowRight} className="text-[#1F2937] text-[20px] bg-zinc-200 rounded p-1" />
                            </div>
                            <h1 className="text-[#1F2937] font-bold text-[28px]">تواصل معنا</h1>
                        </div>
                        <p className="text-[#6B7280] text-[14px] leading-[1.9] max-w-175 mt-3.75">
                            نحن هنا لمساعدتك و الإجابة على جميع استفساراتك. تواصل معنا
                            باستخدام معلومات الاتصال المتاحة أو عبر النموذج أدناه.
                        </p>
                    </div>

                    {/* ===== Contact Cards ===== */}
                    <div className="flex flex-col md:flex-row justify-between gap-5 mb-9">
                        {/* Card 1 */}
                        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-[10px] p-5.5 text-center">
                            <div className="w-15 h-15 flex items-center justify-center mx-auto mb-3.75 rounded-full bg-[#E8F4F8] border border-[#D5EAF0]">
                                <FontAwesomeIcon icon={faEnvelope} className="text-[#138C9F] text-[22px]" />
                            </div>
                            <h2 className="text-[15px] font-bold text-[#1F2937] mb-1.5">البريد الإلكتروني</h2>
                            <p className="text-[#6B7280] text-[13px]">
                                <a href="mailto:info@tabibi.com" className="text-[#0057C2] hover:underline">info@tabibi.com</a>
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-[10px] p-5.5 text-center">
                            <div className="w-15 h-15 flex items-center justify-center mx-auto mb-3.75 rounded-full bg-[#E8F4F8] border border-[#D5EAF0]">
                                <FontAwesomeIcon icon={faLocationDot} className="text-[#138C9F] text-[22px]" />
                            </div>
                            <h2 className="text-[15px] font-bold text-[#1F2937] mb-1.5">العنوان</h2>
                            <p className="text-[#6B7280] text-[13px]">غزة - فلسطين</p>
                        </div>

                        {/* Card 3 */}
                        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-[10px] p-5.5 text-center">
                            <div className="w-15 h-15 flex items-center justify-center mx-auto mb-3.75 rounded-full bg-[#E8F4F8] border border-[#D5EAF0]">
                                <FontAwesomeIcon icon={faPhone} className="text-[#138C9F] text-[22px]" />
                            </div>
                            <h2 className="text-[15px] font-bold text-[#1F2937] mb-1.5">الهاتف</h2>
                            <p className="text-[#6B7280] text-[13px]">
                                <a href="tel:+97059235598" className="text-[#0057C2] hover:underline">97059235598+</a>
                            </p>
                        </div>
                    </div>

                    {/* ===== Contact Web Section ===== */}
                    <div className="w-full md:w-[80%] mx-auto flex flex-col md:flex-row gap-6.25 items-stretch bg-white border border-[#E5E7EB] rounded-xl p-6.25">

                        {/* Form */}
                        <div className="flex-1 bg-transparent border-none">
                            <h2 className="text-[20px] font-bold text-[#1F2937] mb-1.25">أرسل لنا رسالة</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3.75">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="الاسم الكامل"
                                    className="w-full p-3 border border-[#D1D5DB] rounded-md bg-white outline-none focus:border-[#0057C2] transition-colors"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="البريد الإلكتروني"
                                    className="w-full p-3 border border-[#D1D5DB] rounded-md bg-white outline-none focus:border-[#0057C2] transition-colors"
                                    required
                                />
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="الموضوع"
                                    className="w-full p-3 border border-[#D1D5DB] rounded-md bg-white outline-none focus:border-[#0057C2] transition-colors"
                                    required
                                />
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="اكتب رسالتك هنا"
                                    className="w-full p-3 border border-[#D1D5DB] rounded-md bg-white outline-none focus:border-[#0057C2] transition-colors resize-none h-30"
                                    required
                                ></textarea>

                                <button
                                    type="submit"
                                    className="w-full border-none cursor-pointer bg-[#0057C2] text-white p-3 rounded-md() text-[14px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,87,194,0.25)]"
                                >
                                    إرسال الرسالة
                                </button>
                            </form>
                        </div>

                        {/* Support Box */}
                        <div className="flex-1 bg-[#EEF5FF] rounded-[10px] p-6.25 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-62.5">
                            {/* الدوائر الخلفية */}
                            <div className="absolute w-45 h-45 rounded-full bg-[#E5EEFF] -top-22.5 -left-22.5 z-0"></div>
                            <div className="absolute w-45 h-45 rounded-full bg-[#E5EEFF] -bottom-17.5 -right-17.5 z-0"></div>

                            {/* المحتوى */}
                            <div className="relative z-10">
                                <div className="w-17.5 h-17.5 mx-auto mb-3.75 rounded-full bg-[#D9E9FF] flex items-center justify-center">
                                    <FontAwesomeIcon icon={faHouseMedicalCircleCheck} className="text-[26px] text-[#138C9F]" />
                                </div>
                                <h3 className="mb-2.5 font-bold text-[#1F2937] text-[18px]">دعم متكامل</h3>
                                <p className="text-[#6B7280] leading-[1.8] text-[14px]">
                                    فريق الدعم لدينا جاهز لمساعدتك والإجابة على استفساراتك في أي وقت.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
};

export default Contact;