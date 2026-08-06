import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "Cache 的问题解决了",
  "keywords": [],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "question": "可 Attention 本身的计算量呢?",
  "quote": "上下文一长,复杂度不是平方级增长",
  "points": [
    {
      "icon": "Check",
      "keyword": "Cache 的问题解决了",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "上下文一长",
      "sub": "细节"
    }
  ]
};

const Scene007: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene007;
