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
    duration: 8640,
    segments: [
            {
                  "text": "苏打,我最近看 Transformer 的代码,发现到处都是 LayerNorm。\r\n这个归一化到底在干嘛?为什么不能省掉?",
                  "relativeStart": 0,
                  "relativeDuration": 8640
            }
      ],
    Component: Scene001,
  },
  {
    start: 8990,
    duration: 18240,
    segments: [
            {
                  "text": "你可以把它想象成调音量。神经网络很深,信号一层层传下去,有的越传越大最后爆炸,\r\n有的越传越小最后消失。归一化就是每过几层就把音量调回正常,让训练能稳定进行。",
                  "relativeStart": 0,
                  "relativeDuration": 18240
            }
      ],
    Component: Scene002,
  },
  {
    start: 27580,
    duration: 7840,
    segments: [
            {
                  "text": "那为什么不用计算机视觉里那个 BatchNorm 呢?我在 CV 课上学过,\r\n挺好用的。",
                  "relativeStart": 0,
                  "relativeDuration": 7840
            }
      ],
    Component: Scene003,
  },
  {
    start: 35770,
    duration: 24480,
    segments: [
            {
                  "text": "好问题。BatchNorm 是按 batch 统计的,但 NLP 有两个硬伤:一是句子长度不固定,\r\npadding 会污染统计;二是大模型训练时 batch size 经常是\r\n1,batch 太小统计就不准。所以 NLP 用的是 LayerNorm,\r\n它只看单个样本自己,跟 batch 无关。",
                  "relativeStart": 0,
                  "relativeDuration": 24480
            }
      ],
    Component: Scene004,
  },
  {
    start: 60600,
    duration: 8960,
    segments: [
            {
                  "text": "明白了。我还有个困惑,看 LLaMA 的代码,用的不是 LayerNorm\r\n而是 RMSNorm,这俩什么区别?",
                  "relativeStart": 0,
                  "relativeDuration": 8960
            }
      ],
    Component: Scene005,
  },
  {
    start: 69910,
    duration: 20640,
    segments: [
            {
                  "text": "RMSNorm 是 LayerNorm 的极简版。LayerNorm 做两件事:减均值(居中)和除标准差(缩放)。\r\n有人发现,居中那一步其实不是必须的,光做缩放效果差不多,但计算更快。RMSNorm\r\n就是只保留缩放,省掉了均值计算。",
                  "relativeStart": 0,
                  "relativeDuration": 20640
            }
      ],
    Component: Scene006,
  },
  {
    start: 90900,
    duration: 5760,
    segments: [
            {
                  "text": "省一点点计算有意义吗?感觉差别不大。",
                  "relativeStart": 0,
                  "relativeDuration": 5760
            }
      ],
    Component: Scene007,
  },
  {
    start: 97010,
    duration: 21120,
    segments: [
            {
                  "text": "单次看差别小,但 LLM 推理是海量的,每层省一点,几千亿 token\r\n累积下来就很可观。所以现在主流模型,Gemma、LLaMA、Mistral\r\n都用 RMSNorm。这是一个工程上很务实的取舍。",
                  "relativeStart": 0,
                  "relativeDuration": 21120
            }
      ],
    Component: Scene008,
  },
  {
    start: 118480,
    duration: 7680,
    segments: [
            {
                  "text": "最后一个问题,我面试被问过:Pre-Norm 和 Post-Norm 是什么?\r\n为什么现在都用 Pre-Norm?",
                  "relativeStart": 0,
                  "relativeDuration": 7680
            }
      ],
    Component: Scene009,
  },
  {
    start: 126510,
    duration: 21920,
    segments: [
            {
                  "text": "这是归一化放在哪的问题。Post-Norm 是原始 Transformer\r\n的做法,归一化放在残差连接之后;Pre-Norm 是放在之前。区别在于:Post-Norm\r\n表达能力更强但训练不稳定,深层网络容易发散;Pre-Norm 训练更稳,\r\n所以现在深一点的大模型基本都用 Pre-Norm。",
                  "relativeStart": 0,
                  "relativeDuration": 21920
            }
      ],
    Component: Scene010,
  },
  {
    start: 148780,
    duration: 22750,
    segments: [
            {
                  "text": "原来是位置决定的。那今天算把归一化的几个关键点理清了。",
                  "relativeStart": 0,
                  "relativeDuration": 7040
            },
            {
                  "text": "对。总结一下:归一化是为了训练稳定,NLP 用 LayerNorm 不用\r\nBatchNorm,主流模型用 RMSNorm 省计算,Pre-Norm\r\n比较稳。下一篇我们会讲 KV Cache,那是推理加速的关键。",
                  "relativeStart": 7390,
                  "relativeDuration": 15360
            }
      ],
    Component: Scene011,
  },
];

export const totalDurationInFrames = 5146;
