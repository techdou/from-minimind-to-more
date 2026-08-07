/**
 * page-lifecycle.js —— 页面生命周期管理(独立模块,避免与 app.js 循环依赖)
 *
 * - pageSignal():各页面的 window 级监听(scroll 等)统一挂这个 signal,
 *   路由切换时一次性移除,防监听器泄漏
 * - onPageCleanup(fn):页面级清理回调(如播客播放器 destroy),
 *   路由切换时由 router 统一调用
 */

let pageAborter = new AbortController();
const pageCleanups = new Set();

export function pageSignal() {
  return pageAborter.signal;
}

export function onPageCleanup(fn) {
  pageCleanups.add(fn);
}

/**
 * 路由切换时由 router 调用:abort 所有页面监听 + 执行清理回调 + 停掉媒体
 */
export function cleanupPage() {
  pageAborter.abort();
  pageAborter = new AbortController();
  pageCleanups.forEach((fn) => {
    try { fn(); } catch (err) { console.error('页面清理出错:', err); }
  });
  pageCleanups.clear();
  // 双保险:离开页面时停掉所有媒体(视频被移除 DOM 后仍会出声)
  document.querySelectorAll('video, audio').forEach((m) => m.pause());
}
