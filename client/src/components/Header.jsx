import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import { useActiveSection, useScrolled } from '../hooks/hooks.js';
import Icon from './Icon.jsx';

const LINKS = ['home', 'about', 'genetics', 'products', 'why', 'contact'];

export default function Header() {
  const { t, toggle } = useI18n();
  const scrolled = useScrolled();
  const active = useActiveSection(LINKS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <div className="container header-in">
        <a href="#home" className="brand" onClick={() => setOpen(false)} aria-label="Masar">
          <span className="brand-chip">
            <img src="/img/mark.webp" width="52" height="32" alt="" />
          </span>
          <span className="brand-name">{t.brand.name}</span>
        </a>

        <nav className="nav" id="nav" aria-label="Primary">
          {LINKS.filter((k) => k !== 'contact').map((k) => (
            <a key={k} href={`#${k}`} className={active === k ? 'active' : ''} onClick={() => setOpen(false)}>
              {t.nav[k]}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>
            {t.nav.cta}
          </a>
        </nav>

        <div className="header-tools">
          <button className="lang-btn" onClick={toggle} aria-label={t.lang.label} lang={t.lang.switch === 'English' ? 'en' : 'ar'}>
            <Icon name="globe" size={16} />
            {t.lang.switch}
          </button>
          <button
            className="burger"
            aria-expanded={open}
            aria-controls="nav"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
