import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "GQA",
  "keywords": [
    "GQA",
    "Flash Attention",
    "RoPE"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Network",
  "points": [
    {
      "icon": "Network",
      "keyword": "GQA",
      "sub": "核心"
    },
    {
      "icon": "Zap",
      "keyword": "Flash Attention",
      "sub": "细节"
    },
    {
      "icon": "RotateCw",
      "keyword": "RoPE",
      "sub": "延伸"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
