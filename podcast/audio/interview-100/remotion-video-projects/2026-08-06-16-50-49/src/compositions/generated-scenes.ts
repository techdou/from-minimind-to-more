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
    duration: 7839,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 7839
            }
      ],
    Component: Scene001,
  },
  {
    start: 8240,
    duration: 11680,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 11680
            }
      ],
    Component: Scene002,
  },
  {
    start: 20320,
    duration: 2079,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2079
            }
      ],
    Component: Scene003,
  },
  {
    start: 22799,
    duration: 8640,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 8640
            }
      ],
    Component: Scene004,
  },
  {
    start: 31839,
    duration: 2240,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2240
            }
      ],
    Component: Scene005,
  },
  {
    start: 34479,
    duration: 11360,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 11360
            }
      ],
    Component: Scene006,
  },
  {
    start: 46239,
    duration: 4000,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4000
            }
      ],
    Component: Scene007,
  },
  {
    start: 50639,
    duration: 13280,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 13280
            }
      ],
    Component: Scene008,
  },
  {
    start: 64319,
    duration: 2560,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2560
            }
      ],
    Component: Scene009,
  },
  {
    start: 67280,
    duration: 9120,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 9120
            }
      ],
    Component: Scene010,
  },
  {
    start: 76800,
    duration: 7840,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 7840
            }
      ],
    Component: Scene011,
  },
];

export const totalDurationInFrames = 2539;
