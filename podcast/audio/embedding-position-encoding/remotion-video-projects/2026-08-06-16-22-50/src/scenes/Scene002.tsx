import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ArrowRight, Database } from "lucide-react";

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

const Scene002: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 锚点 → 查表框架 → 编号逐一映射到向量行 → 高亮一行向量 → 点亮收束标签
  const anchorStart = beatAnchor + 4;
  const tableStart = beatAnchor + 22;
  const rowStart = beatAnchor + 42;
  const highlightStart = beatAnchor + 78;
  const labelStart = beatAnchor + 96;

  const anchorO = reveal(frame, anchorStart, 12);
  const tableO = reveal(frame, tableStart, 16);
  const labelO = reveal(frame, labelStart, 14);

  const highlightO = reveal(frame, highlightStart, 14);

  const ids = [8921, 4412, 7788];

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div style={{ position: "absolute", width: DESIGN_WIDTH, height: DESIGN_HEIGHT, left: 0, top: 0 }}>
        {/* 章节锚点 */}
        <div
          style={{
            position: "absolute",
            top: 90,
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
            Embedding · 查表
          </div>
        </div>

        {/* 中央查表卡片 */}
        <div
          style={{
            position: "absolute",
            top: 230,
            left: 260,
            width: 1400,
            height: 620,
            opacity: tableO,
            transform: `translateY(${(1 - tableO) * 24}px)`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: CREAM,
              borderRadius: 28,
              border: `4px solid ${INK}`,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.14)",
              padding: "40px 60px",
              display: "flex",
              alignItems: "center",
              gap: 40,
            }}
          >
            {/* 左列编号入口 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28, width: 300 }}>
              <div
                style={{
                  fontFamily: "'ZCOOL XiaoWei', serif",
                  fontSize: 26,
                  color: INK,
                  letterSpacing: 4,
                  marginBottom: 6,
                }}
              >
                编号
              </div>
              {ids.map((id, idx) => {
                const rowO = reveal(frame, rowStart + idx * 16, 12);
                return (
                  <div
                    key={id}
                    style={{
                      opacity: rowO,
                      transform: `translateX(${(1 - rowO) * -30}px)`,
                      padding: "18px 24px",
                      borderRadius: 14,
                      border: `3px solid ${AMBER}`,
                      background: "#fff",
                      fontFamily: "'ZCOOL KuaiLe', cursive",
                      fontSize: 44,
                      color: AMBER,
                      textAlign: "center",
                      letterSpacing: 2,
                    }}
                  >
                    {id}
                  </div>
                );
              })}
            </div>

            {/* 中央箭头 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Database size={56} color={AMBER} strokeWidth={2.2} />
              <ArrowRight size={80} color={INK} strokeWidth={3} />
            </div>

            {/* 右列高维向量条 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
              <div
                style={{
                  fontFamily: "'ZCOOL XiaoWei', serif",
                  fontSize: 26,
                  color: INK,
                  letterSpacing: 4,
                  marginBottom: 6,
                }}
              >
                高维向量
              </div>
              {ids.map((id, idx) => {
                const rowO = reveal(frame, rowStart + idx * 16, 12);
                const isHighlight = idx === 1;
                const hO = isHighlight ? highlightO : 1;
                // 用密集圆点表达高维
                const dots = Array.from({ length: 32 });
                return (
                  <div
                    key={id}
                    style={{
                      opacity: rowO,
                      transform: `translateX(${(1 - rowO) * 30}px)`,
                      display: "flex",
                      gap: 6,
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: isHighlight ? `3px solid ${AMBER}` : "3px solid rgba(44,62,80,0.25)",
                      background: isHighlight ? "rgba(180,83,9,0.08)" : "#fff",
                      alignItems: "center",
                    }}
                  >
                    {dots.map((_, i) => (
                      <span
                        key={i}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: isHighlight ? AMBER : INK,
                          opacity: isHighlight ? hO : 0.55,
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部收束标签 */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 0,
            width: DESIGN_WIDTH,
            display: "flex",
            justifyContent: "center",
            opacity: labelO,
            transform: `translateY(${(1 - labelO) * 18}px)`,
          }}
        >
          <div
            style={{
              padding: "14px 44px",
              borderRadius: 16,
              background: AMBER,
              color: CREAM,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 36,
              letterSpacing: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.14)",
            }}
          >
            模型处理的是向量
          </div>
        </div>

        {/* 512 维副标 */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            width: DESIGN_WIDTH,
            textAlign: "center",
            opacity: labelO,
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 26,
            color: AMBER_SOFT,
            letterSpacing: 4,
          }}
        >
          每个编号 · 一个高维向量(如 512 维)
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene002;
