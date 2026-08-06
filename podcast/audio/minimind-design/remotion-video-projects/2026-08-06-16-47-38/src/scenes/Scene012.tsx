import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "MiniMind",
  "keywords": [
    "MiniMind",
    "KV Cache",
    "推理"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "conclude",
  "subtitle": "本期要点",
  "points": [
    {
      "icon": "Atom",
      "keyword": "MiniMind",
      "sub": "核心结论"
    },
    {
      "icon": "Atom",
      "keyword": "LLaMA",
      "sub": "关键要点"
    },
    {
      "icon": "Network",
      "keyword": "MoE",
      "sub": "重要收获"
    },
    {
      "icon": "HardDrive",
      "keyword": "KV Cache",
      "sub": "延伸"
    }
  ],
  "nextTitle": "下集预告 · 敬请期待"
};

const Scene012: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene012;
