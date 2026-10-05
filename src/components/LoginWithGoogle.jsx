import { lazy, Suspense } from 'react';

const GoogleOAuthProvider = lazy(() =>
  import('@react-oauth/google').then((m) => ({ default: m.GoogleOAuthProvider }))
);
const Login = lazy(() => import('../pages/Login'));

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const LoginWithGoogle = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  </GoogleOAuthProvider>
);

export default LoginWithGoogle;
