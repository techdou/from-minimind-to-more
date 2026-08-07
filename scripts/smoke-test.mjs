/**
 * smoke-test.mjs —— 质量升级冒烟测试
 *
 * 验证本轮修复的 4 个关键行为:
 * 1. XSS:搜索框 payload 不执行(H1)
 * 2. 播客:播放中切路由,播放器销毁不泄漏(H3/H4)
 * 3. 进度:已读状态重访不清零(H5)
 * 4. 路由:快速连切不串页(M1)
 *
 * 运行:node scripts/smoke-test.mjs(需先 npm run build)
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const resp = await fetch(url);
        if (resp.ok) return resolve();
      } catch {}
      if (Date.now() - start > timeoutMs) return reject(new Error('服务器启动超时'));
      setTimeout(tick, 500);
    };
    tick();
  });
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
  shell: true,
});

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ` —— ${detail}` : ''}`);
  if (!ok) failed++;
};

try {
  await waitForServer(BASE);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // ── 1. XSS:搜索词 payload 不应执行 ─────────────────────────
  let dialogFired = false;
  page.on('dialog', async (d) => { dialogFired = true; await d.dismiss(); });
  await page.goto(`${BASE}/#/search/%22%20autofocus%20onfocus%3Dalert(1)%20x%3D%22`);
  await page.waitForTimeout(1200);
  check('XSS payload 不弹窗', !dialogFired);
  const inputVal = await page.inputValue('#search-input');
  check('搜索框内容完整保留 payload', inputVal.includes('onfocus'), inputVal.slice(0, 40));

  // ── 2. 播客:播放中切路由,播放器销毁 ────────────────────────
  await page.goto(`${BASE}/#/article/normalization/podcast`);
  await page.waitForSelector('#podcast-play', { timeout: 10000 });
  await page.click('#podcast-play');
  await page.waitForTimeout(800);
  // 切走(此时无论视频真实播放还是已降级模拟,都必须被清理)
  await page.evaluate(() => { location.hash = '#/'; });
  await page.waitForTimeout(800);
  const mediaCount = await page.evaluate(() => document.querySelectorAll('video, audio').length);
  check('切路由后页面无残留媒体元素', mediaCount === 0, `剩余 ${mediaCount} 个`);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // ── 3. 进度:已读粘滞 ──────────────────────────────────────
  await page.goto(`${BASE}/#/article/sft`);
  await page.waitForSelector('.markdown-body', { timeout: 10000 });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1000); // 等 scroll rAF + setProgress 落盘
  const readBefore = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('mm2m_progress') || '{}').sft?.read);
  check('滚动到底后标记已读', readBefore === true);
  // 重访(模拟旧 bug 的触发路径:重进时初始进度≈0)
  await page.goto(`${BASE}/#/`);
  await page.goto(`${BASE}/#/article/sft`);
  await page.waitForSelector('.markdown-body', { timeout: 10000 });
  await page.waitForTimeout(1500); // 等 restoreScroll + refresh 流程走完
  const rec = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('mm2m_progress') || '{}').sft);
  check('重访后已读状态保留', rec?.read === true, `read=${rec?.read} percent=${rec?.percent}`);

  // ── 4. 路由竞态:快速连切,最终页面与 hash 一致 ──────────────
  await page.evaluate(() => { location.hash = '#/'; });
  for (const h of ['#/category/algorithms', '#/article/moe', '#/search/attention', '#/']) {
    await page.evaluate((hash) => { location.hash = hash; }, h);
    await page.waitForTimeout(60); // 不等渲染完就连切
  }
  await page.waitForTimeout(1200);
  const finalHash = await page.evaluate(() => location.hash);
  const mainCount = await page.evaluate(() => document.querySelectorAll('#app main').length);
  check('快速连切后停在首页', finalHash === '#/' || finalHash === '');
  check('页面只有一份 main(无旧渲染叠加)', mainCount === 1, `${mainCount} 份`);

  check('全程无 pageerror', errors.length === 0, errors[0] || '');

  await browser.close();
} finally {
  server.kill();
}

console.log(failed === 0 ? '\n全部通过' : `\n${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
