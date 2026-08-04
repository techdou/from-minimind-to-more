/**
 * theme.js —— 主题切换(亮/暗)
 */

const KEY = 'mm2m_theme';

export function initTheme() {
  const saved = localStorage.getItem(KEY) || 'light';
  document.documentElement.dataset.theme = saved;
  document.body.dataset.theme = saved;
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  document.body.dataset.theme = next;
  localStorage.setItem(KEY, next);
}

export function getTheme() {
  return document.documentElement.dataset.theme || 'light';
}
