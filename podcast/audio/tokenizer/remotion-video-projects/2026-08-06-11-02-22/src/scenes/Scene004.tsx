import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const AMBER = "#B45309";
const AMBER_SOFT = "#FCD9A4";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";
const BLUE = "#5DADE2";
const GREEN = "#2D5A3D";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const Scene004: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0].relativeStart, fps);

  // 光谱条横向展开
  const barExpand = interpolate(frame - seg0Start, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 左端：字
  const leftLabelStart = seg0Start + 14;
  const leftEnter = interpolate(frame - leftLabelStart, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 右端：词
  const rightLabelStart = seg0Start + 20;
  const rightEnter = interpolate(frame - rightLabelStart, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 中段：子词点亮
  const midStart = seg0Start + 28;
  const midEnter = spring({ frame: frame - midStart, fps, config: { damping: 14, stiffness: 130 } });

  // 脉冲光圈
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * 4);

  // BPE 印章徽章
  const bpeStart = seg0Start + 42;
  const bpeEnter = spring({ frame: frame - bpeStart, fps, config: { damping: 12, stiffness: 150 } });

  const barY = 420;
  const barLeft = 200;
  const barRight = 1720;
  const barW = (barRight - barLeft) * barExpand;
  const midX = (barLeft + barRight) / 2;
  const leftX = barLeft + 140;
  const rightX = barRight - 140;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* 顶部主题 */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: leftEnter > 0 ? 1 : interpolate(frame - seg0Start, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <span
          style={{
            background: AMBER,
            color: CREAM,
            padding: "10px 36px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 34,
            boxShadow: `4px 4px 0 rgba(0,0,0,0.15)`,
          }}
        >
          折中方案：子词
        </span>
      </div>

      {/* 上层示例色块：左（单字） */}
      <div
        style={{
          position: "absolute",
          left: leftX - 50,
          top: barY - 160,
          opacity: leftEnter,
          transform: `translateY(${(1 - leftEnter) * -16}px)`,
        }}
      >
        <div
          style={{
            width: 100,
            height: 80,
            background: "#EAF4FB",
            border: `3px solid ${BLUE}`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 40,
            color: INK,
          }}
        >
          字
        </div>
      </div>

      {/* 上层示例色块：中（子词） */}
      <div
        style={{
          position: "absolute",
          left: midX - 80,
          top: barY - 170,
          opacity: midEnter,
          transform: `translateY(${(1 - midEnter) * -20}px) scale(${0.9 + midEnter * 0.1})`,
        }}
      >
        <div
          style={{
            width: 160,
            height: 100,
            background: AMBER_SOFT,
            border: `4px solid ${AMBER}`,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 44,
            color: INK,
            boxShadow: `4px 4px 0 rgba(0,0,0,0.15)`,
          }}
        >
          子词
        </div>
      </div>

      {/* 上层示例色块：右（整词） */}
      <div
        style={{
          position: "absolute",
          left: rightX - 80,
          top: barY - 160,
          opacity: rightEnter,
          transform: `translateY(${(1 - rightEnter) * -16}px)`,
        }}
      >
        <div
          style={{
            width: 180,
            height: 80,
            background: "#FDF2E9",
            border: `3px solid ${"#E67E22"}`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 36,
            color: INK,
          }}
        >
          整词
        </div>
      </div>

      {/* 光谱条主体 */}
      <div
        style={{
          position: "absolute",
          left: barLeft,
          top: barY,
          width: barW,
          height: 56,
          borderRadius: 28,
          background: `linear-gradient(90deg, ${BLUE} 0%, ${BLUE}aa 25%, ${AMBER_SOFT} 45%, ${AMBER} 50%, ${AMBER_SOFT} 55%, ${"#E67E22"}aa 75%, ${"#E67E22"} 100%)`,
          border: `4px solid ${INK}`,
          boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
          overflow: "hidden",
        }}
      />

      {/* 中段脉冲光圈 */}
      <div
        style={{
          position: "absolute",
          left: midX - (60 + pulse * 30),
          top: barY - (20 + pulse * 30) + 28,
          width: (120 + pulse * 60),
          height: (120 + pulse * 60),
          borderRadius: "50%",
          border: `4px solid ${AMBER}`,
          opacity: midEnter * (0.6 - pulse * 0.4),
          pointerEvents: "none",
        }}
      />

      {/* 光谱条左端标签：字 */}
      <div
        style={{
          position: "absolute",
          left: leftX - 40,
          top: barY + 70,
          opacity: leftEnter,
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 34,
          color: BLUE,
        }}
      >
        字
      </div>
      <div
        style={{
          position: "absolute",
          left: leftX - 60,
          top: barY + 110,
          opacity: leftEnter,
          fontFamily: "'ZCOOL XiaoWei', serif",
          fontSize: 20,
          color: "#5D6D7E",
        }}
      >
        粒度细
      </div>

      {/* 光谱条中段标签：子词 subword */}
      <div
        style={{
          position: "absolute",
          left: midX - 110,
          top: barY + 70,
          opacity: midEnter,
          transform: `translateY(${(1 - midEnter) * 10}px)`,
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 38,
          color: AMBER,
          fontWeight: 700,
        }}
      >
        子词 subword
      </div>
      <div
        style={{
          position: "absolute",
          left: midX - 50,
          top: barY + 118,
          opacity: midEnter,
          fontFamily: "'ZCOOL XiaoWei', serif",
          fontSize: 22,
          color: AMBER,
        }}
      >
        折中方案
      </div>

      {/* 光谱条右端标签：词 */}
      <div
        style={{
          position: "absolute",
          left: rightX - 30,
          top: barY + 70,
          opacity: rightEnter,
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 34,
          color: "#E67E22",
        }}
      >
        词
      </div>
      <div
        style={{
          position: "absolute",
          left: rightX - 60,
          top: barY + 110,
          opacity: rightEnter,
          fontFamily: "'ZCOOL XiaoWei', serif",
          fontSize: 20,
          color: "#5D6D7E",
        }}
      >
        粒度粗
      </div>

      {/* 下层 BPE 印章徽章 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 800,
          transform: `translateX(-50%) scale(${bpeEnter}) rotate(${-12 + (1 - bpeEnter) * 30}deg)`,
          opacity: bpeEnter,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `5px dashed ${AMBER}`,
            outline: `5px solid ${AMBER}`,
            outlineOffset: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: CREAM,
          }}
        >
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 64, color: AMBER, fontWeight: 700, lineHeight: 1 }}>
            BPE
          </div>
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 20, color: INK, marginTop: 6 }}>
            主流算法
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene004;
