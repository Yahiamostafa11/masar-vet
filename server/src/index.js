import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { contactRouter } from './contact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../../client/dist');
const PORT = process.env.PORT || 3001;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'data:'],
        'media-src': ["'self'"],
        'upgrade-insecure-requests': null,
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use(
  '/api/contact',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false }),
  contactRouter
);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

if (existsSync(dist)) {
  // Hashed build assets are immutable; everything else revalidates.
  app.use(
    '/assets',
    express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '1y', index: false })
  );
  app.use(express.static(dist, { maxAge: '1h', index: false }));
  // SPA fallback
  app.get('*', (req, res) => {
    // A missing file (e.g. optional /media/hero.mp4) must 404, not return the HTML shell.
    if (path.extname(req.path)) return res.status(404).end();
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => res.send('API running. Build the client with `npm run build`, or use `npm run dev`.'));
}

app.listen(PORT, () => console.log(`Masar server listening on http://localhost:${PORT}`));
