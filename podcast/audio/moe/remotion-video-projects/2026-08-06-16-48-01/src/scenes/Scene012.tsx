import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "MoE",
  "keywords": [
    "MoE"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
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
      "icon": "Wrench",
      "keyword": "工程",
      "sub": "关键要点"
    },
    {
      "icon": "Atom",
      "keyword": "MiniMind",
      "sub": "重要收获"
    }
  ],
  "nextTitle": "下集预告 · 敬请期待"
};

const Scene012: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene012;
