import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "显存",
  "keywords": [
    "显存",
    "推理"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "points": [
    {
      "icon": "Check",
      "keyword": "显存",
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
