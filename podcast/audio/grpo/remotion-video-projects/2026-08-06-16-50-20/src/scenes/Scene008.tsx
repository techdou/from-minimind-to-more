import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "MoE",
  "keywords": [
    "MoE",
    "GRPO",
    "训练"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Network",
  "points": [
    {
      "icon": "Network",
      "keyword": "MoE",
      "sub": "核心"
    },
    {
      "icon": "Award",
      "keyword": "GRPO",
      "sub": "细节"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "延伸"
    }
  ]
};

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
