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
    "显存"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Cpu",
  "question": "可这代价也太大了吧?",
  "points": [
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "核心"
    },
    {
      "icon": "Check",
      "keyword": "显存",
      "sub": "细节"
    }
  ]
};

const Scene003: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene003;
