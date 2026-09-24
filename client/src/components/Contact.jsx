import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import { CONTACT } from '../config.js';
import { SectionHead } from './Sections.jsx';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';

const TOPICS = ['genetics', 'supplies', 'equipment', 'partnership', 'other'];
const EMPTY = { name: '', email: '', phone: '', topic: 'genetics', message: '', website: '' };

export default function Contact({ topic }) {
  const { t } = useI18n();
  const c = t.contact;
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | ok | fail | invalid
  const [bad, setBad] = useState({});

  useEffect(() => {
    if (topic) setForm((f) => ({ ...f, topic }));
  }, [topic]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    setBad({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('ok');
        setForm(EMPTY);
      } else if (res.status === 400 && data.errors) {
        setBad(data.errors);
        setStatus('invalid');
      } else setStatus('fail');
    } catch {
      setStatus('fail');
    }
  }

  const f = c.form;
  return (
    <section id="contact" className="section contact">
      <div className="container contact-grid">
        <div>
          <SectionHead eyebrow={c.eyebrow} title={c.title} text={c.text} light />
          <Reveal className="info" delay={100}>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>
              <Icon name="phone" /> <span><small>{c.info.phone}</small><bdi dir="ltr">{CONTACT.phone}</bdi></span>
            </a>
            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`}>
                <Icon name="mail" /> <span><small>{c.info.email}</small><bdi dir="ltr">{CONTACT.email}</bdi></span>
              </a>
            )}
            <span className="info-row">
              <Icon name="globe" /> <span><small>{c.info.web}</small><bdi dir="ltr">{CONTACT.website}</bdi></span>
            </span>
            <span className="info-row">
              <Icon name="pin" /> <span><small>{c.info.location}</small>{c.location}</span>
            </span>
            <a className="btn btn-green" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
              {c.info.whatsapp}
            </a>
          </Reveal>
        </div>

        <Reveal as="form" className="form" onSubmit={submit} noValidate delay={140}>
          <label>
            <span>{f.name}</span>
            <input value={form.name} onChange={set('name')} autoComplete="name" required aria-invalid={!!bad.name} />
          </label>
          <div className="row">
            <label>
              <span>{f.email}</span>
              <input type="email" dir="ltr" value={form.email} onChange={set('email')} autoComplete="email" required aria-invalid={!!bad.email} />
            </label>
            <label>
              <span>{f.phone}</span>
              <input type="tel" dir="ltr" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </label>
          </div>
          <label>
            <span>{f.topic}</span>
            <select value={form.topic} onChange={set('topic')}>
              {TOPICS.map((k) => (
                <option key={k} value={k}>{f.topics[k]}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{f.message}</span>
            <textarea rows="5" value={form.message} onChange={set('message')} required aria-invalid={!!bad.message} />
          </label>
          {/* honeypot */}
          <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
          <button className="btn btn-primary btn-lg" disabled={status === 'sending'}>
            {status === 'sending' ? f.sending : f.send} <Icon name="arrow" size={18} flip />
          </button>
          <p className={`form-msg ${status}`} role="status" aria-live="polite">
            {status === 'ok' && f.ok}
            {status === 'fail' && f.fail}
            {status === 'invalid' && f.invalid}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
