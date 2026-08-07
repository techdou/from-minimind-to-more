<img width="1314" height="432" alt="From Minimind to More" src="https://github.com/user-attachments/assets/c2b6252a-a09d-4533-933a-a6ff4d420dc9" />

# From Minimind to More

> 深入探索大语言模型：从底层基石到高层架构，从理论原理到工程实践。
>
> 致谢 [Minimind](https://github.com/jingyaogong/minimind) 原作者的无私开源。

本项目是基于 Minimind 的系统性学习笔记，现已升级为**互动学习平台**：16 篇长文 + 学习路径 + 章末测验 + 全文搜索 + 双人播客（音频/视频）+ 知识卡片。希望它不仅让读者看懂 Minimind，更能对大模型技术体系建立全面的 insight，最大化减少你到处找资料的次数。

**在线版**：<https://minimind-to-more.pages.dev>（Cloudflare Pages）

## 功能特性

- **阅读基座**：marked + KaTeX + Mermaid 渲染，代码高亮，侧栏目录 scrollspy，阅读进度记忆
- **学习路径**：首页地铁路线图，按依赖关系引导阅读顺序，已读进度可视化
- **考点增强**：考点 callout 自动识别，章末测验（填空/问答/记忆点），翻转卡/对比卡/卡片画廊
- **全文搜索**：FlexSearch CJK 分词，覆盖 16 篇全文
- **双人播客**：苏打（主讲）× 茉莉（提问），字幕同步高亮、倍速、点击跳转；视频版由 Remotion 生成

## 内容导航

源文档统一在 [`content/`](./content/) 目录（带 frontmatter，构建时编译为 JSON）。

### 第一部分：基石与原理

| 篇章 | 文件 |
|---|---|
| 关于 Tokenizer 你所需要知道的一切 | [content/foundations/tokenizer.md](./content/foundations/tokenizer.md) |
| Minimind 的设计目录 | [content/foundations/minimind-design.md](./content/foundations/minimind-design.md) |
| 语义的几何与时空的折叠：Embedding 与位置编码 | [content/foundations/embedding-position-encoding.md](./content/foundations/embedding-position-encoding.md) |

### 第二部分：核心架构

| 篇章 | 文件 |
|---|---|
| 归一化技术：原理、演进与前沿架构 | [content/architecture/normalization.md](./content/architecture/normalization.md) |
| 最常见的大模型优化方法：从 KV Cache 到 Flash Attention | [content/architecture/kv-cache-flash-attention.md](./content/architecture/kv-cache-flash-attention.md) |
| 混合专家模型（MoE） | [content/architecture/moe.md](./content/architecture/moe.md) |
| 超级拼装 | [content/architecture/assembly.md](./content/architecture/assembly.md) |

### 第三部分：算法与演进

| 篇章 | 文件 |
|---|---|
| Minimind 的 Pretrain | [content/algorithms/pretrain.md](./content/algorithms/pretrain.md) |
| Minimind 的 SFT | [content/algorithms/sft.md](./content/algorithms/sft.md) |
| 大模型强化学习算法概览 | [content/algorithms/rl-overview.md](./content/algorithms/rl-overview.md) |
| Minimind 的 DPO | [content/algorithms/dpo.md](./content/algorithms/dpo.md) |
| Minimind 的 PPO | [content/algorithms/ppo.md](./content/algorithms/ppo.md) |
| Minimind 的 GRPO 及其变体 | [content/algorithms/grpo.md](./content/algorithms/grpo.md) |
| Minimind 的 SPO | [content/algorithms/spo.md](./content/algorithms/spo.md) |

### 第四部分：拓展与求职

| 篇章 | 文件 |
|---|---|
| 大规模语言模型推理与训练优化机制（可选） | [content/optional/inference-training-optimization.md](./content/optional/inference-training-optimization.md) |
| 大模型八股 100 问 | [content/career/interview-100.md](./content/career/interview-100.md) |

## 技术栈

| 层 | 技术 |
|---|---|
| 构建 | Vite + 原生 ES Module（无前端框架） |
| 渲染 | marked + KaTeX + Mermaid + highlight.js |
| 搜索 | FlexSearch（CJK 分词，构建期生成索引） |
| 播客 | MiMo TTS 合成 + Remotion 视频生成 |
| 部署 | Cloudflare Pages（Wrangler） |

## 快速开始

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器 (localhost:5173)
npm run build        # 完整构建:内容 JSON + 搜索索引 + vite build
npx vite preview     # 预览 production 产物
```

内容更新流程：编辑 `content/<分类>/<slug>.md`（含 frontmatter）→ `npm run build:content` 重新生成 JSON。

## 目录结构

```
├── content/            # 文章源文件(frontmatter + markdown,权威源)
├── src/                # 前端源码
│   ├── core/           #   渲染/进度/主题/页面生命周期
│   ├── components/     #   播放器/学习路径/卡片组件
│   ├── pages/          #   首页/文章/测验/播客/搜索
│   └── utils/          #   共享工具(HTML 转义等)
├── scripts/            # 构建与内容管线脚本
├── public/             # 静态资源(构建产物 JSON/播客音视频/配图)
├── podcast/            # 播客工作区(脚本/TTS 中间产物/Remotion 工程)
└── wrangler.toml       # Cloudflare Pages 部署配置
```

## 部署

```bash
npm run build
npx wrangler pages deploy dist --project-name minimind-to-more
```

## 交流与致谢

发现错误或有更好见解，欢迎 Issue / PR。

- 感谢 [Minimind](https://github.com/jingyaogong/minimind) 原作者的无私开源
- 感谢 [MiniMind-in-Depth](https://github.com/hans0809/MiniMind-in-Depth)，从中学到很多
- 更多内容欢迎关注小红书「天上的彤云」
