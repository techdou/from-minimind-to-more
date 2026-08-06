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
    "Loss",
    "工程"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "conclude",
  "subtitle": "本期要点",
  "points": [
    {
      "icon": "Activity",
      "keyword": "训练",
      "sub": "核心结论"
    },
    {
      "icon": "Waves",
      "keyword": "梯度",
      "sub": "关键要点"
    },
    {
      "icon": "Check",
      "keyword": "显存",
      "sub": "重要收获"
    },
    {
      "icon": "Beaker",
      "keyword": "SFT",
      "sub": "延伸"
    }
  ],
  "nextTitle": "下集预告 · 敬请期待"
};

const Scene011: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene011;
