/**
 * app.js —— 应用入口 + hash 路由
 *
 * 路由表:
 *   #/                          首页(学习中心)
 *   #/category/:category        篇章列表
 *   #/article/:slug             文章阅读
 */

import { renderHome } from './pages/home.js';
import { renderCategory } from './pages/category.js';
import { renderArticle } from './pages/article.js';
import { renderQuiz } from './pages/quiz.js';
import { renderPodcast } from './pages/podcast.js';
import { renderSearch } from './pages/search.js';
import { initTheme, toggleTheme } from './core/theme.js';
import { cleanupPage } from './core/page-lifecycle.js';
import { escapeHtml } from './utils/escape.js';
import manifest from './data/manifest.json';

// 初始化主题
initTheme();

const app = document.getElementById('app');

// 路由代际令牌:快速连切 hash 时,过期的异步渲染结果直接丢弃
let routeSeq = 0;

function getRoute() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean); // ['article','normalization']
  return parts;
}

async function router() {
  const seq = ++routeSeq;
  cleanupPage();

  const parts = getRoute();
  app.innerHTML = '';
  app.appendChild(renderTopbar(parts));

  const main = document.createElement('main');

  try {
    if (parts.length === 0) {
      await renderHome(main);
    } else if (parts[0] === 'category' && parts[1]) {
      await renderCategory(main, parts[1]);
    } else if (parts[0] === 'article' && parts[1] && parts[2] === 'quiz') {
      await renderQuiz(main, parts[1]);
    } else if (parts[0] === 'article' && parts[1] && parts[2] === 'podcast') {
      await renderPodcast(main, parts[1]);
    } else if (parts[0] === 'search') {
      const query = decodeURIComponent(parts[1] || '');
      await renderSearch(main, query);
    } else if (parts[0] === 'article' && parts[1]) {
      await renderArticle(main, parts[1]);
    } else {
      main.innerHTML = `<div class="error-state"><h2>404</h2><p>找不到这个页面</p><a href="#/">回首页</a></div>`;
    }
  } catch (err) {
    console.error('Route error:', err);
    main.innerHTML = `<div class="error-state"><h2>出错了</h2><p>${escapeHtml(err.message)}</p><a href="#/">回首页</a></div>`;
  }

  // 渲染期间又触发了新路由 → 本次结果作废,避免旧内容覆盖新页面
  if (seq !== routeSeq) return;

  app.appendChild(main);
  window.scrollTo(0, 0);
}

function renderTopbar(currentParts) {
  const topbar = document.createElement('header');
  topbar.className = 'topbar';

  const currentPath = currentParts.join('/');

  topbar.innerHTML = `
    <a href="#/" class="topbar-logo">
      <span class="logo-mark">M</span>
      <span>Minimind to More</span>
    </a>
    <nav class="topbar-nav">
      <a href="#/" class="${currentParts.length === 0 ? 'active' : ''}">首页</a>
      <a href="#/category/foundations" class="${currentPath === 'category/foundations' ? 'active' : ''}">基石</a>
      <a href="#/category/architecture" class="${currentPath === 'category/architecture' ? 'active' : ''}">架构</a>
      <a href="#/category/algorithms" class="${currentPath === 'category/algorithms' ? 'active' : ''}">算法</a>
      <a href="#/search" class="${currentParts[0] === 'search' ? 'active' : ''}" title="搜索">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </a>
    </nav>
    <div class="topbar-spacer"></div>
    <button class="theme-toggle" id="theme-toggle" title="切换主题">
      ${document.body.dataset.theme === 'dark' ? '☀' : '☾'}
    </button>
    <button class="hamburger-btn" id="hamburger-btn" title="菜单" aria-label="菜单">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  `;

  // 移动端汉堡菜单
  const hamburger = topbar.querySelector('#hamburger-btn');
  hamburger.addEventListener('click', () => {
    topbar.classList.toggle('nav-open');
  });
  // 点击导航链接后关闭菜单
  topbar.querySelectorAll('.topbar-nav a').forEach((a) => {
    a.addEventListener('click', () => topbar.classList.remove('nav-open'));
  });

  topbar.querySelector('#theme-toggle').addEventListener('click', () => {
    toggleTheme();
    topbar.querySelector('#theme-toggle').textContent =
      document.body.dataset.theme === 'dark' ? '☀' : '☾';
  });

  return topbar;
}

// 监听路由变化
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

export { manifest };
