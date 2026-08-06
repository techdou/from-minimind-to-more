import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "SFT",
  "keywords": [
    "SFT"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Beaker",
  "quote": "有人提问、紧接着是回答",
  "points": [
    {
      "icon": "Check",
      "keyword": "后面做 SFT 时",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "它就不会对这个格式陌生了",
      "sub": "细节"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
