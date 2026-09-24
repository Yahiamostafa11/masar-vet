import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
const out = 'client/public/img';
mkdirSync(out, { recursive: true });
const src = 'brand/2.webp';
const crops = {
  'cow':     [640, 0, 640, 472],
  'tanks':   [0, 480, 410, 275],
  'kit':     [410, 480, 385, 275],
  'imports': [797, 478, 418, 277],
  'straws':  [1220, 478, 316, 278],
  'cooler':  [978, 765, 232, 222],
  'box':     [1210, 765, 326, 222],
  'truck':   [0, 765, 500, 222],
};
for (const [n, [left, top, width, height]] of Object.entries(crops)) {
  await sharp(src).extract({ left, top, width, height }).webp({ quality: 84 }).toFile(`${out}/${n}.webp`);
}
const meta = await sharp('brand/1.webp').metadata();
console.log(meta.width, meta.height);
// brand mark (M) + full lockup
await sharp('brand/1.webp').extract({ left: 250, top: 180, width: 840, height: 520 }).webp({ quality: 90 }).toFile(`${out}/mark.webp`);
await sharp('brand/1.webp').extract({ left: 250, top: 180, width: 840, height: 520 }).resize(256, 256, { fit: 'contain', background: '#ffffff' }).png().toFile('client/public/favicon.png');
await sharp('brand/1.webp').resize(900).webp({ quality: 88 }).toFile(`${out}/logo-full.webp`);
