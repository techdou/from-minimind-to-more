/**
 * category.js —— 篇章列表页
 */

import manifest from '../data/manifest.json';
import { getAllProgress } from '../core/progress.js';

const CATEGORY_META = {
  foundations: { name: '基石与原理', desc: '万丈高楼平地起,理解 LLM 的起点' },
  architecture: { name: '核心架构', desc: '深入 Transformer 及其变体的内部构造' },
  algorithms: { name: '算法与演进', desc: '预训练、微调、强化学习的算法细节' },
  career: { name: '求职与实战', desc: '面试题库与求职经验' },
  optional: { name: '拓展阅读', desc: '进阶话题与延伸内容' },
};

export async function renderCategory(container, category) {
  const articles = manifest.filter((a) => a.category === category);
  const meta = CATEGORY_META[category];

  if (!meta) {
    container.innerHTML = `<div class="error-state"><h2>未知篇章</h2><a href="#/">回首页</a></div>`;
    return;
  }

  const progress = getAllProgress();

  container.innerHTML = `
    <div class="home-container">
      <div class="home-hero">
        <h1>${meta.name}</h1>
        <p>${meta.desc}</p>
      </div>
      <div class="article-grid">
        ${articles.map((a) => renderCard(a, progress)).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.article-card').forEach((card) => {
    card.addEventListener('click', () => {
      location.hash = `#/article/${card.dataset.slug}`;
    });
  });
}

function renderCard(article, progress) {
  const read = progress[article.slug]?.read;
  const inProgress = progress[article.slug]?.percent > 5 && !read;
  const dotClass = read ? 'read' : inProgress ? 'in-progress' : '';
  const diffMap = { beginner: '入门', intermediate: '进阶', advanced: '高级', expert: '专家' };

  return `
    <div class="article-card" data-slug="${article.slug}">
      <div class="article-card-title">
        <span class="progress-dot ${dotClass}"></span>
        ${article.title}
      </div>
      <div class="article-card-meta">
        <span class="difficulty-badge difficulty-${article.difficulty}">${diffMap[article.difficulty]}</span>
        <span class="meta-item">⏱ ${article.duration} 分钟</span>
        ${article.keypoints.length > 0 ? `<span class="meta-item">★ ${article.keypoints.length} 考点</span>` : ''}
      </div>
    </div>
  `;
}
