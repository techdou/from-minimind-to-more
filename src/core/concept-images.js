/**
 * concept-images.js —— 抽象概念配图注入(50+张全覆盖)
 *
 * 动态映射:每张图关联到篇章+章节标题关键词。
 * 运行时 HEAD 检查图片是否存在,存在才注入。
 */

const CONCEPT_MAP = [
  // === 基石篇 ===
  // tokenizer (5张)
  { slug: 'tokenizer', titleKeywords: ['BPE', 'Byte-Pair', '算法核心', '深度解析'], image: 'tokenizer-bpe.webp', caption: 'BPE 算法:从单字符开始,反复合并最高频字符对' },
  { slug: 'tokenizer', titleKeywords: ['WordPiece', '算法三巨头', '对比'], image: 'norm-wordpiece-vs-bpe.webp', caption: 'BPE vs WordPiece:频率驱动 vs 似然驱动' },
  { slug: 'tokenizer', titleKeywords: ['预分词', 'Pre-tokenization', 'Regex', 'GPT分词器'], image: 'norm-regex-pretoken.webp', caption: 'Regex 预分词:先把文本切成块,再对各块做 BPE' },
  { slug: 'tokenizer', titleKeywords: ['Special Token', '特殊', '工程处理'], image: 'norm-special-tokens.webp', caption: 'Special Tokens:控制符不参与 BPE 合并' },
  // embedding (4张)
  { slug: 'embedding-position-encoding', titleKeywords: ['位置编码', '绝对', '正弦', 'Position'], image: 'norm-abs-position.webp', caption: '绝对位置编码:用 sin/cos 波形编码位置信息' },
  { slug: 'embedding-position-encoding', titleKeywords: ['旋转', 'RoPE', '相对'], image: 'norm-rope-rotate.webp', caption: 'RoPE:旋转角度编码相对距离,Q·K 内积天然含位置' },
  { slug: 'embedding-position-encoding', titleKeywords: ['Embedding', '向量空间', '基石'], image: 'position-encoding.webp', caption: '位置编码演进:从绝对到旋转' },
  // minimind-design (2张)
  { slug: 'minimind-design', titleKeywords: ['整体', '架构', '设计', '配置'], image: 'norm-minimind-arch.webp', caption: 'Minimind 架构:Embedding → N×Block → LM Head' },
  { slug: 'minimind-design', titleKeywords: ['Embedding', '共享', '权重'], image: 'norm-shared-embedding.webp', caption: '共享 Embedding:输入查表和输出投影用同一套权重' },

  // === 架构篇 ===
  // normalization (5张)
  { slug: 'normalization', titleKeywords: ['协变量偏移', '内部协变量'], image: 'covariant-shift.webp', caption: '内部协变量偏移:分布漂移导致梯度爆炸/消失' },
  { slug: 'normalization', titleKeywords: ['Pre-Norm', 'Post-Norm', '架构位置'], image: 'pre-vs-post-norm.webp', caption: 'Pre-Norm vs Post-Norm:归一化位置决定稳定性' },
  { slug: 'normalization', titleKeywords: ['RMSNorm', '极简主义'], image: 'pre-vs-post-norm.webp', caption: 'RMSNorm:去掉均值偏移,只保留缩放,效率更高' },
  { slug: 'normalization', titleKeywords: ['熵坍塌', 'QK-Norm'], image: 'entropy-collapse.webp', caption: '注意力熵坍塌:QK 值过大导致 Softmax 饱和' },
  { slug: 'normalization', titleKeywords: ['Sandwich', 'NormFormer', '专用化'], image: 'entropy-collapse.webp', caption: '前沿归一化变体:进一步稳定注意力训练' },
  // kv-cache (5张)
  { slug: 'kv-cache-flash-attention', titleKeywords: ['KV Cache', '缓存'], image: 'kv-cache.webp', caption: 'KV Cache:缓存历史 K/V,避免重复计算' },
  { slug: 'kv-cache-flash-attention', titleKeywords: ['GQA', 'MQA', 'MHA', 'Grouped'], image: 'kvc-mha-gqa-mqa.webp', caption: 'MHA→GQA→MQA:逐步压缩 KV Cache 体积' },
  { slug: 'kv-cache-flash-attention', titleKeywords: ['Paged', '分页', 'vLLM'], image: 'kvc-paged.webp', caption: 'PagedAttention:按页分配 KV Cache,零浪费' },
  { slug: 'kv-cache-flash-attention', titleKeywords: ['Flash', 'IO', '分块'], image: 'kvc-flash-detail.webp', caption: 'Flash Attention:分块进 SRAM,减少 HBM 往返' },
  // moe (4张)
  { slug: 'moe', titleKeywords: ['路由', 'Gate', 'Top-K'], image: 'moe-topk-detail.webp', caption: 'Top-K 路由:Gate 决定每个 token 去哪几个专家' },
  { slug: 'moe', titleKeywords: ['负载均衡', '辅助损失', '均衡'], image: 'moe-aux-loss.webp', caption: '辅助损失:鼓励 token 均匀分配到各专家' },
  { slug: 'moe', titleKeywords: ['容量', 'Capacity', '溢出'], image: 'moe-capacity.webp', caption: '容量因子:每个专家有处理上限,溢出的 token 丢弃' },
  // assembly (3张)
  { slug: 'assembly', titleKeywords: ['残差', 'Residual'], image: 'asm-residual.webp', caption: '残差连接:输出 = x + F(x),信号跳过变换直通' },
  { slug: 'assembly', titleKeywords: ['前馈', 'FFN', 'SwiGLU', 'FeedForward'], image: 'asm-ffn-swiglu.webp', caption: 'FFN + SwiGLU:先扩大维度再门控,非线性表达更强' },
  { slug: 'assembly', titleKeywords: ['拼装', '整体', '模型骨架', '核心模块'], image: 'assembly.webp', caption: '完整 Transformer 架构:Embedding→Block→LM Head' },

  // === 算法篇 ===
  // pretrain (4张)
  { slug: 'pretrain', titleKeywords: ['因果', '语言建模', 'CLM', '预训练数据'], image: 'pretrain-clm.webp', caption: '因果语言建模:预测下一个 token' },
  { slug: 'pretrain', titleKeywords: ['梯度累加', 'accumulation'], image: 'pt-grad-accum.webp', caption: '梯度累加:小 batch 多次累加等价大 batch' },
  { slug: 'pretrain', titleKeywords: ['学习率', '调度', 'warmup', 'Cosine'], image: 'pt-cosine-lr.webp', caption: '余弦学习率调度:先升后降,平滑收敛' },
  { slug: 'pretrain', titleKeywords: ['掩码', 'Mask', '因果'], image: 'pt-causal-mask.webp', caption: '因果注意力掩码:只看过去不看未来' },
  // sft (3张)
  { slug: 'sft', titleKeywords: ['Loss Mask', '掩码', 'Masking', '训练引擎', '数据管道'], image: 'sft-loss-mask.webp', caption: 'Loss Masking:user 部分不计损失,只学 assistant' },
  { slug: 'sft', titleKeywords: ['数据', '格式', 'Chat', '模板'], image: 'sft-data-format.webp', caption: 'SFT 数据格式:指令-输入-输出三元组' },
  // rl-overview (4张)
  { slug: 'rl-overview', titleKeywords: ['RLHF', '三阶段', '对齐', 'Actor-Critic'], image: 'rl-three-stage.webp', caption: 'RLHF 三阶段:SFT→RM→PPO' },
  { slug: 'rl-overview', titleKeywords: ['TRPO', '信任区域', '信任'], image: 'rl-trpo-region.webp', caption: 'TRPO 信任区域:KL 散度有上限,保证策略更新安全' },
  { slug: 'rl-overview', titleKeywords: ['奖励黑客', 'Reward Hack'], image: 'rl-reward-hack.webp', caption: '奖励黑客:模型学会骗奖励模型' },
  // dpo (3张)
  { slug: 'dpo', titleKeywords: ['数据管道', '核心训练', '偏好', 'DPO'], image: 'dpo-vs-rlhf.webp', caption: 'DPO vs RLHF:跳过 RM 直接从偏好学' },
  { slug: 'dpo', titleKeywords: ['Bradby', 'Terry', '数学', '推导'], image: 'dpo-bt-model.webp', caption: 'Bradley-Terry 模型:偏好 = 隐含奖励的指数' },
  { slug: 'dpo', titleKeywords: ['损失', 'Loss', '交叉熵'], image: 'dpo-loss-detail.webp', caption: 'DPO 损失:本质是 chosen vs rejected 的二分类' },
  // ppo (5张)
  { slug: 'ppo', titleKeywords: ['Critic模型', 'Critic', 'Reward', 'ppo_train', '训练代码'], image: 'ppo-four-models.webp', caption: 'PPO 四模型:Actor+Critic+Reference+Reward' },
  { slug: 'ppo', titleKeywords: ['calculate_rewards', 'ppo_train_epoch', 'GAE', '优势'], image: 'ppo-gae.webp', caption: 'GAE 广义优势估计:偏差与方差的权衡' },
  { slug: 'ppo', titleKeywords: ['Clip', '裁剪', 'ratio', 'ppo_train_epoch'], image: 'ppo-clip-detail.webp', caption: 'PPO Clip:限制策略更新幅度在 [1-ε, 1+ε] 内' },
  { slug: 'ppo', titleKeywords: ['KL', '散度', '惩罚', 'Reference'], image: 'ppo-kl-penalty.webp', caption: 'KL 散度惩罚:别离 SFT 模型太远' },
  // grpo (4张)
  { slug: 'grpo', titleKeywords: ['GRPO流程', '训练流程', '核心输入', '组内', '相对'], image: 'grpo-group-detail.webp', caption: 'GRPO 组内排序:N 个回答排序定优劣,去 Critic' },
  { slug: 'grpo', titleKeywords: ['Dr.GRPO', 'DAPO', 'GSPO', '变体', '区别'], image: 'grpo-dr-detail.webp', caption: 'Dr.GRPO:修正长度偏差,防止凑字数作弊' },
  { slug: 'grpo', titleKeywords: ['DAPO', '解耦'], image: 'grpo-dapo.webp', caption: 'DAPO:解耦裁剪,释放长文本探索潜力' },
  // spo (3张)
  { slug: 'spo', titleKeywords: ['算法核心', 'ValueTracker', 'EMA', '追踪'], image: 'spo-ema-tracker.webp', caption: 'EMA 追踪器:平滑历史回报做 baseline' },
  { slug: 'spo', titleKeywords: ['序列', 'Sequence', 'token级'], image: 'spo-seq-vs-token.webp', caption: 'Token 级 vs 序列级:长链推理用序列级更稳' },

  // === 拓展篇 ===
  { slug: 'inference-training-optimization', titleKeywords: ['Prefill', 'Decode', '两阶段', '推理'], image: 'inf-two-phase.webp', caption: '推理两阶段:Prefill 计算墙 vs Decode 存储墙' },
  { slug: 'inference-training-optimization', titleKeywords: ['并行', '数据并行', '张量并行', '流水线'], image: 'inf-parallel-strategy.webp', caption: '训练并行策略:DP+TP+PP 混合使用' },
];

const _existsCache = new Set();

export async function hasConceptImages(slug) {
  const concepts = CONCEPT_MAP.filter((c) => c.slug === slug);
  if (concepts.length === 0) return false;
  const checks = await Promise.all(concepts.map(async (c) => {
    if (_existsCache.has(c.image)) return true;
    try {
      const resp = await fetch(`/assets/concepts/${c.image}`, { method: 'HEAD' });
      const ct = resp.headers.get('content-type') || '';
      if (resp.ok && !ct.includes('text/html')) { _existsCache.add(c.image); return true; }
    } catch {}
    return false;
  }));
  return checks.some(Boolean);
}

export async function injectConceptImages(container, slug) {
  const concepts = CONCEPT_MAP.filter((c) => c.slug === slug);
  if (concepts.length === 0) return;
  const markdownBody = container.querySelector('.markdown-body');
  if (!markdownBody) return;

  const imageResults = await Promise.all(concepts.map(async (concept) => {
    if (_existsCache.has(concept.image)) return { concept, exists: true };
    try {
      const resp = await fetch(`/assets/concepts/${concept.image}`, { method: 'HEAD' });
      const ct = resp.headers.get('content-type') || '';
      const exists = resp.ok && !ct.includes('text/html');
      if (exists) _existsCache.add(concept.image);
      return { concept, exists };
    } catch { return { concept, exists: false }; }
  }));

  const validConcepts = imageResults.filter((r) => r.exists).map((r) => r.concept);
  if (validConcepts.length === 0) return;

  const injected = new Set();
  for (const concept of validConcepts) {
    const headings = markdownBody.querySelectorAll('h2, h3');
    let targetHeading = null;
    for (const h of headings) {
      if (concept.titleKeywords.some((kw) => h.textContent.includes(kw))) { targetHeading = h; break; }
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

    const headingLevel = parseInt(targetHeading.tagName[1], 10);
    let next = targetHeading.nextElementSibling, insertBefore = null;
    while (next) {
      if (next.tagName.match(/^H[1-6]$/) && parseInt(next.tagName[1], 10) <= headingLevel) { insertBefore = next; break; }
      next = next.nextElementSibling;
    }
    if (insertBefore) markdownBody.insertBefore(figure, insertBefore);
    else {
      let last = targetHeading, scan = targetHeading.nextElementSibling;
      while (scan) {
        if (scan.tagName.match(/^H[1-6]$/) && parseInt(scan.tagName[1], 10) <= headingLevel) break;
        last = scan; scan = scan.nextElementSibling;
      }
      last.after(figure);
    }
  }
}
