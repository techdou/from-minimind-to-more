import { chromium } from 'playwright';

const BASE = 'http://localhost:5174';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// 收集控制台日志
const consoleErrors = [];
const consoleWarnings = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
  if (msg.type() === 'warning') consoleWarnings.push(msg.text());
});

// === 归一化篇:公式 + 代码区 ===
await page.goto(`${BASE}/#/article/normalization`);
await page.waitForTimeout(3000);

// 找到第一个 h2 含"Layer Normalization",滚到那里(公式集中区)
const lnHeading = await page.locator('h2:has-text("Layer Normalization"), h3:has-text("数学定义")').first();
if (await lnHeading.count() > 0) {
  await lnHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
}
await page.screenshot({ path: 'screenshots/normalization-formula.png', fullPage: false });
console.log('[OK] normalization-formula.png');

// 检查页面有没有未渲染的 $ 原文(公式失败的标志)
const dollarRaw = await page.locator('text=/\\$[^$]+\\$/').count();
console.log(`  未渲染的 $...$ 残留: ${dollarRaw}`);

// 检查 KaTeX 是否渲染
const katexCount = await page.locator('.katex').count();
console.log(`  KaTeX 渲染元素数: ${katexCount}`);

// 检查代码高亮
const hljsCount = await page.locator('.hljs').count();
console.log(`  代码高亮块数: ${hljsCount}`);

// === GRPO 篇:考点 callout ===
await page.goto(`${BASE}/#/article/grpo`);
await page.waitForTimeout(2500);

const calloutCount = await page.locator('.callout-keypoint').count();
console.log(`\nGRPO callout 考点卡片数: ${calloutCount}`);

// 截 callout 区
if (calloutCount > 0) {
  const firstCallout = page.locator('.callout-keypoint').first();
  await firstCallout.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/grpo-callout.png', fullPage: false });
  console.log('[OK] grpo-callout.png');
}

// === 侧栏目录 scrollspy ===
await page.goto(`${BASE}/#/article/normalization`);
await page.waitForTimeout(2000);
const tocItemCount = await page.locator('.toc-list li').count();
console.log(`\nnormalization 侧栏目录项数: ${tocItemCount}`);

await browser.close();

console.log('\n=== 验证总结 ===');
console.log(`控制台错误: ${consoleErrors.length}`);
if (consoleErrors.length) console.log(consoleErrors.slice(0, 5));
console.log(`控制台警告: ${consoleWarnings.length}`);
if (consoleWarnings.length) console.log(consoleWarnings.slice(0, 3));
