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
    "DPO",
    "奖励"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
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
      "icon": "Scale",
      "keyword": "DPO",
      "sub": "细节"
    },
    {
      "icon": "Check",
      "keyword": "奖励",
      "sub": "延伸"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
