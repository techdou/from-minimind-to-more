import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "KV Cache",
  "keywords": [
    "KV Cache",
    "显存",
    "推理"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "HardDrive",
  "points": [
    {
      "icon": "HardDrive",
      "keyword": "KV Cache",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "显存",
      "sub": "细节"
    },
    {
      "icon": "Zap",
      "keyword": "推理",
      "sub": "延伸"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
