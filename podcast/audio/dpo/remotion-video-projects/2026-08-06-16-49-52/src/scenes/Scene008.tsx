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
    "PPO",
    "DPO"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Beaker",
  "quote": "DPO 的代码结构和 SFT 几乎一样,就是换了损失函数",
  "points": [
    {
      "icon": "Beaker",
      "keyword": "SFT",
      "sub": "核心"
    },
    {
      "icon": "Cpu",
      "keyword": "PPO",
      "sub": "细节"
    },
    {
      "icon": "Scale",
      "keyword": "DPO",
      "sub": "延伸"
    }
  ]
};

const Scene008: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene008;
