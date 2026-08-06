import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { AlertTriangle, HelpCircle } from "lucide-react";

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

const msToFrame = (ms: number, fps: number) => (ms / 1000) * fps;

const Scene007: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0]?.relativeStart ?? 0, fps);

  // Icon pop in
  const iconEnter = spring({
    frame: frame - seg0Start,
    fps,
    config: { damping: 11, stiffness: 130 },
    durationInFrames: 16,
  });

  // Question mark fade in
  const questionOpacity = interpolate(
    frame,
    [seg0Start + 8, seg0Start + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pulse rings (one-shot expand)
  const ring1 = interpolate(frame, [seg0Start + 14, seg0Start + 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring2 = interpolate(frame, [seg0Start + 22, seg0Start + 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title fade in
  const titleOpacity = interpolate(
    frame,
    [seg0Start + 28, seg0Start + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Side question marks (decorative balance)
  const sideOpacity = interpolate(
    frame,
    [seg0Start + 36, seg0Start + 48],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sideWiggle = (phase: number) =>
    Math.sin((frame - seg0Start) * 0.08 + phase) * 6;

  const centerX = DESIGN_WIDTH / 2;
  const centerY = DESIGN_HEIGHT / 2 - 80;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Pulse rings */}
      {[
        { progress: ring1, startScale: 0.6 },
        { progress: ring2, startScale: 0.6 },
      ].map((ring, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: centerX,
            top: centerY,
            width: 360,
            height: 360,
            marginLeft: -180,
            marginTop: -180,
            borderRadius: "50%",
            border: `4px solid ${AMBER}`,
            opacity: (1 - ring.progress) * 0.5,
            transform: `scale(${ring.startScale + ring.progress * 1.0})`,
          }}
        />
      ))}

      {/* Central alert triangle + question */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY,
          transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * iconEnter})`,
          opacity: iconEnter,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 360,
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Triangle background fill */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: AMBER,
              filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.18))",
            }}
          >
            <AlertTriangle size={340} strokeWidth={2.4} fill={AMBER_SOFT} />
          </div>
          {/* Question mark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: questionOpacity,
              transform: "translateY(-6px)",
              color: CREAM,
            }}
          >
            <HelpCircle size={150} strokeWidth={3.2} />
          </div>
        </div>
      </div>

      {/* Title below */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY + 240,
          transform: "translateX(-50%)",
          opacity: titleOpacity,
          display: "flex",
          alignItems: "center",
          gap: 26,
        }}
      >
        <span
          style={{
            fontFamily: "ZCOOL KuaiLe, cursive",
            fontSize: 72,
            color: TEXT_DARK,
            fontWeight: 700,
            letterSpacing: "0.06em",
          }}
        >
          分词不佳
        </span>
        <span style={{ fontFamily: "ZCOOL KuaiLe, cursive", fontSize: 72, color: AMBER }}>.</span>
        <span
          style={{
            fontFamily: "ZCOOL KuaiLe, cursive",
            fontSize: 72,
            color: AMBER,
            fontWeight: 700,
          }}
        >
          后果
        </span>
      </div>

      {/* Decorative side question marks */}
      <div
        style={{
          position: "absolute",
          left: centerX - 460,
          top: centerY - 30,
          opacity: sideOpacity,
          transform: `translateY(${sideWiggle(0)}px) rotate(-12deg)`,
          color: AMBER,
        }}
      >
        <HelpCircle size={64} strokeWidth={2.6} />
      </div>
      <div
        style={{
          position: "absolute",
          left: centerX + 420,
          top: centerY - 10,
          opacity: sideOpacity,
          transform: `translateY(${sideWiggle(2)}px) rotate(14deg)`,
          color: AMBER,
        }}
      >
        <HelpCircle size={56} strokeWidth={2.6} />
      </div>

      {/* Subtitle hint */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY + 340,
          transform: "translateX(-50%)",
          opacity: titleOpacity,
          fontFamily: "'Noto Sans SC', serif",
          fontSize: 26,
          color: TEXT_MEDIUM,
          letterSpacing: "0.1em",
        }}
      >
        Tokenizer 的反面代价
      </div>
    </AbsoluteFill>
  );
};

export default Scene007;
