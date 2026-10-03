// Runs after `vite build` and `vite build --ssr`: renders the React app to static HTML for each
// language and writes it into dist/, so search engines get the full content without running JS.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const SITE = 'https://masar-vet.com';
const { render, meta } = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href);
const template = readFileSync('dist/index.html', 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Replaces the content="" of <meta name|property="key" content="...">.
function setMeta(html, key, value) {
  const re = new RegExp(String.raw`(<meta\s+(?:name|property)="${key}"\s+content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`prerender: <meta ${key}> not found in index.html`);
  return html.replace(re, (_, a, b) => a + esc(value) + b);
}

const pages = [
  { lang: 'en', url: '/', out: 'dist/index.html', dir: 'ltr', locale: 'en_US' },
  { lang: 'ar', url: '/ar', out: 'dist/ar/index.html', dir: 'rtl', locale: 'ar_EG' },
];

for (const p of pages) {
  const m = meta[p.lang];
  // Function replacers keep the rendered markup literal ("$" patterns are not special).
  const body = render(p.lang);
  let html = template
    .replace('<html lang="en" dir="ltr">', () => `<html lang="${p.lang}" dir="${p.dir}">`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(m.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, (_, a, b) => a + SITE + p.url + b)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  html = setMeta(html, 'description', m.description);
  html = setMeta(html, 'og:title', m.title);
  html = setMeta(html, 'og:description', m.description);
  html = setMeta(html, 'og:url', SITE + p.url);
  html = setMeta(html, 'og:locale', p.locale);
  mkdirSync(path.dirname(p.out), { recursive: true });
  writeFileSync(p.out, html);
  console.log(`prerendered ${p.url} (${p.lang}) -> ${p.out}  ${(html.length / 1024).toFixed(0)} kB`);
}
