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
import Scene010 from "../scenes/Scene010";
import Scene011 from "../scenes/Scene011";
import Scene012 from "../scenes/Scene012";

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
    duration: 10720,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 10720
            }
      ],
    Component: Scene001,
  },
  {
    start: 11120,
    duration: 24640,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 24640
            }
      ],
    Component: Scene002,
  },
  {
    start: 36160,
    duration: 3840,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 3840
            }
      ],
    Component: Scene003,
  },
  {
    start: 40399,
    duration: 24480,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 24480
            }
      ],
    Component: Scene004,
  },
  {
    start: 65280,
    duration: 3680,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 3680
            }
      ],
    Component: Scene005,
  },
  {
    start: 69360,
    duration: 24000,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 24000
            }
      ],
    Component: Scene006,
  },
  {
    start: 93760,
    duration: 2880,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 2880
            }
      ],
    Component: Scene007,
  },
  {
    start: 97040,
    duration: 22720,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 22720
            }
      ],
    Component: Scene008,
  },
  {
    start: 120160,
    duration: 4480,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 4480
            }
      ],
    Component: Scene009,
  },
  {
    start: 125040,
    duration: 22560,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 22560
            }
      ],
    Component: Scene010,
  },
  {
    start: 148000,
    duration: 7680,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 7680
            }
      ],
    Component: Scene011,
  },
  {
    start: 156080,
    duration: 9600,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 9600
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 4970;
