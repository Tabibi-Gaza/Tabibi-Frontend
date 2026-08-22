import appointment_img from './appointment_img.webp'
import header_img from './header_img.webp'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.webp'
import contact_image from './contact_image.webp'
import about_image from './about_image.webp'
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
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


//Admin
import add_icon from './add_icon.svg'
import admin_logo from './admin_logo.svg'
import appointment_icon from './appointment_icon.svg'
import cancel_icon from './cancel_icon.svg'
import doctor_icon from './doctor_icon.svg'
import home_icon from './home_icon.svg'
import people_icon from './people_icon.svg'
import upload_area from './upload_area.svg'
import list_icon from './list_icon.svg'
import tick_icon from './tick_icon.svg'
import appointments_icon from './appointments_icon.svg'
import earning_icon from './earning_icon.svg'
import patients_icon from './patients_icon.svg'



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
    razorpay_logo,
//Admin Assets
 add_icon,
    admin_logo,
    appointment_icon,
    cancel_icon,
    doctor_icon,
    upload_area,
    home_icon,
    patients_icon,
    people_icon,
    list_icon,
    tick_icon,
    appointments_icon,
    earning_icon
}

export const specialityData = [
    {
        speciality: 'طبيب عام',
        image: General_physician
    },
    {
        speciality: 'نسائية وتوليد',
        image: Gynecologist
    },
    {
        speciality: 'جلدية وتجميل',
        image: Dermatologist
    },
    {
        speciality: 'طب الأطفال',
        image: Pediatricians
    },
    {
        speciality: 'مخ وأعصاب',
        image: Neurologist
    },
    {
        speciality: 'جهاز هضمي',
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
