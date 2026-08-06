import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "GRPO",
  "keywords": [
    "GRPO"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "body",
  "mainIcon": "Award",
  "quote": "GRPO 的精髓就是用群体采样换掉 Critic,在客观可验证的任务上特别强",
  "points": [
    {
      "icon": "Check",
      "keyword": "难怪成了今年算法岗必考",
      "sub": "重点"
    }
  ]
};

const Scene011: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene011;
