#!/bin/bash
# batch-tts-all.sh —— 批量合成所有缺播客的文章
#
# 用法:bash scripts/batch-tts-all.sh
# 自动检测 podcast/scripts/ 下有哪些新脚本,跳过已有音频的

set -e
cd /e/projects/minimind2more
SKILL_DIR="$HOME/.agents/skills/mimo-lecture-audio-skill"

# 需要处理的 slug + style(和 Agent A 的分配一致)
declare -A STYLES
STYLES["embedding-position-encoding"]="lecture"
STYLES["minimind-design"]="interview"
STYLES["kv-cache-flash-attention"]="interview"
STYLES["moe"]="debate"
STYLES["assembly"]="lecture"
STYLES["pretrain"]="interview"
STYLES["sft"]="quickfire"
STYLES["ppo"]="debate"
STYLES["grpo"]="interview"
STYLES["spo"]="lecture"
STYLES["interview-100"]="quickfire"

COUNT=0
TOTAL=${#STYLES[@]}

for SLUG in "${!STYLES[@]}"; do
  STYLE="${STYLES[$SLUG]}"
  SCRIPT="podcast/scripts/${SLUG}.json"

  # 检查脚本是否存在
  if [ ! -f "$SCRIPT" ]; then
    echo "[跳过] $SLUG: 脚本不存在"
    continue
  fi

  # 检查是否已有音频
  if [ -f "public/podcast/audio/${SLUG}.mp3" ]; then
    echo "[已完成] $SLUG: 音频已存在"
    continue
  fi

  COUNT=$((COUNT+1))
  echo ""
  echo "============================================"
  echo "  [$COUNT/$TOTAL] $SLUG (风格: $STYLE)"
  echo "============================================"

  # 1. dialogue → segments
  node scripts/dialogue-to-segments.js "$SCRIPT" "podcast/scripts/${SLUG}_segments.json" "$STYLE"

  # 2. TTS 合成
  python "$SKILL_DIR/scripts/mimo_tts_batch.py" \
    --segments "podcast/scripts/${SLUG}_segments.json" \
    --out-dir "podcast/audio/${SLUG}" \
    --manifest "podcast/audio/${SLUG}/manifest.json" \
    --skip-check 2>&1 | grep -E "DONE|error" | head -2

  # 3. 合并 WAV
  python "$SKILL_DIR/scripts/merge_wav.py" \
    --manifest "podcast/audio/${SLUG}/manifest.json" \
    --output "podcast/audio/${SLUG}/full_podcast.wav" \
    --silence-ms 400 2>&1 | tail -1

  # 4. WAV → MP3
  ffmpeg -y -i "podcast/audio/${SLUG}/full_podcast.wav" \
    -codec:a libmp3lame -b:a 96k \
    "podcast/audio/${SLUG}/full_podcast.mp3" 2>&1 | tail -1

  # 5. 补齐时长
  python "$SKILL_DIR/scripts/audio_duration.py" \
    --manifest "podcast/audio/${SLUG}/manifest.json" \
    --update-manifest 2>&1 | tail -1

  # 6. 合并时长到 dialogue + 复制到 public
  node scripts/merge-podcast-timings.js "$SLUG"
  cp "podcast/audio/${SLUG}/full_podcast.mp3" "public/podcast/audio/${SLUG}.mp3"

  echo "[完成] $SLUG"
done

echo ""
echo "============================================"
echo "  批量合成完成: $COUNT 篇新增"
echo "============================================"
ls -lh public/podcast/audio/*.mp3
