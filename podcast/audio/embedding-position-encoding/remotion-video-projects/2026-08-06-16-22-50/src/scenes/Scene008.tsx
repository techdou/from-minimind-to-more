import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ArrowRight, ArrowLeft } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const AMBER = "#B45309";
const GREEN = "#2D5A3D";
const RED = "#C0392B";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";

const Scene008: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 章节锚点 → 上行词块逐个滑入 → 绿箭头 → 下行词块反向滑入 → 红箭头 → 两侧标签
  const anchorStart = beatAnchor + 4;
  const topStart = beatAnchor + 22;
  const topArrowStart = beatAnchor + 76;
  const bottomStart = beatAnchor + 96;
  const bottomArrowStart = beatAnchor + 150;
  const labelStart = beatAnchor + 172;

  const anchorO = reveal(frame, anchorStart, 12);
  const topArrowO = reveal(frame, topArrowStart, 14);
  const bottomArrowO = reveal(frame, bottomArrowStart, 14);
  const labelO = reveal(frame, labelStart, 14);

  const topWords = ["我", "打", "你"];
  const bottomWords = ["你", "打", "我"];

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
              padding: "12px 38px",
              borderRadius: 999,
              border: `3px solid ${AMBER}`,
              background: CREAM,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 32,
              color: AMBER,
              letterSpacing: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            位置编码 · 在哪
          </div>
        </div>

        {/* 上行: 我 打 你 + 绿色右箭头 */}
        <div
          style={{
            position: "absolute",
            top: 280,
            left: 200,
            right: 200,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            background: CREAM,
            border: `4px solid ${INK}`,
            borderRadius: 24,
            boxShadow: "5px 5px 0 rgba(0,0,0,0.14)",
          }}
        >
          {/* 左侧标签: 同一组词向量 */}
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 18,
              fontFamily: "'ZCOOL XiaoWei', serif",
              fontSize: 24,
              color: INK,
              letterSpacing: 3,
              opacity: labelO,
            }}
          >
            同一组词向量
          </div>

          {topWords.map((w, i) => {
            const wO = reveal(frame, topStart + i * 16, 12);
            return (
              <div
                key={i}
                style={{
                  opacity: wO,
                  transform: `translateX(${(1 - wO) * -40}px)`,
                  width: 150,
                  height: 150,
                  borderRadius: 18,
                  background: "#fff",
                  border: `4px solid ${GREEN}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                  fontSize: 76,
                  color: INK,
                  boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
                }}
              >
                {w}
              </div>
            );
          })}
          <div
            style={{
              opacity: topArrowO,
              transform: `scale(${interpolate(topArrowO, [0, 1], [0.4, 1])})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ArrowRight size={84} color={GREEN} strokeWidth={3.4} />
            <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 26, color: GREEN, letterSpacing: 3 }}>
              正向
            </div>
          </div>
        </div>

        {/* 下行: 你 打 我 + 红色左箭头 */}
        <div
          style={{
            position: "absolute",
            top: 580,
            left: 200,
            right: 200,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            background: CREAM,
            border: `4px solid ${INK}`,
            borderRadius: 24,
            boxShadow: "5px 5px 0 rgba(0,0,0,0.14)",
          }}
        >
          {/* 右侧标签: 顺序不同 意思相反 */}
          <div
            style={{
              position: "absolute",
              right: 30,
              top: 18,
              fontFamily: "'ZCOOL XiaoWei', serif",
              fontSize: 24,
              color: RED,
              letterSpacing: 3,
              opacity: labelO,
            }}
          >
            顺序不同 · 意思相反
          </div>

          <div
            style={{
              opacity: bottomArrowO,
              transform: `scale(${interpolate(bottomArrowO, [0, 1], [0.4, 1])})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ArrowLeft size={84} color={RED} strokeWidth={3.4} />
            <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 26, color: RED, letterSpacing: 3 }}>
              反向
            </div>
          </div>
          {bottomWords.map((w, i) => {
            const wO = reveal(frame, bottomStart + i * 16, 12);
            return (
              <div
                key={i}
                style={{
                  opacity: wO,
                  transform: `translateX(${(1 - wO) * 40}px)`,
                  width: 150,
                  height: 150,
                  borderRadius: 18,
                  background: "#fff",
                  border: `4px solid ${RED}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                  fontSize: 76,
                  color: INK,
                  boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
                }}
              >
                {w}
              </div>
            );
          })}
        </div>

        {/* 中央提示 */}
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 0,
            width: DESIGN_WIDTH,
            textAlign: "center",
            opacity: labelO,
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 32,
            color: AMBER,
            letterSpacing: 4,
          }}
        >
          Transformer 并行处理 · 本身无顺序
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene008;
