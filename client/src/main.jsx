import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/cairo/wght.css';
import './styles/global.css';
import { I18nProvider } from './i18n/index.jsx';
import App from './App.jsx';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);

// Production pages are prerendered (see prerender.mjs) so crawlers get real content: hydrate them.
// In `npm run dev` the root is empty, so render from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
