import React from "react";
import StickySlider from "./StickySlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStethoscope, faFemale, faBaby, faBrain, faHeart, faTooth, faEye, faBone, faLungs, faKidneys, faShieldHalved, faUserDoctor, faHandHoldingMedical, faHospital } from "@fortawesome/free-solid-svg-icons";
import { useSpecializations } from "../../hooks/specializations/useSpecializations";

const iconMap = {
  "طب عام": faStethoscope,
  "طب الأطفال": faBaby,
  "طب الأسنان": faTooth,
  "طب العيون": faEye,
  "طب القلب": faHeart,
  "طب الأعصاب": faBrain,
  "الأمراض الجلدية": faShieldHalved,
  "طب الباطنية": faHospital,
  "طب الأنف والأذن والحنجرة": faStethoscope,
  "طب العظام": faBone,
  "طب الصدر": faLungs,
  "طب الكلى": faKidneys,
  "الغدد الصماء": faHandHoldingMedical,
  "الطب النفسي": faBrain,
  "طب النساء والتوليد": faFemale,
  "الجراحة العامة": faUserDoctor,
  "المسالك البولية": faKidneys,
};

const colorMap = [
  "from-[#138C9F] to-[#0e7a8c]",
  "from-rose-400 to-rose-500",
  "from-amber-400 to-amber-500",
  "from-indigo-400 to-indigo-500",
  "from-red-400 to-red-500",
  "from-cyan-400 to-cyan-500",
  "from-blue-400 to-blue-500",
  "from-slate-400 to-slate-500",
  "from-emerald-400 to-emerald-500",
  "from-purple-400 to-purple-500",
  "from-pink-400 to-pink-500",
  "from-teal-400 to-teal-500",
];

function SpecialtiesSlider() {
  const { data: specialtiesData, isLoading } = useSpecializations();

  if (isLoading || !specialtiesData) return null;

  const specialties = specialtiesData.map((spec, index) => ({
    icon: iconMap[spec.name] || faStethoscope,
    title: spec.name,
    count: "",
    desc: "",
    color: colorMap[index % colorMap.length],
  }));

  if (specialties.length === 0) return null;

  const renderSpecialty = (specialty, index, isActive) => (
    <div className={`group bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 ${isActive ? "ring-2 ring-[#138C9F]/30 scale-[1.02]" : ""}`}>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${specialty.color} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}>
        <FontAwesomeIcon icon={specialty.icon} className="text-white text-xl" />
      </div>
      <h3 className="text-base md:text-lg font-black text-slate-900 mb-2">{specialty.title}</h3>
      <p className="text-xs text-slate-400 font-bold">{specialty.desc}</p>
    </div>
  );

  return (
    <StickySlider
      title="التخصصات الطبية"
      subtitle="اختر التخصص المناسب واعثر على أفضل الأطباء"
      items={specialties}
      renderItem={renderSpecialty}
      pinHeight="400vh"
    />
  );
}

export default SpecialtiesSlider;
