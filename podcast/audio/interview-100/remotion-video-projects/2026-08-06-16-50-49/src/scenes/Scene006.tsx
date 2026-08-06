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
    "KV Cache",
    "Flash Attention"
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
      "keyword": "GQA",
      "sub": "核心"
    },
    {
      "icon": "HardDrive",
      "keyword": "KV Cache",
      "sub": "细节"
    },
    {
      "icon": "Zap",
      "keyword": "Flash Attention",
      "sub": "延伸"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
