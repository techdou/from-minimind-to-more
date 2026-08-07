/**
 * build-content.js —— 把 content/*.md 编译成前端可用的 JSON
 *
 * 产物:
 *   src/data/manifest.json     所有文章元数据(列表/首页用)
 *   src/data/articles/<slug>.json  每篇正文 + TOC 预提取(阅读页用)
 *
 * 前端运行时 import JSON,不做运行时 md 解析(加载快)。
 * 运行:npm run build:content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
// manifest 放 src/data(静态 import,vite 打包)
const MANIFEST_DIR = path.join(ROOT, 'src', 'data');
// articles 放 public/data(fetch 按需加载,vite build 原样复制到 dist)
const PUBLIC_DATA_DIR = path.join(ROOT, 'public', 'data');
const ARTICLES_DIR = path.join(PUBLIC_DATA_DIR, 'articles');

// 篇章顺序覆盖(gen-frontmatter 的 alphabetical 排序不准)
const ORDER_OVERRIDE = {
  foundations: { 'tokenizer': 1, 'minimind-design': 2, 'embedding-position-encoding': 3 },
  architecture: { 'normalization': 1, 'kv-cache-flash-attention': 2, 'moe': 3, 'assembly': 4 },
  algorithms: { 'pretrain': 1, 'sft': 2, 'rl-overview': 3, 'dpo': 4, 'ppo': 5, 'grpo': 6, 'spo': 7 },
  career: { 'interview-100': 1 },
  optional: { 'inference-training-optimization': 1 },
};

// YAML frontmatter 解析(js-yaml,依赖早已在 package.json)
// 解析失败时打警告并返回空 fm——不静默吞掉,避免元数据丢了还不知情
function parseFrontmatter(raw, fileLabel = '') {
  // 统一换行
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { fm: {}, body: normalized };

  let fm = {};
  try {
    fm = yaml.load(match[1]) || {};
  } catch (err) {
    console.warn(`[警告] frontmatter 解析失败 ${fileLabel}: ${err.message.split('\n')[0]}`);
  }
  return { fm, body: match[2] };
}

// 预提取 TOC(从正文 H2/H3)
function extractTOCFromText(body) {
  // 统一换行(Windows CRLF → LF),避免 \r 干扰正则
  const text = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n');
  const toc = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // 围栏代码块:``` 或 ~~~ 都识别,其中的 # 标题不进 TOC
    if (line.match(/^(```|~~~)/)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // H2: ## 1. xxx  或  ## **1. xxx**
    // H3: ### 2.1 xxx
    let m;
    if ((m = line.match(/^(#{2,3})\s+(.+)$/))) {
      const level = m[1].length;
      let headingText = m[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
      toc.push({ level, text: headingText });
    }
  }

  return toc;
}

// 主流程
fs.mkdirSync(MANIFEST_DIR, { recursive: true });
fs.mkdirSync(ARTICLES_DIR, { recursive: true });

const manifest = [];
const categories = ['foundations', 'architecture', 'algorithms', 'career', 'optional'];

for (const cat of categories) {
  const dir = path.join(CONTENT_DIR, cat);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const slug = path.basename(file, '.md');
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { fm, body } = parseFrontmatter(raw, `${cat}/${file}`);

    const order = ORDER_OVERRIDE[cat]?.[slug] || fm.order || 99;
    const toc = extractTOCFromText(body);

    // manifest 条目(列表用,不含正文)
    const entry = {
      slug,
      title: fm.title || slug,
      category: cat,
      series: fm.series || cat,
      order,
      difficulty: fm.difficulty || 'intermediate',
      duration: fm.duration || 15,
      prerequisites: fm.prerequisites || [],
      objectives: fm.objectives || [],
      keypoints: fm.keypoints || [],
      formula_density: fm.formula_density || 'low',
      code_lang: fm.code_lang || 'python',
      tags: fm.tags || [],
      word_count: body.length,
      toc_count: toc.length,
    };
    manifest.push(entry);

    // 单篇文章 JSON(含正文)
    const article = {
      ...entry,
      body,           // markdown 原文(前端渲染)
      toc,            // 预提取目录
    };
    fs.writeFileSync(
      path.join(ARTICLES_DIR, `${slug}.json`),
      JSON.stringify(article, null, 0),
      'utf-8',
    );

    console.log(`[OK] ${cat}/${slug} (order=${order}, ${toc.length} TOC)`);
  }
}

// manifest 按 category + order 排序
manifest.sort((a, b) => {
  if (a.category !== b.category) {
    return categories.indexOf(a.category) - categories.indexOf(b.category);
  }
  return a.order - b.order;
});

fs.writeFileSync(
  path.join(MANIFEST_DIR, 'manifest.json'),
  JSON.stringify(manifest, null, 0),
  'utf-8',
);

console.log(`\nmanifest.json: ${manifest.length} 篇`);
console.log(`articles/: ${manifest.length} 个 JSON 文件`);
console.log(`\n下一步:npm run dev 启动查看效果`);
