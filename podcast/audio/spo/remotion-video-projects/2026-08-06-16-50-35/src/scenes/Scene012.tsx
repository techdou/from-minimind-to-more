import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "面试",
  "keywords": [
    "面试"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "conclude",
  "subtitle": "本期要点",
  "points": [
    {
      "icon": "Check",
      "keyword": "策略",
      "sub": "核心结论"
    },
    {
      "icon": "Waves",
      "keyword": "KL 散度",
      "sub": "关键要点"
    },
    {
      "icon": "Award",
      "keyword": "GRPO",
      "sub": "重要收获"
    },
    {
      "icon": "Check",
      "keyword": "奖励",
      "sub": "延伸"
    }
  ],
  "nextTitle": "下集预告 · 敬请期待"
};

const Scene012: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene012;
