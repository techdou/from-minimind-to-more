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
    "PPO",
    "GRPO"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Telescope",
  "points": [
    {
      "icon": "Telescope",
      "keyword": "RLHF",
      "sub": "核心"
    },
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "细节"
    },
    {
      "icon": "Award",
      "keyword": "GRPO",
      "sub": "延伸"
    }
  ]
};

const Scene011: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene011;
