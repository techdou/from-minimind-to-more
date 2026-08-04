/**
 * learning-path.js —— 首页学习路径(垂直阶段流程图)
 *
 * 设计:放弃 SVG DAG(21 条交叉线太乱),改用 roadmap 风格:
 * - 5 个阶段从上到下排列,每个阶段是一个横条
 * - 阶段间用大向下箭头连接(只连阶段,不画文章间连线)
 * - 对齐阶段特殊处理:分 RL-Free / RL 两条路线
 * - 文章间的具体依赖关系通过"前置"标签文字标注
 * - 用 HTML/CSS 实现,响应式天然支持
 */

import manifest from '../data/manifest.json';
import { getAllProgress } from '../core/progress.js';

// 阶段定义:每阶段含若干"行",每行是一组横向排列的文章
// 对齐阶段用 rows 表达双路线
const STAGES = [
  {
    id: 'foundations',
    name: '第一阶段 · 基石',
    desc: '万丈高楼平地起,理解 LLM 的基本组件',
    rows: [
      { articles: ['tokenizer', 'minimind-design', 'embedding-position-encoding'] },
    ],
  },
  {
    id: 'architecture',
    name: '第二阶段 · 核心架构',
    desc: '深入 Transformer 内部:归一化、注意力、MoE',
    rows: [
      { articles: ['normalization', 'kv-cache-flash-attention', 'moe', 'assembly'] },
    ],
  },
  {
    id: 'supervised',
    name: '第三阶段 · 监督学习',
    desc: '从预训练到指令微调',
    rows: [
      { articles: ['pretrain', 'sft'], flow: 'chain' },  // chain 表示箭头串联
    ],
  },
  {
    id: 'alignment',
    name: '第四阶段 · 对齐',
    desc: '让模型听话的两条路线',
    rows: [
      { label: 'RL-Free 路线', articles: ['dpo'] },
      { label: 'RL 路线', articles: ['rl-overview', 'ppo', 'grpo', 'spo'], flow: 'chain' },
    ],
  },
  {
    id: 'career',
    name: '第五阶段 · 求职',
    desc: '面试冲刺',
    rows: [
      { articles: ['interview-100'] },
    ],
  },
];

/**
 * 渲染学习路径到目标容器
 */
export function renderLearningPath(container) {
  const progress = getAllProgress();
  const slugToArticle = {};
  manifest.forEach((a) => { slugToArticle[a.slug] = a; });

  const stagesHTML = STAGES.map((stage, si) => {
    const isLast = si === STAGES.length - 1;
    return `
      ${renderStage(stage, slugToArticle, progress)}
      ${!isLast ? '<div class="lp-stage-arrow">↓</div>' : ''}
    `;
  }).join('');

  container.innerHTML = `
    <div class="learning-path-container">
      <div class="learning-path-header">
        <h3>学习路径</h3>
        <span class="learning-path-hint">推荐按阶段顺序学习 · 点击卡片跳转阅读</span>
      </div>
      <div class="lp-stages">
        ${stagesHTML}
      </div>
    </div>
  `;

  // 卡片点击跳转
  container.querySelectorAll('[data-slug]').forEach((el) => {
    el.addEventListener('click', () => {
      location.hash = `#/article/${el.dataset.slug}`;
    });
  });
}

function renderStage(stage, slugToArticle, progress) {
  const rowsHTML = stage.rows.map((row) => renderRow(row, slugToArticle, progress)).join('');
  return `
    <div class="lp-stage">
      <div class="lp-stage-header">
        <span class="lp-stage-name">${stage.name}</span>
        <span class="lp-stage-desc">${stage.desc}</span>
      </div>
      <div class="lp-stage-body">
        ${rowsHTML}
      </div>
    </div>
  `;
}

function renderRow(row, slugToArticle, progress) {
  const isChain = row.flow === 'chain';
  const labelHTML = row.label ? `<div class="lp-route-label">${row.label}</div>` : '';

  const cards = row.articles
    .map((slug) => slugToArticle[slug])
    .filter(Boolean)
    .map((article) => renderCard(article, progress));

  // chain 模式:卡片之间插入小箭头
  const inner = isChain
    ? cards.join('<span class="lp-chain-arrow">→</span>')
    : cards.join('');

  return `
    <div class="lp-row ${isChain ? 'lp-row-chain' : ''} ${row.label ? 'lp-row-labeled' : ''}">
      ${labelHTML}
      <div class="lp-row-cards">${inner}</div>
    </div>
  `;
}

function renderCard(article, progress) {
  const status = getNodeStatus(article.slug, progress);
  const statusClass = `lp-card-${status}`;
  const prereqText = formatPrereqs(article.prerequisites);

  return `
    <div class="lp-card ${statusClass}" data-slug="${article.slug}">
      <div class="lp-card-status-dot"></div>
      <div class="lp-card-body">
        <div class="lp-card-title">${article.title}</div>
        ${prereqText ? `<div class="lp-card-prereq">前置: ${prereqText}</div>` : ''}
      </div>
      <div class="lp-card-meta">
        <span class="lp-card-diff">${diffLabel(article.difficulty)}</span>
        <span class="lp-card-time">${article.duration}min</span>
      </div>
    </div>
  `;
}

function formatPrereqs(prereqs) {
  if (!prereqs || prereqs.length === 0) return '';
  // slug → 短名
  const slugToShort = {
    tokenizer: 'Tokenizer',
    'minimind-design': '设计目录',
    'embedding-position-encoding': 'Embedding',
    normalization: '归一化',
    'kv-cache-flash-attention': 'KVCache',
    moe: 'MoE',
    assembly: '超级拼装',
    pretrain: 'Pretrain',
    sft: 'SFT',
    'rl-overview': 'RL概览',
    dpo: 'DPO',
    ppo: 'PPO',
    grpo: 'GRPO',
    spo: 'SPO',
  };
  return prereqs.map((p) => slugToShort[p] || p).join('、');
}

function getNodeStatus(slug, progress) {
  const p = progress[slug];
  if (p?.read) return 'read';
  if (p?.percent > 5) return 'in-progress';
  return 'todo';
}

function diffLabel(d) {
  const map = { beginner: '入门', intermediate: '进阶', advanced: '高级', expert: '专家' };
  return map[d] || d;
}
