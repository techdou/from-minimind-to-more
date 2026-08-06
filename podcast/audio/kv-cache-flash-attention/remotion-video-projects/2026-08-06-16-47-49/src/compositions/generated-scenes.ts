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
    duration: 10240,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 10240
            }
      ],
    Component: Scene001,
  },
  {
    start: 10640,
    duration: 19680,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 19680
            }
      ],
    Component: Scene002,
  },
  {
    start: 30719,
    duration: 4800,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4800
            }
      ],
    Component: Scene003,
  },
  {
    start: 35919,
    duration: 22720,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 22720
            }
      ],
    Component: Scene004,
  },
  {
    start: 59039,
    duration: 5600,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 5600
            }
      ],
    Component: Scene005,
  },
  {
    start: 65039,
    duration: 23040,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 23040
            }
      ],
    Component: Scene006,
  },
  {
    start: 88479,
    duration: 8960,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 8960
            }
      ],
    Component: Scene007,
  },
  {
    start: 97840,
    duration: 16960,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 16960
            }
      ],
    Component: Scene008,
  },
  {
    start: 115200,
    duration: 4480,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4480
            }
      ],
    Component: Scene009,
  },
  {
    start: 120080,
    duration: 16480,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 16480
            }
      ],
    Component: Scene010,
  },
  {
    start: 136960,
    duration: 10880,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 10880
            }
      ],
    Component: Scene011,
  },
  {
    start: 148240,
    duration: 7520,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 7520
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 4673;
