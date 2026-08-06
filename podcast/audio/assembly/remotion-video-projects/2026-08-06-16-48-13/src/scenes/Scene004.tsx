import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "LLaMA",
  "keywords": [
    "LLaMA",
    "LayerNorm",
    "RMSNorm"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Atom",
  "points": [
    {
      "icon": "Atom",
      "keyword": "LLaMA",
      "sub": "核心"
    },
    {
      "icon": "Layers",
      "keyword": "LayerNorm",
      "sub": "细节"
    },
    {
      "icon": "Layers",
      "keyword": "RMSNorm",
      "sub": "延伸"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
