import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "GRPO",
  "keywords": [
    "GRPO",
    "奖励"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Award",
  "points": [
    {
      "icon": "Award",
      "keyword": "GRPO",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "奖励",
      "sub": "细节"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
