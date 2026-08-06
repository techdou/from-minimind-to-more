import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Sparkles, Zap, ShieldCheck, Layers, Cpu, GitBranch, ArrowRight } from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

// 主题配色：琥珀 + 米色
const COLOR = {
  amber: "#B45309",
  amberDeep: "#92400E",
  amberSoft: "#FCD34D",
  amberTint: "rgba(180, 83, 9, 0.08)",
  cream: "#FAF9F7",
  creamTint: "rgba(250, 249, 247, 0.92)",
  ink: "#1F2937",
  inkSoft: "#4B5563",
  paperLine: "rgba(180, 83, 9, 0.18)",
};

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// 短入场窗口工具：固定帧偏移，不拉满整个 beat
const enter = (frame: number, startFrame: number, enterFrames: number) => {
  return interpolate(frame, [startFrame, startFrame + enterFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

type PointCard = {
  index: string;
  keyword: string;
  sub: string;
  icon: React.ReactNode;
};

const POINTS: PointCard[] = [
  {
    index: "01",
    keyword: "训练稳定",
    sub: "归一化的核心目的",
    icon: <ShieldCheck size={44} strokeWidth={2.2} color={COLOR.amber} />,
  },
  {
    index: "02",
    keyword: "LayerNorm 胜出",
    sub: "NLP 不用 BatchNorm",
    icon: <Layers size={44} strokeWidth={2.2} color={COLOR.amber} />,
  },
  {
    index: "03",
    keyword: "RMSNorm 省算力",
    sub: "主流模型的取舍",
    icon: <Cpu size={44} strokeWidth={2.2} color={COLOR.amber} />,
  },
  {
    index: "04",
    keyword: "Pre-Norm 更稳",
    sub: "深网训练更友好",
    icon: <GitBranch size={44} strokeWidth={2.2} color={COLOR.amber} />,
  },
];

const Scene011: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === 时间锚点（从 segments 推导） ===
  // Beat 1: segment 0（苏打收尾铺垫）— 标题章 + 收尾锚点 + 虚位占位
  const beat1Start = msToFrame(segments[0]?.relativeStart ?? 0, fps);
  // Beat 2: segment 1（茉莉完整总结 + 预告）— 四要点 + 预告条幅
  const beat2Start = msToFrame(segments[1]?.relativeStart ?? 7390, fps);
  const beat2End = msToFrame(
    (segments[1]?.relativeStart ?? 7390) + (segments[1]?.relativeDuration ?? 15360),
    fps
  );

  // === Beat 1 入场窗口 ===
  const titleEnterFrames = 14;
  const anchorEnterFrames = 12;

  const titleEnter = enter(frame, beat1Start, titleEnterFrames);
  const titleSpring = spring({
    frame: frame - beat1Start,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);
  const titleY = interpolate(titleEnter, [0, 1], [-22, 0]);

  const anchorStart = beat1Start + 10; // 固定帧偏移错峰
  const anchorEnter = enter(frame, anchorStart, anchorStart + anchorEnterFrames - anchorStart);

  // 虚位占位：beat1 期间极淡显示，beat2 开始后让位给实卡
  const placeholderFadeIn = enter(frame, beat1Start + 16, 10);
  const placeholderFadeOut = interpolate(frame, [beat2Start - 6, beat2Start + 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const placeholderOpacity = placeholderFadeIn * placeholderFadeOut;

  // === Beat 2：四张要点卡错峰点亮（固定帧偏移） ===
  const cardEnterFrames = 12;
  const cardStagger = 10; // 每张卡之间固定间隔 10 帧
  const cardStarts = POINTS.map((_, i) => beat2Start + i * cardStagger);

  // 预告条幅：四要点全部就位后升起
  const previewTriggerFrame = cardStarts[cardStarts.length - 1] + cardEnterFrames + 8;
  const previewEnterFrames = 16;
  const previewEnter = enter(frame, previewTriggerFrame, previewEnterFrames);
  const previewSpring = spring({
    frame: frame - previewTriggerFrame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const previewY = interpolate(previewSpring, [0, 1], [60, 0]);
  const previewOpacity = previewEnter;

  // 预告条幅内的轻微呼吸提示（贯穿整段字幕的持续性变化，符合规则）
  const breathe = interpolate(
    Math.sin((frame - previewTriggerFrame) * 0.12),
    [-1, 1],
    [0.85, 1]
  );

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 整屏构图舞台，按 1920x1080 设计画布组织 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 96,
        }}
      >
        {/* ============ 顶部标题章（ribbon-banner 风格） ============ */}
        <div
          style={{
            opacity: titleEnter,
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 56px",
              background: COLOR.amber,
              color: COLOR.cream,
              fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "0.08em",
              border: `4px solid ${COLOR.amberDeep}`,
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              boxShadow: "6px 6px 0 rgba(180, 83, 9, 0.18)",
              transform: "rotate(-1deg)",
            }}
          >
            <Sparkles size={36} strokeWidth={2.4} color={COLOR.cream} />
            <span>本期归一化要点</span>
          </div>

          {/* 短收尾锚点 */}
          <div
            style={{
              opacity: anchorEnter,
              transform: `translateY(${interpolate(anchorEnter, [0, 1], [12, 0])}px)`,
              fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
              fontSize: 34,
              fontWeight: 500,
              color: COLOR.inkSoft,
              letterSpacing: "0.06em",
            }}
          >
            四个关键结论，一图带走
          </div>
        </div>

        {/* ============ 中央主舞台：四张要点卡（2x2 网格） ============ */}
        <div
          style={{
            position: "relative",
            marginTop: 56,
            width: 1500,
            height: 560,
          }}
        >
          {/* 虚位占位（beat1 期间极淡显示，beat2 让位给实卡） */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: placeholderOpacity,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 32,
              pointerEvents: "none",
            }}
          >
            {POINTS.map((p, i) => (
              <div
                key={`ph-${i}`}
                style={{
                  border: `2px dashed ${COLOR.paperLine}`,
                  borderRadius: 18,
                  background: COLOR.amberTint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
                  fontSize: 24,
                  color: "rgba(180, 83, 9, 0.35)",
                  letterSpacing: "0.1em",
                }}
              >
                {`要点 ${p.index} · 即将点亮`}
              </div>
            ))}
          </div>

          {/* 实际要点卡 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 32,
            }}
          >
            {POINTS.map((point, i) => {
              const startF = cardStarts[i];
              const cardProg = enter(frame, startF, cardEnterFrames);
              const cardSpring = spring({
                frame: frame - startF,
                fps,
                config: { damping: 15, stiffness: 120 },
              });
              const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1]);
              const cardY = interpolate(cardProg, [0, 1], [24, 0]);
              // 编号徽章略晚一拍点亮
              const badgeProg = enter(frame, startF + 4, 8);

              return (
                <div
                  key={point.index}
                  style={{
                    opacity: cardProg,
                    transform: `translateY(${cardY}px) scale(${cardScale})`,
                    background: COLOR.creamTint,
                    border: `3px solid ${COLOR.amber}`,
                    borderRadius: 22,
                    boxShadow: `4px 4px 0 ${COLOR.amberTint}, 0 8px 24px rgba(180, 83, 9, 0.08)`,
                    padding: "28px 36px",
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* 左侧琥珀色侧边条 */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 8,
                      background: COLOR.amber,
                    }}
                  />

                  {/* 编号徽章 */}
                  <div
                    style={{
                      opacity: badgeProg,
                      transform: `scale(${interpolate(badgeProg, [0, 1], [0.6, 1])})`,
                      flexShrink: 0,
                      width: 76,
                      height: 76,
                      borderRadius: "50%",
                      background: COLOR.amber,
                      color: COLOR.cream,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
                      fontSize: 32,
                      fontWeight: 700,
                      border: `3px solid ${COLOR.amberDeep}`,
                      boxShadow: "3px 3px 0 rgba(180, 83, 9, 0.18)",
                    }}
                  >
                    {point.index}
                  </div>

                  {/* 图标 */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 72,
                      height: 72,
                      borderRadius: 16,
                      background: "rgba(180, 83, 9, 0.06)",
                      border: `2px solid ${COLOR.paperLine}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {point.icon}
                  </div>

                  {/* 文本区 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
                        fontSize: 38,
                        fontWeight: 700,
                        color: COLOR.ink,
                        letterSpacing: "0.04em",
                        lineHeight: 1.15,
                      }}
                    >
                      {point.keyword}
                    </div>
                    <div
                      style={{
                        fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
                        fontSize: 24,
                        fontWeight: 400,
                        color: COLOR.inkSoft,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {point.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ 底部「下一篇」预告条幅 ============ */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 70,
            transform: `translateX(-50%) translateY(${previewY}px)`,
            opacity: previewOpacity,
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            width: 1100,
          }}
        >
          {/* 左侧「下一篇」标签 */}
          <div
            style={{
              background: COLOR.amberDeep,
              color: COLOR.cream,
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderTopLeftRadius: 18,
              borderBottomLeftRadius: 18,
              fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "0.1em",
              border: `3px solid ${COLOR.amberDeep}`,
            }}
          >
            <ArrowRight size={28} strokeWidth={2.4} color={COLOR.cream} />
            <span>下一篇</span>
          </div>

          {/* 右侧预告主体 */}
          <div
            style={{
              flex: 1,
              background: COLOR.cream,
              border: `3px solid ${COLOR.amber}`,
              borderLeft: "none",
              borderTopRightRadius: 18,
              borderBottomRightRadius: 18,
              padding: "18px 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              boxShadow: `0 8px 24px ${COLOR.amberTint}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
                  fontSize: 44,
                  fontWeight: 700,
                  color: COLOR.amber,
                  letterSpacing: "0.06em",
                  lineHeight: 1.1,
                }}
              >
                KV Cache
              </div>
              <div
                style={{
                  fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: COLOR.inkSoft,
                  letterSpacing: "0.05em",
                }}
              >
                推理加速的关键
              </div>
            </div>

            {/* 右侧图标组 + 呼吸提示 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: breathe,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(180, 83, 9, 0.08)",
                  border: `2px solid ${COLOR.paperLine}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={32} strokeWidth={2.4} color={COLOR.amber} />
              </div>
              <Sparkles size={28} strokeWidth={2.4} color={COLOR.amberSoft} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene011;
