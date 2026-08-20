import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets_frontend/assets';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { COUNTRIES, DEFAULT_COUNTRY } from '../constants/countries';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import OtpInput from '../components/OtpInput';

const PALESTINE_LOCATIONS = [
  "مدينة غزة",
  "شمال غزة",
  "جباليا",
  "بيت لاهيا",
  "بيت حانون",
  "النصيرات",
  "دير البلح",
  "البريج",
  "المغازي",
  "الزاهرة",
  "الشجاعية",
  "الشيخ رضوان",
  "القرارة",
  "خان يونس",
  "رفح",
];

const Login = () => {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const resetEmail = searchParams.get('email') || '';
  const resetToken = searchParams.get('token') || '';

  const [state, setState] = useState("Login");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpResetToken, setOtpResetToken] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [showCountries, setShowCountries] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  const passwordRules = [
    { label: 'تحتوي على 8 رموز على الأقل', test: (p) => p.length >= 8 },
    { label: 'تحتوي على حرف كبير وصغير', test: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
    { label: 'تحتوي على رقم واحد على الأقل', test: (p) => /\d/.test(p) },
    { label: 'تحتوي على رمز خاص واحد على الأقل', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  useEffect(() => {
    if (resetEmail && resetToken) {
      setState("ResetPassword");
      setEmail(resetEmail);
    }
  }, [resetEmail, resetToken]);

  useEffect(() => {
    if (searchParams.get('view') === 'register') {
      setState("RegisterPatient");
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.country-dropdown')) setShowCountries(false);
      if (!e.target.closest('.location-dropdown')) { setShowLocations(false); setLocationSearch(''); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStateChange = (newState) => {
    setState(newState);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setGender('');
    setAddress('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpResetToken('');
    setAgreeToTerms(false);
  };

  const navigateByRole = (roles, user) => {
    if (roles.includes("Admin")) {
      navigate('/admin-dashboard');
    } else if (roles.includes("Secretary")) {
      if (user.doctorId) {
        localStorage.setItem('doctorId', user.doctorId);
        navigate('/doctor-dashboard');
      } else {
        navigate('/');
      }
    } else if (roles.includes("Doctor")) {
      if (user.doctorId) {
        localStorage.setItem('doctorId', user.doctorId);
      } else if (user.id) {
        localStorage.setItem('doctorId', user.id);
      }
      navigate('/doctor-dashboard');
    } else {
      navigate('/');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'RegisterPatient' && !agreeToTerms) {
      toast.error('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.');
      return;
    }

    try {
      if (state === 'Login') {
        const { data } = await axiosInstance.post('/auth/login', { email, password });
        if (data.succeeded && data.data) {
          const { accessToken, user } = data.data.response || data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          setToken(accessToken);
          toast.success('تم تسجيل الدخول بنجاح');
          navigateByRole(user.roles, user);
        } else {
          toast.error(data.errors?.[0]?.message || data.message || 'فشل تسجيل الدخول');
        }
      }

      else if (state === 'RegisterPatient') {
        const { data } = await axiosInstance.post('/auth/register', {
          firstName,
          lastName,
          email,
          password,
          phoneNumber: phone.replace(selectedCountry.code, ''),
          gender: gender === "Male" ? 1 : 2,
          dateOfBirth: "2000-01-01",
          address,
          acceptPrivacyPolicy: true
        });
        if (data.succeeded && data.data) {
          const { accessToken, user } = data.data.response || data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          setToken(accessToken);
          toast.success('تم تسجيل حسابك بنجاح!');
          navigate('/');
        } else {
          const errorCode = data.errors?.[0]?.code;
          const errorMsg = data.errors?.[0]?.message || data.message || 'فشل التسجيل';
          if (errorCode === 'email_exists') {
            toast.error(errorMsg);
            handleStateChange('Login');
            setEmail(email);
          } else {
            toast.error(errorMsg);
          }
        }
      }

      else if (state === 'ForgotPassword') {
        const { data } = await axiosInstance.post('/auth/send-email-otp', { email });
        if (data.succeeded) {
          toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
          setState("OTPVerification");
        } else {
          toast.error(data.errors?.[0]?.message || data.message || 'حدث خطأ');
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

        const tokenToUse = otpResetToken || resetToken;
        const { data } = await axiosInstance.post('/auth/reset-password', {
          email: email,
          token: tokenToUse,
          newPassword
        });
        if (data.succeeded) {
          toast.success('تم تحديث كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن.');
          handleStateChange('Login');
        } else {
          toast.error(data.errors?.[0]?.message || data.message || 'حدث خطأ');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || error.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axiosInstance.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      if (data.succeeded && data.data) {
        const { accessToken, user } = data.data.response || data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(accessToken);
        toast.success('تم تسجيل الدخول بنجاح!');
        navigateByRole(user.roles);
      } else {
        toast.error(data.errors?.[0]?.message || data.message || 'فشل تسجيل الدخول بجوجل');
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'فشل تسجيل الدخول بجوجل');
    }
  };

  const handleGoogleError = () => {
    toast.error('فشل تسجيل الدخول بجوجل');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  return (
    <div className="bg-slate-50 dark:bg-gray-900 flex items-center justify-center font-['Cairo']" dir="rtl">
      <div className="w-full h-screen flex flex-row overflow-hidden shadow-xl">
        
        {/* النصف الأيمن: النماذج */}
        <div className="w-full md:w-1/2 h-screen overflow-y-auto p-6 md:p-12 bg-white dark:bg-gray-800">
          <form onSubmit={onSubmitHandler} className="w-full space-y-6">
            
            {/* 1. واجهة تسجيل الدخول الرئيسية */}
            {state === "Login" && (
              <>
                <div className="text-center space-y-2 mb-4">
                  <div className="flex justify-center mb-5 items-center w-full">
                    <img
                      onClick={() => navigate('/')}
                      className="h-20 cursor-pointer object-contain transform hover:scale-105 transition-all duration-300"
                      src={assets.logo}
                      alt="شعار طبيبي"
                    />
                  </div>
                  <h2 className="text-3xl font-black text-[#138C9F]">أهلاً بك مجدداً</h2>
                  <p className="text-base text-slate-500 dark:text-gray-400 font-bold">
                    قم بتسجيل الدخول للوصول إلى سجلاتك الطبية ومواعيدك.
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-3">{t('login.email')}</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-base text-[#138C9F] font-medium dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300">{t('login.password')}</label>
                        <span
                          onClick={() => setState("ForgotPassword")}
                          className="text-sm font-bold text-[#138C9F] hover:underline cursor-pointer"
                        >
                          {t('login.forgotPassword')}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-base text-[#138C9F] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#138C9F] text-sm hover:text-slate-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "إخفاء" : "إظهار"}
                        </button>
                      </div>
                    </div>
                </div>

                  <button
                    type="submit"
                    className="w-full bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-bold py-3 rounded-xl shadow-md transition-all text-base cursor-pointer"
                  >
                    {t('login.loginBtn')}
                  </button>

                <p className="text-sm text-center font-bold text-slate-600 dark:text-gray-200 pt-2">
                  {t('login.noAccount')}{" "}
                  <span
                    className="text-[#138C9F] underline cursor-pointer"
                    onClick={() => handleStateChange("RegisterPatient")}
                  >
                    {t('login.createAccount')}
                  </span>
                </p>
              </>
            )}

            {/* 2. واجهة التسجيل كمريض */}
            {state === "RegisterPatient" && (
              <div className="space-y-4 overflow-y-scroll px-1 scrollbar-thin">
                <div className="text-center">
                  <img
                    className="h-20 w-auto mx-auto object-contain mb-3"
                    src={assets.logo}
                    alt="شعار طبيبي"
                  />
                  <h2 className="text-xl font-black text-[#138C9F] mb-2">{t('login.register')}</h2>
                  <p className="text-sm text-slate-400 dark:text-gray-400 font-bold">
                    املأ بياناتك لفتح ملفك الطبي الرقمي الفوري.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-3">{t('login.firstName')} *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-3">{t('login.lastName')} *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-3">{t('login.email')} *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-3">{t('login.password')} *</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#138C9F] hover:text-slate-600 transition-colors"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                    >
                      <FontAwesomeIcon icon={showRegPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {password && (
                    <div className="mt-3 bg-slate-50 dark:bg-gray-700 rounded-xl p-3 border border-slate-100 dark:border-gray-600 space-y-1.5">
                      {passwordRules.map((rule, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold">
                          <span className={rule.test(password) ? 'text-emerald-500' : 'text-slate-300'}>
                            {rule.test(password) ? '✓' : '○'}
                          </span>
                          <span className={rule.test(password) ? 'text-emerald-600' : 'text-slate-400'}>
                            {rule.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-3">{t('login.phone')} *</label>
                    <div className="flex items-stretch overflow-hidden border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#138C9F] focus-within:border-transparent transition-all country-dropdown">
                      <button
                        type="button"
                        onClick={() => setShowCountries(!showCountries)}
                        className="flex items-center gap-1.5 px-3 border-l border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 shrink-0 cursor-pointer"
                      >
                        <img
                          src={`https://flagcdn.com/24x18/${selectedCountry.iso}.png`}
                          alt={selectedCountry.name}
                          className="w-5 h-[15px] rounded-sm object-cover"
                        />
                        <span className="text-xs" dir="ltr">{selectedCountry.code}</span>
                        <svg className={`w-3 h-3 stroke-slate-400 fill-none transition-transform duration-200 ${showCountries ? 'rotate-180' : ''}`} viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      <input
                        type="tel"
                        dir="ltr"
                        value={phone.replace(selectedCountry.code, '')}
                        onChange={(e) => setPhone(selectedCountry.code + e.target.value.replace(/\D/g, ''))}
                        className="flex-1 min-w-0 px-4 py-3 text-sm outline-none text-slate-800 bg-white dark:bg-gray-700 dark:text-white"
                        placeholder="5xxxxxxxx"
                        required
                      />
                    </div>
                    {showCountries && (
                      <div className="relative">
                        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">
                          {COUNTRIES.map((c) => {
                            const isActive = c.code === selectedCountry.code;
                            return (
                              <button
                                key={`${c.code}-${c.name}`}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setPhone(c.code + phone.replace(selectedCountry.code, '').replace(/\D/g, ''));
                                  setShowCountries(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors duration-100 ${isActive ? 'bg-[#e6f4f6] text-[#138C9F] font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                              >
                                <img
                                  src={`https://flagcdn.com/24x18/${c.iso}.png`}
                                  alt={c.name}
                                  className="w-5 h-[15px] rounded-sm object-cover"
                                />
                                <span className="flex-1 text-right">{c.name}</span>
                                <span className="text-slate-400 text-xs" dir="ltr">{c.code}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-3">{t('login.gender')} *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-sm bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    >
                      <option value="">اختر...</option>
                      <option value="Male">{t('login.male')}</option>
                      <option value="Female">{t('login.female')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-3">{t('login.address')} *</label>
                  <div className="relative location-dropdown">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onFocus={() => setShowLocations(true)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="اختر المحافظة ثم أضف التفاصيل"
                      required
                    />
                    {showLocations && (
                      <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">
                        <div className="sticky top-0 bg-white dark:bg-gray-700 px-3 py-2 border-b border-slate-100 dark:border-gray-600">
                          <input
                            type="text"
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            placeholder="ابحث عن منطقة..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 text-sm outline-none focus:ring-1 focus:ring-[#138C9F] dark:bg-gray-600 dark:text-white"
                            autoFocus
                          />
                        </div>
                        {PALESTINE_LOCATIONS
                          .filter(loc => !locationSearch || loc.includes(locationSearch))
                          .map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                setAddress(loc);
                                setShowLocations(false);
                                setLocationSearch('');
                              }}
                              className={`w-full text-right px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100 hover:bg-[#e6f4f6] hover:text-[#138C9F] ${address === loc ? 'bg-[#e6f4f6] text-[#138C9F] font-bold' : 'text-slate-700'}`}
                            >
                              {loc}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    id="termsPatient"
                    className="w-4 h-4 text-[#138C9F] border-slate-300 rounded focus:ring-[#138C9F]"
                    required
                  />
                  <label htmlFor="termsPatient" className="text-sm font-bold text-slate-500 dark:text-gray-300 select-none">
                    {t('login.agreeTerms')}
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all"
                >
                  {t('login.registerBtn')}
                </button>

                <p className="text-sm text-center font-bold text-slate-600 dark:text-gray-200">
                  {t('login.hasAccount')}
                  <span
                    className="text-[#138C9F] underline cursor-pointer"
                    onClick={() => handleStateChange("Login")}
                  >
                    {t('login.loginHere')}
                  </span>
                </p>
              </div>
            )}

            {/* 3. واجهة نسيت كلمة المرور */}
            {state === "ForgotPassword" && (
              <>
                <div className="text-center space-y-2 mb-4">
                  <div className="flex justify-center mb-5 items-center w-full">
                    <img
                      onClick={() => navigate('/')}
                      className="h-20 cursor-pointer object-contain transform hover:scale-105 transition-all duration-300"
                      src={assets.logo}
                      alt="شعار طبيبي"
                    />
                  </div>
                  <h2 className="text-3xl font-black text-[#138C9F]">إعادة كلمة المرور</h2>
                  <p className="text-base text-slate-500 dark:text-gray-400 font-bold">
                    أدخل بريدك الإلكتروني المسجل لإرسال رمز التحقق.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-3">{t('login.email')}</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-base text-[#138C9F] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-bold py-3 rounded-xl shadow-md transition-all text-base cursor-pointer"
                >
                  إرسال رمز التحقق
                </button>

                <p className="text-sm text-center font-bold text-slate-600 dark:text-gray-200 pt-2">
                  <span
                    className="text-[#138C9F] underline cursor-pointer"
                    onClick={() => handleStateChange("Login")}
                  >
                    العودة لتسجيل الدخول
                  </span>
                </p>
              </>
            )}

            {/* 3.5 واجهة التحقق من رمز OTP */}
            {state === "OTPVerification" && (
              <>
                <div className="text-center space-y-2 mb-4">
                  <div className="flex justify-center mb-5 items-center w-full">
                    <img
                      onClick={() => navigate('/')}
                      className="h-20 cursor-pointer object-contain transform hover:scale-105 transition-all duration-300"
                      src={assets.logo}
                      alt="شعار طبيبي"
                    />
                  </div>
                  <h2 className="text-3xl font-black text-[#138C9F]">رمز التحقق</h2>
                  <p className="text-base text-slate-500 dark:text-gray-400 font-bold">
                    أدخل الرمز المكون من 6 أرقام المرسل إلى
                  </p>
                  <p className="text-sm font-black text-[#138C9F]">{email}</p>
                </div>

                <OtpInput
                  length={6}
                  email={email}
                  onComplete={async (code) => {
                    try {
                      const { data } = await axiosInstance.post('/auth/verify-email-otp', { email, code });
                      if (data.succeeded && data.data) {
                        setOtpResetToken(data.data);
                        toast.success('تم التحقق بنجاح!');
                        setState("ResetPassword");
                      } else {
                        toast.error(data.errors?.[0]?.message || 'الرمز غير صحيح');
                      }
                    } catch (err) {
                      toast.error(err.response?.data?.errors?.[0]?.message || 'الرمز غير صحيح');
                    }
                  }}
                  onResend={async () => {
                    await axiosInstance.post('/auth/send-email-otp', { email });
                    toast.success('تم إعادة إرسال رمز التحقق');
                  }}
                />

                <p className="text-sm text-center font-bold text-slate-600 dark:text-gray-200 pt-6">
                  <span
                    className="text-[#138C9F] underline cursor-pointer"
                    onClick={() => handleStateChange("ForgotPassword")}
                  >
                    تغيير البريد الإلكتروني
                  </span>
                </p>
              </>
            )}

            {/* 4. واجهة تعيين كلمة مرور جديدة */}
            {state === "ResetPassword" && (
              <>
                <div className="text-center space-y-2 mb-4">
                  <div className="flex justify-center mb-5 items-center w-full">
                    <img
                      onClick={() => navigate('/')}
                      className="h-20 cursor-pointer object-contain transform hover:scale-105 transition-all duration-300"
                      src={assets.logo}
                      alt="شعار طبيبي"
                    />
                  </div>
                  <h2 className="text-3xl font-black text-[#138C9F]">تعيين كلمة مرور جديدة</h2>
                  <p className="text-base text-slate-500 dark:text-gray-400 font-bold">
                    يرجى إدخال كلمة المرور الجديدة وتأكيدها بشكل صحيح.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-bold text-slate-700 dark:text-gray-300 mb-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-[#138C9F] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-slate-700 dark:text-gray-300 mb-2">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent transition-all outline-none text-[#138C9F] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-gray-700 rounded-2xl p-4 border border-slate-100 dark:border-gray-600 text-sm space-y-2 font-bold text-slate-500 dark:text-gray-400">
                    <p className="text-slate-700 dark:text-gray-300 font-black mb-1">متطلبات كلمة المرور:</p>
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

                <button
                  type="submit"
                  className="w-full bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-black py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  تحديث كلمة المرور <span><FontAwesomeIcon icon={faArrowLeft} className="transition-transform group-hover:-translate-x-1 text-lg" /></span>
                </button>
              </>
            )}

            {/* 5. واجهة تأكيد البريد الإلكتروني */}
          </form>
        </div>

        {/* النصف الأيسر */}
        <div className="hidden md:flex w-1/2 min-h-screen bg-[#0f7282] p-12 flex-col justify-between text-white relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
            alt="Medical Clinic Design"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0f7282] via-transparent to-[#0f7282]/70 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <h2 className="text-4xl font-black text-center mb-6 leading-tight text-white drop-shadow-lg">
              {state === "Login" && "رعاية صحية ذكية بلمسة إنسانية"}
              {state === "RegisterPatient" && "ملفك الطبي آمن ومحمي دائماً"}
              {state === "ForgotPassword" && "أمان حسابك أولويتنا الأولى"}
              {state === "OTPVerification" && "تحقق من هويتك بأمان"}
              {state === "ResetPassword" && "حماية بياناتك تبدأ من هنا"}
            </h2>

            <p className="text-base text-slate-100 text-center font-medium max-w-lg leading-relaxed drop-shadow-md mb-8">
              {state === "Login" && "نجمع بين أحدث التقنيات الطبية والاهتمام الشخصي لضمان أفضل تجربة رعاية صحية لك ولعائلتك."}
              {state === "RegisterPatient" && "أنشئ حسابك الآن واحصل على وصول فوري لحجز مواعيدك مع أفضل الأطباء المتخصصين."}
              {state === "ForgotPassword" && "أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق آمن لاستعادة وصولك بسرعة وسهولة."}
              {state === "OTPVerification" && "أدخل الرمز المرسل إلى بريدك الإلكتروني للتأكد من هويتك والمتابعة."}
              {state === "ResetPassword" && "اختر كلمة مرور قوية ومعقدة لحماية بياناتك الطبية والشخصية بأعلى مستويات الأمان."}
            </p>

            {(state === "Login" || state === "RegisterPatient") && (
              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl border border-white/30 text-center shadow-xl">
                  <h5 className="text-5xl font-black text-white mb-2">50+</h5>
                  <p className="text-base text-slate-100 font-semibold">طبيب معتمد</p>
                </div>
                <div className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl border border-white/30 text-center shadow-xl">
                  <h5 className="text-5xl font-black text-emerald-300 mb-2">24/7</h5>
                  <p className="text-base text-slate-100 font-semibold">دعم فني</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-200 text-center relative z-10 font-medium">
            <p>حماية عالية للبيانات | متوفر على جميع الأجهزة</p>
            <p className="mt-2">سياسة الخصوصية • شروط الاستخدام</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;