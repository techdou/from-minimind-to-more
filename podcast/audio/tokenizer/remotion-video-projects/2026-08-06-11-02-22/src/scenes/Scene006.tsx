import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ArrowUp, ArrowDown, Sparkles } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const AMBER = "#B45309";
const AMBER_SOFT = "#FCD9A4";
const CREAM = "#FAF9F7";
const TEXT_DARK = "#2C3E50";
const TEXT_MEDIUM = "#5D6D7E";
const GRID_LINE = "rgba(44, 62, 80, 0.55)";

const msToFrame = (ms: number, fps: number) => (ms / 1000) * fps;

const Scene006: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0]?.relativeStart ?? 0, fps);
  const seg1Start = msToFrame(segments[1]?.relativeStart ?? 0, fps);

  const enter = 14;

  // Beat 0: scale frame pops in
  const scaleEnter = spring({
    frame: frame - seg0Start,
    fps,
    config: { damping: 12, stiffness: 130 },
    durationInFrames: enter,
  });

  // plate labels fade in slightly after
  const labelOpacity = interpolate(frame, [seg0Start + 6, seg0Start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Beat 1: beam tilts toward cost (right) side
  const tiltProgress = spring({
    frame: frame - seg1Start,
    fps,
    config: { damping: 16, stiffness: 90 },
    durationInFrames: 24,
  });
  const beamTilt = interpolate(tiltProgress, [0, 1], [0, 9]); // degrees, right side down

  // pivot label "词表大小"
  const pivotLabelOpacity = interpolate(
    frame,
    [seg1Start + 4, seg1Start + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // GPT-2 badge (left badge) enters
  const gpt2Enter = spring({
    frame: frame - (seg1Start + 10),
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: enter,
  });

  // GPT-4 badge (right badge) enters slightly later, bigger
  const gpt4Enter = spring({
    frame: frame - (seg1Start + 20),
    fps,
    config: { damping: 11, stiffness: 130 },
    durationInFrames: enter,
  });

  // GPT-4 subtle pulse after enter
  const gpt4Pulse =
    1 +
    interpolate(
      Math.sin((frame - seg1Start - 40) * 0.18),
      [-1, 1],
      [0, 0.035],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  // Geometry constants (design canvas coords)
  const centerX = DESIGN_WIDTH / 2;
  const pivotY = 360;
  const beamHalf = 460;
  const plateY = pivotY + 230;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Scale assembly */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          opacity: scaleEnter,
          transform: `scale(${0.92 + 0.08 * scaleEnter})`,
          transformOrigin: `${centerX}px ${pivotY}px`,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Base / fulcrum stand */}
          <line
            x1={centerX}
            y1={pivotY + 40}
            x2={centerX}
            y2={pivotY + 200}
            stroke={AMBER}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <line
            x1={centerX - 130}
            y1={pivotY + 205}
            x2={centerX + 130}
            y2={pivotY + 205}
            stroke={AMBER}
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* Fulcrum triangle */}
          <polygon
            points={`${centerX - 60},${pivotY + 45} ${centerX + 60},${pivotY + 45} ${centerX},${pivotY - 10}`}
            fill={AMBER}
            stroke={TEXT_DARK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </svg>

        {/* Tilting beam + plates group */}
        <div
          style={{
            position: "absolute",
            left: centerX,
            top: pivotY,
            transform: `translate(-50%, -50%) rotate(${beamTilt}deg)`,
            transformOrigin: "center center",
          }}
        >
          {/* Beam */}
          <div
            style={{
              position: "absolute",
              left: -beamHalf,
              top: -8,
              width: beamHalf * 2,
              height: 16,
              background: AMBER,
              borderRadius: 8,
              border: `3px solid ${TEXT_DARK}`,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          />
          {/* Pivot dot */}
          <div
            style={{
              position: "absolute",
              left: -14,
              top: -14,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: CREAM,
              border: `3px solid ${TEXT_DARK}`,
              zIndex: 3,
            }}
          />

          {/* Left plate (效果) */}
          <Plate
            side="left"
            x={-beamHalf}
            plateYOffset={230}
            labelOpacity={labelOpacity}
            label="效果"
            sub="信息量"
            icon={<ArrowUp size={28} strokeWidth={2.6} />}
            accent={AMBER}
          />

          {/* Right plate (成本) */}
          <Plate
            side="right"
            x={beamHalf}
            plateYOffset={230}
            labelOpacity={labelOpacity}
            label="成本"
            sub="参数量"
            icon={<ArrowDown size={28} strokeWidth={2.6} />}
            accent={AMBER}
          />
        </div>

        {/* Pivot label 词表大小 */}
        <div
          style={{
            position: "absolute",
            left: centerX,
            top: pivotY + 250,
            transform: "translateX(-50%)",
            opacity: pivotLabelOpacity,
          }}
        >
          <div
            style={{
              padding: "10px 28px",
              background: CREAM,
              border: `2.5px solid ${AMBER}`,
              borderRadius: 999,
              fontFamily: "ZCOOL XiaoWei, 'Noto Sans SC', serif",
              fontSize: 30,
              color: TEXT_DARK,
              fontWeight: 600,
              boxShadow: "3px 3px 0 rgba(0,0,0,0.10)",
              letterSpacing: "0.06em",
            }}
          >
            词表大小
          </div>
        </div>
      </div>

      {/* Bottom badges: GPT-2 / GPT-4 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 740,
          height: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 180,
        }}
      >
        {/* GPT-2 badge */}
        <div
          style={{
            opacity: gpt2Enter,
            transform: `translateY(${(1 - gpt2Enter) * 24}px) scale(${0.9 + 0.1 * gpt2Enter})`,
          }}
        >
          <VocabBadge
            model="GPT-2"
            vocab="5万"
            accent={AMBER_SOFT}
            textColor={TEXT_DARK}
            borderColor={TEXT_MEDIUM}
          />
        </div>

        {/* scale tick between badges */}
        <div
          style={{
            opacity: Math.max(gpt2Enter, gpt4Enter),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ fontFamily: "ZCOOL KuaiLe, cursive", fontSize: 22, color: TEXT_MEDIUM }}>
            词表
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Tick width={70} />
            <span style={{ fontSize: 28, color: AMBER, fontWeight: 700 }}>x2</span>
            <Tick width={70} />
          </div>
        </div>

        {/* GPT-4 badge */}
        <div
          style={{
            opacity: gpt4Enter,
            transform: `translateY(${(1 - gpt4Enter) * 24}px) scale(${(0.9 + 0.1 * gpt4Enter) * gpt4Pulse})`,
          }}
        >
          <VocabBadge
            model="GPT-4"
            vocab="10万"
            accent={AMBER}
            textColor={CREAM}
            borderColor={TEXT_DARK}
            glow
          />
        </div>
      </div>

      {/* sparkle decorations */}
      <SparkleDecor frame={frame} startFrame={seg1Start + 28} top={300} left={420} size={18} />
      <SparkleDecor frame={frame} startFrame={seg1Start + 34} top={260} right={420} size={14} />
    </AbsoluteFill>
  );
};

const Plate: React.FC<{
  side: "left" | "right";
  x: number;
  plateYOffset: number;
  labelOpacity: number;
  label: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
}> = ({ side, x, plateYOffset, labelOpacity, label, sub, icon, accent }) => {
  // Plate hangs from beam end via a string
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        transform: "translateX(-50%)",
      }}
    >
      {/* hanging strings */}
      <svg width="240" height={plateYOffset} viewBox={`0 0 240 ${plateYOffset}`} style={{ position: "absolute", left: -120, top: 0 }}>
        <line x1={120} y1={0} x2={20} y2={plateYOffset - 20} stroke={GRID_LINE} strokeWidth={2} />
        <line x1={120} y1={0} x2={220} y2={plateYOffset - 20} stroke={GRID_LINE} strokeWidth={2} />
      </svg>

      {/* Plate dish */}
      <div
        style={{
          position: "absolute",
          left: -130,
          top: plateYOffset - 20,
          width: 260,
          height: 70,
          background: `linear-gradient(180deg, ${accent} 0%, ${accent}CC 100%)`,
          border: `3px solid ${TEXT_DARK}`,
          borderRadius: "130px 130px 30px 30px / 60px 60px 30px 30px",
          boxShadow: "4px 6px 0 rgba(0,0,0,0.14)",
          opacity: labelOpacity,
        }}
      />
      {/* Label above plate */}
      <div
        style={{
          position: "absolute",
          left: -90,
          top: plateYOffset + 56,
          width: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: labelOpacity,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: accent }}>
          {icon}
          <span
            style={{
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 40,
              color: TEXT_DARK,
              fontWeight: 700,
            }}
          >
            {label}
          </span>
        </div>
        <span style={{ fontFamily: "'Noto Sans SC', serif", fontSize: 22, color: TEXT_MEDIUM }}>
          {sub}
        </span>
      </div>
    </div>
  );
};

const VocabBadge: React.FC<{
  model: string;
  vocab: string;
  accent: string;
  textColor: string;
  borderColor: string;
  glow?: boolean;
}> = ({ model, vocab, accent, textColor, borderColor, glow }) => {
  return (
    <div
      style={{
        padding: "22px 44px",
        background: accent,
        border: `3px solid ${borderColor}`,
        borderRadius: "28px 6px 28px 6px / 6px 28px 6px 28px",
        boxShadow: glow
          ? `0 0 24px rgba(180, 83, 9, 0.35), 5px 5px 0 rgba(0,0,0,0.14)`
          : "5px 5px 0 rgba(0,0,0,0.12)",
        textAlign: "center",
        minWidth: 220,
      }}
    >
      <div
        style={{
          fontFamily: "ZCOOL KuaiLe, cursive",
          fontSize: 30,
          color: textColor,
          letterSpacing: "0.04em",
          marginBottom: 4,
        }}
      >
        {model}
      </div>
      <div
        style={{
          fontFamily: "ZCOOL KuaiLe, cursive",
          fontSize: 64,
          color: textColor,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {vocab}
      </div>
      <div
        style={{
          fontFamily: "'Noto Sans SC', serif",
          fontSize: 18,
          color: textColor,
          opacity: 0.8,
          marginTop: 6,
        }}
      >
        词表
      </div>
    </div>
  );
};

const Tick: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={10} viewBox={`0 0 ${width} 10`}>
    <line
      x1={0}
      y1={5}
      x2={width}
      y2={5}
      stroke={TEXT_MEDIUM}
      strokeWidth={2}
      strokeDasharray="6 4"
      strokeLinecap="round"
    />
  </svg>
);

const SparkleDecor: React.FC<{
  frame: number;
  startFrame: number;
  top?: number;
  right?: number;
  left?: number;
  size: number;
}> = ({ frame, startFrame, top, right, left, size }) => {
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wiggle = Math.sin((frame - startFrame) * 0.12) * 0.3 + 0.7;
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

export default Scene006;
