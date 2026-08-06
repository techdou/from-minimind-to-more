import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Scissors, Sigma, Gauge } from "lucide-react";

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

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

/**
 * scene_006 — RMSNorm 是 LayerNorm 的极简版
 * 主视觉：两行公式对比 + 琥珀删除线划掉「减均值」
 */
const Scene006: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = segments[0];
  const startF = msToFrame(seg.relativeStart, fps);

  // 入场节点（固定短窗，8-16 帧）
  const enter = (offset: number, len = 12) => {
    const s = spring({ frame: frame - startF - offset, fps, config: { damping: 16, stiffness: 130 } });
    const o = interpolate(frame, [startF + offset, startF + offset + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return Math.min(s, o);
  };

  const layerNormIn = enter(0); // 上排整行
  const step1In = enter(8); // 减均值步骤
  const step2In = enter(14); // 除标准差步骤
  const strikeIn = interpolate(frame, [startF + 30, startF + 30 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // 删除线贯穿
  const rmsIn = enter(52); // 下排 RMSNorm
  const anchorIn = enter(64);

  const strikeScaleX = strikeIn;

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
          gap: 70,
          fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
          color: INK,
        }}
      >
        {/* 上排：LayerNorm 完整公式 */}
        <div
          style={{
            opacity: layerNormIn,
            transform: `translateY(${(1 - layerNormIn) * 24}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          {/* 标题色块 */}
          <div
            style={{
              padding: "12px 34px",
              border: `3px solid ${INK}`,
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              background: CREAM,
              fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "0.05em",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            LayerNorm
          </div>

          {/* 公式两步 */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {/* ① 减均值 */}
            <div
              style={{
                position: "relative",
                opacity: step1In,
                transform: `scale(${0.85 + step1In * 0.15})`,
                padding: "18px 26px",
                background: AMBER_SOFT,
                border: `2px solid ${INK}`,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
                minWidth: 280,
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -14,
                  left: -14,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: AMBER,
                  border: `2px solid ${INK}`,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                1
              </span>
              <Sigma size={26} color={AMBER} strokeWidth={2.4} />
              <span style={{ fontSize: 38, fontFamily: "'STKaiti', serif" }}>x − μ</span>

              {/* 删除线 */}
              <span
                style={{
                  position: "absolute",
                  left: "6%",
                  right: "6%",
                  top: "50%",
                  height: 6,
                  background: AMBER,
                  borderRadius: 4,
                  transform: `scaleX(${strikeScaleX})`,
                  transformOrigin: "left center",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                }}
              />
            </div>

            <span style={{ fontSize: 44, fontWeight: 700 }}>→</span>

            {/* ② 除标准差 */}
            <div
              style={{
                opacity: step2In,
                transform: `scale(${0.85 + step2In * 0.15})`,
                padding: "18px 26px",
                background: "#FFFDF7",
                border: `2px solid ${INK}`,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
                minWidth: 280,
                justifyContent: "center",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -14,
                  left: -14,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: AMBER,
                  border: `2px solid ${INK}`,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                2
              </span>
              <Gauge size={26} color={AMBER} strokeWidth={2.4} />
              <span style={{ fontSize: 38, fontFamily: "'STKaiti', serif" }}>÷ σ</span>
            </div>
          </div>
        </div>

        {/* 中间分隔 + 剪刀语义 */}
        <div
          style={{
            opacity: strikeIn,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Scissors size={34} color={AMBER} strokeWidth={2.4} />
          <span style={{ fontSize: 30, color: AMBER, fontWeight: 700, letterSpacing: "0.08em" }}>
            省掉均值
          </span>
        </div>

        {/* 下排：RMSNorm 简化公式 */}
        <div
          style={{
            opacity: rmsIn,
            transform: `translateY(${(1 - rmsIn) * 28}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              padding: "12px 34px",
              border: `3px solid ${AMBER}`,
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              background: AMBER,
              color: "#fff",
              fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "0.05em",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.15)",
            }}
          >
            RMSNorm
          </div>

          <div
            style={{
              padding: "20px 40px",
              background: "#FFFDF7",
              border: `3px solid ${AMBER}`,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow: "5px 5px 0 rgba(180,83,9,0.25)",
            }}
          >
            <Gauge size={30} color={AMBER} strokeWidth={2.4} />
            <span style={{ fontSize: 46, fontFamily: "'STKaiti', serif", color: INK }}>÷ RMS</span>
            <span style={{ fontSize: 22, color: "#7a7a7a", marginLeft: 8 }}>仅缩放</span>
          </div>
        </div>

        {/* 底部锚点 */}
        <div
          style={{
            opacity: anchorIn,
            marginTop: 6,
            padding: "10px 28px",
            background: AMBER_SOFT,
            border: `2px solid ${AMBER}`,
            borderRadius: 999,
            fontSize: 26,
            color: AMBER,
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          更快 · 仅保留缩放
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene006;
