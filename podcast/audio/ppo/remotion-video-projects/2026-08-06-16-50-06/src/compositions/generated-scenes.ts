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
    duration: 8800,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 8800
            }
      ],
    Component: Scene001,
  },
  {
    start: 9200,
    duration: 14240,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 14240
            }
      ],
    Component: Scene002,
  },
  {
    start: 23839,
    duration: 11520,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 11520
            }
      ],
    Component: Scene003,
  },
  {
    start: 35759,
    duration: 18080,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 18080
            }
      ],
    Component: Scene004,
  },
  {
    start: 54239,
    duration: 5600,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 5600
            }
      ],
    Component: Scene005,
  },
  {
    start: 60239,
    duration: 15840,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 15840
            }
      ],
    Component: Scene006,
  },
  {
    start: 76480,
    duration: 6720,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 6720
            }
      ],
    Component: Scene007,
  },
  {
    start: 83600,
    duration: 18720,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 18720
            }
      ],
    Component: Scene008,
  },
  {
    start: 102720,
    duration: 5760,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 5760
            }
      ],
    Component: Scene009,
  },
  {
    start: 108880,
    duration: 17760,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 17760
            }
      ],
    Component: Scene010,
  },
  {
    start: 127040,
    duration: 12640,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 12640
            }
      ],
    Component: Scene011,
  },
  {
    start: 140080,
    duration: 11200,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 11200
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 4538;
