import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets_frontend/assets';

const Login = () => {
  const { backendUrl, setToken } = useContext(AppContext);

  // إدارة حالات التنقل بين الواجهات
  const [state, setState] = useState('Login');

  // بيانات تسجيل الدخول العامة
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // بيانات المريض والطبيب المشتركة
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // بيانات خاصة بالمريض
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // بيانات خاصة بالطبيب
  const [specialty, setSpecialty] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [whyJoin, setWhyJoin] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // بيانات تعيين كلمة المرور الجديدة
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // شروط إظهار كلمة المرور برمجياً
  const [showPassword, setShowPassword] = useState(false);

  // دالة مساعدة لتغيير الحالة وتصفير الحقول لمنع تداخل البيانات
  const handleStateChange = (newState) => {
    setState(newState);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setGender('');
    setAddress('');
    setSpecialty('');
    setExperienceYears('');
    setCvFile(null);
    setIdFile(null);
    setWhyJoin('');
    setNewPassword('');
    setConfirmPassword('');
    setAgreeToTerms(false);
  };

  // معالج الإرسال الموحد لكل الحالات
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // التحقق من الموافقة على الشروط في واجهات التسجيل
    if ((state === 'RegisterDoctor' || state === 'RegisterPatient') && !agreeToTerms) {
      toast.error('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.');
      return;
    }

    try {
      if (state === 'Login') {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('تم تسجيل الدخول بنجاح');
        } else {
          toast.error(data.message);
        }
      }

      else if (state === 'RegisterPatient') {
        const patientData = {
          name: `${firstName} ${lastName}`,
          email,
          password,
          phone,
          gender,
          address
        };
        const { data } = await axios.post(`${backendUrl}/api/user/register`, patientData);
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('تم تسجيل حساب المريض بنجاح');
        } else {
          toast.error(data.message);
        }
      }

      else if (state === 'RegisterDoctor') {
        const formData = new FormData();
        formData.append('name', `${firstName} ${lastName}`);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('specialty', specialty);
        formData.append('experience', experienceYears);
        formData.append('whyJoin', whyJoin);
        if (additionalNotes) formData.append('notes', additionalNotes);
        if (cvFile) formData.append('cv', cvFile);
        if (idFile) formData.append('idCard', idFile);

        const { data } = await axios.post(`${backendUrl}/api/doctor/register`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (data.success) {
          toast.success('تم إرسال طلب الانضمام كطبيب بنجاح، وهو قيد المراجعة حالياً.');
          handleStateChange('Login');
        } else {
          toast.error(data.message);
        }
      }

      else if (state === 'ForgotPassword') {
        const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
        if (data.success) {
          toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
          handleStateChange('ResetPassword');
        } else {
          toast.error(data.message);
        }
      }

      else if (state === 'ResetPassword') {
        if (newPassword !== confirmPassword) {
          toast.error('كلمات المرور غير متطابقة!');
          return;
        }
        if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
          toast.error('يرجى التأكد من استيفاء جميع متطلبات كلمة المرور.');
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { password: newPassword });
        if (data.success) {
          toast.success('تم تحديث كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن.');
          handleStateChange('Login');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Cairo']" dir="rtl">
      <div className={`w-full ${['RegisterDoctor', 'RegisterPatient'].includes(state) ? 'max-w-5xl' : 'max-w-4xl'} bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-150`}>

        {/* النصف الايمن: محتوى النماذج والواجهات التفاعلية */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <form onSubmit={onSubmitHandler} className="w-full space-y-6">

            {/* 1. واجهة تسجيل الدخول الرئيسية */}
            {state === 'Login' && (
              <>
                <div className="text-right space-y-2 mb-4">
                  <img
                    className='h-9 sm:h-11 md:h-13 w-auto cursor-pointer object-contain transform hover:scale-105 transition-all duration-300'
                    src={assets.logo}
                    alt="شعار طبيبي"
                  />
                  <h2 className="text-3xl font-black text-slate-800">أهلاً بك مجدداً</h2>
                  <p className="text-sm text-slate-500 font-bold">قم بتسجيل الدخول للوصول إلى سجلاتك الطبية ومواعيدك.</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني</label>
                    <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-sm text-slate-800 font-medium" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
                      <span onClick={() => setState("ForgotPassword")} className="text-xs font-bold text-[#3a96b7] hover:underline cursor-pointer">نسيت كلمة المرور؟</span>
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-sm text-slate-800" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "إخفاء" : "إظهار"}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#0c2340] hover:bg-[#1a3a60] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer">
                  تسجيل الدخول
                </button>

                <p className="text-xs text-center font-bold text-slate-600 pt-2">
                  ليس لديك حساب؟ <span className="text-[#3a96b7] underline cursor-pointer" onClick={() => setState("RoleSelection")}>إنشاء حساب جديد</span>
                </p>
              </>
            )}

            {/* 2. واجهة اختيار نوع الحساب */}
            {state === "RoleSelection" && (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-slate-800">اختر نوع الحساب للمتابعة</h2>
                  <p className="text-xs text-slate-400 font-bold">نحن هنا لتقديم خدمات صحية رقمية متطورة.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div className="border border-slate-200 hover:border-[#3a96b7] rounded-2xl p-5 text-center space-y-3 transition-all bg-slate-50/50">
                    <h3 className="text-base font-black text-slate-800">بوابة المرضى</h3>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">حجز المواعيد، متابعة الفحوصات، وتصفح سجلاتك الطبية بكل سرية وأمان.</p>
                    <button type="button" onClick={() => setState("RegisterPatient")} className="w-full bg-[#0c2340] hover:bg-[#1a3a60] text-white text-xs font-bold py-2 rounded-xl transition-all">التسجيل كمريض</button>
                  </div>

                  <div className="border border-slate-200 hover:border-[#3a96b7] rounded-2xl p-5 text-center space-y-3 transition-all bg-slate-50/50">
                    <h3 className="text-base font-black text-slate-800">بوابة الأطباء</h3>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">إدارة مواعيد العيادة، معاينة سجلات المرضى، وتقديم استشارات طبية رقمية.</p>
                    <button type="button" onClick={() => setState("RegisterDoctor")} className="w-full bg-[#3a96b7] hover:bg-[#2c7792] text-white text-xs font-bold py-2 rounded-xl transition-all">التقديم للانضمام كطبيب</button>
                  </div>
                </div>

                <p className="text-xs text-center font-bold text-slate-600 pt-2">
                  لديك حساب بالفعل؟ <span className="text-[#3a96b7] underline cursor-pointer" onClick={() => setState("Login")}>سجل دخولك هنا</span>
                </p>
              </>
            )}

            {/* 3. واجهة التسجيل كطبيب */}
            {state === "RegisterDoctor" && (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1 scrollbar-thin">
                <div>
                  <h2 className="text-xl font-black text-slate-800">التسجيل كطبيب شريك</h2>
                  <p className="text-xs text-slate-400 font-bold">يرجى ملء الحقول المهنية بدقة لتوثيق ملفك المعتمد.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">الاسم الأول *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">الاسم الأخير *</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">البريد الإلكتروني *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهاتف *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" placeholder="+970" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">كلمة المرور *</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">التخصص الطبي *</label>
                    <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs bg-white" required>
                      <option value="">اختر التخصص...</option>
                      <option value="General">طب عام</option>
                      <option value="Cardiology">أخصائي قلب</option>
                      <option value="Pediatrics">طب أطفال</option>
                      <option value="Dermatology">جلدية وتجميل</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">سنوات الخبرة *</label>
                    <input type="number" min="0" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center relative bg-slate-50 hover:border-[#3a96b7] transition-all">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setCvFile(e.target.files[0])} required />
                    <span className="text-[11px] font-bold text-slate-700 block">📄 السيرة الذاتية *</span>
                    <p className="text-[9px] text-slate-400 mt-1 truncate">{cvFile ? cvFile.name : "اضغط للرفع PDF"}</p>
                  </div>
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center relative bg-slate-50 hover:border-[#3a96b7] transition-all">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setIdFile(e.target.files[0])} required />
                    <span className="text-[11px] font-bold text-slate-700 block">🪪 مزاولة المهنة *</span>
                    <p className="text-[9px] text-slate-400 mt-1 truncate">{idFile ? idFile.name : "اضغط للرفع لقطة"}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">نبذة عن طموحك المهني معنا *</label>
                  <textarea value={whyJoin} onChange={(e) => setWhyJoin(e.target.value)} rows="2" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none" required></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} id="termsDoc" className="w-4 h-4 text-[#3a96b7] border-slate-300 rounded focus:ring-[#3a96b7]" required />
                  <label htmlFor="termsDoc" className="text-xs font-bold text-slate-500 select-none">أوافق على الشروط والسياسات</label>
                </div>

                <button type="submit" className="w-full bg-[#3a96b7] hover:bg-[#2c7792] text-white font-bold py-2.5 rounded-xl text-xs transition-all">إرسال طلب التوثيق</button>
                <p className="text-xs text-center font-bold text-slate-600">لديك حساب؟ <span className="text-[#3a96b7] underline cursor-pointer" onClick={() => handleStateChange("Login")}>سجل دخولك</span></p>
              </div>
            )}

            {/* 4. واجهة التسجيل كمريض */}
            {state === "RegisterPatient" && (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1 scrollbar-thin">
                <div className="text-center">
                  <img className="h-10 w-auto mx-auto object-contain mb-3" src={assets.logo} alt="شعار طبيبي" />
                  <h2 className="text-xl font-black text-slate-800">إنشاء حساب مريض جديد</h2>
                  <p className="text-xs text-slate-400 font-bold">املأ بياناتك لفتح ملفك الطبي الرقمي الفوري.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">الاسم الأول *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">الاسم الأخير *</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">البريد الإلكتروني *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">كلمة المرور *</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهاتف *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">الجنس *</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs bg-white" required>
                      <option value="">اختر...</option>
                      <option value="Male">ذكر</option>
                      <option value="Female">أنثى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">العنوان السكني الحالي *</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-xs" placeholder="المدينة، الشارع" required />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} id="termsPatient" className="w-4 h-4 text-[#3a96b7] border-slate-300 rounded focus:ring-[#3a96b7]" required />
                  <label htmlFor="termsPatient" className="text-xs font-bold text-slate-500 select-none">أوافق على شروط الاستخدام وسياسة البيانات</label>
                </div>

                <button type="submit" className="w-full bg-[#0c2340] hover:bg-[#1a3a60] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all">تأكيد الحساب المريض</button>
                <p className="text-xs text-center font-bold text-slate-600">لديك حساب بالفعل؟ <span className="text-[#3a96b7] underline cursor-pointer" onClick={() => handleStateChange("Login")}>سجل الدخول الآن</span></p>
              </div>
            )}

            {/* 5. واجهة نسيت كلمة المرور */}
            {state === 'ForgotPassword' && (
              <>
                <div className="text-right space-y-2 mb-4">
                  <h2 className="text-3xl font-black text-slate-800">إعادة كلمة المرور</h2>
                  <p className="text-sm text-slate-500 font-bold">أدخل بريدك الإلكتروني المسجل لإرسال رابط إعادة تعيين كلمة المرور.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-slate-800"
                      placeholder="name@clinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#0c2340] hover:bg-[#1a3a60] text-white font-black py-3.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2">
                  إرسال الرابط
                </button>

                <p className="text-sm text-center font-bold text-slate-600 pt-2">
                  <span className="text-[#3a96b7] underline cursor-pointer" onClick={() => handleStateChange('Login')}>العودة لتسجيل الدخول</span>
                </p>
              </>
            )}

            {/* 6. واجهة تعيين كلمة مرور جديدة */}
            {state === 'ResetPassword' && (
              <>
                <div className="text-right space-y-2 mb-4">
                  <h2 className="text-3xl font-black text-slate-800">تعيين كلمة مرور جديدة</h2>
                  <p className="text-sm text-slate-500 font-bold">يرجى إدخال كلمة المرور الجديدة وتأكيدها بشكل صحيح.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-slate-800"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3a96b7] focus:border-transparent transition-all outline-none text-slate-800"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2 font-bold text-slate-500">
                    <p className="text-slate-700 font-black mb-1">متطلبات كلمة المرور:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>تحتوي على 8 رموز على الأقل</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>تحتوي على رقم واحد على الأقل</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>تحتوي على حرف كبير واحد على الأقل</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#0c2340] hover:bg-[#1a3a60] text-white font-black py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  تحديث كلمة المرور <span>←</span>
                </button>
              </>
            )}

          </form>
        </div>

        {/* النصف الايسر: تم ضبط وضوح الخلفية الزجاجية والتباين العالي بناءً على لون اللوجو الداكن */}
        <div className="w-full md:w-1/2 bg-[#0c2340] p-12 flex flex-col justify-between text-white relative">
          
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
            alt="Medical Clinic Design"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
          />
          
          {/* طبقة تدرج داكنة تعتمد على الكحلي الأساسي #0c2340 لتأكيد التباين */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a81dccc] via-transparent to-[#0C65A9CC]/80 pointer-events-none"></div>
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none'></div>

          <div className="relative z-10 flex flex-col items-center mt-8">
            <h3 className="text-2xl font-black text-center mb-4 leading-snug text-white drop-shadow-md">
              {state === 'Login' && 'رعاية صحية ذكية بلمسة إنسانية'}
              {state === 'RoleSelection' && 'انضم إلى عائلة طبيبي الرائدة'}
              {state === 'RegisterDoctor' && 'أهلاً بك دكتور في منصة طبيبي'}
              {state === 'RegisterPatient' && 'ملفك الطبي متاح دائماً وبأمان'}
              {state === 'ForgotPassword' && 'أمان حسابك أولويتنا دائماً'}
              {state === 'ResetPassword' && 'حماية حسابك تبدأ من هنا'}
            </h3>
            
            <p className="text-sm text-slate-200 text-center font-medium max-w-xs leading-relaxed drop-shadow-sm">
              {state === 'Login' && 'نحن نجمع بين أحدث التقنيات الطبية والاهتمام الشخصي لضمان أفضل تجربة علاجية لك ولعائلتك.'}
              {state === 'RoleSelection' && 'الرجاء اختيار نوع الحساب للمتابعة، نحن هنا لتقديم أفضل تجربة رعاية صحية رقمية متكاملة.'}
              {state === 'RegisterDoctor' && 'يرجى تزويدنا ببياناتك المهنية لنقلك إلى لوحة التحكم الخاصة بك وتأكيد حسابك.'}
              {state === 'RegisterPatient' && 'سجل حسابك الآن لتتمكن من حجز مواعيدك الطبية الفورية مع نخبة الأطباء المتخصصين.'}
              {state === 'ForgotPassword' && 'سنساعدك في استعادة الوصول إلى حسابك بأمان وسرعة عبر خطوات بسيطة.'}
              {state === 'ResetPassword' && 'يرجى اختيار كلمة مرور قوية ومعقدة لضمان أمان بياناتك الطبية والشخصية.'}
            </p>
          </div>

          {(state === 'Login' || state === 'RegisterPatient') && (
            <div className="grid grid-cols-2 gap-4 relative z-10 mt-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shadow-lg">
                <h5 className="text-xl font-black text-[#3a96b7]">+15</h5>
                <p className="text-xs text-slate-200 font-bold">طبيب متخصص</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shadow-lg">
                <h5 className="text-xl font-black text-emerald-400">24/7</h5>
                <p className="text-xs text-slate-200 font-bold">دعم طبي مباشر</p>
              </div>
            </div>
          )}
          
          <div className="text-xs text-slate-300 text-center relative z-10 mt-4 font-medium">سياسة الخصوصية  •  شروط الاستخدام</div>
        </div>

      </div>
    </div>
  );
};

export default Login;