import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "奖励",
  "keywords": [
    "奖励"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "points": [
    {
      "icon": "Check",
      "keyword": "比如一个 prompt",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "奖励模型给每个打分",
      "sub": "细节"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
