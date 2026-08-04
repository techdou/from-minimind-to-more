/**
 * learning-path.js —— 首页学习路径 DAG 图
 *
 * 用 SVG 手绘有向无环图,展示 16 篇文章的依赖关系。
 * 五层结构:基石 → 架构 → 算法(监督/对齐两支) → 面试
 *
 * 数据来源:manifest.json 的 prerequisites 字段(explorer 实证的交叉引用)
 */

import manifest from '../data/manifest.json';
import { getAllProgress } from '../core/progress.js';

// 篇章分层(基于 explorer 实证的依赖 DAG)
const LAYERS = [
  // 第一层:基石(无前置或互不依赖)
  { name: '基石', articles: ['tokenizer', 'minimind-design', 'embedding-position-encoding'] },
  // 第二层:架构
  { name: '架构', articles: ['normalization', 'kv-cache-flash-attention', 'moe', 'assembly'] },
  // 第三层:算法-监督
  { name: '监督学习', articles: ['pretrain', 'sft'] },
  // 第四层:算法-对齐(两支并列)
  { name: '对齐', articles: ['rl-overview', 'dpo', 'ppo', 'grpo', 'spo'] },
  // 第五层:求职
  { name: '求职', articles: ['interview-100'] },
];

// 节点尺寸和间距
const NODE_W = 150;
const NODE_H = 44;
const LAYER_GAP_X = 60;   // 篇章层之间水平间距
const NODE_GAP_Y = 16;    // 同层节点垂直间距
const COLUMN_GAP_X = 140; // 不同篇章列之间水平间距

/**
 * 渲染学习路径图到目标容器
 */
export function renderLearningPath(container) {
  const progress = getAllProgress();
  const { nodes, edges, width, height } = computeLayout(progress);

  container.innerHTML = `
    <div class="learning-path-container">
      <div class="learning-path-header">
        <h3>学习路径</h3>
        <span class="learning-path-hint">点击节点跳转阅读 · 实线箭头表示推荐前置</span>
      </div>
      <div class="learning-path-scroll">
        <svg class="learning-path-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
          ${renderEdges(edges)}
          ${renderLayerLabels(nodes)}
          ${nodes.map(renderNode).join('')}
        </svg>
      </div>
    </div>
  `;

  // 节点点击跳转
  container.querySelectorAll('[data-slug]').forEach((el) => {
    el.addEventListener('click', () => {
      location.hash = `#/article/${el.dataset.slug}`;
    });
  });
}

function computeLayout(progress) {
  const nodes = [];
  const slugToNode = {};

  // 计算每层节点的 Y 坐标
  let x = 20;
  const layerWidths = LAYERS.map((layer) => {
    const maxColWidth = NODE_W;
    return maxColWidth;
  });

  let currentX = 20;
  for (let li = 0; li < LAYERS.length; li++) {
    const layer = LAYERS[li];
    const layerArticles = layer.articles
      .map((slug) => manifest.find((a) => a.slug === slug))
      .filter(Boolean);

    const layerHeight = layerArticles.length * (NODE_H + NODE_GAP_Y) - NODE_GAP_Y;
    const startY = 40; // 留出层标签空间

    layerArticles.forEach((article, ni) => {
      const node = {
        slug: article.slug,
        title: shortenTitle(article.title),
        fullTitle: article.title,
        x: currentX,
        y: startY + ni * (NODE_H + NODE_GAP_Y),
        w: NODE_W,
        h: NODE_H,
        layer: li,
        status: getNodeStatus(article.slug, progress),
        difficulty: article.difficulty,
      };
      nodes.push(node);
      slugToNode[article.slug] = node;
    });

    currentX += NODE_W + (li < LAYERS.length - 1 ? COLUMN_GAP_X : 0);
  }

  // 计算边(从 prerequisites 反推)
  const edges = [];
  for (const article of manifest) {
    if (!article.prerequisites) continue;
    for (const prereq of article.prerequisites) {
      const from = slugToNode[prereq];
      const to = slugToNode[article.slug];
      if (from && to) {
        edges.push({ from, to });
      }
    }
  }

  const width = currentX + 20;
  const height = Math.max(...LAYERS.map((l) => l.articles.length)) * (NODE_H + NODE_GAP_Y) + 80;

  return { nodes, edges, width, height };
}

function renderEdges(edges) {
  return edges.map((edge) => {
    const x1 = edge.from.x + edge.from.w;
    const y1 = edge.from.y + edge.from.h / 2;
    const x2 = edge.to.x;
    const y2 = edge.to.y + edge.to.h / 2;
    const midX = (x1 + x2) / 2;
    // 贝塞尔曲线
    const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
    return `<path d="${path}" class="lp-edge" marker-end="url(#lp-arrow)"/>`;
  }).join('');
}

function renderLayerLabels(nodes) {
  // 每层第一个节点的 X 坐标处放层名
  const layersSeen = new Set();
  const labels = [];
  // 用 LAYERS 定义顺序渲染层标签
  let currentX = 20;
  for (let li = 0; li < LAYERS.length; li++) {
    const layer = LAYERS[li];
    labels.push(`<text x="${currentX + NODE_W / 2}" y="22" class="lp-layer-label">${layer.name}</text>`);
    currentX += NODE_W + (li < LAYERS.length - 1 ? COLUMN_GAP_X : 0);
  }
  return labels.join('');
}

function renderNode(node) {
  const statusClass = `lp-node-${node.status}`;
  return `
    <g class="lp-node ${statusClass}" data-slug="${node.slug}">
      <rect x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="6" class="lp-node-rect" />
      <text x="${node.x + node.w / 2}" y="${node.y + node.h / 2 + 4}" class="lp-node-text">${node.title}</text>
      ${node.status === 'read' ? `<circle cx="${node.x + node.w - 8}" cy="${node.y + 8}" r="5" class="lp-check"/>` : ''}
    </g>
  `;
}

function getNodeStatus(slug, progress) {
  const p = progress[slug];
  if (p?.read) return 'read';
  if (p?.percent > 5) return 'in-progress';
  return 'todo';
}

function shortenTitle(title) {
  // 缩短标题适配节点宽度
  return title
    .replace(/^架构篇：/, '')
    .replace(/^算法篇：Minimind的/, '')
    .replace(/^基石：/, '')
    .replace(/：.*$/, m => m.length > 6 ? '' : m)
    .slice(0, 12);
}
