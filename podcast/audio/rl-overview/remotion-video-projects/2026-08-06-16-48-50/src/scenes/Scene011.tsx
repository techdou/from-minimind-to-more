import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "PPO",
  "keywords": [
    "PPO",
    "DPO",
    "GRPO"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "conclude",
  "subtitle": "本期要点",
  "points": [
    {
      "icon": "Users",
      "keyword": "Actor-Critic",
      "sub": "核心结论"
    },
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "关键要点"
    },
    {
      "icon": "Check",
      "keyword": "策略",
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
