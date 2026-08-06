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
    "PPO",
    "奖励"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Atom",
  "question": "MiniMind 这种小项目也搞得起 PPO?",
  "points": [
    {
      "icon": "Atom",
      "keyword": "MiniMind",
      "sub": "核心"
    },
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "细节"
    },
    {
      "icon": "Check",
      "keyword": "奖励",
      "sub": "延伸"
    }
  ]
};

const Scene005: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene005;
