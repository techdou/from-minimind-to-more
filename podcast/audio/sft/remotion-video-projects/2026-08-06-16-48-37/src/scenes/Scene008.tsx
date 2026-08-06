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
    "训练",
    "工程"
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
      "icon": "Activity",
      "keyword": "训练",
      "sub": "细节"
    },
    {
      "icon": "Wrench",
      "keyword": "工程",
      "sub": "延伸"
    }
  ]
};

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
