/**
 * card-gallery.js —— 知识卡片画廊
 *
 * 横向滚动 + snap 的图片画廊,展示 public/assets/cards/ 下的知识卡片图。
 * 每张卡:标题 + 图片 + 一句话说明。
 * 点击放大查看(lightbox 风格的全屏遮罩)。
 *
 * 数据来源:src/data/card-configs.js 的 CARD_GALLERY[slug]。
 *
 * 防御性:
 *   - 渲染前对每张图做 HEAD 校验,缺图自动跳过
 *   - 缓存 HEAD 结果避免重复请求
 *   - 全部缺图则不注入任何 DOM
 *
 * 交互:
 *   - 卡片点击 → 打开 .card-lightbox(只创建一次,事件委托)
 *   - lightbox 关闭:点遮罩 / 点关闭按钮 / Esc
 */

import { CARD_GALLERY } from '../data/card-configs.js';
import { escapeHtml as escapeHTML } from '../utils/escape.js';

const _existsCache = new Set();
const _missingCache = new Set();

/**
 * @param {HTMLElement} container - 文章正文容器(含 .markdown-body)
 * @param {string} slug
 */
export async function renderCardGallery(container, slug) {
  if (!container || !slug) return;

  const list = CARD_GALLERY[slug];
  if (!Array.isArray(list) || list.length === 0) return;

  const markdownBody = container.querySelector('.markdown-body');
  if (!markdownBody) return;

  // 避免重复注入
  if (container.querySelector(`.card-gallery-wrap[data-slug="${slug}"]`)) return;

  // 校验每张图是否真实存在,过滤缺图
  const checks = await Promise.all(
    list.map(async (card) => {
      const imgPath = card.image.startsWith('/') ? card.image : `/assets/cards/${card.image}`;
      if (_existsCache.has(imgPath)) return { card, exists: true };
      if (_missingCache.has(imgPath)) return { card, exists: false };
      try {
        const resp = await fetch(imgPath, { method: 'HEAD' });
        // SPA fallback 可能返回 200+text/html,所以只要 status 200 且不是 html 就算存在
        const ct = resp.headers.get('content-type') || '';
        const exists = resp.ok && !ct.includes('text/html');
        if (exists) _existsCache.add(imgPath);
        else _missingCache.add(imgPath);
        return { card, exists };
      } catch {
        _missingCache.add(imgPath);
        return { card, exists: false };
      }
    })
  );

  const validCards = checks.filter((c) => c.exists).map((c) => c.card);
  if (validCards.length === 0) return;

  const cardsHTML = validCards.map((card) => {
    const imgPath = card.image.startsWith('/') ? card.image : `/assets/cards/${card.image}`;
    return `
    <figure class="card-gallery-item" data-full="${encodeURI(imgPath)}" tabindex="0" role="button"
            aria-label="放大查看:${escapeHTML(card.title)}">
      <div class="card-gallery-thumb">
        <img src="${encodeURI(imgPath)}" alt="${escapeHTML(card.title)}"
             loading="lazy" decoding="async" />
      </div>
      <figcaption class="card-gallery-caption">
        <span class="card-gallery-name">${escapeHTML(card.title)}</span>
        <span class="card-gallery-desc">${escapeHTML(card.caption || '')}</span>
      </figcaption>
    </figure>
  `;
  }).join('');

  const wrap = document.createElement('section');
  wrap.className = 'card-gallery-wrap';
  wrap.dataset.slug = slug;
  wrap.setAttribute('aria-label', '知识卡片画廊');
  wrap.innerHTML = `
    <div class="card-gallery-header">
      <h3 class="card-gallery-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="14" rx="2"/>
          <circle cx="9" cy="10" r="2"/>
          <path d="M3 16l5-4 4 3 3-2 6 5"/>
        </svg>
        知识卡片画廊
      </h3>
      <span class="card-gallery-sub">${validCards.length} 张 · 点击放大 · 左右滚动</span>
    </div>
    <div class="card-gallery-track" tabindex="0" aria-label="横向滚动画廊,使用左右键浏览">
      ${cardsHTML}
    </div>
  `;

  markdownBody.appendChild(wrap);

  // 点击卡片放大
  wrap.addEventListener('click', (e) => {
    const item = e.target.closest('.card-gallery-item');
    if (!item) return;
    openLightbox(item.dataset.full, item.querySelector('.card-gallery-name')?.textContent || '');
  });

  // 键盘可达
  wrap.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('.card-gallery-item');
    if (!item) return;
    e.preventDefault();
    openLightbox(item.dataset.full, item.querySelector('.card-gallery-name')?.textContent || '');
  });
}

/* ------------------------------------------------------------------ *
 * Lightbox —— 复用单例,事件只挂一次
 * ------------------------------------------------------------------ */
let _lightboxEl = null;
let _lightboxImg = null;
let _lightboxCaption = null;
let _lightboxBound = false;

function ensureLightbox() {
  if (_lightboxEl) return _lightboxEl;

  _lightboxEl = document.createElement('div');
  _lightboxEl.className = 'card-lightbox';
  _lightboxEl.setAttribute('role', 'dialog');
  _lightboxEl.setAttribute('aria-modal', 'true');
  _lightboxEl.setAttribute('aria-label', '图片放大查看');
  _lightboxEl.hidden = true;
  _lightboxEl.innerHTML = `
    <button class="card-lightbox-close" aria-label="关闭(Esc)">✕</button>
    <img class="card-lightbox-img" alt="" />
    <div class="card-lightbox-caption"></div>
  `;
  document.body.appendChild(_lightboxEl);

  _lightboxImg = _lightboxEl.querySelector('.card-lightbox-img');
  _lightboxCaption = _lightboxEl.querySelector('.card-lightbox-caption');

  if (!_lightboxBound) {
    _lightboxBound = true;
    _lightboxEl.addEventListener('click', (e) => {
      // 点关闭按钮 或 点遮罩空白处 都关闭
      if (e.target === _lightboxEl || e.target.closest('.card-lightbox-close')) {
        closeLightbox();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !_lightboxEl.hidden) {
        closeLightbox();
      }
    });
  }
  return _lightboxEl;
}

function openLightbox(src, caption) {
  const box = ensureLightbox();
  _lightboxImg.src = src;
  _lightboxImg.alt = caption || '';
  _lightboxCaption.textContent = caption || '';
  box.hidden = false;
  document.body.classList.add('card-lightbox-open');
}

function closeLightbox() {
  if (!_lightboxEl) return;
  _lightboxEl.hidden = true;
  _lightboxImg.src = '';
  document.body.classList.remove('card-lightbox-open');
}
