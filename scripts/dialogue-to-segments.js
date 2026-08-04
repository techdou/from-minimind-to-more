/**
 * dialogue-to-segments.js —— 把播客 dialogue.json 转成 MiMo TTS segments.json
 *
 * 用法:node scripts/dialogue-to-segments.js <dialogue.json> <output-segments.json> [style]
 *
 * 支持 4 种风格(style 参数),每种用不同音色组合:
 * 1. interview  — 深度访谈:苏打(男沉稳) + 茉莉(女活泼)  [已有风格]
 * 2. lecture    — 课堂讲解:白桦(男醇厚) + 冰糖(女清亮)
 * 3. quickfire  — 快问快答:茉莉(女活泼) + 冰糖(女清亮)  双女声
 * 4. debate     — 技术辩论:苏打(男沉稳) + 白桦(男醇厚)  双男声
 *
 * dialogue.json 里的 speaker 字段会被映射到对应风格的音色。
 * speaker 名保持不变(显示用),voice 字段根据风格映射。
 */

import fs from 'fs';
import path from 'path';

// 风格 → 音色映射
// key 是 dialogue 里的 speaker(通常是"主讲"/"提问"角色名或自定义名)
// value 是 MiMo 预设音色名
const STYLES = {
  // 深度访谈:苏打主讲 + 茉莉提问
  interview: {
    voiceMap: { '苏打': '苏打', '茉莉': '茉莉' },
    styleMap: {
      '好奇': '像在认真提问,语气自然好奇,不要太正式。',
      '疑问': '带着真实的困惑提问,像学生没跟上时的疑问。',
      '平静': '平稳清晰地讲解,语速适中,像知识博主。',
      '恍然大悟': '带着领悟的语气,像是终于想通了。',
      '强调': '重点强调,语速略慢,让听众感受到这是关键。',
      '轻松': '轻松自然的对话语气。',
    },
  },

  // 课堂讲解:白桦教授 + 冰糖助教
  lecture: {
    voiceMap: { '白桦': '白桦', '冰糖': '冰糖', '苏打': '白桦', '茉莉': '冰糖' },
    styleMap: {
      '好奇': '像助教帮忙提问,语气礼貌而好奇。',
      '疑问': '带着学生常见的困惑提问,语气温和。',
      '平静': '像大学教授一样从容讲解,语速稳定,重点处适当停顿。',
      '恍然大悟': '领悟的语气,像是终于把知识点串联起来了。',
      '强调': '严肃地强调关键定义,语速放慢,确保学生记住。',
      '轻松': '轻松的课堂互动语气,带一点亲和力。',
    },
  },

  // 快问快答:茉莉 + 冰糖双女声
  quickfire: {
    voiceMap: { '茉莉': '茉莉', '冰糖': '冰糖', '苏打': '茉莉' },
    styleMap: {
      '好奇': '快速好奇地追问,语速明快。',
      '疑问': '干脆利落地提出疑问,不拖泥带水。',
      '平静': '简洁清晰地回答,语速偏快但不急促。',
      '恍然大悟': '恍然大悟的轻快语气。',
      '强调': '快速但有力地强调重点。',
      '轻松': '轻松活泼的快问快答节奏。',
    },
  },

  // 技术辩论:苏打 vs 白桦双男声
  debate: {
    voiceMap: { '苏打': '苏打', '白桦': '白桦', '茉莉': '白桦' },
    styleMap: {
      '好奇': '带着审视的提问,像学术讨论中的质询。',
      '疑问': '直接提出质疑,语气坚定但不冒犯。',
      '平静': '沉稳地阐述自己的观点,像在给同行做技术报告。',
      '恍然大悟': '被对方说服的语气,大方承认。',
      '强调': '有力地强调自己的核心论点。',
      '轻松': '辩论间隙的轻松调侃。',
    },
  },
};

function dialogueToSegments(dialoguePath, outputPath, styleName = 'interview') {
  const style = STYLES[styleName] || STYLES.interview;
  const dialogue = JSON.parse(fs.readFileSync(dialoguePath, 'utf-8'));
  const segments = [];

  dialogue.dialogue.forEach((line, idx) => {
    // 根据 style 的 voiceMap 映射音色;如果 speaker 不在 map 里,用第一个映射
    const voice = style.voiceMap[line.speaker] || Object.values(style.voiceMap)[0];
    const styleInstruction = style.styleMap[line.emotion] || style.styleMap['平静'];

    // filename 用 speaker 角色编码(ASCII)
    const speakerCode = line.speaker === Object.keys(style.voiceMap)[0] ? 'host' : 'guest';

    segments.push({
      index: idx + 1,
      title: `${speakerCode}_${idx + 1}`,
      filename: `${String(idx + 1).padStart(2, '0')}_${speakerCode}.wav`,
      model: 'mimo-v2.5-tts',
      voice: voice,
      format: 'wav',
      style_instruction: styleInstruction,
      speech_text: line.text,
    });
  });

  const output = { segments };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`[OK] ${dialoguePath} → ${outputPath} (style: ${styleName})`);
  console.log(`  ${segments.length} 段`);
  console.log(`  音色映射: ${JSON.stringify(style.voiceMap)}`);
}

// CLI
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('用法: node scripts/dialogue-to-segments.js <dialogue.json> <output> [style]');
  console.log('风格: interview | lecture | quickfire | debate');
  process.exit(1);
}
dialogueToSegments(args[0], args[1], args[2]);
