import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { BookOpen } from "lucide-react";

// 配色：琥珀 #B45309 + 米色 #FAF9F7
const AMBER = "#B45309";
const AMBER_SOFT = "#FCD9A4";
const CREAM = "#FAF9F7";
const INK = "#2C3E50";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const Scene001: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0Start = msToFrame(segments[0].relativeStart, fps);

  // 主标题字符序列 TOKENIZER
  const titleChars = ["T", "O", "K", "CUT", "N", "I", "Z", "E", "R"];

  // 头像气泡入场
  const avatarEnter = spring({
    frame: frame - seg0Start,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  // 章节标签淡入
  const tagEnter = interpolate(frame - seg0Start, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 字符错峰下落
  const charFallStart = seg0Start + 8;
  const charProgress = (i: number) => {
    const start = charFallStart + i * 2;
    return spring({
      frame: frame - start,
      fps,
      config: { damping: 12, stiffness: 160 },
    });
  };

  // 波浪下划线（最后一个字符落定后画出）
  const underlineStart = charFallStart + titleChars.length * 2 + 10;
  const underlineProgress = interpolate(frame - underlineStart, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 副锚点淡入
  const subAnchorEnter = interpolate(frame - underlineStart, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 浮动呼吸
  const float = Math.sin((frame / fps) * 2) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* 左侧人物区 */}
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: avatarEnter,
          transform: `translateY(${(1 - avatarEnter) * 40}px) scale(${0.9 + avatarEnter * 0.1})`,
        }}
      >
        {/* 头像气泡 */}
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${AMBER_SOFT} 0%, ${CREAM} 70%)`,
            border: `6px solid ${AMBER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `6px 6px 0 rgba(0,0,0,0.12)`,
            transform: `translateY(${float}px)`,
            position: "relative",
          }}
        >
          {/* 简化人物：冰糖（女助教） */}
          <svg viewBox="0 0 100 100" width="170" height="170">
            {/* 头发 */}
            <path d="M 22 38 Q 22 18 50 18 Q 78 18 78 38 L 78 52 L 22 52 Z" fill={INK} />
            {/* 脸 */}
            <ellipse cx="50" cy="50" rx="22" ry="24" fill="#F5D6B8" />
            {/* 刘海 */}
            <path d="M 28 36 Q 40 28 50 34 Q 60 28 72 36 L 72 42 L 28 42 Z" fill={INK} />
            {/* 眼睛 */}
            <circle cx="42" cy="50" r="2.4" fill={INK} />
            <circle cx="58" cy="50" r="2.4" fill={INK} />
            {/* 腮红 */}
            <circle cx="38" cy="58" r="3" fill="#F5B041" opacity="0.5" />
            <circle cx="62" cy="58" r="3" fill="#F5B041" opacity="0.5" />
            {/* 嘴 */}
            <path d="M 45 62 Q 50 66 55 62" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            {/* 身体 */}
            <path d="M 30 80 Q 50 72 70 80 L 70 100 L 30 100 Z" fill={AMBER} />
          </svg>
          {/* 头像小标 */}
          <div
            style={{
              position: "absolute",
              bottom: -16,
              right: -10,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: AMBER,
              border: `3px solid ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CREAM,
            }}
          >
            <BookOpen size={26} strokeWidth={2.4} />
          </div>
        </div>
        {/* 角色名标签 */}
        <div
          style={{
            background: CREAM,
            border: `3px solid ${INK}`,
            borderRadius: 999,
            padding: "10px 26px",
            fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
            fontSize: 30,
            color: INK,
            boxShadow: `3px 3px 0 rgba(0,0,0,0.12)`,
            transform: "rotate(-2deg)",
          }}
        >
          冰糖 · 助教
        </div>
      </div>

      {/* 右上角章节标签 */}
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 90,
          opacity: tagEnter,
          transform: `translateY(${(1 - tagEnter) * -16}px)`,
          background: AMBER,
          color: CREAM,
          fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
          fontSize: 26,
          padding: "10px 28px",
          borderRadius: 999,
          border: `3px solid ${INK}`,
          boxShadow: `4px 4px 0 rgba(0,0,0,0.15)`,
        }}
      >
        Tokenizer 入门
      </div>

      {/* 右侧巨型主标题 */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 280,
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
        }}
      >
        {titleChars.map((ch, i) => {
          const p = charProgress(i);
          const y = (1 - p) * -120;
          const isCut = ch === "CUT";
          return (
            <div
              key={i}
              style={{
                opacity: p,
                transform: `translateY(${y}px)`,
                width: isCut ? 132 : 110,
                height: 150,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'ZCOOL KuaiLe', 'Comic Sans MS', cursive",
                fontSize: 120,
                fontWeight: 900,
                color: INK,
                textShadow: "4px 4px 0 rgba(0,0,0,0.12)",
              }}
            >
              {isCut ? (
                // 被刀切开的词块，替代 O
                <div style={{ position: "relative", width: 110, height: 130 }}>
                  {/* 上半块 */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 110,
                      height: 60,
                      background: AMBER_SOFT,
                      border: `4px solid ${INK}`,
                      borderBottom: "none",
                      borderRadius: "12px 12px 2px 2px",
                      transform: `translateX(${(1 - p) * 6}px) rotate(${(1 - p) * -3}deg)`,
                    }}
                  />
                  {/* 下半块 */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 110,
                      height: 60,
                      background: AMBER,
                      border: `4px solid ${INK}`,
                      borderTop: "none",
                      borderRadius: "2px 2px 12px 12px",
                      transform: `translateX(${(1 - p) * -6}px) rotate(${(1 - p) * 3}deg)`,
                    }}
                  />
                  {/* 切割闪光 */}
                  <div
                    style={{
                      position: "absolute",
                      left: 4,
                      top: 58,
                      width: 102,
                      height: 4,
                      background: CREAM,
                      boxShadow: `0 0 8px ${AMBER}`,
                      opacity: p,
                    }}
                  />
                </div>
              ) : (
                ch
              )}
            </div>
          );
        })}
      </div>

      {/* 主标题下方琥珀色波浪下划线 */}
      <svg
        viewBox="0 0 1000 30"
        width="820"
        height="26"
        style={{
          position: "absolute",
          right: 130,
          top: 470,
        }}
      >
        <path
          d={`M 0 15 ${Array.from({ length: 20 })
            .map((_, i) => {
              const x = (i + 1) * 50;
              const y = 15 + (i % 2 === 0 ? -10 : 10);
              return `L ${x * underlineProgress} ${15 + (y - 15) * underlineProgress}`;
            })
            .join(" ")}`}
          stroke={AMBER}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* 副锚点 */}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 520,
          opacity: subAnchorEnter,
          transform: `translateY(${(1 - subAnchorEnter) * 12}px)`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: "'ZCOOL XiaoWei', 'Noto Sans SC', serif",
          fontSize: 38,
          color: INK,
        }}
      >
        <span style={{ color: AMBER, fontWeight: 700 }}>分词</span>
        <span style={{ color: "#8B6914" }}>·</span>
        <span>第 01 讲</span>
      </div>
    </AbsoluteFill>
  );
};

export default Scene001;
