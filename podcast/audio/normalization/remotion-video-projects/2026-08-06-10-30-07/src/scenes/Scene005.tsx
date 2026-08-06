import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Code2, Sparkles } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const AMBER = "#B45309";
const AMBER_SOFT = "#FCD34D";
const BEIGE = "#FAF9F7";
const INK = "#2C3E50";
const GRAY_SOFT = "#9CA3AF";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const Scene005: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0 = segments[0];
  const beatStart = msToFrame(seg0.relativeStart, fps);

  // 代码片段卡片淡入
  const cardEnter = spring({
    frame: frame - beatStart,
    fps,
    config: { damping: 200 },
    durationInFrames: 14,
  });

  // RMSNorm 行高亮铺色
  const highlightDelay = beatStart + 10;
  const highlight = interpolate(frame, [highlightDelay, highlightDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 左旧右新术语标签
  const oldDelay = beatStart + 20;
  const newDelay = beatStart + 26;
  const oldEnter = spring({
    frame: frame - oldDelay,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });
  const newEnter = spring({
    frame: frame - newDelay,
    fps,
    config: { damping: 14, stiffness: 140 },
    durationInFrames: 12,
  });

  // 正中问号
  const qDelay = beatStart + 36;
  const qEnter = spring({
    frame: frame - qDelay,
    fps,
    config: { damping: 9, stiffness: 130 },
    durationInFrames: 14,
  });
  const qPulse = 1 + 0.05 * Math.sin((frame - qDelay) * 0.18) * (frame > qDelay + 14 ? 1 : 0);
  const circleDraw = interpolate(frame, [qDelay + 8, qDelay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 代码行
  const codeLines = [
    { n: 1, content: "import torch", color: INK },
    { n: 2, content: "from llama.model import RMSNorm", color: INK },
    { n: 3, content: "norm = RMSNorm(dim)", color: INK, highlight: true },
    { n: 4, content: "x = norm(x)", color: INK },
  ];

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 卡片左上方 旧术语标签 LayerNorm */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 220,
          opacity: oldEnter,
          transform: `translateX(${interpolate(oldEnter, [0, 1], [-24, 0])}px) rotate(-4deg)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            borderRadius: 14,
            background: "rgba(250,249,247,0.6)",
            border: `2px solid ${GRAY_SOFT}`,
            color: GRAY_SOFT,
            fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
            fontSize: 36,
            fontWeight: 700,
            textDecoration: `line-through ${GRAY_SOFT}`,
            textDecorationThickness: 2,
          }}
        >
          LayerNorm
        </div>
      </div>

      {/* 卡片右上方 新术语标签 RMSNorm */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 220,
          opacity: newEnter,
          transform: `translateX(${interpolate(newEnter, [0, 1], [24, 0])}px) rotate(5deg) scale(${0.9 + newEnter * 0.1})`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 30px",
            borderRadius: 14,
            background: BEIGE,
            border: `3px solid ${AMBER}`,
            color: AMBER,
            fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
            fontSize: 38,
            fontWeight: 700,
            boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
          }}
        >
          <Sparkles size={24} strokeWidth={2.4} />
          RMSNorm
        </div>
      </div>

      {/* 中央代码片段卡 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${interpolate(cardEnter, [0, 1], [24, 0])}px)`,
          opacity: cardEnter,
          width: 920,
          background: BEIGE,
          border: `2px solid rgba(44,62,80,0.22)`,
          borderRadius: 18,
          boxShadow: "0 14px 36px rgba(44,62,80,0.16)",
          overflow: "hidden",
        }}
      >
        {/* 卡片顶栏 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 26px",
            borderBottom: `2px solid rgba(44,62,80,0.12)`,
            background: "rgba(180,83,9,0.06)",
          }}
        >
          <Code2 size={28} strokeWidth={2.4} style={{ color: AMBER }} />
          <div
            style={{
              fontFamily: "'Comic Sans MS', monospace",
              fontSize: 22,
              color: "#6B7280",
              fontWeight: 700,
            }}
          >
            llama / model.py
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#E74C3C", opacity: 0.7 }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: AMBER_SOFT }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#2D5A3D", opacity: 0.7 }} />
          </div>
        </div>

        {/* 代码行 */}
        <div style={{ padding: "26px 30px", fontFamily: "'JetBrains Mono', 'Consolas', monospace" }}>
          {codeLines.map((line) => (
            <div
              key={line.n}
              style={{
                display: "flex",
                gap: 22,
                padding: "10px 14px",
                borderRadius: 8,
                position: "relative",
                background:
                  line.highlight && highlight > 0
                    ? `linear-gradient(90deg, ${AMBER}25 0%, ${AMBER}40 100%)`
                    : "transparent",
                border: line.highlight && highlight > 0 ? `2px solid ${AMBER}80` : "2px solid transparent",
              }}
            >
              <div
                style={{
                  width: 28,
                  textAlign: "right",
                  color: GRAY_SOFT,
                  fontSize: 26,
                  opacity: 0.7,
                  flexShrink: 0,
                }}
              >
                {line.n}
              </div>
              <div style={{ fontSize: 30, color: line.color, fontWeight: 600, whiteSpace: "pre" }}>
                {line.highlight ? (
                  <>
                    <span style={{ color: "#6B7280" }}>norm = </span>
                    <span style={{ background: AMBER, color: BEIGE, padding: "0 8px", borderRadius: 6, opacity: highlight }}>
                      RMSNorm
                    </span>
                    <span style={{ color: "#6B7280" }}>(dim)</span>
                  </>
                ) : (
                  line.content
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 正中悬浮大琥珀问号 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${(0.3 + qEnter * 0.7) * qPulse}) rotate(-8deg)`,
          opacity: qEnter,
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 200 200" width={200} height={200}>
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="82"
            fill="none"
            stroke={AMBER}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 8"
            opacity={circleDraw}
            transform="rotate(-3 100 100)"
          />
          <text
            x="100"
            y="155"
            textAnchor="middle"
            fontFamily="ZCOOL KuaiLe, 'Comic Sans MS', cursive"
            fontSize="170"
            fontWeight="700"
            fill={AMBER}
            stroke={BEIGE}
            strokeWidth="3"
            paintOrder="stroke"
          >
            ?
          </text>
        </svg>
      </div>

      {/* 底部对比钩子小字 */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "ZCOOL KuaiLe, cursive",
          fontSize: 30,
          color: INK,
          fontWeight: 700,
          opacity: interpolate(frame, [qDelay + 6, qDelay + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          letterSpacing: "0.06em",
        }}
      >
        区别在哪里？
      </div>
    </AbsoluteFill>
  );
};

export default Scene005;
