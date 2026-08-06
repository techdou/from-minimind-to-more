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
    "GRPO"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Atom",
  "quote": "MiniMind 实现的是标准 GRPO,先把核心流程跑通",
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
      "icon": "Award",
      "keyword": "GRPO",
      "sub": "延伸"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
