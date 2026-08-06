import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "位置编码",
  "keywords": [
    "位置编码",
    "RoPE",
    "BPE"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "Ruler",
  "points": [
    {
      "icon": "Ruler",
      "keyword": "位置编码",
      "sub": "核心"
    },
    {
      "icon": "RotateCw",
      "keyword": "RoPE",
      "sub": "细节"
    },
    {
      "icon": "Combine",
      "keyword": "BPE",
      "sub": "延伸"
    }
  ]
};

const Scene004: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene004;
