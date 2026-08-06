import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "MoE",
  "keywords": [
    "MoE"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Network",
  "quote": "GPT-4 据说也是 MoE",
  "points": [
    {
      "icon": "Check",
      "keyword": "我收回'投机取巧'的说法",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "参数容量上去了",
      "sub": "细节"
    }
  ]
};

const Scene011: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene011;
