// 1200x630 social share image (white card + logo) from the brand logo.
import sharp from 'sharp';
const logo = await sharp('../brand/1.webp').resize({ height: 560, fit: 'inside' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
  .composite([{ input: logo, gravity: 'centre' }])
  .jpeg({ quality: 88 })
  .toFile('../client/public/og-image.jpg');
