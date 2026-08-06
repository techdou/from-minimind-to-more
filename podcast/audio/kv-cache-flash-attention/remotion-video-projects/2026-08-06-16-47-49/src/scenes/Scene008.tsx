import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "Flash Attention",
  "keywords": [
    "Flash Attention",
    "显存"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Zap",
  "points": [
    {
      "icon": "Zap",
      "keyword": "Flash Attention",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "显存",
      "sub": "细节"
    }
  ]
};

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
