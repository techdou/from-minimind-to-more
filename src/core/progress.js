/**
 * progress.js —— 阅读进度管理
 *
 * 功能:
 * 1. 顶部进度条(scroll 百分比)
 * 2. localStorage 记录每篇阅读位置,下次自动恢复
 * 3. 记录已读/未读状态(供首页推荐)
 */

const STORAGE_KEY = 'mm2m_progress';

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * 获取某篇文章的阅读进度(0-100 百分比)
 */
export function getProgress(slug) {
  const all = loadAll();
  return all[slug]?.percent || 0;
}

/**
 * 记录某篇文章的阅读进度
 */
export function setProgress(slug, percent, scrollY) {
  const all = loadAll();
  all[slug] = {
    percent: Math.round(percent),
    scrollY: scrollY || 0,
    updatedAt: Date.now(),
    read: percent > 90, // 超过 90% 算已读
  };
  saveAll(all);
}

/**
 * 恢复某篇文章的滚动位置
 */
export function restoreScroll(slug) {
  const all = loadAll();
  const record = all[slug];
  if (record && record.scrollY) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: record.scrollY, behavior: 'instant' });
    });
  }
}

/**
 * 某篇是否已读
 */
export function isRead(slug) {
  const all = loadAll();
  return all[slug]?.read || false;
}

/**
 * 获取所有进度(首页统计用)
 */
export function getAllProgress() {
  return loadAll();
}

/**
 * 绑定滚动进度条
 * @param {string} slug - 文章 slug
 * @param {HTMLElement} barEl - 进度条元素
 */
export function bindProgressBar(slug, barEl) {
  let ticking = false;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (barEl) barEl.style.width = percent + '%';
    setProgress(slug, percent, scrollTop);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // 初始更新一次
  update();
}
