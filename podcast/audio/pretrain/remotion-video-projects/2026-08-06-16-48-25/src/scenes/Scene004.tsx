import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "训练",
  "keywords": [
    "训练"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Activity",
  "quote": "jsonl 其实是一问一答的短对话",
  "points": [
    {
      "icon": "Check",
      "keyword": "有意思的是",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "这在业界叫指令预训练",
      "sub": "细节"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
