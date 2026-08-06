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
    duration: 23199,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 23199
            }
      ],
    Component: Scene002,
  },
  {
    start: 31839,
    duration: 4320,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4320
            }
      ],
    Component: Scene003,
  },
  {
    start: 36559,
    duration: 18400,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 18400
            }
      ],
    Component: Scene004,
  },
  {
    start: 55359,
    duration: 4800,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4800
            }
      ],
    Component: Scene005,
  },
  {
    start: 60559,
    duration: 23520,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 23520
            }
      ],
    Component: Scene006,
  },
  {
    start: 84479,
    duration: 3200,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 3200
            }
      ],
    Component: Scene007,
  },
  {
    start: 88079,
    duration: 25280,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 25280
            }
      ],
    Component: Scene008,
  },
  {
    start: 113760,
    duration: 4000,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4000
            }
      ],
    Component: Scene009,
  },
  {
    start: 118160,
    duration: 15200,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 15200
            }
      ],
    Component: Scene010,
  },
  {
    start: 133760,
    duration: 10720,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 10720
            }
      ],
    Component: Scene011,
  },
  {
    start: 144880,
    duration: 9120,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 9120
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 4620;
