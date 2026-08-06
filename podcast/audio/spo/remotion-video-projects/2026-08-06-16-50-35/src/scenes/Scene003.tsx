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
    "GRPO"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Cpu",
  "question": "那基准线从哪来?",
  "points": [
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "核心"
    },
    {
      "icon": "Award",
      "keyword": "GRPO",
      "sub": "细节"
    }
  ]
};

const Scene003: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene003;
