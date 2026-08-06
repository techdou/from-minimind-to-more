#!/usr/bin/env bash
# podcast/scripts/render-one.sh
# 渲染单篇 Remotion 视频：720p + 500Kbps H264
#
# 用法：bash podcast/scripts/render-one.sh <slug>
# 前置：项目根目录已存在（含 src/scenes/SceneXXX.tsx + storyboard.json），
#       SubAgent 已完成全部场景实现。

set -euo pipefail

PROJECT_ROOT="E:/projects/minimind2more"
SLUG="${1:-}"
if [ -z "$SLUG" ]; then
  echo "用法: bash render-one.sh <slug>"
  echo "示例: bash render-one.sh normalization"
  exit 1
fi

PODCAST_DIR="$PROJECT_ROOT/podcast"
AUDIO_DIR="$PODCAST_DIR/audio/$SLUG"
MP3_PATH="$PROJECT_ROOT/public/podcast/audio/$SLUG.mp3"
SRT_PATH="$AUDIO_DIR/subtitles.srt"
SKILL_ROOT="C:/Users/DouXiulu/.agents/skills/remotion-video"
SCRIPTS="$SKILL_ROOT/scripts"

# 1. 找到项目根（取最新时间戳）
project_dir=$(ls -dt "$AUDIO_DIR"/remotion-video-projects/*/ 2>/dev/null | head -1)
if [ -z "$project_dir" ]; then
  echo "❌ 没找到项目: $AUDIO_DIR/remotion-video-projects/"
  exit 1
fi
project_dir="${project_dir%/}"
echo "项目: $project_dir"

# 2. 校验 scenes 是否就位
scenes_count=$(ls "$project_dir/src/scenes/"*.tsx 2>/dev/null | wc -l)
echo "已生成 scene 文件: $scenes_count"

# 3. 复制音频
mkdir -p "$project_dir/public"
cp -f "$MP3_PATH" "$project_dir/public/audio.mp3"
echo "音频已复制"

# 4. 加 720p profile（如果还没有）
settings="$project_dir/src/video-settings.json"
if grep -q '"720p30"' "$settings" 2>/dev/null; then
  echo "720p profile 已存在"
else
  echo "添加 720p profile..."
  cat > "$settings" <<'JSON'
{
  "profile": "720p30",
  "design": {
    "width": 1920,
    "height": 1080
  },
  "profiles": {
    "1080p30": {
      "width": 1920,
      "height": 1080,
      "fps": 30
    },
    "720p30": {
      "width": 1280,
      "height": 720,
      "fps": 30
    },
    "4k60": {
      "width": 3840,
      "height": 2160,
      "fps": 60
    }
  }
}
JSON
fi

# 5. 注册 scenes
echo "注册 scenes..."
node "$SCRIPTS/generate-scenes-registry.js" "$project_dir" "$project_dir/storyboard.json" 2>&1 | tail -3

# 6. 加 audio 到 Main.tsx（如果还没有）
main_tsx="$project_dir/src/compositions/Main.tsx"
if grep -q 'staticFile("audio.mp3")' "$main_tsx" 2>/dev/null; then
  echo "audio 已挂载"
else
  echo "挂载 audio 到 Main.tsx..."
  # import 行加 Audio + staticFile
  sed -i 's/import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";/import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";/' "$main_tsx"
  # AbsoluteFill 后插入 <Audio>
  sed -i 's|<AbsoluteFill style={{ backgroundColor: designTokens.background.host, overflow: "hidden" }}>|<AbsoluteFill style={{ backgroundColor: designTokens.background.host, overflow: "hidden" }}>\n      <Audio src={staticFile("audio.mp3")} />|' "$main_tsx"
fi

# 7. validate
echo "校验项目..."
node "$SCRIPTS/validate-project.js" "$project_dir" "$project_dir/storyboard.json" 2>&1 | tail -3

# 8. 渲染
echo "开始渲染 (720p + 500Kbps)..."
cd "$project_dir"
npx remotion render Main out/output.mp4 \
  --codec h264 \
  --video-bitrate 500k \
  --audio-bitrate 128k \
  --concurrency 2 \
  --jpeg-quality 75 2>&1 | tail -5

# 9. 复制到 podcast/video/
video_size=$(stat -c%s "$project_dir/out/output.mp4" 2>/dev/null || stat -f%z "$project_dir/out/output.mp4")
echo "渲染完成: ${video_size} bytes"
mkdir -p "$PODCAST_DIR/video"
cp -f "$project_dir/out/output.mp4" "$PODCAST_DIR/video/$SLUG.mp4"
echo "已复制到: $PODCAST_DIR/video/$SLUG.mp4"
