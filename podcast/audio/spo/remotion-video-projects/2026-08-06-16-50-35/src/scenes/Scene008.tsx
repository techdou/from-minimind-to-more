import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "策略",
  "keywords": [
    "策略",
    "KL 散度",
    "训练"
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
      "keyword": "策略",
      "sub": "核心"
    },
    {
      "icon": "Waves",
      "keyword": "KL 散度",
      "sub": "细节"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "延伸"
    }
  ]
};

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
