import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        label: 'طبيب عام',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        label: 'نسائية وتوليد',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        label: 'جلدية وتجميل',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        label: 'طب الأطفال',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        label: 'مخ وأعصاب',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        label: 'جهاز هضمي',
        image: Gastroenterologist
    },
]


export const reviewsData = [
    {
        id: 1,
        patient: 'أحمد السامرائي',
        date: 'منذ يومين',
        clinic: 'عيادة المخ والأعصاب',
        text: 'تجربة حجز استثنائية وسلسة جداً. تمكنت من العثور على استشاري متخصص وتثبيت الموعد خلال أقل من دقيقتين بدون الحاجة للانتظار في الهاتف أو مراجعة المركز يدوياً.',
        avatar: '👨‍💼',
        rating: '⭐⭐⭐⭐⭐'
    },
    {
        id: 2,
        patient: 'د. سارة الهاشمي',
        date: 'منذ أسبوع',
        clinic: 'عيادة الأطفال',
        text: 'المنصة ممتازة ومنظمة بصرياً بشكل مريح. الطبيب كان في غاية الاحترافية والتذكير التلقائي بالمواعيد عبر النظام يمنع أي نسيان. أنصح بها بشدة لكل العائلات.',
        avatar: '👩‍⚕️',
        rating: '⭐⭐⭐⭐⭐'
    },
    {
        id: 3,
        patient: 'عمر التميمي',
        date: 'منذ ٣ أيام',
        clinic: 'الباطنية والجهاز الهضمي',
        text: 'لوحة التحكم واضحة وسريعة الاستجابة، الفلاتر المتاحة ساعدتني في العثور على طبيب متاح في نفس اليوم ومناسب لموقعي الجغرافي تماماً. رعاية رقمية ممتازة.',
        avatar: '👨‍💻',
        rating: '⭐⭐⭐⭐'
    }
];

export const doctors = [
    {
        _id: 'doc1',
        name: 'د. أحمد الريس',
        image: doc1,
        speciality: 'General physician',
        degree: 'بكالوريوس الطب والجراحة',
        experience: '4 سنوات',
        about: 'د. أحمد لديه التزام قوي بتقديم رعاية طبية شاملة، مع التركيز على الطب الوقائي، التشخيص المبكر، ووضع خطط علاجية فعالة ومخصصة لكل مريض لضمان حياة صحية أفضل.',
        fees: 40,
        address: {
            line1: 'شارع الرشيد، مقابل الفندق الكبير',
            line2: 'المنطقة الوسطى، دير البلح'
        }
    },
    {
        _id: 'doc2',
        name: 'د. سارة المنصوري',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'ماجستير أمراض النساء والتوليد',
        experience: '3 سنوات',
        about: 'تتميز د. سارة بخبرتها المتميزة في متابعة الحمل الحرج، رعاية الأمومة، وتقديم الاستشارات الطبية الدقيقة بأحدث الوسائل والتقنيات الطبية المتاحة.',
        fees: 60,
        address: {
            line1: 'شارع عمر المختار، برج الشفاء الطبى',
            line2: 'الطابق الثالث، غزة'
        }
    },
    {
        _id: 'doc3',
        name: 'د. كريم جلال',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'دبلوم الأمراض الجلدية والليزر',
        experience: 'سنة واحدة',
        about: 'يختص د. كريم في علاج المشاكل الجلدية الشائعة والمتقدمة، والعناية بالبشرة باستخدام أحدث تقنيات الليزر العلاجي والتجميلي بأعلى معايير الأمان.',
        fees: 50,
        address: {
            line1: 'الشارع العام، بجوار الصيدلية المركزية',
            line2: 'النصيرات'
        }
    },
    {
        _id: 'doc4',
        name: 'د. خالد العمراني',
        image: doc4,
        speciality: 'Neurologist',
        degree: 'دكتوراه في جراحة وجراحة الأعصاب',
        experience: '4 سنوات',
        about: 'خبير في تشخيص وعلاج اضطرابات الجهاز العصبي المركزي والطرفي، الصداع المزمن، ومتابعة حالات السكتات الدماغية والعمود الفقري.',
        fees: 80,
        address: {
            line1: 'شارع الشهداء، برج الأمل الطبي',
            line2: 'الطابق الخامس، غزة'
        }
    },
    {
        _id: 'doc5',
        name: 'د. رانيا يوسف',
        image: doc5,
        speciality: 'Pediatricians',
        degree: 'البورد في طب الأطفال وحديثي الولادة',
        experience: '2 سنتين',
        about: 'كرست د. رانيا مسيرتها المهنية لمتابعة نمو الأطفال وصحتهم البدنية والنفسية، وتقديم التطعيمات والاستشارات الطبية الدورية لحديثي الولادة.',
        fees: 45,
        address: {
            line1: 'شارع صلاح الدين، مركز العائلة الطبي',
            line2: 'دير البلح'
        }
    },
    {
        _id: 'doc6',
        name: 'د. يوسف النجار',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'ماجستير أمراض المخ والأعصاب',
        experience: '4 سنوات',
        about: 'يقدم د. يوسف رعاية متكاملة لمرضى الأعصاب والصرع والاضطرابات الحركية، مع التركيز على الفحص الإكلينيكي الدقيق والتشخيص عبر الرنين والمخططات الطبية.',
        fees: 70,
        address: {
            line1: 'امتداد شارع البحر، عمارة النور',
            line2: 'دير البلح'
        }
    },
    {
        _id: 'doc7',
        name: 'د. طارق الحكيم',
        image: doc7,
        speciality: 'General physician',
        degree: 'بكالوريوس الطب العام',
        experience: '4 سنوات',
        about: 'طبيب العائلة الموثوق لتقديم الفحوصات الدورية، علاج الأمراض المزمنة مثل الضغط والسكري، والتوجيه السليم للتخصصات الطبية عند الحاجة.',
        fees: 30,
        address: {
            line1: 'محيط ميدان الشهداء، عيادة ابن سينا',
            line2: 'النصيرات'
        }
    },
    {
        _id: 'doc8',
        name: 'د. منير حداد',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'زمالة كلية الجراحين الملكية - نساء وتوليد',
        experience: '3 سنوات',
        about: 'أخصائي خبير في جراحات المناظير النسائية، تنظيم الأسرة، ومتابعة صحة المرأة في كافة المراحل العمرية بخصوصية واحترافية مطلقة.',
        fees: 65,
        address: {
            line1: 'شارع العشرين، المجمع الطبي الحديث',
            line2: 'النصيرات'
        }
    },
    {
        _id: 'doc9',
        name: 'د. ميساء علي',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'ماجستير الجلدية والتناسلية',
        experience: 'سنة واحدة',
        about: 'تختص د. ميساء في علاج تساقط الشعر، حب الشباب، الحساسية المزمنة، وتقديم برامج علاجية مخصصة لنضارة البشرة وحمايتها.',
        fees: 40,
        address: {
            line1: 'شارع النخيل، عمارة القدس التخصصية',
            line2: 'دير البلح'
        }
    },
    {
        _id: 'doc10',
        name: 'د. هاني القاضي',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'دبلوم عالي صحة الطفل',
        experience: '2 سنتين',
        about: 'عناية فائقة بالأطفال من عمر يوم وحتي 14 عام، علاج النزلات المعوية، أمراض الجهاز التنفسي لدى الأطفال وحالات الحساسية الصدرية.',
        fees: 35,
        address: {
            line1: 'محيط مسجد الهداية، العيادة التخصصية',
            line2: 'المغازي'
        }
    },
    {
        _id: 'doc11',
        name: 'د. سماح المصري',
        image: doc11,
        speciality: 'Gastroenterologist',
        degree: 'البورد العربي في أمراض الباطنة والجهاز الهضمي',
        experience: '4 سنوات',
        about: 'د. سماح متخصصة في تشخيص وعلاج مناظير المعدة والقولون، قرحة المعدة، ارتداد المريء، ومتابعة متلازمة القولون العصبي وأمراض الكبد.',
        fees: 55,
        address: {
            line1: 'شارع الجلاء، مجمع السرايا الطبي',
            line2: 'الطابق الثاني، غزة'
        }
    },
    {
        _id: 'doc12',
        name: 'د. سمير فاضل',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'بكالوريوس طب جراحة المخ والأعصاب',
        experience: '4 سنوات',
        about: 'متابعة دقيقة لأمراض الحبل الشوكي، آلام الظهر والرقبة الممتدة للأطراف، واعتلال الأعصاب الناتج عن مرض السكري.',
        fees: 75,
        address: {
            line1: 'الميدان الرئيسي، فوق بنك فلسطين',
            line2: 'دير البلح'
        }
    },
    {
        _id: 'doc13',
        name: 'د. مريم العوضي',
        image: doc13,
        speciality: 'Gynecologist',
        degree: 'شهادة الاختصاص العالي في أمراض النساء',
        experience: '3 سنوات',
        about: 'رعاية طبية متكاملة تشمل الكشف المبكر عن الأورام النسائية، علاج اضطرابات الهرمونات ومشاكل تأخر الإنجاب بأساليب طبية حديثة.',
        fees: 60,
        address: {
            line1: 'شارع أبو بكر الصديق، مركز رعاية المرأة',
            line2: 'دير البلح'
        }
    },
    {
        _id: 'doc14',
        name: 'د. بلال شاهين',
        image: doc14,
        speciality: 'General physician',
        degree: 'الطب الباطني العام والوقائي',
        experience: '4 سنوات',
        about: 'تقديم خدمات الرعاية الأولية الشاملة لجميع أفراد الأسرة، تشخيص الأمراض الحادة والمزمنة وتقديم خطط المتابعة الدورية الفعالة.',
        fees: 30,
        address: {
            line1: 'البلد، بالقرب من السوق المركزي',
            line2: 'البريج'
        }
    },
    {
        _id: 'doc15',
        name: 'د. دينا سليمان',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'أخصائية جراحة الأمراض الجلدية وتجميل الجلد',
        experience: 'سنة واحدة',
        about: 'متخصصة في إزالة الزوائد الجلدية، علاج الصدفية والبهاق، وتطبيق جلسات البلازما والميزوثيرابي لإعادة حيوية الشعر والبشرة.',
        fees: 45,
        address: {
            line1: 'شارع المحكمة، عمارة الاستشاريين',
            line2: 'المنطقة الوسطى'
        }
    },
]