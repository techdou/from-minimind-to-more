import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "RLHF",
  "keywords": [
    "RLHF",
    "DPO"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "conclude",
  "subtitle": "本期要点",
  "points": [
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "核心结论"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "关键要点"
    },
    {
      "icon": "Beaker",
      "keyword": "SFT",
      "sub": "重要收获"
    },
    {
      "icon": "Scale",
      "keyword": "DPO",
      "sub": "延伸"
    }
  ],
  "nextTitle": "下集预告 · 敬请期待"
};

const Scene011: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene011;
