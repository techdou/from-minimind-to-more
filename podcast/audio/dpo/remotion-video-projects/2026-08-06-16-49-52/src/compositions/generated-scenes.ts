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
    duration: 13279,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 13279
            }
      ],
    Component: Scene001,
  },
  {
    start: 13679,
    duration: 14400,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 14400
            }
      ],
    Component: Scene002,
  },
  {
    start: 28479,
    duration: 8640,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 8640
            }
      ],
    Component: Scene003,
  },
  {
    start: 37519,
    duration: 15520,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 15520
            }
      ],
    Component: Scene004,
  },
  {
    start: 53439,
    duration: 7360,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 7360
            }
      ],
    Component: Scene005,
  },
  {
    start: 61199,
    duration: 15040,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 15040
            }
      ],
    Component: Scene006,
  },
  {
    start: 76639,
    duration: 7840,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 7840
            }
      ],
    Component: Scene007,
  },
  {
    start: 84879,
    duration: 15681,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 15681
            }
      ],
    Component: Scene008,
  },
  {
    start: 100960,
    duration: 10240,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 10240
            }
      ],
    Component: Scene009,
  },
  {
    start: 111600,
    duration: 14720,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 14720
            }
      ],
    Component: Scene010,
  },
  {
    start: 126720,
    duration: 7680,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 7680
            }
      ],
    Component: Scene011,
  },
];

export const totalDurationInFrames = 4032;
