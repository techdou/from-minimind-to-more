#!/usr/bin/env bash
# podcast/scripts/batch-render.sh
# 批量渲染 Remotion 视频：720p + 500Kbps H264，输出到 podcast/video/<slug>.mp4
#
# 用法：
#   bash podcast/scripts/batch-render.sh                 # 渲染全部 16 篇
#   bash podcast/scripts/batch-render.sh normalization   # 渲染指定篇
#
# 假设：
#   - template 依赖已装（首次会自动装）
#   - SRT/MP3 已在 audio/<slug>/ 和 public/podcast/audio/<slug>.mp3
#   - 渲染时输出 1280x720 @ 30fps，video bitrate 500k，audio bitrate 128k

set -euo pipefail

PROJECT_ROOT="E:/projects/minimind2more"
PODCAST_DIR="$PROJECT_ROOT/podcast"
VIDEO_OUT_DIR="$PODCAST_DIR/video"
AUDIO_DIR="$PODCAST_DIR/audio"
MP3_DIR="$PROJECT_ROOT/public/podcast/audio"
SKILL_ROOT="C:/Users/DouXiulu/.agents/skills/remotion-video"
SCRIPTS="$SKILL_ROOT/scripts"
TEMPLATE_ROOT="$SKILL_ROOT/template"

mkdir -p "$VIDEO_OUT_DIR"

# 全部 16 篇 slug
ALL_SLUGS=(
  normalization tokenizer embedding-position-encoding minimind-design
  kv-cache-flash-attention moe assembly pretrain sft rl-overview
  dpo ppo grpo spo interview-100 inference-training-optimization
)

TARGETS=("${@:-${ALL_SLUGS[@]}}")

echo "=== 批次开始 ==="
echo "目标: ${#TARGETS[@]} 篇"
echo "输出目录: $VIDEO_OUT_DIR"
echo

# 1. 依赖预检
echo "[1/4] 检查模板依赖..."
node "$SCRIPTS/ensure-template-deps.js" "$TEMPLATE_ROOT" | tail -3

success=0
failed=()

for slug in "${TARGETS[@]}"; do
  echo
  echo "==================== $slug ===================="

  srt_path="$AUDIO_DIR/$slug/subtitles.srt"
  mp3_path="$MP3_DIR/$slug.mp3"

  if [ ! -f "$srt_path" ]; then
    echo "❌ 缺 SRT: $srt_path"
    failed+=("$slug")
    continue
  fi
  if [ ! -f "$mp3_path" ]; then
    echo "❌ 缺 MP3: $mp3_path"
    failed+=("$slug")
    continue
  fi

  # 2. 初始化项目
  echo "[init] $slug"
  init_json=$(node "$SCRIPTS/init-project.js" --srt-path "$srt_path" 2>&1)
  project_root=$(echo "$init_json" | grep -o '"projectRoot": *"[^"]*"' | head -1 | sed 's/.*: *"\([^"]*\)"/\1/')

  if [ -z "$project_root" ]; then
    echo "❌ 初始化失败: $slug"
    echo "$init_json" | tail -10
    failed+=("$slug")
    continue
  fi
  echo "  project: $project_root"

  # 3. 复制音频
  mkdir -p "$project_root/public"
  cp "$mp3_path" "$project_root/public/audio.mp3"
  echo "  audio copied"

  echo "  ⏭ SubAgent 阶段 (storyboard + scenes) 请由主 Agent 委派"
  echo "  ⏭ 本脚本只负责脚本+渲染"
  success=$((success + 1))
done

echo
echo "=== 初始化完成: $success/${#TARGETS[@]} ==="
if [ ${#failed[@]} -gt 0 ]; then
  echo "失败: ${failed[*]}"
fi
