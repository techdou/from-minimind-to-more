/**
 * formula-tooltip.js —— 公式符号 hover 释义
 *
 * 归一化篇公式密集(79个 KaTeX 元素),给关键变量加 hover tooltip。
 *
 * 实现:
 * - 在 KaTeX 渲染后,扫描 .katex 元素里的变量符号
 * - 匹配预设的符号释义表,给匹配的 <annotation> 元素加 title 属性
 * - 用 CSS tooltip(不引入 JS 弹窗库)
 *
 * 覆盖的符号(归一化相关):
 * - μ/σ²: 均值/方差
 * - γ/β: 缩放/偏置参数
 * - ε: 防除零小常数
 * - x̂: 标准化后的值
 * - LN/RMSNorm: 归一化函数
 * - α: DeepNorm 缩放系数
 */

// 符号释义表(slug → 符号 → 释义)
const SYMBOL_GLOSSARY = {
  normalization: {
    'μ': '均值 (mean):所有值的平均',
    'σ': '标准差 (standard deviation):衡量数据离散程度',
    'σ²': '方差 (variance):标准差的平方',
    'γ': '缩放参数 (gain):可学习,控制归一化后的幅度',
    'β': '偏置参数 (bias):可学习,控制归一化后的中心',
    'ε': 'epsilon:微小常数(如 1e-5),防止除以零',
    'x̂': '标准化值:减均值除标准差后的结果',
    'α': 'DeepNorm 缩放系数:随层数动态调整',
    'RMS': '均方根 (root mean square):sqrt(mean(x²))',
    'Q': 'Query:注意力查询向量',
    'K': 'Key:注意力键向量',
  },
  // 其他篇章可扩展
};

/**
 * 给公式元素加 hover 释义
 */
export function enhanceFormulaTooltips(container, slug) {
  const glossary = SYMBOL_GLOSSARY[slug];
  if (!glossary) return;

  const katexElements = container.querySelectorAll('.katex');
  if (katexElements.length === 0) return;

  let enhanced = 0;

  katexElements.forEach((katex) => {
    // KaTeX 渲染的 <annotation encoding="application/x-tex"> 里有原始 LaTeX
    const annotations = katex.querySelectorAll('annotation[encoding="application/x-tex"]');
    if (annotations.length === 0) return;

    const latex = annotations[0].textContent;

    // 检查这个公式里有哪些符号
    for (const [symbol, meaning] of Object.entries(glossary)) {
      if (latex.includes(symbol) || latex.includes(`\\${symbol}`)) {
        // 在 katex 容器上加 title(简单有效)
        const currentTitle = katex.getAttribute('title') || '';
        if (!currentTitle.includes(symbol)) {
          const newTitle = currentTitle
            ? currentTitle + '\n' + `${symbol}: ${meaning}`
            : `${symbol}: ${meaning}`;
          katex.setAttribute('title', newTitle);
          katex.classList.add('formula-glossed');
          enhanced++;
        }
      }
    }
  });

  // console.debug(`[formula-tooltip] ${slug}: ${enhanced} 个符号释义已添加`);
}
