import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "KV Cache",
  "keywords": [
    "KV Cache"
  ],
  "speaker": {
    "name": "茉莉",
    "role": "女提问"
  },
  "variant": "body",
  "mainIcon": "HardDrive",
  "question": "那怎么办?"
};

const Scene005: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene005;
