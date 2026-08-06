import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Code2, BarChart3 } from "lucide-react";

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
const RED = "#C0392B";

const msToFrame = (ms: number, fps: number) => (ms / 1000) * fps;

// Indented code lines with intentional indentation chaos.
// Each line: [indentChars, content, markBroken?]
const codeLines: Array<{ indent: number; content: string; broken?: boolean }> = [
  { indent: 0, content: "def train(model, data):" },
  { indent: 4, content: "for batch in data:", broken: true },
  { indent: 2, content: "loss = model(batch)", broken: true },
  { indent: 6, content: "loss.backward()", broken: true },
  { indent: 4, content: "optimizer.step()" },
  { indent: 0, content: "return model" },
];

const Scene008: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0]?.relativeStart ?? 0, fps);

  // Top code card slides in
  const codeEnter = spring({
    frame: frame - seg0Start,
    fps,
    config: { damping: 16, stiffness: 110 },
    durationInFrames: 18,
  });

  // Red wavy marks appear staggered
  const markStarts = codeLines.map((_, i) => seg0Start + 14 + i * 8);

  // Bottom chart baseline
  const baselineStart = seg0Start + 90;
  const baselineEnter = interpolate(
    frame,
    [baselineStart, baselineStart + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // English bar (short)
  const enBarStart = baselineStart + 14;
  const enBarGrow = spring({
    frame: frame - enBarStart,
    fps,
    config: { damping: 14, stiffness: 110 },
    durationInFrames: 16,
  });

  // Chinese bar (tall)
  const cnBarStart = enBarStart + 18;
  const cnBarGrow = spring({
    frame: frame - cnBarStart,
    fps,
    config: { damping: 13, stiffness: 100 },
    durationInFrames: 22,
  });

  // Numbers on bars
  const enNumOpacity = interpolate(frame, [enBarStart + 14, enBarStart + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cnNumOpacity = interpolate(frame, [cnBarStart + 18, cnBarStart + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Top: code card */}
      <div
        style={{
          position: "absolute",
          left: DESIGN_WIDTH / 2,
          top: 130,
          width: 1180,
          transform: `translateX(-50%) translateY(${(1 - codeEnter) * -40}px)`,
          opacity: codeEnter,
        }}
      >
        <CodeCard markStarts={markStarts} frame={frame} />
      </div>

      {/* Wavy divider between zones */}
      <div
        style={{
          position: "absolute",
          left: DESIGN_WIDTH / 2 - 360,
          top: 560,
          width: 720,
          opacity: interpolate(frame, [seg0Start + 30, seg0Start + 42], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width="100%" height={14} viewBox="0 0 720 14">
          <path
            d="M0 7 Q30 0 60 7 T120 7 T180 7 T240 7 T300 7 T360 7 T420 7 T480 7 T540 7 T600 7 T660 7 T720 7"
            stroke={AMBER}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom: bar chart */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 620,
          height: 380,
        }}
      >
        <BarChart
          enBarGrow={enBarGrow}
          cnBarGrow={cnBarGrow}
          baselineEnter={baselineEnter}
          enNumOpacity={enNumOpacity}
          cnNumOpacity={cnNumOpacity}
        />
      </div>
    </AbsoluteFill>
  );
};

const CodeCard: React.FC<{ markStarts: number[]; frame: number }> = ({ markStarts, frame }) => {
  return (
    <div
      style={{
        background: CREAM,
        border: `3px solid ${AMBER}`,
        borderRadius: 18,
        boxShadow: "6px 6px 0 rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 22px",
          background: AMBER,
          color: CREAM,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Code2 size={26} strokeWidth={2.4} />
          <span style={{ fontFamily: "'Noto Sans SC', serif", fontSize: 22, fontWeight: 600 }}>
            Python · 缩进即结构
          </span>
        </div>
        <span
          style={{
            fontFamily: "ZCOOL KuaiLe, cursive",
            fontSize: 20,
            padding: "4px 14px",
            background: RED,
            border: `2px solid ${TEXT_DARK}`,
            borderRadius: 999,
            color: CREAM,
          }}
        >
          缩进丢失
        </span>
      </div>

      {/* Code body */}
      <div style={{ padding: "20px 28px", background: "#FFFEF9" }}>
        <div style={{ fontFamily: "Consolas, 'Courier New', monospace", fontSize: 26, lineHeight: 1.7 }}>
          {codeLines.map((line, i) => {
            const markOpacity = line.broken
              ? interpolate(frame, [markStarts[i], markStarts[i] + 8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  height: 42,
                }}
              >
                {/* line number */}
                <span style={{ width: 40, color: TEXT_MEDIUM, opacity: 0.6, fontSize: 20 }}>
                  {i + 1}
                </span>
                {/* indent + content */}
                <span style={{ whiteSpace: "pre", color: TEXT_DARK }}>
                  <IndentSpacers count={line.indent} />
                  <span style={{ color: line.broken ? RED : TEXT_DARK }}>{line.content}</span>
                </span>
                {/* red wavy underline mark */}
                {line.broken && (
                  <svg
                    width={120 + line.content.length * 7}
                    height={10}
                    viewBox={`0 0 ${120 + line.content.length * 7} 10`}
                    style={{
                      position: "absolute",
                      left: 40 + line.indent * 9,
                      bottom: 2,
                      opacity: markOpacity,
                      pointerEvents: "none",
                    }}
                  >
                    <path
                      d={`M0 5 Q6 0 12 5 T24 5 T36 5 T48 5 T60 5 T72 5 T84 5 T96 5 T108 5 T120 5`}
                      stroke={RED}
                      strokeWidth={2.5}
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const IndentSpacers: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span style={{ color: AMBER }}>
      {"·".repeat(count)}
      {" "}
    </span>
  );
};

const BarChart: React.FC<{
  enBarGrow: number;
  cnBarGrow: number;
  baselineEnter: number;
  enNumOpacity: number;
  cnNumOpacity: number;
}> = ({ enBarGrow, cnBarGrow, baselineEnter, enNumOpacity, cnNumOpacity }) => {
  const baselineY = 320;
  const enHeight = 90;
  const cnHeight = 230;
  const enX = DESIGN_WIDTH / 2 - 280;
  const cnX = DESIGN_WIDTH / 2 + 60;
  const barWidth = 220;

  return (
    <div style={{ position: "relative", width: DESIGN_WIDTH, height: 380 }}>
      {/* Baseline */}
      <div
        style={{
          position: "absolute",
          left: DESIGN_WIDTH / 2 - 460,
          top: baselineY,
          width: 920,
          height: 4,
          background: AMBER,
          opacity: baselineEnter,
          borderRadius: 2,
        }}
      />
      {/* Baseline label */}
      <div
        style={{
          position: "absolute",
          left: DESIGN_WIDTH / 2 - 460,
          top: baselineY + 12,
          opacity: baselineEnter,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: TEXT_MEDIUM,
        }}
      >
        <BarChart3 size={22} strokeWidth={2.4} color={AMBER} />
        <span style={{ fontFamily: "'Noto Sans SC', serif", fontSize: 22, color: TEXT_MEDIUM }}>
          Token 数对比
        </span>
      </div>

      {/* English bar */}
      <Bar
        x={enX}
        baselineY={baselineY}
        height={enHeight * enBarGrow}
        width={barWidth}
        color={AMBER_SOFT}
        borderColor={TEXT_MEDIUM}
        label="英文"
        subLabel="same text"
        number="~160"
        numberOpacity={enNumOpacity}
        textColor={TEXT_DARK}
      />

      {/* Chinese bar */}
      <Bar
        x={cnX}
        baselineY={baselineY}
        height={cnHeight * cnBarGrow}
        width={barWidth}
        color={AMBER}
        borderColor={TEXT_DARK}
        label="中文"
        subLabel="same text"
        number="~480"
        numberOpacity={cnNumOpacity}
        textColor={CREAM}
        glow
      />

      {/* 3x callout between bars */}
      <div
        style={{
          position: "absolute",
          left: enX + barWidth + 20,
          top: baselineY - 150,
          width: cnX - (enX + barWidth) - 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          opacity: cnNumOpacity,
        }}
      >
        <span
          style={{
            fontFamily: "ZCOOL KuaiLe, cursive",
            fontSize: 56,
            color: AMBER,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          3x
        </span>
        <span
          style={{
            fontFamily: "'Noto Sans SC', serif",
            fontSize: 18,
            color: TEXT_MEDIUM,
            textAlign: "center",
          }}
        >
          中文 Token
          <br />
          通胀
        </span>
      </div>
    </div>
  );
};

const Bar: React.FC<{
  x: number;
  baselineY: number;
  height: number;
  width: number;
  color: string;
  borderColor: string;
  label: string;
  subLabel: string;
  number: string;
  numberOpacity: number;
  textColor: string;
  glow?: boolean;
}> = ({ x, baselineY, height, width, color, borderColor, label, subLabel, number, numberOpacity, textColor, glow }) => {
  return (
    <div style={{ position: "absolute", left: x, top: 0 }}>
      {/* number above bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: baselineY - height - 70,
          width,
          textAlign: "center",
          opacity: numberOpacity,
          fontFamily: "ZCOOL KuaiLe, cursive",
          fontSize: 48,
          color: borderColor === TEXT_DARK ? AMBER : TEXT_DARK,
          fontWeight: 700,
        }}
      >
        {number}
      </div>

      {/* the bar itself, grows from baseline upward */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: baselineY - height,
          width,
          height,
          background: color,
          border: `3px solid ${borderColor}`,
          borderBottom: "none",
          borderRadius: "12px 12px 0 0",
          boxShadow: glow ? `0 0 24px rgba(180, 83, 9, 0.30)` : "4px 4px 0 rgba(0,0,0,0.10)",
        }}
      />

      {/* label below baseline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: baselineY + 40,
          width,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "ZCOOL KuaiLe, cursive",
            fontSize: 36,
            color: TEXT_DARK,
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        <div style={{ fontFamily: "'Noto Sans SC', serif", fontSize: 18, color: TEXT_MEDIUM }}>
          {subLabel}
        </div>
      </div>
    </div>
  );
};

export default Scene008;
