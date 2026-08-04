import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(`PAGE: ${err.message}`));

console.log('=== Phase 2 验证 ===\n');

// 1. 首页:学习路径 DAG
await page.goto(`${BASE}/`);
await page.waitForTimeout(1500);
const pathNodes = await page.locator('.lp-node').count();
const pathEdges = await page.locator('.lp-edge').count();
const layerLabels = await page.locator('.lp-layer-label').count();
console.log(`[学习路径] 节点: ${pathNodes}, 边: ${pathEdges}, 层标签: ${layerLabels}`);

// 2. 首页:推荐下一篇
const recBanner = await page.locator('.recommendation-banner').count();
const recTitle = recBanner > 0 ? await page.locator('.recommendation-title').textContent() : null;
console.log(`[推荐] banner 存在: ${recBanner > 0}, 推荐: ${recTitle?.trim()}`);

// 3. 文章页测验入口
await page.goto(`${BASE}/#/article/grpo`);
await page.waitForTimeout(2000);
const quizEntry = await page.locator('.quiz-entry-banner').count();
console.log(`[测验入口] 存在: ${quizEntry > 0}`);

// 4. 测验页
await page.goto(`${BASE}/#/article/grpo/quiz`);
await page.waitForTimeout(1500);
const quizQuestions = await page.locator('.quiz-question').count();
const quizFillInputs = await page.locator('.quiz-input').count();
console.log(`[测验页] 题目数: ${quizQuestions}, 填空题输入框: ${quizFillInputs}`);

// 5. 测验页:做一道填空题验证交互
if (quizFillInputs > 0) {
  const firstInput = page.locator('.quiz-input').first();
  const answer = await firstInput.getAttribute('data-answer');
  await firstInput.fill(answer);
  await page.locator('.quiz-check-btn').first().click();
  await page.waitForTimeout(500);
  const inputClass = await firstInput.evaluate(el => el.className);
  console.log(`[填空题交互] 答案: "${answer}", 结果: ${inputClass.includes('correct') ? '正确' : '错误'}`);
}

// 6. 无考点的文章(tokenizer)测验收提示空状态
await page.goto(`${BASE}/#/article/tokenizer/quiz`);
await page.waitForTimeout(1000);
const emptyState = await page.locator('.quiz-empty').count();
console.log(`[无考点文章] 测验空状态: ${emptyState > 0}`);

await browser.close();
console.log(`\n控制台错误: ${errors.length}`);
if (errors.length) errors.slice(0,3).forEach(e => console.log(`  ${e}`));

const pass = pathNodes === 15 && pathEdges > 5 && recBanner > 0 && quizEntry > 0 && quizQuestions > 0 && errors.length === 0;
console.log(`\n${pass ? '✅ Phase 2 全部通过' : '❌ 有未通过项'}`);
process.exit(pass ? 0 : 1);
