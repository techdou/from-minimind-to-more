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
    duration: 13119,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 13119
            }
      ],
    Component: Scene001,
  },
  {
    start: 13519,
    duration: 17441,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 17441
            }
      ],
    Component: Scene002,
  },
  {
    start: 31359,
    duration: 7520,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 7520
            }
      ],
    Component: Scene003,
  },
  {
    start: 39279,
    duration: 18560,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 18560
            }
      ],
    Component: Scene004,
  },
  {
    start: 58239,
    duration: 4960,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 4960
            }
      ],
    Component: Scene005,
  },
  {
    start: 63599,
    duration: 17920,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 17920
            }
      ],
    Component: Scene006,
  },
  {
    start: 81919,
    duration: 5760,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 5760
            }
      ],
    Component: Scene007,
  },
  {
    start: 88079,
    duration: 19041,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 19041
            }
      ],
    Component: Scene008,
  },
  {
    start: 107520,
    duration: 8320,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 8320
            }
      ],
    Component: Scene009,
  },
  {
    start: 116240,
    duration: 17120,
    segments: [
            {
                  "text": "苏打:",
                  "relativeStart": 0,
                  "relativeDuration": 17120
            }
      ],
    Component: Scene010,
  },
  {
    start: 133760,
    duration: 12320,
    segments: [
            {
                  "text": "白桦:",
                  "relativeStart": 0,
                  "relativeDuration": 12320
            }
      ],
    Component: Scene011,
  },
  {
    start: 146480,
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

export const totalDurationInFrames = 4634;
