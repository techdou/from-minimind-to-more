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
    "DPO"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Scale",
  "question": "这个数学推导你信吗?",
  "quote": "DPO 的损失函数我看了,本质是在做 chosen 和 rejected 的对比",
  "points": [
    {
      "icon": "Check",
      "keyword": "DPO 的损失函数我看了",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "这个数学推导你信吗",
      "sub": "细节"
    }
  ]
};

const Scene005: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene005;
