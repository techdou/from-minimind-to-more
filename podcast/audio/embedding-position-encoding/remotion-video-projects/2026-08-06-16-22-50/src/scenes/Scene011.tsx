import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HelpCircle, Expand, Award } from "lucide-react";

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

const Scene011: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 章节锚点 → 底部刻度尺 → 气泡 → 左右优势徽章
  const anchorStart = beatAnchor + 4;
  const rulerStart = beatAnchor + 14;
  const bubbleStart = beatAnchor + 28;
  const badgeLStart = beatAnchor + 44;
  const badgeRStart = beatAnchor + 56;

  const anchorO = reveal(frame, anchorStart, 12);
  const rulerO = reveal(frame, rulerStart, 20);
  const bubbleO = reveal(frame, bubbleStart, 16);
  const badgeLO = reveal(frame, badgeLStart, 14);
  const badgeRO = reveal(frame, badgeRStart, 14);

  const bubbleY = interpolate(bubbleO, [0, 1], [60, 0]);

  // 刻度尺刻度
  const ticks = ["4k", "8k", "16k", "32k", "64k+"];

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div style={{ position: "absolute", width: DESIGN_WIDTH, height: DESIGN_HEIGHT, left: 0, top: 0 }}>
        {/* 章节锚点 */}
        <div
          style={{
            position: "absolute",
            top: 100,
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
            RoPE · 优势
          </div>
        </div>

        {/* 中央气泡 */}
        <div
          style={{
            position: "absolute",
            top: 280,
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
              padding: "36px 60px",
              background: CREAM,
              border: `4px solid ${AMBER}`,
              borderRadius: 40,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.14)",
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <HelpCircle size={50} color={AMBER} strokeWidth={2.4} />
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 42,
                color: INK,
                letterSpacing: 4,
              }}
            >
              <span style={{ color: AMBER }}>为何更好</span> · 能否 <span style={{ color: AMBER }}>外推</span>?
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

        {/* 左侧优势徽章: 泛化 */}
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 260,
            opacity: badgeLO,
            transform: `scale(${interpolate(badgeLO, [0, 1], [0.4, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
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
            <Award size={80} strokeWidth={2.6} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 32, color: AMBER, letterSpacing: 4 }}>
            泛化
          </div>
        </div>

        {/* 右侧优势徽章: 外推 */}
        <div
          style={{
            position: "absolute",
            top: 540,
            right: 260,
            opacity: badgeRO,
            transform: `scale(${interpolate(badgeRO, [0, 1], [0.4, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: CREAM,
              color: AMBER,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `5px solid ${AMBER}`,
              boxShadow: "5px 5px 0 rgba(0,0,0,0.16)",
            }}
          >
            <Expand size={80} strokeWidth={2.6} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 32, color: AMBER, letterSpacing: 4 }}>
            外推
          </div>
        </div>

        {/* 底部长度刻度尺 (4k 实心 → 32k+ 渐淡) */}
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: 200,
            right: 200,
            opacity: rulerO,
            transform: `translateY(${(1 - rulerO) * 20}px)`,
          }}
        >
          <svg width="100%" height={120} viewBox="0 0 1520 120">
            {/* 主尺 */}
            <line x1={20} y1={70} x2={1500} y2={70} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
            {/* 实心段 (4k) */}
            <line x1={20} y1={70} x2={300} y2={70} stroke={AMBER} strokeWidth={10} strokeLinecap="round" />
            {/* 渐淡延伸段 */}
            <line
              x1={300}
              y1={70}
              x2={1500}
              y2={70}
              stroke={AMBER_SOFT}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="20 16"
              opacity={0.5}
            />
            {/* 刻度 */}
            {ticks.map((t, i) => {
              const x = 20 + (i / (ticks.length - 1)) * 1480;
              const solid = i === 0;
              const op = solid ? 1 : interpolate(i, [0, ticks.length - 1], [1, 0.35]);
              return (
                <g key={t} opacity={op}>
                  <line x1={x} y1={50} x2={x} y2={90} stroke={INK} strokeWidth={3} />
                  <text
                    x={x}
                    y={36}
                    textAnchor="middle"
                    fontFamily="'ZCOOL KuaiLe', cursive"
                    fontSize={26}
                    fill={solid ? AMBER : INK}
                  >
                    {t}
                  </text>
                </g>
              );
            })}
            {/* 4k 训练区间标签 */}
            <text
              x={160}
              y={112}
              textAnchor="middle"
              fontFamily="'ZCOOL XiaoWei', serif"
              fontSize={22}
              fill={AMBER}
              letterSpacing={3}
            >
              训练
            </text>
            {/* 外推区间标签 */}
            <text
              x={960}
              y={112}
              textAnchor="middle"
              fontFamily="'ZCOOL XiaoWei', serif"
              fontSize={22}
              fill={AMBER_SOFT}
              letterSpacing={3}
            >
              外推到更长上下文
            </text>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene011;
