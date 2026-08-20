import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faLock, faUsers, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const About = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                  className="w-7.5 h-7.5 bg-[#ecf8fa] rounded-[5px] flex justify-center items-center cursor-pointer mt-3.75"
                  onClick={() => navigate("/doctors")}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[#1F2937] text-[20px] bg-zinc-200 rounded p-2"
                  />
                </div>
                <h1 className="text-[#1F2937] dark:text-white text-[28px] font-bold mt-2.5">
                  {t('about.title')}
                </h1>
              </div>
              <p className="text-[#6B7280] dark:text-gray-200 text-[14px] leading-[1.9] max-w-175 mt-3.75">
                {t('about.subtitle')}
              </p>
            </div>

            {/* ===== Features Section ===== */}
            <div className="mt-16.25">
              <ul className="p-5 my-5 mx-0 flex flex-col gap-5">
                {/* Mission */}
                <li className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-600 rounded-[18px] p-6.25 flex gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
                  <div className="relative w-15.5 h-15.5 min-w-15.5 rounded-full bg-[#EFF6FF] flex justify-center items-center">
                    <div className="absolute w-19.5 h-19.5 rounded-full border border-[#E2E8F0] dark:border-gray-600 z-0"></div>
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-[#138C9F] text-[20px] relative z-10"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[20px] font-bold mb-2.5 dark:text-white">
                      <span className="text-[#138C9F] font-extrabold">{t('about.mission')}</span>
                    </h2>
                    <p className="text-[#64748B] dark:text-gray-200 text-[15px] leading-[1.8]">
                      {t('about.missionText')}
                    </p>
                  </div>
                </li>

                {/* Vision */}
                <li className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-600 rounded-[18px] p-6.25 flex gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
                  <div className="relative w-15.5 h-15.5 min-w-15.5 rounded-full bg-[#EFF6FF] flex justify-center items-center">
                    <div className="absolute w-19.5 h-19.5 rounded-full border border-[#E2E8F0] dark:border-gray-600 z-0"></div>
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-[#138C9F] text-[20px] relative z-10"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[20px] font-bold mb-2.5 dark:text-white">
                      <span className="text-[#138C9F] font-extrabold">{t('about.vision')}</span>
                    </h2>
                    <p className="text-[#64748B] dark:text-gray-200 text-[15px] leading-[1.8]">
                      {t('about.visionText')}
                    </p>
                  </div>
                </li>

                {/* Values */}
                <li className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-600 rounded-[18px] p-6.25 flex gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
                  <div className="relative w-15.5 h-15.5 min-w-15.5 rounded-full bg-[#EFF6FF] flex justify-center items-center">
                    <div className="absolute w-19.5 h-19.5 rounded-full border border-[#E2E8F0] dark:border-gray-600 z-0"></div>
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="text-[#138C9F] text-[20px] relative z-10"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[20px] font-bold mb-2.5 dark:text-white">
                      <span className="text-[#138C9F] font-extrabold">{t('about.values')}</span>
                    </h2>
                    <p className="text-[#64748B] dark:text-gray-200 text-[15px] leading-[1.8]">
                      {t('about.valuesText')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* ===== Action Buttons ===== */}
            <div className="flex flex-col sm:flex-row justify-start gap-3 mt-8.75 mb-11.25 mr-0 md:mr-7.5">
              <button
                onClick={() => navigate("/doctors")}
                className="inline-flex items-center justify-center h-10.5 px-5.5 bg-[#138C9F] text-white rounded-lg text-[14px] font-bold border border-[#138C9F] transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                {t('doctors.book')}
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center justify-center h-10.5 px-5.5 bg-white dark:bg-gray-800 text-[#138C9F] dark:text-gray-200 rounded-lg text-[14px] font-bold border border-[#138C9F] dark:border-gray-600 transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                {t('contact.title')}
              </button>
            </div>

            {/* ===== Statistics Section ===== */}
            <div className="mt-8.75 bg-[#138c9f] rounded-[20px] py-9.5 px-6.25 grid grid-cols-2 md:grid-cols-4 gap-7.5 md:gap-0 text-center">
              <div className="flex flex-col items-center">
                <h2 className="text-white text-[34px] font-bold mb-2.5">+12</h2>
                <p className="text-white/90 text-[15px]">{t('about.statsDoctors')}</p>
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-white text-[34px] font-bold mb-2.5">1k+</h2>
                <p className="text-white/90 text-[15px]">{t('about.statsPatients')}</p>
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-white text-[34px] font-bold mb-2.5">12+</h2>
                <p className="text-white/90 text-[15px]">{t('about.statsAppointments')}</p>
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-white text-[34px] font-bold mb-2.5">
                  24/7
                </h2>
                <p className="text-white/90 text-[15px]">{t('about.statsSupport')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
};

export default About;