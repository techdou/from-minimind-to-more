import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Sparkles, HelpCircle } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const AMBER = "#B45309";
const BEIGE = "#FAF9F7";
const INK = "#2C3E50";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const Scene001: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0 = segments[0];
  const beatStart = msToFrame(seg0.relativeStart, fps);

  // 短入场窗口，不拉满整个 beat
  const titleEnter = spring({
    frame: frame - beatStart,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 16,
  });

  const keywordDelay = beatStart + 10;
  const keywordEnter = spring({
    frame: frame - keywordDelay,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 14,
  });

  const bubbleDelay = beatStart + 18;
  const bubbleEnter = spring({
    frame: frame - bubbleDelay,
    fps,
    config: { damping: 14, stiffness: 130 },
    durationInFrames: 14,
  });

  const tagDelay = beatStart + 22;
  const tagEnter = spring({
    frame: frame - tagDelay,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });

  // 关键词轻微脉冲
  const keywordPulse =
    1 + 0.04 * Math.sin((frame - keywordDelay) * 0.18) * (frame > keywordDelay ? 1 : 0);

  // 圈选绘制
  const circleDraw = interpolate(frame, [keywordDelay + 6, keywordDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const starOpacity = (phase: number) =>
    0.4 + 0.5 * Math.sin(frame * 0.12 + phase) * (frame > beatStart + 8 ? 1 : 0);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 右上角 Transformer 胶囊标签 */}
      <div
        style={{
          position: "absolute",
          top: 96,
          right: 120,
          opacity: tagEnter,
          transform: `translateY(${interpolate(tagEnter, [0, 1], [-12, 0])}px) scale(${0.9 + tagEnter * 0.1})`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            borderRadius: 9999,
            border: `2px solid ${AMBER}`,
            background: BEIGE,
            color: AMBER,
            fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
            fontSize: 30,
            fontWeight: 700,
            boxShadow: "4px 4px 0 rgba(44,62,80,0.15)",
          }}
        >
          <Sparkles size={22} strokeWidth={2.4} />
          Transformer
        </div>
      </div>

      {/* 装饰小星点 */}
      <Sparkles
        size={26}
        strokeWidth={2.4}
        style={{
          position: "absolute",
          top: 230,
          left: 220,
          color: AMBER,
          opacity: starOpacity(0),
        }}
      />
      <Sparkles
        size={20}
        strokeWidth={2.4}
        style={{
          position: "absolute",
          top: 280,
          right: 280,
          color: AMBER,
          opacity: starOpacity(1.5),
        }}
      />
      <Sparkles
        size={18}
        strokeWidth={2.4}
        style={{
          position: "absolute",
          bottom: 240,
          right: 200,
          color: AMBER,
          opacity: starOpacity(3),
        }}
      />

      {/* 中央海报式标题组合 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -56%) scale(${0.85 + titleEnter * 0.15})`,
          opacity: titleEnter,
          textAlign: "center",
          width: 1200,
        }}
      >
        <div
          style={{
            fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
            fontSize: 200,
            fontWeight: 700,
            color: INK,
            lineHeight: 1,
            letterSpacing: "0.04em",
            textShadow: "4px 4px 0 rgba(44,62,80,0.12)",
          }}
        >
          归一化
        </div>
        <div
          style={{
            fontFamily: "'Comic Sans MS', 'Marker Felt', cursive",
            fontSize: 54,
            fontWeight: 600,
            color: "#6B7280",
            letterSpacing: "0.18em",
            marginTop: 8,
          }}
        >
          NORMALIZATION
        </div>

        {/* LayerNorm 关键词 */}
        <div
          style={{
            marginTop: 48,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transform: `scale(${keywordEnter * keywordPulse})`,
            opacity: keywordEnter,
          }}
        >
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 96,
              fontWeight: 700,
              color: BEIGE,
              background: AMBER,
              padding: "10px 56px",
              borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px",
              border: `4px solid ${INK}`,
              boxShadow: "6px 6px 0 rgba(44,62,80,0.18)",
              letterSpacing: "0.04em",
            }}
          >
            LayerNorm
          </div>
          {/* 手绘圈选 */}
          <svg
            viewBox="0 0 600 200"
            width={560}
            height={180}
            style={{
              position: "absolute",
              top: -10,
              left: -10,
              pointerEvents: "none",
              opacity: circleDraw,
              transform: `scale(${1 + (1 - circleDraw) * 0.2})`,
            }}
            preserveAspectRatio="none"
          >
            <ellipse
              cx="300"
              cy="100"
              rx="285"
              ry="85"
              fill="none"
              stroke={AMBER}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="9 7"
              transform="rotate(-2 300 100)"
            />
          </svg>
        </div>
      </div>

      {/* 左下角苏打提问气泡 */}
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 110,
          opacity: bubbleEnter,
          transform: `translateX(${interpolate(bubbleEnter, [0, 1], [-60, 0])}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            background: BEIGE,
            border: `3px solid ${INK}`,
            borderRadius: "28px 28px 28px 6px",
            padding: "22px 34px",
            boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
            maxWidth: 360,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <HelpCircle size={30} strokeWidth={2.4} style={{ color: AMBER }} />
            <div>
              <div
                style={{
                  fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                  fontSize: 44,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1.1,
                }}
              >
                为什么？
              </div>
              <div
                style={{
                  fontFamily: "'Comic Sans MS', cursive",
                  fontSize: 22,
                  color: "#6B7280",
                  marginTop: 4,
                }}
              >
                — 苏打
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene001;
