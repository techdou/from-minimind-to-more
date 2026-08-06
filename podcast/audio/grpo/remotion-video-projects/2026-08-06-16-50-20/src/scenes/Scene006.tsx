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
    "奖励",
    "显存"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Award",
  "quote": "但 Critic 是一直驻留显存的固定成本,采样是训练时的临时开销,权衡下来省得多",
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
    },
    {
      "icon": "Check",
      "keyword": "显存",
      "sub": "延伸"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
