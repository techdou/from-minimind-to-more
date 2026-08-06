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
    "MoE"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "title",
  "subtitle": "DEBATE · 第 01 讲",
  "tag": "minimind-to-more",
  "mainIcon": "Scale"
};

const Scene001: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene001;
