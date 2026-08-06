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
    "奖励",
    "显存"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Telescope",
  "quote": "而且奖励模型本身也是近似,引入了额外的偏差",
  "points": [
    {
      "icon": "Telescope",
      "keyword": "RLHF",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "奖励",
      "sub": "细节"
    },
    {
      "icon": "Check",
      "keyword": "显存",
      "sub": "延伸"
    }
  ]
};

const Scene002: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene002;
