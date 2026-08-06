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
    duration: 10080,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 10080
            }
      ],
    Component: Scene001,
  },
  {
    start: 10480,
    duration: 20000,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 20000
            }
      ],
    Component: Scene002,
  },
  {
    start: 30879,
    duration: 7200,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 7200
            }
      ],
    Component: Scene003,
  },
  {
    start: 38479,
    duration: 20640,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 20640
            }
      ],
    Component: Scene004,
  },
  {
    start: 59519,
    duration: 4481,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 4481
            }
      ],
    Component: Scene005,
  },
  {
    start: 64400,
    duration: 21600,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 21600
            }
      ],
    Component: Scene006,
  },
  {
    start: 86400,
    duration: 8000,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 8000
            }
      ],
    Component: Scene007,
  },
  {
    start: 94800,
    duration: 20640,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 20640
            }
      ],
    Component: Scene008,
  },
  {
    start: 115840,
    duration: 6720,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 6720
            }
      ],
    Component: Scene009,
  },
  {
    start: 122960,
    duration: 15680,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 15680
            }
      ],
    Component: Scene010,
  },
  {
    start: 139040,
    duration: 8800,
    segments: [
            {
                  "text": "茉莉:",
                  "relativeStart": 0,
                  "relativeDuration": 8800
            }
      ],
    Component: Scene011,
  },
  {
    start: 148240,
    duration: 8000,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 8000
            }
      ],
    Component: Scene012,
  },
];

export const totalDurationInFrames = 4687;
