import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "RLHF",
  "keywords": [
    "RLHF",
    "DPO"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Telescope",
  "quote": "这正是 DPO 的定位——它不是 RLHF 的替代,而是当你已经有偏好数据时的更高效选择",
  "points": [
    {
      "icon": "Telescope",
      "keyword": "RLHF",
      "sub": "核心"
    },
    {
      "icon": "Scale",
      "keyword": "DPO",
      "sub": "细节"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
