import { Router } from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');

const TOPICS = new Set(['genetics', 'supplies', 'equipment', 'partnership', 'other']);
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Optional SMTP: set SMTP_HOST/SMTP_USER/SMTP_PASS/CONTACT_TO in server/.env or the environment.
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

export const contactRouter = Router();

contactRouter.post('/', async (req, res) => {
  const b = req.body || {};
  // Honeypot: real users never fill this hidden field.
  if (b.website) return res.json({ ok: true });

  const msg = {
    name: clean(b.name, 120),
    email: clean(b.email, 160),
    phone: clean(b.phone, 40),
    topic: TOPICS.has(b.topic) ? b.topic : 'other',
    message: clean(b.message, 3000),
  };

  const errors = {};
  if (msg.name.length < 2) errors.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.email)) errors.email = true;
  if (msg.message.length < 10) errors.message = true;
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const record = { ...msg, at: new Date().toISOString() };
  try {
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, 'inquiries.jsonl'), JSON.stringify(record) + '\n');
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_TO || process.env.SMTP_USER,
        replyTo: msg.email,
        subject: `[Masar] ${msg.topic} inquiry from ${msg.name}`,
        text: `${msg.message}\n\n— ${msg.name}\n${msg.email}\n${msg.phone}`,
      });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('contact error', err);
    res.status(500).json({ ok: false });
  }
});
