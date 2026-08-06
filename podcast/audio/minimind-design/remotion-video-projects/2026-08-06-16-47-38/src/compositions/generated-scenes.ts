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
    duration: 12000,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 12000
            }
      ],
    Component: Scene001,
  },
  {
    start: 12400,
    duration: 15039,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 15039
            }
      ],
    Component: Scene002,
  },
  {
    start: 27839,
    duration: 5920,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 5920
            }
      ],
    Component: Scene003,
  },
  {
    start: 34159,
    duration: 24160,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 24160
            }
      ],
    Component: Scene004,
  },
  {
    start: 58719,
    duration: 4480,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4480
            }
      ],
    Component: Scene005,
  },
  {
    start: 63599,
    duration: 19200,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 19200
            }
      ],
    Component: Scene006,
  },
  {
    start: 83199,
    duration: 4640,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4640
            }
      ],
    Component: Scene007,
  },
  {
    start: 88239,
    duration: 20800,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 20800
            }
      ],
    Component: Scene008,
  },
  {
    start: 109439,
    duration: 5920,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 5920
            }
      ],
    Component: Scene009,
  },
  {
    start: 115760,
    duration: 14240,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 14240
            }
      ],
    Component: Scene010,
  },
  {
    start: 130400,
    duration: 8160,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 8160
            }
      ],
    Component: Scene011,
  },
  {
    start: 138960,
    duration: 9440,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 9440
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 4452;
