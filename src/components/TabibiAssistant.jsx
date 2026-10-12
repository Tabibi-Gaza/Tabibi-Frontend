import React, { useEffect, useMemo, useRef, useState } from 'react';

const WA_NUMBER = '972597081983';
const WA_DISPLAY = '0597081983';
const WA_TEXT = 'مرحباً، أحتاج مساعدة بخصوص منصة طبيبي';
const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\u0621-\u064A0-9a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const KB = [
  {
    keys: ['السلام عليكم', 'مرحبا', 'اهلا', 'صباح الخير', 'مساء الخير', 'هاي', 'هلا', 'hello', 'hi'],
    a: 'وعليكم السلام 👋 أنا «مساعد Tabibi» — جاهز أساعدك في أي سؤال عن المنصة: التسجيل، الحجز، الدفع، الوصفات، ملفك الطبي… اسألني أو اختر سؤالاً من الأسفل.',
  },
  {
    keys: ['تسجيل دخول', 'سجل دخول', 'اسجل دخول', 'ادخل بحساب', 'لوقن', 'login', 'دخولي'],
    a: 'تسجيل الدخول من زر «تسجيل الدخول»: أدخل بريدك وكلمة مرورك، أو اضغط «المتابعة بحساب جوجل» وتدخل بضغطة واحدة بدون كلمة مرور.',
  },
  {
    keys: ['نسيت كلمه المرور', 'نسيت كلمه السر', 'نسيت السر', 'استعاده كلمه المرور', 'استرجاع كلمه المرور', 'تغيير كلمه المرور', 'كلمه مرور جديده', 'كود التحقق'],
    a: 'اضغط «نسيت كلمة المرور؟» في صفحة الدخول، أدخل بريدك ويوصلك كود تحقق تحدّد منه كلمة مرور جديدة. وإذا كنت داخل حسابك وتبي تغيّرها مباشرة تواصل مع الدعم ونساعدك.',
    support: true,
  },
  {
    keys: ['انشاء حساب', 'تسجيل جديد', 'حساب جديد', 'سجل حساب', 'حساب مريض', 'كيف اسجل', 'جديد بالمنصه'],
    a: 'لإنشاء حساب مريض: اضغط «تسجيل جديد»، عبّي اسمك وبريدك وكلمة المرور ورقم هاتفك، وبكده يتفعّل حسابك. وتقدر كمان تسجّل بحساب جوجل بضغطة واحدة.',
  },
  {
    keys: ['بدون حساب', 'بدون تسجيل', 'تصفح بدون', 'يمكن التصفح', 'الموقع بدون'],
    a: 'نعم، تقدر تتصفح الأطباء والتخصصات والمختبرات والصيدليات والمراكز الطبية بدون تسجيل دخول. أما الحجز والمحادثة وحفظ المفضلة فتحتاج حساب مريض.',
  },
  {
    keys: ['مواعيد المتاحه', 'المواعيد المتاحه', 'اوقات', 'موقيت', 'متى المواعيد', 'المواعيد'],
    a: 'المواعيد المتاحة تظهر داخل صفحة الطبيب حسب جدوله — تختار التاريخ والوقت المناسب وقت الحجز.',
  },
  {
    keys: ['كيف احجز', 'حجز موعد', 'احجز موعد', 'احجز', 'حجز', 'موعد جديد'],
    a: 'خطوات الحجز: افتح صفحة الطبيب ← «احجز موعد» ← اختر التاريخ والوقت وأضف ملاحظاتك ← أرسل الطلب ← ارفع إيصال الدفع، وبعد موافقة الطبيب يتأكد موعدك.',
  },
  {
    keys: ['ايصال', 'الدفع', 'طرق الدفع', 'ادفع', 'دفع', 'محفظه', 'تحويل بنكي', 'المدفوعات'],
    a: 'بعد إرسال طلب الحجز تنتقل لصفحة الدفع: اختر الطريقة المتاحة وارفع صورة إيصال التحويل. تقدر تتابع حالة الدفع وتحميل إيصالك من صفحة «المعاملات المالية».',
  },
  {
    keys: ['الغاء موعد', 'الغي موعد', 'الغاء حجز', 'الغي الحجز', 'الغاء', 'الغي'],
    a: 'نعم، تقدر تلغي حجزك من صفحة «حجوزاتي» قبل الموعد بوقت كافٍ ووفق شروط الطبيب (موضحة في «شروط الاستخدام»).',
  },
  {
    keys: ['تعديل موعد', 'تغيير موعد', 'تغيير الوقت', 'تغيير الموعد'],
    a: 'لتغيير موعدك: ألغي الحجز الحالي من «حجوزاتي» ثم احجز موعداً جديداً بالوقت الذي يناسبك، أو تواصل مع الدعم ونساعدك.',
    support: true,
  },
  {
    keys: ['حجوزاتي', 'مواعيدي', 'حاله الحجز', 'حاله الموعد', 'موافقه الطبيب', 'الحجز معلق', 'تتبع الحجز', 'وين حجوزاتي'],
    a: 'افتح «حجوزاتي» لتشوف مواعيدك وحالتها: بانتظار موافقة الطبيب، مؤكد، مكتمل أو ملغي — مع إمكانية الإلغاء والدفع من نفس الصفحة.',
  },
  {
    keys: ['وصفاتي', 'الوصفات', 'وصفه طبيه', 'روشت', 'وصفه', 'وصفات'],
    a: 'صفحة «وصفاتي» فيها كل الوصفات الطبية اللي كتبها لك الأطباء مع تفاصيلها وتواريخها، وتقدر ترجع لها في أي وقت.',
  },
  {
    keys: ['ملفي الطبي', 'الملف الطبي', 'التاريخ المرضي', 'امراضي', 'حساسياتي', 'سجل طبي', 'الملف الصحي', 'معلوماتي الصحيه'],
    a: 'من «ملفي الطبي» توثق أمراضك وحساسياتك وأدويتك ومعلوماتك الصحية، وبكده بيشوفها طبيبك وقت الكشف ويعرف سوابقك.',
  },
  {
    keys: ['محادثه', 'دردشه', 'راسل الطبيب', 'مراسله'],
    a: 'تقدر تراسل طبيبك من صفحة «المحادثات» بعد تأكيد الحجز — بنصوص وملفات، ويوصلك ردّه كإشعار.',
  },
  {
    keys: ['اشعارات', 'الاشعارات', 'جرس', 'تنبيهات', 'التنبيهات'],
    a: 'كل تحديثاتك بتوصل لجرس الإشعارات في الشريط العلوي: ردود الأطباء، تحديثات المواعيد، وأخبار حسابك.',
  },
  {
    keys: ['مفضله', 'المفضله', 'قائمه المفضله'],
    a: 'اضغط ♥ على أي طبيب أو مختبر أو صيدلية أو مركز طبي، وبتلاقيها مجمّعة في صفحة «المفضلة».',
  },
  {
    keys: ['مختبر', 'صيدليه', 'مركز طبي', 'مراكز طبيه', 'تحاليل', 'الصيدليات', 'المختبرات', 'المراكز الطبيه'],
    a: 'من القائمة الرئيسية تفتح «المختبرات» و«الصيدليات» و«المراكز الطبية» وتتصفح الخدمات وطرق التواصل المتاحة.',
  },
  {
    keys: ['سعر', 'اسعار', 'رسوم الكشف', 'بكام', 'كم يكلف', 'التكلفه', 'الرسوم'],
    a: 'سعر الجلسة (رسوم الكشف) مكتوب في بطاقة الطبيب — تشوفه قبل ما تأكد الحجز.',
  },
  {
    keys: ['اريد طبيب', 'ابحث عن طبيب', 'اختار طبيب', 'اي تخصص', 'تخصص مناسب', 'اعراضي', 'اعراض', 'الاطباء', 'اختيار الطبيب'],
    a: 'افتح صفحة «الأطباء» وفلتر حسب التخصص والمكان، أو اكتب عرضك في «المساعد الطبي الذكي» بالصفحة الرئيسية وسأرشح لك التخصص المناسب.',
  },
  {
    keys: ['امان', 'امنيه', 'خصوصيه', 'حمايه بيانات', 'سربيه', 'الخصوصيه', 'تشفير'],
    a: 'بياناتك الطبية محفوظة بسرية تامة على المنصة ولا تُشارك مع أحد إلا بموافقتك، ولمزيد من التفاصيل راجع «سياسة الخصوصية».',
  },
  {
    keys: ['انضم كطبيب', 'تسجيل طبيب', 'طبيب جديد', 'حساب طبيب', 'التسجيل كطبيب', 'اصبح طبيب'],
    a: 'للانضمام كطبيب: افتح «التسجيل كطبيب»، أدخل بياناتك وارفع صورة الهوية والسيرة الذاتية، ويراجعها فريق المنصة ويجيك القرار على بريدك.',
  },
  {
    keys: ['اشتراكي', 'اشتراكك', 'تجديد الاشتراك', 'اشتراك الطبيب', 'الاشتراك المنتهي', 'اشتراك', 'الاشتراك'],
    a: 'الأطباء يديرون اشتراكاتهم من صفحة «اشتراكي» داخل لوحة الطبيب: يختارون الباقة وطريقة الدفع ويرفعون الإيصال. ولتسجيل طبيب جديد: «التسجيل كطبيب».',
    support: true,
  },
  {
    keys: ['حذف حساب', 'الغاء حساب', 'مسح حساب', 'ازاله الحساب', 'احذف بياناتي', 'مسح بياناتي', 'حذف البيانات'],
    a: 'ما في زر حذف داخل المنصة حالياً — لحذف حسابك وبياناتك نهائياً تواصل مع الدعم عبر واتساب وننفّذ الطلب لك.',
    support: true,
  },
  {
    keys: ['دعم', 'تواصل', 'خدمه العملاء', 'شكوي', 'مشكله', 'ما اعرف', 'ما فهمت'],
    a: 'يسعدنا مساعدتك! تواصل معنا عبر صفحة «تواصل معنا» أو واتساب، وسيرد عليك فريق الدعم في أقرب وقت.',
    support: true,
  },
  {
    keys: ['لغه', 'انجليزي', 'وضع ليلي', 'الغامق', 'تبديل اللغه'],
    a: 'تبدّل اللغة بين العربية والإنجليزية من زر (EN/ع) في الشريط العلوي، وتفعّل الوضع الليلي من أيقونة القمر بجانبه.',
  },
  {
    keys: ['شكرا', 'مشكور', 'تسلم', 'جزاك', 'تسلمي'],
    a: 'على الرحب والسعة 🌼 أي وقت أسئلة تانية اسألني، وإلا تواصل مع الدعم عبر واتساب.',
  },
  {
    keys: ['كيف حالك', 'اخبارك', 'شلونك', 'كيفك', 'احوالك'],
    a: 'الحمد لله، جاهز أساعدك! اسألني عن التسجيل، الحجز، الدفع، الوصفات أو ملفك الطبي.',
  },
  {
    keys: ['qr', 'باركود', 'رمز سريع'],
    a: 'المنصة توفّر رموز QR تُستخدم داخل العيادة للوصول السريع للملف الطبي عبر مسح الرمز.',
  },
];

const SUGGESTIONS = [
  'كيف أنشئ حساب مريض؟',
  'كيف أسجل دخول؟',
  'هل يمكن التصفح بدون حساب؟',
  'كيف أحجز موعداً؟',
];

const WELCOME = [
  { from: 'bot', text: 'مرحباً بك 👋 أنا «مساعد Tabibi» — مساعد أسئلة المنصة.' },
  { from: 'bot', text: 'اسألني عن أي شيء: التسجيل، الحجز، الدفع، الوصفات، ملفك الطبي… أو اختر سؤالاً جاهزاً من الأسفل.' },
];

const fallbackMessage = () => ({
  from: 'bot',
  text: 'لم أجد إجابة دقيقة لسؤالك 😕 جرّب صياغة تانية، أو اسألني عن: التسجيل، الحجز، الدفع، الوصفات، الملف الطبي.',
  support: true,
});

const DoctorAvatar = ({ waving = false, label = 'مساعد Tabibi' }) => (
  <svg viewBox="0 0 140 140" className="w-full h-full" role="img" aria-label={label}>
    <defs>
      <clipPath id="tabibi-av-clip">
        <circle cx="70" cy="70" r="64" />
      </clipPath>
    </defs>
    <circle cx="70" cy="70" r="64" fill="#EAF7F9" />
    <g clipPath="url(#tabibi-av-clip)">
      <rect x="59" y="112" width="9" height="18" rx="4" fill="#334155" />
      <rect x="72" y="112" width="9" height="18" rx="4" fill="#334155" />
      <ellipse cx="62" cy="131" rx="9" ry="5" fill="#1E293B" />
      <ellipse cx="78" cy="131" rx="9" ry="5" fill="#1E293B" />
      <path d="M50 96 L45 114" stroke="#CBD5E1" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M50 96 L45 114" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="117" r="7" fill="#F5C6A0" />
      <rect x="64" y="70" width="12" height="14" fill="#EDB68C" />
      <path d="M47 126 L47 99 Q47 84 70 83 Q93 84 93 99 L93 126 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <path d="M63 83 L70 98 L77 83 Z" fill="#138C9F" />
      <rect x="77" y="101" width="12" height="9" rx="2" fill="#138C9F" />
      <path d="M79 104 H87 M79 107 H85" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="70" cy="114" r="2.2" fill="#94A3B8" />
      <path d="M64 79 Q58 95 67 101" stroke="#138C9F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="68" cy="102" r="4.5" fill="#138C9F" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="47" cy="56" r="5.5" fill="#F5C6A0" />
      <circle cx="93" cy="56" r="5.5" fill="#F5C6A0" />
      <circle cx="70" cy="55" r="23" fill="#F5C6A0" />
      <path d="M47 58 Q45 30 70 29 Q95 30 93 58 Q92 50 87 45 Q79 39 68 41 Q56 44 51 52 Q48 55 47 58 Z" fill="#6B4423" />
      <path d="M57 50 Q61 47 65 50" stroke="#6B4423" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M75 50 Q79 47 83 50" stroke="#6B4423" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="61" cy="57" r="2.9" fill="#263238" />
      <circle cx="79" cy="57" r="2.9" fill="#263238" />
      <ellipse cx="54" cy="64" rx="4.5" ry="2.6" fill="#F6A899" opacity="0.5" />
      <ellipse cx="86" cy="64" rx="4.5" ry="2.6" fill="#F6A899" opacity="0.5" />
      <path d="M64 67 Q70 72 76 67" stroke="#B4664A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: '88px 97px',
          animation: waving ? 'tabibi-wave 1.6s ease-in-out infinite' : 'none',
        }}
      >
        <path d="M88 97 L106 68" stroke="#CBD5E1" strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d="M88 97 L106 68" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="109" cy="64" r="8" fill="#F5C6A0" stroke="#E2E8F0" strokeWidth="1.5" />
      </g>
    </g>
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.5 11.6 21 3.2c.8-.4 1.6.4 1.2 1.2l-8.4 18.5c-.4.8-1.5.7-1.7-.2l-1.6-6.4-6.4-1.6c-.9-.2-1-1.3-.2-1.7Z" />
    <path d="M10.5 13.5 21 3.2" stroke="#138C9F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
  </svg>
);

const Bubble = ({ m }) => {
  if (m.from === 'user') {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] bg-[#138C9F] text-white text-sm font-medium leading-6 px-4 py-2.5 rounded-2xl rounded-tr-sm whitespace-pre-line">
          {m.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start gap-2">
      <div className="w-8 h-8 shrink-0 mt-1 rounded-full overflow-hidden bg-white border border-gray-200 dark:border-gray-600 p-0.5">
        <DoctorAvatar waving={false} label="مساعد" />
      </div>
      <div className="max-w-[85%] min-w-0">
        <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100 text-sm leading-6 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm whitespace-pre-line">
          {m.text}
        </div>
        {m.support && (
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#138C9F] hover:underline"
          >
            تواصل مع الدعم عبر واتساب
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
};

const TabibiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const table = useMemo(
    () => KB.map((e) => ({ ...e, nk: e.keys.map(norm) })),
    []
  );

  useEffect(() => {
    if (open && messages.length === 0) setMessages(WELCOME);
  }, [open, messages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const findAnswer = (raw) => {
    const q = norm(raw);
    if (!q) return null;
    let best = null;
    let bestScore = 0;
    for (const entry of table) {
      let score = 0;
      for (const key of entry.nk) {
        if (key && q.includes(key)) {
          score += key.split(' ').length * 3 + Math.min(key.length, 12) / 4;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }
    return bestScore >= 3 ? best : null;
  };

  const send = (raw) => {
    const text = (raw !== undefined && raw !== null ? raw : input).trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { from: 'user', text }]);
    setTyping(true);
    window.setTimeout(() => {
      const hit = findAnswer(text);
      setMessages((m) => [
        ...m,
        hit ? { from: 'bot', text: hit.a, support: !!hit.support } : fallbackMessage(),
      ]);
      setTyping(false);
    }, 550);
  };

  return (
    <>
      <style>{`
        @keyframes tabibi-wave {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(22deg); }
          35% { transform: rotate(-6deg); }
          55% { transform: rotate(20deg); }
          75% { transform: rotate(-2deg); }
        }
      `}</style>

      {open && (
        <div
          dir="rtl"
          className="fixed left-3 bottom-32 z-[9998] w-[calc(100vw-1.5rem)] max-w-[420px] h-[min(78vh,600px)] rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <div dir="ltr" className="relative w-11 h-11 rounded-full bg-[#E8F7F9] dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-1 shrink-0">
              <DoctorAvatar waving={false} label="مساعد Tabibi" />
              <span className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base text-gray-900 dark:text-white leading-tight">مساعد Tabibi</p>
              <p className="text-xs text-gray-400 font-semibold">مساعد أسئلة المنصة</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق المساعد"
              className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <IconClose />
            </button>
          </div>

          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-[#F7FBFC] dark:bg-gray-900"
          >
            {messages.map((m, i) => (
              <Bubble key={i} m={m} />
            ))}
            {typing && (
              <div className="flex justify-start gap-2">
                <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white border border-gray-200 dark:border-gray-600 p-0.5">
                  <DoctorAvatar waving={false} label="مساعد" />
                </div>
                <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="px-3 pt-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <div className="flex flex-wrap gap-2 pb-2.5">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="text-xs font-bold px-3.5 py-2 rounded-full border border-[#138C9F]/40 text-[#138C9F] hover:bg-[#138C9F]/10 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 pb-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={200}
                placeholder="اكتب سؤالك هنا..."
                aria-label="اكتب سؤالك"
                className="flex-1 min-w-0 h-12 px-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[15px] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-[#138C9F]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="إرسال"
                className="w-12 h-12 shrink-0 rounded-full bg-[#138C9F] text-white grid place-items-center hover:bg-[#0f7282] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <IconSend />
              </button>
            </form>
            <div className="text-center pb-2.5">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-gray-400 hover:text-[#138C9F] transition-colors"
              >
                دعم واتساب {WA_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      )}

      <div dir="ltr" className="fixed left-3 bottom-6 z-[9999] flex items-end gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'إغلاق مساعد Tabibi' : 'افتح مساعد Tabibi'}
          aria-expanded={open}
          className="w-20 h-20 sm:w-[92px] sm:h-[92px] rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl p-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <DoctorAvatar waving={!open} />
        </button>
        {!open && (
          <span className="mb-2.5 bg-[#138C9F] text-white text-sm sm:text-base font-bold px-5 py-2.5 rounded-full shadow-lg select-none whitespace-nowrap">
            اسأل طبيبي
          </span>
        )}
      </div>
    </>
  );
};

export default TabibiAssistant;
