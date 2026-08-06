import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "DPO",
  "keywords": [
    "DPO",
    "工程"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Scale",
  "question": "但极端情况下呢?",
  "points": [
    {
      "icon": "Scale",
      "keyword": "DPO",
      "sub": "核心"
    },
    {
      "icon": "Wrench",
      "keyword": "工程",
      "sub": "细节"
    }
  ]
};

const Scene009: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene009;
