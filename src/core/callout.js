/**
 * callout.js —— 考点/重点 自动识别成 callout 卡片
 *
 * explorer 分析发现,原文有三种考点提示形态:
 *   A. 加粗独立段:**面试考点：...**  /  **高频考点** / **这是今年必考的知识点**
 *   B. 代码注释:# [面试考点] ... / # [核心考点 N]
 *   C. 行内加粗:...是面试中的**核心考点**...
 *
 * 本模块在渲染后扫 DOM,把形态 A 转成醒目卡片,形态 B 在代码块上方浮标提示。
 */

const KEYPOINT_PATTERNS = [
  /面试考点[：:]/,
  /核心考点/,
  /高频考点/,
  /必考[的之]/,
  /易错点/,
];

/**
 * 把正文里"考点提示"的加粗段转成 callout 卡片
 * 在 renderer 注入 DOM 后、KaTeX 渲染前调用
 */
export function enhanceCallouts(container) {
  const markdownBody = container.querySelector('.markdown-body');
  if (!markdownBody) return;

  // 形态 A:独立成段的 <strong> 且内容含考点关键词
  const strongs = markdownBody.querySelectorAll('p > strong:only-child, p > strong');
  strongs.forEach((strong) => {
    const text = strong.textContent.trim();
    const isKeypoint = KEYPOINT_PATTERNS.some((p) => p.test(text));
    if (!isKeypoint) return;

    const p = strong.closest('p');
    if (!p) return;

    // 只处理"整段就是考点提示"的情况(strong 是段落主体)
    const pText = p.textContent.trim();
    if (pText.length - text.length > 20) return; // 段落还有大量其他内容,不算独立提示

    const callout = document.createElement('div');
    callout.className = 'callout callout-keypoint';

    const label = document.createElement('div');
    label.className = 'callout-label';
    label.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><span>考点</span>';
    callout.appendChild(label);

    const content = document.createElement('div');
    content.className = 'callout-content';
    content.textContent = text;
    callout.appendChild(content);

    p.replaceWith(callout);
  });

  // 形态 B:代码块内 # [面试考点] / [核心考点] 注释 → 代码块右上角加考点标记
  const codeBlocks = markdownBody.querySelectorAll('pre code');
  codeBlocks.forEach((code) => {
    const raw = code.textContent;
    const hasExamComment = /#\s*\[(面试考点|核心考点|高频考点)/.test(raw);
    if (!hasExamComment) return;

    const pre = code.closest('pre');
    if (!pre || pre.dataset.keypointMarked) return;
    pre.dataset.keypointMarked = '1';

    pre.style.position = 'relative';
    const badge = document.createElement('span');
    badge.className = 'code-keypoint-badge';
    badge.textContent = '含考点';
    badge.title = '此代码块包含面试考点注释,注意 [面试考点]/[核心考点] 标记';
    pre.appendChild(badge);
  });
}
