import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "关键就在稀疏激活",
  "keywords": [],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "quote": "Mixtral 8x7B 是 8 个专家选 2 个,DeepSeek-V3 是 256",
  "points": [
    {
      "icon": "Check",
      "keyword": "关键就在稀疏激活",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "Top-K 路由",
      "sub": "细节"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
