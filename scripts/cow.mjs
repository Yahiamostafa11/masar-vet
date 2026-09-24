// Removes the baked-in Arabic tagline from the cow photo by cloning sky over it, then crops on the cow.
import sharp from 'sharp';
const src = 'brand/2.webp';
const [pl, pt, pw, ph] = [805, 202, 118, 135];
const sky = await sharp(src).extract({ left: pl, top: 166, width: pw, height: 32 }).resize(pw, ph, { fit: 'fill' }).blur(2).toBuffer();
const mask = await sharp(Buffer.from(`<svg width="${pw}" height="${ph}"><rect x="10" y="12" width="${pw - 20}" height="${ph - 22}" fill="#fff"/></svg>`)).blur(7).greyscale().toBuffer();
const patch = await sharp(sky).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
const patched = await sharp(src).composite([{ input: patch, left: pl, top: pt }]).png().toBuffer();
const crop = sharp(patched).extract({ left: 822, top: 0, width: 470, height: 472 });
await crop.clone().webp({ quality: 86 }).toFile('client/public/img/cow.webp');
await crop.clone().toBuffer();
