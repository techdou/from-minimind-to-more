import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "DPO",
  "keywords": [
    "DPO",
    "奖励"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Scale",
  "question": "数据量不够怎么办?",
  "points": [
    {
      "icon": "Scale",
      "keyword": "DPO",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "奖励",
      "sub": "细节"
    }
  ]
};

const Scene003: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene003;
