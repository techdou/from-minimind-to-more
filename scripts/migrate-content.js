/**
 * migrate-content.js —— 把根目录的中文 md 迁移到 content/ 篇章目录
 *
 * 运行一次即可:node scripts/migrate-content.js
 * 迁移后原文件仍保留(可手动删),content/ 下是带英文 slug 的新副本。
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// 原文件名 → 目标(slug + category + order)
const MAP = [
  // 基石篇
  { src: '基石：关于Tokenizer你所需要知道的一切.md', slug: 'tokenizer', cat: 'foundations', order: 1 },
  { src: '基石：Minimind的设计目录.md', slug: 'minimind-design', cat: 'foundations', order: 2 },
  { src: '基石：语义的几何与时空的折叠：Embedding与位置编码.md', slug: 'embedding-position-encoding', cat: 'foundations', order: 3 },
  // 架构篇
  { src: '架构篇：大语言模型归一化技术：原理、演进与前沿架构.md', slug: 'normalization', cat: 'architecture', order: 1 },
  { src: '架构篇：最常见的大模型优化方法：从KV Cache到Flash Attention.md', slug: 'kv-cache-flash-attention', cat: 'architecture', order: 2 },
  { src: '架构篇：混合专家模型（MoE）：架构演进、核心算法与工程实践.md', slug: 'moe', cat: 'architecture', order: 3 },
  { src: '架构篇：超级拼装.md', slug: 'assembly', cat: 'architecture', order: 4 },
  // 算法篇
  { src: '算法篇：Minimind的Pretrain.md', slug: 'pretrain', cat: 'algorithms', order: 1 },
  { src: '算法篇：Minimind的SFT.md', slug: 'sft', cat: 'algorithms', order: 2 },
  { src: '算法篇：大模型强化学习算法概览.md', slug: 'rl-overview', cat: 'algorithms', order: 3 },
  { src: '算法篇：Minimind的DPO.md', slug: 'dpo', cat: 'algorithms', order: 4 },
  { src: '算法篇：Minimind的PPO.md', slug: 'ppo', cat: 'algorithms', order: 5 },
  { src: '算法篇：Minimind的GRPO及其变体.md', slug: 'grpo', cat: 'algorithms', order: 6 },
  { src: '算法篇：Minimind的SPO.md', slug: 'spo', cat: 'algorithms', order: 7 },
  // 求职
  { src: '大模型八股100问.md', slug: 'interview-100', cat: 'career', order: 1 },
  // 可选
  { src: '可选：大规模语言模型推理与训练优化机制.md', slug: 'inference-training-optimization', cat: 'optional', order: 1 },
];

let copied = 0;
let skipped = 0;

for (const item of MAP) {
  const srcPath = path.join(ROOT, item.src);
  const destDir = path.join(ROOT, 'content', item.cat);
  const destPath = path.join(destDir, `${item.slug}.md`);

  if (!fs.existsSync(srcPath)) {
    console.warn(`[跳过] 源文件不存在: ${item.src}`);
    skipped++;
    continue;
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  console.log(`[OK] ${item.src} → content/${item.cat}/${item.slug}.md`);
  copied++;
}

console.log(`\n完成:复制 ${copied} 篇,跳过 ${skipped} 篇`);
console.log('下一步:运行 gen-frontmatter.js 给每篇加 frontmatter');
