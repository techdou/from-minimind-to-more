/**
 * learning-path.js —— 学习路径(地铁线路图 + 流式链条)
 *
 * P0: 卡片三态(未读灰点/在读橙边条+下一步角标/已读✓降灰)
 *     推荐横幅联动:被推荐的文章在路径中自动标记"在读/推荐"态
 *     阶段进度数字(2/4),全完成变品牌色
 * P1: 流式横向链条(flex-wrap, min-width 220px, 标题允许两行,无省略号)
 *     同阶段有顺序的卡片用 → 连接
 * P2: 左侧贯穿轨道线,阶段编号改站点圆点,阶段过渡由轨道承担
 * P3: 难度徽章分级配色(绿/蓝/橙/紫)
 */

import manifest from '../data/manifest.json';
import { getAllProgress } from '../core/progress.js';

const STAGES = [
  {
    id: 'foundations', name: '基石', subtitle: '理解 LLM 的基本组件',
    chains: [['tokenizer', 'minimind-design', 'embedding-position-encoding']],
  },
  {
    id: 'architecture', name: '核心架构', subtitle: '深入 Transformer 内部构造',
    chains: [['normalization', 'kv-cache-flash-attention', 'moe', 'assembly']],
  },
  {
    id: 'supervised', name: '监督学习', subtitle: '从预训练到指令微调',
    chains: [['pretrain', 'sft']],
  },
  {
    id: 'alignment', name: '对齐', subtitle: '让模型听话的两条路线',
    chains: [
      { route: 'RL-Free', articles: ['dpo'] },
      { route: 'RL', articles: ['rl-overview', 'ppo', 'grpo', 'spo'] },
    ],
  },
  {
    id: 'career', name: '求职', subtitle: '面试冲刺',
    chains: [['interview-100']],
  },
];

const DIFF_STYLES = {
  beginner: { label: '入门', cls: 'diff-beginner' },
  intermediate: { label: '进阶', cls: 'diff-intermediate' },
  advanced: { label: '高级', cls: 'diff-advanced' },
  expert: { label: '专家', cls: 'diff-expert' },
};

const PREREQ_SHORT = {
  tokenizer: 'Tokenizer', 'minimind-design': '设计目录',
  'embedding-position-encoding': 'Embedding', normalization: '归一化',
  'kv-cache-flash-attention': 'KVCache', moe: 'MoE', assembly: '超级拼装',
  pretrain: 'Pretrain', sft: 'SFT', 'rl-overview': 'RL概览',
  dpo: 'DPO', ppo: 'PPO', grpo: 'GRPO', spo: 'SPO',
};

export function renderLearningPath(container, recommendedSlug) {
  const progress = getAllProgress();
  const slugToArticle = {};
  manifest.forEach((a) => { slugToArticle[a.slug] = a; });

  const totalArticles = manifest.length;
  const readCount = manifest.filter((a) => progress[a.slug]?.read).length;
  const pct = Math.round((readCount / totalArticles) * 100);

  const stagesHTML = STAGES.map((stage, si) =>
    renderStage(stage, si, slugToArticle, progress, recommendedSlug),
  ).join('');

  container.innerHTML = `
    <div class="lp-map-container">
      <div class="lp-map-header">
        <div class="lp-map-title-row">
          <h3>学习路径</h3>
          <div class="lp-map-stats">
            <span class="lp-map-pct">${pct}%</span>
            <span class="lp-map-count">${readCount} / ${totalArticles} 篇</span>
          </div>
        </div>
        <div class="lp-map-progress-bar">
          <div class="lp-map-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="lp-track">
        <div class="lp-track-line"></div>
        ${stagesHTML}
      </div>
    </div>
  `;

  container.querySelectorAll('.lp-node-card').forEach((el) => {
    el.addEventListener('click', () => {
      location.hash = `#/article/${el.dataset.slug}`;
    });
  });
}

function renderStage(stage, stageIdx, slugToArticle, progress, recommendedSlug) {
  const allArticles = stage.chains.flatMap((c) => c.articles || []);
  const stageRead = allArticles.filter((s) => progress[s]?.read).length;
  const stageTotal = allArticles.length;
  const stageStarted = stageRead > 0;
  const stageDone = stageRead === stageTotal;
  const stationState = stageDone ? 'done' : stageStarted ? 'active' : 'idle';

  const chainsHTML = stage.chains.map((chain) =>
    renderChain(chain, slugToArticle, progress, recommendedSlug),
  ).join('');

  return `
    <div class="lp-station lp-station-${stationState}">
      <div class="lp-station-dot lp-dot-${stationState}">
        ${stageDone ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </div>
      <div class="lp-station-body">
        <div class="lp-station-head">
          <span class="lp-station-name">${stage.name}</span>
          <span class="lp-station-sub">${stage.subtitle}</span>
          <span class="lp-station-progress ${stageDone ? 'all-done' : stageStarted ? 'partial' : ''}">${stageRead}/${stageTotal}</span>
        </div>
        <div class="lp-station-chains">${chainsHTML}</div>
      </div>
    </div>
  `;
}

function renderChain(chain, slugToArticle, progress, recommendedSlug) {
  // chain 可以是数组(单链)或对象(带路线标签)
  const isObject = !Array.isArray(chain);
  const routeLabel = isObject ? chain.route : null;
  const articles = isObject ? chain.articles : chain;

  const cards = articles
    .map((s) => slugToArticle[s])
    .filter(Boolean)
    .map((a, i) => ({ card: renderCard(a, progress, recommendedSlug), isLast: i === articles.length - 1 }))
    .map(({ card, isLast }) => isLast ? card : card + '<span class="lp-arrow">→</span>')
    .join('');

  if (routeLabel) {
    return `<div class="lp-chain-wrap lp-chain-labeled"><span class="lp-route-tag">${routeLabel}</span><div class="lp-chain">${cards}</div></div>`;
  }
  return `<div class="lp-chain-wrap"><div class="lp-chain">${cards}</div></div>`;
}

function renderCard(article, progress, recommendedSlug) {
  const status = getCardStatus(article.slug, progress, recommendedSlug);
  const diff = DIFF_STYLES[article.difficulty] || DIFF_STYLES.intermediate;
  const prereqText = formatPrereqs(article.prerequisites);

  return `
    <div class="lp-node-card lp-status-${status}" data-slug="${article.slug}">
      ${status === 'recommended' ? '<span class="lp-next-badge">下一步</span>' : ''}
      <div class="lp-card-top">
        <span class="lp-status-dot lp-dot-${status}">
          ${status === 'read' ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </span>
        <span class="lp-diff-badge ${diff.cls}">${diff.label}</span>
      </div>
      <div class="lp-card-title">${article.title}</div>
      <div class="lp-card-bottom">
        ${prereqText ? `<span class="lp-prereq-chip" title="前置依赖: ${prereqText}">前置: ${prereqText}</span>` : '<span class="lp-prereq-none">无前置</span>'}
        <span class="lp-card-time">${article.duration}min</span>
      </div>
    </div>
  `;
}

function getCardStatus(slug, progress, recommendedSlug) {
  if (progress[slug]?.read) return 'read';
  if (slug === recommendedSlug) return 'recommended';
  if (progress[slug]?.percent > 5) return 'reading';
  return 'unread';
}

function formatPrereqs(prereqs) {
  if (!prereqs || prereqs.length === 0) return '';
  return prereqs.map((p) => PREREQ_SHORT[p] || p).join('·');
}
