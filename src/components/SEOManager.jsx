import { useLocation } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const SITE = 'https://tabibi-frontend.apps.taqat.academy';

const SEO_CONFIG = {
  '/': {
    title: 'طبيبي Tabibi — منصة طبية رقمية في غزة | حجز مواعيد وسجلات طبية',
    description: 'طبيبي (Tabibi) منصة طبية رقمية في غزة، فلسطين: حجز مواعيد الأطباء، سجلات طبية، وصفات إلكترونية، صيدليات، مختبرات ومراكز طبية — le كل شيء في مكان واحد.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }],
  },
  '/home-v2': {
    title: 'طبيبي Tabibi — النسخة 2',
    description: 'منصة طبيبي (Tabibi) — حجز مواعيد الأطباء وإدارة السجلات الطبية في Gaza, Palestine.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'Home V2', url: '/home-v2' }],
  },
  '/doctors': {
    title: 'الأطباء — بحث وحجز موعد | طبيبي Tabibi',
    description: 'ابحث عن طبيب في غزة واحجز موعدك عبر طبيبي (Tabibi): تخصصات متعددة، ملفات أطباء، أسعار جلسات، تقييمات وتوفر أوقات.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'الأطباء', url: '/doctors' }],
  },
  '/about': {
    title: 'من نحن — طبيبي Tabibi',
    description: 'طبيبي (Tabibi) منصة طبية رقمية founded by Mazen Abu Saif في Gaza, Palestine — رؤيتنا ورسالتنا وفريقنا.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'من نحن', url: '/about' }],
  },
  '/contact': {
    title: 'اتصل بنا — طبيبي Tabibi',
    description: 'تواصل مع فريق طبيبي (Tabibi) — Gaza, Palestine. نحن هنا للمساعدة في حجز المواعيد والدعم الفني.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'اتصل بنا', url: '/contact' }],
  },
  '/privacy-policy': {
    title: 'سياسة الخصوصية — طبيبي Tabibi',
    description: 'سياسة الخصوصية لمنصة طبيبي (Tabibi): كيف نجمع، نستخدم ونحمي بياناتك (Gaza, Palestine).',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'سياسة الخصوصية', url: '/privacy-policy' }],
  },
  '/terms': {
    title: 'الشروط والأحكام — طبيبي Tabibi',
    description: 'الشروط والأحكام لاستخدام منصة طبيبي (Tabibi) الطبية في غزة، فلسطين.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'الشروط والأحكام', url: '/terms' }],
  },
  '/faqs': {
    title: 'الأسئلة الشائعة — طبيبي Tabibi',
    description: 'إجابات على الأسئلة الشائعة حول منصة طبيبي (Tabibi): التسجيل، الحجز، الدفع، الوصفات، الملف الطبي.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'الأسئلة الشائعة', url: '/faqs' }],
  },
  '/pharmacies': {
    title: 'الصيدليات — طبيبي Tabibi',
    description: 'Find pharmacies in Gaza via Tabibi (طبيبي): locations, contact info, and services.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'الصيدليات', url: '/pharmacies' }],
  },
  '/medical-centers': {
    title: 'المراكز الطبية — طبيبي Tabibi',
    description: 'Medical centers in Gaza listed on Tabibi (طبيبي) — locations and services.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'المراكز الطبية', url: '/medical-centers' }],
  },
  '/labs': {
    title: 'المختبرات — طبيبي Tabibi',
    description: 'Medical labs in Gaza on Tabibi (طبيبي) — locations and services.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'المختبرات', url: '/labs' }],
  },
  '/register-doctor': {
    title: 'تسجيل كطبيب — طبيبي Tabibi',
    description: 'سجّل كطبيب في منصة طبيبي (Tabibi) في Gaza, Palestine — ابدأ بإدارة عيادتك رقمياً.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'تسجيل كطبيب', url: '/register-doctor' }],
  },
  '/register-facility': {
    title: 'تسجيل منشأة (صيدلية/مختبر/مركز) — طبيبي Tabibi',
    description: 'سجّل صيدليتك أو مختبرك أو مركزك الطبي في منصة طبيبي (Tabibi) — Gaza, Palestine.',
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'تسجيل منشأة', url: '/register-facility' }],
  },
  '/login': {
    title: 'تسجيل الدخول — طبيبي Tabibi',
    description: 'سجّل الدخول إلى منصة طبيبي (Tabibi).',
    noindex: false,
    breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'تسجيل الدخول', url: '/login' }],
  },
};

const NOINDEX_PREFIXES = ['/admin', '/doctor', '/pharmacy-dashboard', '/lab-dashboard', '/medical-center-dashboard', '/my-', '/medical-history', '/chats', '/financial-transactions', '/favorites', '/cart', '/notifications', '/medical-files', '/my-prescriptions', '/appointment/', '/payment/', '/qr/'];

function matchConfig(pathname) {
  if (SEO_CONFIG[pathname]) return SEO_CONFIG[pathname];
  // prefix matches for dynamic routes
  if (pathname.startsWith('/doctors/')) return SEO_CONFIG['/doctors'];
  if (pathname.startsWith('/appointment/')) return { title: 'حجز موعد — طبيبي Tabibi', description: 'احجز موعدك مع طبيب عبر طبيبي (Tabibi).', breadcrumb: [{ name: 'الرئيسية', url: '/' }, { name: 'حجز موعد', url: pathname }] };
  return SEO_CONFIG['/'];
}

function isNoindex(pathname) {
  return NOINDEX_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}

export default function SEOManager() {
  const { pathname } = useLocation();
  const noindex = isNoindex(pathname);
  const cfg = noindex ? { title: 'طبيبي Tabibi', description: '', noindex: true } : matchConfig(pathname);

  const breadcrumbJsonLd = !noindex && cfg.breadcrumb
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: cfg.breadcrumb.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: `${SITE}${b.url}`,
        })),
      }
    : null;

  useSEO({
    title: cfg.title,
    description: cfg.description,
    path: pathname,
    noindex,
    jsonLd: breadcrumbJsonLd,
  });

  return null;
}
