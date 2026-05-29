<p align="center">
  <h1 align="center">音频技术科普知识库</h1>
  <p align="center">
    面向音频技术科普、网页内容规划和后续交互式学习页面的结构化知识库。
  </p>
</p>

<p align="center">
  <a href="../README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img alt="Docs" src="https://img.shields.io/badge/docs-Markdown-blue">
  <img alt="Language" src="https://img.shields.io/badge/language-English%20%7C%20Chinese-brightgreen">
  <img alt="Knowledge Base" src="https://img.shields.io/badge/type-Audio%20Knowledge%20Base-purple">
  <img alt="Status" src="https://img.shields.io/badge/status-planning-orange">
</p>

---

## 项目简介

音频技术科普知识库是一个内容优先的资料仓库，用于在制作网页、图解文章和交互式学习页面之前，先系统整理音频技术相关知识。

当前重点是建立一张清晰的知识地图，覆盖音频基础、硬件、软件、信号处理、AI 音频算法和真实应用场景。

## 为什么建立这个仓库

音频技术横跨物理声学、电子硬件、嵌入式系统、操作系统、数字信号处理、机器学习和产品应用。这个仓库把这些主题放在一个结构化位置，方便后续稳定扩展网页内容。

它适合用于：

- 准备音频技术科普网站内容。
- 构建文章大纲和专题页面。
- 规划音频信号链路和算法图解。
- 将传统 DSP 与 AI 音频概念放在同一套知识体系中。
- 为后续音频技术项目建立可复用的内容基础。

## 知识范围

| 方向 | 主题 |
| --- | --- |
| 音频基础 | 声音、声学、采样、位深、音频格式、听感认知 |
| 音频硬件 | 麦克风、ADC、DAC、Codec、功放、扬声器、耳机、嵌入式音频 |
| 音频软件 | 驱动、系统音频架构、音频数据流、编解码、实时音频处理 |
| 传统算法 | FFT、滤波器、EQ、动态处理、降噪、回声消除、波束成形 |
| AI 音频算法 | ASR、TTS、AI 降噪、音源分离、声音克隆、音乐生成 |
| 应用场景 | 消费电子、会议通信、智能汽车、IoT、内容创作、医疗和工业声学 |

## 快速开始

先从主知识大纲开始阅读：

- [音频技术科普知识大纲](../docs/audio_technology_knowledge_outline.md)

这份大纲是后续内容扩展的源文档。每个章节后续都可以拆成网页栏目、文章系列、图解页面或交互式说明。

## 内容结构

```text
.
├── README.md
├── READMEs/
│   └── README.zh-CN.md
└── docs/
    └── audio_technology_knowledge_outline.md
```

## 网页内容规划

当前大纲后续可演进为这些网页内容模块：

- **入门指南**：采样率、位深、频响曲线、音频格式、蓝牙延迟。
- **硬件拆解**：麦克风、DAC、功放、TWS 音频链路、嵌入式音频系统。
- **算法图解**：FFT、滤波、降噪、回声消除、波束成形。
- **AI 音频系列**：语音识别、语音合成、AI 降噪、声音克隆、音频生成。
- **应用案例**：会议音频系统、智能音箱、车载语音交互、直播音频处理。

## 路线图

- [x] 创建第一版音频技术知识大纲。
- [x] 增加双语 README 入口。
- [ ] 将大纲拆分为适合网页展示的专题页面。
- [ ] 增加信号链路、频谱图和算法流程图。
- [ ] 使用统一文章模板扩展每个主题。
- [ ] 补充资料来源和延伸阅读列表。
- [ ] 为后续知识库浏览准备网页界面。

## 写作原则

- 保持解释易懂，同时不牺牲技术准确性。
- 对信号流、硬件链路和算法流程优先使用图解。
- 区分基础概念和进阶主题。
- 同时解释传统 DSP 方法和 AI 方法。
- 在合适位置补充产品和工程实践背景。

## 语言

本仓库提供独立的双语 README：

- [English](../README.md)
- [简体中文](./README.zh-CN.md)

GitHub README 不支持运行 JavaScript，因此语言切换使用普通 Markdown 链接实现。

## License

暂未选择开源许可证。
