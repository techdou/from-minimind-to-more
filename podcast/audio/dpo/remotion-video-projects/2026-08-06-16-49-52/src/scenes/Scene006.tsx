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
    "奖励",
    "策略"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Scale",
  "quote": "DPO 的核心贡献是证明了:在 Bradley-Terry 偏好模型下,最优策略",
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
    },
    {
      "icon": "Check",
      "keyword": "策略",
      "sub": "延伸"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
