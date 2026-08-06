import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Combine, Layers } from "lucide-react";

const AMBER = "#B45309";
const AMBER_SOFT = "#FCD9A4";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";
const BLUE = "#5DADE2";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// 合并轮次定义
const MERGE_ROUNDS = [
  { pair: ["t", "h"], merged: "th" },
  { pair: ["th", "e"], merged: "the" },
  { pair: ["the", "r"], merged: "ther" },
  { pair: ["i", "n"], merged: "in" },
];

const BASE_VOCAB = 36;

const Scene005: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 拍点
  const bingtangStart = msToFrame(segments[0].relativeStart, fps); // 冰糖追问
  const baihuaStart = msToFrame(segments[1].relativeStart, fps); // 白桦讲解

  // 框架入场（冰糖拍内）
  const frameEnter = spring({ frame: frame - bingtangStart, fps, config: { damping: 14, stiffness: 130 } });
  const sideEnter = spring({ frame: frame - (bingtangStart + 4), fps, config: { damping: 14, stiffness: 130 } });

  // 合并轮次循环（白桦拍内）
  // 每轮约 36 帧（高频对高亮 6 帧 + 合并箭头 6 帧 + 新token弹入 8 帧 + 沉降停留 16 帧）
  const framesPerRound = 36;
  const totalRounds = MERGE_ROUNDS.length;
  const elapsedInBaihua = frame - baihuaStart;
  const activeRound = Math.max(-1, Math.min(totalRounds - 1, Math.floor(elapsedInBaihua / framesPerRound)));
  const roundPhase = elapsedInBaihua - activeRound * framesPerRound; // 当前轮内帧数

  // 当前轮各阶段
  const phaseHighlight = interpolate(roundPhase, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phaseMerge = interpolate(roundPhase, [6, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phaseNewToken = spring({
    frame: frame - (baihuaStart + activeRound * framesPerRound + 12),
    fps,
    config: { damping: 12, stiffness: 170 },
  });

  const currentRound = activeRound >= 0 && activeRound < totalRounds ? MERGE_ROUNDS[activeRound] : null;

  // 累积已合并 token（沉降区）：所有已完成的轮次
  const completedRounds = Math.max(0, activeRound + (roundPhase > 18 ? 1 : 0));
  const accumulatedTokens = MERGE_ROUNDS.slice(0, Math.min(completedRounds, totalRounds)).map((r) => r.merged);

  // 计数器数值
  const mergeCount = completedRounds;
  const vocabSize = BASE_VOCAB + mergeCount;

  // 计数器跳动（每轮新token完成时弹一下）
  const countPulse = currentRound
    ? Math.max(0, 1 - Math.abs(roundPhase - 18) / 8)
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* 顶部主题 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: frameEnter,
        }}
      >
        <span
          style={{
            background: AMBER,
            color: CREAM,
            padding: "8px 32px",
            borderRadius: 999,
            border: `3px solid ${INK}`,
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 32,
            boxShadow: `4px 4px 0 rgba(0,0,0,0.15)`,
          }}
        >
          BPE：高频对不断合并
        </span>
      </div>

      {/* 左侧主舞台：合并过程 */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 160,
          width: 1080,
          height: 820,
          opacity: frameEnter,
          transform: `translateY(${(1 - frameEnter) * 20}px)`,
          background: CREAM,
          border: `4px solid ${INK}`,
          borderRadius: 24,
          boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
          padding: 30,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 顶部当前轮标签 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: AMBER,
              border: `3px solid ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CREAM,
            }}
          >
            <Combine size={26} strokeWidth={2.4} />
          </div>
          <div style={{ fontFamily: "'ZCOOL KuaiLe', cursive", fontSize: 34, color: INK }}>
            {activeRound >= 0 && activeRound < totalRounds ? `第 ${activeRound + 1} 轮合并` : "准备合并"}
          </div>
        </div>

        {/* 中部：字符对 → 合并 → 新token */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
          }}
        >
          {currentRound ? (
            <>
              {/* 字符对 */}
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {currentRound.pair.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 110,
                      height: 120,
                      background: AMBER_SOFT,
                      border: `4px solid ${AMBER}`,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'ZCOOL KuaiLe', cursive",
                      fontSize: 56,
                      color: INK,
                      transform: `scale(${1 + phaseHighlight * 0.08})`,
                      boxShadow: phaseHighlight > 0 ? `0 0 ${phaseHighlight * 24}px ${AMBER}` : "none",
                      opacity: phaseMerge > 0.5 ? 0.5 : 1,
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>

              {/* 合并箭头 */}
              <div
                style={{
                  opacity: phaseMerge,
                  transform: `translateX(${(1 - phaseMerge) * -20}px)`,
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                  fontSize: 80,
                  color: AMBER,
                }}
              >
                →
              </div>

              {/* 新 token */}
              <div
                style={{
                  width: 200,
                  height: 140,
                  background: AMBER,
                  border: `4px solid ${INK}`,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'ZCOOL KuaiLe', cursive",
                  fontSize: 56,
                  color: CREAM,
                  opacity: phaseNewToken,
                  transform: `scale(${0.6 + phaseNewToken * 0.4}) translateY(${(1 - phaseNewToken) * 20}px)`,
                  boxShadow: `4px 4px 0 rgba(0,0,0,0.2)`,
                }}
              >
                {currentRound.merged}
              </div>
            </>
          ) : (
            // 初始状态：单字符 token 集合
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 800 }}>
              {["t", "h", "e", "r", "i", "n", "a", "b", "c", "d"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 80,
                    height: 90,
                    background: "#EAF4FB",
                    border: `3px solid ${BLUE}`,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'ZCOOL KuaiLe', cursive",
                    fontSize: 42,
                    color: INK,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部累积区 */}
        <div
          style={{
            marginTop: 20,
            padding: "16px 20px",
            background: "#FFFEF9",
            border: `3px dashed ${INK}`,
            borderRadius: 14,
            minHeight: 110,
          }}
        >
          <div
            style={{
              fontFamily: "'ZCOOL XiaoWei', serif",
              fontSize: 20,
              color: "#5D6D7E",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Layers size={20} color={AMBER} strokeWidth={2.4} />
            已合并的新 token
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", minHeight: 50 }}>
            {accumulatedTokens.length === 0 ? (
              <span style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 18, color: "#BDC3C7" }}>
                等待合并...
              </span>
            ) : (
              accumulatedTokens.map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 18px",
                    background: AMBER_SOFT,
                    border: `3px solid ${AMBER}`,
                    borderRadius: 10,
                    fontFamily: "'ZCOOL KuaiLe', cursive",
                    fontSize: 28,
                    color: INK,
                  }}
                >
                  {t}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 右侧侧栏：计数器 */}
      <div
        style={{
          position: "absolute",
          left: 1220,
          top: 160,
          width: 610,
          height: 820,
          opacity: sideEnter,
          transform: `translateX(${(1 - sideEnter) * 30}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        {/* 合并次数 */}
        <div
          style={{
            flex: 1,
            background: CREAM,
            border: `5px solid ${AMBER}`,
            borderRadius: 24,
            boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 + countPulse * 0.04})`,
          }}
        >
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 28, color: "#5D6D7E", marginBottom: 10 }}>
            合并轮次
          </div>
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 180,
              color: AMBER,
              fontWeight: 700,
              lineHeight: 1,
              textShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            #{mergeCount}
          </div>
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 22, color: INK, marginTop: 10 }}>
            高频对被合并的次数
          </div>
        </div>

        {/* 词表大小 */}
        <div
          style={{
            flex: 1,
            background: CREAM,
            border: `5px solid ${INK}`,
            borderRadius: 24,
            boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 + countPulse * 0.04})`,
          }}
        >
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 28, color: "#5D6D7E", marginBottom: 10 }}>
            词表大小 V
          </div>
          <div
            style={{
              fontFamily: "'ZCOOL KuaiLe', cursive",
              fontSize: 180,
              color: INK,
              fontWeight: 700,
              lineHeight: 1,
              textShadow: "4px 4px 0 rgba(0,0,0,0.12)",
            }}
          >
            {vocabSize}
          </div>
          <div style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: 22, color: INK, marginTop: 10 }}>
            基础 {BASE_VOCAB} + 新合并 {mergeCount}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene005;
