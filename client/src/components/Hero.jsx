import { useI18n } from '../i18n/index.jsx';
import HeroBackdrop from './HeroBackdrop.jsx';
import Icon from './Icon.jsx';

export default function Hero() {
  const { t } = useI18n();
  const h = t.hero;
  return (
    <section id="home" className="hero">
      <HeroBackdrop />
      <div className="container hero-in">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-light hero-a" style={{ '--d': '80ms' }}>{h.eyebrow}</p>
          <h1 className="hero-title">
            <span className="hero-a" style={{ '--d': '160ms' }}>{h.title[0]}</span>{' '}
            <span className="hero-a accent" style={{ '--d': '260ms' }}>{h.title[1]}</span>
          </h1>
          <p className="hero-text hero-a" style={{ '--d': '360ms' }}>{h.text}</p>
          <div className="hero-actions hero-a" style={{ '--d': '460ms' }}>
            <a href="#products" className="btn btn-primary btn-lg">
              {h.primary} <Icon name="arrow" size={18} flip />
            </a>
            <a href="#contact" className="btn btn-ghost btn-lg">{h.secondary}</a>
          </div>
        </div>

      </div>
      <a href="#about" className="scroll-cue" aria-label={h.scroll}>
        <span>{h.scroll}</span>
        <i />
      </a>
    </section>
  );
}
