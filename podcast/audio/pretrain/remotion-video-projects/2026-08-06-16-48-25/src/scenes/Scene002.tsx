import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "推理",
  "keywords": [
    "推理",
    "训练"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Zap",
  "quote": ",模型要学着输出",
  "points": [
    {
      "icon": "Zap",
      "keyword": "推理",
      "sub": "核心"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "细节"
    }
  ]
};

const Scene002: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene002;
