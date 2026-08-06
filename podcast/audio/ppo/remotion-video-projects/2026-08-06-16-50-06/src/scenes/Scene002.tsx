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
    "奖励"
  ],
  "speaker": {
    "name": "苏打",
    "role": "男主讲"
  },
  "variant": "body",
  "mainIcon": "Beaker",
  "quote": "引入了奖励信号,模型可以自己生成、自己被打分、自己改进,这是从模仿到探索的飞跃",
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
      "icon": "Check",
      "keyword": "奖励",
      "sub": "延伸"
    }
  ]
};

const Scene002: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene002;
