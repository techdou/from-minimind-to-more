import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "价值",
  "keywords": [
    "价值"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "points": [
    {
      "icon": "Check",
      "keyword": "这就是 SPO 的巧思",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "它用了一个纯数学的追踪器",
      "sub": "细节"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
