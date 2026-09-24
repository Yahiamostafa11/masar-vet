// Compresses source clips into web-ready hero loops: 1080p max, 30fps, no audio, <=10s, faststart.
import ffmpeg from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';

const dl = 'C:/Users/Yahia Mostafa/Downloads/';
const clips = [
  '13903475_3840_2160_25fps.mp4',
  '19956949-uhd_3840_2160_60fps.mp4',
  '14667001_3840_2160_25fps.mp4',
  '10715233-hd_1920_1080_25fps.mp4',
  '854839-hd_1280_720_30fps.mp4',
  '14225147_3840_2160_24fps.mp4',
];
mkdirSync('client/public/media', { recursive: true });
clips.forEach((c, i) => {
  const out = `client/public/media/hero-${i + 1}.mp4`;
  const r = spawnSync(ffmpeg, [
    '-y', '-i', dl + c, '-t', '10', '-an',
    '-vf', "scale='min(1920,iw)':-2,fps=30",
    '-c:v', 'libx264', '-crf', '29', '-preset', 'medium', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', out,
  ], { encoding: 'utf8' });
  const dur = /Duration: ([\d:.]+)/.exec(r.stderr)?.[1];
  console.log(out, r.status === 0 ? (statSync(out).size / 1e6).toFixed(1) + ' MB' : 'FAILED', 'src duration', dur);
  // poster frame
  spawnSync(ffmpeg, ['-y', '-i', out, '-ss', '1', '-frames:v', '1', '-vf', 'scale=640:-2', `client/public/media/hero-${i + 1}.jpg`]);
});
