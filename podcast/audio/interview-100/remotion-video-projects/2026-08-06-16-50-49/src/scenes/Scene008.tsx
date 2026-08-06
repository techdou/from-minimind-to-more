import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "SFT",
  "keywords": [
    "SFT",
    "RLHF",
    "PPO"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Beaker",
  "quote": "Loss Mask 是 SFT 的核心考点",
  "points": [
    {
      "icon": "Beaker",
      "keyword": "SFT",
      "sub": "核心"
    },
    {
      "icon": "Telescope",
      "keyword": "RLHF",
      "sub": "细节"
    },
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "延伸"
    }
  ]
};

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
