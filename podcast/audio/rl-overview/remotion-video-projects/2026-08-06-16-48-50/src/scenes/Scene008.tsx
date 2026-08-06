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
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Cpu",
  "quote": "Actor 是策略网络负责做决策,Critic 是价值网络负责评价决策好坏",
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

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
