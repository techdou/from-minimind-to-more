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
    "推理"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Network",
  "quote": "参数量和计算量解耦",
  "points": [
    {
      "icon": "Network",
      "keyword": "MoE",
      "sub": "核心"
    },
    {
      "icon": "Zap",
      "keyword": "推理",
      "sub": "细节"
    }
  ]
};

const Scene002: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene002;
