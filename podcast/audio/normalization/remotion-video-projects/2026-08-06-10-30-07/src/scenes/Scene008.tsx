import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Cog, Layers, Cpu, Boxes } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const AMBER = "#B45309";
const AMBER_SOFT = "#FCE9CC";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";

const msToFrame = (ms: number, fps: number) => (ms / 1000) * fps;

/**
 * scene_008 — 累积效应 + 主流模型都用 RMSNorm
 * 左→右累积放大：单层省一点 → 几千亿 token → Gemma/LLaMA/Mistral
 */
const Scene008: React.FC<{ segments: Segment[] }> = ({ segments }) => {
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

  // 三级累积柱体（贯穿整段的持续性放大，体现累积）
  const segDur = msToFrame(seg.relativeDuration, fps);
  const accum = interpolate(frame, [startF, startF + segDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const card1 = pop(0); // 单层小卡片
  const bar1H = 40 + enter(10) * 30;
  const bar2H = 60 + enter(20) * 110;
  const bar3H = 90 + accum * 230; // 贯穿整段持续放大
  const bigNumIn = enter(36, 16); // 大数字
  const modelIn = (i: number) => enter(54 + i * 8, 12);
  const anchorIn = enter(86);

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
          gap: 30,
          fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
          color: INK,
        }}
      >
        {/* 主视觉：左→右累积链 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
          {/* 单层小卡片 */}
          <div
            style={{
              opacity: card1,
              transform: `translateY(${(1 - card1) * 20}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "16px 22px",
              background: CREAM,
              border: `2px solid ${INK}`,
              borderRadius: 12,
              boxShadow: "3px 3px 0 rgba(0,0,0,0.12)",
            }}
          >
            <Cog size={40} color={INK} strokeWidth={2.2} />
            <span style={{ fontSize: 22, fontWeight: 700 }}>单层</span>
            <span style={{ fontSize: 16, color: "#7a7a7a" }}>省一点</span>
          </div>

          <span style={{ fontSize: 40, color: AMBER, fontWeight: 700, marginBottom: 40 }}>×</span>

          {/* 累积柱体区 */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 320 }}>
            {[bar1H, bar2H, bar3H].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 64,
                  height: h,
                  background: `linear-gradient(180deg, ${AMBER} 0%, #d97706 100%)`,
                  border: `2px solid ${INK}`,
                  borderRadius: "8px 8px 2px 2px",
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.12)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: 8,
                }}
              >
                {i === 2 && <Layers size={24} color="#fff" strokeWidth={2.4} />}
              </div>
            ))}
          </div>

          <span style={{ fontSize: 40, color: AMBER, fontWeight: 700, marginBottom: 40 }}>=</span>

          {/* 大数字结果 */}
          <div
            style={{
              opacity: bigNumIn,
              transform: `scale(${0.8 + bigNumIn * 0.2})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "18px 30px",
              background: AMBER,
              border: `3px solid ${INK}`,
              borderRadius: 16,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 64, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              几千亿
            </div>
            <div style={{ fontSize: 24, color: "#fff", letterSpacing: "0.15em", opacity: 0.95 }}>TOKEN 累积</div>
            <Boxes size={30} color="#fff" strokeWidth={2.4} />
          </div>
        </div>

        {/* 三个模型徽标 */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 10 }}>
          {[
            { name: "Gemma", icon: Cpu },
            { name: "LLaMA", icon: Cpu },
            { name: "Mistral", icon: Cpu },
          ].map((m, i) => {
            const Icon = m.icon;
            const e = modelIn(i);
            return (
              <div
                key={m.name}
                style={{
                  opacity: e,
                  transform: `translateY(${(1 - e) * 18}px) scale(${0.85 + e * 0.15})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 24px",
                  background: "#FFFDF7",
                  border: `2px solid ${AMBER}`,
                  borderRadius: 999,
                  boxShadow: "3px 3px 0 rgba(180,83,9,0.2)",
                }}
              >
                <Icon size={24} color={AMBER} strokeWidth={2.4} />
                <span style={{ fontSize: 28, fontFamily: "'ZCOOL KuaiLe', cursive", fontWeight: 700, color: INK }}>
                  {m.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* 底部锚点 */}
        <div
          style={{
            opacity: anchorIn,
            marginTop: 14,
            padding: "10px 30px",
            background: AMBER_SOFT,
            border: `2px solid ${AMBER}`,
            borderRadius: 999,
            fontSize: 26,
            color: AMBER,
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          务实之选 · 都用 RMSNorm
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene008;
