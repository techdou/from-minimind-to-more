import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HelpCircle, Plus, Split } from "lucide-react";

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

const Scene009: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const anchorStart = beatAnchor + 4;
  const symStart = beatAnchor + 14;
  const bubbleStart = beatAnchor + 26;

  const anchorO = reveal(frame, anchorStart, 12);
  const symO = reveal(frame, symStart, 16);
  const bubbleO = reveal(frame, bubbleStart, 16);
  const bubbleY = interpolate(bubbleO, [0, 1], [60, 0]);
  const wobble = Math.sin(Math.min(1, Math.max(0, (frame - bubbleStart - 16) / 22)) * Math.PI) * 4;

  // 背景符号: 左下向量+加号, 右下向量+拼接竖线
  const dots = Array.from({ length: 10 });

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
            融合方式
          </div>
        </div>

        {/* 左下符号: 向量 + 加号 (极淡) */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 180,
            opacity: symO * 0.55,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {dots.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: AMBER_SOFT,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
          <Plus size={56} color={AMBER} strokeWidth={3} />
          <div style={{ display: "flex", gap: 4 }}>
            {dots.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: INK,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* 右下符号: 向量 + 拼接竖线 (极淡) */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            right: 180,
            opacity: symO * 0.55,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {dots.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: AMBER_SOFT,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
          <Split size={56} color={AMBER} strokeWidth={3} />
          <div style={{ display: "flex", gap: 4 }}>
            {dots.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: INK,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* 中央气泡 */}
        <div
          style={{
            position: "absolute",
            top: 470,
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
            <HelpCircle size={52} color={AMBER} strokeWidth={2.4} />
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 46,
                color: INK,
                letterSpacing: 4,
              }}
            >
              位置 <span style={{ color: AMBER }}>怎么加</span>?
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
      </div>
    </AbsoluteFill>
  );
};

export default Scene009;
