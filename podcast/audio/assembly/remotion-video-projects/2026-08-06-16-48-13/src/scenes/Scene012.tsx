import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "训练",
  "keywords": [
    "训练"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "conclude",
  "subtitle": "本期要点",
  "points": [
    {
      "icon": "Network",
      "keyword": "MoE",
      "sub": "核心结论"
    },
    {
      "icon": "Atom",
      "keyword": "MiniMind",
      "sub": "关键要点"
    },
    {
      "icon": "Layers",
      "keyword": "RMSNorm",
      "sub": "重要收获"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "延伸"
    }
  ],
  "nextTitle": "下集预告 · 敬请期待"
};

const Scene012: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene012;
