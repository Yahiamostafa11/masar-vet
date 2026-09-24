import { useI18n } from '../i18n/index.jsx';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';

export function SectionHead({ eyebrow, title, text, light = false, center = false }) {
  return (
    <Reveal className={`section-head${center ? ' center' : ''}${light ? ' light' : ''}`}>
      <p className={`eyebrow${light ? ' eyebrow-light' : ''}`}>{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-text">{text}</p>}
    </Reveal>
  );
}

export function Marquee() {
  const { t } = useI18n();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => (
          <span key={i}>
            <Icon name="dna" size={16} /> {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <div>
          <SectionHead eyebrow={a.eyebrow} title={a.title} />
          <Reveal delay={80}>
            <p className="lead">{a.lead}</p>
          </Reveal>
          {a.body.map((p, i) => (
            <Reveal key={i} delay={140 + i * 60}>
              <p className="body-text">{p}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="about-visual" delay={120}>
          <div className="about-card">
            <img src="/img/logo-full.webp" width="900" height="900" loading="lazy" decoding="async" alt="Masar logo" />
          </div>
          <blockquote className="about-quote">{a.quote}</blockquote>
        </Reveal>
      </div>
    </section>
  );
}

export function Mission() {
  const { t } = useI18n();
  const m = t.mission;
  return (
    <section className="section mission">
      <div className="mission-bg" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <p className="eyebrow eyebrow-light">{m.eyebrow}</p>
          <p className="mission-text">{m.text}</p>
          <p className="mission-sub">{m.sub}</p>
        </Reveal>
        <div className="pillars">
          {m.pillars.map((p, i) => (
            <Reveal key={p.k} className="pillar" delay={i * 90}>
              <span className="pillar-n">0{i + 1}</span>
              <h3>{p.k}</h3>
              <p>{p.v}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="vision" delay={100}>
          <h3>{m.visionTitle}</h3>
          <p>{m.vision}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Genetics({ onEnquire }) {
  const { t } = useI18n();
  const g = t.genetics;
  return (
    <section id="genetics" className="section genetics">
      <div className="container">
        <SectionHead eyebrow={g.eyebrow} title={g.title} text={g.text} />
        <div className="breeds">
          {g.breeds.map((b, i) => (
            <Reveal key={b.name} className="breed" delay={(i % 4) * 70}>
              <span className="breed-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{b.name}</h3>
              <span className={`tag tag-${b.purpose}`}>{g.purposes[b.purpose]}</span>
              <p className="breed-origin">
                <small>{g.origin}</small> {b.origin}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal className="buffalo">
          <div>
            <h3>{g.buffaloTitle}</h3>
            <p>{g.buffaloText}</p>
          </div>
          <a href="#contact" className="btn btn-primary" onClick={() => onEnquire('genetics')}>
            {g.buffaloCta} <Icon name="arrow" size={18} flip />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Why() {
  const { t } = useI18n();
  const w = t.why;
  return (
    <section id="why" className="section why">
      <div className="container">
        <SectionHead eyebrow={w.eyebrow} title={w.title} />
        <div className="why-grid">
          {w.items.map((it, i) => (
            <Reveal key={it.icon} className="why-card" delay={i * 70}>
              <span className="why-icon">
                <Icon name={it.icon} size={26} />
              </span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="field">
          <img src="/img/truck.webp" width="500" height="222" loading="lazy" decoding="async" alt={w.imageAlt} />
          <div>
            <h3>{w.fieldTitle}</h3>
            <p>{w.fieldText}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container footer-in">
        <div className="footer-brand">
          <span className="brand-chip">
            <img src="/img/mark.webp" width="52" height="32" alt="" />
          </span>
          <div>
            <strong>{t.brand.name}</strong>
            <span>{t.brand.tagline}</span>
          </div>
        </div>
        <p className="footer-slogan">{t.brand.slogan}</p>
        <a href="#home" className="to-top" aria-label={t.footer.top}>
          <Icon name="up" size={20} />
        </a>
      </div>
      <div className="container footer-bar">
        <span>
          © {new Date().getFullYear()} {t.brand.name}. {t.footer.rights}
        </span>
      </div>
    </footer>
  );
}
