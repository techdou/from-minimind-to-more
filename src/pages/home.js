/**
 * home.js —— 首页(学习中心)
 *
 * 展示:
 * - hero 介绍 + 统计
 * - 学习路径 DAG 图(基于 prerequisites)
 * - 推荐下一篇(基于已读 + 依赖)
 * - 按篇章分组的文章卡片网格
 */

import manifest from '../data/manifest.json';
import { getAllProgress, isRead } from '../core/progress.js';
import { renderLearningPath } from '../components/learning-path.js';

const CATEGORY_META = {
  foundations: { name: '基石与原理', desc: '万丈高楼平地起,理解 LLM 的起点', icon: '🏛' },
  architecture: { name: '核心架构', desc: '深入 Transformer 及其变体的内部构造', icon: '🏗' },
  algorithms: { name: '算法与演进', desc: '预训练、微调、强化学习的算法细节', icon: '🧠' },
  career: { name: '求职与实战', desc: '面试题库与求职经验', icon: '🎓' },
  optional: { name: '拓展阅读', desc: '进阶话题与延伸内容', icon: '📖' },
};

export async function renderHome(container) {
  const progress = getAllProgress();
  const readCount = manifest.filter((a) => progress[a.slug]?.read).length;
  const totalDuration = manifest.reduce((sum, a) => sum + (a.duration || 0), 0);
  const recommendation = getRecommendation(progress);

  container.innerHTML = `
    <div class="home-container">
      <div class="home-hero">
        <h1>From Minimind to More</h1>
        <p>深入探索大语言模型:从底层基石到高层架构,从理论原理到工程实践。这是 <a href="https://github.com/jingyaogong/minimind" target="_blank">Minimind</a> 的系统学习笔记,目标是让你不仅看懂 Minimind,更能对大模型技术体系建立全面认知。</p>
        <div class="home-stats">
          <div class="home-stat">
            <span class="home-stat-num">${manifest.length}</span>
            <span class="home-stat-label">篇文章</span>
          </div>
          <div class="home-stat">
            <span class="home-stat-num">${readCount}</span>
            <span class="home-stat-label">已读</span>
          </div>
          <div class="home-stat">
            <span class="home-stat-num">${totalDuration}</span>
            <span class="home-stat-label">分钟内容</span>
          </div>
        </div>
      </div>
      ${recommendation ? renderRecommendation(recommendation) : ''}
      <div id="learning-path-mount"></div>
      ${renderCategories(progress)}
    </div>
  `;

  // 渲染学习路径图(传入推荐 slug,打通横幅与路径联动)
  const pathMount = container.querySelector('#learning-path-mount');
  renderLearningPath(pathMount, recommendation?.slug);

  // 卡片点击跳转
  container.querySelectorAll('.article-card').forEach((card) => {
    card.addEventListener('click', () => {
      location.hash = `#/article/${card.dataset.slug}`;
    });
  });

  // 推荐点击
  const recBanner = container.querySelector('.recommendation-banner');
  if (recBanner) {
    recBanner.addEventListener('click', () => {
      location.hash = `#/article/${recBanner.dataset.slug}`;
    });
  }
}

/**
 * 推荐下一篇逻辑:
 * 找所有 prerequisites 已满足的未读文章,优先推荐 order 最小的
 */
function getRecommendation(progress) {
  const candidates = manifest.filter((article) => {
    if (progress[article.slug]?.read) return false;
    // 检查所有前置是否已读
    if (!article.prerequisites || article.prerequisites.length === 0) return true;
    return article.prerequisites.every((p) => progress[p]?.read);
  });

  if (candidates.length === 0) {
    // 所有文章都读完了,或剩余的都有未读前置
    // 返回第一篇未读的
    const unread = manifest.find((a) => !progress[a.slug]?.read);
    return unread || null;
  }

  // 按 category 优先级 + order 排序
  const catPriority = { foundations: 1, architecture: 2, algorithms: 3, career: 4, optional: 5 };
  candidates.sort((a, b) => {
    const pa = catPriority[a.category] || 9;
    const pb = catPriority[b.category] || 9;
    if (pa !== pb) return pa - pb;
    return a.order - b.order;
  });

  return candidates[0];
}

function renderRecommendation(article) {
  return `
    <div class="recommendation-banner" data-slug="${article.slug}">
      <span class="recommendation-label">推荐下一步</span>
      <span class="recommendation-title">${article.title}</span>
      <span class="recommendation-arrow">→</span>
    </div>
  `;
}

function renderCategories(progress) {
  const categories = ['foundations', 'architecture', 'algorithms', 'career', 'optional'];
  return categories
    .map((cat) => {
      const articles = manifest.filter((a) => a.category === cat);
      if (articles.length === 0) return '';
      const meta = CATEGORY_META[cat];

      return `
        <section class="category-block">
          <div class="category-header">
            <h2>${meta.icon} ${meta.name}</h2>
            <span class="category-desc">${meta.desc}</span>
          </div>
          <div class="article-grid">
            ${articles.map((a) => renderCard(a, progress)).join('')}
          </div>
        </section>
      `;
    })
    .join('');
}

function renderCard(article, progress) {
  const read = progress[article.slug]?.read;
  const inProgress = progress[article.slug]?.percent > 5 && !read;
  const dotClass = read ? 'read' : inProgress ? 'in-progress' : '';

  return `
    <div class="article-card" data-slug="${article.slug}">
      <div class="article-card-title">
        <span class="progress-dot ${dotClass}"></span>
        ${article.title}
      </div>
      <div class="article-card-meta">
        <span class="difficulty-badge difficulty-${article.difficulty}">${difficultyLabel(article.difficulty)}</span>
        <span class="meta-item">⏱ ${article.duration} 分钟</span>
        ${article.keypoints.length > 0 ? `<span class="meta-item">★ ${article.keypoints.length} 考点</span>` : ''}
      </div>
    </div>
  `;
}

function difficultyLabel(d) {
  const map = { beginner: '入门', intermediate: '进阶', advanced: '高级', expert: '专家' };
  return map[d] || d;
}
