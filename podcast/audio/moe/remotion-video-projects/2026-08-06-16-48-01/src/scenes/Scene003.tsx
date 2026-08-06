import React from "react";
import { SceneContent, type SceneContentProps } from "./SceneContent";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

const meta: SceneContentProps = {
  "title": "解耦听起来美好",
  "keywords": [],
  "speaker": {
    "name": "白桦",
    "role": "男教授"
  },
  "variant": "body",
  "mainIcon": "Sparkles",
  "question": "解耦听起来美好,可它怎么实现的?"
};

const Scene003: React.FC<{ segments: Segment[] }> = (props) => {
  return <SceneContent {...meta} {...props} segments={props.segments} />;
};

export default Scene003;
