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
    duration: 10880,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 10880
            }
      ],
    Component: Scene001,
  },
  {
    start: 11280,
    duration: 18239,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 18239
            }
      ],
    Component: Scene002,
  },
  {
    start: 29919,
    duration: 9120,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 9120
            }
      ],
    Component: Scene003,
  },
  {
    start: 39439,
    duration: 27040,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 27040
            }
      ],
    Component: Scene004,
  },
  {
    start: 66879,
    duration: 6080,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 6080
            }
      ],
    Component: Scene005,
  },
  {
    start: 73359,
    duration: 25440,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 25440
            }
      ],
    Component: Scene006,
  },
  {
    start: 99200,
    duration: 3040,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 3040
            }
      ],
    Component: Scene007,
  },
  {
    start: 102640,
    duration: 20320,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 20320
            }
      ],
    Component: Scene008,
  },
  {
    start: 123360,
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
    start: 127760,
    duration: 26240,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 26240
            }
      ],
    Component: Scene010,
  },
  {
    start: 154400,
    duration: 9920,
    segments: [
            {
                  "text": "冰糖:",
                  "relativeStart": 0,
                  "relativeDuration": 9920
            }
      ],
    Component: Scene011,
  },
  {
    start: 164720,
    duration: 8800,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 8800
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 5206;
