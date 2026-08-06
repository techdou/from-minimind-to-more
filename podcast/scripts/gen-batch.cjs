#!/usr/bin/env node
/**
 * gen-batch.js — 一键生成 13 篇 Remotion 视频的全部产物
 *
 * 用法：node podcast/scripts/gen-batch.js
 * 效果：对 13 篇每篇跑：
 *   1. 写 groups.json（一对一：1 SRT 索引 = 1 scene）
 *   2. 调 generate-storyboard.js 写 storyboard.json
 *   3. 调 generate-creator-scenes.js × N 写 scenesData
 *   4. 写 SceneXXX.tsx（薄壳，调通用 SceneContent 模板 + props 数据）
 *   5. 复制通用模板 SceneContent.tsx 到项目 src/scenes/
 *
 * 配置：13 篇 + 风格表（在 ALL_SLUGS 数组内）
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PROJECT_ROOT = "E:/projects/minimind2more";
const SCRIPTS = "C:/Users/DouXiulu/.agents/skills/remotion-video/scripts";
const PODCAST_DIR = path.join(PROJECT_ROOT, "podcast");
const AUDIO_DIR = path.join(PODCAST_DIR, "audio");
const SCENE_TEMPLATE = path.join(PODCAST_DIR, "scripts", "SceneContent.tsx");

// 13 篇配置（保留 normalization/tokenizer/embedding 不动） + 风格 + 主角
const ALL_SLUGS = [
  { slug: "minimind-design",                style: "interview", host: "苏打", guest: "茉莉" },
  { slug: "kv-cache-flash-attention",       style: "interview", host: "苏打", guest: "茉莉" },
  { slug: "moe",                            style: "debate",    host: "苏打", guest: "白桦" },
  { slug: "assembly",                       style: "lecture",   host: "白桦", guest: "冰糖" },
  { slug: "pretrain",                       style: "interview", host: "苏打", guest: "茉莉" },
  { slug: "sft",                            style: "quickfire", host: "茉莉", guest: "冰糖" },
  { slug: "rl-overview",                    style: "quickfire", host: "茉莉", guest: "冰糖" },
  { slug: "dpo",                            style: "debate",    host: "苏打", guest: "白桦" },
  { slug: "ppo",                            style: "debate",    host: "苏打", guest: "白桦" },
  { slug: "grpo",                           style: "interview", host: "苏打", guest: "茉莉" },
  { slug: "spo",                            style: "lecture",   host: "白桦", guest: "冰糖" },
  { slug: "interview-100",                  style: "quickfire", host: "茉莉", guest: "冰糖" },
  { slug: "inference-training-optimization", style: "quickfire", host: "茉莉", guest: "冰糖" },
];

// 关键词词典 — 从台词文本匹配出关键短语
const KEYWORD_DICT = {
  "MiniMind":        "MiniMind",
  "LLaMA":           "LLaMA",
  "Decoder-Only":    "Decoder-Only",
  "Next Token":      "Next Token",
  "GQA":             "GQA",
  "KV Cache":        "KV Cache",
  "Flash Attention": "Flash Attention",
  "MoE":             "MoE",
  "expert":          "专家",
  "LayerNorm":       "LayerNorm",
  "RMSNorm":         "RMSNorm",
  "Pre-Norm":        "Pre-Norm",
  "Post-Norm":       "Post-Norm",
  "SFT":             "SFT",
  "RLHF":            "RLHF",
  "PPO":             "PPO",
  "DPO":             "DPO",
  "GRPO":            "GRPO",
  "奖励":             "奖励",
  "策略":             "策略",
  "动作空间":         "动作空间",
  "状态":             "状态",
  "Q 表":            "Q 表",
  "Q-learning":      "Q-learning",
  "DQN":             "DQN",
  "Policy":          "策略",
  "Value":           "价值",
  "Actor-Critic":    "Actor-Critic",
  "Bellman":         "Bellman",
  "TD-learning":     "TD-learning",
  "蒙特卡洛":         "蒙特卡洛",
  "Rollout":         "Rollout",
  "Reward Model":    "Reward Model",
  "Reference Model": "Reference Model",
  "KL 散度":          "KL 散度",
  "重要性采样":        "重要性采样",
  "Embedding":       "Embedding",
  "位置编码":          "位置编码",
  "绝对位置编码":       "绝对位置编码",
  "相对位置编码":       "相对位置编码",
  "RoPE":            "RoPE",
  "正弦":             "正弦",
  "余弦":             "余弦",
  "Tokenizer":       "Tokenizer",
  "BPE":             "BPE",
  "词表":             "词表",
  "切分":             "切分",
  "子词":             "子词",
  "浮点":             "浮点",
  "FP16":            "FP16",
  "BF16":            "BF16",
  "混合精度":          "混合精度",
  "梯度":             "梯度",
  "显存":             "显存",
  "推理":             "推理",
  "训练":             "训练",
  "Loss":            "Loss",
  "Cross-Entropy":   "Cross-Entropy",
  "Adam":            "Adam",
  "AdamW":           "AdamW",
  "学习率":           "学习率",
  "Warmup":          "Warmup",
  "Cosine":          "Cosine",
  "Dropout":         "Dropout",
  "百道":             "百道",
  "面试":             "面试",
  "链路":             "链路",
  "工程":             "工程",
};

// 选一个主图标 — 根据关键词命中
const ICON_BY_KEYWORD = {
  "LayerNorm": "Layers", "RMSNorm": "Layers", "Pre-Norm": "GitBranch", "Post-Norm": "GitBranch",
  "BPE": "Combine", "Tokenizer": "Type", "GQA": "Network", "Q 表": "Database",
  "Q-learning": "Compass", "DQN": "Cpu", "Bellman": "BookOpen",
  "TD-learning": "TrendingUp", "蒙特卡洛": "Sparkles",
  "Actor-Critic": "Users", "Reward Model": "Award", "KL 散度": "Waves",
  "重要性采样": "BarChart3", "Rollout": "Workflow", "Reference Model": "Database",
  "Adam": "TrendingUp", "AdamW": "TrendingUp", "Warmup": "TrendingUp", "Cosine": "Waves",
  "Dropout": "Scissors", "FP16": "Binary", "BF16": "Binary", "混合精度": "Layers",
  "Embedding": "Database", "位置编码": "Ruler", "RoPE": "RotateCw",
  "MoE": "Network", "Decoder-Only": "ArrowRight", "Next Token": "ArrowRight",
  "KV Cache": "HardDrive", "Flash Attention": "Zap", "MiniMind": "Atom", "LLaMA": "Atom",
  "SFT": "Beaker", "RLHF": "Telescope", "PPO": "Cpu", "DPO": "Scale", "GRPO": "Award",
  "百道": "Award", "面试": "Award", "Loss": "BarChart3", "Cross-Entropy": "BarChart3",
  "学习率": "TrendingUp", "梯度": "Waves", "推理": "Zap", "训练": "Activity",
  "工程": "Wrench", "链路": "Network",
};

// speaker name 角色
const SPEAKER_ROLE = {
  "苏打": "男主讲", "茉莉": "女提问", "白桦": "男教授", "冰糖": "女助教",
};

// 解析 SRT — 返回 [{ index, startMs, endMs, speaker }]
function parseSrt(srtPath) {
  const text = fs.readFileSync(srtPath, "utf-8");
  const blocks = text.trim().split(/\n\s*\n/);
  return blocks
    .map((b) => {
      const lines = b.trim().split("\n");
      if (lines.length < 3) return null;
      const idx = parseInt(lines[0].trim(), 10);
      if (isNaN(idx)) return null;
      const timeMatch = lines[1].match(/(.+?)\s*-->\s*(.+)/);
      if (!timeMatch) return null;
      const parseMs = (s) => {
        const m = s.trim().match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
        if (!m) return 0;
        return parseInt(m[1]) * 3600000 + parseInt(m[2]) * 60000 + parseInt(m[3]) * 1000 + parseInt(m[4]);
      };
      const startMs = parseMs(timeMatch[1]);
      const endMs = parseMs(timeMatch[2]);
      const text3 = lines.slice(2).join(" ").trim();
      // 文本可能为空，speaker 从 manifest 来
      return { index: idx, startMs, endMs, text: text3 };
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index);
}

// 读 segments JSON（manifest 指向的文件）取真实对话文本
function loadSegmentsText(slug) {
  const manifestPath = path.join(AUDIO_DIR, slug, "manifest.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const sourceRel = manifest.source_segments; // 例 "podcast\\scripts\\minimind-design_segments.json"
  if (!sourceRel) return [];
  // 兼容 Windows 反斜杠
  const normRel = sourceRel.replace(/\\/g, "/");
  const sourcePath = path.join(PROJECT_ROOT, normRel);
  if (!fs.existsSync(sourcePath)) return [];
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));
  return data.segments || [];
}

function getSpeaker(slug, idx, cfg, segments) {
  const seg = segments.find((s) => s.index === idx);
  if (seg && seg.voice) return seg.voice;
  // 退化：交替
  return idx % 2 === 0 ? cfg.host : cfg.guest;
}

// 抽取 keywords：从文本里匹配关键词词典
function extractKeywords(text, max = 3) {
  const found = [];
  for (const [k, v] of Object.entries(KEYWORD_DICT)) {
    if (text && text.includes(k) && !found.includes(v)) {
      found.push(v);
      if (found.length >= max) break;
    }
  }
  return found;
}

// 抽取 title：取文本中第一句核心短语或第一个匹配关键词
function extractTitle(text, keywords) {
  if (keywords.length > 0) return keywords[0];
  if (text && text.length > 0) {
    // 取第一句前 10 个字
    const first = text.split(/[，。！？,.!?]/)[0].trim();
    if (first.length > 0 && first.length <= 12) return first;
    return first.slice(0, 8) + "…";
  }
  return "讲解中";
}

// 抽取 question：含 ？的句子截短
function extractQuestion(text) {
  if (!text) return undefined;
  const m = text.match(/([^，。！？.!?\n]{4,30}[？?])/);
  if (m) return m[1].trim();
  return undefined;
}

// 抽取 quote：含冒号引号 / 短句
function extractQuote(text) {
  if (!text) return undefined;
  // 找经典句子
  const m = text.match(/[「"']([^」"']{6,40})[」"']/);
  if (m) return m[1].trim();
  // 找"X 是 Y"句式
  const m2 = text.match(/([^，。！？.!?\n]{6,30}是[^，。！？.!?\n]{4,30})/);
  if (m2) return m2[1].trim();
  return undefined;
}

// 为场景生成 props
function genSceneProps(sceneIdx, sceneSrt, segments, cfg, allSceneSrt, totalScenes) {
  const seg = sceneSrt;
  const text = seg.text || "";
  const speaker = getSpeaker(cfg.slug, seg.index, cfg, segments);
  const isFirst = sceneIdx === 0;
  const isLast = sceneIdx === totalScenes - 1;

  const keywords = extractKeywords(text);
  const title = extractTitle(text, keywords);
  const question = extractQuestion(text);
  const quote = extractQuote(text);

  const props = {
    title,
    keywords: keywords.length > 0 ? keywords : [],
    speaker: { name: speaker, role: SPEAKER_ROLE[speaker] || "讲解" },
  };

  // 第一个：title 变体
  if (isFirst) {
    props.variant = "title";
    props.subtitle = `${cfg.style.toUpperCase()} · 第 ${String(sceneIdx + 1).padStart(2, "0")} 讲`;
    props.tag = `minimind-to-more`;
    if (cfg.style === "interview") props.mainIcon = "Sparkles";
    else if (cfg.style === "lecture") props.mainIcon = "BookOpen";
    else if (cfg.style === "debate") props.mainIcon = "Scale";
    else props.mainIcon = "Zap";
    return props;
  }

  // 最后一个：conclude 变体
  if (isLast) {
    props.variant = "conclude";
    props.subtitle = "本期要点";
    // 要点：从后几个场景的 keywords 聚合
    const recent = allSceneSrt.slice(-5);
    const recKws = [];
    for (const s of recent) {
      const kws = extractKeywords(s.text || "", 2);
      for (const k of kws) if (!recKws.includes(k)) recKws.push(k);
    }
    props.points = recKws.slice(0, 4).map((kw, i) => ({
      icon: ICON_BY_KEYWORD[kw] || "Check",
      keyword: kw,
      sub: ["核心结论", "关键要点", "重要收获", "延伸"][i] || "",
    }));
    props.nextTitle = "下集预告 · 敬请期待";
    return props;
  }

  // body 场景
  props.variant = "body";
  props.mainIcon = (keywords[0] && ICON_BY_KEYWORD[keywords[0]]) || "Sparkles";

  // guest 提问：加 question 气泡
  if (speaker !== cfg.host) {
    const q = extractQuestion(text);
    if (q) props.question = q;
  }

  // 引用类：加 quote
  if (quote) props.quote = quote;

  // 要点 1-3 个（按关键词数）
  if (keywords.length >= 2) {
    props.points = keywords.slice(0, Math.min(keywords.length, 3)).map((kw, i) => ({
      icon: ICON_BY_KEYWORD[kw] || "Check",
      keyword: kw,
      sub: ["核心", "细节", "延伸"][i] || "",
    }));
  } else if (text && text.length > 40) {
    // 长讲解：抽 2 个关键短语
    const phrases = [];
    const parts = text.split(/[，。！？,.!?]/);
    for (const p of parts) {
      const t = p.trim();
      if (t.length >= 3 && t.length <= 12 && !phrases.includes(t)) {
        phrases.push(t);
        if (phrases.length >= 2) break;
      }
    }
    if (phrases.length > 0) {
      props.points = phrases.map((kw, i) => ({
        icon: ["Check", "Sparkles"][i] || "Check",
        keyword: kw,
        sub: ["重点", "细节"][i] || "",
      }));
    }
  }

  return props;
}

function renderSceneTsx(sceneIdx, props) {
  const num = String(sceneIdx + 1).padStart(3, "0");
  const propsJson = JSON.stringify(props, null, 2);
  return `import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = ${propsJson};

const Scene${num}: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene${num};
`;
}

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf-8" });
  } catch (e) {
    return { error: e.message, stdout: e.stdout?.toString() || "", stderr: e.stderr?.toString() || "" };
  }
}

function processOne(cfg) {
  const slug = cfg.slug;
  console.log(`\n=== ${slug} ===`);

  const srtPath = path.join(AUDIO_DIR, slug, "subtitles.srt");
  if (!fs.existsSync(srtPath)) {
    console.log(`  ❌ SRT 缺失`);
    return { slug, ok: false, reason: "SRT missing" };
  }

  // 找最新项目目录
  const projBase = path.join(AUDIO_DIR, slug, "remotion-video-projects");
  if (!fs.existsSync(projBase)) {
    console.log(`  ❌ 项目目录未 init`);
    return { slug, ok: false, reason: "Project not initialized" };
  }
  const dirs = fs.readdirSync(projBase).map((d) => path.join(projBase, d)).filter((d) => fs.statSync(d).isDirectory());
  if (dirs.length === 0) {
    console.log(`  ❌ 项目目录为空`);
    return { slug, ok: false, reason: "Empty project dir" };
  }
  const projectRoot = dirs.sort().pop();

  // 读 SRT
  const srtItems = parseSrt(srtPath);
  if (srtItems.length === 0) {
    console.log(`  ❌ SRT 解析失败`);
    return { slug, ok: false, reason: "SRT parse failed" };
  }
  const segments = loadSegmentsText(slug);
  // 把真实文本注入到 srtItems
  for (const item of srtItems) {
    const seg = segments.find((s) => s.index === item.index);
    if (seg && seg.speech_text) {
      item.text = seg.speech_text;
    }
  }

  // 写 groups.json — 一对一
  const groups = srtItems.map((s) => ({
    sceneId: `scene_${String(s.index).padStart(3, "0")}`,
    fromIndex: s.index,
    toIndex: s.index,
    semanticTags: [s.text ? s.text.slice(0, 8) : "empty"],
    visualHint: s.text ? s.text.slice(0, 40) : "empty",
  }));
  fs.writeFileSync(path.join(projectRoot, "groups.json"), JSON.stringify({ groups }, null, 2));
  console.log(`  ✓ groups.json: ${groups.length} scenes`);

  // 跑 generate-storyboard
  const r1 = run(`node "${SCRIPTS}/generate-storyboard.js" "${srtPath}" "${projectRoot}/groups.json" "${projectRoot}/storyboard.json"`);
  if (typeof r1 === "object" && r1.error) {
    console.log(`  ❌ storyboard 失败: ${r1.error}`);
    return { slug, ok: false, reason: "storyboard failed" };
  }
  console.log(`  ✓ storyboard.json`);

  // 跑 generate-creator-scenes × N
  const totalScenes = srtItems.length;
  const SCENES_PER_CREATOR = 5;
  const creatorCount = Math.ceil(totalScenes / SCENES_PER_CREATOR);
  for (let i = 0; i < creatorCount; i++) {
    const creatorId = `creator-${String(i + 1).padStart(2, "0")}`;
    const out = `${projectRoot}/scene-plans/${creatorId}.scenes.json`;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const r2 = run(`node "${SCRIPTS}/generate-creator-scenes.js" "${projectRoot}/storyboard.json" "${creatorId}" ${SCENES_PER_CREATOR} "${out}"`);
    if (typeof r2 === "object" && r2.error) {
      console.log(`  ❌ ${creatorId} scenes 失败: ${r2.error}`);
    }
  }
  console.log(`  ✓ ${creatorCount} creator scenes`);

  // 复制通用模板到项目
  const scenesDir = path.join(projectRoot, "src", "scenes");
  fs.mkdirSync(scenesDir, { recursive: true });
  fs.copyFileSync(SCENE_TEMPLATE, path.join(scenesDir, "SceneContent.tsx"));
  console.log(`  ✓ SceneContent.tsx`);

  // 生成 SceneXXX.tsx
  for (let i = 0; i < srtItems.length; i++) {
    const props = genSceneProps(i, srtItems[i], segments, cfg, srtItems, totalScenes);
    const tsx = renderSceneTsx(i, props);
    const num = String(i + 1).padStart(3, "0");
    fs.writeFileSync(path.join(scenesDir, `Scene${num}.tsx`), tsx);
  }
  console.log(`  ✓ ${srtItems.length} SceneXXX.tsx`);

  return { slug, ok: true, projectRoot, sceneCount: srtItems.length };
}

const results = [];
for (const cfg of ALL_SLUGS) {
  const r = processOne(cfg);
  results.push(r);
}

console.log(`\n=== 汇总 ===`);
const ok = results.filter((r) => r.ok);
const fail = results.filter((r) => !r.ok);
console.log(`成功: ${ok.length}/${results.length}`);
if (fail.length > 0) {
  console.log(`失败:`);
  for (const f of fail) console.log(`  - ${f.slug}: ${f.reason}`);
}
process.exit(fail.length > 0 ? 1 : 0);
