#!/usr/bin/env python3
"""Generate 18 knowledge cards via image2-api skill."""
import subprocess
import sys
import time
import os

GENERATOR = "C:/Users/DouXiulu/.agents/skills/image2-api/scripts/generate_image.py"
OUTPUT_DIR = "E:/projects/minimind2more/public/assets/cards"

# Unified style prefix for all cards
STYLE = (
    "Flat vector infographic knowledge card. "
    "Background: off-white #FAF9F7. "
    "Palette: amber #B45309 as primary accent, graphite gray #5C5953 for ink, with light beige tones for fills. "
    "Minimal linework, no gradients, no photos. "
    "Editorial poster composition with generous whitespace. "
    "Typography: clean sans-serif, hierarchy of title vs supporting text. "
    "Square 1:1 layout. "
    "IMPORTANT TEXT RULES: "
    "All in-image text must be wrapped with the marker phrase 'THE TEXT READS' before each Chinese phrase. "
    "Use Chinese (Simplified) characters exactly as given. Do not translate. Do not invent extra text. "
    "Only render the explicit text strings provided. No other glyphs, no lorem ipsum, no decorative English sentences. "
)

CONSTRAINTS = (
    " CONSTRAINTS: no photorealism, no shadows, no 3D rendering, no extra English captions beyond the given strings, "
    "do not invent new Chinese phrases beyond the two quoted ones, keep the design flat and minimal."
)

CARDS = [
    {
        "name": "tip-tokenizer-multilingual",
        "text_title": "分词不好，中文吃亏",
        "text_analogy": "同语义，中文 Token 数常常翻倍",
        "visual": "Concept: 'Token inflation card'. A side-by-side comparison: left column shows the English phrase 'I love you' producing 3 small tokens; right column shows the Chinese phrase '我爱你' producing more tokens (e.g. 5-6 tokens). Each token is a small flat rounded rectangle chip in amber outline with a graphite label inside. An arrow or scale between columns visualizes the count difference. Add a small bar chart at the bottom comparing token counts. THE TEXT READS '分词不好，中文吃亏' as the main headline at the top center. THE TEXT READS '同语义，中文 Token 数常常翻倍' as a smaller sub-caption near the comparison.",
    },
    {
        "name": "tip-position-rope",
        "text_title": "旋转编码不怕变长",
        "text_analogy": "位置像雷达扫描，随角度旋转",
        "visual": "Concept: 'RoPE advantage card'. Center: a stylized radar/sonar circle with sweeping amber line, concentric graphite rings representing position indices 0..N. Around the radar, a few vector arrows of equal length rotated at increasing angles to show how positions are encoded by rotation (not by adding). A small inset diagram: a sinusoidal/rotary arrow next to a long sequence of tokens extending outward, showing it generalizes to longer sequences. THE TEXT READS '旋转编码不怕变长' as the title. THE TEXT READS '位置像雷达扫描，随角度旋转' as the supporting caption at the bottom.",
    },
    {
        "name": "tip-rmsnorm",
        "text_title": "RMSNorm 省计算",
        "text_analogy": "去掉减均值这一步，照样稳",
        "visual": "Concept: 'LN vs RMSNorm comparison card'. Two horizontal panels stacked. Top panel 'LayerNorm' shows three sequential boxes: [subtract mean] -> [divide by std] -> [scale & shift], with three operation icons and a small clock/cost badge. Bottom panel 'RMSNorm' shows only two boxes: [divide by RMS] -> [scale], with a smaller cost badge. A green/amber down-arrow between panels labeled with a minus sign indicating reduced compute. THE TEXT READS 'RMSNorm 省计算' as the main title at top. THE TEXT READS '去掉减均值这一步，照样稳' as the analogy caption at the bottom.",
    },
    {
        "name": "tip-deepnorm",
        "text_title": "DeepNorm 打破深度极限",
        "text_analogy": "一千层不崩，残差缩放是关键",
        "visual": "Concept: '1000-layer DeepNet card'. A tall vertical stack of flat rectangular layers (like a building of 1000 floors, represented as a dense repeating block with a '...1000...' label in the middle). On the right side, a small inset comparing a standard Transformer tower (leaning/breaking at ~100 layers, marked with a red X) vs a DeepNorm tower (standing straight up to 1000 layers, marked with an amber check). Show small α scaling arrows on the residual path. THE TEXT READS 'DeepNorm 打破深度极限' as the headline. THE TEXT READS '一千层不崩，残差缩放是关键' as the supporting caption.",
    },
    {
        "name": "tip-gqa",
        "text_title": "GQA 压缩 KV Cache",
        "text_analogy": "MHA→GQA→MQA，共享 Key 节省显存",
        "visual": "Concept: 'attention compression evolution card'. Three labeled boxes left to right showing heads sharing KV. Left 'MHA': 4 Query heads each with its own K,V (4 K-boxes, 4 V-boxes). Middle 'GQA': 4 Query heads sharing 2 K,V groups (2 K-boxes, 2 V-boxes). Right 'MQA': 4 Query heads sharing 1 K,V (1 K-box, 1 V-box). Amber downward arrows between boxes indicate progressive compression; a small 'memory' bar shrinking across the three. THE TEXT READS 'GQA 压缩 KV Cache' as the title. THE TEXT READS 'MHA→GQA→MQA，共享 Key 节省显存' as the caption.",
    },
    {
        "name": "tip-flash-attn",
        "text_title": "Flash Attention 不傻算",
        "text_analogy": "分块读写，少跑几次显存",
        "visual": "Concept: 'IO-aware attention card'. A large Q×K attention matrix split into tiled blocks (a grid of small squares). A few amber-highlighted blocks show the 'computed' tiles; other blocks are faded. On the left, an icon of HBM (slow memory) with many arrows, on the right an SRAM (fast) chip with few amber arrows - showing reduced IO. A small GPU chip illustration at the bottom. THE TEXT READS 'Flash Attention 不傻算' as the headline. THE TEXT READS '分块读写，少跑几次显存' as the supporting analogy caption.",
    },
    {
        "name": "tip-load-balance",
        "text_title": "MoE 要做负载均衡",
        "text_analogy": "辅助损失防所有 Token 挤一个专家",
        "visual": "Concept: 'MoE load balance card'. Show 4 expert boxes in a row labeled E1..E4. Top scenario (bad): all tokens (many small circles) pile onto E1, with E2/E3/E4 nearly empty; mark with amber warning. Bottom scenario (balanced, after aux loss): tokens distributed evenly across all four experts. Between them, an 'aux loss' equation chip or scale icon. THE TEXT READS 'MoE 要做负载均衡' as the headline. THE TEXT READS '辅助损失防所有 Token 挤一个专家' as the supporting analogy caption.",
    },
    {
        "name": "tip-residual",
        "text_title": "残差连接是高速公路",
        "text_analogy": "信号走跳层直通车，绕过变换堆叠",
        "visual": "Concept: 'residual highway card'. A horizontal layer stack: Input box -> [Transform 1] -> [Transform 2] -> [Transform 3] -> Output. A bold amber 'highway' bypass arrow arcs over all the transforms from Input directly to Output, labeled with a + (add) symbol at the merge point. The transforms sit on a slow winding 'local road' in graphite. THE TEXT READS '残差连接是高速公路' as the main title. THE TEXT READS '信号走跳层直通车，绕过变换堆叠' as the caption.",
    },
    {
        "name": "tip-gradient-accumulation",
        "text_title": "梯度累加 = 假大 Batch",
        "text_analogy": "显存不够时，分几次攒够再更新",
        "visual": "Concept: 'gradient accumulation trick card'. Show 4 small mini-batches (mini-batch 1,2,3,4) each as small amber gradient arrows. They accumulate into a single larger 'virtual batch' gradient container on the right, which then updates the model weights with a single bold step. A small GPU memory bar on the side showing it stays low. THE TEXT READS '梯度累加 = 假大 Batch' as the headline. THE TEXT READS '显存不够时，分几次攒够再更新' as the supporting caption.",
    },
    {
        "name": "tip-lr-warmup",
        "text_title": "学习率要热身",
        "text_analogy": "起步小步走，到顶再慢慢退",
        "visual": "Concept: 'learning rate warmup curve card'. A clean 2D line chart: x-axis = training steps, y-axis = learning rate. The curve rises gently from 0 (warmup phase, amber) to a peak, then decays (cosine decay, graphite). Annotate three phases with small labels: 'warmup' on the rising part, 'peak' at the top, 'decay' on the falling part. THE TEXT READS '学习率要热身' as the main title. THE TEXT READS '起步小步走，到顶再慢慢退' as the analogy caption at the bottom.",
    },
    {
        "name": "tip-chat-template",
        "text_title": "Chat Template 是格式契约",
        "text_analogy": "user/assistant 轮流出场，角色不混",
        "visual": "Concept: 'chat template format card'. A stylized dialogue transcript box. Show a sequence of alternating role-tagged lines: a 'user' bubble (amber outline) on the left, an 'assistant' bubble (graphite outline) on the right, then another user bubble. Each line begins with a small role tag like '<|user|>' / '<|assistant|>'. A 'template' frame wraps the whole dialogue like a picture frame. THE TEXT READS 'Chat Template 是格式契约' as the title. THE TEXT READS 'user/assistant 轮流出场，角色不混' as the supporting caption.",
    },
    {
        "name": "tip-clip",
        "text_title": "PPO 的 Clip 防失控",
        "text_analogy": "策略更新幅度，被夹在 1±ε 区间",
        "visual": "Concept: 'PPO clip card'. A horizontal number line representing the probability ratio r = π_new/π_old. Mark a safe band between 1-ε and 1+ε in amber. Outside the band, a flat clipped plateau (no gradient flow). Show a small policy arrow trying to jump far outside the band but being clipped flat at the edge. A red dashed line showing what would happen without clip vs the amber solid line with clip. THE TEXT READS 'PPO 的 Clip 防失控' as the headline. THE TEXT READS '策略更新幅度，被夹在 1±ε 区间' as the analogy caption.",
    },
    {
        "name": "tip-no-critic",
        "text_title": "GRPO 干掉 Critic",
        "text_analogy": "用组内相对优势，省一半显存",
        "visual": "Concept: 'GRPO saves memory card'. Two memory-usage bars side by side. Left 'PPO': two bars stacked - Actor + Critic (both full height). Right 'GRPO': only one Actor bar (half the memory). A group of N sampled responses fanning out from the same prompt, with relative ranking arrows among them (advantages computed from group mean). THE TEXT READS 'GRPO 干掉 Critic' as the headline. THE TEXT READS '用组内相对优势，省一半显存' as the supporting analogy caption.",
    },
    {
        "name": "tip-bootstrapping",
        "text_title": "左脚踩右脚起飞",
        "text_analogy": "自生成数据冷启动，弱模型变强",
        "visual": "Concept: 'self-bootstrapping cold-start card'. A circular loop diagram: a small/weak model icon on the left generates synthetic data (a stack of pages), which trains a slightly bigger model, which generates better data, which trains an even bigger model - 3 stages forming an upward spiral staircase. A small cold-start spark at the bottom. THE TEXT READS '左脚踩右脚起飞' as the headline. THE TEXT READS '自生成数据冷启动，弱模型变强' as the caption.",
    },
    {
        "name": "tip-process-reward",
        "text_title": "PRM 过程奖励 vs ORM 结果奖励",
        "text_analogy": "逐步打分 vs 只看终点对错",
        "visual": "Concept: 'PRM vs ORM comparison card'. Two horizontal solution chains. Top 'PRM (过程奖励)': a chain of 4 reasoning steps, each with a small green/amber check or X mark and a small score badge under each step. Bottom 'ORM (结果奖励)': the same chain of 4 steps but with only one final score badge at the very end (only the final answer is judged). A vertical divider between the two with labels. THE TEXT READS 'PRM 过程奖励 vs ORM 结果奖励' as the title. THE TEXT READS '逐步打分 vs 只看终点对错' as the caption.",
    },
    {
        "name": "tip-study-method",
        "text_title": "八股要理解不要背",
        "text_analogy": "懂原理的人，能讲清为何这么设计",
        "visual": "Concept: 'study method card'. Left side: a 'memorize' illustration - a head silhouette with a stack of crammed text papers being shoved in, marked with an amber X. Right side: an 'understand' illustration - a head silhouette with a small clean diagram/lightbulb inside connected by a few labeled arrows, marked with an amber check. Below, three small icons of 'why / how / what' showing the questions of understanding. THE TEXT READS '八股要理解不要背' as the headline. THE TEXT READS '懂原理的人，能讲清为何这么设计' as the supporting caption.",
    },
    {
        "name": "memory-six-stages",
        "text_title": "大模型六步修炼图",
        "text_analogy": "分词→嵌入→架构→预训练→微调→对齐",
        "visual": "Concept: 'six stages memory card'. A vertical or spiral staircase of 6 numbered flat icon steps, each a small labeled tile with a tiny icon: (1) 分词 - scissors cutting text into chips, (2) 嵌入 - chips becoming vectors/arrows, (3) 架构 - a Transformer block stack, (4) 预训练 - a book/globe being absorbed, (5) 微调 - a tuning fork or dial, (6) 对齐 - a scale/balance. Each tile connected by an amber upward arrow. The whole staircase spirals upward to a small 'LLM' star at the top. THE TEXT READS '大模型六步修炼图' as the main title at the top. THE TEXT READS '分词→嵌入→架构→预训练→微调→对齐' as the stage caption beneath the staircase.",
    },
    {
        "name": "tip-inference-quant",
        "text_title": "推理量化省显存",
        "text_analogy": "FP16→INT8→INT4，精度略降体积更小",
        "visual": "Concept: 'inference quantization card'. Three model-weight bar groups side by side decreasing in size: 'FP16' (tallest, full color), 'INT8' (half height), 'INT4' (smallest). Under each, a small 'bit' icon showing 16 / 8 / 4 dots. A small accuracy needle gauge on the side showing minor accuracy drop. A memory footprint bar shrinking across the three. THE TEXT READS '推理量化省显存' as the headline. THE TEXT READS 'FP16→INT8→INT4，精度略降体积更小' as the supporting caption.",
    },
]


def run_one(card):
    name = card["name"]
    prompt = STYLE + card["visual"] + CONSTRAINTS
    cmd = [
        "python",
        GENERATOR,
        "--prompt", prompt,
        "--prompt-profile", "infographic",
        "--size", "1024x1024",
        "--quality", "medium",
        "--output-dir", OUTPUT_DIR,
        "--name", name,
        "--output-format", "png",
        "--timeout", "180",
        "--max-retries", "1",
        "--prompt-lint", "off",
    ]
    print(f"\n=== [{name}] ===", flush=True)
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        ok = result.returncode == 0
        # Check whether the expected output png exists
        expected = os.path.join(OUTPUT_DIR, f"{name}.png")
        exists = os.path.exists(expected)
        # Tail logs
        out_tail = "\n".join((result.stdout or "").splitlines()[-15:])
        err_tail = "\n".join((result.stderr or "").splitlines()[-15:])
        print(f"rc={result.returncode} png_exists={exists}", flush=True)
        if out_tail:
            print("--- stdout tail ---", flush=True)
            print(out_tail, flush=True)
        if err_tail:
            print("--- stderr tail ---", flush=True)
            print(err_tail, flush=True)
        return ok and exists
    except subprocess.TimeoutExpired:
        print(f"TIMEOUT for {name}", flush=True)
        return False


def main():
    # Allow selecting a subset via argv for resuming
    if len(sys.argv) > 1:
        names = sys.argv[1:]
        cards = [c for c in CARDS if c["name"] in names]
    else:
        cards = CARDS

    results = {}
    for i, card in enumerate(cards):
        ok = run_one(card)
        results[card["name"]] = ok
        if i < len(cards) - 1:
            print("--- sleeping 3s ---", flush=True)
            time.sleep(3)

    print("\n\n=== SUMMARY ===", flush=True)
    succeeded = []
    failed = []
    for name, ok in results.items():
        status = "OK" if ok else "FAIL"
        print(f"{name}: {status}", flush=True)
        (succeeded if ok else failed).append(name)
    print(f"\nTotal: {len(succeeded)} ok / {len(failed)} fail", flush=True)
    if failed:
        print(f"Failed: {failed}", flush=True)


if __name__ == "__main__":
    main()
