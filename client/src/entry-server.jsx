// Server-side entry used only at build time by prerender.mjs.
import { renderToString } from 'react-dom/server';
import { I18nProvider } from './i18n/index.jsx';
import App from './App.jsx';
import en from './i18n/en.js';
import ar from './i18n/ar.js';

export const meta = { en: en.meta, ar: ar.meta };

export function render(lang) {
  return renderToString(
    <I18nProvider initialLang={lang}>
      <App />
    </I18nProvider>
  );
}
