import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Layers, Move3d } from "lucide-react";

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

const Scene004: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const anchorStart = beatAnchor + 4;
  const leftStart = beatAnchor + 24;
  const leftBadgeStart = beatAnchor + 70;
  const rightStart = beatAnchor + 92;
  const rightBadgeStart = beatAnchor + 132;

  const anchorO = reveal(frame, anchorStart, 12);
  const leftO = reveal(frame, leftStart, 18);
  const leftBadgeO = reveal(frame, leftBadgeStart, 14);
  const rightO = reveal(frame, rightStart, 18);
  const rightBadgeO = reveal(frame, rightBadgeStart, 14);

  // 左栏堆叠向量条数 (几万维的体量感)
  const stackRows = Array.from({ length: 14 });

  // 右栏三个相互垂直的箭头
  const arrows = [
    { angle: -90, color: AMBER },
    { angle: 30, color: AMBER_SOFT },
    { angle: 150, color: INK },
  ];

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div style={{ position: "absolute", width: DESIGN_WIDTH, height: DESIGN_HEIGHT, left: 0, top: 0 }}>
        {/* 章节锚点 */}
        <div
          style={{
            position: "absolute",
            top: 80,
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
              padding: "12px 38px",
              borderRadius: 999,
              border: `3px solid ${RED}`,
              background: CREAM,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 32,
              color: RED,
              letterSpacing: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            两个致命问题
          </div>
        </div>

        {/* 中央细琥珀竖线分隔 */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 958,
            width: 4,
            height: 720,
            background: AMBER,
            opacity: 0.6,
            borderRadius: 4,
          }}
        />

        {/* 左栏: 维度爆炸 */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 110,
            width: 800,
            opacity: leftO,
            transform: `translateY(${(1 - leftO) * 24}px)`,
          }}
        >
          <div
            style={{
              background: CREAM,
              border: `4px solid ${INK}`,
              borderRadius: 24,
              padding: "30px 36px",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.14)",
              minHeight: 680,
              position: "relative",
            }}
          >
            {/* 红色编号徽章 1 */}
            <div
              style={{
                position: "absolute",
                top: -26,
                left: -26,
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: RED,
                color: CREAM,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 44,
                border: `4px solid ${INK}`,
                opacity: leftBadgeO,
                transform: `scale(${interpolate(leftBadgeO, [0, 1], [0.4, 1])})`,
                boxShadow: "3px 3px 0 rgba(0,0,0,0.18)",
              }}
            >
              1
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <Layers size={48} color={RED} strokeWidth={2.2} />
              <div
                style={{
                  fontFamily: "'ZCOOL XiaoWei', serif",
                  fontSize: 30,
                  color: INK,
                  letterSpacing: 3,
                }}
              >
                维度 = 词表大小
              </div>
            </div>

            {/* 堆叠如山的稀疏向量条 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
              {stackRows.map((_, r) => {
                const grow = interpolate(
                  frame,
                  [leftStart + r * 3, leftStart + r * 3 + 12],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const width = 600 * grow + 60;
                return (
                  <div
                    key={r}
                    style={{
                      width,
                      height: 16,
                      background: INK,
                      opacity: 0.18,
                      borderRadius: 4,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        right: 8,
                        top: -2,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: AMBER,
                        opacity: 0.9,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 18,
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 30,
                color: RED,
                letterSpacing: 3,
              }}
            >
              几万维 · 全是零
            </div>
          </div>
        </div>

        {/* 右栏: 距离全相等 */}
        <div
          style={{
            position: "absolute",
            top: 200,
            right: 110,
            width: 800,
            opacity: rightO,
            transform: `translateY(${(1 - rightO) * 24}px)`,
          }}
        >
          <div
            style={{
              background: CREAM,
              border: `4px solid ${INK}`,
              borderRadius: 24,
              padding: "30px 36px",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.14)",
              minHeight: 680,
              position: "relative",
            }}
          >
            {/* 红色编号徽章 2 */}
            <div
              style={{
                position: "absolute",
                top: -26,
                right: -26,
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: RED,
                color: CREAM,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 44,
                border: `4px solid ${INK}`,
                opacity: rightBadgeO,
                transform: `scale(${interpolate(rightBadgeO, [0, 1], [0.4, 1])})`,
                boxShadow: "3px 3px 0 rgba(0,0,0,0.18)",
              }}
            >
              2
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
              <Move3d size={48} color={RED} strokeWidth={2.2} />
              <div
                style={{
                  fontFamily: "'ZCOOL XiaoWei', serif",
                  fontSize: 30,
                  color: INK,
                  letterSpacing: 3,
                }}
              >
                距离 全相等
              </div>
            </div>

            {/* 三个相互垂直的等长箭头 SVG */}
            <svg width="100%" height={420} viewBox="0 0 700 420">
              <g transform="translate(350, 250)">
                {arrows.map((a, i) => {
                  const grow = interpolate(
                    frame,
                    [rightStart + i * 12, rightStart + i * 12 + 14],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );
                  const len = 170 * grow;
                  const rad = (a.angle * Math.PI) / 180;
                  const ex = Math.cos(rad) * len;
                  const ey = Math.sin(rad) * len;
                  return (
                    <g key={i} opacity={grow}>
                      <line
                        x1={0}
                        y1={0}
                        x2={ex}
                        y2={ey}
                        stroke={a.color}
                        strokeWidth={8}
                        strokeLinecap="round"
                      />
                      <polygon
                        points={`${ex},${ey} ${ex - Math.cos(rad - 0.4) * 18},${ey - Math.sin(rad - 0.4) * 18} ${ex - Math.cos(rad + 0.4) * 18},${ey - Math.sin(rad + 0.4) * 18}`}
                        fill={a.color}
                      />
                    </g>
                  );
                })}
                {/* 原点 */}
                <circle cx={0} cy={0} r={10} fill={INK} />
                {/* 三对相等距离小标尺 */}
              </g>
            </svg>

            <div
              style={{
                marginTop: 6,
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 28,
                color: RED,
                letterSpacing: 3,
                textAlign: "center",
              }}
            >
              分不出 猫狗 / 猫汽车 哪个近
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene004;
