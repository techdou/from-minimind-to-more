import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Plus, Gauge, AlertTriangle, ShieldCheck } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const AMBER = "#B45309";
const AMBER_SOFT = "#FCE9CC";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";
const RED = "#E74C3C";
const GREEN = "#2D5A3D";

const msToFrame = (ms: number, fps: number) => (ms / 1000) * fps;

/**
 * scene_010 — Pre-Norm vs Post-Norm 结构图对比
 * 左 Post-Norm（归一化在后，不稳）｜右 Pre-Norm（归一化在前，稳定）
 * 底部结论条：大模型用 Pre-Norm
 */
const Scene010: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = segments[0];
  const startF = msToFrame(seg.relativeStart, fps);

  const enter = (offset: number, len = 12) =>
    interpolate(frame, [startF + offset, startF + offset + len], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const pop = (offset: number) =>
    spring({ frame: frame - startF - offset, fps, config: { damping: 14, stiffness: 130 } });

  // 左侧 Post-Norm 节点
  const lBoxIn = (i: number) => pop(0 + i * 8);
  const lColIn = enter(0);
  const lNoteIn = enter(34);
  // 右侧 Pre-Norm 节点
  const rBoxIn = (i: number) => pop(20 + i * 8);
  const rColIn = enter(8);
  const rNoteIn = enter(54);
  // 底部结论条
  const conclIn = interpolate(frame, [startF + 70, startF + 70 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const conclSlide = spring({ frame: frame - startF - 70, fps, config: { damping: 16, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
          fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
          color: INK,
        }}
      >
        {/* 双栏对比 */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 50 }}>
          {/* 左栏：Post-Norm */}
          <div
            style={{
              width: 720,
              padding: "34px 36px 40px",
              background: CREAM,
              border: `3px solid ${INK}`,
              borderRadius: 18,
              opacity: lColIn,
              transform: `translateY(${(1 - lColIn) * 20}px)`,
              boxShadow: "5px 5px 0 rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 40, fontWeight: 700, color: INK }}>
              Post-Norm
            </div>
            <div style={{ fontSize: 20, color: "#7a7a7a" }}>归一化在残差相加之后</div>

            {/* 结构图：子层 → 相加 → 归一化 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <NormNode label="子层" bg="#FFFDF7" color={INK} inVal={lBoxIn(0)} />
              <PlusChip inVal={lBoxIn(1)} color={INK} />
              <NormNode label="相加" bg={AMBER_SOFT} color={INK} inVal={lBoxIn(1)} />
              <PlusChip inVal={lBoxIn(2)} color={INK} />
              <NormNode label="Norm" bg={AMBER} color="#fff" inVal={lBoxIn(2)} icon={<Gauge size={22} strokeWidth={2.4} />} />
            </div>

            {/* 特性标注 */}
            <div
              style={{
                opacity: lNoteIn,
                transform: `translateY(${(1 - lNoteIn) * 12}px)`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 20px",
                background: "#FDEDEC",
                border: `2px solid ${RED}`,
                borderRadius: 999,
                color: RED,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              <AlertTriangle size={24} strokeWidth={2.4} />
              训练不稳 · 易发散
            </div>
          </div>

          {/* 右栏：Pre-Norm（琥珀强调） */}
          <div
            style={{
              width: 720,
              padding: "34px 36px 40px",
              background: AMBER_SOFT,
              border: `3px solid ${AMBER}`,
              borderRadius: 18,
              opacity: rColIn,
              transform: `translateY(${(1 - rColIn) * 20}px)`,
              boxShadow: "5px 5px 0 rgba(180,83,9,0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 40, fontWeight: 700, color: AMBER }}>
              Pre-Norm
            </div>
            <div style={{ fontSize: 20, color: AMBER }}>归一化在残差相加之前</div>

            {/* 结构图：Norm → 子层 → 相加 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <NormNode label="Norm" bg={AMBER} color="#fff" inVal={rBoxIn(0)} icon={<Gauge size={22} strokeWidth={2.4} />} />
              <PlusChip inVal={rBoxIn(1)} color={AMBER} />
              <NormNode label="子层" bg={CREAM} color={INK} inVal={rBoxIn(1)} />
              <PlusChip inVal={rBoxIn(2)} color={AMBER} />
              <NormNode label="相加" bg="#FFFDF7" color={INK} inVal={rBoxIn(2)} />
            </div>

            {/* 特性标注 */}
            <div
              style={{
                opacity: rNoteIn,
                transform: `translateY(${(1 - rNoteIn) * 12}px)`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 20px",
                background: "#FFFDF7",
                border: `2px solid ${GREEN}`,
                borderRadius: 999,
                color: GREEN,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              <ShieldCheck size={24} strokeWidth={2.4} />
              训练稳定
            </div>
          </div>
        </div>

        {/* 底部结论条 */}
        <div
          style={{
            opacity: conclIn,
            transform: `translateY(${(1 - conclSlide) * 30}px)`,
            padding: "16px 64px",
            background: AMBER,
            border: `3px solid ${INK}`,
            borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
            color: "#fff",
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "0.1em",
            boxShadow: "6px 6px 0 rgba(0,0,0,0.18)",
          }}
        >
          大模型用 Pre-Norm
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 结构图节点方块 */
const NormNode: React.FC<{
  label: string;
  bg: string;
  color: string;
  inVal: number;
  icon?: React.ReactNode;
}> = ({ label, bg, color, inVal, icon }) => (
  <div
    style={{
      opacity: inVal,
      transform: `scale(${0.7 + inVal * 0.3})`,
      width: 140,
      height: 64,
      background: bg,
      color,
      border: `2px solid ${INK}`,
      borderRadius: 10,
      fontFamily: "'ZCOOL KuaiLe', cursive",
      fontWeight: 700,
      fontSize: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      boxShadow: "2px 2px 0 rgba(0,0,0,0.1)",
    }}
  >
    {icon}
    {label}
  </div>
);

/** 加号连接点 */
const PlusChip: React.FC<{ inVal: number; color: string }> = ({ inVal, color }) => (
  <div
    style={{
      opacity: inVal,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Plus size={26} color={color} strokeWidth={3} />
  </div>
);

export default Scene010;
