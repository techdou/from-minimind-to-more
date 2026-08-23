/**
 * card-configs.js —— 卡片式交互组件的数据配置
 *
 * 三类卡片:
 *   1. FLIP_CARDS        —— 翻转知识卡 (正面问题 / 背面答案)
 *   2. COMPARISON_CARDS  —— 对比卡片组 (左 vs 右:特征 / 优 / 缺)
 *   3. CARD_GALLERY      —— 图片画廊 (slug → 图片文件名映射,public/assets/cards/)
 *
 * 所有 key 都是文章 slug。组件侧做空数据保护,key 不存在或数组为空都不渲染。
 * 图片文件以 public/assets/cards/ 为根;运行时由 card-gallery.js 做 HEAD 校验,
 * 缺图自动跳过——所以未生成的卡片图不会破坏阅读体验。
 */

/* ------------------------------------------------------------------ *
 * 1. 翻转知识卡
 * ------------------------------------------------------------------ */
export const FLIP_CARDS = {
  tokenizer: [
    {
      front: '为什么大模型最终都选择了子词(Subword)分词?',
      back: '词级别会引发词表爆炸和 OOV;字符级别让序列长 5-10 倍,注意力 O(N²) 成本爆炸,且单字符无语义。子词"常用词完整、罕见词拆分"恰好兼顾词表大小与语义。',
      tag: 'BPE',
    },
    {
      front: 'BPE 算法的四个核心步骤?',
      back: '①初始化:文本拆为基础字节 ②统计相邻 pair 频率 ③合并最高频 pair 为新 token ④重复直到词表达上限。本质是数据压缩。',
      tag: 'BPE',
    },
    {
      front: 'GPT-4 的 Byte-level BPE 解决了什么问题?',
      back: '原 BPE 遇到未知字符会失败;Byte-level 在字节层面操作,理论上覆盖所有 Unicode,彻底消除 OOV,同时让多语言混排更稳定。',
      tag: 'BBPE',
    },
    {
      front: 'BPE 推理时为什么不能"再找最高频 pair 合并"?',
      back: '推理必须严格按训练时 merges 字典的优先级(ID 越小越早合并)执行,否则会破坏构造一致性,导致 token 序列与训练分布不符。正确做法是找当前序列中 rank 最小的 pair 先合并。',
      tag: '推理',
    },
    {
      front: 'WordPiece 用 PMI 取代频率,解决了什么问题?',
      back: 'BPE 会被 "the book" 这种偶然高频相邻骗到;PMI = P(AB)/(P(A)P(B)) 惩罚了"本就常见的词偶然相邻",更倾向合并内在关联强的词对(如 un- 前缀),语言学上更合理。',
      tag: 'WordPiece',
    },
    {
      front: '为什么 LLM 会存在"Glitch Tokens"导致乱码?',
      back: '某些词(如 Reddit 用户名)在 BPE 训练时频次高被收入词表,但后续清洗把数据删了,这些 token 的 Embedding 从未被训练过。推理时激活随机向量,导致输出崩坏。本质是数据预处理与 token 训练不对齐。',
      tag: '陷阱',
    },
      { front: 'GPT-2 和 GPT-4 分词器的主要区别?', back: 'GPT-2 用 5 万 token + 字节级 BPE,GPT-4 涨到 10 万 token + 更强的正则预分词,压缩了多语言 token 通胀。', tag: 'GPT演进' },
    { front: '什么是 Token 通胀?', back: '同样的语义,中文/日文用的 token 数远多于英文,导致推理成本更高、上下文更短。增大词表可缓解。', tag: '工程' },
    { front: 'WordPiece 和 BPE 的区别?', back: 'BPE 从字符往上合并(频率驱动);WordPiece 从字符往上合并但用似然增益选合并对象(概率驱动)。BERT 用 WordPiece。', tag: '对比' },
    { front: '为什么 GPT 用字节级 BPE?', back: '字节级保证能编码任何字符(不会 OOV),因为基础词表只有 256 个字节。代价是常见词可能被拆得更碎。', tag: '字节级' },
],

  'minimind-design': [
    {
      front: 'MiniMind 为什么用 Decoder-Only 而不是 Encoder-Decoder?',
      back: 'Decoder-Only + Causal Mask 适合 Next Token Prediction,GPT 系已证明其 Scaling 优势;实现简单、训练并行度高,与 Llama / DeepSeek 等主流大模型对齐,便于学习迁移。',
      tag: '架构',
    },
    {
      front: 'MiniMind 词表只有 6400,会不会有问题?',
      back: '6400 是为微缩模型刻意压缩的。优点:Embedding 行少、参数小、训练快;代价:单 token 承载语义多,长文本序列变长。适合教学与小规模实验,工业模型一般 32k-100k。',
      tag: '词表',
    },
    {
      front: 'num_key_value_heads=2 比 num_attention_heads=8 小,意味着什么?',
      back: '开启了 GQA(分组查询注意力),8 个 Q 头共享 2 组 KV 头(4:1)。KV Cache 显存压缩 4 倍,推理更快,质量损失极小——这是 Llama 2/3 的标准操作。',
      tag: 'GQA',
    },
      { front: 'Minimind 的模型规模有多大?', back: '约 2600 万参数,hidden=512,6 层,8 头。麻雀虽小五脏俱全,涵盖了标准 LLM 的所有核心组件。', tag: '架构' },
    { front: '为什么用共享 Embedding?', back: '输入 embedding 和输出 LM Head 共享权重,减少参数量。小模型尤其受益,大模型也有用(如 GPT-2)。', tag: '参数共享' },
    { front: 'Rotary Position Embedding 怎么工作?', back: '对 Q 和 K 做旋转变换,旋转角度与位置成正比。这样 Q·K 内积自然包含相对距离信息,不需要额外位置参数。', tag: 'RoPE' },
    { front: 'SwiGLU 激活函数是什么?', back: 'FFN 的变版:不用 ReLU,改用 SiLU 门控。SwiGLU(x) = (xW1 * SiLU(xW2)) * W3。LLaMA 等模型采用,效果优于标准 FFN。', tag: 'SwiGLU' },
],

  'embedding-position-encoding': [
    {
      front: '为什么 Embedding 之后再需要位置编码?',
      back: 'Embedding 是位置无关的:"张三打李四"和"李四打张三"在词袋视角完全一样。Transformer 的 Self-Attention 并行处理所有 token,本身没有顺序概念,必须显式注入位置信号。',
      tag: '位置编码',
    },
    {
      front: 'RoPE 为什么胜过绝对正弦位置编码?',
      back: '绝对编码只编码位置序号,外推差;RoPE 通过旋转矩阵把"相对距离"编进 Q·K 内积,既支持相对位置,又能在长文本上自然外推,是目前 Llama / DeepSeek 的标配。',
      tag: 'RoPE',
    },
    {
      front: 'YaRN 是怎么把上下文从 2k 扩到 32k 的?',
      back: 'YaRN 对 RoPE 不同频率分量做差异化缩放(高频保持、低频插值),并用温度系数调节 attention 分布,让未重训的模型也能稳定处理比训练长度长很多的输入。',
      tag: 'YaRN',
    },
      { front: '绝对位置编码为什么不行?', back: '绝对编码对训练时没见过的长度泛化差,且不同位置的绝对距离不反映语义关系。旋转编码 RoPE 用相对位置解决了这个问题。', tag: 'RoPE' },
    { front: 'RoPE 的核心思想?', back: '通过旋转矩阵让 Q·K 内积自然包含相对位置信息。不需要额外参数,且天然支持长度外推(配合 NTK/YaRN)。', tag: '旋转编码' },
    { front: 'YaRN 是什么?', back: 'RoPE 的长度外推方法:通过频率插值让模型在推理时能处理比训练时更长的序列。配合 RoPE 使用,可从 4K 扩展到 32K+。', tag: 'YaRN' },
    { front: 'Embedding 维度怎么选?', back: '太小信息瓶颈太窄;太大参数浪费+过拟合。经验:维度 ≈ 词表大小的 1/4 到 1/2。7B 模型通常用 4096 维。', tag: '维度' },
],

  normalization: [
    {
      front: '为什么 NLP 用 LN 不用 BN?',
      back: 'BN 按 batch 统计,NLP 序列变长 + batch 小,padding 和小 batch 让统计极不准;LN 只看单个样本,与 batch 大小、序列长度无关,所以是 Transformer 的天然选择。',
      tag: 'LN vs BN',
    },
    {
      front: 'Pre-Norm 和 Post-Norm 的核心差异?',
      back: 'Post-Norm(原始 Transformer)在残差之后归一化,深层不稳;Pre-Norm 在残差分支内归一化,主路信号直达,训练更稳,可堆更深。现代大模型几乎都用 Pre-Norm。',
      tag: '架构',
    },
    {
      front: 'RMSNorm 比 LayerNorm 省了什么?为什么够用?',
      back: 'RMSNorm 省掉了去均值(中心化),只算 RMS 做缩放。减一半计算,数值更稳。研究表明去均值对大模型效果影响很小,LLaMA / DeepSeek 都用 RMSNorm。',
      tag: 'RMSNorm',
    },
    {
      front: '什么是注意力熵坍塌?QK-Norm 怎么救?',
      back: '深层网络 QK 内积过大,Softmax 饱和到 one-hot,注意力熵趋近 0,梯度消失。QK-Norm 对 Q、K 各做一次归一化,把内积拉回合理范围,恢复注意力多样性。',
      tag: '前沿',
    },
      { front: 'RMSNorm 比 LayerNorm 快多少?', back: '去掉均值计算,只保留缩放。实测减少约 7-64% 的归一化计算时间,LLaMA/Gemma 等主流模型都用 RMSNorm。', tag: 'RMSNorm' },
    { front: 'DeepNorm 的核心技巧?', back: '在 Post-Norm 基础上,对残差路径乘一个大缩放系数 α,对子层输出乘小系数 β,让深层网络仍能稳定训练(可达 1000 层)。', tag: 'DeepNorm' },
    { front: 'QK-Norm 解决什么问题?', back: '深层模型中 Q·K 值爆炸导致 Softmax 饱和(熵坍塌)。对 Q 和 K 各做 RMSNorm 压缩值域,恢复注意力多样性。ViT-22B 采用。', tag: 'QK-Norm' },
    { front: 'Sandwich-Norm 是什么?', back: '在 Attention 前后各放一个 LN:输入→LN→Attention→LN→残差。像三明治夹住注意力,进一步稳定训练。', tag: '前沿' },
],

  'kv-cache-flash-attention': [
    {
      front: 'KV Cache 为什么是自回归推理的必需品?',
      back: '解码时每个新 token 都要和历史 token 算 attention。若不缓存,K/V 重算复杂度 O(t²);缓存历史 K/V 后只需算当前 token,O(t)。以空间换时间。',
      tag: 'KV Cache',
    },
    {
      front: 'MQA / GQA / MLA 在压缩什么?',
      back: '都在压缩 KV Cache:MQA 所有 Q 共享 1 组 KV(极限省);GQA 分组共享(Llama 黄金标准);MLA 用低秩潜在向量压缩,DeepSeek-V3 用,接近无损。',
      tag: '注意力变体',
    },
    {
      front: 'Flash Attention 不是在改算法,那它在改什么?',
      back: '数学完全等价。Flash Attention 是 IO-aware 的 kernel 重写:用 tiling + online softmax 让中间矩阵不落 HBM,大幅减少显存读写。长序列提速数倍。',
      tag: 'Flash Attention',
    },
      { front: 'GQA 和 MHA 的区别?', back: 'MHA 每个 head 有独立的 K/V;GQA(Grouped Query)多个 Query head 共享一组 K/V,减少 KV Cache 体积。LLaMA-2 70B 用 GQA。', tag: 'GQA' },
    { front: 'Flash Attention 优化了什么?', back: '不是减少计算量,而是减少 HBM↔SRAM 的 IO 次数。通过分块计算将 attention 的 IO 复杂度从 O(N²) 降到 O(N²/M),M 是 SRAM 大小。', tag: 'Flash Attn' },
    { front: 'KV Cache 占多少显存?', back: '正比于 layers × heads × dim × seq_len × batch。7B 模型 4K 上下文约需 1-2GB KV Cache,32K 时暴涨到 10+GB。这是长文本推理的瓶颈。', tag: '显存' },
    { front: 'PagedAttention 优化了什么?', back: '把 KV Cache 按页分配(类似 OS 虚拟内存),避免固定预分配浪费。vLLM 的核心技术,提升吞吐 2-4 倍。', tag: 'PagedAttn' },
],

  moe: [
    {
      front: 'MoE 如何做到"参数大、计算少"?',
      back: '稀疏激活:总参数=N 个专家,每个 token 只经 Top-K 个(K≪N)。计算量只与激活参数成正比,而知识容量由总参数决定。DeepSeek-V3:671B 总参 / 37B 激活。',
      tag: '稀疏激活',
    },
    {
      front: 'DeepSeekMoE 为什么要加"共享专家"?',
      back: '共享专家对所有 token 都激活,负责"通用知识";路由专家专精细分领域。这样避免通用能力被重复存到多个路由专家里,提升参数效率。',
      tag: '架构',
    },
    {
      front: 'MoE 训练为什么必须加辅助损失(Aux Loss)?',
      back: '不加约束的话 Router 会坍塌:总往少数专家投,其余专家收不到梯度饿死。Aux Loss 强制负载均衡,让所有专家都被训练。DeepSeek 还提出无辅助损失的偏置项方案。',
      tag: '负载均衡',
    },
    {
      front: 'SwiGLU 为什么胜过 ReLU+FFN?',
      back: 'SwiGLU = Swish 门控线性单元,引入门控分支让网络自适应选择信息,梯度更好、表达更强,Llama / Mistral / MoE 普遍采用。代价是多一个投影矩阵。',
      tag: 'SwiGLU',
    },
      { front: 'MoE 为什么需要负载均衡?', back: '不加约束时 Gate 会塌缩到少数专家(赢者通吃),其他专家不更新。加辅助损失鼓励 token 均匀分配到各专家。', tag: '负载均衡' },
    { front: 'Top-K=2 是什么意思?', back: '每个 token 只激活 2 个专家(通常),其他专家不参与计算。这就是稀疏激活——总参数多但每次计算量小。', tag: 'Top-K' },
    { front: 'MoE 的 expert 数量怎么选?', back: '通常 8-64 个专家,激活 2-8 个。专家太少接近 dense 模型;太多路由稀疏+通信开销大。Mixtral 用 8 expert top-2。', tag: '配置' },
    { front: 'MoE 训练和推理的计算量有何不同?', back: '训练用所有专家(但每个 token 只激活 top-k);推理时可以只加载激活的专家(节省显存)。总参数大但单次计算量小。', tag: '稀疏' },
],

  assembly: [
    {
      front: '一个 Transformer Block 的数据流?',
      back: 'x → RMSNorm → Attention → +残差 → RMSNorm → FFN/MoE → +残差 → 输出。Pre-Norm 设计让主路信号不被归一化截断,可堆很深。',
      tag: 'Block',
    },
    {
      front: 'Weight Tying 是什么?为什么要做?',
      back: '输入端 embed_tokens 与输出端 lm_head 共享同一权重矩阵。词表大时能省可观参数,且语义上"embedding 相似度"和"预测概率"是同一件事的两侧,Llama / MiniMind 都用。',
      tag: '权重共享',
    },
    {
      front: 'MiniMind 是怎么从 Dense 切到 MoE 的?',
      back: '同一个 MiniMindBlock,把 FeedForward(SwiGLU) 换成 MOEFeedForward:共享专家 + Top-K 路由专家。配置一个 use_moe 开关即可切换,其他层共用。',
      tag: 'MoE 集成',
    },
      { front: '残差连接的作用是什么?', back: '让信号可以跳过变换层直接传播,缓解梯度消失。深层网络没有残差几乎无法训练,这是 ResNet 的核心发现。', tag: '残差' },
    { front: '一个 Transformer Block 包含哪些组件?', back: '输入→LayerNorm→Attention→残差连接→LayerNorm→FFN→残差连接→输出。注意力和前馈网络各有一个残差。', tag: 'Block' },
    { front: 'Attention 的复杂度是多少?', back: 'O(N² × d),N 是序列长度。这是长文本的瓶颈:4K→32K 计算量增 64 倍。Flash Attention 通过减少 IO 缓解。', tag: '复杂度' },
    { front: '为什么 FFN 中间层通常更大?', back: '标准 FFN:dim → 4×dim → dim。中间层扩大 4 倍增加非线性表达能力。这是模型参数量的主要来源。', tag: 'FFN' },
],

  pretrain: [
    {
      front: 'Causal LM 的标签是怎么构造的?',
      back: '输入 ids 右移一位作为 labels(或等价地用 mask 掩掉未来位置)。预测第 t 个 token 时只看 1..t-1,pad 位置 label 设 -100 让 loss 忽略。',
      tag: 'CLM',
    },
    {
      front: 'MiniMind 的 pretrain_hq 实际是 QA 数据,为什么?',
      back: '这叫 Instruction Pre-training / 用对话做 Continued Pretrain。目的是让模型在大规模阶段就熟悉 <im_end> 等特殊符号和"问-答"文本分布,降低后续 SFT 的迁移成本。',
      tag: '数据',
    },
    {
      front: '为什么 PretrainDataset 把 label 的 pad 设成 -100?',
      back: 'PyTorch CrossEntropyLoss 默认忽略 index=-100。pad 部分本身没有真实语义,不该参与 loss,否则模型会去"学"如何生成 pad。',
      tag: 'Loss Mask',
    },
      { front: '梯度累加为什么有效?', back: '小 batch 时多次前向传播累加梯度,达到等价大 batch 的效果。Loss 要除以累加步数归一化,否则梯度会放大。', tag: '梯度累加' },
    { front: '预训练为什么要用因果注意力?', back: '预测下一个 token 时不能看到未来 token。因果注意力用下三角 mask 遮蔽未来,让位置 i 只能看到 ≤i 的位置。', tag: '因果Mask' },
    { front: '预训练数据越多越好吗?', back: '不是。数据质量比数量重要。重复数据会降低泛化;低质量数据(乱码/广告)会污染模型。Chinchilla 定律:参数和数据应等比增长。', tag: '数据' },
    { front: '学习率调度器怎么选?', back: '主流是 Cosine Decay:warmup 到峰值,然后按余弦曲线衰减到接近 0。简单有效,GPT/LLaMA 等都用这个。', tag: '调度' },
],

  sft: [
    {
      front: 'SFT 和 Pretrain 的核心区别在哪?',
      back: '目标都是 CrossEntropy,但 SFT 用的是 instruction 数据,且只对 assistant 回复计算 loss(user 部分通过 mask 屏蔽)。模型从"续写"转向"听指令回答"。',
      tag: 'SFT',
    },
    {
      front: '多轮对话的 Loss Masking 怎么做?',
      back: '把整段对话拼成一个序列;扫描每个 token,只有当它落在 assistant 回复区间内才设真实 label,其他(user / system / 特殊符)全部 -100。MiniMind 用 bos/eos 特征串定位回复边界。',
      tag: 'Mask',
    },
    {
      front: '梯度累加时为什么要 loss / accumulation_steps?',
      back: '反向传播是累加的,等于把一个"逻辑大 batch"拆成多个 micro-step。不除以累加步数,梯度会成倍放大,等价于用了更大的学习率,极易发散。',
      tag: '工程',
    },
    {
      front: '梯度裁剪在防什么?',
      back: '防止梯度爆炸(Exploding Gradient)。当梯度范数超过阈值(常见 1.0)时按比例缩回。深层网络 + 大 LR 时几乎是必需的安全阀。',
      tag: '工程',
    },
      { front: 'Chat Template 的作用?', back: '规定 user/assistant 的对话格式,让模型学会区分角色边界。不同模型用不同模板(如 ChatML/LLaMA格式),不能混用。', tag: '模板' },
    { front: 'SFT 和 Pretrain 的训练有什么区别?', back: 'Pretrain 对所有 token 计算 loss;SFT 只对 assistant 回复部分计算 loss(user 部分被 mask)。其余训练机制相同。', tag: '训练差异' },
    { front: 'SFT 需要多少数据?', back: '通常 1-10 万条高质量对话。少而精比多而杂好——LIMA 论文证明 1000 条精选数据就能微调出好效果。', tag: '数据量' },
    { front: 'Epoch 设多少合适?', back: 'SFT 通常 2-5 个 epoch。太多 epoch 过拟合(模型死记训练对话);太少欠拟合。用验证集监控。', tag: 'Epoch' },
],

  'rl-overview': [
    {
      front: 'RLHF 三阶段是哪三阶段?',
      back: '①SFT:监督微调让模型会回答 ②RM:训练奖励模型给回答打分 ③PPO:用 RM 的分数做强化学习,让策略对齐人类偏好。DeepSeek 之后常被 DPO/GRPO 替代后两步。',
      tag: 'RLHF',
    },
    {
      front: 'TRPO 为什么演进到了 PPO?',
      back: 'TRPO 用 KL 约束 + 共轭梯度求 Hessian 近似,计算极重。PPO 把"硬约束"改成"概率比 clipping"(ε 截断),二阶近似变一阶,工程友好、稳定、快,成为工业标准。',
      tag: 'TRPO→PPO',
    },
    {
      front: 'DPO / IPO / KTO / ORPO 共同点是什么?',
      back: '都是 RL-Free:不训 RM、不做采样,直接从偏好对(chosen/rejected)用闭式损失微调策略,把 RLHF 简化为监督学习,显存和稳定性大幅改善。',
      tag: 'RL-Free',
    },
      { front: 'TRPO 和 PPO 的核心区别?', back: 'TRPO 用 KL 散度硬约束更新幅度(需解二次规划),计算复杂;PPO 用 clip 软约束,简单高效。两者都是信任区域方法。', tag: 'TRPO' },
    { front: 'RLHF 为什么需要三个阶段?', back: 'SFT 教格式→RM 学人类偏好→PPO 按偏好优化。每阶段解决不同问题:不能跳,顺序也不能换。', tag: '三阶段' },
    { front: '什么是奖励黑客(Reward Hacking)?', back: '模型学会骗奖励模型:生成看起来好但实际差的内容(如凑字数、重复讨好)。这是 RLHF 的核心风险,需要 KL 约束+人工抽检。', tag: '风险' },
    { front: 'RLAIF 和 RLHF 的区别?', back: 'RLHF 用人类标注偏好;RLAIF 用 AI 模型替代人类做偏好判断。成本更低但可能有偏差。Constitutional AI 就是 RLAIF。', tag: 'RLAIF' },
],

  dpo: [
    {
      front: 'DPO 的核心损失在做什么?',
      back: '最大化 log(π(chosen)/π_ref(chosen)) - log(π(rejected)/π_ref(rejected))。本质是让策略相对参考模型,在 chosen 上提升、在 rejected 上下降——一个对比损失。',
      tag: 'DPO Loss',
    },
    {
      front: '为什么说 DPO "跳过了奖励模型"?',
      back: '理论上 DPO 损失可重写为 Bradley-Terry reward 形式,reward 由 π 和 π_ref 的对数比隐式给出。所以不必显式训 RM,直接用偏好对训策略即可。',
      tag: '隐式奖励',
    },
    {
      front: 'DPO 数据为什么要保证 chosen 和 rejected 的 user 完全一致?',
      back: 'DPO 比较的是"同一问题下两个回答的好坏"。若 user 不同,差异来自问题而非回答质量,模型会学到错误信号。所以预处理必须严格对齐 prompt。',
      tag: '数据',
    },
      { front: 'DPO 的 Bradley-Terry 假设是什么?', back: '假设人类偏好可以用一个隐含的奖励函数建模,且 chosen 被选中的概率正比于 exp(reward)。DPO 据此推导出直接从偏好对学习的公式。', tag: '数学' },
    { front: 'DPO 对数据有什么特殊要求?', back: '需要偏好对:同一个 prompt 的两个回答(chosen=好的,rejected=差的)。标注者只需做相对比较,不需要绝对评分。', tag: '数据' },
    { front: 'DPO 训练用什么学习率?', back: '通常比 SFT 小一个量级:1e-6 到 5e-7。因为 DPO 直接调整策略,学习率太大会破坏 SFT 学到的能力。', tag: '超参' },
    { front: 'IPO 和 DPO 有什么区别?', back: 'IPO 是 DPO 的变体,加了一个正则项防止过拟合偏好数据。当偏好数据少或有噪声时 IPO 更稳。', tag: '变体' },
],

  ppo: [
    {
      front: 'PPO 在大模型里为什么要四个模型?',
      back: '①Actor 策略 ②Critic 估值 ③Reference 冻结参考(KL 约束) ④Reward 奖励。Actor 用 RM 打分、用 Critic 算优势、用 Reference 防漂移,缺一不可。显存瓶颈由此而来。',
      tag: '四模型',
    },
    {
      front: 'PPO 的优势函数(Advantage)是怎么算的?',
      back: 'A_t = GAE:用 Critic 估值 V(s) 作 baseline,把 reward 减 V 得到 TD 误差,再做指数加权累计。A>0 说明比预期好,应增概率;A<0 反之。',
      tag: 'GAE',
    },
    {
      front: 'PPO 为什么要 clip 概率比?',
      back: 'ratio = π_new/π_old 太大会让策略突变崩溃。PPO 把 ratio 截断到 [1-ε, 1+ε](ε≈0.1~0.2),保证单步更新不偏离太远,这就是"近端"的含义。',
      tag: 'Clip',
    },
    {
      front: '为什么 PPO 要加 KL 惩罚(让 Actor 别离 Reference 太远)?',
      back: '不约束的话 Actor 会"reward hacking"——找到 RM 漏洞刷分,产生无意义高奖励文本。KL 项把策略拉回参考模型附近,保留 SFT 学到的语言能力。',
      tag: 'KL',
    },
      { front: 'PPO 为什么需要 Reference 模型?', back: '防止 Actor 偏离 SFT 模型太远(奖励黑客)。用 Reference 计算当前策略与初始策略的 KL 散度,作为惩罚项。', tag: 'Reference' },
    { front: 'GAE(广义优势估计)的作用?', back: '平衡偏差和方差:用 Critic 的价值估计做 bias-corrected 的多步回报。λ 参数控制偏差-方差权衡,通常取 0.95。', tag: 'GAE' },
    { front: 'PPO 训练为什么不稳定?', back: '四个模型交互 + 奖励信号稀疏 + clip 超参敏感。常见症状:奖励上升但生成质量下降(奖励黑客),或 KL 爆炸(策略跑飞)。', tag: '不稳定' },
    { front: 'PPO 的 KL 系数怎么调?', back: '初始 0.05-0.2,训练中动态调整:KL 太大就增系数,太小就减。自适应 KL 控制器比固定值更稳。', tag: 'KL' },
],

  grpo: [
    {
      front: 'GRPO 相对 PPO 最大的改动是什么?',
      back: '去掉 Critic。给同一 prompt 采样 G 个回答,用组内均值标准差做 baseline: A_i = (r_i - μ) / σ。省一个 Critic 模型,显存大幅下降,推理/数学等有客观分的任务效果更好。',
      tag: 'GRPO',
    },
    {
      front: '为什么标准 GRPO 会让模型越答越长?',
      back: '长度偏置:长答案通常步骤全、得分高,优势为正,于是策略偏好变长;即使答错,长答案的负优势绝对值也常被 KL 稀释。Dr.GRPO / DAPO 通过去 length norm / 解耦 clip 修正。',
      tag: '长度偏置',
    },
    {
      front: '没有 PRM,长 CoT 中怎么做信用分配?',
      back: '纯 ORM(只看最终对错)信号稀疏,长链中间步骤几乎收不到梯度。GTPO / GRPO 变体用策略熵或 token 级权重做软分配;真正彻底的解法是 PRM(过程奖励)或 STaR 类自举。',
      tag: '信用分配',
    },
    {
      front: '什么是"左脚踩右脚起飞"(推理冷启动)?',
      back: '用高质量长 CoT 数据先做 SFT,让模型获得初步推理能力;再用 GRPO 在此基础上自采样、自校验、持续滚雪球。R1 / QwQ 这类推理模型靠这种 bootstrapping 不断自我提升。',
      tag: '冷启动',
    },
      { front: 'GRPO 省了哪个模型?', back: '省掉 Critic(价值网络)。用同一个 prompt 的 N 个回答的组内平均回报作为 baseline 代替 Critic 的价值估计。', tag: '去Critic' },
    { front: 'Dr.GRPO 改进了什么?', back: '修正了标准 GRPO 的长度偏差(除以 token 数)和基线偏差,防止模型靠凑字数作弊。DeepSeek-R1 用的是 Dr.GRPO。', tag: 'Dr.GRPO' },
    { front: 'GRPO 的 group size N 怎么选?', back: '通常 4-16。太小方差大(排序不稳定);太大计算成本高。DeepSeek-R1 用 N=8。可以混用不同 N 的结果。', tag: 'N值' },
    { front: 'DAPO 改进了 GRPO 什么?', back: '解耦 clip:对正/负优势用不同的 clip 范围,释放长文本的探索潜力。解决了 GRPO 在长思维链中策略坍塌的问题。', tag: 'DAPO' },
],

  spo: [
    {
      front: 'SPO 想同时解决 PPO/GRPO 的什么痛点?',
      back: 'PPO 显存重(要 Critic),GRPO 算力重(要采样 G 个)。SPO 既不用 Critic,又只采样 1 个回答,用一个数学维护的"历史平均分"做 baseline,兼得二者好处。',
      tag: 'SPO',
    },
    {
      front: 'AutoAdaptiveValueTracker 在做什么?',
      back: '一个 Beta 分布参数化的指数移动平均(EMA),记录历史 reward 作为 baseline。新 reward 与 baseline 比,高则鼓励、低则抑制。无需神经网络参数,纯数学量。',
      tag: 'ValueTracker',
    },
    {
      front: 'SPO 里的动态 KL 半衰期(D_half)是干嘛的?',
      back: '当策略概率偏移(KL)增大,rho(历史权重)按 2^(-KL/D_half) 衰减:偏移越大,历史越快失效,baseline 快速跟进当前策略。是一种自适应"踩刹车"机制,防策略突变。',
      tag: '动态衰减',
    },
      { front: 'SPO 和 GRPO 的核心区别?', back: 'GRPO 在 token 级做优势估计;SPO 在序列级(整条回答)做。SPO 用 EMA 追踪器动态估计序列级价值,更适合长思维链。', tag: '序列级' },
    { front: 'SPO 为什么要用 EMA 追踪器?', back: '长回答的奖励信号稀疏,EMA(指数移动平均)平滑历史回报作为 baseline,比简单均值更稳定,减少方差。', tag: 'EMA' },
    { front: 'SPO 的 EMA 衰减率怎么选?', back: '通常 0.9-0.99。衰减率越大 baseline 更新越慢越稳;越小跟踪越快但噪声大。长思维链用较大值(0.99)。', tag: 'EMA' },
    { front: 'SPO 适合什么场景?', back: '长思维链(Long CoT)推理任务,如数学/代码。token 级的 GRPO 在长序列上方差爆炸,SPO 序列级更稳。', tag: '场景' },
],

  'interview-100': [
    {
      front: '为什么 Self-Attention 要除以 √d_k?',
      back: 'Q·K 的方差随 d_k 线性增长,不缩放会让内积数值远大于 1,Softmax 进入饱和区,梯度消失。除以 √d_k 把方差拉回 1,保持梯度健康。',
      tag: 'Attention',
    },
    {
      front: '为什么现代 LLM 几乎都是 Decoder-Only?',
      back: '①Scaling Law 上 Decoder-Only 表现最好 ②生成任务天然适配 ③实现简单、可堆叠 ④KV Cache 等推理优化成熟。Encoder-Decoder 在通用 LLM 上已少见。',
      tag: '架构',
    },
    {
      front: '残差连接如果去掉,深层网络会怎样?',
      back: '梯度消失/爆炸:反向链路没有"高速通道",深层的梯度会被反复乘小/大的权重压缩或放大。ResNet / Transformer 靠残差让信号直达,是堆深的关键。',
      tag: '残差',
    },
      { front: '大模型面试最常考的算法是什么?', back: 'Transformer 架构(必考)+ 注意力机制计算细节 + LayerNorm/RMSNorm 区别。算法岗会深入到 PPO/GRPO 的推导。', tag: '高频' },
    { front: '面试时怎么讲项目经验?', back: 'STAR 法则:Situation(场景)→Task(任务)→Action(你做了什么)→Result(效果)。量化结果(如提升 X% / 降低 Y ms)。', tag: '技巧' },
    { front: 'Transformer 面试常被问什么?', back: 'Top 3:①Self-Attention 的计算流程 ②Multi-Head 为什么有效 ③位置编码的种类和区别。能推导 QKV 公式是加分项。', tag: 'Transformer' },
    { front: '怎么准备大模型项目面试?', back: '准备 2-3 个深度项目:说清你解决了什么问题、用了什么方法、效果如何。能画出架构图/数据流图,能回答细节追问。', tag: '项目' },
],

  'inference-training-optimization': [
    {
      front: '推理时为什么 Prefill 算力受限、Decode 显存受限?',
      back: 'Prefill 一次性并行算全部 prompt token,大矩阵乘法算术强度高,吃满 Tensor Core;Decode 每步只算 1 个 token,要加载全部权重,算术强度极低,卡在显存带宽。',
      tag: 'Prefill/Decode',
    },
    {
      front: 'PagedAttention 解决的是显存的什么问题?',
      back: '传统 KV Cache 按最大长度预分配,内部碎片严重。PagedAttention 借鉴 OS 虚拟内存,把 KV 切成固定大小 block,按需分配、共享、回收,显存利用率大幅提升(vLLM 核心技术)。',
      tag: '显存',
    },
    {
      front: 'Continuous Batching 比静态 Batching 强在哪?',
      back: '静态 batch 里短请求完成后要等长请求,空槽浪费。Continuous Batching 在 token 粒度动态插入/弹出请求,每步都把 batch 填满,吞吐成倍提升。',
      tag: '调度',
    },
    {
      front: 'Speculative Decoding 为什么能加速?',
      back: '用小模型(draft)快速草拟几个 token,大模型(target)一次批量验证。命中的直接采纳,等于让大模型一次前向"输出多个 token"。前提:两模型分布相近,且小模型很快。',
      tag: '投机解码',
    },
      { front: 'Prefill 和 Decode 的瓶颈有何不同?', back: 'Prefill 并行处理输入,瓶颈是计算墙(GFLOPS);Decode 逐个生成,瓶颈是存储墙(HBM 带宽)。', tag: '两阶段' },
    { front: 'INT8 量化会损失多少精度?', back: '通常几乎无损(Perplexity 增加 <1%)。INT4 在 7B 以上模型也基本可用。模型越大,量化越安全。', tag: '量化' },
    { front: '张量并行(TP)怎么切?', back: '把权重矩阵按列或行切分到多张卡,每卡算一部分,再 AllReduce 合并。切分粒度是矩阵维度。适合大单层(如 7B 的 FFN)。', tag: 'TP' },
    { front: 'Pipeline 并行的气泡是什么?', back: '前一层在等后一层计算时 GPU 空闲(气泡)。micro-batch 越多气泡越小。GPipe/Megatron 的核心优化方向。', tag: 'Pipeline' },
],
};

/* ------------------------------------------------------------------ *
 * 2. 对比卡片组
 * ------------------------------------------------------------------ */
export const COMPARISON_CARDS = {
  tokenizer: {
    left: {
      title: 'Word-level',
      subtitle: '词级别',
      features: ['以空格 / 标点切分', '保留完整语义', '词表巨大(>百万)'],
      pros: '最贴近人类直觉,语义完整,易理解。',
      cons: 'OOV 严重、词表爆炸、形态变化无能为力,几乎无法用于大模型。',
    },
    right: {
      title: 'Subword (BPE)',
      subtitle: '子词级别',
      features: ['常用词保留', '罕见词拆为词根+词缀', '词表数万即可'],
      pros: '兼顾覆盖率与词表大小,无 OOV,GPT / Llama 通用方案。',
      cons: '需要训练 tokenizer,长尾拆分不一定符合语义,对代码缩进敏感。',
    },
  },

  'embedding-position-encoding': {
    left: {
      title: '绝对位置编码 (APE)',
      subtitle: 'Sinusoidal / Learned',
      features: ['每个位置一个固定向量', '直接加到 embedding 上', '外推能力差'],
      pros: '实现简单,原版 Transformer 即用。',
      cons: '只编码"位置序号",训练长度外的位置完全陌生,长文本外推差。',
    },
    right: {
      title: '旋转位置编码 (RoPE)',
      subtitle: 'Rotary',
      features: ['旋转矩阵作用于 Q/K', '内积自动编码相对距离', '天然支持外推 + YaRN'],
      pros: '相对位置、长文本友好,Llama / DeepSeek 标配。',
      cons: '实现稍复杂,需要频率分量的精细处理(yarn、ntk 等)。',
    },
  },

  normalization: {
    left: {
      title: 'Pre-Norm',
      subtitle: '残差分支内归一化',
      features: ['Norm 在 attention / FFN 内部', '主路残差直通', '训练更稳、可堆更深'],
      pros: '深层网络稳定,Llama / GPT-2 系主流选择。',
      cons: '理论上"有效深度"略浅,某些场景收敛稍慢。',
    },
    right: {
      title: 'Post-Norm',
      subtitle: '残差之后归一化',
      features: ['Norm 在残差相加之后', '原版 Transformer 用', '深层训练不稳'],
      pros: '有效深度足,小模型 / 浅层效果略好。',
      cons: '深层容易发散,需要 warmup + 细心调参,大模型基本弃用。',
    },
  },

  'kv-cache-flash-attention': {
    left: {
      title: 'MHA',
      subtitle: 'Multi-Head',
      features: ['Q/K/V 头数相同', '每头独立 KV', 'KV Cache 最大'],
      pros: '表达力最强,信息无损。',
      cons: 'KV Cache 显存爆炸,长序列 + 大 batch 极易 OOM。',
    },
    right: {
      title: 'MQA / GQA',
      subtitle: 'Query 多 / KV 少',
      features: ['所有/分组 Q 共享 KV 头', 'KV Cache 大幅压缩', 'Llama 系标准'],
      pros: '显存和带宽大幅下降,吞吐显著提升。',
      cons: 'MQA 质量损失明显;GQA 是质量与效率的折中。',
    },
  },

  moe: {
    left: {
      title: 'Dense FFN',
      subtitle: '稠密前馈',
      features: ['所有 token 经过同一 FFN', '参数量 = 计算量', '实现简单'],
      pros: '训练稳定,无路由/负载均衡问题,小模型首选。',
      cons: '参数上限受算力约束,无法"以小博大"。',
    },
    right: {
      title: 'MoE',
      subtitle: '稀疏专家',
      features: ['Top-K 路由激活', '总参数 ≫ 激活参数', '可加共享专家'],
      pros: '同样算力下知识容量数倍提升,DeepSeek-V3:671B/37B。',
      cons: '显存饥渴、训练复杂、需负载均衡,端侧部署难。',
    },
  },

  pretrain: {
    left: {
      title: '纯文本 Pretrain',
      subtitle: '维基 / 书籍',
      features: ['长文连续语料', '学语言模型本身', 'CLM 目标'],
      pros: '世界知识丰富,通用语言能力强。',
      cons: '不会"对话",<im_end> 等特殊符号陌生,SFT 迁移成本高。',
    },
    right: {
      title: 'Instruction Pretrain',
      subtitle: 'MiniMind 风格',
      features: ['QA 对话当预训练语料', '不 mask 任何部分', '提前熟悉对话符号'],
      pros: '后续 SFT 更平滑,对话分布提前内化。',
      cons: '知识广度不如纯文本,需配合大量通用语料。',
    },
  },

  sft: {
    left: {
      title: 'Pretrain Loss',
      subtitle: '全 token 算',
      features: ['labels = input 右移', '所有 token 都算 loss', 'pad 设 -100'],
      pros: '最大化信号密度,小模型也能学好语言模型本身。',
      cons: '只会"续写",不听指令。',
    },
    right: {
      title: 'SFT Loss Mask',
      subtitle: '只算 assistant',
      features: ['user / system 部分 mask 掉', '只对回复算 loss', '多轮要扫边界'],
      pros: '从"续写"转向"对话",学的是回答行为。',
      cons: '有效信号 token 减少,需要更多对话数据。',
    },
  },

  'rl-overview': {
    left: {
      title: 'PPO (RL)',
      subtitle: '显式 RL',
      features: ['Actor + Critic + Ref + Reward', '在线采样', 'GAE 优势 + ratio clip'],
      pros: '奖励信号灵活,适合连续优化,理论成熟。',
      cons: '四模型显存巨大,训练不稳定,工程门槛高。',
    },
    right: {
      title: 'DPO (RL-Free)',
      subtitle: '偏好监督',
      features: ['只需 chosen / rejected 对', '闭式损失,无 RM', '本质是监督学习'],
      pros: '工程极简,稳定,显存小,流行对齐方案。',
      cons: '依赖偏好数据质量,缺乏在线探索,上限受限。',
    },
  },

  dpo: {
    left: {
      title: 'RLHF (PPO)',
      subtitle: '显式奖励',
      features: ['先训 RM', '再用 RM 信号 PPO', 'KL 约束防漂移'],
      pros: '在线优化,理论上限高,适合连续学习。',
      cons: '四模型显存爆炸,RM 易被 hacking,工程复杂。',
    },
    right: {
      title: 'DPO',
      subtitle: '隐式奖励',
      features: ['跳过 RM', '直接从偏好对学', '损失有闭式解'],
      pros: '省一个 RM,稳定简单,几乎等同监督学习。',
      cons: '离线学习无探索,极度依赖偏好数据质量。',
    },
  },

  ppo: {
    left: {
      title: 'Actor',
      subtitle: '策略网络 π',
      features: ['当前训练的策略', '生成回答', '通过 ratio 更新'],
      pros: '直接对齐目标,学的是"怎么回答"。',
      cons: '容易 reward hacking,需要 Reference 拉住。',
    },
    right: {
      title: 'Critic',
      subtitle: '价值网络 V',
      features: ['预测状态价值', '给 Actor 做 baseline', '算 GAE 优势'],
      pros: '降低策略梯度方差,稳定训练。',
      cons: '占一个完整模型显存;长序列估值难,GRPO 直接砍掉。',
    },
  },

  grpo: {
    left: {
      title: 'PPO',
      subtitle: '绝对优势',
      features: ['Critic 估 V(s)', 'A = GAE(奖励 - V)', '4 模型'],
      pros: '成熟,信号密,通用任务表现稳定。',
      cons: '显存巨大,Critic 训练难,工程复杂。',
    },
    right: {
      title: 'GRPO',
      subtitle: '组内相对',
      features: ['同 prompt 采样 G 个', 'A_i = (r_i - μ) / σ', '3 模型(无 Critic)'],
      pros: '省 Critic,数学/代码等客观分任务效果尤其好,DeepSeek 主力。',
      cons: '采样 G 倍算力,长度偏置,长 CoT 信用分配难。',
    },
  },

  spo: {
    left: {
      title: 'GRPO',
      subtitle: '组采样',
      features: ['同 prompt 采样 G 个', '组内均值/方差做 baseline', '无 Critic'],
      pros: 'baseline 来自真实样本,信号准。',
      cons: 'G 倍推理开销,显存虽省但算力贵。',
    },
    right: {
      title: 'SPO',
      subtitle: '单采样 + EMA',
      features: ['每个 prompt 只采样 1 个', 'EMA 维护历史平均分', '动态 KL 半衰期'],
      pros: '同时省 Critic 和采样开销,极轻量。',
      cons: 'baseline 是统计量而非样本,信号方差较大,需自适应机制。',
    },
  },

  'inference-training-optimization': {
    left: {
      title: 'Static Batching',
      subtitle: '静态批',
      features: ['一次凑满 batch', '所有序列等长才高效', '需要 padding'],
      pros: '实现简单,GEMM 高效。',
      cons: 'padding 浪费严重,短请求等长请求,吞吐低。',
    },
    right: {
      title: 'Continuous Batching',
      subtitle: '连续批',
      features: ['token 级动态调度', '完成即弹出,空槽即填', '配合 PagedAttention'],
      pros: '吞吐数倍提升,vLLM / TGI 标配。',
      cons: '调度器复杂,对 attention kernel 要求高。',
    },
  },
  'minimind-design': {
    left: { title: '小模型(Minimind)', subtitle: '2600万参数', features: ['hidden=512, 6层, 8头', '单卡可训练', '适合学习原理'], pros: '快速迭代,资源需求低,适合教学。', cons: '能力有限,无法做复杂推理。' },
    right: { title: '大模型(LLaMA-3)', subtitle: '700亿参数', features: ['hidden=8192, 80层, 64头', '多卡集群训练', 'GQA + RoPE + RMSNorm'], pros: '能力强,泛化好,接近 GPT-4 水平。', cons: '训练成本极高,需要工程团队。' },
  },
  'assembly': {
    left: { title: '标准 MHA', subtitle: '多头注意力', features: ['每个 head 独立 Q/K/V', 'KV Cache 体积 = heads × dim', '所有大模型标配(早期)'], pros: '表达能力强,每个 head 学不同模式。', cons: 'KV Cache 大,推理慢。' },
    right: { title: 'GQA/MQA', subtitle: '分组/多查询注意力', features: ['多 Query head 共享 K/V', 'KV Cache 体积大幅缩小', 'LLaMA-2 70B 等采用'], pros: '推理更快,显存更省,效果接近 MHA。', cons: 'head 数太少时效果可能下降。' },
  },
  'interview-100': {
    left: { title: '算法岗', subtitle: '研究/算法', features: ['深入理解训练算法', '能推导 PPO/GRPO', '论文阅读能力'], pros: '技术壁垒高,薪资天花板高。', cons: '岗位少,竞争激烈,博士优先。' },
    right: { title: '工程岗', subtitle: '落地/部署', features: ['模型部署和推理优化', '分布式训练工程', '熟悉 vLLM/TensorRT'], pros: '岗位多,需求大,不限学历。', cons: '技术迭代快,需要持续学习。' },
  },
};

/* ------------------------------------------------------------------ *
 * 3. 知识卡片画廊
 *
 * 卡片图位于 public/assets/cards/<filename>。
 * 文件命名建议:card-<slug>-<seq>.webp。
 * 缺图自动跳过(组件内做 HEAD 校验),无需手动维护存在性。
 * ------------------------------------------------------------------ */
export const CARD_GALLERY = {
  'tokenizer': [
    { image: '/assets/cards/analogy-bpe.webp', title: 'BPE 搭积木', caption: '从字符拼成词的积木块' },
    { image: '/assets/cards/tip-tokenizer-multilingual.webp', title: 'Token 通胀', caption: '中文吃亏:同语义 token 数是英文 2-3 倍' },
  ],
  'minimind-design': [
    { image: '/assets/cards/memory-transformer.webp', title: 'Transformer 四件套', caption: '注意力+前馈+残差+归一化' },
    { image: '/assets/cards/memory-six-stages.webp', title: '六步修炼', caption: '大模型从零到懂的路径' },
  ],
  'embedding-position-encoding': [
    { image: '/assets/cards/analogy-embedding.webp', title: 'Embedding 是文字的 GPS', caption: '地图上每个词是坐标点' },
    { image: '/assets/cards/tip-position-rope.webp', title: 'RoPE 不怕变长', caption: '旋转编码编相对距离' },
  ],
  'normalization': [
    { image: '/assets/cards/analogy-normalization.webp', title: '归一化就像调音量', caption: '信号太大炸了太小没了' },
    { image: '/assets/cards/tip-rmsnorm.webp', title: 'RMSNorm 省计算', caption: '去掉均值偏移只保留缩放' },
    { image: '/assets/cards/tip-deepnorm.webp', title: 'DeepNorm', caption: '1000 层也能稳定训练' },
  ],
  'kv-cache-flash-attention': [
    { image: '/assets/cards/analogy-kv-cache.webp', title: 'KV Cache 是笔记本', caption: '算过的 K/V 不重复算' },
    { image: '/assets/cards/tip-gqa.webp', title: 'GQA 压缩', caption: '多 Query head 共享 K/V' },
    { image: '/assets/cards/tip-flash-attn.webp', title: 'Flash Attention', caption: '分块算少搬运' },
  ],
  'moe': [
    { image: '/assets/cards/analogy-moe.webp', title: 'MoE 是分诊台', caption: 'Gate 决定 token 去哪个专家' },
    { image: '/assets/cards/tip-load-balance.webp', title: '负载均衡', caption: '辅助损失防专家塌缩' },
  ],
  'assembly': [
    { image: '/assets/cards/memory-transformer.webp', title: '四件套', caption: '注意力+前馈+残差+归一化' },
    { image: '/assets/cards/tip-residual.webp', title: '残差是高速公路', caption: '信号跳过变换直通' },
  ],
  'pretrain': [
    { image: '/assets/cards/analogy-loss.webp', title: '预测下一个 token', caption: '因果语言建模' },
    { image: '/assets/cards/tip-gradient-accumulation.webp', title: '梯度累加', caption: '显存不够时的假大 batch' },
    { image: '/assets/cards/tip-lr-warmup.webp', title: '学习率热身', caption: '从小到大再衰减' },
  ],
  'sft': [
    { image: '/assets/cards/analogy-loss.webp', title: 'Loss Masking', caption: '只对 assistant 计算损失' },
    { image: '/assets/cards/tip-chat-template.webp', title: 'Chat Template', caption: '角色边界要清晰' },
  ],
  'rl-overview': [
    { image: '/assets/cards/analogy-rlhf.webp', title: 'RLHF 三步曲', caption: 'SFT→RM→PPO' },
    { image: '/assets/cards/tip-process-reward.webp', title: 'PRM vs ORM', caption: '过程奖励更精细' },
  ],
  'dpo': [
    { image: '/assets/cards/analogy-dpo.webp', title: 'DPO 选妃不选秀', caption: '直接从偏好选' },
    { image: '/assets/cards/analogy-rlhf.webp', title: 'RLHF 三步曲', caption: 'DPO 是简化路线' },
  ],
  'ppo': [
    { image: '/assets/cards/analogy-rlhf.webp', title: 'RLHF 核心', caption: 'PPO 是 RLHF 引擎' },
    { image: '/assets/cards/tip-clip.webp', title: 'Clip 防失控', caption: '更新幅度有上限' },
  ],
  'grpo': [
    { image: '/assets/cards/analogy-grpo.webp', title: '小组赛排名', caption: 'N 个回答组内排序' },
    { image: '/assets/cards/tip-no-critic.webp', title: '干掉 Critic', caption: '省一半显存' },
  ],
  'spo': [
    { image: '/assets/cards/analogy-grpo.webp', title: '序列级优化', caption: '整条回答做优化' },
    { image: '/assets/cards/tip-bootstrapping.webp', title: '左脚踩右脚', caption: '自生成数据冷启动' },
  ],
  'interview-100': [
    { image: '/assets/cards/journey-llm.webp', title: '修炼之路', caption: '六步走完' },
    { image: '/assets/cards/tip-study-method.webp', title: '理解不要背', caption: '能讲清楚才算会' },
    { image: '/assets/cards/memory-six-stages.webp', title: '六步修炼', caption: '面试全景' },
  ],
  'inference-training-optimization': [
    { image: '/assets/cards/analogy-kv-cache.webp', title: 'KV Cache', caption: '推理加速关键' },
    { image: '/assets/cards/tip-inference-quant.webp', title: '推理量化', caption: 'INT8 几乎无损' },
  ],
};


;
