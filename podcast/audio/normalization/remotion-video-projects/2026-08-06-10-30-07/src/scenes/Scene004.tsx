import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { X, Box, Layers } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const AMBER = "#B45309";
const BEIGE = "#FAF9F7";
const INK = "#2C3E50";
const RED_SOFT = "#C0392B";
const GRAY_SOFT = "#9CA3AF";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const Scene004: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0 = segments[0];
  const beatStart = msToFrame(seg0.relativeStart, fps);

  // 三栏面板依次淡入
  const panel = (delay: number) =>
    spring({
      frame: frame - (beatStart + delay),
      fps,
      config: { damping: 200 },
      durationInFrames: 14,
    });
  const panelA = panel(0);
  const panelB = panel(6);
  const panelC = panel(12);

  // 左栏两条缺陷项错峰出现
  const flaw1 = interpolate(frame, [beatStart + 18, beatStart + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flaw2 = interpolate(frame, [beatStart + 26, beatStart + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 中栏单样本自环描边绘出
  const ringDraw = interpolate(frame, [beatStart + 38, beatStart + 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 右栏琥珀印章盖章
  const stampDelay = beatStart + 60;
  const stampEnter = spring({
    frame: frame - stampDelay,
    fps,
    config: { damping: 10, stiffness: 130 },
    durationInFrames: 16,
  });
  const stampPulse =
    1 + 0.04 * Math.sin((frame - stampDelay) * 0.2) * (frame > stampDelay + 16 ? 1 : 0);

  const cardStyle: React.CSSProperties = {
    background: BEIGE,
    borderRadius: 20,
    border: "2px solid rgba(44,62,80,0.18)",
    boxShadow: "0 10px 30px rgba(44,62,80,0.10)",
    padding: "28px 28px",
    height: 600,
    display: "flex",
    flexDirection: "column",
  };

  const colTitle = (n: number, text: string, color = INK) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: AMBER,
          border: `3px solid ${INK}`,
          color: BEIGE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "ZCOOL KuaiLe, cursive",
          fontSize: 26,
          fontWeight: 700,
          boxShadow: "3px 3px 0 rgba(44,62,80,0.15)",
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
          fontSize: 38,
          fontWeight: 700,
          color,
        }}
      >
        {text}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 三栏容器 */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 90,
          right: 90,
          display: "flex",
          gap: 36,
          alignItems: "stretch",
        }}
      >
        {/* 左栏：BatchNorm 硬伤 */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            opacity: panelA,
            transform: `translateY(${interpolate(panelA, [0, 1], [24, 0])}px)`,
          }}
        >
          {colTitle(1, "BatchNorm 硬伤", RED_SOFT)}

          {/* 缺陷 1 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              opacity: flaw1,
              transform: `translateX(${interpolate(flaw1, [0, 1], [-20, 0])}px)`,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#FDEDEC",
                border: `2px solid ${RED_SOFT}`,
                color: RED_SOFT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={26} strokeWidth={3} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Comic Sans MS', monospace",
                  fontSize: 30,
                  fontWeight: 700,
                  color: INK,
                }}
              >
                padding
              </div>
              <div
                style={{
                  fontFamily: "ZCOOL KuaiLe, cursive",
                  fontSize: 22,
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                长度不齐 · 污染统计
              </div>
            </div>
          </div>

          {/* 缺陷 2 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              opacity: flaw2,
              transform: `translateX(${interpolate(flaw2, [0, 1], [-20, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#FDEDEC",
                border: `2px solid ${RED_SOFT}`,
                color: RED_SOFT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={26} strokeWidth={3} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Comic Sans MS', monospace",
                  fontSize: 30,
                  fontWeight: 700,
                  color: INK,
                }}
              >
                batch = 1
              </div>
              <div
                style={{
                  fontFamily: "ZCOOL KuaiLe, cursive",
                  fontSize: 22,
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                样本太少 · 统计不准
              </div>
            </div>
          </div>

          {/* 小图标装饰 */}
          <div style={{ marginTop: "auto", display: "flex", gap: 12, opacity: 0.5 }}>
            <Box size={28} strokeWidth={2.2} style={{ color: GRAY_SOFT }} />
            <Layers size={28} strokeWidth={2.2} style={{ color: GRAY_SOFT }} />
          </div>
        </div>

        {/* VS 中分标记 */}
        <div
          style={{
            alignSelf: "center",
            fontFamily: "ZCOOL KuaiLe, cursive",
            fontSize: 34,
            fontWeight: 700,
            color: GRAY_SOFT,
            opacity: interpolate(frame, [beatStart + 30, beatStart + 40], [0, 0.8], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          VS
        </div>

        {/* 中栏：LayerNorm 单样本 */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            opacity: panelB,
            transform: `translateY(${interpolate(panelB, [0, 1], [24, 0])}px)`,
            alignItems: "center",
          }}
        >
          {colTitle(2, "LayerNorm", AMBER)}

          {/* 单样本自环示意 */}
          <div style={{ position: "relative", width: 260, height: 260, marginTop: 16 }}>
            <svg viewBox="0 0 260 260" width={260} height={260}>
              {/* 自环箭头（不使用真箭头连接两物，仅表示自回环） */}
              <circle
                cx="130"
                cy="130"
                r="92"
                fill="none"
                stroke={AMBER}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="6 8"
                pathLength={1}
                strokeDashoffset={1 - ringDraw}
                opacity={0.7}
              />
              {/* 中心样本节点 */}
              <circle
                cx="130"
                cy="130"
                r="56"
                fill={BEIGE}
                stroke={AMBER}
                strokeWidth="5"
                opacity={ringDraw}
              />
              <text
                x="130"
                y="124"
                textAnchor="middle"
                fontFamily="ZCOOL KuaiLe, cursive"
                fontSize="30"
                fontWeight="700"
                fill={INK}
                opacity={ringDraw}
              >
                单样本
              </text>
              <text
                x="130"
                y="158"
                textAnchor="middle"
                fontFamily="'Comic Sans MS', cursive"
                fontSize="18"
                fill="#6B7280"
                opacity={ringDraw}
              >
                self
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 18,
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 24,
              color: AMBER,
              fontWeight: 700,
              opacity: ringDraw,
              textAlign: "center",
            }}
          >
            与 batch 无关
          </div>
        </div>

        {/* 右栏：琥珀结论印章 */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            opacity: panelC,
            transform: `translateY(${interpolate(panelC, [0, 1], [24, 0])}px)`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {colTitle(3, "结论", INK)}

          <div
            style={{
              marginTop: 20,
              transform: `rotate(-12deg) scale(${(0.5 + stampEnter * 0.5) * stampPulse})`,
              opacity: stampEnter,
              width: 280,
              height: 280,
              borderRadius: "50%",
              border: `5px dashed ${AMBER}`,
              outline: `5px solid ${AMBER}`,
              outlineOffset: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: AMBER,
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontWeight: 700,
              textAlign: "center",
              padding: 20,
            }}
          >
            <div style={{ fontSize: 30, lineHeight: 1.1 }}>NLP 用</div>
            <div style={{ fontSize: 44, lineHeight: 1.1, marginTop: 6 }}>LayerNorm</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene004;
