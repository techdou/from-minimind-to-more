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
    duration: 7360,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 7360
            }
      ],
    Component: Scene001,
  },
  {
    start: 7760,
    duration: 18079,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 18079
            }
      ],
    Component: Scene002,
  },
  {
    start: 26239,
    duration: 4320,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 4320
            }
      ],
    Component: Scene003,
  },
  {
    start: 30959,
    duration: 24961,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 24961
            }
      ],
    Component: Scene004,
  },
  {
    start: 56320,
    duration: 20240,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 2399
            },
            {
                  "text": "白桦:",
                  "relativeStart": 2799,
                  "relativeDuration": 17441
            }
      ],
    Component: Scene005,
  },
  {
    start: 76960,
    duration: 19280,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 2880
            },
            {
                  "text": "白桦:",
                  "relativeStart": 3280,
                  "relativeDuration": 16000
            }
      ],
    Component: Scene006,
  },
  {
    start: 96640,
    duration: 4480,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 4480
            }
      ],
    Component: Scene007,
  },
  {
    start: 101520,
    duration: 23360,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 23360
            }
      ],
    Component: Scene008,
  },
  {
    start: 125280,
    duration: 5440,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 5440
            }
      ],
    Component: Scene009,
  },
  {
    start: 131120,
    duration: 20800,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 20800
            }
      ],
    Component: Scene010,
  },
];

export const totalDurationInFrames = 4558;
