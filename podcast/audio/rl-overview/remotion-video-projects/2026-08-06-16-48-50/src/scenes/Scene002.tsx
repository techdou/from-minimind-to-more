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
    "奖励",
    "训练"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "quote": "第三,核心就是让好回答概率变大、坏回答概率变小",
  "points": [
    {
      "icon": "Check",
      "keyword": "奖励",
      "sub": "核心"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "细节"
    }
  ]
};

const Scene002: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene002;
