/**
 * comparison-cards.js —— 对比卡片组
 *
 * 两列并排卡片(如 Pre-Norm vs Post-Norm / PPO vs DPO)。
 * 每列:标题 + 特征列表 + 优点 + 缺点。
 * 数据来源:src/data/card-configs.js 的 COMPARISON_CARDS[slug]。
 *
 * 响应式:
 *   - 桌面:左右两列,中间分隔线
 *   - 移动端(< 720px):纵向堆叠,中间分隔线变水平线
 *
 * 空数据保护:slug 不在 COMPARISON_CARDS 中 / 缺 left 或 right → 不渲染。
 */

import { COMPARISON_CARDS } from '../data/card-configs.js';

/**
 * @param {HTMLElement} container - 文章正文容器(含 .markdown-body)
 * @param {string} slug
 */
export function renderComparisonCards(container, slug) {
  if (!container || !slug) return;

  const data = COMPARISON_CARDS[slug];
  if (!data || !data.left || !data.right) return;

  const markdownBody = container.querySelector('.markdown-body');
  if (!markdownBody) return;

  // 避免重复注入
  if (container.querySelector(`.compare-wrap[data-slug="${slug}"]`)) return;

  const wrap = document.createElement('section');
  wrap.className = 'compare-wrap';
  wrap.dataset.slug = slug;
  wrap.setAttribute('aria-label', '对比卡片组');
  wrap.innerHTML = `
    <div class="compare-header">
      <h3 class="compare-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="4" width="7" height="16" rx="1.5"/>
          <rect x="14" y="4" width="7" height="16" rx="1.5"/>
        </svg>
        对比一下 · ${escapeHTML(data.left.title)} vs ${escapeHTML(data.right.title)}
      </h3>
    </div>
    <div class="compare-grid">
      ${renderSide(data.left, 'left')}
      <div class="compare-divider" aria-hidden="true">
        <span class="compare-divider-vs">VS</span>
      </div>
      ${renderSide(data.right, 'right')}
    </div>
  `;

  markdownBody.appendChild(wrap);
}

function renderSide(side, position) {
  const featuresHTML = (side.features || [])
    .map((f) => `<li>${escapeHTML(f)}</li>`)
    .join('');

  return `
    <div class="compare-col compare-col-${position}">
      <div class="compare-col-head">
        <div class="compare-col-title">${escapeHTML(side.title)}</div>
        ${side.subtitle ? `<div class="compare-col-sub">${escapeHTML(side.subtitle)}</div>` : ''}
      </div>

      ${featuresHTML ? `
        <ul class="compare-features">${featuresHTML}</ul>
      ` : ''}

      <div class="compare-pros-cons">
        ${side.pros ? `
          <div class="compare-row compare-row-pros">
            <span class="compare-row-label">优</span>
            <span class="compare-row-text">${escapeHTML(side.pros)}</span>
          </div>
        ` : ''}
        ${side.cons ? `
          <div class="compare-row compare-row-cons">
            <span class="compare-row-label">缺</span>
            <span class="compare-row-text">${escapeHTML(side.cons)}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function escapeHTML(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
