import { useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

const faqGroups = [
  {
    title: 'الحساب واستخدام المنصة',
    items: [
      {
        question: 'كيف يمكنني إنشاء حساب جديد في طبيبي؟',
        answer: 'اضغط على زر «إنشاء حساب» من أعلى الصفحة، ثم أدخل البيانات المطلوبة مثل الاسم ورقم الجوال أو البريد الإلكتروني، وبعدها أكّد بياناتك لإتمام التسجيل.',
      },
      {
        question: 'هل أحتاج إلى حساب لاستخدام جميع خدمات المنصة؟',
        answer: 'يمكنك تصفح بعض المعلومات العامة دون حساب، لكن حجز المواعيد وإدارة الطلبات وحفظ بياناتك يحتاج إلى حساب شخصي.',
      },
      {
        question: 'ماذا أفعل إذا نسيت كلمة المرور؟',
        answer: 'من صفحة تسجيل الدخول اختر «نسيت كلمة المرور»، وأدخل رقم الجوال أو البريد المسجل. ستصلك خطوات آمنة لإعادة تعيين كلمة المرور.',
      },
    ],
  },
  {
    title: 'المواعيد والاستشارات',
    items: [
      {
        question: 'كيف أحجز موعداً مع طبيب؟',
        answer: 'ابحث عن الطبيب أو التخصص المناسب، اختر الموعد المتاح، ثم راجع التفاصيل وأكّد الحجز. ستظهر لك رسالة تأكيد داخل حسابك.',
      },
      {
        question: 'هل يمكنني إلغاء أو تعديل موعدي؟',
        answer: 'نعم، من قسم «مواعيدي» في حسابك يمكنك طلب التعديل أو الإلغاء ضمن المدة التي يحددها الطبيب أو الجهة الصحية.',
      },
      {
        question: 'هل الاستشارة عبر المنصة بديل عن زيارة الطوارئ؟',
        answer: 'لا. في الحالات الطارئة أو الأعراض الخطيرة يجب التواصل فوراً مع خدمات الطوارئ أو التوجه إلى أقرب مركز طوارئ. المنصة لا تحل محل الرعاية الطبية العاجلة.',
      },
    ],
  },
  {
    title: 'الخصوصية والدعم',
    items: [
      {
        question: 'كيف تُحمى بياناتي الشخصية؟',
        answer: 'نستخدم ضوابط تنظيمية وتقنية لحماية البيانات، ونجمع فقط ما يلزم لتشغيل الخدمات. راجع سياسة الخصوصية لمزيد من التفاصيل.',
      },
      {
        question: 'كيف أتواصل مع فريق الدعم؟',
        answer: 'يمكنك استخدام صفحة «تواصل معنا» أو إرسال طلب من مركز المساعدة داخل حسابك. أرفق وصفاً واضحاً للمشكلة كي نتمكن من مساعدتك بسرعة.',
      },
    ],
  },
]

const privacySections = [
  ['1. مقدمة', 'توضح هذه السياسة كيفية تعامل منصة طبيبي مع البيانات الشخصية عند استخدام الموقع أو الخدمات المرتبطة به. نلتزم باحترام خصوصية المستخدمين واتخاذ إجراءات معقولة لحماية معلوماتهم.'],
  ['2. البيانات التي قد نجمعها', 'قد نجمع بيانات التسجيل والتواصل، والبيانات اللازمة لإدارة الحساب وحجز المواعيد واستخدام الخدمات، إلى جانب بيانات تقنية مثل نوع الجهاز وسجل الاستخدام عند الحاجة لتحسين الخدمة وحمايتها.'],
  ['3. كيف نستخدم البيانات', 'نستخدم البيانات لتقديم الخدمات المطلوبة، إدارة الحسابات والمواعيد، التواصل مع المستخدم، تحسين تجربة الاستخدام، منع إساءة الاستخدام، والوفاء بالالتزامات القانونية عند الاقتضاء.'],
  ['4. مشاركة البيانات', 'لا نبيع البيانات الشخصية. قد نشارك الحد الأدنى اللازم من البيانات مع مقدمي الخدمات أو الجهات الصحية ذات العلاقة عندما يكون ذلك ضرورياً لتقديم الخدمة أو مطلوباً بموجب القانون.'],
  ['5. حماية البيانات', 'نطبق تدابير تقنية وتنظيمية معقولة لحماية البيانات من الوصول غير المصرح به أو الفقد أو الاستخدام غير السليم. ومع ذلك، لا يمكن ضمان أمان أي نظام إلكتروني بنسبة مطلقة.'],
  ['6. حقوقك وخياراتك', 'يمكنك طلب تحديث بياناتك أو تصحيحها، والاستفسار عن طريقة استخدام البيانات، أو طلب حذف الحساب وفقاً للضوابط القانونية والتشغيلية المعمول بها.'],
  ['7. التحديثات على السياسة', 'قد نحدّث هذه السياسة من وقت إلى آخر. عند وجود تغيير جوهري، سيتم نشر النسخة المحدثة عبر المنصة مع تعديل تاريخ آخر تحديث.'],
]

const termsSections = [
  ['1. قبول سياسة الاستخدام', 'باستخدامك منصة طبيبي، فإنك توافق على الالتزام بهذه السياسة وبالقوانين واللوائح السارية. إذا لم توافق على أي جزء منها، يرجى عدم استخدام المنصة.'],
  ['2. طبيعة الخدمة', 'توفر المنصة أدوات ومعلومات لتسهيل الوصول إلى الخدمات الصحية وإدارة المواعيد والتواصل المتعلق بها. لا تمثل المعلومات المنشورة بديلاً عن التشخيص أو العلاج الطبي المباشر.'],
  ['3. مسؤولية المستخدم', 'يلتزم المستخدم بتقديم بيانات صحيحة، والمحافظة على سرية بيانات الدخول، وعدم استخدام المنصة في أي نشاط غير مشروع أو يسبب ضرراً للمنصة أو للمستخدمين الآخرين.'],
  ['4. الحالات الطارئة', 'في الحالات الطارئة أو عند ظهور أعراض خطيرة، يجب التواصل فوراً مع خدمات الطوارئ أو التوجه إلى أقرب مركز طوارئ. لا يجوز الاعتماد على المنصة كبديل للرعاية الطبية العاجلة.'],
  ['5. المحتوى والملكية الفكرية', 'جميع المحتويات والتصاميم والشعارات والعناصر البرمجية في المنصة محمية بحقوق الملكية الفكرية. لا يجوز نسخها أو إعادة استخدامها دون موافقة مسبقة من الجهة المالكة.'],
  ['6. إيقاف أو تعديل الخدمة', 'يجوز للمنصة تعديل الخدمات أو تعليقها أو إيقاف بعض الوظائف عند الحاجة التشغيلية أو الأمنية أو القانونية، مع محاولة إخطار المستخدمين عندما يكون ذلك مناسباً.'],
  ['7. حدود المسؤولية', 'ضمن الحدود التي يسمح بها القانون، لا تتحمل المنصة مسؤولية الأضرار الناتجة عن الاستخدام غير الصحيح للخدمة أو عن المعلومات التي يقدمها المستخدم أو الطرف الثالث.'],
  ['8. التعديلات على السياسة', 'قد يتم تعديل هذه السياسة من وقت إلى آخر. استمرار استخدام المنصة بعد نشر التعديلات يعني قبول النسخة المحدثة.'],
]

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container navbar">
          <Link className="brand" to="/" onClick={closeMenu} aria-label="العودة إلى الصفحة الرئيسية">
            <img src="/logoHorizontal.svg" alt="شعار طبيبي" />
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="فتح أو إغلاق القائمة"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>

          <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="التنقل الرئيسي">
            <NavLink to="/" end onClick={closeMenu}>الرئيسية</NavLink>
            <a href="#doctors" onClick={closeMenu}>الأطباء</a>
            <a href="#about" onClick={closeMenu}>من نحن</a>
            <a href="#contact" onClick={closeMenu}>تواصل معنا</a>
            <NavLink to="/faq" onClick={closeMenu}>الأسئلة الشائعة</NavLink>
          </nav>

          <div className="header-actions">
            <a className="button button-outline" href="#login">تسجيل دخول</a>
            <a className="button button-primary" href="#signup">إنشاء حساب</a>
          </div>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/logoHorizontal.svg" alt="شعار طبيبي" />
            <p>منصة طبيبي تساعدك على الوصول إلى المعلومات والخدمات الصحية بطريقة أوضح وأسهل.</p>
          </div>
          <div>
            <h2 className="footer-heading">روابط مهمة</h2>
            <ul className="footer-links">
              <li><Link to="/faq">الأسئلة الشائعة</Link></li>
              <li><Link to="/privacy-policy">سياسة الخصوصية</Link></li>
              <li><Link to="/terms-of-use">سياسة الاستخدام</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">هل تحتاج مساعدة؟</h2>
            <ul className="footer-links">
              <li><a href="#contact">تواصل مع الدعم الفني</a></li>
              <li><a href="#report">الإبلاغ عن مشكلة</a></li>
              <li><a href="#help">مركز المساعدة</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© 2026 طبيبي — جميع الحقوق محفوظة.</div>
      </footer>
    </div>
  )
}

function Hero({ title, description, crumb, icon }) {
  return (
    <section className="page-hero">
      <div className="container hero-grid">
        <div>
          <ol className="breadcrumb">
            <li><Link to="/">الرئيسية</Link></li>
            <li>/</li>
            <li>{crumb}</li>
          </ol>
          <h1 className="hero-title">{title}</h1>
          <p className="hero-copy">{description}</p>
        </div>
        <div className="hero-mark" aria-hidden="true">{icon}</div>
      </div>
    </section>
  )
}

function FaqPage() {
  const [search, setSearch] = useState('')
  const [openItem, setOpenItem] = useState('0-0')

  const normalizedSearch = search.trim().toLowerCase()
  const visibleGroups = useMemo(() => {
    if (!normalizedSearch) return faqGroups
    return faqGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(({ question, answer }) =>
          `${question} ${answer}`.toLowerCase().includes(normalizedSearch),
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [normalizedSearch])

  return (
    <>
      <Hero
        crumb="الأسئلة الشائعة"
        title="الأسئلة الشائعة"
        description="إجابات سريعة وواضحة لأكثر الأسئلة المتكررة حول استخدام منصة طبيبي."
        icon="؟"
      />
      <main className="page-main">
        <div className="container faq-layout">
          <label className="search-box" htmlFor="faq-search">
            <span aria-hidden="true">⌕</span>
            <input
              id="faq-search"
              type="search"
              placeholder="ابحث عن سؤال أو كلمة مفتاحية..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          {visibleGroups.map((group, groupIndex) => (
            <section key={group.title} className="faq-section">
              <h2 className="faq-category">{group.title}</h2>
              <div className="faq-list">
                {group.items.map((item, itemIndex) => {
                  const id = `${groupIndex}-${itemIndex}`
                  const isOpen = openItem === id
                  return (
                    <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() => setOpenItem(isOpen ? '' : id)}
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && <div className="faq-answer"><p>{item.answer}</p></div>}
                    </article>
                  )
                })}
              </div>
            </section>
          ))}

          {visibleGroups.length === 0 && (
            <div className="empty-state">لم نعثر على نتائج مطابقة. جرّب كلمة بحث مختلفة.</div>
          )}
        </div>
      </main>
    </>
  )
}

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? 'سياسة الخصوصية' : 'سياسة الاستخدام'
  const description = isPrivacy
    ? 'تعرّف على كيفية جمع بياناتك واستخدامها وحمايتها عند استخدام منصة طبيبي.'
    : 'يرجى قراءة هذه السياسة لمعرفة القواعد التي تنظّم استخدام منصة طبيبي وخدماتها.'
  const sections = isPrivacy ? privacySections : termsSections

  return (
    <>
      <Hero
        crumb={title}
        title={title}
        description={description}
        icon={isPrivacy ? '⌑' : '✓'}
      />
      <main className="page-main">
        <article className="container legal-card">
          <div className="legal-meta">
            <span>آخر تحديث: 20 يونيو 2026</span>
            <span className="legal-badge">طبيبي</span>
          </div>
          <div className="legal-notice">
            <strong>تنبيه مهم:</strong> هذا النص نموذج واجهة للمشروع. قبل نشر المنصة بشكل فعلي يجب مراجعته قانونياً وإكمال بيانات الجهة المالكة ووسائل التواصل.
          </div>
          {sections.map(([heading, body]) => (
            <section className="legal-section" key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
          <section className="legal-section legal-contact">
            <h2>التواصل معنا</h2>
            <p>للاستفسارات المتعلقة بهذه السياسة، تواصل مع فريق طبيبي من خلال صفحة التواصل أو مركز المساعدة داخل حسابك.</p>
            <Link className="button button-primary" to="/faq">الانتقال إلى الأسئلة الشائعة</Link>
          </section>
        </article>
      </main>
    </>
  )
}

function HomePage() {
  return (
    <main className="home-placeholder">
      <section className="container home-card">
        <img src="/logo.svg" alt="طبيبي" />
        <h1>واجهة طبيبي الأمامية</h1>
        <p>تم تجهيز صفحات الأسئلة الشائعة وسياسة الخصوصية وسياسة الاستخدام داخل مشروع React.</p>
        <div className="home-links">
          <Link className="button button-primary" to="/faq">الأسئلة الشائعة</Link>
          <Link className="button button-outline" to="/privacy-policy">سياسة الخصوصية</Link>
        </div>
      </section>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="home-placeholder">
      <section className="container home-card">
        <h1>الصفحة غير موجودة</h1>
        <p>الرابط الذي فتحته غير صحيح أو تم نقله.</p>
        <Link className="button button-primary" to="/">العودة للرئيسية</Link>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
        <Route path="/terms-of-use" element={<LegalPage type="terms" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
