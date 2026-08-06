import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "显存",
  "keywords": [
    "显存"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "points": [
    {
      "icon": "Check",
      "keyword": "不是变小",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "是少搬运",
      "sub": "细节"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
