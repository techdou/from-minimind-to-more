# From Minimind to More —— 互动学习平台

把 [from-minimind-to-more](https://github.com/techdou/from-minimind-to-more) 的 17 篇大模型长文,升级成分层互动学习平台。

## 功能

### Phase 1:阅读基座
- 从 [lengyi-markdown-editor](https://github.com/techdou/lengyi-markdown-editor) 剥离渲染内核(marked + KaTeX + Mermaid + protectMath)
- 代码高亮(highlight.js,按需加载 python/bash/json)
- 侧栏目录 + scrollspy 高亮
- 阅读进度条 + localStorage 位置记忆

### Phase 2:学习层
- 首页学习路径 DAG 图(15 节点 / 21 条依赖边 / 5 层结构)
- 考点 callout 自动识别(`**面试考点：...**` → 醒目卡片)
- 章末测验页(从 keypoints 生成填空题/问答题/记忆点)
- 推荐下一篇(基于 prerequisites 已满足)

### Phase 3:播客口播
- 双人对话播客(苏打主讲 + 茉莉提问)
- 前端播放器:字幕同步 / 倍速 / 点击跳转
- MiMo TTS 合成(归一化篇已生成 2:52 音频)

## 技术栈

| 层 | 技术 |
|---|---|
| 构建 | Vite + 原生 ES 模块 |
| 渲染 | marked + KaTeX + Mermaid + highlight.js |
| 播客 TTS | MiMo V2.5 TTS(小米) |
| 部署 | Cloudflare Pages |

## 开发

```bash
# 安装依赖
npm install

# 构建内容 JSON(从 content/*.md 生成)
npm run build:content

# 启动 dev server
npm run dev

# production build
npm run build

# production preview
npx vite preview
```

## 内容结构

```
content/
├── foundations/    # 基石篇(tokenizer/design/embedding)
├── architecture/   # 架构篇(归一化/KVCache/MoE/拼装)
├── algorithms/     # 算法篇(pretrain~spo)
├── career/         # 求职(八股100问)
└── optional/       # 拓展阅读
```

每篇 md 头部有 frontmatter(title/slug/category/difficulty/duration/prerequisites/objectives/keypoints)。

## 播客制作流程

```bash
# 1. 写 dialogue 脚本(参考 podcast/prompts/dialogue-generator.md)
#    保存到 podcast/scripts/<slug>.json

# 2. 转成 MiMo TTS segments
node scripts/dialogue-to-segments.js podcast/scripts/<slug>.json podcast/scripts/<slug>_segments.json

# 3. TTS 合成
python ~/.agents/skills/mimo-lecture-audio-skill/scripts/mimo_tts_batch.py \
  --segments podcast/scripts/<slug>_segments.json \
  --out-dir podcast/audio/<slug> \
  --manifest podcast/audio/<slug>/manifest.json \
  --skip-check

# 4. 合并 WAV + 生成 SRT
python ~/.agents/skills/mimo-lecture-audio-skill/scripts/merge_wav.py \
  --manifest podcast/audio/<slug>/manifest.json \
  --output podcast/audio/<slug>/full_podcast.wav \
  --silence-ms 400

# 5. WAV → MP3
ffmpeg -i podcast/audio/<slug>/full_podcast.wav -b:a 96k podcast/audio/<slug>/full_podcast.mp3

# 6. 合并真实时长到 dialogue + 复制到 public
node scripts/merge-podcast-timings.js <slug>
cp podcast/audio/<slug>/full_podcast.mp3 public/podcast/audio/<slug>.mp3
```

## 部署

```bash
npm run build
npx wrangler pages deploy dist --project-name minimind-to-more
```
