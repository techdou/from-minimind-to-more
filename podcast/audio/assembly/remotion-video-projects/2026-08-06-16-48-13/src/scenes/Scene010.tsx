import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "MiniMind",
  "keywords": [
    "MiniMind",
    "RMSNorm",
    "Embedding"
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
      "keyword": "MiniMind",
      "sub": "核心"
    },
    {
      "icon": "Layers",
      "keyword": "RMSNorm",
      "sub": "细节"
    },
    {
      "icon": "Database",
      "keyword": "Embedding",
      "sub": "延伸"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
