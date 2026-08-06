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
    "KV Cache"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "HardDrive",
  "points": [
    {
      "icon": "Check",
      "keyword": "计算单元闲着",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "这就是存储墙",
      "sub": "细节"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
