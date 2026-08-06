/**
 * generate-all-srt.js —— 从 TTS manifest 批量生成 SRT 字幕
 *
 * 每篇 manifest 的 segments 数组按顺序对应字幕条目:
 * - 累积 duration_seconds(+0.4s 段间停顿)得到时间戳
 * - speech_text 是字幕文本
 * - voice 是说话人(可作为字幕前缀)
 *
 * 用法:node scripts/generate-all-srt.js
 * 幂等:已存在 SRT 跳过
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'podcast', 'audio');

function secToSrtTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
}

function generateSrt(manifest) {
  let srt = '';
  let idx = 1;
  let elapsed = 0;
  const gap = 0.4; // 段间停顿秒

  for (const seg of manifest.segments) {
    const dur = seg.duration_seconds || 2;
    const start = elapsed;
    const end = elapsed + dur;

    // 说话人标签 + 文本
    const speaker = seg.voice || '';
    const text = seg.speech_text || '';

    srt += `${idx}\n`;
    srt += `${secToSrtTime(start)} --> ${secToSrtTime(end)}\n`;
    srt += `${speaker}: ${text}\n\n`;

    idx++;
    elapsed = end + gap;
  }

  return srt;
}

// 遍历所有篇章
const dirs = fs.readdirSync(AUDIO_DIR).filter((d) =>
  fs.statSync(path.join(AUDIO_DIR, d)).isDirectory(),
);

let generated = 0, skipped = 0;

for (const slug of dirs) {
  const manifestPath = path.join(AUDIO_DIR, slug, 'manifest.json');
  const srtPath = path.join(AUDIO_DIR, slug, 'subtitles.srt');

  if (fs.existsSync(srtPath)) {
    console.log(`[跳过] ${slug} (SRT 已存在)`);
    skipped++;
    continue;
  }

  if (!fs.existsSync(manifestPath)) {
    console.log(`[跳过] ${slug} (无 manifest)`);
    continue;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  if (!manifest.segments || manifest.segments.length === 0) {
    console.log(`[跳过] ${slug} (manifest 无 segments)`);
    continue;
  }

  const srt = generateSrt(manifest);
  fs.writeFileSync(srtPath, srt, 'utf-8');
  console.log(`[生成] ${slug} (${manifest.segments.length} 条字幕)`);
  generated++;
}

console.log(`\n完成:生成 ${generated} 个 SRT,跳过 ${skipped} 个`);
