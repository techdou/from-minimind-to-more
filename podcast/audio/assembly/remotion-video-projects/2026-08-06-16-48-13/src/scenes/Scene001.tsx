import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "MoE",
  "keywords": [
    "MoE",
    "RMSNorm",
    "RoPE"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "title",
  "subtitle": "LECTURE · 第 01 讲",
  "tag": "minimind-to-more",
  "mainIcon": "BookOpen"
};

const Scene001: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene001;
