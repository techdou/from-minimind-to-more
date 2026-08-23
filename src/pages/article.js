/**
 * article.js —— 文章阅读页(核心)
 *
 * 整合:
 * - renderer.js 渲染 markdown(marked+KaTeX+Mermaid+高亮)
 * - callout.js 考点自动识别
 * - toc.js 从渲染后 DOM 抽目录
 * - progress.js 阅读进度条 + 位置记忆
 * - 侧栏目录 + scrollspy 高亮
 */

import { renderMarkdown, extractTOC } from '../core/renderer.js';
import { enhanceCallouts } from '../core/callout.js';
import { injectConceptImages } from '../core/concept-images.js';
import { enhanceFormulaTooltips } from '../core/formula-tooltip.js';
import { bindProgressBar, restoreScroll, getProgress } from '../core/progress.js';
import { renderFlipCards } from '../components/flip-card.js';
import { renderComparisonCards } from '../components/comparison-cards.js';
import { renderCardGallery } from '../components/card-gallery.js';
import { escapeHtml } from '../utils/escape.js';
import { withBase } from '../utils/paths.js';
import { pageSignal } from '../core/page-lifecycle.js';
import manifest from '../data/manifest.json';

export async function renderArticle(container, slug) {
  const meta = manifest.find((a) => a.slug === slug);
  if (!meta) {
    container.innerHTML = `<div class="error-state"><h2>文章不存在</h2><p>找不到 slug: ${escapeHtml(slug)}</p><a href="#/">回首页</a></div>`;
    return;
  }

  // 动态加载文章 JSON
  let article;
  try {
    const resp = await fetch(withBase(`/data/articles/${slug}.json`));
    article = await resp.json();
  } catch (err) {
    container.innerHTML = `<div class="error-state"><h2>加载失败</h2><p>${escapeHtml(err.message)}</p></div>`;
    return;
  }

  // 渲染骨架
  container.innerHTML = `
    <div class="progress-bar-container"><div class="progress-bar" id="progress-bar"></div></div>
    <div class="reader-layout">
      <aside class="reader-sidebar" id="reader-sidebar">
        <h3>目录</h3>
        <ul class="toc-list" id="toc-list"></ul>
      </aside>
      <article class="reader-content" id="reader-content">
        <div class="loading-state">加载中...</div>
      </article>
    </div>
  `;

  const contentEl = container.querySelector('#reader-content');
  const theme = document.documentElement.dataset.theme || 'light';

  // 渲染 markdown
  contentEl.innerHTML = `
    <div class="article-header">
      <h1>${article.title}</h1>
      <div class="article-meta">
        <span>${article.series}</span>
        <span>· ⏱ ${article.duration} 分钟</span>
        <span>· ${wordCount(article.body)} 字</span>
      </div>
      ${article.objectives.length > 0 ? `
        <div class="article-objectives">
          <h4>学习目标</h4>
          <ul>${article.objectives.map((o) => `<li>${o}</li>`).join('')}</ul>
        </div>
      ` : ''}
    </div>
    <div id="markdown-body-target"></div>
    <div class="article-extras">
      ${renderPodcastEntry(slug)}
      ${renderQuizEntry(slug, meta)}
    </div>
    ${renderFooterNav(slug)}
  `;

  const targetEl = contentEl.querySelector('#markdown-body-target');
  await renderMarkdown(article.body, targetEl, { theme });

  // 考点 callout 增强
  enhanceCallouts(targetEl);

  // 抽象概念配图注入(异步,图片可能需要加载)
  injectConceptImages(targetEl, slug).catch(() => {});

  // 卡片式交互组件:翻转卡 / 对比卡 / 图片画廊
  // 均做了空数据保护,无配置时直接 return;画廊内部对每张图做 HEAD 校验。
  renderFlipCards(targetEl, slug);
  renderComparisonCards(targetEl, slug);
  renderCardGallery(targetEl, slug).catch(() => {});

  // 公式符号 hover 释义
  enhanceFormulaTooltips(targetEl, slug);

  // 从渲染后 DOM 抽目录(比预提取更准,因为标题 id 已生成)
  const toc = extractTOC(targetEl);
  renderSidebarTOC(toc, container);

  // 进度条(监听挂到 pageSignal,路由切换自动移除)
  const refreshProgress = bindProgressBar(slug, container.querySelector('#progress-bar'), pageSignal());

  // 恢复上次阅读位置(延迟到渲染完成);恢复后再刷新进度条,
  // 双重 rAF 确保 scrollTo 已生效,避免用跳转前的位置算出垃圾进度
  setTimeout(() => {
    restoreScroll(slug);
    requestAnimationFrame(() => requestAnimationFrame(refreshProgress));
  }, 300);

  // scrollspy
  setupScrollSpy(container, toc);

  // 检查是否有播客脚本(异步显示入口)
  checkAndShowPodcastEntry(container, slug);
}

function renderSidebarTOC(toc, container) {
  const tocList = container.querySelector('#toc-list');
  if (toc.length === 0) {
    container.querySelector('.reader-sidebar').style.display = 'none';
    return;
  }

  tocList.innerHTML = toc
    .map((item) => {
      const cls = `toc-level-${item.level}`;
      return `<li><a href="#${item.id}" class="${cls}" data-target="${item.id}">${item.text}</a></li>`;
    })
    .join('');

  // 点击跳转(平滑滚动,考虑 sticky header)
  tocList.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.dataset.target;
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

function setupScrollSpy(container, toc) {
  if (toc.length === 0) return;

  const headings = toc
    .map((t) => document.getElementById(t.id))
    .filter(Boolean);

  const links = container.querySelectorAll('.toc-list a');

  function updateActive() {
    const scrollY = window.scrollY + 100;
    let activeIdx = 0;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].offsetTop <= scrollY) activeIdx = i;
    }
    links.forEach((l, i) => l.classList.toggle('active', i === activeIdx));

    // 滚动 TOC 让 active 项可见
    const activeLink = links[activeIdx];
    if (activeLink) {
      const sidebar = container.querySelector('.reader-sidebar');
      const linkRect = activeLink.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
        activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  let ticking = false;
  // 挂到 pageSignal:路由切换时统一移除,防 window 监听器堆积
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateActive(); ticking = false; });
      ticking = true;
    }
  }, { passive: true, signal: pageSignal() });
  updateActive();
}

function renderPodcastEntry(slug) {
  // 只有有播客脚本的篇章才显示入口(异步检查)
  return `
    <div class="podcast-entry-banner" data-slug="${slug}" style="display:none;">
      <div class="quiz-entry-info">
        <span class="quiz-entry-label">播客精讲</span>
        <span class="quiz-entry-text">5 分钟双人对话,苏打×茉莉带你快速建立框架</span>
      </div>
      <a href="#/article/${slug}/podcast" class="quiz-entry-btn podcast-entry-btn">收听播客 →</a>
    </div>
  `;
}

async function checkAndShowPodcastEntry(container, slug) {
  try {
    const resp = await fetch(withBase(`/podcast/scripts/${slug}.json`));
    // SPA fallback 可能返回 index.html(200 但不是 JSON),必须检查 content-type
    if (!resp.ok) return;
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return;
    const data = await resp.json();
    if (!data.dialogue || data.dialogue.length === 0) return;
    const banner = container.querySelector(`.podcast-entry-banner[data-slug="${slug}"]`);
    if (banner) banner.style.display = 'flex';
  } catch {}
}

function renderQuizEntry(slug, meta) {
  if (!meta.keypoints || meta.keypoints.length === 0) return '';
  return `
    <div class="quiz-entry-banner">
      <div class="quiz-entry-info">
        <span class="quiz-entry-label">读完检测</span>
        <span class="quiz-entry-text">本篇有 ${meta.keypoints.length} 个考点,来做测验检验掌握程度</span>
      </div>
      <a href="#/article/${slug}/quiz" class="quiz-entry-btn">开始测验 →</a>
    </div>
  `;
}

function renderFooterNav(currentSlug) {
  const flat = manifest.slice();
  const idx = flat.findIndex((a) => a.slug === currentSlug);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;

  return `
    <div class="article-footer-nav">
      ${prev ? `
        <a href="#/article/${prev.slug}" class="nav-link prev">
          <span class="nav-link-label">← 上一篇</span>
          <span class="nav-link-title">${prev.title}</span>
        </a>
      ` : '<div></div>'}
      ${next ? `
        <a href="#/article/${next.slug}" class="nav-link next">
          <span class="nav-link-label">下一篇 →</span>
          <span class="nav-link-title">${next.title}</span>
        </a>
      ` : '<div></div>'}
    </div>
  `;
}

function wordCount(body) {
  // 去掉 markdown 标记,粗略统计
  const text = body.replace(/[#*`>\-\[\]()]/g, '').replace(/\s+/g, '');
  return text.length;
}
