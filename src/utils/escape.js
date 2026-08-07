/**
 * escape.js —— 共享 HTML 转义工具
 *
 * 所有「不可信字符串拼进 innerHTML」的场景统一用这里,
 * 不要再在各组件里写本地 escapeHTML。
 */

/**
 * HTML 转义:防 XSS / 防 < 开头的文本(如 <|im_start|>)被当标签吞掉
 */
export function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 正则转义:用户输入拼进 RegExp 前用
 */
export function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
