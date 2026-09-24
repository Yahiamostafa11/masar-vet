import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import { PRODUCTS } from '../data.js';
import { SectionHead } from './Sections.jsx';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';

const FILTERS = ['all', 'genetics', 'equipment', 'storage'];
const TOPIC_FOR = { genetics: 'genetics', equipment: 'equipment', storage: 'equipment' };

export default function Products({ onEnquire }) {
  const { t } = useI18n();
  const p = t.products;
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const shown = PRODUCTS.filter((x) => filter === 'all' || x.category === filter);

  return (
    <section id="products" className="section products">
      <div className="container">
        <SectionHead eyebrow={p.eyebrow} title={p.title} text={p.text} />
        <Reveal className="filters" role="tablist">
          {FILTERS.map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
              {p.filters[f]}
            </button>
          ))}
        </Reveal>

        <div className="product-grid">
          {shown.map((x) => {
            const item = p.items[x.id];
            return (
              <button key={x.id} className="product" onClick={() => setSelected(x)}>
                <span className="product-img">
                  <img src={x.image} width={x.w} height={x.h} loading="lazy" decoding="async" alt="" />
                </span>
                <span className="product-body">
                  <span className="tag">{item.tag}</span>
                  <strong>{item.name}</strong>
                  <span className="product-more">
                    {p.view} <Icon name="arrow" size={16} flip />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <ProductDialog
          product={selected}
          item={p.items[selected.id]}
          labels={p}
          onClose={() => setSelected(null)}
          onEnquire={() => {
            onEnquire(TOPIC_FOR[selected.category]);
            setSelected(null);
            requestAnimationFrame(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }));
          }}
        />
      )}
    </section>
  );
}

function ProductDialog({ product, item, labels, onClose, onEnquire }) {
  const ref = useRef(null);
  const { t } = useI18n();

  useEffect(() => {
    const d = ref.current;
    d.showModal();
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      aria-label={item.name}
    >
      <div className="modal-in">
        <button className="modal-x" onClick={() => ref.current.close()} aria-label={t.nav.close}>
          <Icon name="close" size={22} />
        </button>
        <div className="modal-img">
          <img src={product.image} width={product.w} height={product.h} alt={item.name} />
        </div>
        <div className="modal-body">
          <span className="tag">{item.tag}</span>
          <h3>{item.name}</h3>
          <p>{item.desc}</p>
          <h4>{labels.highlights}</h4>
          <ul>
            {item.points.map((pt) => (
              <li key={pt}>
                <Icon name="check" size={18} /> {pt}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={onEnquire}>
            {labels.enquire} <Icon name="arrow" size={18} flip />
          </button>
        </div>
      </div>
    </dialog>
  );
}
