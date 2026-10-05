import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';

i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar } },
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
  returnEmptyString: false,
});

let enPromise = null;
export function loadEn() {
  if (enPromise) return enPromise;
  enPromise = import('./locales/en.json').then((m) => {
    i18n.addResourceBundle('en', 'translation', m.default, true, true);
    return m;
  });
  return enPromise;
}

function scheduleEn() {
  const kick = () => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => loadEn(), { timeout: 5000 });
    } else {
      setTimeout(loadEn, 3000);
    }
  };
  if (document.readyState === 'complete') kick();
  else window.addEventListener('load', kick, { once: true });
}

scheduleEn();

export default i18n;
