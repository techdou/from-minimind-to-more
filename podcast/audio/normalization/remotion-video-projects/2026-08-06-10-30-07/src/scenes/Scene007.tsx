import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Scale, HelpCircle, Cog, Zap } from "lucide-react";

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

const msToFrame = (ms: number, fps: number) => (ms / 1000) * fps;

/**
 * scene_007 — 疑问主视觉：省一点点计算有意义吗？
 * 天平（权衡）+ 大问号（疑问）
 */
const Scene007: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = segments[0];
  const startF = msToFrame(seg.relativeStart, fps);

  // 天平弹入（短窗）
  const scaleIn = spring({ frame: frame - startF, fps, config: { damping: 12, stiffness: 110 } });
  // 天平轻微摇晃（贯穿整段，体现权衡）
  const sway = Math.sin((frame - startF) * 0.16) * 4 * Math.min(1, Math.max(0, (frame - startF) / 8));
  // 问号淡入
  const qIn = interpolate(frame, [startF + 10, startF + 10 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qPop = spring({ frame: frame - startF - 10, fps, config: { damping: 9, stiffness: 140 } });
  // 底部锚点
  const anchorIn = interpolate(frame, [startF + 28, startF + 28 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        {/* 主视觉：天平 + 问号 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: scaleIn,
            transform: `translateY(${(1 - scaleIn) * 30}px) scale(${0.8 + scaleIn * 0.2})`,
          }}
        >
          {/* 天平主体 */}
          <div
            style={{
              transform: `rotate(${sway}deg)`,
              transformOrigin: "center 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Scale size={300} color={INK} strokeWidth={2.2} />
            {/* 托盘上的小物（左右对比） */}
            <div style={{ position: "relative", width: 320, height: 0, marginTop: -200 }}>
              <div style={{ position: "absolute", left: 6, top: -10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Cog size={40} color={AMBER} strokeWidth={2.2} />
                <span style={{ fontSize: 18, color: "#7a7a7a" }}>计算</span>
              </div>
              <div style={{ position: "absolute", right: 6, top: -10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Zap size={40} color={AMBER} strokeWidth={2.2} />
                <span style={{ fontSize: 18, color: "#7a7a7a" }}>速度</span>
              </div>
            </div>
          </div>

          {/* 大问号浮在天平右上 */}
          <div
            style={{
              position: "absolute",
              top: -70,
              right: -90,
              opacity: qIn,
              transform: `scale(${0.5 + qPop * 0.5}) rotate(${(1 - qPop) * -20}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: RED,
                border: `4px solid ${INK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "6px 6px 0 rgba(0,0,0,0.18)",
              }}
            >
              <HelpCircle size={84} color="#fff" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* 底部锚点：短问句 */}
        <div
          style={{
            opacity: anchorIn,
            transform: `translateY(${(1 - anchorIn) * 16}px)`,
            padding: "16px 56px",
            background: AMBER_SOFT,
            borderTop: `4px solid ${AMBER}`,
            borderBottom: `4px solid ${AMBER}`,
            fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
            fontSize: 44,
            fontWeight: 700,
            color: AMBER,
            letterSpacing: "0.1em",
          }}
        >
          这点差别，值得吗？
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene007;
