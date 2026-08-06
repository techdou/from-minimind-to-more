import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "梯度",
  "keywords": [
    "梯度",
    "显存",
    "训练"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Waves",
  "points": [
    {
      "icon": "Waves",
      "keyword": "梯度",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "显存",
      "sub": "细节"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "延伸"
    }
  ]
};

const Scene010: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene010;
