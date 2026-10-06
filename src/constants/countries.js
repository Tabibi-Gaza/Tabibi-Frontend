// min/max = عدد الخانات المسموح به لرقم الهاتف المحلي (بدون رمز الدولة)
// example = الصيغة اللي بتظهر كـ placeholder في حقل الرقم
export const COUNTRIES = [
  { name: "فلسطين", iso: "ps", code: "+970", min: 9, max: 9, example: "592405090" },
  { name: "إسرائيل", iso: "il", code: "+972", min: 9, max: 10, example: "501234567" },
  { name: "مصر", iso: "eg", code: "+20", min: 10, max: 11, example: "1012345678" },
  { name: "السعودية", iso: "sa", code: "+966", min: 9, max: 9, example: "512345678" },
  { name: "الإمارات", iso: "ae", code: "+971", min: 9, max: 9, example: "501234567" },
  { name: "الأردن", iso: "jo", code: "+962", min: 9, max: 9, example: "791234567" },
  { name: "لبنان", iso: "lb", code: "+961", min: 7, max: 8, example: "31234567" },
  { name: "سوريا", iso: "sy", code: "+963", min: 9, max: 9, example: "944123456" },
  { name: "العراق", iso: "iq", code: "+964", min: 10, max: 10, example: "7701234567" },
  { name: "الكويت", iso: "kw", code: "+965", min: 8, max: 8, example: "50123456" },
  { name: "قطر", iso: "qa", code: "+974", min: 7, max: 8, example: "33123456" },
  { name: "البحرين", iso: "bh", code: "+973", min: 8, max: 8, example: "33123456" },
  { name: "عُمان", iso: "om", code: "+968", min: 8, max: 8, example: "91234567" },
  { name: "اليمن", iso: "ye", code: "+967", min: 9, max: 9, example: "712345678" },
  { name: "ليبيا", iso: "ly", code: "+218", min: 9, max: 9, example: "912345678" },
  { name: "الجزائر", iso: "dz", code: "+213", min: 9, max: 9, example: "551234567" },
  { name: "المغرب", iso: "ma", code: "+212", min: 9, max: 9, example: "612345678" },
  { name: "تونس", iso: "tn", code: "+216", min: 8, max: 8, example: "21234567" },
  { name: "السودان", iso: "sd", code: "+249", min: 9, max: 9, example: "912345678" },
  { name: "تركيا", iso: "tr", code: "+90", min: 10, max: 10, example: "5012345678" },
  { name: "إيران", iso: "ir", code: "+98", min: 10, max: 10, example: "9123456789" },
  { name: "أفغانستان", iso: "af", code: "+93", min: 9, max: 9, example: "701234567" },
  { name: "باكستان", iso: "pk", code: "+92", min: 10, max: 10, example: "3012345678" },
  { name: "الهند", iso: "in", code: "+91", min: 10, max: 10, example: "9876543210" },
  { name: "بنغلاديش", iso: "bd", code: "+880", min: 10, max: 10, example: "1712345678" },
  { name: "الصين", iso: "cn", code: "+86", min: 11, max: 11, example: "13123456789" },
  { name: "اليابان", iso: "jp", code: "+81", min: 10, max: 10, example: "9012345678" },
  { name: "كوريا الجنوبية", iso: "kr", code: "+82", min: 9, max: 10, example: "1012345678" },
  { name: "ماليزيا", iso: "my", code: "+60", min: 9, max: 10, example: "123456789" },
  { name: "إندونيسيا", iso: "id", code: "+62", min: 9, max: 11, example: "8123456789" },
  { name: "الفلبين", iso: "ph", code: "+63", min: 10, max: 10, example: "9171234567" },
  { name: "تايلاند", iso: "th", code: "+66", min: 9, max: 9, example: "812345678" },
  { name: "المالديف", iso: "mv", code: "+960", min: 7, max: 7, example: "7712345" },
  { name: "قبرص", iso: "cy", code: "+357", min: 8, max: 8, example: "96123456" },
  { name: "مالطا", iso: "mt", code: "+356", min: 8, max: 8, example: "99123456" },
  { name: "أذربيجان", iso: "az", code: "+994", min: 9, max: 9, example: "501234567" },
  { name: "أرمينيا", iso: "am", code: "+374", min: 8, max: 8, example: "77123456" },
  { name: "جورجيا", iso: "ge", code: "+995", min: 9, max: 9, example: "555123456" },
  { name: "أوزبكستان", iso: "uz", code: "+998", min: 9, max: 9, example: "901234567" },
  { name: "كازاخستان", iso: "kz", code: "+7", min: 10, max: 10, example: "7012345678" },
  { name: "روسيا", iso: "ru", code: "+7", min: 10, max: 10, example: "9123456789" },
  { name: "أوكرانيا", iso: "ua", code: "+380", min: 9, max: 9, example: "501234567" },
  { name: "بولندا", iso: "pl", code: "+48", min: 9, max: 9, example: "501234567" },
  { name: "رومانيا", iso: "ro", code: "+40", min: 9, max: 9, example: "712345678" },
  { name: "المجر", iso: "hu", code: "+36", min: 9, max: 9, example: "301234567" },
  { name: "التشيك", iso: "cz", code: "+420", min: 9, max: 9, example: "601234567" },
  { name: "اليونان", iso: "gr", code: "+30", min: 10, max: 10, example: "6912345678" },
  { name: "ألمانيا", iso: "de", code: "+49", min: 10, max: 11, example: "15123456789" },
  { name: "فرنسا", iso: "fr", code: "+33", min: 9, max: 9, example: "612345678" },
  { name: "إيطاليا", iso: "it", code: "+39", min: 9, max: 10, example: "3123456789" },
  { name: "إسبانيا", iso: "es", code: "+34", min: 9, max: 9, example: "612345678" },
  { name: "البرتغال", iso: "pt", code: "+351", min: 9, max: 9, example: "912345678" },
  { name: "أيرلندا", iso: "ie", code: "+353", min: 9, max: 9, example: "851234567" },
  { name: "المملكة المتحدة", iso: "gb", code: "+44", min: 10, max: 10, example: "7123456789" },
  { name: "هولندا", iso: "nl", code: "+31", min: 9, max: 9, example: "612345678" },
  { name: "بلجيكا", iso: "be", code: "+32", min: 9, max: 9, example: "470123456" },
  { name: "سويسرا", iso: "ch", code: "+41", min: 9, max: 9, example: "781234567" },
  { name: "النمسا", iso: "at", code: "+43", min: 10, max: 10, example: "6641234567" },
  { name: "السويد", iso: "se", code: "+46", min: 9, max: 9, example: "701234567" },
  { name: "النرويج", iso: "no", code: "+47", min: 8, max: 8, example: "40123456" },
  { name: "الدنمارك", iso: "dk", code: "+45", min: 8, max: 8, example: "20123456" },
  { name: "فنلندا", iso: "fi", code: "+358", min: 9, max: 10, example: "401234567" },
  { name: "نيوزيلندا", iso: "nz", code: "+64", min: 8, max: 10, example: "211234567" },
  { name: "أستراليا", iso: "au", code: "+61", min: 9, max: 9, example: "412345678" },
  { name: "الولايات المتحدة", iso: "us", code: "+1", min: 10, max: 10, example: "2025551234" },
  { name: "كندا", iso: "ca", code: "+1", min: 10, max: 10, example: "2025551234" },
  { name: "المكسيك", iso: "mx", code: "+52", min: 10, max: 10, example: "5512345678" },
  { name: "البرازيل", iso: "br", code: "+55", min: 10, max: 11, example: "11912345678" },
  { name: "الأرجنتين", iso: "ar", code: "+54", min: 10, max: 10, example: "9112345678" },
  { name: "تشيلي", iso: "cl", code: "+56", min: 9, max: 9, example: "912345678" },
  { name: "كولومبيا", iso: "co", code: "+57", min: 10, max: 10, example: "3201234567" },
  { name: "جنوب أفريقيا", iso: "za", code: "+27", min: 9, max: 9, example: "821234567" },
  { name: "نيجيريا", iso: "ng", code: "+234", min: 10, max: 10, example: "8021234567" },
  { name: "إثيوبيا", iso: "et", code: "+251", min: 9, max: 9, example: "912345678" },
  { name: "كينيا", iso: "ke", code: "+254", min: 9, max: 9, example: "712345678" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

// توليد الـ pattern الخاص بالدولة المختارة (أرقام فقط ضمن العدد المسموح)
export const phonePattern = (country) => {
  const min = country?.min || 7;
  const max = country?.max || 15;
  return `\\d{${min},${max}}`;
};

// توليد رسالة الخطأ حسب الدولة
export const phoneTitle = (country) => {
  if (!country) return "";
  const n = country.name;
  const { min, max } = country;
  if (min === max) return `رقم ${n} يجب أن يتكون من ${min} أرقام`;
  return `رقم ${n} يجب أن يتكون من ${min} إلى ${max} أرقام`;
};

// هل بتستخدم الدولة صفر الصدارة (0) في الصيغة المحلية؟ كل الدول بهاي القائمة
// عدا الولايات المتحدة وكندا (+1) ما بتستعمله.
export const usesTrunkZero = (country) => country?.code !== '+1';

// للعرض داخل الحقل: نشيل صفر الصدارة حتى يتطابق مع عدد الخانات المطلوب
export const toNational = (value, country) => {
  const v = (value || '').replace(/\D/g, '');
  const min = country?.min || 7;
  if (usesTrunkZero(country) && v.startsWith('0') && v.length - 1 >= min) {
    return v.slice(1);
  }
  return v;
};

// للإرسال للـ Backend: نرجّع صفر الصدارة
export const toStored = (value, country) => {
  const v = (value || '').replace(/\D/g, '');
  if (!v) return '';
  if (usesTrunkZero(country) && !v.startsWith('0')) return `0${v}`;
  return v;
};
