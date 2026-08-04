/**
 * dialogue-to-segments.js —— 把播客 dialogue.json 转成 MiMo TTS 的 segments.json
 *
 * 用法:node scripts/dialogue-to-segments.js <dialogue.json> <output-segments.json>
 *
 * 角色音色映射:
 * - 苏打(主讲男声)→ MiMo 预设"苏打"
 * - 茉莉(提问女声)→ MiMo 预设"茉莉"
 *
 * 情绪标签映射(emotion → speech_prefix_tags):
 * - 好奇/疑问 → 轻松的疑问语气
 * - 平静 → 平稳讲解
 * - 恍然大悟 → 带领悟感
 * - 强调 → 重点强调
 */

import fs from 'fs';
import path from 'path';

const VOICE_MAP = {
  '苏打': '苏打',
  '茉莉': '茉莉',
};

const STYLE_MAP = {
  '好奇': '像在认真提问,语气自然好奇,不要太正式。',
  '疑问': '带着真实的困惑提问,像学生没跟上时的疑问。',
  '平静': '平稳清晰地讲解,语速适中,像知识博主。',
  '恍然大悟': '带着领悟的语气,像是终于想通了。',
  '强调': '重点强调,语速略慢,让听众感受到这是关键。',
  '轻松': '轻松自然的对话语气。',
};

function dialogueToSegments(dialoguePath, outputPath) {
  const dialogue = JSON.parse(fs.readFileSync(dialoguePath, 'utf-8'));
  const segments = [];

  dialogue.dialogue.forEach((line, idx) => {
    const voice = VOICE_MAP[line.speaker] || '苏打';
    const style = STYLE_MAP[line.emotion] || STYLE_MAP['平静'];
    // filename 用 ASCII 避免兼容性问题(speaker 用 s/m 前缀)
    const speakerCode = line.speaker === '苏打' ? 'host' : 'guest';

    segments.push({
      index: idx + 1,
      title: `${speakerCode}_${idx + 1}`,
      filename: `${String(idx + 1).padStart(2, '0')}_${speakerCode}.wav`,
      model: 'mimo-v2.5-tts',
      voice: voice,
      format: 'wav',
      style_instruction: style,
      speech_text: line.text,
    });
  });

  const output = { segments };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`[OK] ${dialoguePath} → ${outputPath}`);
  console.log(`  ${segments.length} 段, 苏打/茉莉交替`);
  console.log(`  下一步:`);
  console.log(`  python ~/.agents/skills/mimo-lecture-audio-skill/scripts/mimo_tts_batch.py \\`);
  console.log(`    --segments ${outputPath} \\`);
  console.log(`    --out-dir podcast/audio/${dialogue.slug || path.basename(dialoguePath, '.json')} \\`);
  console.log(`    --manifest podcast/audio/${dialogue.slug || 'output'}/manifest.json`);
}

// CLI
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('用法: node scripts/dialogue-to-segments.js <dialogue.json> <output-segments.json>');
  process.exit(1);
}
dialogueToSegments(args[0], args[1]);
