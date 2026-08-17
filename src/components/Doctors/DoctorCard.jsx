import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { submitDoctorReview, getMyReviewForDoctor } from "../../services/patientService";

const DoctorCard = ({ item }) => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [isFav, setIsFav] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFav(favs.some(f => f.id === (item.id || item._id)));
  }, [item.id, item._id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFav) {
      localStorage.setItem('favorites', JSON.stringify(favs.filter(f => f.id !== (item.id || item._id))));
      setIsFav(false);
    } else {
      favs.push({
        id: item.id || item._id,
        name: item.fullName,
        image: item.profileImageUrl ? `${import.meta.env.VITE_Files_URL}${item.profileImageUrl.startsWith("/") ? "" : "/"}${item.profileImageUrl}` : "",
        specialty: item.specializationName || "طبيب متخصص",
        fees: item.sessionPrice || 50,
        rating: item.averageRating || 4.8,
        experience: item.yearsOfExperience ? `${item.yearsOfExperience} سنوات خبرة` : "8 سنوات خبرة",
        address: item.clinicAddress || "غزة",
      });
      localStorage.setItem('favorites', JSON.stringify(favs));
      setIsFav(true);
    }
  };

  const handleOpenReview = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info("يجب تسجيل الدخول أولاً");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.roles?.includes("Patient")) {
      toast.info("يمكن للمرضى فقط تقييم الأطباء");
      return;
    }
    setShowReviewModal(true);
    setReviewRating(0);
    setReviewComment("");
    setLoadingAppointments(true);
    try {
      const doctorId = item.id || item._id;
      const reviewRes = await getMyReviewForDoctor(doctorId);
      if (reviewRes.succeeded && reviewRes.data) {
        setReviewRating(reviewRes.data.rating);
        setReviewComment(reviewRes.data.comment || "");
        setHasExistingReview(true);
      } else {
        setHasExistingReview(false);
      }
    } catch {
      // ignore
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.error("يرجى اختيار تقييم من 1 إلى 5 نجوم");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitDoctorReview({
        doctorId: item.id || item._id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      });
      if (res.succeeded) {
        toast.success(hasExistingReview ? "تم تحديث تقييمك بنجاح" : "تم إرسال تقييمك بنجاح");
        setShowReviewModal(false);
      } else {
        toast.error(res.errors?.[0]?.message || res.message || "فشل إرسال التقييم");
      }
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.message || "حدث خطأ أثناء إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-150 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col relative">
      {/* شارة التوفر */}
      {item.availableToday ? (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 text-[10px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse"></span>
          <span>متاح اليوم</span>
        </div>
      ) : (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 text-[10px] font-bold text-white bg-red-400 px-2.5 py-1 rounded-full shadow-xs">
          <span>غير متاح</span>
        </div>
      )}

      {/* زر القلب */}
      <div className="absolute top-3 left-2 z-30">
        <button
          onClick={toggleFavorite}
          className={`p-1.5 rounded-full border transition-all duration-200 shadow-xs ${
            isFav
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white/90 border-gray-200 text-gray-400 hover:text-red-500"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      {/* صورة الطبيب */}
      <div className="bg-gray-50/50 h-52 w-full flex items-center justify-center relative border-b border-gray-100">
        <img
          src={
            item.profileImageUrl
              ? `${import.meta.env.VITE_Files_URL}${item.profileImageUrl.startsWith("/") ? "" : "/"}${item.profileImageUrl}`
              : "https://via.placeholder.com/150"
          }
          alt={item.fullName}
          className="h-full object-contain object-bottom pt-2"
        />
      </div>

      {/* تفاصيل الطبيب */}
      <div className="p-4 flex-1 flex flex-col justify-between text-right bg-white relative">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 font-black text-sm">
              {item.fullName}
            </h3>
            <div className="flex items-center gap-0.5 text-[10px] text-gray-500 font-bold">
              <span>{item.averageRating || "4.8"}</span>
              <span className="text-amber-500 text-xs">★</span>
            </div>
          </div>

          <p className="text-[#138C9F] font-bold text-xs">
            {item.specializationName || "طبيب متخصص"}
          </p>

          <div className="grid grid-cols-2 gap-y-1 gap-x-2 pt-2 pb-1 text-[11px] text-gray-500 font-bold border-b border-gray-50">
            <div className="flex items-center gap-1 justify-start">
              <FontAwesomeIcon
                icon={faClock}
                className="text-gray-400 text-xs"
              />
              <span>
                {item.yearsOfExperience
                  ? `${item.yearsOfExperience} سنوات خبرة`
                  : "8 سنوات خبرة"}
              </span>
            </div>
            <div className="flex items-center gap-1 justify-end truncate">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-gray-400 text-xs"
              />
              <span>{item.clinicAddress || "غزة، الرمال"}</span>
            </div>
            {item.detailedAddress && (
              <div className="flex items-center gap-1 justify-end truncate mt-0.5">
                <span className="text-[10px] text-gray-400 mr-4">{item.detailedAddress}</span>
              </div>
            )}
          </div>

          {item.bio && (
            <p className="text-[11px] text-gray-500 font-bold leading-relaxed mt-2 line-clamp-2">
              {item.bio}
            </p>
          )}
        </div>

        {/* الكشفية والأزرار */}
        <div className="flex items-center justify-between pt-3 mt-2">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold leading-none">
              كشفية
            </p>
            <p className="text-xs font-black text-[#138C9F] mt-0.5">
              {item.sessionPrice || "50"} ILS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenReview}
              className="bg-white border border-[#138C9F]/30 hover:bg-[#138C9F]/5 text-[#138C9F] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              تقييم
            </button>
            <button
              onClick={() => {
                navigate(`/appointment/${item.id || item._id}`);
                window.scrollTo(0, 0);
              }}
              className="bg-[#138C9F] hover:bg-[#2c7792] text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              احجز الآن
            </button>
          </div>
        </div>
      </div>

      {/* نافذة التقييم */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setShowReviewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              disabled={submitting}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">{hasExistingReview ? "تعديل التقييم" : "تقييم الطبيب"}</h3>
            <p className="text-sm text-slate-500 font-bold mb-5">{item.fullName}</p>

            {loadingAppointments ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-3 border-[#138C9F] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-slate-400 mt-3 font-bold">جاري التحميل...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 mb-4 justify-center" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="cursor-pointer transition-transform hover:scale-110"
                      disabled={submitting}
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        className={`text-2xl ${
                          star <= (hoverRating || reviewRating)
                            ? "text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-slate-400 font-bold mb-4">
                  {reviewRating > 0 ? `${reviewRating} من 5` : "اختر تقييمك"}
                </p>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="أضف تعليقاً (اختياري)..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 font-bold resize-none focus:outline-none focus:ring-2 focus:ring-[#138C9F]/30 focus:border-[#138C9F] transition-all"
                  rows={3}
                  disabled={submitting}
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={submitting || reviewRating === 0}
                  className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    submitting || reviewRating === 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#138C9F] hover:bg-[#2c7792] text-white shadow-md"
                  }`}
                >
                  {submitting ? "جاري الإرسال..." : hasExistingReview ? "تحديث التقييم" : "إرسال التقييم"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;
