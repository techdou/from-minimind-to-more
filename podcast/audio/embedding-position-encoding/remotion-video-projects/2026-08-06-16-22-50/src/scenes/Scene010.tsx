import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { RotateCw } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const AMBER = "#B45309";
const AMBER_SOFT = "#D89A4E";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";

const Scene010: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 章节锚点 → 左栏波形与向量条 → 右栏向量被旋转 → 右栏琥珀高亮
  const anchorStart = beatAnchor + 4;
  const leftStart = beatAnchor + 22;
  const rightStart = beatAnchor + 70;
  const rightHiStart = beatAnchor + 120;

  const anchorO = reveal(frame, anchorStart, 12);
  const leftO = reveal(frame, leftStart, 18);
  const rightO = reveal(frame, rightStart, 20);
  const rightHiO = reveal(frame, rightHiStart, 16);

  // 左栏正余弦波形点
  const wavePoints = Array.from({ length: 60 });

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div style={{ position: "absolute", width: DESIGN_WIDTH, height: DESIGN_HEIGHT, left: 0, top: 0 }}>
        {/* 章节锚点 */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            width: DESIGN_WIDTH,
            display: "flex",
            justifyContent: "center",
            opacity: anchorO,
            transform: `translateY(${(1 - anchorO) * -16}px)`,
          }}
        >
          <div
            style={{
              padding: "12px 38px",
              borderRadius: 999,
              border: `3px solid ${AMBER}`,
              background: CREAM,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 32,
              color: AMBER,
              letterSpacing: 6,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            相加 · 旋转
          </div>
        </div>

        {/* 左栏: 绝对位置编码 (相加) */}
        <div
          style={{
            position: "absolute",
            top: 190,
            left: 110,
            width: 780,
            opacity: leftO,
            transform: `translateY(${(1 - leftO) * 24}px)`,
          }}
        >
          <div
            style={{
              background: CREAM,
              border: `4px solid ${INK}`,
              borderRadius: 24,
              padding: "28px 32px",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.14)",
              height: 720,
              position: "relative",
            }}
          >
            {/* 顶部标签 */}
            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 32,
                color: INK,
                letterSpacing: 4,
                marginBottom: 4,
              }}
            >
              绝对位置编码
            </div>
            <div
              style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: 24,
                color: AMBER_SOFT,
                letterSpacing: 3,
                marginBottom: 18,
              }}
            >
              正余弦 · 相加
            </div>

            {/* 向量条 + 上方正余弦波形叠合 */}
            <svg width="100%" height={420} viewBox="0 0 700 420">
              {/* 向量条 */}
              <g>
                {Array.from({ length: 18 }).map((_, i) => (
                  <rect
                    key={i}
                    x={20 + i * 37}
                    y={300}
                    width={26}
                    height={70}
                    rx={5}
                    fill={INK}
                    opacity={0.85}
                  />
                ))}
              </g>
              {/* 正余弦波形 (琥珀) */}
              <path
                d={`M 20 ${260} ${wavePoints
                  .map((_, i) => {
                    const x = 20 + (i / 59) * 660;
                    const y = 230 - Math.sin((i / 59) * Math.PI * 4) * 90;
                    return `L ${x} ${y}`;
                  })
                  .join(" ")}`}
                fill="none"
                stroke={AMBER}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.95}
              />
              {/* 相加 + 号 */}
              <g transform="translate(350, 150)">
                <circle r={26} fill={CREAM} stroke={AMBER} strokeWidth={4} />
                <text
                  x={0}
                  y={10}
                  textAnchor="middle"
                  fontFamily="'ZCOOL KuaiLe', cursive"
                  fontSize={36}
                  fill={AMBER}
                >
                  +
                </text>
              </g>
            </svg>

            <div
              style={{
                marginTop: 8,
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: 26,
                color: INK,
                letterSpacing: 3,
                textAlign: "center",
              }}
            >
              位置向量 + Embedding
            </div>
          </div>
        </div>

        {/* 右栏: RoPE 旋转位置编码 (旋转) */}
        <div
          style={{
            position: "absolute",
            top: 190,
            right: 110,
            width: 780,
            opacity: rightO,
            transform: `translateY(${(1 - rightO) * 24}px)`,
          }}
        >
          <div
            style={{
              background: CREAM,
              border: `5px solid ${AMBER}`,
              borderRadius: 24,
              padding: "28px 32px",
              boxShadow: `5px 5px 0 rgba(180,83,9,${0.2 + rightHiO * 0.18})`,
              height: 720,
              position: "relative",
              outline: rightHiO > 0.1 ? `4px solid rgba(180,83,9,${rightHiO * 0.5})` : "none",
              outlineOffset: 6,
            }}
          >
            {/* 主流徽标 */}
            <div
              style={{
                position: "absolute",
                top: -22,
                right: 24,
                padding: "6px 18px",
                background: AMBER,
                color: CREAM,
                borderRadius: 999,
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 22,
                letterSpacing: 3,
                opacity: rightHiO,
                transform: `scale(${interpolate(rightHiO, [0, 1], [0.5, 1])})`,
                boxShadow: "3px 3px 0 rgba(0,0,0,0.16)",
              }}
            >
              主流
            </div>

            <div
              style={{
                fontFamily: "'ZCOOL KuaiLe', cursive",
                fontSize: 32,
                color: AMBER,
                letterSpacing: 4,
                marginBottom: 4,
              }}
            >
              RoPE 旋转位置编码
            </div>
            <div
              style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: 24,
                color: AMBER_SOFT,
                letterSpacing: 3,
                marginBottom: 18,
              }}
            >
              旋转一个角度
            </div>

            {/* 向量被旋转一个角度 + 弧形旋转箭头 */}
            <svg width="100%" height={420} viewBox="0 0 700 420">
              <g transform="translate(350, 280)">
                {/* 旋转角度弧 */}
                <path
                  d="M 180 0 A 180 180 0 0 0 142 -110"
                  fill="none"
                  stroke={AMBER}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray="10 8"
                  opacity={0.9}
                />
                {/* 原始向量 (灰) */}
                <line
                  x1={0}
                  y1={0}
                  x2={180}
                  y2={0}
                  stroke={INK}
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={0.3}
                />
                {/* 旋转后向量 (琥珀) */}
                <line
                  x1={0}
                  y1={0}
                  x2={142}
                  y2={-110}
                  stroke={AMBER}
                  strokeWidth={9}
                  strokeLinecap="round"
                />
                <polygon
                  points={`142,-110 ${142 - Math.cos(-0.66) * 22},${-110 - Math.sin(-0.66) * 22} ${142 - Math.cos(0.66) * 22},${-110 - Math.sin(0.66) * 22}`}
                  fill={AMBER}
                  transform={`rotate(-38 142 -110)`}
                />
                <circle cx={0} cy={0} r={10} fill={INK} />
                {/* 角度标签 */}
                <text
                  x={120}
                  y={-40}
                  fontFamily="'ZCOOL KuaiLe', cursive"
                  fontSize={26}
                  fill={AMBER}
                >
                  θ
                </text>
              </g>
            </svg>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: 26,
                color: INK,
                letterSpacing: 3,
              }}
            >
              <RotateCw size={28} color={AMBER} strokeWidth={2.6} />
              角度由位置决定
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene010;
