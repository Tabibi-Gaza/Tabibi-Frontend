import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowLeft, faArrowRight, faQuoteRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../api/axiosInstance";

const FILES_URL = import.meta.env.VITE_Files_URL || "";

function TextWithMore({ text, onShowMore }) {
  const displayRef = useRef(null);
  const measureRef = useRef(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (displayRef.current && measureRef.current) {
        const full = measureRef.current.scrollHeight;
        const clamped = displayRef.current.clientHeight;
        setOverflow(full > clamped + 1);
      }
    });
  }, [text]);

  return (
    <div className="relative">
      <p ref={displayRef} className="text-slate-700 text-sm md:text-base leading-relaxed font-bold line-clamp-2">
        "{text}"
      </p>
      <p ref={measureRef} className="text-slate-700 text-sm md:text-base leading-relaxed font-bold absolute top-0 right-0 pointer-events-none opacity-0" aria-hidden="true">
        "{text}"
      </p>
      <div className="h-[18px] md:h-[20px]">
        {overflow && (
          <button onClick={onShowMore} className="text-[#138C9F] text-xs font-bold mt-0.5 hover:underline cursor-pointer">
            عرض المزيد
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewsGrid() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(window.innerWidth < 640 ? 1 : 2);
  const [popupReview, setPopupReview] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get("/reviews/platform/top");
        if (data.succeeded && data.data) {
          setReviews(data.data);
        }
      } catch (err) {

      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / perPage);

  const nextPage = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);
  const prevPage = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);

  useEffect(() => {
    const handleResize = () => {
      const newPerPage = window.innerWidth < 640 ? 1 : 2;
      setPerPage(newPerPage);
      setPage(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(nextPage, 5000);
    return () => clearInterval(timer);
  }, [nextPage, reviews.length]);

  useEffect(() => {
    if (popupReview) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [popupReview]);

  const visible = reviews.slice(page * perPage, (page + 1) * perPage);

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-14 md:py-28" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs font-black text-[#138C9F] bg-[#138C9F]/10 px-4 py-2 rounded-full inline-block tracking-wide font-['Tajawal'] mb-4">
            ماذا يقول مرضانا
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 font-['Tajawal'] leading-tight">
            قصص نجاح حقيقية من <span className="text-[#138C9F]">مرضانا</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl mx-auto font-bold">
            أكثر من 1,000 مريض وثقوا في طبيبي لحجز مواعيدهم الطبية
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-7xl">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 md:p-8 shadow-lg h-64 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-slate-400 font-bold text-sm py-10">لا توجد تقييمات متاحة حالياً</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-7xl items-stretch">
              {visible.map((review, i) => (
                <motion.div
                  key={page * perPage + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-slate-100 p-5 md:p-8 shadow-lg h-full"
                >
                  <div className="min-h-[80px] md:min-h-[96px]">
                    <div className="flex items-start gap-2 md:gap-3 mb-4">
                      <FontAwesomeIcon icon={faQuoteRight} className="text-2xl md:text-3xl text-[#138C9F]/10 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-2 md:mb-3" dir="ltr">
                          {[...Array(review.rating)].map((_, s) => (
                            <FontAwesomeIcon key={s} icon={faStar} className="text-amber-400 text-xs md:text-sm" />
                          ))}
                        </div>
                        <TextWithMore text={review.comment} onShowMore={() => setPopupReview(review)} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        loading="lazy"
                        decoding="async"
                        width="44"
                        height="44"
                        src={
                          review.patientImage
                            ? `${FILES_URL}/${review.patientImage.startsWith("/") ? "" : "/"}${review.patientImage}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.patientName)}&background=138C9F&color=fff&size=80`
                        }
                        alt={review.patientName}
                        className="w-10 h-10 md:w-11 md:h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="text-right flex-1 min-w-0">
                        <h4 className="font-black text-slate-900 text-sm">{review.patientName}</h4>
                        <span className="text-[11px] font-bold text-[#138C9F]/60 bg-[#138C9F]/5 px-2 py-0.5 rounded-full">{review.specializationName}</span>
                      </div>
                    </div>
                    <div className="text-left text-[10px] text-slate-400 font-bold shrink-0">
                      {review.clinicName}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10">
                <button onClick={prevPage} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#138C9F] hover:text-white hover:border-[#138C9F] transition-all duration-300 shadow-sm cursor-pointer">
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs md:text-sm" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === page ? "w-8 bg-[#138C9F]" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                    />
                  ))}
                </div>
                <button onClick={nextPage} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#138C9F] hover:text-white hover:border-[#138C9F] transition-all duration-300 shadow-sm cursor-pointer">
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs md:text-sm" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {popupReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" dir="rtl">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPopupReview(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 md:p-8">
            <button onClick={() => setPopupReview(null)} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <img
                loading="lazy"
                decoding="async"
                width="48"
                height="48"
                src={
                  popupReview.patientImage
                    ? `${FILES_URL}/${popupReview.patientImage.startsWith("/") ? "" : "/"}${popupReview.patientImage}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(popupReview.patientName)}&background=138C9F&color=fff&size=96`
                }
                alt={popupReview.patientName}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div>
                <h4 className="font-black text-slate-900">{popupReview.patientName}</h4>
                <span className="text-xs font-bold text-[#138C9F]/60">{popupReview.specializationName}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-4" dir="ltr">
              {[...Array(popupReview.rating)].map((_, s) => (
                <FontAwesomeIcon key={s} icon={faStar} className="text-amber-400" />
              ))}
            </div>
            <p className="text-slate-700 text-base leading-relaxed font-bold">
              "{popupReview.comment}"
            </p>
            {popupReview.clinicName && (
              <p className="text-xs text-slate-400 font-bold mt-4">{popupReview.clinicName}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ReviewsGrid;
