#!/usr/bin/env python
"""Generate 12 concept infographic images for minimind2more articles.

Each prompt follows the established normalization style:
- clean off-white background (#FAF9F7), warm amber accent (#B45309), slate-grey (#5C5953)
- flat vector infographic, rounded icons, thin arrows
- 5 content modules, horizontal layout
- CONSTRAINTS block fixed ending
"""

import subprocess
import sys
import time
import os

SKILL = "C:/Users/DouXiulu/.agents/skills/image2-api/scripts/generate_image.py"
OUT_DIR = "E:/projects/minimind2more/public/assets/concepts"

CONSTRAINTS = (
    'CONSTRAINTS: No garbled text, no misspelled characters, no Lorem ipsum, '
    'no placeholder text. No dense small text. No complex backgrounds, no neon glow. '
    'No marketing poster vibe. No watermarks. '
    'High-fidelity Chinese typography, sans-serif throughout.'
)

def base_style():
    return (
        'STYLE: Flat 2D vector infographic on a clean off-white background (#FAF9F7). '
        'Single warm amber accent (#B45309) for numerals, arrows, and emphasis. '
        'Slate-grey (#5C5953) for body text. '
        'Rounded rectangle cards with thin 1px slate borders, soft warm-grey (#EEEDEA) card fills. '
        'Thin right-pointing arrows connecting cards. Circled numerals (amber). '
        'One accent color only. No gradients, no shadows beyond a single subtle card edge, no 3D, no photorealism. '
        'Clean geometric sans-serif throughout (similar to Inter / PingFang SC). '
        'Horizontal 3:2 layout, single page, generous margins.'
    )

PROMPTS = {
    "tokenizer": (
        'SUBJECT: An educational infographic explaining BPE (Byte-Pair Encoding) token merging for large language models, '
        'for a learner studying tokenizers. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "初始化" with sub-text THE TEXT READS: "文本拆为字节". '
        'Card 2: THE TEXT READS: "统计词频" with sub-text THE TEXT READS: "相邻符号对计数". '
        'Card 3: THE TEXT READS: "合并最高频对" with sub-text THE TEXT READS: "(e,s) → es". '
        'Card 4: THE TEXT READS: "分配新ID" with sub-text THE TEXT READS: "扩展词表". '
        'Card 5: THE TEXT READS: "迭代" with sub-text THE TEXT READS: "直到达到词表大小". '
        'Above Card 3 show a small two-row token array merging: top row shows THE TEXT READS: "e | s" and bottom row shows THE TEXT READS: "es". '
        'Title at top (largest, bold): THE TEXT READS: "BPE 合并流程". '
        'Subtitle below title: THE TEXT READS: "从字节到子词的迭代压缩". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "embedding-position-encoding": (
        'SUBJECT: An educational infographic showing the evolution of positional encoding in Transformers, '
        'for a learner studying embeddings. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "绝对·正弦" with sub-text THE TEXT READS: "Sinusoidal PE" and a tiny sine wave glyph. '
        'Card 2: THE TEXT READS: "绝对·可学习" with sub-text THE TEXT READS: "Learned APE". '
        'Card 3: THE TEXT READS: "相对位置" with sub-text THE TEXT READS: "ALiBi 距离偏置". '
        'Card 4: THE TEXT READS: "旋转位置 RoPE" with sub-text THE TEXT READS: "旋转 Q/K 向量" and a small rotating 2D vector glyph. '
        'Card 5: THE TEXT READS: "长度外推 YaRN" with sub-text THE TEXT READS: "频率插值". '
        'Title at top (largest, bold): THE TEXT READS: "位置编码演进". '
        'Subtitle below title: THE TEXT READS: "从绝对坐标到相对旋转". '
        'A thin amber curved arrow loops from Card 5 back along the bottom, labeled THE TEXT READS: "更长上下文". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "kv-cache-flash-attention": (
        'SUBJECT: An educational infographic explaining KV Cache reuse in autoregressive LLM decoding, '
        'for a learner studying inference optimization. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "第 1 步" with sub-text THE TEXT READS: "计算所有 K / V". '
        'Card 2: THE TEXT READS: "缓存 K / V" with sub-text THE TEXT READS: "存入显存" and a small stacked-grid icon representing cached K and V matrices. '
        'Card 3: THE TEXT READS: "第 t 步" with sub-text THE TEXT READS: "仅算新 token 的 Q". '
        'Card 4: THE TEXT READS: "复用历史 K / V" with sub-text THE TEXT READS: "避免重复计算". '
        'Card 5: THE TEXT READS: "加速生成" with sub-text THE TEXT READS: "显存换算力". '
        'Under cards 2 and 4 draw a small repeated K/V grid icon with an amber check mark to emphasize reuse. '
        'Title at top (largest, bold): THE TEXT READS: "KV Cache 复用". '
        'Subtitle below title: THE TEXT READS: "自回归推理的核心优化". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "moe": (
        'SUBJECT: An educational infographic explaining Top-K expert routing in a Mixture-of-Experts (MoE) layer, '
        'for a learner studying sparse models. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "输入 token" with sub-text THE TEXT READS: "x 向量" and a small dot glyph. '
        'Card 2: THE TEXT READS: "门控网络 Gate" with sub-text THE TEXT READS: "打分所有专家" and a small bar-chart icon with N bars. '
        'Card 3: THE TEXT READS: "Top-K 选择" with sub-text THE TEXT READS: "K=2 个最高分" and a small icon of 8 dots with 2 highlighted in amber. '
        'Card 4: THE TEXT READS: "稀疏激活" with sub-text THE TEXT READS: "仅算 K 个专家" showing a row of 8 small expert boxes where only 2 are amber-filled. '
        'Card 5: THE TEXT READS: "加权求和" with sub-text THE TEXT READS: "y = Σ gᵢ·Eᵢ(x)". '
        'Title at top (largest, bold): THE TEXT READS: "MoE 专家路由". '
        'Subtitle below title: THE TEXT READS: "Top-K 门控的稀疏激活". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "assembly": (
        'SUBJECT: An educational infographic showing the full Transformer decoder assembly (MiniMind style), '
        'for a learner studying model architecture. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "Token IDs" with sub-text THE TEXT READS: "输入序列 [B, S]". '
        'Card 2: THE TEXT READS: "Embedding" with sub-text THE TEXT READS: "稠密向量 [B, S, D]". '
        'Card 3: THE TEXT READS: "N × Block" with sub-text THE TEXT READS: "每层含 Attention + FFN" and show a small stacked-layers icon with THE TEXT READS: "× L". '
        'Card 4: THE TEXT READS: "RMSNorm" with sub-text THE TEXT READS: "Pre-Norm 输出层". '
        'Card 5: THE TEXT READS: "LM Head" with sub-text THE TEXT READS: "共享权重 · 预测下一词". '
        'A thin amber dashed double-headed arrow between Card 1 (Token IDs) and Card 5 (LM Head) labeled THE TEXT READS: "Weight Tying". '
        'Title at top (largest, bold): THE TEXT READS: "Transformer 完整架构". '
        'Subtitle below title: THE TEXT READS: "从 Token 到 Logits 的数据流". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "pretrain": (
        'SUBJECT: An educational infographic explaining causal next-token prediction in language model pretraining, '
        'for a learner studying pretraining. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "输入序列" with sub-text THE TEXT READS: "今天 天气 真". '
        'Card 2: THE TEXT READS: "右移一位" with sub-text THE TEXT READS: "构造标签" and a small arrow icon labeled THE TEXT READS: "shift". '
        'Card 3: THE TEXT READS: "因果掩码" with sub-text THE TEXT READS: "只看左侧 token" and a small lower-triangular mask grid glyph. '
        'Card 4: THE TEXT READS: "预测下一词" with sub-text THE TEXT READS: "P(好 | 今天 天气 真)". '
        'Card 5: THE TEXT READS: "交叉熵损失" with sub-text THE TEXT READS: "反向传播更新参数". '
        'Title at top (largest, bold): THE TEXT READS: "因果语言建模". '
        'Subtitle below title: THE TEXT READS: "预测下一个 Token". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "sft": (
        'SUBJECT: An educational infographic explaining loss masking in supervised fine-tuning (SFT), '
        'for a learner studying instruction tuning. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "system" with sub-text THE TEXT READS: "label = -100" and a small slate-grey (muted) chat-bubble icon. '
        'Card 2: THE TEXT READS: "user" with sub-text THE TEXT READS: "label = -100" and a small muted chat-bubble icon. '
        'Card 3: THE TEXT READS: "assistant" with sub-text THE TEXT READS: "参与 loss 计算" and a small amber-highlighted chat-bubble icon. '
        'Card 4: THE TEXT READS: "Loss Masking" with sub-text THE TEXT READS: "仅优化回复部分" and a small mask glyph. '
        'Card 5: THE TEXT READS: "梯度更新" with sub-text THE TEXT READS: "学会按指令作答". '
        'Above cards 1 and 2 draw a thin amber strike-through line to indicate masked (no-loss); card 3 has an amber underline. '
        'Title at top (largest, bold): THE TEXT READS: "SFT 损失掩码". '
        'Subtitle below title: THE TEXT READS: "只对 Assistant 回复计算 Loss". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "rl-overview": (
        'SUBJECT: An educational infographic explaining the three stages of RLHF (Reinforcement Learning from Human Feedback), '
        'for a learner studying alignment. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "阶段一·SFT" with sub-text THE TEXT READS: "监督微调基座模型". '
        'Card 2: THE TEXT READS: "阶段二·RM" with sub-text THE TEXT READS: "训练奖励模型" and a small icon of two chat bubbles with one amber-checked (preferred) and one muted (rejected). '
        'Card 3: THE TEXT READS: "偏好标注" with sub-text THE TEXT READS: "人类选择更优回答" and a small thumbs-up glyph. '
        'Card 4: THE TEXT READS: "阶段三·PPO" with sub-text THE TEXT READS: "强化学习优化策略". '
        'Card 5: THE TEXT READS: "对齐人类价值观" with sub-text THE TEXT READS: "更安全更有用". '
        'Title at top (largest, bold): THE TEXT READS: "RLHF 三阶段". '
        'Subtitle below title: THE TEXT READS: "SFT → RM → PPO". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "dpo": (
        'SUBJECT: An educational infographic comparing DPO (Direct Preference Optimization) with RLHF, '
        'for a learner studying alignment without a reward model. Horizontal 3:2 layout. '
        'TOP ROW (RLHF path, muted slate-grey, labeled THE TEXT READS: "RLHF"): three small cards left-to-right connected by thin grey arrows: '
        'THE TEXT READS: "SFT" → THE TEXT READS: "训练 RM" → THE TEXT READS: "PPO 强化学习". '
        'BOTTOM ROW (DPO path, amber accent, labeled THE TEXT READS: "DPO"): two small cards left-to-right connected by thin amber arrows: '
        'THE TEXT READS: "SFT" → THE TEXT READS: "直接偏好学习". '
        'Between the two rows, on the right side, a thin amber arrow points from the RM card down to a crossed-out box labeled THE TEXT READS: "去掉奖励模型". '
        'Below the bottom row, two tiny paired chat-bubble icons labeled THE TEXT READS: "chosen" (amber) and THE TEXT READS: "rejected" (muted). '
        'Title at top (largest, bold): THE TEXT READS: "DPO vs RLHF". '
        'Subtitle below title: THE TEXT READS: "无需奖励模型，直接从偏好学习". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "ppo": (
        'SUBJECT: An educational infographic explaining the Actor-Critic four-model architecture in PPO for LLMs, '
        'for a learner studying RLHF. Horizontal 3:2 layout. '
        'MODULES (4 model cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title; the four cards are framed together as one group): '
        'Card 1: THE TEXT READS: "Actor" with sub-text THE TEXT READS: "可训练·生成回答" and a small person glyph. '
        'Card 2: THE TEXT READS: "Critic" with sub-text THE TEXT READS: "可训练·估计价值 V" and a small scale/balance glyph. '
        'Card 3: THE TEXT READS: "Reference" with sub-text THE TEXT READS: "冻结·计算 KL 散度" and a small lock glyph. '
        'Card 4: THE TEXT READS: "Reward" with sub-text THE TEXT READS: "冻结·给回答打分" and a small star glyph. '
        'To the right of the four cards, a fifth summary card: THE TEXT READS: "优势 Advantage" with sub-text THE TEXT READS: "A = R − V". '
        'Title at top (largest, bold): THE TEXT READS: "PPO 四模型架构". '
        'Subtitle below title: THE TEXT READS: "Actor-Critic 强化学习". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "grpo": (
        'SUBJECT: An educational infographic explaining Group Relative Policy Optimization (GRPO) in LLMs, '
        'for a learner studying efficient RL. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "同一 Prompt" with sub-text THE TEXT READS: "采样 N 个回答" and a small icon of one dot feeding into N branches. '
        'Card 2: THE TEXT READS: "奖励打分" with sub-text THE TEXT READS: "R₁ R₂ … Rₙ" and a small bar chart with N bars. '
        'Card 3: THE TEXT READS: "组内排序" with sub-text THE TEXT READS: "求均值 μ 与标准差 σ" and a small bell-curve glyph. '
        'Card 4: THE TEXT READS: "相对优势" with sub-text THE TEXT READS: "Aᵢ = (Rᵢ − μ) / σ" with a small ± icon. '
        'Card 5: THE TEXT READS: "去掉 Critic" with sub-text THE TEXT READS: "省显存·省一整个 LLM" and a small crossed-out Critic box glyph. '
        'Title at top (largest, bold): THE TEXT READS: "GRPO 组内相对优势". '
        'Subtitle below title: THE TEXT READS: "无需 Critic 的强化学习". '
        + base_style() + ' ' + CONSTRAINTS
    ),
    "spo": (
        'SUBJECT: An educational infographic explaining SPO (Sequence-level Policy Optimization) in LLMs, '
        'for a learner studying efficient RL. Horizontal 3:2 layout. '
        'MODULES (5 cards in a left-to-right flow connected by thin amber arrows, each card has a circled numeral and a title): '
        'Card 1: THE TEXT READS: "单次采样" with sub-text THE TEXT READS: "每个 Prompt 仅 1 个回答" and a small single-arrow icon. '
        'Card 2: THE TEXT READS: "奖励打分" with sub-text THE TEXT READS: "得到真实分 R". '
        'Card 3: THE TEXT READS: "历史平均分" with sub-text THE TEXT READS: "EMA 追踪器·纯数学基线" and a small trending-line glyph. '
        'Card 4: THE TEXT READS: "自适应动量 ρ" with sub-text THE TEXT READS: "KL 越大·遗忘越快" and a small gauge glyph. '
        'Card 5: THE TEXT READS: "相对优势" with sub-text THE TEXT READS: "A = R − 历史 V" and a small ± icon. '
        'Bottom strip comparing two approaches with small labels: left label THE TEXT READS: "无 Critic（省显存）" with an amber check, right label THE TEXT READS: "单次采样（省算力）" with an amber check. '
        'Title at top (largest, bold): THE TEXT READS: "SPO 序列级策略优化". '
        'Subtitle below title: THE TEXT READS: "无 Critic · 单次采样的折中". '
        + base_style() + ' ' + CONSTRAINTS
    ),
}

ORDER = [
    "tokenizer",
    "embedding-position-encoding",
    "kv-cache-flash-attention",
    "moe",
    "assembly",
    "pretrain",
    "sft",
    "rl-overview",
    "dpo",
    "ppo",
    "grpo",
    "spo",
]


def run_one(slug, prompt, timeout=180):
    cmd = [
        sys.executable, SKILL,
        "--prompt", prompt,
        "--prompt-profile", "infographic",
        "--size", "1536x1024",
        "--quality", "medium",
        "--output-dir", OUT_DIR,
        "--name", slug,
        "--output-format", "png",
        "--timeout", str(timeout),
        "--prompt-lint", "off",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 60)
    return result.returncode, result.stdout, result.stderr


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    results = {}
    for slug in ORDER:
        if only and only != slug:
            continue
        prompt = PROMPTS[slug]
        print(f"\n=== [{slug}] generating ===", flush=True)
        rc, out, err = run_one(slug, prompt)
        ok = rc == 0
        # check file exists
        expected = os.path.join(OUT_DIR, f"{slug}.png")
        if ok and not os.path.exists(expected):
            ok = False
        results[slug] = {
            "rc": rc,
            "ok": ok,
            "file": expected if os.path.exists(expected) else None,
            "size_kb": round(os.path.getsize(expected) / 1024, 1) if os.path.exists(expected) else None,
            "stderr_tail": (err or "")[-400:],
        }
        print(f"[{slug}] ok={ok} rc={rc} file={results[slug]['file']} size={results[slug]['size_kb']}KB", flush=True)
        if not ok:
            print("STDERR:", (err or "")[-600:], flush=True)
            print("STDOUT:", (out or "")[-600:], flush=True)
        # retry once on failure
        if not ok:
            print(f"[{slug}] retrying once...", flush=True)
            time.sleep(5)
            rc2, out2, err2 = run_one(slug, prompt)
            ok2 = rc2 == 0 and os.path.exists(expected)
            if ok2:
                results[slug] = {
                    "rc": rc2, "ok": True,
                    "file": expected,
                    "size_kb": round(os.path.getsize(expected) / 1024, 1),
                    "stderr_tail": (err2 or "")[-400:],
                    "retried": True,
                }
                print(f"[{slug}] retry OK size={results[slug]['size_kb']}KB", flush=True)
            else:
                print(f"[{slug}] retry FAILED. rc={rc2}", flush=True)
                print("STDERR:", (err2 or "")[-600:], flush=True)
        time.sleep(3)
    print("\n=== SUMMARY ===")
    for slug in ORDER:
        if only and only != slug:
            continue
        r = results.get(slug, {})
        print(f"{slug}: ok={r.get('ok')} size={r.get('size_kb')}KB retried={r.get('retried', False)}")


if __name__ == "__main__":
    main()
