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
    "SFT",
    "RLHF",
    "训练"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "body",
  "mainIcon": "Beaker",
  "points": [
    {
      "icon": "Beaker",
      "keyword": "SFT",
      "sub": "核心"
    },
    {
      "icon": "Telescope",
      "keyword": "RLHF",
      "sub": "细节"
    },
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "延伸"
    }
  ]
};

const Scene007: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene007;
