/**
 * paths.js —— 运行时静态资源路径工具
 *
 * 子路径部署(GitHub Pages 的 /from-minimind-to-more/)下,
 * 代码里写死的 fetch('/data/...')、img.src='/assets/...' 会打到域名根而 404。
 * 所有运行时拼接的静态资源路径必须过 withBase(),由 Vite 的
 * import.meta.env.BASE_URL 注入实际前缀(dev 与各部署环境自动一致)。
 */

/** Vite 注入的 base,保证以 / 结尾(如 '/from-minimind-to-more/') */
export const BASE_URL = import.meta.env.BASE_URL;

/**
 * 给以 / 开头的站点内路径加 base 前缀
 * 相对路径、http(s) 外链、协议相对 URL(//cdn...)原样返回
 */
export function withBase(path) {
  if (typeof path !== 'string') return path;
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return BASE_URL.replace(/\/$/, '') + path;
}
