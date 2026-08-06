import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Lightbulb, Sparkles } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const AMBER = "#B45309";
const AMBER_SOFT = "#FCD9A4";
const YELLOW_MARK = "rgba(245, 176, 65, 0.55)";
const CREAM = "#FAF9F7";
const TEXT_DARK = "#2C3E50";
const TEXT_MEDIUM = "#5D6D7E";

const msToFrame = (ms: number, fps: number) => (ms / 1000) * fps;

const Scene009: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0]?.relativeStart ?? 0, fps);

  // Avatar circle pop
  const avatarEnter = spring({
    frame: frame - seg0Start,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: 14,
  });

  // Bulb lights up after avatar
  const bulbStart = seg0Start + 8;
  const bulbEnter = interpolate(frame, [bulbStart, bulbStart + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bulbPulse = 1 + Math.sin((frame - bulbStart - 6) * 0.14) * 0.06;
  const bulbGlow = (Math.sin((frame - bulbStart - 6) * 0.14) + 1) * 0.5;

  // 成本 keyword enters
  const keywordStart = seg0Start + 18;
  const keywordEnter = spring({
    frame: frame - keywordStart,
    fps,
    config: { damping: 11, stiffness: 120 },
    durationInFrames: 16,
  });

  // Marker underline draws left to right
  const markerProgress = interpolate(
    frame,
    [keywordStart + 10, keywordStart + 26],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtitle fade
  const subOpacity = interpolate(
    frame,
    [keywordStart + 24, keywordStart + 36],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Sparkles staggered
  const sparkleBase = keywordStart + 30;

  const centerY = DESIGN_HEIGHT / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 120,
          paddingLeft: 200,
        }}
      >
        {/* Left: avatar + bulb */}
        <div
          style={{
            position: "relative",
            width: 360,
            height: 360,
            transform: `scale(${0.7 + 0.3 * avatarEnter})`,
            opacity: avatarEnter,
          }}
        >
          {/* Avatar circle */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `4px solid ${AMBER}`,
              background: `linear-gradient(160deg, ${CREAM} 0%, ${AMBER_SOFT} 100%)`,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <BingtangAvatar />
          </div>

          {/* Name tag */}
          <div
            style={{
              position: "absolute",
              bottom: -18,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "6px 24px",
              background: AMBER,
              color: CREAM,
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 26,
              borderRadius: 999,
              border: `2px solid ${TEXT_DARK}`,
              letterSpacing: "0.08em",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.14)",
            }}
          >
            冰糖
          </div>

          {/* Lightbulb above avatar */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -70,
              transform: `translateX(-50%) scale(${bulbEnter * bulbPulse})`,
              transformOrigin: "bottom center",
              opacity: bulbEnter,
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: AMBER,
                filter: `drop-shadow(0 0 ${10 + bulbGlow * 14}px rgba(245, 176, 65, ${0.55 + bulbGlow * 0.3}))`,
              }}
            >
              <Lightbulb size={120} strokeWidth={2.4} fill={AMBER_SOFT} />
            </div>
          </div>
        </div>

        {/* Right: 成本 keyword */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            transform: `translateY(${(1 - keywordEnter) * 30}px)`,
            opacity: keywordEnter,
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                fontFamily: "ZCOOL KuaiLe, cursive",
                fontSize: 200,
                color: TEXT_DARK,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "0.04em",
                display: "inline-block",
              }}
            >
              成本
            </span>
            {/* marker underline */}
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 18,
                height: 36,
                width: `${markerProgress * 100}%`,
                background: YELLOW_MARK,
                borderRadius: 6,
                zIndex: -1,
              }}
            />
          </div>

          {/* subtitle */}
          <div
            style={{
              marginTop: 24,
              opacity: subOpacity,
              fontFamily: "'Noto Sans SC', serif",
              fontSize: 32,
              color: TEXT_MEDIUM,
              letterSpacing: "0.08em",
            }}
          >
            Token 的真实代价
          </div>
        </div>
      </div>

      {/* Sparkle decorations */}
      <SparkleDecor frame={frame} startFrame={sparkleBase} top={260} left={760} size={24} phase={0} />
      <SparkleDecor frame={frame} startFrame={sparkleBase + 8} top={210} left={1080} size={18} phase={1.5} />
      <SparkleDecor frame={frame} startFrame={sparkleBase + 14} top={680} left={1180} size={20} phase={3} />
      <SparkleDecor frame={frame} startFrame={sparkleBase + 20} top={720} left={820} size={16} phase={4.5} />
    </AbsoluteFill>
  );
};

// Bingtang (female assistant) avatar — simple cartoon female scholar
const HAIR_BACK = "M50 120 Q50 50 120 50 Q190 50 190 120 L190 180 Q190 200 170 200 L70 200 Q50 200 50 180 Z";
const HAIR_BANGS = "M64 110 Q70 70 120 70 Q170 70 176 110 Q150 96 120 96 Q90 96 64 110 Z";
const HAIR_LEFT = "M62 130 Q56 170 70 196 L82 196 Q74 168 78 132 Z";
const HAIR_RIGHT = "M178 130 Q184 170 170 196 L158 196 Q166 168 162 132 Z";
const SMILE = "M104 158 Q120 170 136 158";

const BingtangAvatar: React.FC = () => {
  return (
    <svg width={240} height={240} viewBox="0 0 240 240">
      <path d={HAIR_BACK} fill="#5D4E37" />
      <ellipse cx={120} cy={130} rx={56} ry={62} fill="#FDE7D2" stroke="#2C3E50" strokeWidth={2} />
      <path d={HAIR_BANGS} fill="#5D4E37" />
      <path d={HAIR_LEFT} fill="#5D4E37" />
      <path d={HAIR_RIGHT} fill="#5D4E37" />
      <circle cx={156} cy={92} r={6} fill="#B45309" stroke="#2C3E50" strokeWidth={1.5} />
      <ellipse cx={100} cy={134} rx={5} ry={6} fill="#2C3E50" />
      <ellipse cx={140} cy={134} rx={5} ry={6} fill="#2C3E50" />
      <circle cx={102} cy={132} r={1.5} fill="#FAF9F7" />
      <circle cx={142} cy={132} r={1.5} fill="#FAF9F7" />
      <circle cx={100} cy={134} r={14} fill="none" stroke="#B45309" strokeWidth={2} />
      <circle cx={140} cy={134} r={14} fill="none" stroke="#B45309" strokeWidth={2} />
      <line x1={114} y1={134} x2={126} y2={134} stroke="#B45309" strokeWidth={2} />
      <path d={SMILE} stroke="#2C3E50" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <ellipse cx={86} cy={152} rx={6} ry={4} fill="#F5B041" opacity={0.5} />
      <ellipse cx={154} cy={152} rx={6} ry={4} fill="#F5B041" opacity={0.5} />
    </svg>
  );
};

const SparkleDecor: React.FC<{
  frame: number;
  startFrame: number;
  top?: number;
  right?: number;
  left?: number;
  size: number;
  phase: number;
}> = ({ frame, startFrame, top, right, left, size, phase }) => {
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wiggle = (Math.sin((frame - startFrame) * 0.12 + phase) + 1) * 0.5 * 0.6 + 0.4;
  return (
    <div
      style={{
        position: "absolute",
        top,
        right,
        left,
        opacity: opacity * wiggle,
        color: AMBER,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Sparkles size={size} strokeWidth={2.2} />
    </div>
  );
};

export default Scene009;
