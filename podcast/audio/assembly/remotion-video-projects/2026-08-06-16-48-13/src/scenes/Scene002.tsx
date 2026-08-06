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
    "MoE"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Atom",
  "quote": "MiniMind 是高度模块化的,每个核心类各司其职",
  "points": [
    {
      "icon": "Atom",
      "keyword": "MiniMind",
      "sub": "核心"
    },
    {
      "icon": "Network",
      "keyword": "MoE",
      "sub": "细节"
    }
  ]
};

const Scene002: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene002;
