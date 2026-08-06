import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import {
  Sparkles,
  HelpCircle,
  Check,
  ArrowRight,
  Quote,
  BookOpen,
  Cpu,
  Layers,
  Lightbulb,
  Zap,
  ShieldCheck,
  GitBranch,
  Database,
  ArrowDown,
  ArrowUp,
  ArrowUpFromLine,
  ArrowDownToLine,
  Scale,
  Code2,
  BarChart3,
  AlertTriangle,
  Hash,
  Award,
  Plus,
  Split,
  RotateCw,
  Expand,
  Waves,
  Milestone,
  Ruler,
  Quote as QuoteIcon,
  Move3d,
  Link2,
  Type,
  Scissors,
  BookOpenCheck,
  Combine,
  TrendingUp,
  TrendingDown,
  Activity,
  Beaker,
  Network,
  Telescope,
  Compass,
  Compass as CompassIcon,
  ChevronRight,
  Info,
  FlaskConical,
  Atom,
  Binary,
  HardDrive,
  Workflow,
} from "lucide-react";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

export type SceneContentProps = {
  // 顶部副标题（可选）
  subtitle?: string;
  // 大标题（中央）
  title: string;
  // 标题英文/拉丁文（可选）
  titleEn?: string;
  // 关键短语 chip（1-3 个）
  keywords?: string[];
  // 要点卡（最多 4 个）
  points?: Array<{ icon: string; keyword: string; sub?: string }>;
  // 演讲人头像 + 名字
  speaker?: { name: string; role: string };
  // 提问气泡（场景是 guest 提问时）
  question?: string;
  // 引用 / 名言（场景是引用时）
  quote?: string;
  // 主图标名（lucide-react 名字）
  mainIcon?: string;
  // 标题区下的小副标签
  tag?: string;
  // 数字大字（场景是讲数据时）
  bigNumber?: { value: string; label: string };
  // 副卡 1（对比例子）
  compareA?: { title: string; sub: string; tone: "good" | "bad" | "neutral" };
  compareB?: { title: string; sub: string; tone: "good" | "bad" | "neutral" };
  // 是否片头/片尾
  variant?: "title" | "body" | "conclude";
  // 下集预告
  nextTitle?: string;
};

const AMBER = "#B45309";
const AMBER_SOFT = "#F59E0B";
const AMBER_DEEP = "#92400E";
const BEIGE = "#FAF9F7";
const INK = "#2C3E50";
const INK_SOFT = "#4B5563";
const GRAY = "#9CA3AF";
const RED = "#C0392B";
const GREEN = "#2D5A3D";
const BLUE = "#5DADE2";

const ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>> = {
  Sparkles, HelpCircle, Check, ArrowRight, Quote, BookOpen, Cpu, Layers, Lightbulb, Zap, ShieldCheck,
  GitBranch, Database, ArrowDown, ArrowUp, ArrowUpFromLine, ArrowDownToLine, Scale, Code2, BarChart3,
  AlertTriangle, Hash, Award, Plus, Split, RotateCw, Expand, Waves, Milestone, Ruler, Move3d, Link2,
  Type, Scissors, BookOpenCheck, Combine, TrendingUp, TrendingDown, Activity, Beaker, Network, Telescope,
  Compass, CompassIcon, ChevronRight, Info, FlaskConical, Atom, Binary, HardDrive, Workflow, QuoteIcon,
};

const iconRender = (name: string | undefined, size = 36, color = AMBER): React.ReactNode => {
  if (!name) return null;
  const Comp = ICONS[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={2.2} color={color} />;
};

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// 短入场窗口工具
const enter = (frame: number, startFrame: number, enterFrames = 14) => {
  return interpolate(frame, [startFrame, startFrame + enterFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const enterSpring = (frame: number, startFrame: number, fps: number, enterFrames = 16) => {
  return spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: enterFrames,
  });
};

export const SceneContent: React.FC<{ segments: Segment[] } & SceneContentProps> = ({
  segments,
  subtitle,
  title,
  titleEn,
  keywords = [],
  points = [],
  speaker,
  question,
  quote,
  mainIcon,
  tag,
  bigNumber,
  compareA,
  compareB,
  variant = "body",
  nextTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg0 = segments[0];
  if (!seg0) return <AbsoluteFill style={{ background: "transparent" }} />;
  const beatStart = msToFrame(seg0.relativeStart, fps);

  // 片头/片尾变体：标题居中，弱化细节
  if (variant === "title") {
    const titleEnter = enterSpring(frame, beatStart, fps, 18);
    const subEnter = enter(frame, beatStart + 10, 12);
    const tagEnter = enter(frame, beatStart + 14, 12);
    const iconEnter = enterSpring(frame, beatStart + 6, fps, 14);
    const keyEnter = enterSpring(frame, beatStart + 20, fps, 14);

    return (
      <AbsoluteFill style={{ background: "transparent" }}>
        {subtitle && (
          <div
            style={{
              position: "absolute",
              top: 110,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: subEnter,
              fontFamily: "'Comic Sans MS', cursive",
              fontSize: 36,
              color: GRAY,
              letterSpacing: "0.18em",
            }}
          >
            {subtitle}
          </div>
        )}

        {mainIcon && (
          <div
            style={{
              position: "absolute",
              top: 240,
              left: "50%",
              transform: `translateX(-50%) scale(${0.7 + iconEnter * 0.3})`,
              opacity: iconEnter,
            }}
          >
            {iconRender(mainIcon, 120, AMBER)}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 470,
            left: 0,
            right: 0,
            textAlign: "center",
            transform: `scale(${0.85 + titleEnter * 0.15})`,
            opacity: titleEnter,
          }}
        >
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 200,
              fontWeight: 700,
              color: INK,
              lineHeight: 1,
              textShadow: "4px 4px 0 rgba(44,62,80,0.12)",
            }}
          >
            {title}
          </div>
          {titleEn && (
            <div
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                fontSize: 50,
                color: GRAY,
                letterSpacing: "0.2em",
                marginTop: 12,
              }}
            >
              {titleEn}
            </div>
          )}
        </div>

        {keywords.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 800,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 30,
              opacity: keyEnter,
            }}
          >
            {keywords.map((k, i) => (
              <div
                key={i}
                style={{
                  background: AMBER,
                  color: BEIGE,
                  fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                  fontSize: 56,
                  fontWeight: 700,
                  padding: "12px 40px",
                  borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px",
                  border: `4px solid ${INK}`,
                  boxShadow: "6px 6px 0 rgba(44,62,80,0.18)",
                }}
              >
                {k}
              </div>
            ))}
          </div>
        )}

        {tag && (
          <div
            style={{
              position: "absolute",
              bottom: 90,
              right: 110,
              opacity: tagEnter,
              fontFamily: "'Comic Sans MS', cursive",
              fontSize: 28,
              color: GRAY,
              letterSpacing: "0.15em",
            }}
          >
            {tag}
          </div>
        )}
      </AbsoluteFill>
    );
  }

  if (variant === "conclude") {
    const titleEnter = enterSpring(frame, beatStart, fps, 16);
    const pointsEnter = points.map((_, i) => enterSpring(frame, beatStart + 16 + i * 8, fps, 14));
    const nextEnter = enter(frame, beatStart + 80, 16);

    return (
      <AbsoluteFill style={{ background: "transparent" }}>
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: titleEnter,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: AMBER,
              color: BEIGE,
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 60,
              fontWeight: 700,
              padding: "18px 60px",
              borderRadius: 14,
              border: `4px solid ${INK}`,
              boxShadow: "6px 6px 0 rgba(44,62,80,0.2)",
            }}
          >
            {subtitle || "本期要点收束"} · {title}
          </div>
        </div>

        {points.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 320,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              width: 1300,
            }}
          >
            {points.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  background: BEIGE,
                  border: `3px solid ${INK}`,
                  borderRadius: 14,
                  padding: "20px 36px",
                  boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
                  opacity: pointsEnter[i] || 0,
                  transform: `translateX(${(1 - (pointsEnter[i] || 0)) * 40}px)`,
                }}
              >
                <div
                  style={{
                    minWidth: 56,
                    height: 56,
                    borderRadius: 9999,
                    background: AMBER,
                    color: BEIGE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "ZCOOL KuaiLe, cursive",
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                {iconRender(p.icon, 38, AMBER)}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                      fontSize: 42,
                      fontWeight: 700,
                      color: INK,
                      lineHeight: 1.1,
                    }}
                  >
                    {p.keyword}
                  </div>
                  {p.sub && (
                    <div
                      style={{
                        fontFamily: "'Comic Sans MS', cursive",
                        fontSize: 22,
                        color: GRAY,
                        marginTop: 4,
                      }}
                    >
                      {p.sub}
                    </div>
                  )}
                </div>
                <Check size={36} strokeWidth={3} color={AMBER} />
              </div>
            ))}
          </div>
        )}

        {nextTitle && (
          <div
            style={{
              position: "absolute",
              bottom: 90,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 30,
              opacity: nextEnter,
            }}
          >
            <ArrowRight size={50} strokeWidth={3} color={AMBER} />
            <div
              style={{
                background: AMBER,
                color: BEIGE,
                fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                fontSize: 42,
                fontWeight: 700,
                padding: "16px 48px",
                borderRadius: 14,
                border: `4px solid ${INK}`,
                boxShadow: "5px 5px 0 rgba(44,62,80,0.2)",
              }}
            >
              {nextTitle}
            </div>
          </div>
        )}
      </AbsoluteFill>
    );
  }

  // ====== body variant ======
  const headerEnter = enterSpring(frame, beatStart, fps, 14);
  const mainEnter = enterSpring(frame, beatStart + 6, fps, 16);
  const pointsEnterArr = points.map((_, i) => enterSpring(frame, beatStart + 20 + i * 6, fps, 14));
  const speakerEnter = enter(frame, beatStart + 50, 12);
  const bigNumEnter = enterSpring(frame, beatStart + 12, fps, 16);
  const compareAEnter = enter(frame, beatStart + 18, 14);
  const compareBEnter = enter(frame, beatStart + 26, 14);

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 左下角说话人 chip */}
      {speaker && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 110,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: speakerEnter,
          }}
        >
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: 9999,
              background: BEIGE,
              border: `3px solid ${AMBER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "ZCOOL KuaiLe, cursive",
              fontSize: 36,
              color: AMBER,
              fontWeight: 700,
              boxShadow: "4px 4px 0 rgba(44,62,80,0.18)",
            }}
          >
            {speaker.name.charAt(0)}
          </div>
          <div>
            <div
              style={{
                fontFamily: "ZCOOL KuaiLe, cursive",
                fontSize: 30,
                color: INK,
                fontWeight: 700,
              }}
            >
              {speaker.name}
            </div>
            <div
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                fontSize: 20,
                color: GRAY,
              }}
            >
              {speaker.role}
            </div>
          </div>
        </div>
      )}

      {/* 顶部副标题 chip */}
      {subtitle && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: headerEnter,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 26px",
              background: BEIGE,
              border: `2px solid ${AMBER}`,
              borderRadius: 9999,
              color: AMBER,
              fontFamily: "'Comic Sans MS', cursive",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.1em",
              boxShadow: "3px 3px 0 rgba(44,62,80,0.15)",
            }}
          >
            {subtitle}
          </span>
        </div>
      )}

      {/* 中央主图标 + 标题 + 关键短语 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: mainEnter,
          transform: `scale(${0.9 + mainEnter * 0.1})`,
        }}
      >
        {mainIcon && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            {iconRender(mainIcon, 90, AMBER)}
          </div>
        )}

        <div
          style={{
            fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
            fontSize: 130,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.05,
            textShadow: "4px 4px 0 rgba(44,62,80,0.1)",
          }}
        >
          {title}
        </div>

        {titleEn && (
          <div
            style={{
              fontFamily: "'Comic Sans MS', cursive",
              fontSize: 38,
              color: GRAY,
              letterSpacing: "0.18em",
              marginTop: 8,
            }}
          >
            {titleEn}
          </div>
        )}

        {keywords.length > 0 && (
          <div
            style={{
              marginTop: 28,
              display: "flex",
              justifyContent: "center",
              gap: 22,
              flexWrap: "wrap",
              maxWidth: 1600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {keywords.map((k, i) => (
              <div
                key={i}
                style={{
                  background: AMBER,
                  color: BEIGE,
                  fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                  fontSize: 40,
                  fontWeight: 700,
                  padding: "8px 30px",
                  borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px",
                  border: `3px solid ${INK}`,
                  boxShadow: "4px 4px 0 rgba(44,62,80,0.18)",
                }}
              >
                {k}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 提问气泡 */}
      {question && (
        <div
          style={{
            position: "absolute",
            bottom: 200,
            right: 110,
            background: BEIGE,
            border: `3px solid ${INK}`,
            borderRadius: "28px 28px 6px 28px",
            padding: "22px 34px",
            boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
            maxWidth: 460,
            opacity: enter(frame, beatStart + 18, 14),
            transform: `translateX(${interpolate(enter(frame, beatStart + 18, 14), [0, 1], [40, 0])}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <HelpCircle size={32} strokeWidth={2.4} color={AMBER} />
            <div>
              <div
                style={{
                  fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                  fontSize: 32,
                  color: INK,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {question}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 名言引用 */}
      {quote && (
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 110,
            right: 110,
            background: BEIGE,
            border: `3px solid ${AMBER}`,
            borderRadius: 16,
            padding: "30px 40px",
            boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
            opacity: enter(frame, beatStart + 6, 16),
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Quote size={56} strokeWidth={2.4} color={AMBER} />
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 44,
              color: INK,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {quote}
          </div>
        </div>
      )}

      {/* 大数字 */}
      {bigNumber && (
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: bigNumEnter,
            transform: `scale(${0.8 + bigNumEnter * 0.2})`,
          }}
        >
          <div
            style={{
              fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
              fontSize: 220,
              fontWeight: 700,
              color: AMBER,
              lineHeight: 1,
              textShadow: "6px 6px 0 rgba(44,62,80,0.15)",
            }}
          >
            {bigNumber.value}
          </div>
          <div
            style={{
              fontFamily: "'Comic Sans MS', cursive",
              fontSize: 36,
              color: INK_SOFT,
              letterSpacing: "0.1em",
              marginTop: 12,
            }}
          >
            {bigNumber.label}
          </div>
        </div>
      )}

      {/* 对比卡 */}
      {(compareA || compareB) && (
        <div
          style={{
            position: "absolute",
            top: 530,
            left: 110,
            right: 110,
            display: "flex",
            justifyContent: "center",
            gap: 50,
          }}
        >
          {compareA && (
            <div
              style={{
                width: 740,
                background: BEIGE,
                border: `4px solid ${compareA.tone === "good" ? GREEN : compareA.tone === "bad" ? RED : INK}`,
                borderRadius: 16,
                padding: "30px 36px",
                boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
                opacity: compareAEnter,
                transform: `translateX(${(1 - compareAEnter) * -30}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                  fontSize: 52,
                  fontWeight: 700,
                  color: compareA.tone === "good" ? GREEN : compareA.tone === "bad" ? RED : INK,
                  marginBottom: 12,
                }}
              >
                {compareA.title}
              </div>
              <div
                style={{
                  fontFamily: "'Comic Sans MS', cursive",
                  fontSize: 26,
                  color: INK_SOFT,
                }}
              >
                {compareA.sub}
              </div>
            </div>
          )}
          {compareB && (
            <div
              style={{
                width: 740,
                background: BEIGE,
                border: `4px solid ${compareB.tone === "good" ? GREEN : compareB.tone === "bad" ? RED : INK}`,
                borderRadius: 16,
                padding: "30px 36px",
                boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
                opacity: compareBEnter,
                transform: `translateX(${(1 - compareBEnter) * 30}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                  fontSize: 52,
                  fontWeight: 700,
                  color: compareB.tone === "good" ? GREEN : compareB.tone === "bad" ? RED : INK,
                  marginBottom: 12,
                }}
              >
                {compareB.title}
              </div>
              <div
                style={{
                  fontFamily: "'Comic Sans MS', cursive",
                  fontSize: 26,
                  color: INK_SOFT,
                }}
              >
                {compareB.sub}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 要点列表（最多 4 个，3x2 或 2x2 网格） */}
      {points.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 600,
            left: 110,
            right: 110,
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(points.length, 3)}, 1fr)`,
            gap: 30,
          }}
        >
          {points.map((p, i) => (
            <div
              key={i}
              style={{
                background: BEIGE,
                border: `3px solid ${INK}`,
                borderRadius: 14,
                padding: "26px 28px",
                boxShadow: "5px 5px 0 rgba(44,62,80,0.15)",
                opacity: pointsEnterArr[i] || 0,
                transform: `translateY(${(1 - (pointsEnterArr[i] || 0)) * 20}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                {iconRender(p.icon, 36, AMBER)}
                <div
                  style={{
                    fontFamily: "ZCOOL KuaiLe, 'Comic Sans MS', cursive",
                    fontSize: 38,
                    color: INK,
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {p.keyword}
                </div>
              </div>
              {p.sub && (
                <div
                  style={{
                    fontFamily: "'Comic Sans MS', cursive",
                    fontSize: 22,
                    color: INK_SOFT,
                  }}
                >
                  {p.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
