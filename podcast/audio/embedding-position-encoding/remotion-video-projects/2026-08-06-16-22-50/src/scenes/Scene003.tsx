import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HelpCircle } from "lucide-react";

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

const Scene003: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const anchorStart = beatAnchor + 4;
  const bgStart = beatAnchor + 14;
  const bubbleStart = beatAnchor + 26;

  const anchorO = reveal(frame, anchorStart, 12);
  const bgO = reveal(frame, bgStart, 16);
  const bubbleO = reveal(frame, bubbleStart, 16);
  const bubbleY = interpolate(bubbleO, [0, 1], [60, 0]);
  const wobble = Math.sin(Math.min(1, Math.max(0, (frame - bubbleStart - 16) / 24)) * Math.PI) * 4;

  // 稀疏 one-hot 点条 (5 组,每组只点亮一个点)
  const rows = Array.from({ length: 5 });

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
            最朴素的方案
          </div>
        </div>

        {/* 背景稀疏 one-hot 点条 (极淡) */}
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 0,
            width: DESIGN_WIDTH,
            opacity: bgO * 0.55,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {rows.map((_, r) => {
            const litIndex = r % 5;
            const cells = Array.from({ length: 24 });
            return (
              <div key={r} style={{ display: "flex", gap: 10 }}>
                {cells.map((_, c) => {
                  const lit = c === litIndex;
                  return (
                    <span
                      key={c}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        background: lit ? AMBER_SOFT : INK,
                        opacity: lit ? 0.9 : 0.12,
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
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
            <HelpCircle size={56} color={AMBER} strokeWidth={2.4} />
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 48,
                color: INK,
                letterSpacing: 4,
              }}
            >
              为何不用 <span style={{ color: AMBER }}>one-hot</span>?
            </div>
            {/* 气泡尖角 */}
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

export default Scene003;
