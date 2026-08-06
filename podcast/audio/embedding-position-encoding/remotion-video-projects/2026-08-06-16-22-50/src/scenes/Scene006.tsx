import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Quote, Cat, Dog } from "lucide-react";

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

const Scene006: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msToFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const beatAnchor = msToFrame(segments[0].relativeStart);

  const enter = 14;
  const reveal = (f: number, start: number, len = enter) =>
    interpolate(f, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 章节锚点 → 猫狗节点 → 喂/宠物上下文节点 → 汇聚关系 → 引语条
  const anchorStart = beatAnchor + 4;
  const catDogStart = beatAnchor + 20;
  const ctxStart = beatAnchor + 44;
  const mergeStart = beatAnchor + 80;
  const quoteStart = beatAnchor + 110;

  const anchorO = reveal(frame, anchorStart, 12);
  const catDogO = reveal(frame, catDogStart, 16);
  const ctxO = reveal(frame, ctxStart, 16);
  const mergeO = reveal(frame, mergeStart, 18);
  const quoteO = reveal(frame, quoteStart, 16);

  // 猫狗汇聚的位移 (汇聚关系: 越推越近)
  const pullProgress = mergeO;
  const catX = interpolate(pullProgress, [0, 1], [0, -50]);
  const dogX = interpolate(pullProgress, [0, 1], [0, 50]);

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
            分布语义假设
          </div>
        </div>

        {/* 关系图 SVG */}
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
          {/* 上游上下文节点向猫狗的牵引关系 */}
          <g opacity={ctxO * 0.9}>
            {/* 喂 → 猫 */}
            <line x1="760" y1="320" x2={880 + catX} y2="600" stroke={AMBER_SOFT} strokeWidth={6} strokeLinecap="round" />
            {/* 喂 → 狗 */}
            <line x1="760" y1="320" x2={1040 + dogX} y2="600" stroke={AMBER_SOFT} strokeWidth={6} strokeLinecap="round" />
            {/* 宠物 → 猫 */}
            <line x1="1160" y1="320" x2={880 + catX} y2="600" stroke={AMBER_SOFT} strokeWidth={6} strokeLinecap="round" />
            {/* 宠物 → 狗 */}
            <line x1="1160" y1="320" x2={1040 + dogX} y2="600" stroke={AMBER_SOFT} strokeWidth={6} strokeLinecap="round" />
          </g>

          {/* 猫 ↔ 狗 汇聚关系 (琥珀色) */}
          <g opacity={mergeO}>
            <line
              x1={880 + catX}
              y1="600"
              x2={1040 + dogX}
              y2="600"
              stroke={AMBER}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray="2 0"
            />
            {/* 双向汇聚箭头 */}
            <polygon
              points={`${950 + catX},600 ${965 + catX},592 ${965 + catX},608`}
              fill={AMBER}
            />
            <polygon
              points={`${970 + dogX},600 ${955 + dogX},592 ${955 + dogX},608`}
              fill={AMBER}
            />
          </g>
        </svg>

        {/* 上游上下文节点: 喂 / 宠物 */}
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 690,
            opacity: ctxO,
            transform: `translateY(${(1 - ctxO) * -24}px)`,
            width: 160,
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "16px 0",
              borderRadius: 16,
              background: CREAM,
              border: `3px solid ${INK}`,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 36,
              color: INK,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.14)",
            }}
          >
            喂
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 1070,
            opacity: ctxO,
            transform: `translateY(${(1 - ctxO) * -24}px)`,
            width: 180,
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "16px 0",
              borderRadius: 16,
              background: CREAM,
              border: `3px solid ${INK}`,
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 36,
              color: INK,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.14)",
            }}
          >
            宠物
          </div>
        </div>

        {/* 中央猫狗节点 */}
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 760 + catX,
            opacity: catDogO,
            transform: `scale(${interpolate(catDogO, [0, 1], [0.5, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: CREAM,
              border: `5px solid ${AMBER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.16)",
            }}
          >
            <Cat size={84} color={AMBER} strokeWidth={2.4} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 34, color: INK }}>猫</div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 1010 + dogX,
            opacity: catDogO,
            transform: `scale(${interpolate(catDogO, [0, 1], [0.5, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: CREAM,
              border: `5px solid ${AMBER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.16)",
            }}
          >
            <Dog size={84} color={AMBER} strokeWidth={2.4} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 34, color: INK }}>狗</div>
        </div>

        {/* 汇聚关系说明标签 */}
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 0,
            width: DESIGN_WIDTH,
            textAlign: "center",
            opacity: mergeO,
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 32,
            color: AMBER,
            letterSpacing: 4,
          }}
        >
          反向传播 · 越推越近
        </div>

        {/* 底部 Firth 引语窄条 (短引文锚点, 不放整句原文) */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 360,
            right: 360,
            opacity: quoteO,
            transform: `translateY(${(1 - quoteO) * 20}px)`,
            padding: "18px 36px",
            background: CREAM,
            border: `3px dashed ${AMBER}`,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            boxShadow: "4px 4px 0 rgba(0,0,0,0.10)",
          }}
        >
          <Quote size={32} color={AMBER} strokeWidth={2.4} />
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 30, color: INK, letterSpacing: 4 }}>
            看伴随词 · 识其义 —— Firth
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene006;
