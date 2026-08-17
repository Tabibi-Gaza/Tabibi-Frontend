import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const PERMISSION_MAP = {
    '/doctor/chats': { flag: 16, label: 'المحادثات' },
    '/doctor/profile': { flag: 0, label: 'الملف الشخصي' },
    '/doctor/medical-examination': { flag: 32, label: 'الكشف الطبي' },
    '/doctor/medical-file': { flag: 2, label: 'الملف الطبي' },
};

const SecretaryProtectedRoute = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hasPermission, secretaryDoctorInfo } = useContext(AppContext);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isSecretary = user?.roles?.includes('Secretary');

    useEffect(() => {
        if (!isSecretary) return;

        const pathKey = Object.keys(PERMISSION_MAP).find(key =>
            location.pathname.startsWith(key)
        );

        if (pathKey) {
            const { flag, label } = PERMISSION_MAP[pathKey];

            if (flag === 0 || !hasPermission(flag)) {
                const doctorName = secretaryDoctorInfo?.doctorName || 'الطبيب';
                toast.error(
                    `الدكتور ${doctorName} لم يمنحك صلاحية الاطلاع على ${label}.`,
                    { autoClose: 5000, position: 'top-center' }
                );
                navigate('/doctor-dashboard', { replace: true });
            }
        }
    }, [location.pathname, isSecretary, hasPermission, secretaryDoctorInfo, navigate]);

    if (!isSecretary) return children;

    const pathKey = Object.keys(PERMISSION_MAP).find(key =>
        location.pathname.startsWith(key)
    );

    if (pathKey) {
        const { flag } = PERMISSION_MAP[pathKey];
        if (flag === 0 || !hasPermission(flag)) {
            return null;
        }
    }

    return children;
};

export default SecretaryProtectedRoute;
