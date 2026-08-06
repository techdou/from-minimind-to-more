import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HelpCircle, Cat, Dog } from "lucide-react";

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
const RED = "#C0392B";
const INK = "#2C3E50";

const Scene001: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 单 beat: 整段从 segment[0] 推导,但元素入场使用短窗口
  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 锚点: 章节锚点先出 → 两个编号方块左右滑入 → 中央大问号弹出 → 断裂虚线点亮
  const anchorStart = beatAnchor + 4;
  const leftStart = beatAnchor + 18;
  const rightStart = beatAnchor + 28;
  const questionStart = beatAnchor + 44;
  const lineStart = beatAnchor + 60;

  const anchorO = reveal(frame, anchorStart, 12);
  const leftO = reveal(frame, leftStart, 14);
  const rightO = reveal(frame, rightStart, 14);
  const questionO = reveal(frame, questionStart, 16);
  const lineO = reveal(frame, lineStart, 14);

  const questionScale = interpolate(frame, [questionStart, questionStart + 16], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const questionBounce = 1 + 0.05 * Math.sin(Math.min(1, Math.max(0, (frame - questionStart - 16) / 30)) * Math.PI);

  const leftX = interpolate(leftO, [0, 1], [-160, 0]);
  const rightX = interpolate(rightO, [0, 1], [160, 0]);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div style={{ position: "absolute", width: DESIGN_WIDTH, height: DESIGN_HEIGHT, left: 0, top: 0 }}>
        {/* 顶部章节锚点 */}
        <div
          style={{
            position: "absolute",
            top: 120,
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
              fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
              fontSize: 34,
              color: AMBER,
              letterSpacing: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            离散与相似
          </div>
        </div>

        {/* 中央大问号 */}
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 0,
            width: DESIGN_WIDTH,
            display: "flex",
            justifyContent: "center",
            opacity: questionO,
            transform: `scale(${questionScale * questionBounce})`,
          }}
        >
          <HelpCircle size={300} color={AMBER} strokeWidth={2.4} />
        </div>

        {/* 左侧 token 卡片: 猫 = 8921 */}
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 200,
            width: 360,
            opacity: leftO,
            transform: `translateX(${leftX}px)`,
          }}
        >
          <div
            style={{
              background: CREAM,
              border: `4px solid ${INK}`,
              borderRadius: 20,
              padding: "26px 24px",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.14)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Cat size={64} color={AMBER} strokeWidth={2.2} />
            <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 30, color: INK }}>编号</div>
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 64,
                color: AMBER,
                letterSpacing: 2,
              }}
            >
              8921
            </div>
          </div>
        </div>

        {/* 右侧 token 卡片: 狗 = 4412 */}
        <div
          style={{
            position: "absolute",
            top: 470,
            right: 200,
            width: 360,
            opacity: rightO,
            transform: `translateX(${rightX}px)`,
          }}
        >
          <div
            style={{
              background: CREAM,
              border: `4px solid ${INK}`,
              borderRadius: 20,
              padding: "26px 24px",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.14)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Dog size={64} color={AMBER_SOFT} strokeWidth={2.2} />
            <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 30, color: INK }}>编号</div>
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 64,
                color: AMBER,
                letterSpacing: 2,
              }}
            >
              4412
            </div>
          </div>
        </div>

        {/* 两卡之间断裂的红色虚线 (SVG) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        >
          <g opacity={lineO}>
            <line
              x1="640"
              y1="640"
              x2="820"
              y2="640"
              stroke={RED}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="14 14"
            />
            <line
              x1="1100"
              y1="640"
              x2="1280"
              y2="640"
              stroke={RED}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="14 14"
            />
            {/* 中间断口 X */}
            <g stroke={RED} strokeWidth="6" strokeLinecap="round">
              <line x1="900" y1="624" x2="1020" y2="656" />
              <line x1="1020" y1="624" x2="900" y2="656" />
            </g>
          </g>
        </svg>

        {/* 底部留白提示 (不放长句) */}
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: 0,
            width: DESIGN_WIDTH,
            textAlign: "center",
            opacity: lineO,
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 30,
            color: INK,
            letterSpacing: 4,
          }}
        >
          编号是离散的 · 相似性看不见
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene001;
