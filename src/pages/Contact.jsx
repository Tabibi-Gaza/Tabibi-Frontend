import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHouseMedicalCircleCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import { useTranslation } from 'react-i18next';


const Contact = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const contactInfo = { email: 'tabibi.gaza1@gmail.com', whatsapp: '972597081983' };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/contact', {
                fullName: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });
            if (data.succeeded) {
                toast.success('تم إرسال رسالتك بنجاح');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.errors?.[0]?.message || 'فشل الإرسال');
            }
        } catch {
            toast.error('حدث خطأ أثناء الإرسال');
        } finally {
            setLoading(false);
        }
    };

    return (
      <main
        className="min-h-screen pt-30 font-['Cairo'] dark:bg-gray-900 dark:text-gray-200"
        style={{ direction: "rtl" }}
      >
        <div className="w-full max-w-[85%] mx-auto px-4">
          <div className="py-10 px-7.5 mt-0">
            {/* ===== Heading ===== */}
            <div className="mb-12.5">
              <div className="flex gap-5 items-center mb-3.75">
                <div
                  className="w-7.5 h-7.5 rounded-[5px] flex justify-center items-center cursor-pointer"
                  onClick={() => navigate("/about")}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[#1F2937] text-[20px] bg-zinc-200 rounded p-1"
                  />
                </div>
                <h1 className="text-[#1F2937] dark:text-white font-bold text-[28px]">
                  {t('contact.title')}
                </h1>
              </div>
              <p className="text-[#6B7280] dark:text-gray-200 text-[14px] leading-[1.9] max-w-175 mt-3.75">
                {t('contact.message')}
              </p>
            </div>

            {/* ===== Contact Cards ===== */}
            <div className="flex flex-col md:flex-row justify-between gap-5 mb-9">
              {/* Card 1 - Gmail */}
              <div className="flex-1 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-600 rounded-[10px] p-5.5 text-center">
                <a
                  href={`mailto:${contactInfo.email}?subject=استفسار من منصة طبيبي`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="w-15 h-15 mx-auto mb-3.75">
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#EA4335] to-[#C5221F] border border-[#d4382c] shadow-[0_8px_20px_rgba(234,67,53,0.35)] flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                      </svg>
                    </div>
                  </div>
                </a>
                <h2 className="text-[15px] font-bold text-[#1F2937] dark:text-white mb-1.5">
                  Gmail
                </h2>
                <p className="text-[#6B7280] dark:text-gray-200 text-[13px]">
                  <a
                    href={`mailto:${contactInfo.email}?subject=استفسار من منصة طبيبي`}
                    className="text-[#138c9f] hover:underline"
                  >
                    {contactInfo.email}
                  </a>
                </p>
              </div>

              {/* WhatsApp */}
              <div className="flex-1 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-600 rounded-[10px] p-5.5 text-center">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="w-15 h-15 mx-auto mb-3.75">
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#25D366] to-[#128C7E] border border-[#1eb85f] shadow-[0_8px_20px_rgba(37,211,102,0.35)] flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faWhatsapp}
                        className="text-white text-[26px] drop-shadow"
                      />
                    </div>
                  </div>
                </a>
                <h2 className="text-[15px] font-bold text-[#1F2937] dark:text-white mb-1.5">
                  WhatsApp
                </h2>
              </div>

              {/* Instagram */}
              <div className="flex-1 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-600 rounded-[10px] p-5.5 text-center">
                <a
                  href="https://www.instagram.com/tabibi_gaza/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="w-15 h-15 mx-auto mb-3.75">
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#E4405F] to-[#C13584] border border-[#d63384] shadow-[0_8px_20px_rgba(228,64,95,0.35)] flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <h2 className="text-[15px] font-bold text-[#1F2937] dark:text-white mb-1.5">
                  Instagram
                </h2>
              </div>

              {/* LinkedIn */}
              <div className="flex-1 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-600 rounded-[10px] p-5.5 text-center">
                <a
                  href="https://www.linkedin.com/company/tabibi-gaza/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="w-15 h-15 mx-auto mb-3.75">
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0A66C2] to-[#004182] border border-[#0a5bb2] shadow-[0_8px_20px_rgba(10,102,194,0.35)] flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                  </div>
                </a>
                <h2 className="text-[15px] font-bold text-[#1F2937] dark:text-white mb-1.5">
                  LinkedIn
                </h2>
              </div>
            </div>

            {/* ===== Contact Web Section ===== */}
            <div className="w-full mx-auto flex flex-col md:flex-row gap-6.25 items-stretch bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-600 rounded-xl p-6.25">
              {/* Form */}
              <div className="flex-1 bg-transparent border-none">
                <h2 className="text-[20px] font-bold text-[#1F2937] dark:text-white mb-1.25">
                  {t('contact.message')}
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3.75"
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.address')}
                    className="w-full p-3 border border-[#138c9f] dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-[#138c9f] transition-colors"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.email')}
                    className="w-full p-3 border border-[#138c9f] dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-[#138c9f] transition-colors"
                    required
                  />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('contact.title')}
                    className="w-full p-3 border border-[#138c9f] dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-[#138c9f] transition-colors"
                    required
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.message')}
                    className="w-full p-3 border border-[#138c9f] dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-[#138c9f] transition-colors resize-none h-30"
                    required
                  ></textarea>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border-none cursor-pointer bg-[#138c9f] text-white p-3 rounded-md text-[14px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,87,194,0.25)] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'جاري الإرسال...' : t('contact.send')}
                  </button>
                </form>
              </div>

              {/* Support Box */}
              <div className="flex-1 bg-[#138c9f1a] rounded-[10px] p-6.25 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-62.5">
                {/* الدوائر الخلفية */}
                <div className="absolute w-45 h-45 rounded-full bg-[#138c9f15] -top-22.5 -left-22.5 z-0"></div>
                <div className="absolute w-45 h-45 rounded-full bg-[#138c9f15] -bottom-17.5 -right-17.5 z-0"></div>

                {/* المحتوى */}
                <div className="relative z-10">
                  <div className="w-17.5 h-17.5 mx-auto mb-3.75 rounded-full bg-[#138c9f20] flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faHouseMedicalCircleCheck}
                      className="text-[26px] text-[#138C9F]"
                    />
                  </div>
                  <h3 className="mb-2.5 font-bold text-[#1F2937] dark:text-white text-[18px]">
                    {t('contact.phone')}
                  </h3>
                  <p className="text-[#6B7280] dark:text-gray-200 leading-[1.8] text-[14px]">
                    {t('contact.message')}
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