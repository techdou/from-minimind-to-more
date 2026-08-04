/**
 * gen-frontmatter.js —— 批量给 content/ 下的 md 加 frontmatter
 *
 * 自动抽取:
 * - title: 从 H1 或文件名
 * - keypoints: 正则匹配 **面试考点：...** / **核心考点** / **高频考点** + # [面试考点]
 * - objectives: 从引言段(第一个 H2 含"引言"或文章开头几段)抽取关键句
 * - prerequisites: 从预定义的依赖图填(explorer 实证的交叉引用)
 * - duration: 行数 / 25 行每分钟
 * - formula_density: 统计 $$ 和 $ 数量
 *
 * 人工后续可校验 content/ 下每篇的 frontmatter。
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');

// 预定义依赖图(explorer 实证)
const DEPS = {
  'tokenizer': [],
  'minimind-design': [],
  'embedding-position-encoding': ['tokenizer', 'minimind-design'],
  'normalization': ['embedding-position-encoding', 'minimind-design'],
  'kv-cache-flash-attention': ['embedding-position-encoding'],
  'moe': ['normalization', 'kv-cache-flash-attention'],
  'assembly': ['normalization', 'kv-cache-flash-attention', 'moe', 'embedding-position-encoding'],
  'pretrain': ['assembly'],
  'sft': ['pretrain'],
  'rl-overview': ['sft'],
  'dpo': ['sft', 'rl-overview'],
  'ppo': ['rl-overview', 'sft'],
  'grpo': ['ppo'],
  'spo': ['ppo', 'grpo'],
  'interview-100': [],
  'inference-training-optimization': ['kv-cache-flash-attention'],
};

// 中文标题映射(比 H1 更友好)
const TITLES = {
  'tokenizer': '关于 Tokenizer 你所需要知道的一切',
  'minimind-design': 'Minimind 的设计目录',
  'embedding-position-encoding': '语义的几何与时空的折叠：Embedding 与位置编码',
  'normalization': '大语言模型归一化技术：原理、演进与前沿架构',
  'kv-cache-flash-attention': '最常见的大模型优化方法：从 KV Cache 到 Flash Attention',
  'moe': '混合专家模型（MoE）：架构演进、核心算法与工程实践',
  'assembly': '超级拼装',
  'pretrain': 'Minimind 的 Pretrain',
  'sft': 'Minimind 的 SFT',
  'rl-overview': '大模型强化学习算法概览',
  'dpo': 'Minimind 的 DPO',
  'ppo': 'Minimind 的 PPO',
  'grpo': 'Minimind 的 GRPO 及其变体',
  'spo': 'Minimind 的 SPO',
  'interview-100': '大模型八股 100 问',
  'inference-training-optimization': '大规模语言模型推理与训练优化机制',
};

const CATEGORY_NAMES = {
  foundations: '基石与原理',
  architecture: '核心架构',
  algorithms: '算法与演进',
  career: '求职与实战',
  optional: '拓展阅读',
};

// 难度推断(基于行数 + 篇章)
function inferDifficulty(slug, category, lines) {
  if (slug === 'interview-100') return 'beginner';
  if (category === 'foundations') return lines > 700 ? 'intermediate' : 'beginner';
  if (category === 'architecture') return lines > 700 ? 'advanced' : 'intermediate';
  if (category === 'algorithms') {
    if (['rl-overview', 'pretrain', 'sft'].includes(slug)) return 'intermediate';
    return lines > 800 ? 'expert' : 'advanced';
  }
  return 'intermediate';
}

// 统计公式密度
function countFormulas(text) {
  const block = (text.match(/\$\$/g) || []).length / 2;
  const inline = (text.match(/(^|[^\\])\$([^$\n]+?)\$/g) || []).length;
  const total = block + inline;
  if (total > 20) return 'high';
  if (total > 8) return 'medium';
  if (total > 0) return 'low';
  return 'none';
}

// 抽取考点
function extractKeypoints(text) {
  const points = new Set();

  // 形态 A: **面试考点：...** / **核心考点...** / **高频考点**
  const patternA = /\*\*((?:面试考点|核心考点|高频考点|必考)[：:].*?)\*\*/g;
  let m;
  while ((m = patternA.exec(text)) !== null) {
    // 清理:去掉前缀标签,保留核心问题
    let q = m[1].replace(/^(面试考点|核心考点|高频考点|必考)[：:]\s*/, '').trim();
    if (q.length > 5 && q.length < 120) points.add(q);
  }

  // 形态 A 变体:**这是...必考的...** / **...高频考点**
  const patternA2 = /\*\*(这是[^*]*?(?:必考|高频|核心考点)[^*]*?)\*\*/g;
  while ((m = patternA2.exec(text)) !== null) {
    let q = m[1].trim();
    if (q.length > 5 && q.length < 120) points.add(q);
  }

  // 形态 B:# [面试考点] / # [核心考点 N] (代码注释)
  const patternB = /#\s*\[(面试考点|核心考点[^\]]*)\]\s*(.+)/g;
  while ((m = patternB.exec(text)) !== null) {
    let q = m[2].trim().replace(/^[:：]\s*/, '');
    if (q.length > 5 && q.length < 120) points.add(q);
  }

  return Array.from(points).slice(0, 8); // 最多 8 条
}

// 抽取学习目标(从引言段)
function extractObjectives(text, slug) {
  const objectives = [];

  // 找引言节(## ...引言 或 ## 写在前面)
  const introMatch = text.match(/##\s*\*{0,2}(?:[^#\n]*(?:引言|写在前面|前言|摘要)[^#\n]*)\n([\s\S]*?)(?=\n##\s|\n##\s\*{2})/i);
  let introText = introMatch ? introMatch[1] : text.split('\n## ')[1] || '';

  // 从引言抽"理解/掌握/辨析/对比"开头的句子
  const sentences = introText.split(/[。！\n]/);
  for (const s of sentences) {
    const trimmed = s.trim().replace(/[*_`]/g, '');
    if (/(理解|掌握|辨析|对比|剖析|深入|探讨|分析|认识|了解)/.test(trimmed.slice(0, 6))) {
      if (trimmed.length > 10 && trimmed.length < 80) {
        objectives.push(trimmed);
      }
    }
    if (objectives.length >= 4) break;
  }

  // 兜底:如果没抽到,用 title 生成通用目标
  if (objectives.length === 0) {
    const title = TITLES[slug] || slug;
    objectives.push(`理解 ${title} 的核心概念`);
    objectives.push('掌握其在 Minimind 中的实现细节');
  }

  return objectives.slice(0, 4);
}

// 统计代码块语言
function detectCodeLang(text) {
  const py = (text.match(/```python/gi) || []).length;
  const bash = (text.match(/```bash/gi) || []).length;
  if (py > 0) return 'python';
  if (bash > 0) return 'bash';
  return 'python';
}

// 处理单篇
function processFile(filePath, category, order) {
  const slug = path.basename(filePath, '.md');
  const raw = fs.readFileSync(filePath, 'utf-8');

  // 如果已有 frontmatter,跳过(不重复加)
  if (raw.startsWith('---\n') && raw.slice(4).includes('\n---\n')) {
    console.log(`[跳过] 已有 frontmatter: ${category}/${slug}.md`);
    return;
  }

  const lines = raw.split('\n');
  const lineCount = lines.length;
  const title = TITLES[slug] || slug;
  const difficulty = inferDifficulty(slug, category, lineCount);
  const duration = Math.max(5, Math.round(lineCount / 25));
  const keypoints = extractKeypoints(raw);
  const objectives = extractObjectives(raw, slug);
  const formulaDensity = countFormulas(raw);
  const codeLang = detectCodeLang(raw);
  const prerequisites = DEPS[slug] || [];

  // 构建 frontmatter
  const fm = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `category: "${category}"`,
    `series: "${CATEGORY_NAMES[category]}"`,
    `order: ${order}`,
    `status: "published"`,
    `difficulty: "${difficulty}"`,
    `duration: ${duration}`,
  ];

  if (prerequisites.length > 0) {
    fm.push(`prerequisites:`);
    prerequisites.forEach((p) => fm.push(`  - "${p}"`));
  } else {
    fm.push(`prerequisites: []`);
  }

  fm.push('objectives:');
  objectives.forEach((o) => fm.push(`  - "${o.replace(/"/g, '\\"')}"`));

  if (keypoints.length > 0) {
    fm.push('keypoints:');
    keypoints.forEach((k) => fm.push(`  - "${k.replace(/"/g, '\\"')}"`));
  } else {
    fm.push('keypoints: []');
  }

  fm.push(`formula_density: "${formulaDensity}"`);
  fm.push(`code_lang: "${codeLang}"`);

  // tags 从 title 提取关键词(简单版)
  const tags = [slug];
  fm.push(`tags: [${tags.map((t) => `"${t}"`).join(', ')}]`);

  fm.push('---', '');

  const output = fm.join('\n') + raw;
  fs.writeFileSync(filePath, output, 'utf-8');
  console.log(`[OK] ${category}/${slug}.md (${lineCount} 行, ${keypoints.length} 考点, ${formulaDensity} 公式)`);
}

// 遍历 content/
const categories = ['foundations', 'architecture', 'algorithms', 'career', 'optional'];
let total = 0;

for (const cat of categories) {
  const dir = path.join(CONTENT_DIR, cat);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dir, files[i]);
    // 从 migrate 时文件名就是 slug,order 靠排序
    processFile(filePath, cat, i + 1);
    total++;
  }
}

console.log(`\n完成:处理 ${total} 篇`);
