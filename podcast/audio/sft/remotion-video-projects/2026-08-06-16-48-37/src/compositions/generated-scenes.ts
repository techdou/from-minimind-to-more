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
    duration: 9280,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 9280
            }
      ],
    Component: Scene002,
  },
  {
    start: 13599,
    duration: 2401,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2401
            }
      ],
    Component: Scene003,
  },
  {
    start: 16399,
    duration: 11840,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 11840
            }
      ],
    Component: Scene004,
  },
  {
    start: 28639,
    duration: 1600,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 1600
            }
      ],
    Component: Scene005,
  },
  {
    start: 30639,
    duration: 11361,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 11361
            }
      ],
    Component: Scene006,
  },
  {
    start: 42399,
    duration: 2241,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2241
            }
      ],
    Component: Scene007,
  },
  {
    start: 45039,
    duration: 9921,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 9921
            }
      ],
    Component: Scene008,
  },
  {
    start: 55359,
    duration: 3360,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 3360
            }
      ],
    Component: Scene009,
  },
  {
    start: 59119,
    duration: 12480,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 12480
            }
      ],
    Component: Scene010,
  },
  {
    start: 72000,
    duration: 5439,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 5439
            }
      ],
    Component: Scene011,
  },
];

export const totalDurationInFrames = 2323;
