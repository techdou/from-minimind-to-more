import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Type, Scissors, Hash } from "lucide-react";

const AMBER = "#B45309";
const AMBER_SOFT = "#FCD9A4";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";
const BLUE = "#5DADE2";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const EXAMPLE_CHARS = ["我", "爱", "自", "然", "语", "言"];

const Scene002: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0].relativeStart, fps);

  // 左节点
  const leftStart = seg0Start;
  const leftEnter = spring({ frame: frame - leftStart, fps, config: { damping: 14, stiffness: 130 } });

  // 中节点（切块）
  const midStart = seg0Start + 8;
  const midEnter = spring({ frame: frame - midStart, fps, config: { damping: 14, stiffness: 130 } });

  // 五个色块错峰分裂（在中节点入场后）
  const blockSplitBase = midStart + 8;
  const blockSplit = (i: number) =>
    spring({ frame: frame - (blockSplitBase + i * 2), fps, config: { damping: 13, stiffness: 170 } });

  // 右节点（数字）
  const rightStart = seg0Start + 26;
  const rightEnter = spring({ frame: frame - rightStart, fps, config: { damping: 14, stiffness: 130 } });

  // 右侧数字逐个
  const numBase = rightStart + 6;
  const numEnter = (i: number) =>
    interpolate(frame - (numBase + i * 2), [0, 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // 底部流程脚注
  const footerStart = seg0Start + 40;
  const footerEnter = interpolate(frame - footerStart, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerY = 460;
  const nodeW = 380;
  const nodeH = 360;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* 顶部主题标签 */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: footerEnter > 0 ? 1 : interpolate(frame - seg0Start, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 36,
          color: INK,
        }}
      >
        <span
          style={{
            background: AMBER,
            color: CREAM,
            padding: "10px 36px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
            boxShadow: `4px 4px 0 rgba(0,0,0,0.15)`,
          }}
        >
          Tokenizer 在做什么
        </span>
      </div>

      {/* 左节点：文字 */}
      <div
        style={{
          position: "absolute",
          left: 180,
          top: centerY - nodeH / 2,
          width: nodeW,
          height: nodeH,
          opacity: leftEnter,
          transform: `translateX(${(1 - leftEnter) * -40}px)`,
          background: CREAM,
          border: `4px solid ${INK}`,
          borderRadius: 24,
          boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: BLUE,
              border: `3px solid ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CREAM,
            }}
          >
            <Type size={28} strokeWidth={2.4} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 40, color: INK }}>文字</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 64,
            color: INK,
          }}
        >
          {EXAMPLE_CHARS.map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
        <div
          style={{
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 22,
            color: "#5D6D7E",
          }}
        >
          人类能读的文字
        </div>
      </div>

      {/* 中节点：切块 */}
      <div
        style={{
          position: "absolute",
          left: 770,
          top: centerY - nodeH / 2,
          width: nodeW,
          height: nodeH,
          opacity: midEnter,
          transform: `translateY(${(1 - midEnter) * 30}px)`,
          background: CREAM,
          border: `4px solid ${INK}`,
          borderRadius: 24,
          boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: AMBER,
              border: `3px solid ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CREAM,
            }}
          >
            <Scissors size={28} strokeWidth={2.4} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 40, color: INK }}>切块</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 300 }}>
          {EXAMPLE_CHARS.map((c, i) => {
            const p = blockSplit(i);
            return (
              <div
                key={i}
                style={{
                  width: 78,
                  height: 88,
                  background: AMBER_SOFT,
                  border: `3px solid ${INK}`,
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: p,
                  transform: `translate(${(1 - p) * (i % 2 === 0 ? -16 : 16)}px, ${(1 - p) * -20}px) scale(${0.8 + p * 0.2})`,
                  boxShadow: `2px 2px 0 rgba(0,0,0,0.1)`,
                }}
              >
                <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 42, color: INK }}>{c}</div>
                <div
                  style={{
                    fontSize: 18,
                    color: AMBER,
                    fontWeight: 700,
                    fontFamily: "'ZCOOL KuaiLe', cursive",
                  }}
                >
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 22, color: "#5D6D7E" }}>
          带编号的小块
        </div>
      </div>

      {/* 右节点：数字 */}
      <div
        style={{
          position: "absolute",
          left: 1360,
          top: centerY - nodeH / 2,
          width: nodeW,
          height: nodeH,
          opacity: rightEnter,
          transform: `translateX(${(1 - rightEnter) * 40}px)`,
          background: CREAM,
          border: `4px solid ${INK}`,
          borderRadius: 24,
          boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#2D5A3D",
              border: `3px solid ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CREAM,
            }}
          >
            <Hash size={28} strokeWidth={2.4} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 40, color: INK }}>编号 → 数字</div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {EXAMPLE_CHARS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                background: AMBER_SOFT,
                border: `3px solid ${AMBER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 30,
                color: AMBER,
                fontWeight: 700,
                opacity: numEnter(i),
                transform: `translateY(${(1 - numEnter(i)) * -14}px)`,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 22, color: "#5D6D7E" }}>
          机器能消化的数字
        </div>
      </div>

      {/* 底部流程脚注 */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - footerEnter) * 16}px)`,
          opacity: footerEnter,
          display: "flex",
          alignItems: "center",
          gap: 30,
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 34,
          color: INK,
        }}
      >
        <span style={{ color: BLUE }}>文字</span>
        <span style={{ color: AMBER }}>→</span>
        <span style={{ color: AMBER }}>切块</span>
        <span style={{ color: AMBER }}>→</span>
        <span style={{ color: "#2D5A3D" }}>编号</span>
      </div>
    </AbsoluteFill>
  );
};

export default Scene002;
