/**
 * merge-podcast-timings.js —— 把 TTS manifest 的真实时长合并进 dialogue.json
 *
 * 用法:node scripts/merge-podcast-timings.js <slug>
 * 读取:podcast/audio/<slug>/manifest.json + podcast/scripts/<slug>.json
 * 写入:public/podcast/scripts/<slug>.json(含 timings 数组)
 */

import fs from 'fs';
import path from 'path';

const slug = process.argv[2];
if (!slug) {
  console.log('用法: node scripts/merge-podcast-timings.js <slug>');
  process.exit(1);
}

const dialoguePath = path.join('podcast', 'scripts', `${slug}.json`);
const manifestPath = path.join('podcast', 'audio', slug, 'manifest.json');

if (!fs.existsSync(dialoguePath)) {
  console.error(`找不到 dialogue: ${dialoguePath}`);
  process.exit(1);
}
if (!fs.existsSync(manifestPath)) {
  console.error(`找不到 manifest: ${manifestPathPath}`);
  process.exit(1);
}

const dialogue = JSON.parse(fs.readFileSync(dialoguePath, 'utf-8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// 按 index 对齐,计算累积时间
let elapsed = 0;
const timings = [];
for (const seg of manifest.segments) {
  const dur = seg.duration_seconds || 2;
  timings.push({ start: elapsed, end: elapsed + dur, duration: dur });
  elapsed += dur + 0.4; // 段间 0.4 秒停顿(merge_wav 的 silence_ms)
}

dialogue.timings = timings;
dialogue.total_duration = elapsed;
dialogue.audio_url = `/podcast/audio/${slug}.mp3`;

// 写到 public
const outPath = path.join('public', 'podcast', 'scripts', `${slug}.json`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(dialogue, null, 2), 'utf-8');

console.log(`[OK] ${outPath}`);
console.log(`  ${timings.length} 段, 总时长 ${elapsed.toFixed(1)}s`);
