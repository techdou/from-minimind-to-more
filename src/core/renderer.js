/**
 * renderer.js —— Markdown 渲染内核
 *
 * 从 lengyi-markdown-editor 剥离并改造:
 * - protectMath/restoreMath 占位技巧(防止 marked 破坏 $...$ 公式)
 * - marked + KaTeX + Mermaid 管线
 *
 * 新增(原 lengyi 没有):
 * - 代码高亮(highlight.js)
 * - TOC 锚点(标题自动加 id)
 * - Mermaid 异步错误兜底(run().catch)
 * - 考点 callout 自动识别(callout.js 单独处理)
 */

import { marked } from 'marked';
// 只注册用到的语言,避免全量打包(998KB → 大幅缩小)
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('plaintext', plaintext);

/* ------------------------------------------------------------------ */
/* marked 配置                                                          */
/* ------------------------------------------------------------------ */

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,       // 标题加 id(做 TOC 锚点)
  mangle: false,
  langPrefix: 'language-',
});

/* ------------------------------------------------------------------ */
/* 公式占位:防止 marked 把 $x_1$ 里的 _ 当强调                          */
/* ------------------------------------------------------------------ */

function protectMath(text) {
  const placeholders = [];
  let counter = 0;

  // 先隔离代码块/行内代码,代码块内不抠公式
  const parts = text.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g);
  const out = parts.map((part) => {
    if (part.startsWith('```') || part.startsWith('~~~') || part.startsWith('`')) return part;

    part = part.replace(/\$\$[\s\S]*?\$\$/g, (m) => store(m));
    part = part.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (m, p1) => p1 + store(m.slice(p1.length)));

    return part;
  }).join('');

  return { text: out, placeholders };

  function store(match) {
    const key = '<!--MATH' + counter++ + '-->';
    placeholders.push({ key, value: match });
    return key;
  }
}

function restoreMath(html, placeholders) {
  placeholders.forEach(({ key, value }) => {
    html = html.split(key).join(value);
  });
  return html;
}

/* ------------------------------------------------------------------ */
/* 代码高亮                                                             */
/* ------------------------------------------------------------------ */

function highlightCodeString(html) {
  // 统一 python/Python/pyhton → python
  html = html.replace(/class="language-(Python|pyhton|python3)"/gi, 'class="language-python"');

  // 用临时 DOM 解析,对每个代码块跑 hljs(跳过 mermaid)
  const container = document.createElement('div');
  container.innerHTML = html;
  const codeBlocks = container.querySelectorAll('pre code[class^="language-"]:not(.language-mermaid)');
  codeBlocks.forEach((block) => {
    const lang = (block.className.match(/language-(\w+)/) || [])[1];
    try {
      if (lang && hljs.getLanguage(lang)) {
        block.innerHTML = hljs.highlight(block.textContent, { language: lang }).value;
      } else {
        block.innerHTML = hljs.highlightAuto(block.textContent).value;
      }
      block.classList.add('hljs');
    } catch (e) {
      console.warn('hljs error:', e);
    }
  });
  return container.innerHTML;
}

/* ------------------------------------------------------------------ */
/* 主渲染函数                                                           */
/* ------------------------------------------------------------------ */

/**
 * 渲染 markdown 文本到 HTML,注入到目标容器
 * @param {string} text - markdown 原文(含 frontmatter 会被剥离)
 * @param {HTMLElement} targetEl - 注入目标
 * @param {object} options - { theme: 'light'|'dark' }
 * @returns {Promise<void>} Mermaid 异步渲染完成后 resolve
 */
export async function renderMarkdown(text, targetEl, options = {}) {
  const { theme = 'light' } = options;

  // 1. 抠出 frontmatter(渲染时不需要,调用方应已剥离)
  let body = text;
  const fmMatch = body.match(/^---\n[\s\S]*?\n---\n/);
  if (fmMatch) body = body.slice(fmMatch[0].length);

  // 2. 公式占位
  let placeholders = [];
  if (typeof window.renderMathInElement !== 'undefined') {
    const protected_ = protectMath(body);
    body = protected_.text;
    placeholders = protected_.placeholders;
  }

  // 3. marked 解析
  let html = marked.parse(body);

  // 4. 还原公式
  if (placeholders.length) {
    html = restoreMath(html, placeholders);
  }

  // 5. 任务列表样式标记(在 marked 产物上操作,还没注入 DOM)
  // 6. 代码高亮(对 HTML 字符串做)
  html = highlightCodeString(html);

  // 7. 注入 DOM
  targetEl.innerHTML = '<div class="markdown-body">' + html + '</div>';

  // 8. 任务列表样式
  styleTaskLists(targetEl);

  // 9. KaTeX 渲染
  if (typeof window.renderMathInElement !== 'undefined') {
    window.renderMathInElement(targetEl, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
      throwOnError: false,
    });
  }

  // 10. Mermaid 渲染(异步,带 catch 兜底)
  await renderMermaidBlocks(targetEl, theme);

  // 11. 标题 id 归一化(strip 加粗/标记)
  normalizeHeadingIds(targetEl);
}

/* ------------------------------------------------------------------ */
/* 辅助函数                                                             */
/* ------------------------------------------------------------------ */

function styleTaskLists(container) {
  container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    const li = cb.closest('li');
    if (!li) return;
    li.classList.add('task-item');
    const ul = li.closest('ul, ol');
    if (ul && ul.tagName === 'UL') ul.classList.add('task-list');
  });
}

async function renderMermaidBlocks(container, theme) {
  if (typeof window.mermaid === 'undefined') return;

  const blocks = container.querySelectorAll('.markdown-body pre code.language-mermaid');
  if (!blocks.length) return;

  blocks.forEach((code) => {
    const pre = code.parentElement;
    const source = code.textContent.trim();
    if (!source) return;
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = source;
    pre.replaceWith(div);
  });

  try {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
    });
    await window.mermaid.run({ querySelector: '.markdown-body .mermaid' });
  } catch (err) {
    console.error('Mermaid render error:', err);
  }
}

/**
 * marked 的 headerIds 会生成 id,但有些标题里有 **加粗** 或反引号,
 * 导致 id 含乱码。这里重新生成干净的 slug id。
 */
function normalizeHeadingIds(container) {
  const headings = container.querySelectorAll('.markdown-body h2, .markdown-body h3, .markdown-body h4');
  headings.forEach((h, idx) => {
    // 取纯文本,去掉加粗/代码标记
    const text = h.textContent.replace(/^\*+|\*+$/g, '').trim();
    h.id = slugify(text) || `heading-${idx}`;
    h.setAttribute('data-heading-text', text);
  });
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 从渲染后的 DOM 抽取目录(H2/H3)
 */
export function extractTOC(container) {
  const headings = container.querySelectorAll('.markdown-body h2, .markdown-body h3');
  const toc = [];
  headings.forEach((h) => {
    const level = parseInt(h.tagName[1], 10);
    const text = h.getAttribute('data-heading-text') || h.textContent;
    toc.push({ level, text, id: h.id });
  });
  return toc;
}
