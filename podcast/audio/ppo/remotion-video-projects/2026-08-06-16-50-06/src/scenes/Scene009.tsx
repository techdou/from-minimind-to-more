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
    "策略"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Cpu",
  "question": "为什么要截断策略更新?",
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
    }
  ]
};

const Scene009: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene009;
