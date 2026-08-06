import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { HelpCircle } from "lucide-react";

const AMBER = "#B45309";
const AMBER_SOFT = "#FCD9A4";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";
const RED = "#E74C3C";
const BLUE = "#5DADE2";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const EXAMPLE = "我爱自然语言";

const Scene003: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0].relativeStart, fps);

  // 顶部标签
  const tagEnter = interpolate(frame - seg0Start, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 左卡从左滑入
  const leftStart = seg0Start + 6;
  const leftEnter = spring({ frame: frame - leftStart, fps, config: { damping: 14, stiffness: 130 } });

  // 右卡从右滑入
  const rightStart = seg0Start + 6;
  const rightEnter = spring({ frame: frame - rightStart, fps, config: { damping: 14, stiffness: 130 } });

  // 中央问号弹入
  const qStart = seg0Start + 20;
  const qEnter = spring({ frame: frame - qStart, fps, config: { damping: 11, stiffness: 150 } });

  // 问号下方标签
  const qLabelEnter = interpolate(frame - qStart, [12, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 问号轻微摇摆
  const swing = Math.sin((frame / fps) * 3) * 4;

  const cardW = 580;
  const cardH = 460;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* 顶部主题标签 */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - tagEnter) * -14}px)`,
          opacity: tagEnter,
        }}
      >
        <span
          style={{
            background: AMBER,
            color: CREAM,
            padding: "10px 36px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 34,
            boxShadow: `4px 4px 0 rgba(0,0,0,0.15)`,
          }}
        >
          粒度之争
        </span>
      </div>

      {/* 左卡：按字切 */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 280,
          width: cardW,
          height: cardH,
          opacity: leftEnter,
          transform: `translateX(${(1 - leftEnter) * -50}px)`,
          background: CREAM,
          border: `5px solid ${RED}`,
          borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
          boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            background: RED,
            color: CREAM,
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 30,
            padding: "8px 28px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
          }}
        >
          按字切
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 480 }}>
          {EXAMPLE.split("").map((c, i) => (
            <div
              key={i}
              style={{
                width: 64,
                height: 74,
                background: "#FDEDEC",
                border: `3px solid ${RED}`,
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 36, color: INK }}>{c}</div>
              <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 16, color: RED, fontWeight: 700 }}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 22, color: "#5D6D7E", textAlign: "center" }}>
          切成 6 个单字 · 粒度过细
        </div>
      </div>

      {/* 右卡：按词切 */}
      <div
        style={{
          position: "absolute",
          left: 1180,
          top: 280,
          width: cardW,
          height: cardH,
          opacity: rightEnter,
          transform: `translateX(${(1 - rightEnter) * 50}px)`,
          background: CREAM,
          border: `5px solid ${BLUE}`,
          borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px",
          boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            background: BLUE,
            color: CREAM,
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 30,
            padding: "8px 28px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
          }}
        >
          按词切
        </div>
        <div
          style={{
            width: 440,
            height: 90,
            background: "#EAF4FB",
            border: `3px solid ${BLUE}`,
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 48, color: INK }}>{EXAMPLE}</div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 18, color: BLUE, fontWeight: 700 }}>
            1
          </div>
        </div>
        <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 22, color: "#5D6D7E", textAlign: "center" }}>
          整句当作一个词 · 粒度过粗
        </div>
      </div>

      {/* 中央巨型问号 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 420,
          transform: `translate(-50%, -50%) scale(${qEnter}) rotate(${swing}deg)`,
          opacity: qEnter,
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
            background: AMBER_SOFT,
            border: `8px solid ${AMBER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 40px ${AMBER}66, 8px 8px 0 rgba(0,0,0,0.15)`,
          }}
        >
          <HelpCircle size={130} color={AMBER} strokeWidth={3} />
        </div>
      </div>

      {/* 问号下方短标签 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 560,
          transform: `translateX(-50%) translateY(${(1 - qLabelEnter) * 12}px)`,
          opacity: qLabelEnter,
          background: CREAM,
          border: `3px solid ${INK}`,
          borderRadius: 999,
          padding: "8px 28px",
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 32,
          color: INK,
          boxShadow: `3px 3px 0 rgba(0,0,0,0.12)`,
        }}
      >
        切多细？
      </div>
    </AbsoluteFill>
  );
};

export default Scene003;
