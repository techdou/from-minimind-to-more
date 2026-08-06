# Remotion 视频化 — 剩余 13 篇交接文档

## 当前进度

✅ **已完成 (3/16)**：normalization、tokenizer、embedding-position-encoding — 视频已交付到 `podcast/video/`
⏸ **待完成 (13/16)**：minimind-design、kv-cache-flash-attention、moe、assembly、pretrain、sft、rl-overview、dpo、ppo、grpo、spo、interview-100、inference-training-optimization

## 任务

把剩余 13 篇播客（SRT + MP3 已就位）转成 Remotion 视频（MP4），输出到 `podcast/video/<slug>.mp4`。

## 已完成参考（风格基线）

| slug | 视频路径 | 大小 | 时长 | 场景数 | 风格 |
|---|---|---|---|---|---|
| normalization | `podcast/video/normalization.mp4` | 13.6 MB | 171.5s | 11 | interview（苏打+茉莉）|
| tokenizer | `podcast/video/tokenizer.mp4` | 12.0 MB | 151.9s | 10 | lecture（白桦+冰糖）|
| embedding-position-encoding | `podcast/video/embedding-position-encoding.mp4` | 14.3 MB | 179s | 12 | lecture（白桦+冰糖）|

**抽帧视觉验证已通过**：琥珀 #B45309 + 米色 #FAF9F7 配色一致，简洁学术风，图形化信息层级清晰。

## 渲染参数（确认 OK）

- 分辨率：1280x720 (720p30)
- 视频码率：500 Kbps H264
- 音频码率：128 Kbps AAC
- 渲染并发：2
- JPEG 质量：75
- **输出大小稳定 12-14 MB/篇**，远低于 25MB 限制

## 关键路径

```
PROJECT_ROOT = E:/projects/minimind2more
PODCAST_DIR = E:/projects/minimind2more/podcast
SRT_DIR = E:/projects/minimind2more/podcast/audio/<slug>/subtitles.srt
MP3_DIR = E:/projects/minimind2more/public/podcast/audio/<slug>.mp3
PROJ_BASE = E:/projects/minimind2more/podcast/audio/<slug>/remotion-video-projects/<timestamp>/
VIDEO_OUT = E:/projects/minimind2more/podcast/video/<slug>.mp4

SKILL_ROOT = C:/Users/DouXiulu/.agents/skills/remotion-video
SCRIPTS = C:/Users/DouXiulu/.agents/skills/remotion-video/scripts
TEMPLATE = C:/Users/DouXiulu/.agents/skills/remotion-video/template
```

## ⚠️ 当前阻塞

**MiniMax 模型月度额度触顶** [1310] 上限（2026-08-09 10:03:25 重置）。
豆哥已决定**换模型继续**，本文档供下一个 agent（不限模型）接手。

## 已就位（无需重做）

13 篇的 Remotion 项目骨架**已全部 init + 音频已复制**到 `public/audio.mp3`：

| slug | projectRoot | audio | scenes |
|---|---|---|---|
| minimind-design | `podcast/audio/minimind-design/remotion-video-projects/2026-08-06-16-47-38/` | ✅ | 0 |
| kv-cache-flash-attention | `podcast/audio/kv-cache-flash-attention/remotion-video-projects/2026-08-06-16-47-49/` | ✅ | 0 |
| moe | `podcast/audio/moe/remotion-video-projects/2026-08-06-16-48-01/` | ✅ | 0 |
| assembly | `podcast/audio/assembly/remotion-video-projects/2026-08-06-16-48-13/` | ✅ | 0 |
| pretrain | `podcast/audio/pretrain/remotion-video-projects/2026-08-06-16-48-25/` | ✅ | 0 |
| sft | `podcast/audio/sft/remotion-video-projects/2026-08-06-16-48-37/` | ✅ | 0 |
| rl-overview | `podcast/audio/rl-overview/remotion-video-projects/2026-08-06-16-48-50/` | ✅ | 0 |
| dpo | `podcast/audio/dpo/remotion-video-projects/2026-08-06-16-49-52/` | ✅ | 0 |
| ppo | `podcast/audio/ppo/remotion-video-projects/2026-08-06-16-50-06/` | ✅ | 0 |
| grpo | `podcast/audio/grpo/remotion-video-projects/2026-08-06-16-50-20/` | ✅ | 0 |
| spo | `podcast/audio/spo/remotion-video-projects/2026-08-06-16-50-35/` | ✅ | 0 |
| interview-100 | `podcast/audio/interview-100/remotion-video-projects/2026-08-06-16-50-49/` | ✅ | 0 |
| inference-training-optimization | `podcast/audio/inference-training-optimization/remotion-video-projects/2026-08-06-16-51-03/` | ✅ | 0 |

**直接进入 SubAgent 阶段即可**，无需重新 init。

## 13 篇风格表（影响人物/视觉风格）

按 `REMOTION-HANDOFF.md` 风格映射：

| slug | 风格 | 说话人 |
|---|---|---|
| minimind-design | interview | 苏打(男主讲) + 茉莉(女提问) |
| kv-cache-flash-attention | interview | 苏打 + 茉莉 |
| moe | debate | 苏打 vs 白桦(双男声) |
| assembly | lecture | 白桦(男教授) + 冰糖(女助教) |
| pretrain | interview | 苏打 + 茉莉 |
| sft | quickfire | 茉莉 + 冰糖(双女声) |
| rl-overview | quickfire | 茉莉 + 冰糖 |
| dpo | debate | 苏打 vs 白桦 |
| ppo | debate | 苏打 vs 白桦 |
| grpo | interview | 苏打 + 茉莉 |
| spo | lecture | 白桦 + 冰糖 |
| interview-100 | quickfire | 茉莉 + 冰糖 |
| inference-training-optimization | quickfire | 茉莉 + 冰糖 |

## 全包型 SubAgent prompt 模板（已验证）

用 general-purpose SubAgent，1 个 agent 内包办 1 篇的所有工作（storyboard + 全部 scene.tsx + 注册）。每个 agent 独立处理 1 篇，互不冲突。

模板 prompt：

```text
你正在执行 remotion-video 工作流的"全包型"端到端阶段：在一个 SubAgent 内完成从 SRT 到所有 SceneXXX.tsx 的全部工作。

请严格按以下两个参考协议执行：
- 阶段 1（分镜）：C:\Users\DouXiulu\.agents\skills\remotion-video\references\storyboard-parser.md
- 阶段 2（场景实现）：C:\Users\DouXiulu\.agents\skills\remotion-video\references\scene-component-creator.md

输入参数（全部为绝对路径，不要再传变量名）：
- skillRoot: C:\Users\DouXiulu\.agents\skills\remotion-video
- projectRoot: E:\projects\minimind2more\podcast\audio\<slug>\remotion-video-projects\<timestamp>
- srtPath: E:\projects\minimind2more\podcast\audio\<slug>\subtitles.srt
- generateStoryboardScript: C:\Users\DouXiulu\.agents\skills\remotion-video\scripts\generate-storyboard.js
- validateScenePlanScript: C:\Users\DouXiulu\.agents\skills\remotion-video\scripts\validate-scene-plan.js

工作流（5 步必须全部完成）：
1. 按 storyboard-parser.md 执行分镜。注意：本篇 SRT 文本可能为空（仅说话人+时间戳），需从同目录的 manifest.json 找对话原文（参考 E:\projects\minimind2more\podcast\scripts\<slug>_segments.json）。预期 10-12 场景，单条 SRT 12-18s，硬上限 25s。
2. 跑 generate-creator-scenes.js 为每个 creator（每 5 个场景一个）生成 scenesData。
3. 为每个 creator 写 scene-plan，跑 validate-scene-plan.js，实现所有 SceneXXX.tsx（必须 default export + React.FC<{ segments: Segment[] }> + 8-18 帧入场动画 + 不手改 Main.tsx/generated-scenes.ts）。
4. 跑 generate-scenes-registry.js 注册 scenes。
5. 返回结构化 JSON：success + storyboardPath + groupsPath + sceneCount + scenePlans + implementedScenes + notes。

风格约束：
- 设计画布 1920x1080；琥珀 #B45309 + 米色 #FAF9F7 配色
- 风格：<按上表填：interview / lecture / quickfire / debate>
- 主角说话人：<按上表填>
- 禁止 emoji；图标用 lucide-react
- 严格按 scene-component-creator.md "屏幕上不得出现超过 6 个连续汉字直接取自台词原文"

完成后只返回步骤 5 的 JSON，不要追加额外说明。
```

## 渲染命令（SubAgent 完成后由主流程执行）

每个 slug 跑一次 `render-one.sh`（封装完整 init profile / copy audio / registry / validate / render / 复制）：

```bash
bash "E:/projects/minimind2more/podcast/scripts/render-one.sh" <slug>
```

脚本路径：`E:/projects/minimind2more/podcast/scripts/render-one.sh`（已加 +x）

脚本内部已完成：
1. 找最新项目目录
2. 复制音频到 public/audio.mp3
3. 写入 720p30 profile（如果还没有）
4. 跑 generate-scenes-registry
5. 挂载 audio 到 Main.tsx（用 sed 注入 import + Audio 标签）
6. 跑 validate-project.js
7. 跑 npx remotion render（500k 码率、720p、2 并发）
8. 复制到 `podcast/video/<slug>.mp4`

## 调度建议

13 篇按风格分 2-3 轮并发（每轮 4-5 个 SubAgent），避免 7+ 个并发撞额度墙：

**第 1 轮**（interview 风格，5 篇）：
- minimind-design / kv-cache-flash-attention / pretrain / grpo + 任 1 篇

**第 2 轮**（debate 风格，3 篇）：
- moe / dpo / ppo

**第 3 轮**（lecture 风格，3 篇）：
- assembly / spo + 任 1 篇

**第 4 轮**（quickfire 风格，4 篇）：
- sft / rl-overview / interview-100 / inference-training-optimization

## 完成定义

- 13 个新 .mp4 文件出现在 `E:/projects/minimind2more/podcast/video/`
- 每个文件 < 25MB
- 每个文件可正常播放（ffprobe 验证 h264/aac/720p/30fps）

## 后续工作（视频做完后）

1. 在 `src/pages/podcast.js` 加视频播放入口（检测 mp4 是否存在 + 用 HTML5 `<video>` 播放）
2. 测试部署到 Cloudflare Pages，确认 25MB 单文件限制不超

## 注意

- **不要再用 MiniMax M3 模型**（已撞月度上限 1310），换其他模型继续
- SubAgent 调用 bash 工具时路径用 Windows 反斜杠或正斜杠均可（`init-project.js` 等脚本已做兼容）
- 渲染一台机器同时只跑 1 个（`--concurrency 2` 是 Chrome 内部并发，机器层面别叠多任务）
- 项目已就位的 13 个目录，**禁止** 重新 init（会生成新时间戳目录，老的 0 场景目录可清理或保留）

## 详细交接参考

完整原版 handoff 文档：`E:/projects/minimind2more/podcast/REMOTION-HANDOFF.md`
