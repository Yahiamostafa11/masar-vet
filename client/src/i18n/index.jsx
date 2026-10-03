import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.js';
import ar from './ar.js';

const dicts = { en, ar };
const I18nContext = createContext(null);

// Each language has its own URL ("/" and "/ar") so search engines can index both.
const langFromPath = () => (typeof window !== 'undefined' && /^\/ar(\/|$)/.test(window.location.pathname) ? 'ar' : 'en');

function setMeta(sel, attr, value) {
  const el = document.head.querySelector(sel);
  if (el) el.setAttribute(attr, value);
}

export function I18nProvider({ children, initialLang }) {
  const [lang, setLang] = useState(initialLang || langFromPath());

  useEffect(() => {
    const el = document.documentElement;
    const m = dicts[lang].meta;
    const url = `https://masar-vet.com${lang === 'ar' ? '/ar' : '/'}`;
    el.lang = lang;
    el.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = m.title;
    setMeta('meta[name="description"]', 'content', m.description);
    setMeta('meta[property="og:title"]', 'content', m.title);
    setMeta('meta[property="og:description"]', 'content', m.description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:locale"]', 'content', lang === 'ar' ? 'ar_EG' : 'en_US');
    setMeta('link[rel="canonical"]', 'href', url);
  }, [lang]);

  // Back/forward between "/" and "/ar".
  useEffect(() => {
    const on = () => setLang(langFromPath());
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);

  const toggle = useCallback(() => {
    const next = lang === 'en' ? 'ar' : 'en';
    window.history.pushState({}, '', (next === 'ar' ? '/ar' : '/') + window.location.hash);
    setLang(next);
  }, [lang]);

  const value = useMemo(() => ({ lang, t: dicts[lang], toggle }), [lang, toggle]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
