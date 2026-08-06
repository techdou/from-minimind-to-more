# Remotion 视频版口播 —— SubAgent 交接文档

## 任务

把 16 篇播客（已有音频 MP3 + SRT 字幕）转成 Remotion 动画视频（MP4）。

## 项目位置

```
E:\projects\minimind2more
```

## 素材清单（全部就绪）

### SRT 字幕（16 篇，驱动 Remotion 场景生成）

| slug | SRT 路径 | 条目数 | 时长 |
|---|---|---|---|
| normalization | `podcast/audio/normalization/subtitles.srt` | 12 | 172s |
| tokenizer | `podcast/audio/tokenizer/subtitles.srt` | 12 | 152s |
| embedding-position-encoding | `podcast/audio/embedding-position-encoding/subtitles.srt` | 12 | 179s |
| minimind-design | `podcast/audio/minimind-design/subtitles.srt` | 12 | 149s |
| kv-cache-flash-attention | `podcast/audio/kv-cache-flash-attention/subtitles.srt` | 12 | 156s |
| moe | `podcast/audio/moe/subtitles.srt` | 12 | 155s |
| assembly | `podcast/audio/assembly/subtitles.srt` | 12 | 166s |
| pretrain | `podcast/audio/pretrain/subtitles.srt` | 12 | 157s |
| sft | `podcast/audio/sft/subtitles.srt` | 11 | 78s |
| rl-overview | `podcast/audio/rl-overview/subtitles.srt` | 11 | 82s |
| dpo | `podcast/audio/dpo/subtitles.srt` | 11 | 135s |
| ppo | `podcast/audio/ppo/subtitles.srt` | 12 | 152s |
| grpo | `podcast/audio/grpo/subtitles.srt` | 12 | 154s |
| spo | `podcast/audio/spo/subtitles.srt` | 12 | 174s |
| interview-100 | `podcast/audio/interview-100/subtitles.srt` | 11 | 85s |
| inference-training-optimization | `podcast/audio/inference-training-optimization/subtitles.srt` | 9 | 82s |

SRT 格式：每条含说话人名（如 `苏打: ...` 或 `茉莉: ...`），时间戳精确到毫秒。

### MP3 音频（16 篇，作为视频音轨）

| slug | 音频路径 |
|---|---|
| normalization | `public/podcast/audio/normalization.mp3` |
| tokenizer | `public/podcast/audio/tokenizer.mp3` |
| ...其余 14 篇 | `public/podcast/audio/<slug>.mp3` |

### 说话人音色映射（4 种风格）

| 风格 | 说话人 | 出现篇章 |
|---|---|---|
| interview | 苏打(男主讲) + 茉莉(女提问) | normalization/minimind-design/kv-cache/pretrain/grpo |
| lecture | 白桦(男教授) + 冰糖(女助教) | tokenizer/embedding/assembly/spo |
| quickfire | 茉莉 + 冰糖(双女声) | rl-overview/sft/interview-100/inference |
| debate | 苏打 vs 白桦(双男声) | moe/ppo/dpo |

## 工具

**Remotion Video Skill**：`C:\Users\DouXiulu\.agents\skills\remotion-video\SKILL.md`

调用方式：`Skill` 工具，skill 名 = `remotion-video`。

## 执行步骤（每篇）

```bash
# 1. 确保 template 依赖已装（首次）
node "C:/Users/DouXiulu/.agents/skills/remotion-video/scripts/ensure-template-deps.js"

# 2. 初始化项目
SKILL_ROOT="C:/Users/DouXiulu/.agents/skills/remotion-video"
node "$SKILL_ROOT/scripts/init-project.js" --srt-path "E:/projects/minimind2more/podcast/audio/<slug>/subtitles.srt"
# 输出会给出 projectRoot 路径

# 3. 复制音频到项目
cp "E:/projects/minimind2more/public/podcast/audio/<slug>.mp3" "<projectRoot>/public/audio.mp3"

# 4. 生成 storyboard.json（按 skill 的 main-workflow.md，用 SubAgent）
# 5. 生成场景组件 SceneXXX.tsx（用 SubAgent 并行）
# 6. 生成 registry + 验证
node "$SKILL_ROOT/scripts/generate-scenes-registry.js" "<projectRoot>" "<projectRoot>/storyboard.json"
node "$SKILL_ROOT/scripts/validate-project.js" "<projectRoot>" "<projectRoot>/storyboard.json"

# 7. 渲染（加音频参数）
cd "<projectRoot>" && npx remotion render Main out/output.mp4
```

## 场景设计建议

视频是教学播客，场景不需要花哨。建议 4 种场景模板：

### 1. 片头（3-5 秒）
- 文章标题 + 篇章名 + 时长
- 琥珀色品牌色（#B45309）+ 米色底（#FAF9F7）
- 简洁淡入

### 2. 对白场景（主体）
- 上半：当前说话人名字标签（苏打/茉莉/白桦/冰糖）+ 头像图标（可用文字色块替代）
- 中间：当前字幕文本（大字号，居中）
- 下半：进度条 + 时间码
- 说话人切换时有过渡动画

### 3. 考点高亮（可选）
- 当字幕出现关键术语时（如"归一化""注意力"），弹出关键词卡片
- 卡片有淡入+缩放动画

### 4. 片尾（3-5 秒）
- "下一篇预告" + 文章标题
- 或"minimind-to-more.pages.dev"

## 视觉规范

- **分辨率**：建议 1280x720（720p），控制文件体积
- **FPS**：30
- **配色**：琥珀 #B45309 + 石墨 #2B2A28 + 米色 #FAF9F7（与网站一致）
- **字体**：系统无衬线（Inter / PingFang SC / Microsoft YaHei）
- **字幕样式**：白字 + 半透明黑底圆角条，居中下方

## 体积约束（重要）

Cloudflare Pages 免费版单文件限制 **25MB**。

| 分辨率 | 码率 | 每篇体积 | 16 篇总计 |
|---|---|---|---|
| 1080p | 2Mbps | 40-50MB | 640-800MB ❌ 超限 |
| 720p | 1Mbps | 15-25MB | 240-400MB ⚠ 部分超限 |
| 720p | 500Kbps | 8-15MB | 128-240MB ✅ |

**建议**：720p + 500Kbps 码率。如果超 25MB，考虑：
- 方案 A：放 Cloudflare R2（豆哥账号有 R2 权限），前端引用 R2 公开 URL
- 方案 B：压缩到 480p

## 输出位置

```
podcast/video/<slug>.mp4
```

## 前端集成（视频做完后）

在 `src/pages/podcast.js` 里加视频播放入口：
- 检测 `podcast/video/<slug>.mp4` 是否存在（HEAD 请求）
- 存在则显示"观看视频"按钮
- 用 HTML5 `<video>` 播放

## 建议执行顺序

1. **先做 normalization 篇验证**（已有 SRT + MP3）
2. 确认体积和效果后，批量做其余 15 篇
3. 批量渲染可用脚本循环（每篇渲染完后自动下一篇）

## 注意

- Remotion 渲染需要 Chrome（headless），首次运行会下载
- 渲染期间 CPU 占用高，单篇 15-30 分钟
- 16 篇全量渲染约 4-8 小时
- 建议分批跑（每批 4 篇），避免单次任务太长
