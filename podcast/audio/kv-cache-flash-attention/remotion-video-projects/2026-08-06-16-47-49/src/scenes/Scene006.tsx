import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "MiniMind",
  "keywords": [
    "MiniMind",
    "LLaMA",
    "GQA"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Atom",
  "points": [
    {
      "icon": "Atom",
      "keyword": "MiniMind",
      "sub": "核心"
    },
    {
      "icon": "Atom",
      "keyword": "LLaMA",
      "sub": "细节"
    },
    {
      "icon": "Network",
      "keyword": "GQA",
      "sub": "延伸"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
