import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Check, ArrowRight, Link2, Scissors, Scale } from "lucide-react";

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

const points = [
  { num: "1", label: "字符与模型的桥梁", icon: "link" as const },
  { num: "2", label: "BPE 子词切分", icon: "scissor" as const },
  { num: "3", label: "词表大小权衡", icon: "scale" as const },
];

const Scene010: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0]?.relativeStart ?? 0, fps);

  // Title fade in at top
  const titleOpacity = interpolate(
    frame,
    [seg0Start, seg0Start + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Each point staggered: enter every 18 frames, anchored at seg0Start
  const pointStarts = points.map((_, i) => seg0Start + 14 + i * 22);
  const pointAnim = pointStarts.map((start) => ({
    start,
    enter: spring({
      frame: frame - start,
      fps,
      config: { damping: 12, stiffness: 130 },
      durationInFrames: 14,
    }),
    checkOpacity: interpolate(frame, [start + 10, start + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  }));

  // After last point: arrow draws
  const lastPointStart = pointStarts[points.length - 1];
  const arrowStart = lastPointStart + 24;
  const arrowProgress = interpolate(
    frame,
    [arrowStart, arrowStart + 16],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ribbon banner pop
  const ribbonStart = arrowStart + 10;
  const ribbonEnter = spring({
    frame: frame - ribbonStart,
    fps,
    config: { damping: 11, stiffness: 120 },
    durationInFrames: 16,
  });

  // Subtitle fade
  const subOpacity = interpolate(
    frame,
    [ribbonStart + 12, ribbonStart + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Section title */}
      <div
        style={{
          position: "absolute",
          left: DESIGN_WIDTH / 2,
          top: 70,
          transform: "translateX(-50%)",
          opacity: titleOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "ZCOOL KuaiLe, cursive",
            fontSize: 48,
            color: TEXT_DARK,
            letterSpacing: "0.1em",
          }}
        >
          Tokenizer · 三要点收束
        </span>
      </div>

      {/* Three points vertical list */}
      <div
        style={{
          position: "absolute",
          left: DESIGN_WIDTH / 2,
          top: 180,
          width: 1000,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {points.map((p, i) => {
          const anim = pointAnim[i];
          return (
            <div
              key={p.num}
              style={{
                opacity: anim.enter,
                transform: `translateX(${(1 - anim.enter) * -40}px)`,
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "18px 32px",
                background: CREAM,
                border: `3px solid ${AMBER}`,
                borderRadius: "18px 4px 18px 4px / 4px 18px 4px 18px",
                boxShadow: "5px 5px 0 rgba(0,0,0,0.12)",
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: AMBER,
                  color: CREAM,
                  border: `3px solid ${TEXT_DARK}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "ZCOOL KuaiLe, cursive",
                  fontSize: 36,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {p.num}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: AMBER_SOFT,
                  border: `2px solid ${AMBER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: AMBER,
                  flexShrink: 0,
                }}
              >
                <PointIcon icon={p.icon} />
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: "ZCOOL XiaoWei, 'Noto Sans SC', serif",
                  fontSize: 44,
                  color: TEXT_DARK,
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {p.label}
              </span>

              {/* Check status */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: AMBER,
                  border: `2.5px solid ${TEXT_DARK}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: CREAM,
                  opacity: anim.checkOpacity,
                  transform: `scale(${anim.checkOpacity})`,
                }}
              >
                <Check size={26} strokeWidth={3} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom: arrow + next episode */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Arrow */}
        <svg width={180} height={60} viewBox="0 0 180 60" style={{ overflow: "visible" }}>
          <line
            x1={0}
            y1={30}
            x2={170 * arrowProgress}
            y2={30}
            stroke={AMBER}
            strokeWidth={6}
            strokeLinecap="round"
          />
          {arrowProgress > 0.8 && (
            <polygon
              points="160,10 180,30 160,50"
              fill={AMBER}
              opacity={(arrowProgress - 0.8) * 5}
            />
          )}
        </svg>

        {/* Ribbon banner */}
        <div
          style={{
            transform: `scale(${0.6 + 0.4 * ribbonEnter}) rotate(-1.5deg)`,
            opacity: ribbonEnter,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              padding: "14px 40px",
              background: AMBER,
              color: CREAM,
              border: `3px solid ${TEXT_DARK}`,
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              boxShadow: "6px 6px 0 rgba(0,0,0,0.16)",
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "0.06em",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 24, opacity: 0.85 }}>下集</span>
            <span>Embedding</span>
          </div>
          <div
            style={{
              opacity: subOpacity,
              fontFamily: "'Noto Sans SC', serif",
              fontSize: 26,
              color: TEXT_MEDIUM,
              letterSpacing: "0.08em",
            }}
          >
            语义真正开始的地方
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PointIcon: React.FC<{ icon: "link" | "scissor" | "scale" }> = ({ icon }) => {
  if (icon === "link") return <Link2 size={26} strokeWidth={2.6} />;
  if (icon === "scissor") return <Scissors size={26} strokeWidth={2.6} />;
  return <Scale size={26} strokeWidth={2.6} />;
};

export default Scene010;
