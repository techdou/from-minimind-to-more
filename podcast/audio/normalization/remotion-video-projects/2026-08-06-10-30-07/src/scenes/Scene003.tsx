import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Image, Sparkles } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const AMBER = "#B45309";
const BEIGE = "#FAF9F7";
const INK = "#2C3E50";
const GRAY_SOFT = "#9CA3AF";

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const Scene003: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0 = segments[0];
  const beatStart = msToFrame(seg0.relativeStart, fps);

  // 卡片弹性落定
  const cardEnter = spring({
    frame: frame - beatStart,
    fps,
    config: { damping: 11, stiffness: 110 },
    durationInFrames: 16,
  });

  // 问号放大显现
  const qDelay = beatStart + 10;
  const qEnter = spring({
    frame: frame - qDelay,
    fps,
    config: { damping: 9, stiffness: 130 },
    durationInFrames: 14,
  });

  // 问号轻微摆动循环
  const qSway =
    Math.sin((frame - qDelay) * 0.16) * 6 * (frame > qDelay + 14 ? 1 : 0);

  // 圈选绘制
  const circleDraw = interpolate(frame, [qDelay + 8, qDelay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 右侧胶囊 + 下方钩子
  const tagDelay = beatStart + 18;
  const tagEnter = spring({
    frame: frame - tagDelay,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });
  const hookDelay = beatStart + 24;
  const hookEnter = spring({
    frame: frame - hookDelay,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });

  // 星点交错
  const starOp = (phase: number) =>
    0.3 + 0.55 * Math.sin(frame * 0.14 + phase) * (frame > qDelay ? 1 : 0);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 卡片 + 问号组，居中略偏上 */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: "50%",
          transform: `translateX(-50%) rotate(${-3}deg) scale(${0.8 + cardEnter * 0.2})`,
          opacity: cardEnter,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 620,
            background: BEIGE,
            border: `3px solid rgba(44,62,80,0.6)`,
            borderRadius: 12,
            boxShadow: "0 12px 30px rgba(44,62,80,0.18)",
            overflow: "hidden",
            transform: "rotate(1deg)",
          }}
        >
          {/* 顶部彩条 */}
          <div
            style={{
              background: AMBER,
              padding: "14px 28px",
              color: BEIGE,
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.08em",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Image size={22} strokeWidth={2.6} />
            来自 CV 课堂
          </div>
          {/* 横线纹理主体 */}
          <div
            style={{
              padding: "44px 40px 52px",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 33px, rgba(93,173,226,0.35) 33px, rgba(93,173,226,0.35) 34px)",
            }}
          >
            <div
              style={{
                fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                fontSize: 120,
                fontWeight: 700,
                color: INK,
                textAlign: "center",
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}
            >
              BatchNorm
            </div>
          </div>
        </div>
      </div>

      {/* 上方大琥珀问号 */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: "50%",
          transform: `translateX(-50%) translateY(${-30 + qEnter * 30}px) rotate(${qSway - 8}deg) scale(${0.4 + qEnter * 0.6})`,
          opacity: qEnter,
          width: 240,
          height: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 240 240" width={240} height={240}>
          {/* 手绘圈选 */}
          <ellipse
            cx="120"
            cy="120"
            rx="108"
            ry="100"
            fill="none"
            stroke={AMBER}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 8"
            opacity={circleDraw}
            transform="rotate(-3 120 120)"
          />
          <text
            x="120"
            y="180"
            textAnchor="middle"
            fontFamily="ZCOOL KuaiLe, 'Comic Sans MS', cursive"
            fontSize="200"
            fontWeight="700"
            fill={AMBER}
          >
            ?
          </text>
        </svg>
      </div>

      {/* 右侧悬挂胶囊 CV 常用 */}
      <div
        style={{
          position: "absolute",
          top: 360,
          right: 220,
          opacity: tagEnter,
          transform: `translateX(${interpolate(tagEnter, [0, 1], [30, 0])}px) rotate(8deg)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 30px",
            borderRadius: 9999,
            background: BEIGE,
            border: `2px solid ${AMBER}`,
            color: AMBER,
            fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
            fontSize: 30,
            fontWeight: 700,
            boxShadow: "4px 4px 0 rgba(44,62,80,0.15)",
          }}
        >
          CV 常用
        </div>
      </div>

      {/* 下方 NLP ? 对比钩子 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: `translateX(-50%) translateY(${interpolate(hookEnter, [0, 1], [20, 0])}px)`,
          opacity: hookEnter,
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 40px",
          borderRadius: 16,
          border: `2px dashed ${GRAY_SOFT}`,
          color: GRAY_SOFT,
          fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
          fontSize: 38,
          fontWeight: 700,
          background: "rgba(250,249,247,0.5)",
          letterSpacing: "0.06em",
        }}
      >
        NLP ?
      </div>

      {/* 问号周围小星点 */}
      <Sparkles
        size={20}
        strokeWidth={2.4}
        style={{ position: "absolute", top: 110, left: 620, color: AMBER, opacity: starOp(0) }}
      />
      <Sparkles
        size={16}
        strokeWidth={2.4}
        style={{ position: "absolute", top: 160, right: 640, color: AMBER, opacity: starOp(2) }}
      />
      <Sparkles
        size={18}
        strokeWidth={2.4}
        style={{ position: "absolute", top: 230, left: 700, color: AMBER, opacity: starOp(4) }}
      />
    </AbsoluteFill>
  );
};

export default Scene003;
