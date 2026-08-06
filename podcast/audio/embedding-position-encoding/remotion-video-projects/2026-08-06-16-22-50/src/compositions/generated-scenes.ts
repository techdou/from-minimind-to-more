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
    duration: 13439,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 13439
            }
      ],
    Component: Scene001,
  },
  {
    start: 13839,
    duration: 18721,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 18721
            }
      ],
    Component: Scene002,
  },
  {
    start: 32960,
    duration: 4160,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 4160
            }
      ],
    Component: Scene003,
  },
  {
    start: 37520,
    duration: 22240,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 22240
            }
      ],
    Component: Scene004,
  },
  {
    start: 60160,
    duration: 6400,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 6400
            }
      ],
    Component: Scene005,
  },
  {
    start: 66960,
    duration: 25280,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 25280
            }
      ],
    Component: Scene006,
  },
  {
    start: 92640,
    duration: 5600,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 5600
            }
      ],
    Component: Scene007,
  },
  {
    start: 98640,
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
    start: 122400,
    duration: 4000,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 4000
            }
      ],
    Component: Scene009,
  },
  {
    start: 126800,
    duration: 22240,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 22240
            }
      ],
    Component: Scene010,
  },
  {
    start: 149440,
    duration: 5280,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 5280
            }
      ],
    Component: Scene011,
  },
  {
    start: 155120,
    duration: 23680,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 23680
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 5364;
