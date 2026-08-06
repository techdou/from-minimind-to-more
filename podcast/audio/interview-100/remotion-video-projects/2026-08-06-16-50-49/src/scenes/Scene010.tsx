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
    "RoPE"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
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
      "icon": "RotateCw",
      "keyword": "RoPE",
      "sub": "细节"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
