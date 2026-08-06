import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "LLaMA",
  "keywords": [
    "LLaMA",
    "GQA",
    "价值"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Atom",
  "quote": "隐藏维度 512——LLaMA-7B 是 4096,它压缩了 8 倍;层数 8 层;词表只有 640",
  "points": [
    {
      "icon": "Atom",
      "keyword": "LLaMA",
      "sub": "核心"
    },
    {
      "icon": "Network",
      "keyword": "GQA",
      "sub": "细节"
    },
    {
      "icon": "Check",
      "keyword": "价值",
      "sub": "延伸"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
