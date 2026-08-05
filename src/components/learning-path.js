/**
 * learning-path.js —— 学习路径(地铁线路图 + 弹性铺满 + 阶段折叠)
 *
 * 追加需求:
 * 1. 卡片弹性铺满(flex 1 1 240px),行尾不留空白
 *    - 卡片左上角加顺序编号(01/02/03),→ 仅同行相邻保留
 *    - 单卡阶段允许通栏
 * 2. 阶段折叠(手风琴)
 *    - 标题行整行可点折叠,含 chevron 图标
 *    - 200ms 高度+透明度过渡
 *    - 默认:当前阶段展开,其余收起;localStorage 记忆
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

const COLLAPSE_KEY = 'mm2m_lp_collapse';

function loadCollapseState() {
  try { return JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '{}'); }
  catch { return {}; }
}
function saveCollapseState(state) {
  localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state));
}

export function renderLearningPath(container, recommendedSlug) {
  const progress = getAllProgress();
  const slugToArticle = {};
  manifest.forEach((a) => { slugToArticle[a.slug] = a; });

  const totalArticles = manifest.length;
  const readCount = manifest.filter((a) => progress[a.slug]?.read).length;
  const pct = Math.round((readCount / totalArticles) * 100);

  // 计算每个阶段的状态,决定默认展开
  const stageStates = STAGES.map((stage) => {
    // chains 元素可能是数组(['a','b'])或对象({route,articles:['a']})
    const allArticles = stage.chains.flatMap((c) =>
      Array.isArray(c) ? c : (c.articles || []),
    );
    const stageRead = allArticles.filter((s) => progress[s]?.read).length;
    const stageTotal = allArticles.length;
    const hasRecommended = allArticles.includes(recommendedSlug);
    const hasInProgress = allArticles.some((s) => progress[s]?.percent > 5 && !progress[s]?.read);
    const isDone = stageRead === stageTotal;
    const isStarted = stageRead > 0 || hasInProgress;
    return {
      id: stage.id,
      stageRead, stageTotal,
      isDone, isStarted,
      // 默认展开:包含推荐卡的阶段,或进行中的阶段
      shouldDefaultExpand: hasRecommended || (isStarted && !isDone),
    };
  });

  const savedCollapse = loadCollapseState();

  const stagesHTML = STAGES.map((stage, si) => {
    const st = stageStates[si];
    // 用户手动操作过就用记忆,否则用默认
    const userTouched = stage.id in savedCollapse;
    const isExpanded = userTouched ? savedCollapse[stage.id] : st.shouldDefaultExpand;

    return renderStage(stage, si, slugToArticle, progress, recommendedSlug, st, isExpanded);
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
          <div class="lp-map-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="lp-track">
        <div class="lp-track-line"></div>
        ${stagesHTML}
      </div>
    </div>
  `;

  // 卡片点击跳转
  container.querySelectorAll('.lp-node-card').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      location.hash = `#/article/${el.dataset.slug}`;
    });
  });

  // 阶段折叠
  container.querySelectorAll('.lp-station-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const station = toggle.closest('.lp-station');
      const stageId = station.dataset.stage;
      const body = station.querySelector('.lp-station-body-inner');
      const chevron = toggle.querySelector('.lp-chevron');
      const isCurrentlyOpen = !station.classList.contains('lp-collapsed');

      if (isCurrentlyOpen) {
        station.classList.add('lp-collapsed');
        chevron.style.transform = 'rotate(180deg)';
      } else {
        station.classList.remove('lp-collapsed');
        chevron.style.transform = 'rotate(0deg)';
      }

      // 记忆
      const newState = { ...loadCollapseState(), [stageId]: !isCurrentlyOpen };
      saveCollapseState(newState);
    });
  });
}

function renderStage(stage, stageIdx, slugToArticle, progress, recommendedSlug, st, isExpanded) {
  const stationState = st.isDone ? 'done' : st.isStarted ? 'active' : 'idle';

  // 全局顺序编号计数器(跨 chain)
  let globalIdx = 0;
  const chainsHTML = stage.chains.map((chain) => {
    const html = renderChain(chain, slugToArticle, progress, recommendedSlug, () => ++globalIdx);
    return html;
  }).join('');

  return `
    <div class="lp-station lp-station-${stationState} ${!isExpanded ? 'lp-collapsed' : ''}" data-stage="${stage.id}">
      <div class="lp-station-dot lp-dot-${stationState}">
        ${st.isDone ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </div>
      <div class="lp-station-body">
        <div class="lp-station-toggle" role="button" tabindex="0" aria-expanded="${isExpanded}">
          <span class="lp-station-name">${stage.name}</span>
          <span class="lp-station-sub">${stage.subtitle}</span>
          <span class="lp-station-progress ${st.isDone ? 'all-done' : st.isStarted ? 'partial' : ''}">${st.stageRead}/${st.stageTotal}</span>
          <svg class="lp-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform:${isExpanded ? 'rotate(0deg)' : 'rotate(180deg)'}"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="lp-station-body-inner">
          <div class="lp-station-chains">${chainsHTML}</div>
        </div>
      </div>
    </div>
  `;
}

function renderChain(chain, slugToArticle, progress, recommendedSlug, nextIdx) {
  const isObject = !Array.isArray(chain);
  const routeLabel = isObject ? chain.route : null;
  const articles = isObject ? chain.articles : chain;

  const cards = articles
    .map((s) => slugToArticle[s])
    .filter(Boolean)
    .map((a) => renderCard(a, progress, recommendedSlug, String(nextIdx()).padStart(2, '0')))
    .join('<span class="lp-arrow">→</span>');

  if (routeLabel) {
    return `<div class="lp-chain-wrap lp-chain-labeled"><span class="lp-route-tag lp-tag-${routeLabel === 'RL-Free' ? 'teal' : 'amber'}">${routeLabel}</span><div class="lp-chain">${cards}</div></div>`;
  }
  return `<div class="lp-chain-wrap"><div class="lp-chain">${cards}</div></div>`;
}

function renderCard(article, progress, recommendedSlug, seqNum) {
  const status = getCardStatus(article.slug, progress, recommendedSlug);
  const diff = DIFF_STYLES[article.difficulty] || DIFF_STYLES.intermediate;
  const prereqText = formatPrereqs(article.prerequisites);

  return `
    <div class="lp-node-card lp-status-${status}" data-slug="${article.slug}">
      ${status === 'recommended' ? '<span class="lp-next-badge">下一步</span>' : ''}
      <div class="lp-card-top">
        <span class="lp-seq-num">${seqNum}</span>
        <span class="lp-diff-badge ${diff.cls}">${diff.label}</span>
      </div>
      <div class="lp-card-title">${article.title}</div>
      <div class="lp-card-bottom">
        <span class="lp-prereq-chip" title="前置依赖: ${prereqText || '无'}">${prereqText ? '前置: ' + prereqText : '无前置'}</span>
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
