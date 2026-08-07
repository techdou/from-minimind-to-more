/**
 * search.js —— 全文搜索页
 *
 * 加载 search-index.json,用 FlexSearch 搜索
 * 实时结果列表 + 高亮 + 预览片段
 */

import { Index } from 'flexsearch';
import { escapeHtml, escapeRegex } from '../utils/escape.js';

let indexCache = null;
let docsCache = null;
// 搜索代际令牌:首次搜索要 await 加载索引(慢),期间继续打字触发的新搜索
// 会先完成——旧结果不得覆盖新结果
let searchToken = 0;

async function loadIndex() {
  if (indexCache) return { index: indexCache, docs: docsCache };
  const resp = await fetch('/data/search-index.json');
  if (!resp.ok) throw new Error('搜索索引加载失败');
  const data = await resp.json();
  const index = new Index({ charset: 'cjk', tokenize: 'forward', resolution: 9 });
  // 从导出数据重建索引
  for (const [key, val] of Object.entries(data.index)) {
    index.import(key, val);
  }
  indexCache = index;
  docsCache = data.docs;
  return { index, docs: data.docs };
}

export async function renderSearch(container, query) {
  container.innerHTML = `
    <div class="search-page">
      <div class="search-header">
        <h1>搜索</h1>
        <div class="search-input-wrap">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="search-input" class="search-input" placeholder="搜索文章标题、概念、公式..." autofocus />
        </div>
      </div>
      <div id="search-results" class="search-results">
        <div class="search-hint">输入关键词开始搜索</div>
      </div>
    </div>
  `;

  const input = container.querySelector('#search-input');
  const resultsEl = container.querySelector('#search-results');

  // query 来自 URL hash,用赋值而非拼进 HTML 字符串(防属性注入 XSS)
  input.value = query || '';

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doSearch(input.value, resultsEl), 250);
  });

  // 如果有初始 query,立即搜索
  if (query) {
    doSearch(query, resultsEl);
  }
}

async function doSearch(query, resultsEl) {
  const token = ++searchToken;
  query = query.trim();
  if (!query) {
    resultsEl.innerHTML = '<div class="search-hint">输入关键词开始搜索</div>';
    return;
  }

  resultsEl.innerHTML = '<div class="search-loading">搜索中...</div>';

  try {
    const { index, docs } = await loadIndex();
    // await 期间用户又输入了新词 → 本次结果作废
    if (token !== searchToken) return;

    const ids = index.search(query, { limit: 20 });

    if (ids.length === 0) {
      resultsEl.innerHTML = `<div class="search-empty">未找到「${escapeHtml(query)}」相关内容</div>`;
      return;
    }

    const results = ids.map((id) => {
      const doc = docs.find((d) => d.slug === id);
      return doc ? { ...doc, snippet: makeSnippet(doc.preview, query) } : null;
    }).filter(Boolean);

    resultsEl.innerHTML = `
      <div class="search-count">${results.length} 条结果</div>
      ${results.map((r) => `
        <div class="search-result-item" data-slug="${escapeHtml(r.slug)}">
          <div class="search-result-title">${highlightText(r.title, query)}</div>
          <div class="search-result-meta">
            <span class="search-result-cat">${escapeHtml(r.category)}</span>
            <span class="search-result-diff diff-${escapeHtml(r.difficulty)}">${escapeHtml(diffLabel(r.difficulty))}</span>
          </div>
          <div class="search-result-snippet">${r.snippet}</div>
        </div>
      `).join('')}
    `;

    resultsEl.querySelectorAll('.search-result-item').forEach((el) => {
      el.addEventListener('click', () => {
        location.hash = `#/article/${el.dataset.slug}`;
      });
    });
  } catch (err) {
    if (token !== searchToken) return;
    resultsEl.innerHTML = `<div class="search-error">搜索出错: ${escapeHtml(err.message)}</div>`;
  }
}

function makeSnippet(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return escapeHtml(text.slice(0, 120)) + '...';
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 80);
  let snippet = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
  return highlightText(snippet, query);
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return escaped.replace(regex, '<mark>$1</mark>');
}

function diffLabel(d) {
  return { beginner: '入门', intermediate: '进阶', advanced: '高级', expert: '专家' }[d] || d;
}
