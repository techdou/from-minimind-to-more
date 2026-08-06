import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "懂了",
  "keywords": [],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "body",
  "mainIcon": "Sparkles"
};

const Scene011: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene011;
