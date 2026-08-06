import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { BadgeCheck, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

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
 * scene_009 — 面试题引入：Pre-Norm vs Post-Norm
 * 左右并列双标题 + 左上角「面试题」标签
 */
const Scene009: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = segments[0];
  const startF = msToFrame(seg.relativeStart, fps);

  const tagIn = spring({ frame: frame - startF, fps, config: { damping: 12, stiffness: 140 } });
  const leftIn = interpolate(frame, [startF + 8, startF + 8 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightIn = interpolate(frame, [startF + 16, startF + 16 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftSlide = spring({ frame: frame - startF - 8, fps, config: { damping: 16, stiffness: 90 } });
  const rightSlide = spring({ frame: frame - startF - 16, fps, config: { damping: 16, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
          color: INK,
        }}
      >
        {/* 左上角「面试题」标签 */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 120,
            opacity: tagIn,
            transform: `scale(${0.6 + tagIn * 0.4}) rotate(${(1 - tagIn) * -25}deg)`,
            padding: "14px 30px",
            background: AMBER,
            border: `3px solid ${INK}`,
            borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
            color: "#fff",
            fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "0.1em",
            boxShadow: "5px 5px 0 rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <BadgeCheck size={28} strokeWidth={2.6} />
          面试题
        </div>

        {/* 左右并列双标题 */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {/* 左：Pre-Norm */}
          <div
            style={{
              opacity: leftIn,
              transform: `translateX(${(1 - leftSlide) * -60}px)`,
              width: 560,
              padding: "60px 50px",
              background: CREAM,
              border: `3px solid ${AMBER}`,
              borderRight: "none",
              borderRadius: "20px 0 0 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              boxShadow: "5px 5px 0 rgba(180,83,9,0.18)",
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: AMBER,
                border: `3px solid ${INK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowUpFromLine size={48} color="#fff" strokeWidth={2.4} />
            </div>
            <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 56, fontWeight: 700, color: INK, letterSpacing: "0.04em" }}>
              Pre-Norm
            </div>
            <div
              style={{
                padding: "6px 20px",
                background: AMBER_SOFT,
                border: `2px solid ${AMBER}`,
                borderRadius: 999,
                fontSize: 24,
                color: AMBER,
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              现在主流
            </div>
          </div>

          {/* 中央分隔 */}
          <div
            style={{
              width: 6,
              alignSelf: "stretch",
              background: `repeating-linear-gradient(180deg, ${INK} 0 10px, transparent 10px 20px)`,
            }}
          />

          {/* 右：Post-Norm */}
          <div
            style={{
              opacity: rightIn,
              transform: `translateX(${(1 - rightSlide) * 60}px)`,
              width: 560,
              padding: "60px 50px",
              background: CREAM,
              border: `3px solid ${INK}`,
              borderLeft: "none",
              borderRadius: "0 20px 20px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              boxShadow: "5px 5px 0 rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "#FFFDF7",
                border: `3px solid ${INK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowDownToLine size={48} color={INK} strokeWidth={2.4} />
            </div>
            <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 56, fontWeight: 700, color: INK, letterSpacing: "0.04em" }}>
              Post-Norm
            </div>
            <div
              style={{
                padding: "6px 20px",
                background: "#FFFDF7",
                border: `2px solid ${INK}`,
                borderRadius: 999,
                fontSize: 24,
                color: "#5D6D7E",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              原始做法
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene009;
