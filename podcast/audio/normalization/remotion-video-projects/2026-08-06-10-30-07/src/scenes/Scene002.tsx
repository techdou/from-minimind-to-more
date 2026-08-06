import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Volume2, Gauge, Sparkles } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const AMBER = "#B45309";
const AMBER_SOFT = "#F59E0B";
const BEIGE = "#FAF9F7";
const INK = "#2C3E50";
const RED_SOFT = "#C0392B";
const GRAY_SOFT = "#9CA3AF";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const Scene002: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0 = segments[0];
  const beatStart = msToFrame(seg0.relativeStart, fps);

  // 两区面板短窗淡入
  const panelEnter = spring({
    frame: frame - beatStart,
    fps,
    config: { damping: 200 },
    durationInFrames: 14,
  });
  const rightPanelEnter = spring({
    frame: frame - (beatStart + 4),
    fps,
    config: { damping: 200 },
    durationInFrames: 14,
  });

  // 信号柱逐根点亮：8 层
  const layers = 8;
  const explodeBase = beatStart + 12;
  const explodeBars = Array.from({ length: layers }, (_, i) => {
    const start = explodeBase + i * 4;
    return interpolate(frame, [start, start + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });
  const vanishBase = beatStart + 14;
  const vanishBars = Array.from({ length: layers }, (_, i) => {
    const start = vanishBase + i * 4;
    return interpolate(frame, [start, start + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  // 旋钮指针归位
  const knobStart = beatStart + 50;
  const knobProgress = spring({
    frame: frame - knobStart,
    fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 22,
  });
  // 指针从 -55deg(偏左偏低) 旋回到 0deg(正常区)
  const needleAngle = interpolate(knobProgress, [0, 1], [-55, 0]);

  // 底部结论胶囊
  const conclusionDelay = beatStart + 74;
  const conclusionEnter = spring({
    frame: frame - conclusionDelay,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 14,
  });

  // 爆炸柱高度（逐层放大）和消失柱高度（逐层缩小）
  const explodeBarHeight = (i: number) => 30 + i * 24; // 30 -> 198
  const vanishBarHeight = (i: number) => Math.max(8, 30 - i * 3.2); // 30 -> 7.6

  const starOp = (phase: number) =>
    0.3 + 0.5 * Math.sin(frame * 0.13 + phase) * (frame > beatStart + 6 ? 1 : 0);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 左区：信号传播 */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 140,
          width: 760,
          height: 720,
          opacity: panelEnter,
          transform: `translateY(${interpolate(panelEnter, [0, 1], [20, 0])}px)`,
          background: BEIGE,
          borderRadius: 24,
          border: `2px solid rgba(44,62,80,0.18)`,
          boxShadow: "0 10px 30px rgba(44,62,80,0.10)",
          padding: "36px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 8,
              height: 36,
              background: AMBER,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 42,
              fontWeight: 700,
              color: INK,
            }}
          >
            信号传播
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Comic Sans MS', cursive",
            fontSize: 20,
            color: "#6B7280",
            marginBottom: 22,
          }}
        >
          深层网络逐层传递
        </div>

        {/* 爆炸柱组 */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 24,
              color: RED_SOFT,
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            爆炸 ↑
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 210 }}>
            {explodeBars.map((p, i) => (
              <div
                key={`ex-${i}`}
                style={{
                  width: 44,
                  height: explodeBarHeight(i) * p,
                  background: `linear-gradient(180deg, ${RED_SOFT} 0%, #E67E22 100%)`,
                  borderRadius: "8px 8px 4px 4px",
                  border: `2px solid ${INK}`,
                  boxShadow: "3px 3px 0 rgba(44,62,80,0.12)",
                }}
              />
            ))}
          </div>
        </div>

        {/* 消失柱组 */}
        <div>
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 24,
              color: GRAY_SOFT,
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            消失 ↓
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 60 }}>
            {vanishBars.map((p, i) => (
              <div
                key={`va-${i}`}
                style={{
                  width: 44,
                  height: vanishBarHeight(i) * p,
                  background: GRAY_SOFT,
                  borderRadius: "6px 6px 3px 3px",
                  border: `2px solid ${INK}`,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 右区：调音量旋钮 */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 140,
          width: 760,
          height: 720,
          opacity: rightPanelEnter,
          transform: `translateY(${interpolate(rightPanelEnter, [0, 1], [20, 0])}px)`,
          background: BEIGE,
          borderRadius: 24,
          border: `2px solid rgba(44,62,80,0.18)`,
          boxShadow: "0 10px 30px rgba(44,62,80,0.10)",
          padding: "36px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, alignSelf: "flex-start" }}>
          <div style={{ width: 8, height: 36, background: AMBER, borderRadius: 4 }} />
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 42,
              fontWeight: 700,
              color: INK,
            }}
          >
            调音量
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Comic Sans MS', cursive",
            fontSize: 20,
            color: "#6B7280",
            marginBottom: 18,
            alignSelf: "flex-start",
          }}
        >
          归一化把信号拉回正常
        </div>

        {/* 半圆刻度表盘 */}
        <div style={{ position: "relative", width: 420, height: 280, marginTop: 12 }}>
          <svg viewBox="0 0 420 280" width={420} height={280}>
            {/* 背景弧 */}
            <path
              d="M 40 240 A 170 170 0 0 1 380 240"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="34"
              strokeLinecap="round"
            />
            {/* 琥珀正常区间弧 (中间约 40%) */}
            <path
              d="M 155 96 A 170 170 0 0 1 265 96"
              fill="none"
              stroke={AMBER}
              strokeWidth="38"
              strokeLinecap="round"
            />
            {/* 刻度短线 */}
            {[-90, -60, -30, 0, 30, 60, 90].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 210 + Math.sin(rad) * 150;
              const y1 = 240 - Math.cos(rad) * 150;
              const x2 = 210 + Math.sin(rad) * 168;
              const y2 = 240 - Math.cos(rad) * 168;
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={INK}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            {/* 指针 */}
            <g transform={`rotate(${needleAngle} 210 240)`}>
              <line
                x1="210"
                y1="240"
                x2="210"
                y2="90"
                stroke={INK}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="210" cy="240" r="18" fill={INK} />
              <circle cx="210" cy="240" r="8" fill={AMBER} />
            </g>
          </svg>
          {/* 正常标签 */}
          <div
            style={{
              position: "absolute",
              top: 60,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 28,
              fontWeight: 700,
              color: AMBER,
              textShadow: "2px 2px 0 rgba(255,255,255,0.6)",
            }}
          >
            正常
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 4,
            color: INK,
          }}
        >
          <Volume2 size={32} strokeWidth={2.4} style={{ color: AMBER }} />
          <Gauge size={30} strokeWidth={2.4} style={{ color: "#6B7280" }} />
        </div>
      </div>

      {/* 底部结论胶囊 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${0.8 + conclusionEnter * 0.2}) translateY(${interpolate(conclusionEnter, [0, 1], [20, 0])}px)`,
          opacity: conclusionEnter,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 44px",
          borderRadius: 9999,
          background: AMBER,
          border: `3px solid ${INK}`,
          color: BEIGE,
          fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
          fontSize: 36,
          fontWeight: 700,
          boxShadow: "5px 5px 0 rgba(44,62,80,0.18)",
          letterSpacing: "0.04em",
        }}
      >
        <Sparkles size={26} strokeWidth={2.4} />
        归位 · 训练稳定
      </div>

      {/* 装饰星点 */}
      <Sparkles
        size={22}
        strokeWidth={2.4}
        style={{ position: "absolute", top: 80, left: "50%", color: AMBER, opacity: starOp(0) }}
      />
    </AbsoluteFill>
  );
};

export default Scene002;
