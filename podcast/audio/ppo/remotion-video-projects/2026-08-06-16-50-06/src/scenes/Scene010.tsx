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
    "策略",
    "梯度"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Cpu",
  "quote": "2,保证每步更新都是小步快走,训练稳定",
  "points": [
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "策略",
      "sub": "细节"
    },
    {
      "icon": "Waves",
      "keyword": "梯度",
      "sub": "延伸"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
