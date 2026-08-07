/**
 * localize-images.js —— 下载外链图片到本地,替换 md 里的 URL
 *
 * 扫描 content/ 下所有 md 的 ![](url) 引用:
 * - 本地 assets/ 引用:跳过
 * - 外链:下载到 public/assets/external/,替换 md URL 为 /assets/external/xxx
 *
 * 运行:node scripts/localize-images.js
 * 幂等:已下载的跳过,已替换的 URL 不重复替换
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const EXT_DIR = path.join(ROOT, 'public', 'assets', 'external');

// 简易下载(Node 18+ 内置 fetch + 手动写文件)
async function download(url, destPath) {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    redirect: 'follow',
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

// 从 URL 推断扩展名
function getExt(url) {
  const clean = url.split('?')[0];
  if (clean.endsWith('.gif')) return '.gif';
  if (clean.endsWith('.png')) return '.png';
  if (clean.endsWith('.webp')) return '.webp';
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return '.jpg';
  if (clean.endsWith('.svg')) return '.svg';
  return '.png'; // 默认
}

// 生成本地文件名
function makeLocalName(url, idx) {
  const ext = getExt(url);
  // 从 URL 提取有意义的名
  const u = new URL(url);
  const parts = u.pathname.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1] || 'image';
  // 清理名(去掉 hash/query,限长),去掉已有扩展名后再加
  let name = lastPart.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 40);
  // 去掉尾部已有扩展名(避免 .gif.gif)
  name = name.replace(/\.(gif|png|webp|jpg|jpeg|svg)$/i, '');
  if (!name) name = `ext-${idx}`;
  return `${name}${ext}`;
}

async function main() {
  fs.mkdirSync(EXT_DIR, { recursive: true });
  const mdFiles = [];
  for (const dir of fs.readdirSync(CONTENT_DIR)) {
    const sub = path.join(CONTENT_DIR, dir);
    if (fs.statSync(sub).isDirectory()) {
      for (const f of fs.readdirSync(sub)) {
        if (f.endsWith('.md')) mdFiles.push(path.join(sub, f));
      }
    }
  }

  let downloaded = 0, skipped = 0, failed = 0;
  let totalImg = 0;

  for (const mdPath of mdFiles) {
    let content = fs.readFileSync(mdPath, 'utf-8');
    let modified = false;

    // 匹配 ![alt](url)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    const replacements = [];

    while ((match = imgRegex.exec(content)) !== null) {
      const [full, alt, url] = match;
      totalImg++;

      // 跳过本地引用
      if (url.startsWith('./assets/') || url.startsWith('assets/') || url.startsWith('/assets/')) {
        skipped++;
        continue;
      }

      // 跳过非 http(注:/assets/external/ 已在上面的 /assets/ 前缀里拦截)
      if (!url.startsWith('http')) {
        skipped++;
        continue;
      }

      const localName = makeLocalName(url, totalImg);
      const localPath = `/assets/external/${localName}`;
      const destPath = path.join(EXT_DIR, localName);

      replacements.push({ full, alt, url, localPath, destPath, localName });
    }

    // 下载并替换
    for (const r of replacements) {
      try {
        if (!fs.existsSync(r.destPath)) {
          const size = await download(r.url, r.destPath);
          console.log(`[下载] ${r.localName} (${(size / 1024).toFixed(0)}KB) ← ${r.url.slice(0, 60)}...`);
          downloaded++;
        } else {
          console.log(`[已有] ${r.localName}`);
        }
        // 替换 md 里的 URL(全局:同一 URL 出现多处都要换;
        // 用 split/join 避免 String.replace 只换首处、且不用转义正则)
        content = content.split(r.url).join(r.localPath);
        modified = true;
      } catch (err) {
        console.error(`[失败] ${r.url.slice(0, 60)}... → ${err.message}`);
        failed++;
      }
    }

    if (modified) {
      fs.writeFileSync(mdPath, content, 'utf-8');
      console.log(`[更新] ${path.relative(ROOT, mdPath)}`);
    }
  }

  console.log(`\n=== 外链图片本地化完成 ===`);
  console.log(`总图片引用: ${totalImg}`);
  console.log(`新下载: ${downloaded}`);
  console.log(`本地已有: ${skipped}`);
  console.log(`失败: ${failed}`);
}

main().catch(console.error);
