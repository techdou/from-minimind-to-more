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
    duration: 5280,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 5280
            }
      ],
    Component: Scene001,
  },
  {
    start: 5680,
    duration: 12320,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 12320
            }
      ],
    Component: Scene002,
  },
  {
    start: 18399,
    duration: 2880,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2880
            }
      ],
    Component: Scene003,
  },
  {
    start: 21679,
    duration: 9280,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 9280
            }
      ],
    Component: Scene004,
  },
  {
    start: 31359,
    duration: 2720,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 2720
            }
      ],
    Component: Scene005,
  },
  {
    start: 34479,
    duration: 13440,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 13440
            }
      ],
    Component: Scene006,
  },
  {
    start: 48319,
    duration: 3040,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 3040
            }
      ],
    Component: Scene007,
  },
  {
    start: 51759,
    duration: 10400,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 10400
            }
      ],
    Component: Scene008,
  },
  {
    start: 62559,
    duration: 1920,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 1920
            }
      ],
    Component: Scene009,
  },
  {
    start: 64879,
    duration: 10080,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 10080
            }
      ],
    Component: Scene010,
  },
  {
    start: 75359,
    duration: 5920,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 5920
            }
      ],
    Component: Scene011,
  },
];

export const totalDurationInFrames = 2438;
