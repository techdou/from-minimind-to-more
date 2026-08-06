import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Ruler, Waves, Milestone } from "lucide-react";

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

const Scene012: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 章节锚点 → 中央两词节点+距离标尺 → 右侧 YaRN 调频波形 → 底部基石收束条
  const anchorStart = beatAnchor + 4;
  const coreStart = beatAnchor + 20;
  const rulerStart = beatAnchor + 60;
  const yarnStart = beatAnchor + 90;
  const baseStart = beatAnchor + 130;

  const anchorO = reveal(frame, anchorStart, 12);
  const coreO = reveal(frame, coreStart, 16);
  const rulerO = reveal(frame, rulerStart, 16);
  const yarnO = reveal(frame, yarnStart, 18);
  const baseO = reveal(frame, baseStart, 16);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div style={{ position: "absolute", width: DESIGN_WIDTH, height: DESIGN_HEIGHT, left: 0, top: 0 }}>
        {/* 章节锚点 */}
        <div
          style={{
            position: "absolute",
            top: 70,
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
            相对位置 · YaRN
          </div>
        </div>

        {/* 中央核心关系: 注意力 = 相对距离 */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 100,
            width: 1080,
            opacity: coreO,
            transform: `translateY(${(1 - coreO) * 24}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 30,
              color: INK,
              letterSpacing: 4,
              marginBottom: 14,
            }}
          >
            注意力 只看
          </div>

          {/* 两个词节点 + 距离标尺 */}
          <svg width="100%" height={260} viewBox="0 0 1080 260">
            {/* 左词节点 */}
            <g transform="translate(140, 130)" opacity={coreO}>
              <circle r={56} fill={CREAM} stroke={AMBER} strokeWidth={6} />
              <text
                x={0}
                y={12}
                textAnchor="middle"
                fontFamily="'ZCOOL KuaiLe', cursive"
                fontSize={48}
                fill={INK}
              >
                词A
              </text>
            </g>
            {/* 右词节点 */}
            <g transform="translate(940, 130)" opacity={coreO}>
              <circle r={56} fill={CREAM} stroke={AMBER} strokeWidth={6} />
              <text
                x={0}
                y={12}
                textAnchor="middle"
                fontFamily="'ZCOOL KuaiLe', cursive"
                fontSize={48}
                fill={INK}
              >
                词B
              </text>
            </g>
            {/* 距离标尺 (琥珀) */}
            <g opacity={rulerO}>
              <line x1={196} y1={130} x2={884} y2={130} stroke={AMBER} strokeWidth={10} strokeLinecap="round" />
              {/* 标尺端点 */}
              <line x1={196} y1={108} x2={196} y2={152} stroke={AMBER} strokeWidth={6} strokeLinecap="round" />
              <line x1={884} y1={108} x2={884} y2={152} stroke={AMBER} strokeWidth={6} strokeLinecap="round" />
              {/* 距离标签 */}
              <g transform="translate(540, 130)">
                <rect x={-90} y={-30} width={180} height={60} rx={12} fill={CREAM} stroke={AMBER} strokeWidth={3} />
                <text
                  x={0}
                  y={10}
                  textAnchor="middle"
                  fontFamily="'ZCOOL KuaiLe', cursive"
                  fontSize={32}
                  fill={AMBER}
                >
                  相对距离
                </text>
              </g>
            </g>
          </svg>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 30,
              color: AMBER,
              letterSpacing: 4,
            }}
          >
            <Ruler size={30} strokeWidth={2.6} />
            与绝对位置无关
          </div>
        </div>

        {/* 右侧 YaRN 调频示意: 调整前 vs 调整后两条波形 */}
        <div
          style={{
            position: "absolute",
            top: 200,
            right: 80,
            width: 580,
            opacity: yarnO,
            transform: `translateX(${(1 - yarnO) * 40}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 28,
              color: INK,
              letterSpacing: 3,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Waves size={30} color={AMBER} strokeWidth={2.6} />
            YaRN · 调整旋转频率
          </div>
          <div
            style={{
              background: CREAM,
              border: `4px solid ${INK}`,
              borderRadius: 20,
              padding: "20px 24px",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.14)",
            }}
          >
            <svg width="100%" height={300} viewBox="0 0 500 300">
              {/* 调整前 (灰, 频率较高) */}
              <text x={10} y={26} fontFamily="'ZCOOL XiaoWei', serif" fontSize={20} fill={INK} opacity={0.7}>
                调整前
              </text>
              <path
                d={`M 10 60 ${Array.from({ length: 80 })
                  .map((_, i) => {
                    const x = 10 + (i / 79) * 480;
                    const y = 60 - Math.sin((i / 79) * Math.PI * 10) * 28;
                    return `L ${x} ${y}`;
                  })
                  .join(" ")}`}
                fill="none"
                stroke={INK}
                strokeWidth={3}
                opacity={0.35}
              />
              {/* 调整后 (琥珀, 频率被调整/放慢, 利于外推) */}
              <text x={10} y={176} fontFamily="'ZCOOL XiaoWei', serif" fontSize={20} fill={AMBER}>
                调整后
              </text>
              <path
                d={`M 10 210 ${Array.from({ length: 80 })
                  .map((_, i) => {
                    const x = 10 + (i / 79) * 480;
                    const y = 210 - Math.sin((i / 79) * Math.PI * 5) * 36;
                    return `L ${x} ${y}`;
                  })
                  .join(" ")}`}
                fill="none"
                stroke={AMBER}
                strokeWidth={4}
              />
            </svg>
            <div
              style={{
                marginTop: 4,
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: 22,
                color: AMBER_SOFT,
                letterSpacing: 3,
                textAlign: "center",
              }}
            >
              重设旋转频率 · 解锁外推
            </div>
          </div>
        </div>

        {/* 底部琥珀色基石收束条 */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 280,
            right: 280,
            opacity: baseO,
            transform: `translateY(${(1 - baseO) * 20}px)`,
            padding: "20px 40px",
            background: AMBER,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            boxShadow: "5px 5px 0 rgba(0,0,0,0.18)",
          }}
        >
          <Milestone size={34} color={CREAM} strokeWidth={2.6} />
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 36,
              color: CREAM,
              letterSpacing: 8,
            }}
          >
            长上下文 · 基石
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene012;
