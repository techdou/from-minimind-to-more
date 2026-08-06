import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "位置编码",
  "keywords": [
    "位置编码",
    "推理",
    "训练"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "conclude",
  "subtitle": "本期要点",
  "points": [
    {
      "icon": "Beaker",
      "keyword": "SFT",
      "sub": "核心结论"
    },
    {
      "icon": "Telescope",
      "keyword": "RLHF",
      "sub": "关键要点"
    },
    {
      "icon": "Network",
      "keyword": "MoE",
      "sub": "重要收获"
    },
    {
      "icon": "RotateCw",
      "keyword": "RoPE",
      "sub": "延伸"
    }
  ],
  "nextTitle": "下集预告 · 敬请期待"
};

const Scene011: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene011;
