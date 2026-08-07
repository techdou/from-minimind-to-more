/**
 * build-search-index.js —— 构建全文搜索索引
 *
 * 读取 public/data/articles/*.json 的 body 字段
 * 用 FlexSearch 建索引,输出 public/data/search-index.json
 *
 * 运行:node scripts/build-search-index.js(已集成到 npm run build)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Index } from 'flexsearch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'public', 'data', 'articles');
const OUT_PATH = path.join(ROOT, 'public', 'data', 'search-index.json');

// 构建搜索文档:每篇文章一个文档
const docs = [];

for (const f of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'))) {
  const article = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8'));
  // 搜索内容:title + toc 标题 + body(去掉 markdown 标记)
  const tocText = (article.toc || []).map((t) => t.text).join(' ');
  const cleanBody = (article.body || '')
    .replace(/```[\s\S]*?```/g, ' ')   // 去代码块
    .replace(/[#*`>\-\[\]()]/g, ' ')   // 去 markdown 符号
    .replace(/\n+/g, ' ')
    .trim();

  docs.push({
    id: article.slug,
    slug: article.slug,
    title: article.title,
    category: article.series,
    difficulty: article.difficulty,
    // 搜索用文本(title 权重高,放前面重复)。全量收录正文:
    // 曾截断到 5000 字,16 篇里 10 篇超出导致后半搜不到;
    // 全量后索引约 4-6MB,搜索页懒加载,不影响首屏。
    content: `${article.title} ${article.title} ${tocText} ${cleanBody}`,
    // 预览用(取 body 前 200 字)
    preview: cleanBody.slice(0, 200),
  });
}

// FlexSearch 索引
const index = new Index({
  charset: 'cjk',      // 中日韩分词
  tokenize: 'forward',  // 前向匹配
  resolution: 9,
  cache: 100,
});

// 添加文档
for (const doc of docs) {
  index.add(doc.id, doc.content);
}

// 导出索引。flexsearch 0.8 的 export 逐 key 回调;用 await 兼容返回
// Promise 的版本/配置变更后的异步行为,不再用 setTimeout(500) 赌时序。
const exportData = {};
await index.export((key, data) => {
  exportData[key] = data;
});

const output = {
  docs: docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    category: d.category,
    difficulty: d.difficulty,
    preview: d.preview,
  })),
  index: exportData,
};

fs.writeFileSync(OUT_PATH, JSON.stringify(output), 'utf-8');
console.log(`[OK] 搜索索引: ${docs.length} 篇文档 → ${path.relative(ROOT, OUT_PATH)}`);
console.log(`  索引大小: ${(fs.statSync(OUT_PATH).size / 1024).toFixed(0)}KB`);
