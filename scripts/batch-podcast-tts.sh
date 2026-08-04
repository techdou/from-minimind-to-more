#!/bin/bash
# batch-podcast-tts.sh —— 批量合成多风格播客
#
# 3 篇 × 不同风格:
#   tokenizer   → lecture   (白桦教授 + 冰糖助教)
#   rl-overview → quickfire (茉莉 + 冰糖 双女声快问快答)
#   dpo         → debate    (苏打 vs 白桦 双男声辩论)

set -e
cd /e/projects/minimind2more
SKILL_DIR="$HOME/.agents/skills/mimo-lecture-audio-skill"

PODCASTS=(
  "tokenizer:lecture"
  "rl-overview:quickfire"
  "dpo:debate"
)

for entry in "${PODCASTS[@]}"; do
  SLUG="${entry%%:*}"
  STYLE="${entry##*:}"

  echo ""
  echo "========================================"
  echo "  合成: $SLUG (风格: $STYLE)"
  echo "========================================"

  # 1. dialogue → segments
  node scripts/dialogue-to-segments.js \
    "podcast/scripts/${SLUG}.json" \
    "podcast/scripts/${SLUG}_segments.json" \
    "$STYLE"

  # 2. TTS 合成
  python "$SKILL_DIR/scripts/mimo_tts_batch.py" \
    --segments "podcast/scripts/${SLUG}_segments.json" \
    --out-dir "podcast/audio/${SLUG}" \
    --manifest "podcast/audio/${SLUG}/manifest.json" \
    --include-text-in-manifest \
    --skip-check 2>&1 | tail -5

  # 3. 合并 WAV
  python "$SKILL_DIR/scripts/merge_wav.py" \
    --manifest "podcast/audio/${SLUG}/manifest.json" \
    --output "podcast/audio/${SLUG}/full_podcast.wav" \
    --silence-ms 400 2>&1 | tail -2

  # 4. WAV → MP3
  ffmpeg -y -i "podcast/audio/${SLUG}/full_podcast.wav" \
    -codec:a libmp3lame -b:a 96k \
    "podcast/audio/${SLUG}/full_podcast.mp3" 2>&1 | tail -1

  # 5. 合并时长到 dialogue + 复制到 public
  node scripts/merge-podcast-timings.js "$SLUG"
  cp "podcast/audio/${SLUG}/full_podcast.mp3" "public/podcast/audio/${SLUG}.mp3"

  echo "[完成] $SLUG"
done

echo ""
echo "========================================"
echo "  全部合成完成"
echo "========================================"
ls -lh public/podcast/audio/*.mp3
