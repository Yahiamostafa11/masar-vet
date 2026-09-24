import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, saveData } from '../hooks/hooks.js';

/*
 * Full-bleed hero background.
 *  1. A blurred photographic poster is always shown (instant, tiny).
 *  2. After the page has loaded, a playlist of short clips (/media/hero-N.mp4) plays and cross-fades
 *     between two stacked <video> elements. Only the NEXT clip is preloaded, so the page never pulls
 *     the whole set. Skipped for reduced-motion / data-saver visitors.
 *  3. An animated DNA helix (canvas) plays on top.
 */
const CLIPS = [1, 2, 3, 4, 5, 6].map((n) => `/media/hero-${n}.mp4`);
const MAX_PLAY = 8.5; // seconds each clip is shown
const FADE_MS = 1600;

export default function HeroBackdrop() {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const slots = [useRef(null), useRef(null)];
  const state = useRef({ active: 0, idx: 0, switching: false, started: false });
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || saveData()) return;
    const start = () => setEnabled(true);
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  const load = (slot, i) => {
    const v = slots[slot].current;
    v.src = CLIPS[i % CLIPS.length];
    v.load();
  };

  // Kick off the first clip once enabled.
  useEffect(() => {
    if (!enabled) return;
    load(0, 0);
    slots[0].current.play().catch(() => {});
  }, [enabled]);

  // Pause the video work while the hero is off screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      const v = slots[state.current.active].current;
      if (!v || !v.src) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  const advance = () => {
    const s = state.current;
    if (s.switching) return;
    s.switching = true;
    const from = s.active;
    const to = 1 - from;
    const next = slots[to].current;
    next.currentTime = 0;
    next.play().catch(() => {});
    s.active = to;
    s.idx = (s.idx + 1) % CLIPS.length;
    setActive(to);
    setTimeout(() => {
      slots[from].current.pause();
      load(from, s.idx + 1); // preload the following clip into the slot that just faded out
      s.switching = false;
    }, FADE_MS + 200);
  };

  const onTime = (slot) => (e) => {
    const v = e.currentTarget;
    if (slot !== state.current.active) return;
    if (v.currentTime > MAX_PLAY || (v.duration && v.duration - v.currentTime < 1.2)) advance();
  };

  const onCanPlayFirst = () => {
    const s = state.current;
    if (s.started) return;
    s.started = true;
    setReady(true);
    load(1, 1); // preload clip 2 behind the first
  };

  const onError = (slot) => () => {
    if (!state.current.started && slot === 0) setEnabled(false); // no video at all: keep the poster
    else if (slot === state.current.active) advance();
  };

  // DNA helix
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf = 0, last = 0, phase = 0, visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const dot = (x, y, z, edge, rgb) => {
      const depth = (z + 1) / 2;
      ctx.fillStyle = `rgba(${rgb},${(0.15 + depth * 0.7) * edge})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8 + depth * 3, 0, Math.PI * 2);
      ctx.fill();
    };
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      phase += dt * 0.7;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, R = w * 0.34, n = Math.round(h / 22), step = h / n;
      for (let i = 0; i <= n; i++) {
        const y = i * step;
        const a = phase + i * 0.34;
        const c = Math.cos(a), s = Math.sin(a);
        const x1 = cx + c * R, x2 = cx - c * R;
        const edge = Math.min(1, Math.min(y, h - y) / (h * 0.18));
        if (i % 2 === 0) {
          ctx.strokeStyle = `rgba(255,255,255,${0.1 * edge})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }
        dot(x1, y, s, edge, '124,194,66');
        dot(x2, y, -s, edge, '150,190,255');
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    raf = requestAnimationFrame((t) => { last = t; draw(t); });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true" ref={rootRef}>
      <img className="backdrop-poster" src="/img/cow.webp" alt="" width="470" height="472" fetchPriority="high" decoding="async" />
      {[0, 1].map((slot) => (
        <video
          key={slot}
          ref={slots[slot]}
          className={`backdrop-video${ready && active === slot ? ' on' : ''}`}
          muted
          playsInline
          preload="auto"
          onCanPlay={slot === 0 ? onCanPlayFirst : undefined}
          onTimeUpdate={onTime(slot)}
          onError={onError(slot)}
        />
      ))}
      <div className="backdrop-shade" />
      <canvas ref={canvasRef} className="backdrop-dna" />
    </div>
  );
}
