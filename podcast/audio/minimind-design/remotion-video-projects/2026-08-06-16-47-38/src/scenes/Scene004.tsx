import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "Decoder-Only",
  "keywords": [
    "Decoder-Only",
    "Next Token"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "ArrowRight",
  "quote": "是双向的,适合理解任务;但生成任务,GPT 这种单向架构才是主流,现在大模型基本都选它",
  "points": [
    {
      "icon": "ArrowRight",
      "keyword": "Decoder-Only",
      "sub": "核心"
    },
    {
      "icon": "ArrowRight",
      "keyword": "Next Token",
      "sub": "细节"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
