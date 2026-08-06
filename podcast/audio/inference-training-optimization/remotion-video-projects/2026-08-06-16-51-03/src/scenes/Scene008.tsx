import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "会有轻微损失",
  "keywords": [],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "quote": "关键是用得够大——模型越大,量化对效果的影响越小,这是涌现现象之一",
  "points": [
    {
      "icon": "Check",
      "keyword": "会有轻微损失",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "但 INT8 几乎无损",
      "sub": "细节"
    }
  ]
};

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
