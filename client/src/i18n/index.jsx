import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.js';
import ar from './ar.js';

const dicts = { en, ar };
const I18nContext = createContext(null);

// The inline script in index.html has already set <html lang> before first paint.
const initial = () => (document.documentElement.lang === 'ar' ? 'ar' : 'en');

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(initial);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = dicts[lang].meta.title;
    try {
      localStorage.setItem('masar-lang', lang);
    } catch {}
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'ar' : 'en')), []);
  const value = useMemo(() => ({ lang, t: dicts[lang], toggle }), [lang, toggle]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
