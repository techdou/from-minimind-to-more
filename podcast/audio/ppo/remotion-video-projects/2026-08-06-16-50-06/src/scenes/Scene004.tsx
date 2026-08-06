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
    "训练"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Telescope",
  "quote": "Actor 是被训练的主角,Critic 估价值函数当教练,Referen",
  "points": [
    {
      "icon": "Telescope",
      "keyword": "RLHF",
      "sub": "核心"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "细节"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
