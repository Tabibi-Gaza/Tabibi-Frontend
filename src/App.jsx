import React, { useEffect } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import HomeV3 from './pages/HomeV3'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyAppointment from './pages/MyAppointment'
import MyPrescriptions from './pages/MyPrescriptions'
import Myprofile from './pages/Myprofile'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivacyPolicy from './pages/privacyPolicy'
import TermsOfService from './pages/TermsOfService'
import FAQs from './pages/FAQs'
import Notifications from './components/Notifications'
import PaymentPage from './pages/PaymentPage'
import MedicalHistory from './pages/MedicalHistory'
import FinancialTransactions from './pages/FinancialTransactions'
import Chats from './pages/Chats'
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboard from './pages/Admin pages/AdminDashboard'
import AdminProfile from './pages/Admin pages/AdminProfile'
import AdminNotifications from './components/Admin/AdminNotifications'
import AdminUserManagement from './pages/Admin pages/AdminUserManagement'
import AdminDepartmentsManagement from './pages/Admin pages/AdminDepartmentsManagement'
import AdminJoinRequests from './pages/Admin pages/AdminJoinRequests'
import AdminChats from './pages/Admin pages/AdminChats'
import AdminFinancialTransactions from './pages/Admin pages/AdminFinancialTransactions'
import AdminPaymentMethods from './pages/Admin pages/AdminPaymentMethods'
import AdminContactUs from './pages/Admin pages/AdminContactUs'

import DoctorLayout from './components/Doctor/DoctorLayout';
import SecretaryProtectedRoute from './components/Doctor/SecretaryProtectedRoute';
import DoctorDashboard from './pages/Doctor pages/DoctorDashboard';
import DoctorNotifications from './components/Doctor/DoctorNotifications'
import DoctorProfile from './pages/Doctor pages/DoctorProfile'
import MedicalExamination from './pages/Doctor pages/MedicalExamination'
import MedicalFile from './pages/Doctor pages/MedicalFile'
import DoctorSchedule from './pages/Doctor pages/DoctorSchedule'
import PatientManagement from './pages/Doctor pages/PatientManagement'
import PatientFile from './pages/Doctor pages/PatientFile'
import DoctorChats from './pages/Doctor pages/DoctorChats'
import DoctorPayment from './pages/Doctor pages/DoctorPayment '
import FinancialFiles from './pages/Doctor pages/FinancialFiles'
import PatientMedicalFile from './pages/PatientMedicalFile'
import AppointmentManagement from './pages/Doctor pages/Appointment Management'
import SecretaryManagement from './pages/Doctor pages/SecretaryManagement'
import DoctorSubscription from './pages/Doctor pages/DoctorSubscription'
import RegisterAsDoctor from './pages/RegisterAsDoctor'
import Pharmacies from './pages/Pharmacies'
import MedicalCenters from './pages/MedicalCenters'
import Labs from './pages/Labs'
import Favorites from './pages/Favorites'
import Cart from './pages/Cart'
import { useNotificationSignalR } from './hooks/notifications/useNotificationSignalR'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import './i18n';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

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
      <Footer />
    </div>
  )
}

const App = () => {
  useNotificationSignalR();
  return (
    <ThemeProvider>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
    </GoogleOAuthProvider>
    </ThemeProvider>
  )
}

export default App