import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';  // production preview
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(`PAGE ERROR: ${err.message}`));

console.log('=== Production Build 验证 ===\n');

// 1. 首页
await page.goto(`${BASE}/`);
await page.waitForTimeout(1500);
const articleCards = await page.locator('.article-card').count();
console.log(`[首页] 文章卡片数: ${articleCards} (期望 16)`);

// 2. 归一化篇(公式+代码+目录)
await page.goto(`${BASE}/#/article/normalization`);
await page.waitForTimeout(3000);
const katexCount = await page.locator('.katex').count();
const hljsCount = await page.locator('.hljs').count();
const tocItems = await page.locator('.toc-list li').count();
console.log(`[归一化] KaTeX 公式: ${katexCount}, 代码高亮: ${hljsCount}, 目录项: ${tocItems}`);

// 3. GRPO(考点 callout)
await page.goto(`${BASE}/#/article/grpo`);
await page.waitForTimeout(2500);
const calloutCount = await page.locator('.callout-keypoint').count();
console.log(`[GRPO] 考点 callout: ${calloutCount}`);

// 4. PPO(长文,1175 行)
await page.goto(`${BASE}/#/article/ppo`);
await page.waitForTimeout(2000);
const ppoToc = await page.locator('.toc-list li').count();
console.log(`[PPO] 目录项: ${ppoToc}`);

// 5. 主题切换
await page.goto(`${BASE}/`);
await page.waitForTimeout(1000);
await page.locator('#theme-toggle').click();
await page.waitForTimeout(500);
const theme = await page.evaluate(() => document.documentElement.dataset.theme);
console.log(`[主题切换] 切换后: ${theme}`);

// 6. 篇章页
await page.goto(`${BASE}/#/category/algorithms`);
await page.waitForTimeout(1000);
const algoCards = await page.locator('.article-card').count();
console.log(`[算法篇] 文章卡片: ${algoCards} (期望 7)`);

await browser.close();

console.log(`\n控制台错误: ${errors.length}`);
if (errors.length) errors.slice(0, 5).forEach(e => console.log(`  - ${e}`));

// 验证结论
console.log('\n=== 验证结论 ===');
const pass = articleCards === 16 && katexCount > 50 && tocItems > 20 && calloutCount > 0 && errors.length === 0 && theme === 'dark' && algoCards === 7;
console.log(pass ? '✅ 全部通过' : '❌ 有未通过项');
process.exit(pass ? 0 : 1);
