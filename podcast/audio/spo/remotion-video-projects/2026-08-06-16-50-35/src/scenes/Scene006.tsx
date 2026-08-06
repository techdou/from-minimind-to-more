import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "KL 散度",
  "keywords": [
    "KL 散度"
  ],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Waves",
  "points": [
    {
      "icon": "Check",
      "keyword": "问得好",
      "sub": "重点"
    },
    {
      "icon": "Sparkles",
      "keyword": "变化越剧烈",
      "sub": "细节"
    }
  ]
};

const Scene006: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene006;
