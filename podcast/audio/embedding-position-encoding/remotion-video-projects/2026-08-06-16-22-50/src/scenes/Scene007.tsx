import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Check, HelpCircle } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const AMBER = "#B45309";
const GREEN = "#2D5A3D";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";

const Scene007: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const anchorStart = beatAnchor + 4;
  const leftBadgeStart = beatAnchor + 20;
  const rightBadgeStart = beatAnchor + 36;
  const bubbleStart = beatAnchor + 52;

  const anchorO = reveal(frame, anchorStart, 12);
  const leftO = reveal(frame, leftBadgeStart, 14);
  const rightO = reveal(frame, rightBadgeStart, 16);
  const bubbleO = reveal(frame, bubbleStart, 16);
  const bubbleY = interpolate(bubbleO, [0, 1], [60, 0]);

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
            新话题入口
          </div>
        </div>

        {/* 左侧墨绿勾号徽章: Embedding 已懂 */}
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 230,
            opacity: leftO,
            transform: `scale(${interpolate(leftO, [0, 1], [0.4, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: GREEN,
              color: CREAM,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `5px solid ${INK}`,
              boxShadow: "5px 5px 0 rgba(0,0,0,0.16)",
            }}
          >
            <Check size={92} strokeWidth={3} />
          </div>
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 34,
              color: GREEN,
              letterSpacing: 4,
            }}
          >
            Embedding · 已懂
          </div>
        </div>

        {/* 右侧琥珀问号徽章: 位置编码 待解 */}
        <div
          style={{
            position: "absolute",
            top: 470,
            right: 230,
            opacity: rightO,
            transform: `scale(${interpolate(rightO, [0, 1], [0.4, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: AMBER,
              color: CREAM,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `5px solid ${INK}`,
              boxShadow: "5px 5px 0 rgba(0,0,0,0.16)",
            }}
          >
            <HelpCircle size={92} strokeWidth={3} />
          </div>
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 34,
              color: AMBER,
              letterSpacing: 4,
            }}
          >
            位置编码 · 待解
          </div>
        </div>

        {/* 中央气泡 */}
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 0,
            width: DESIGN_WIDTH,
            display: "flex",
            justifyContent: "center",
            opacity: bubbleO,
            transform: `translateY(${bubbleY}px)`,
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "34px 60px",
              background: CREAM,
              border: `4px solid ${AMBER}`,
              borderRadius: 40,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.14)",
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <HelpCircle size={48} color={AMBER} strokeWidth={2.4} />
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 44,
                color: INK,
                letterSpacing: 4,
              }}
            >
              <span style={{ color: AMBER }}>位置编码</span> 是干嘛?
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

export default Scene007;
