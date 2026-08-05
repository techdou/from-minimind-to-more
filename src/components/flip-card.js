/**
 * flip-card.js —— 翻转知识卡
 *
 * 正面:问题 / 概念名;点击翻转看背面:答案 / 解释。
 * 数据来源:src/data/card-configs.js 的 FLIP_CARDS[slug]。
 *
 * 交互:
 *   - 点击 .flip-card 整张卡切换 .is-flipped
 *   - 事件委托挂在容器上,避免每张卡绑一个 listener
 *   - 键盘可达:整张卡 tabindex=0,Enter / Space 也能翻
 *
 * 空数据保护:slug 不在 FLIP_CARDS 中 / 数组为空 → 直接 return,不渲染。
 */

import { FLIP_CARDS } from '../data/card-configs.js';

/**
 * @param {HTMLElement} container - 文章正文容器(含 .markdown-body)
 * @param {string} slug
 */
export function renderFlipCards(container, slug) {
  if (!container || !slug) return;

  const cards = FLIP_CARDS[slug];
  if (!Array.isArray(cards) || cards.length === 0) return;

  const markdownBody = container.querySelector('.markdown-body');
  if (!markdownBody) return;

  // 避免重复注入(同一容器被多次 render)
  if (container.querySelector(`.flip-cards-wrap[data-slug="${slug}"]`)) return;

  const cardsHTML = cards.map((card, i) => {
    const tag = card.tag ? `<span class="flip-card-tag">${escapeHTML(card.tag)}</span>` : '';
    return `
      <div class="flip-card" data-flip-index="${i}" tabindex="0" role="button"
           aria-label="翻转知识卡,正面问题,按 Enter 查看答案">
        <div class="flip-card-inner">
          <div class="flip-card-face flip-card-front">
            <div class="flip-card-meta">
              <span class="flip-card-no">Q ${pad(i + 1)}</span>
              ${tag}
            </div>
            <div class="flip-card-q">${escapeHTML(card.front)}</div>
            <div class="flip-card-hint">点击翻面 →</div>
          </div>
          <div class="flip-card-face flip-card-back">
            <div class="flip-card-meta">
              <span class="flip-card-no">A ${pad(i + 1)}</span>
              ${tag}
            </div>
            <div class="flip-card-a">${escapeHTML(card.back)}</div>
            <div class="flip-card-hint">← 点击返回</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const wrap = document.createElement('section');
  wrap.className = 'flip-cards-wrap';
  wrap.dataset.slug = slug;
  wrap.setAttribute('aria-label', '翻转知识卡');
  wrap.innerHTML = `
    <div class="flip-cards-header">
      <h3 class="flip-cards-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="5" width="14" height="14" rx="2"/>
          <path d="M7 9h6M7 13h4"/>
          <path d="M19 7v10"/>
        </svg>
        知识卡 · 自测一下
      </h3>
      <span class="flip-cards-sub">点击卡片查看答案(${cards.length} 张)</span>
    </div>
    <div class="flip-cards-grid">${cardsHTML}</div>
  `;

  // 追加到 markdown-body 末尾(不破坏已有内容)
  markdownBody.appendChild(wrap);

  // 事件委托:整段容器接 click / keydown
  wrap.addEventListener('click', (e) => {
    const card = e.target.closest('.flip-card');
    if (!card) return;
    card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', card.classList.contains('is-flipped') ? 'true' : 'false');
  });

  wrap.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.flip-card');
    if (!card) return;
    e.preventDefault();
    card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', card.classList.contains('is-flipped') ? 'true' : 'false');
  });
}

function pad(n) {
  return String(n).padStart(2, '0');
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
