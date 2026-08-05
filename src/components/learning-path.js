/**
 * learning-path.js —— 学习路径(游戏化学习地图)
 *
 * 重设计:从灰底横条列表升级为有进度的学习地图。
 * - 顶部全局进度条(百分比+已读数)
 * - 每阶段圆形编号 + 完成度徽章
 * - 卡片更大更精致(hover 提升+微阴影+已读✓标记)
 * - 阶段间装饰性连接线
 * - 已读卡片绿色,进行中琥珀脉冲
 */

import manifest from '../data/manifest.json';
import { getAllProgress } from '../core/progress.js';

const STAGES = [
  {
    id: 'foundations',
    name: '基石',
    subtitle: '理解 LLM 的基本组件',
    icon: '🧱',
    articles: ['tokenizer', 'minimind-design', 'embedding-position-encoding'],
  },
  {
    id: 'architecture',
    name: '架构',
    subtitle: 'Transformer 内部构造',
    icon: '🏛',
    articles: ['normalization', 'kv-cache-flash-attention', 'moe', 'assembly'],
  },
  {
    id: 'supervised',
    name: '监督学习',
    subtitle: '从预训练到微调',
    icon: '📚',
    articles: ['pretrain', 'sft'],
    flow: 'chain',
  },
  {
    id: 'alignment',
    name: '对齐',
    subtitle: '让模型听话',
    icon: '🎯',
    articles: ['rl-overview', 'dpo', 'ppo', 'grpo', 'spo'],
    dualRoute: true,
  },
  {
    id: 'career',
    name: '求职',
    subtitle: '面试冲刺',
    icon: '🎓',
    articles: ['interview-100'],
  },
];

export function renderLearningPath(container) {
  const progress = getAllProgress();
  const slugToArticle = {};
  manifest.forEach((a) => { slugToArticle[a.slug] = a; });

  // 全局统计
  const totalArticles = manifest.length;
  const readCount = manifest.filter((a) => progress[a.slug]?.read).length;
  const pct = Math.round((readCount / totalArticles) * 100);

  const stagesHTML = STAGES.map((stage, si) => {
    const stageArticles = stage.articles.map((s) => slugToArticle[s]).filter(Boolean);
    const stageRead = stageArticles.filter((a) => progress[a.slug]?.read).length;
    const stageTotal = stageArticles.length;
    const stageComplete = stageRead === stageTotal;

    return `
      <div class="lp-stage ${stageComplete ? 'lp-stage-complete' : ''}" data-stage="${stage.id}">
        <div class="lp-stage-marker">
          <div class="lp-stage-num ${stageComplete ? 'done' : ''}">${stageComplete ? '✓' : si + 1}</div>
          ${si < STAGES.length - 1 ? '<div class="lp-stage-connector"></div>' : ''}
        </div>
        <div class="lp-stage-content">
          <div class="lp-stage-head">
            <span class="lp-stage-icon">${stage.icon}</span>
            <div class="lp-stage-titles">
              <div class="lp-stage-name">${stage.name}</div>
              <div class="lp-stage-sub">${stage.subtitle}</div>
            </div>
            <div class="lp-stage-progress-badge ${stageComplete ? 'done' : stageRead > 0 ? 'partial' : ''}">
              ${stageRead}/${stageTotal}
            </div>
          </div>
          <div class="lp-stage-cards">
            ${renderStageCards(stage, slugToArticle, progress)}
          </div>
        </div>
      </div>
    `;
  }).join('');

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
          <div class="lp-map-progress-fill" style="width: ${pct}%"></div>
        </div>
        <p class="lp-map-hint">按阶段顺序学习效果最佳 · 点击卡片开始阅读</p>
      </div>
      <div class="lp-map-body">
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

function renderStageCards(stage, slugToArticle, progress) {
  if (stage.dualRoute) {
    // 对齐阶段:双路线
    const rlFree = ['dpo'];
    const rlRoute = ['rl-overview', 'ppo', 'grpo', 'spo'];

    return `
      <div class="lp-routes">
        <div class="lp-route">
          <span class="lp-route-tag tag-teal">RL-Free</span>
          <div class="lp-route-cards">
            ${rlFree.map((s) => renderCard(slugToArticle[s], progress)).join('')}
          </div>
        </div>
        <div class="lp-route">
          <span class="lp-route-tag tag-amber">RL</span>
          <div class="lp-route-cards chain">
            ${rlRoute.map((s) => renderCard(slugToArticle[s], progress)).join('<span class="lp-chain-sep">→</span>')}
          </div>
        </div>
      </div>
    `;
  }

  const isChain = stage.flow === 'chain';
  const cards = stage.articles
    .map((s) => slugToArticle[s])
    .filter(Boolean)
    .map((a) => renderCard(a, progress));

  if (isChain) {
    return `<div class="lp-route-cards chain">${cards.join('<span class="lp-chain-sep">→</span>')}</div>`;
  }
  return `<div class="lp-route-cards">${cards.join('')}</div>`;
}

function renderCard(article, progress) {
  const status = getNodeStatus(article.slug, progress);
  const prereqText = formatPrereqs(article.prerequisites);

  return `
    <div class="lp-map-card lp-card-${status}" data-slug="${article.slug}">
      ${status === 'read' ? '<div class="lp-card-check">✓</div>' : ''}
      <div class="lp-card-title">${article.title}</div>
      <div class="lp-card-tags">
        <span class="lp-card-diff">${diffLabel(article.difficulty)}</span>
        <span class="lp-card-time">${article.duration}min</span>
      </div>
    </div>
  `;
}

function getNodeStatus(slug, progress) {
  const p = progress[slug];
  if (p?.read) return 'read';
  if (p?.percent > 5) return 'in-progress';
  return 'todo';
}

function formatPrereqs(prereqs) {
  if (!prereqs || prereqs.length === 0) return '';
  const slugToShort = {
    tokenizer: 'Tokenizer', 'minimind-design': '设计', 'embedding-position-encoding': 'Embedding',
    normalization: '归一化', 'kv-cache-flash-attention': 'KVCache', moe: 'MoE', assembly: '拼装',
    pretrain: 'Pretrain', sft: 'SFT', 'rl-overview': 'RL', dpo: 'DPO', ppo: 'PPO', grpo: 'GRPO', spo: 'SPO',
  };
  return prereqs.map((p) => slugToShort[p] || p).join('·');
}

function diffLabel(d) {
  return { beginner: '入门', intermediate: '进阶', advanced: '高级', expert: '专家' }[d] || d;
}
