import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "梯度",
  "keywords": [
    "梯度"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "body",
  "mainIcon": "Waves"
};

const Scene009: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene009;
