import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Sparkles, Ruler } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const AMBER = "#B45309";
const AMBER_SOFT = "#D89A4E";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";

const Scene005: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const anchorStart = beatAnchor + 4;
  const cloudStart = beatAnchor + 14;
  const bubbleStart = beatAnchor + 30;
  const badgeLStart = beatAnchor + 46;
  const badgeRStart = beatAnchor + 58;

  const anchorO = reveal(frame, anchorStart, 12);
  const cloudO = reveal(frame, cloudStart, 20);
  const bubbleO = reveal(frame, bubbleStart, 16);
  const badgeLO = reveal(frame, badgeLStart, 14);
  const badgeRO = reveal(frame, badgeRStart, 14);

  const bubbleY = interpolate(bubbleO, [0, 1], [60, 0]);
  const wobble = Math.sin(Math.min(1, Math.max(0, (frame - bubbleStart - 16) / 22)) * Math.PI) * 4;

  // 点云: 左下稀疏 -> 右上稠密
  const cloud = Array.from({ length: 90 });

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div style={{ position: "absolute", width: DESIGN_WIDTH, height: DESIGN_HEIGHT, left: 0, top: 0 }}>
        {/* 章节锚点 */}
        <div
          style={{
            position: "absolute",
            top: 110,
            left: 0,
            width: DESIGN_WIDTH,
            display: "flex",
            justifyContent: "center",
            opacity: anchorO,
            transform: `translateY(${(1 - anchorO) * -16}px)`,
          }}
        >
          <div
            style={{
              padding: "14px 40px",
              borderRadius: 999,
              border: `3px solid ${AMBER}`,
              background: CREAM,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 34,
              color: AMBER,
              letterSpacing: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            Embedding · 特征
          </div>
        </div>

        {/* 背景点云 (左下稀疏 → 右上稠密) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", left: 0, top: 0, opacity: cloudO * 0.5 }}
        >
          {cloud.map((_, i) => {
            // 让点分布偏向右上半,营造密度递增
            const t = i / cloud.length;
            const x = 200 + Math.random() * 1500;
            const y = 760 - Math.pow(Math.random(), 0.7) * 560; // 越靠右越偏上
            // 密度调整: 越往右上点越多
            const densityBias = (x - 200) / 1500;
            if (Math.random() > 0.3 + densityBias * 0.6) return null;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4 + densityBias * 4}
                fill={i % 3 === 0 ? AMBER : INK}
                opacity={0.25 + densityBias * 0.4}
              />
            );
          })}
        </svg>

        {/* 中央气泡 */}
        <div
          style={{
            position: "absolute",
            top: 430,
            left: 0,
            width: DESIGN_WIDTH,
            display: "flex",
            justifyContent: "center",
            opacity: bubbleO,
            transform: `translateY(${bubbleY}px) translateX(${wobble}px)`,
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "40px 70px",
              background: CREAM,
              border: `4px solid ${AMBER}`,
              borderRadius: 40,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.14)",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <Sparkles size={52} color={AMBER} strokeWidth={2.4} />
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 46,
                color: INK,
                letterSpacing: 4,
              }}
            >
              <span style={{ color: AMBER }}>稠密</span> 与 <span style={{ color: AMBER }}>语义距离</span>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -22,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "22px solid transparent",
                borderRight: "22px solid transparent",
                borderTop: `26px solid ${AMBER}`,
              }}
            />
          </div>
        </div>

        {/* 左侧特征徽章: 稠密 */}
        <div
          style={{
            position: "absolute",
            bottom: 150,
            left: 360,
            opacity: badgeLO,
            transform: `scale(${interpolate(badgeLO, [0, 1], [0.4, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: AMBER,
              color: CREAM,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 36,
              border: `4px solid ${INK}`,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.16)",
            }}
          >
            稠密
          </div>
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 24, color: INK, letterSpacing: 3 }}>
            不再全零
          </div>
        </div>

        {/* 右侧特征徽章: 距离 */}
        <div
          style={{
            position: "absolute",
            bottom: 150,
            right: 360,
            opacity: badgeRO,
            transform: `scale(${interpolate(badgeRO, [0, 1], [0.4, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: CREAM,
              color: AMBER,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `4px solid ${AMBER}`,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.16)",
            }}
          >
            <Ruler size={56} color={AMBER} strokeWidth={2.4} />
          </div>
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 30,
              color: AMBER,
              letterSpacing: 3,
            }}
          >
            距离
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene005;
