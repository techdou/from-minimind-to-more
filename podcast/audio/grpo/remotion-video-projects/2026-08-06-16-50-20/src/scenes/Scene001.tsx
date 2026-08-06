import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "PPO",
  "keywords": [
    "PPO",
    "GRPO"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "title",
  "subtitle": "INTERVIEW · 第 01 讲",
  "tag": "minimind-to-more",
  "mainIcon": "Sparkles"
};

const Scene001: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene001;
