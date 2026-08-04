/**
 * concept-images.js —— 抽象概念配图注入
 *
 * 动态映射系统:不硬编码图列表,而是维护 概念关键词→图片 的映射表。
 * 运行时检查图片是否存在(HEAD fetch),存在才注入。
 * 这样配图可以增量添加,不需要改代码。
 *
 * 每条映射:slug + titleKeywords + 图片文件名 + caption
 */

// 全部概念配图映射(文件名在 public/assets/concepts/ 下)
const CONCEPT_MAP = [
  // === 归一化篇 ===
  {
    slug: 'normalization',
    titleKeywords: ['协变量偏移', '内部协变量'],
    image: 'covariant-shift.webp',
    caption: '内部协变量偏移:前层参数更新导致后层输入分布漂移,归一化把分布拉回正常范围',
  },
  {
    slug: 'normalization',
    titleKeywords: ['Pre-Norm', 'Post-Norm', '架构位置'],
    image: 'pre-vs-post-norm.webp',
    caption: 'Pre-Norm vs Post-Norm:归一化放在残差连接之前还是之后,决定了训练稳定性',
  },
  {
    slug: 'normalization',
    titleKeywords: ['熵坍塌', 'QK-Norm'],
    image: 'entropy-collapse.webp',
    caption: '注意力熵坍塌:QK 值过大导致 Softmax 饱和,QK-Norm 把注意力分布压回正常',
  },

  // === Tokenizer 篇 ===
  {
    slug: 'tokenizer',
    titleKeywords: ['BPE', 'Byte-Pair', '算法核心'],
    image: 'tokenizer-bpe.webp',
    caption: 'BPE 算法:从单字符开始,反复合并最高频字符对,直到词表达到目标大小',
  },

  // === Embedding 篇 ===
  {
    slug: 'embedding-position-encoding',
    titleKeywords: ['位置编码', '旋转', 'RoPE'],
    image: 'position-encoding.webp',
    caption: '位置编码演进:从绝对位置编码到旋转位置编码(RoPE),让模型理解词的顺序',
  },

  // === KV Cache 篇 ===
  {
    slug: 'kv-cache-flash-attention',
    titleKeywords: ['KV Cache', '缓存'],
    image: 'kv-cache.webp',
    caption: 'KV Cache:缓存历史层的 Key/Value,生成新 token 时避免重复计算',
  },

  // === MoE 篇 ===
  {
    slug: 'moe',
    titleKeywords: ['路由', 'Gate', '专家'],
    image: 'moe-routing.webp',
    caption: 'MoE 专家路由:Gate 网络计算每个 token 该分给哪几个专家(Top-K)',
  },

  // === 超级拼装篇 ===
  {
    slug: 'assembly',
    titleKeywords: ['拼装', '整体', '架构', '模型骨架', '核心模块'],
    image: 'assembly.webp',
    caption: '完整架构:Embedding → N×Transformer Block → LM Head 的端到端结构',
  },

  // === Pretrain 篇 ===
  {
    slug: 'pretrain',
    titleKeywords: ['因果', '语言建模', 'CLM', '下一个', '数据管道', 'PretrainDataset', '预训练'],
    image: 'pretrain-clm.webp',
    caption: '因果语言建模:根据前文预测下一个 token,这是预训练的核心任务',
  },

  // === SFT 篇 ===
  {
    slug: 'sft',
    titleKeywords: ['数据管道', 'lm_dataset', 'Loss Mask', '掩码', 'Masking', '训练引擎'],
    image: 'sft-loss-mask.webp',
    caption: 'Loss Masking:user 部分不计入损失,只对 assistant 回复计算 loss',
  },

  // === RL 概览篇 ===
  {
    slug: 'rl-overview',
    titleKeywords: ['RLHF', '三阶段', '对齐'],
    image: 'rlhf-pipeline.webp',
    caption: 'RLHF 三阶段:SFT 监督微调 → RM 奖励模型 → PPO 强化学习',
  },

  // === DPO 篇 ===
  {
    slug: 'dpo',
    titleKeywords: ['DPO', '偏好', '对比'],
    image: 'dpo-vs-rlhf.webp',
    caption: 'DPO vs RLHF:DPO 跳过奖励模型,直接从偏好对(chosen/rejected)学习',
  },

  // === PPO 篇 ===
  {
    slug: 'ppo',
    titleKeywords: ['Actor', 'Critic', '四模型', 'PPO'],
    image: 'ppo-actor-critic.webp',
    caption: 'PPO 四模型架构:Actor(策略) + Critic(价值) + Reference(参考) + Reward(奖励)',
  },

  // === GRPO 篇 ===
  {
    slug: 'grpo',
    titleKeywords: ['GRPO', '组内', '相对', '优势', '流程', '训练流程'],
    image: 'grpo-group.webp',
    caption: 'GRPO:同一个 prompt 生成 N 个回答做组内排序,去掉 Critic 模型',
  },

  // === SPO 篇 ===
  {
    slug: 'spo',
    titleKeywords: ['SPO', '序列', '算法核心', 'ValueTracker'],
    image: 'spo-sequence.webp',
    caption: 'SPO:序列级策略优化,在整条回答层面做优化而非 token 级',
  },
];

// 缓存已确认存在的图片(避免重复 HEAD 请求)
const _existsCache = new Set();
const _checkedSlugs = new Set();

/**
 * 预检查某篇文章是否有可用配图(返回 true/false)
 */
export async function hasConceptImages(slug) {
  const concepts = CONCEPT_MAP.filter((c) => c.slug === slug);
  if (concepts.length === 0) return false;

  // 批量 HEAD 检查
  const checks = await Promise.all(
    concepts.map(async (c) => {
      if (_existsCache.has(c.image)) return true;
      try {
        const resp = await fetch(`/assets/concepts/${c.image}`, { method: 'HEAD' });
        const ct = resp.headers.get('content-type') || '';
        if (resp.ok && (ct.includes('image') || ct.includes('octet-stream'))) {
          _existsCache.add(c.image);
          return true;
        }
      } catch {}
      return false;
    })
  );
  return checks.some(Boolean);
}

/**
 * 在渲染后的文章 DOM 里注入概念配图
 * @param {HTMLElement} container - 文章正文容器(含 .markdown-body)
 * @param {string} slug - 文章 slug
 */
export async function injectConceptImages(container, slug) {
  const concepts = CONCEPT_MAP.filter((c) => c.slug === slug);
  if (concepts.length === 0) return;

  const markdownBody = container.querySelector('.markdown-body');
  if (!markdownBody) return;

  // 异步预加载所有图片
  const imageResults = await Promise.all(
    concepts.map(async (concept) => {
      if (_existsCache.has(concept.image)) return { concept, exists: true };
      try {
        const resp = await fetch(`/assets/concepts/${concept.image}`, { method: 'HEAD' });
        const ct = resp.headers.get('content-type') || '';
        const exists = resp.ok && (ct.includes('image') || ct.includes('octet-stream'));
        if (exists) _existsCache.add(concept.image);
        return { concept, exists };
      } catch {
        return { concept, exists: false };
      }
    })
  );

  const validConcepts = imageResults.filter((r) => r.exists).map((r) => r.concept);
  if (validConcepts.length === 0) return;

  const injected = new Set();

  for (const concept of validConcepts) {
    const headings = markdownBody.querySelectorAll('h2, h3');
    let targetHeading = null;

    for (const h of headings) {
      const text = h.textContent;
      if (concept.titleKeywords.some((kw) => text.includes(kw))) {
        targetHeading = h;
        break;
      }
    }

    if (!targetHeading || injected.has(concept.image)) continue;
    injected.add(concept.image);

    const figure = document.createElement('figure');
    figure.className = 'concept-image';

    const img = document.createElement('img');
    img.src = `/assets/concepts/${concept.image}`;
    img.alt = concept.caption;
    img.loading = 'lazy';

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = concept.caption;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    // 插入到该章节末尾(下一个同级/更高级标题之前)
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
  }
}
