# Masar — Veterinary & Animal Reproduction Solutions

Bilingual (EN / AR, RTL) single-page portfolio site. React 19 + Vite on the front, Node/Express on the back.

## Run
```bash
npm install
npm run dev      # Vite on :5173 (proxying /api) + API on :3001
npm run build    # production build -> client/dist
npm start        # Express serves client/dist + /api on :3001
```

## Where things live
| What | Where |
| --- | --- |
| Copy (English / Arabic) | `client/src/i18n/en.js`, `ar.js` |
| Phone / WhatsApp / email / website | `client/src/config.js` (**placeholders from the brand board — replace**) |
| Product list + images | `client/src/data.js` (+ text in the i18n files under `products.items`) |
| Colors & layout | `client/src/styles/global.css` (CSS variables at the top) |
| Hero background videos | `client/public/media/hero-1..6.mp4` (made by `node scripts/videos.mjs`) |
| Contact form backend | `server/src/contact.js` — saves to `server/data/inquiries.jsonl`, optional SMTP via `server/.env` |
| Image crops from the brand board | `npm run assets` (`scripts/crop.mjs`, source in `brand/`) |

## Notes
- Language choice is remembered and applied before first paint (no RTL flash).
- Server: gzip, security headers (CSP), immutable caching for hashed assets, rate-limited + honeypot-protected contact endpoint.

## Deploy (masar-vet.com)
Any Node host or Docker works.
```bash
docker build -t masar . && docker run -p 3001:3001 -v masar-data:/app/server/data --env-file server/.env masar
```
Or without Docker: `npm ci && npm run build && npm start` (Node 22+), behind a reverse proxy with HTTPS (nginx/Caddy/platform TLS) for `masar-vet.com`.
Copy `server/.env.example` to `server/.env` and fill in SMTP to have inquiries emailed to info@masar-vet.com (they are always also saved to `server/data/inquiries.jsonl`).

### Hostinger (Node.js Web App)
hPanel → Websites → Add website → **Node.js Apps** → Import Git repository → `Yahiamostafa11/masar-vet` (branch `main`).
- Framework: Express.js (or "Other"), Node version: 22 (20 also works)
- Install: `npm install` · Build command: `npm run build` · Start command: `npm start`
- Entry file: `server/src/index.js`
- Environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO=info@masar-vet.com` (see `server/.env.example`)
- Connect the domain `masar-vet.com` to this app. If the domain still has an old static "Deploy from GitHub" site, remove that first: it is what serves the 403 page.
