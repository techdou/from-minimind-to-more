import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "Pre-Norm",
  "keywords": [
    "Pre-Norm",
    "Post-Norm"
  ],
  "speaker": {
    "name": "冰糖",
    "role": "女助教"
  },
  "variant": "body",
  "mainIcon": "GitBranch",
  "quote": "还有为啥要多头、缩放因子除以根号 dk 是干嘛的、Pre-Norm 和 Post-Norm 区别",
  "points": [
    {
      "icon": "GitBranch",
      "keyword": "Pre-Norm",
      "sub": "核心"
    },
    {
      "icon": "GitBranch",
      "keyword": "Post-Norm",
      "sub": "细节"
    }
  ]
};

const Scene002: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene002;
