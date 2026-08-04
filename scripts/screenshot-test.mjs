import { chromium } from 'playwright';

const BASE = 'http://localhost:5174';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// 1. 首页
await page.goto(`${BASE}/`);
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screenshots/home.png', fullPage: false });
console.log('[OK] home.png');

// 2. 首页滚动后
await page.screenshot({ path: 'screenshots/home-full.png', fullPage: true });
console.log('[OK] home-full.png');

// 3. 文章页(归一化,有公式+代码+考点)
await page.goto(`${BASE}/#/article/normalization`);
await page.waitForTimeout(3000);  // 等 KaTeX/Mermaid 加载
await page.screenshot({ path: 'screenshots/article-normalization.png', fullPage: false });
console.log('[OK] article-normalization.png');

// 4. 文章页滚动一点,看公式和代码块
await page.evaluate(() => window.scrollBy(0, 600));
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/article-normalization-scrolled.png', fullPage: false });
console.log('[OK] article-normalization-scrolled.png');

// 5. PPO 文章(最长,1175 行,测长文)
await page.goto(`${BASE}/#/article/ppo`);
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollBy(0, 400));
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/article-ppo.png', fullPage: false });
console.log('[OK] article-ppo.png');

// 6. 收集控制台错误
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

await browser.close();
console.log('\n完成。截图在 screenshots/');
if (errors.length) {
  console.log('控制台错误:', errors);
} else {
  console.log('无控制台错误');
}
