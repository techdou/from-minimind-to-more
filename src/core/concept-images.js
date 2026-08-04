/**
 * concept-images.js —— 抽象概念配图注入
 *
 * 在文章渲染完成后,根据章节标题关键词匹配预设配图,
 * 在对应章节后插入 <figure>。
 *
 * 配图数据:每篇文章可定义一组 概念→图片 映射,
 * 通过 slug + 标题关键词匹配。
 *
 * 不修改原 md 内容,纯前端注入。
 */

// 归一化篇的配图映射
const CONCEPT_IMAGES = {
  normalization: [
    {
      titleKeywords: ['协变量偏移', '内部协变量'],
      image: '/assets/concepts/covariant-shift.webp',
      caption: '内部协变量偏移:前层参数更新导致后层输入分布漂移,归一化把分布拉回正常范围',
      afterSection: true,
    },
    {
      titleKeywords: ['Pre-Norm', 'Post-Norm', '架构位置'],
      image: '/assets/concepts/pre-vs-post-norm.webp',
      caption: 'Pre-Norm vs Post-Norm:归一化放在残差连接之前还是之后,决定了训练稳定性',
      afterSection: true,
    },
    {
      titleKeywords: ['熵坍塌', 'QK-Norm'],
      image: '/assets/concepts/entropy-collapse.webp',
      caption: '注意力熵坍塌:QK 值过大导致 Softmax 饱和,QK-Norm 把注意力分布压回正常',
      afterSection: true,
    },
  ],
};

/**
 * 在渲染后的文章 DOM 里注入概念配图
 * @param {HTMLElement} container - 文章正文容器(含 .markdown-body)
 * @param {string} slug - 文章 slug
 */
export function injectConceptImages(container, slug) {
  const concepts = CONCEPT_IMAGES[slug];
  if (!concepts || concepts.length === 0) return;

  const markdownBody = container.querySelector('.markdown-body');
  if (!markdownBody) return;

  // 记录已注入的图,避免重复
  const injected = new Set();

  for (const concept of concepts) {
    // 找匹配的标题(H2 或 H3)
    const headings = markdownBody.querySelectorAll('h2, h3');
    let targetHeading = null;

    for (const h of headings) {
      const text = h.textContent;
      if (concept.titleKeywords.some((kw) => text.includes(kw))) {
        targetHeading = h;
        break;
      }
    }

    if (!targetHeading) continue;
    if (injected.has(concept.image)) continue;
    injected.add(concept.image);

    // 创建 figure
    const figure = document.createElement('figure');
    figure.className = 'concept-image';

    const img = document.createElement('img');
    img.src = concept.image;
    img.alt = concept.caption;
    img.loading = 'lazy';

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = concept.caption;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    if (concept.afterSection) {
      // 插入到该标题所在章节的内容之后(下一个同级或更高级标题之前)
      // 简化:插到该标题的下一个兄弟标题之前,或章节末尾
      const headingLevel = parseInt(targetHeading.tagName[1], 10);
      let nextSibling = targetHeading.nextElementSibling;
      let insertBefore = null;

      while (nextSibling) {
        if (nextSibling.tagName.match(/^H[1-6]$/)) {
          const level = parseInt(nextSibling.tagName[1], 10);
          if (level <= headingLevel) {
            insertBefore = nextSibling;
            break;
          }
        }
        nextSibling = nextSibling.nextElementSibling;
      }

      if (insertBefore) {
        markdownBody.insertBefore(figure, insertBefore);
      } else {
        // 没有下一个同级标题,追加到该标题章节末尾
        // 找最后一个在该标题之后、且不是更高级标题的元素
        let lastEl = targetHeading;
        let scan = targetHeading.nextElementSibling;
        while (scan) {
          if (scan.tagName.match(/^H[1-6]$/)) {
            const level = parseInt(scan.tagName[1], 10);
            if (level <= headingLevel) break;
          }
          lastEl = scan;
          scan = scan.nextElementSibling;
        }
        lastEl.after(figure);
      }
    } else {
      targetHeading.after(figure);
    }
  }
}
