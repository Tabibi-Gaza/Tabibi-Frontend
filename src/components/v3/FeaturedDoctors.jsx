import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../api/axiosInstance";

const FILES_URL = import.meta.env.VITE_Files_URL || "";

const renderStars = (rating = 0) => {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5 text-base" dir="ltr">
      {[...Array(5)].map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} className={`text-[14px] ${i + 1 <= rounded ? "text-[#138c9f]" : "text-slate-300"}`} />
      ))}
    </div>
  );
};

function FeaturedDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const { data } = await axiosInstance.get("/doctors/top", { params: { ByRating: true } });
        if (data.succeeded && data.data) {
          setDoctors(data.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch top doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopDoctors();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-20 md:py-28 text-slate-900 font-['Cairo']" dir="rtl">
      <span className="text-xs font-black text-[#138C9F] bg-[#138C9F]/10 px-4 py-2 rounded-full tracking-widest border border-[#138C9F]/10 select-none">
        نخبة الأطباء
      </span>
      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
        الأطباء الأعلى تقييماً
      </h2>
      <p className="w-11/12 sm:w-1/2 text-center text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl px-4 sm:px-0 font-bold">
        احجز موعدك مباشرة مع نخبة من الاستشاريين المعتمدين الحاصلين على ثقة مرضانا.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 px-4 max-w-7xl mx-auto">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col h-full">
              <div className="bg-slate-100 animate-pulse w-full h-56" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))
        ) : doctors.length === 0 ? (
          <p className="col-span-full text-center text-slate-400 font-bold text-sm py-10">لا توجد بيانات متاحة حالياً</p>
        ) : (
          doctors.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => { navigate(`/appointment/${item.id}`); window.scrollTo(0, 0); }}
              className="group bg-white border border-slate-100 rounded-3xl overflow-hidden cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:border-[#138C9F]/30 hover:shadow-[0_20px_40px_rgba(58,150,183,0.07)] md:hover:-translate-y-2 transition-all duration-500 flex flex-row md:flex-col h-full"
            >
              <div className="bg-linear-to-b from-slate-50 to-white overflow-hidden w-28 sm:w-36 md:w-full aspect-square md:h-56 shrink-0 flex items-center justify-center relative border-l border-slate-100 md:border-l-0 md:border-b">
                <img
                  src={
                    item.profileImageUrl
                      ? `${FILES_URL}/${item.profileImageUrl.startsWith("/") ? "" : "/"}${item.profileImageUrl}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-center"
                />
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 text-right bg-white relative z-10 min-w-0">
                <div className="w-full">
                <div className={`flex items-center gap-1.5 text-[10px] md:text-xs font-black mb-2 w-fit px-2.5 py-1 rounded-lg border select-none ${
                  item.availableToday
                    ? "text-green-600 bg-green-50 border-green-100/50"
                    : "text-red-500 bg-red-50 border-red-100/50"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${item.availableToday ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
                  <span>{item.availableToday ? "متاح اليوم" : "غير متاح"}</span>
                </div>

                  <h3 className="text-slate-900 font-black text-sm md:text-base flex items-center gap-1.5 group-hover:text-[#138C9F] transition-colors truncate">
                    <span className="truncate">{item.fullName}</span>
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5 select-none">
                    {renderStars(item.averageRating)}
                    <span className="text-xs font-black text-slate-800 mt-0.5">{Number(item.averageRating || 0).toFixed(1)}</span>
                    <span className="text-[11px] font-bold text-slate-400 mt-0.5">({item.totalReviews || 0} تقييم)</span>
                  </div>

                  <p className="text-[#138C9F] font-black text-xs md:text-sm mt-2.5">{item.specializationName || "طبيب متخصص"}</p>
                  <p className="text-slate-400 text-[11px] md:text-xs mt-1.5 font-bold truncate">{item.yearsOfExperience ? `${item.yearsOfExperience} سنوات خبرة` : ""} من الخبرة والكفاءة</p>
                </div>

                <div className="flex items-center justify-end border-t pt-3 md:pt-4 border-slate-100 w-full mt-2">
                  <span className="text-[11px] md:text-xs bg-[#138C9F]/10 text-[#138C9F] font-black px-5 py-2.5 rounded-xl group-hover:bg-[#138C9F] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#138C9F]/20 transition-all duration-300 select-none whitespace-nowrap w-full text-center">
                    احجز الآن
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => { navigate("/doctors"); window.scrollTo(0, 0); }}
        className="mt-16 bg-white border-2 border-[#138C9F]/20 text-[#138C9F] font-black text-xs sm:text-sm px-12 py-4 rounded-full hover:border-[#138C9F] hover:bg-[#138C9F] hover:text-white hover:shadow-xl hover:shadow-[#138C9F]/20 transition-all duration-300 transform active:scale-95 shadow-xs select-none cursor-pointer"
      >
        عرض جميع الأطباء
      </button>
    </div>
  );
}

export default FeaturedDoctors;
