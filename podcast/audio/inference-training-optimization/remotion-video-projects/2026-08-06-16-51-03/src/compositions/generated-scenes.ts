import type React from "react";

import Scene001 from "../scenes/Scene001";
import Scene002 from "../scenes/Scene002";
import Scene003 from "../scenes/Scene003";
import Scene004 from "../scenes/Scene004";
import Scene005 from "../scenes/Scene005";
import Scene006 from "../scenes/Scene006";
import Scene007 from "../scenes/Scene007";
import Scene008 from "../scenes/Scene008";
import Scene009 from "../scenes/Scene009";

type Segment = {
  text: string;
  relativeStart: number;
  relativeDuration: number;
};

export type GeneratedSceneItem = {
  start: number;
  duration: number;
  segments: Segment[];
  Component: React.FC<{ segments: Segment[] }>;
};

export const generatedScenes: GeneratedSceneItem[] = [
  {
    start: 0,
    duration: 3520,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 3520
            }
      ],
    Component: Scene001,
  },
  {
    start: 3919,
    duration: 14241,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 14241
            }
      ],
    Component: Scene002,
  },
  {
    start: 18559,
    duration: 5120,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 5120
            }
      ],
    Component: Scene003,
  },
  {
    start: 24079,
    duration: 12640,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 12640
            }
      ],
    Component: Scene004,
  },
  {
    start: 37119,
    duration: 2080,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2080
            }
      ],
    Component: Scene005,
  },
  {
    start: 39599,
    duration: 20000,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 20000
            }
      ],
    Component: Scene006,
  },
  {
    start: 59999,
    duration: 2080,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2080
            }
      ],
    Component: Scene007,
  },
  {
    start: 62479,
    duration: 12000,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 12000
            }
      ],
    Component: Scene008,
  },
  {
    start: 74879,
    duration: 6560,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 6560
            }
      ],
    Component: Scene009,
  },
];

export const totalDurationInFrames = 2443;
