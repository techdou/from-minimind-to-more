import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "SFT",
  "keywords": [
    "SFT",
    "训练"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Beaker",
  "quote": "预训练是纯无监督,模型学习的是整段文本的分布,所以每个位置都要算 loss",
  "points": [
    {
      "icon": "Beaker",
      "keyword": "SFT",
      "sub": "核心"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "细节"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
