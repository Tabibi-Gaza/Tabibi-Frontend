import React, { useEffect, Suspense, lazy, Component } from 'react'
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Notifications from './components/Notifications'
import { useNotificationSignalR } from './hooks/notifications/useNotificationSignalR'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { setOnAuthFailure } from './api/axiosInstance';
import './i18n';

const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'));
const DoctorLayout = lazy(() => import('./components/Doctor/DoctorLayout'));
const SecretaryProtectedRoute = lazy(() => import('./components/Doctor/SecretaryProtectedRoute'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {

  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">يرجى تحميل الصفحة مرة أخرى</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="bg-[#138C9F] text-white px-6 py-2 rounded-lg hover:bg-[#0f7282] transition"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomeV3 = lazy(() => import('./pages/HomeV3'))
const Home = lazy(() => import('./pages/Home'))
const Doctors = lazy(() => import('./pages/Doctors'))
const Login = lazy(() => import('./pages/Login'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const MyAppointment = lazy(() => import('./pages/MyAppointment'))
const MyPrescriptions = lazy(() => import('./pages/MyPrescriptions'))
const Myprofile = lazy(() => import('./pages/Myprofile'))
const Appointment = lazy(() => import('./pages/Appointment'))
const PrivacyPolicy = lazy(() => import('./pages/privacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const FAQs = lazy(() => import('./pages/FAQs'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const MedicalHistory = lazy(() => import('./pages/MedicalHistory'))
const FinancialTransactions = lazy(() => import('./pages/FinancialTransactions'))
const Chats = lazy(() => import('./pages/Chats'))
const AdminDashboard = lazy(() => import('./pages/Admin pages/AdminDashboard'))
const AdminProfile = lazy(() => import('./pages/Admin pages/AdminProfile'))
const AdminNotifications = lazy(() => import('./components/Admin/AdminNotifications'))
const AdminUserManagement = lazy(() => import('./pages/Admin pages/AdminUserManagement'))
const AdminDepartmentsManagement = lazy(() => import('./pages/Admin pages/AdminDepartmentsManagement'))
const AdminJoinRequests = lazy(() => import('./pages/Admin pages/AdminJoinRequests'))
const AdminChats = lazy(() => import('./pages/Admin pages/AdminChats'))
const AdminFinancialTransactions = lazy(() => import('./pages/Admin pages/AdminFinancialTransactions'))
const AdminPaymentMethods = lazy(() => import('./pages/Admin pages/AdminPaymentMethods'))
const AdminContactUs = lazy(() => import('./pages/Admin pages/AdminContactUs'))
const DoctorDashboard = lazy(() => import('./pages/Doctor pages/DoctorDashboard'))
const DoctorNotifications = lazy(() => import('./components/Doctor/DoctorNotifications'))
const DoctorProfile = lazy(() => import('./pages/Doctor pages/DoctorProfile'))
const MedicalExamination = lazy(() => import('./pages/Doctor pages/MedicalExamination'))
const MedicalFile = lazy(() => import('./pages/Doctor pages/MedicalFile'))
const DoctorSchedule = lazy(() => import('./pages/Doctor pages/DoctorSchedule'))
const PatientManagement = lazy(() => import('./pages/Doctor pages/PatientManagement'))
const PatientFile = lazy(() => import('./pages/Doctor pages/PatientFile'))
const DoctorChats = lazy(() => import('./pages/Doctor pages/DoctorChats'))
const DoctorPayment = lazy(() => import('./pages/Doctor pages/DoctorPayment '))
const FinancialFiles = lazy(() => import('./pages/Doctor pages/FinancialFiles'))
const PatientMedicalFile = lazy(() => import('./pages/PatientMedicalFile'))
const AppointmentManagement = lazy(() => import('./pages/Doctor pages/Appointment Management'))
const SecretaryManagement = lazy(() => import('./pages/Doctor pages/SecretaryManagement'))
const DoctorSubscription = lazy(() => import('./pages/Doctor pages/DoctorSubscription'))
const RegisterAsDoctor = lazy(() => import('./pages/RegisterAsDoctor'))
const Pharmacies = lazy(() => import('./pages/Pharmacies'))
const MedicalCenters = lazy(() => import('./pages/MedicalCenters'))
const Labs = lazy(() => import('./pages/Labs'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Cart = lazy(() => import('./pages/Cart'))

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-[#138C9F] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const roles = user?.roles || [];
        if ((roles.includes("Doctor") || roles.includes("Secretary")) && user?.doctorId && !localStorage.getItem("doctorId")) {
          localStorage.setItem("doctorId", user.doctorId);
        }
      } catch {}
    }
  }, []);

  return null;
};

const UserLayout = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const roles = user?.roles || [];

  if (roles.includes("Doctor") || roles.includes("Secretary")) return <Navigate to="/doctor-dashboard" />;
  if (roles.includes("Admin")) return <Navigate to="/admin-dashboard" />;

  return (
    <div dir='rtl' className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path='/' element={<HomeV3 />} />
          <Route path='/home-v2' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<TermsOfService />} />
          <Route path='/faqs' element={<FAQs />} />
          <Route path='/pharmacies' element={<Pharmacies />} />
          <Route path='/medical-centers' element={<MedicalCenters />} />
          <Route path='/labs' element={<Labs />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/medical-history' element={<MedicalHistory />} />
          <Route path='/chats' element={<Chats />} />
          <Route path='/financial-transactions' element={<FinancialTransactions />} />
          <Route path='/my-appointment' element={<MyAppointment />} />
          <Route path='/my-profile' element={<Myprofile />} />
          <Route path='/register-doctor' element={<RegisterAsDoctor />} />
          <Route path='/medical-files' element={<PatientMedicalFile />} />
          <Route path='/my-prescriptions' element={<MyPrescriptions />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/payment/:appointmentId' element={<PaymentPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}

const App = () => {
  useNotificationSignalR();
  const navigate = useNavigate();
  
  useEffect(() => {
    setOnAuthFailure(() => navigate('/login'));
  }, [navigate]);
  
  return (
    <ErrorBoundary>
    <ThemeProvider>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/users-management" element={<AdminUserManagement />} />
            <Route path="/admin/departments-management" element={<AdminDepartmentsManagement />} />
            <Route path="/admin/join-requests" element={<AdminJoinRequests />} />
            <Route path="/admin/chats" element={<AdminChats />} />
            <Route path="/admin/financial-transactions" element={<AdminFinancialTransactions />} />
            <Route path="/admin/payment-methods" element={<AdminPaymentMethods />} />
            <Route path="/admin/contact-us" element={<AdminContactUs />} />
          </Route>

          <Route element={<DoctorLayout />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/notifications" element={<DoctorNotifications />} />
            <Route path="/doctor/profile" element={<SecretaryProtectedRoute><DoctorProfile /></SecretaryProtectedRoute>} />
            <Route path="/doctor/medical-examination/:id" element={<SecretaryProtectedRoute><MedicalExamination /></SecretaryProtectedRoute>} />
            <Route path="/doctor/medical-file/:id" element={<SecretaryProtectedRoute><MedicalFile /></SecretaryProtectedRoute>} />
            <Route path="/doctor/patient-file/:id" element={<PatientFile />} />
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
            <Route path="/doctor/patients" element={<PatientManagement />} />
            <Route path="/doctor/chats" element={<SecretaryProtectedRoute><DoctorChats /></SecretaryProtectedRoute>} />
            <Route path="/doctor/payments" element={<DoctorPayment />} />
            <Route path="/doctor/financials" element={<FinancialFiles />} />
            <Route path="/doctor/appointments" element={<AppointmentManagement />} />
            <Route path="/doctor/secretary-management" element={<SecretaryManagement />} />
            <Route path="/doctor/subscription" element={<DoctorSubscription />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/reset-password' element={<Login />} />
          
          <Route path="/*" element={<UserLayout />} />
        </Routes>
      </Suspense>
    </GoogleOAuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
