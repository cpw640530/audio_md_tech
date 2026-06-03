<p align="center">
  <h1 align="center">Audio Technology Knowledge Base</h1>
  <p align="center">
    A structured knowledge base for audio technology education, web content planning, and future interactive learning pages.
  </p>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./READMEs/README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img alt="Docs" src="https://img.shields.io/badge/docs-Markdown-blue">
  <img alt="App" src="https://img.shields.io/badge/app-React%20%2B%20Vite-1f9d8a">
  <img alt="Language" src="https://img.shields.io/badge/language-English%20%7C%20Chinese-brightgreen">
  <img alt="Knowledge Base" src="https://img.shields.io/badge/type-Audio%20Knowledge%20Base-purple">
  <img alt="Status" src="https://img.shields.io/badge/status-planning-orange">
</p>

---

## Overview

Audio Technology Knowledge Base is a content-first repository for organizing audio technology concepts before turning them into web pages, diagrams, articles, and interactive learning experiences.

The current focus is to build a clear knowledge map covering audio fundamentals, hardware, software, signal processing, AI audio algorithms, and real-world applications. A React/Vite web app is included to browse, search, and filter the structured knowledge content.

## Why This Repository Exists

Audio technology spans physics, electronics, embedded systems, operating systems, digital signal processing, machine learning, and product applications. This repository keeps those topics in one structured place so future website content can be planned and expanded consistently.

It is designed for:

- Preparing educational website content.
- Building article outlines and topic pages.
- Planning diagrams for audio signal chains and algorithms.
- Organizing traditional DSP and AI audio concepts together.
- Creating a reusable content foundation for future audio technology projects.

## Knowledge Areas

| Area | Topics |
| --- | --- |
| Audio fundamentals | Sound, acoustics, sampling, bit depth, audio formats, listening perception |
| Audio hardware | Microphones, ADC, DAC, codecs, amplifiers, speakers, headphones, embedded audio |
| Audio software | Drivers, system audio architecture, audio data flow, codecs, real-time processing |
| Traditional algorithms | FFT, filters, EQ, dynamics, noise suppression, echo cancellation, beamforming |
| AI audio algorithms | ASR, TTS, AI denoising, source separation, voice cloning, music generation |
| Applications | Consumer electronics, conferencing, vehicles, IoT, content creation, medical and industrial audio |

## Quick Start

Visit the published website:

- [https://cpw640530.github.io/audio_md_tech/](https://cpw640530.github.io/audio_md_tech/)

Start from the main knowledge outline:

- [Audio Technology Knowledge Outline](docs/audio_technology_knowledge_outline.md)

The outline is the source document for future content expansion. Each section can later become a website category, article series, diagram page, or interactive explanation.

To run the web app locally:

```bash
npm install
npm run dev
```

The default local URL is:

```text
http://127.0.0.1:5173/audio_md_tech/
```

Useful commands:

```bash
npm test
npm run build
```

## Content Structure

```text
.
├── README.md
├── READMEs/
│   └── README.zh-CN.md
├── index.html
├── package.json
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── content/
│   └── styles.css
└── docs/
    └── audio_technology_knowledge_outline.md
```

## Website Content Plan

The current outline is intended to evolve into these web content modules:

- **Beginner guides**: sample rate, bit depth, frequency response, audio formats, Bluetooth latency.
- **Hardware explainers**: microphones, DACs, amplifiers, TWS audio chains, embedded audio systems.
- **Algorithm visualizations**: FFT, filtering, noise suppression, echo cancellation, beamforming.
- **AI audio series**: speech recognition, speech synthesis, AI denoising, voice cloning, audio generation.
- **Application case studies**: conferencing systems, smart speakers, in-car voice interaction, live streaming audio.

## Roadmap

- [x] Create the first audio technology knowledge outline.
- [x] Add bilingual README entry points.
- [x] Build the first React/Vite knowledge-base web app.
- [x] Publish the web app with GitHub Pages.
- [ ] Split the outline into website-ready topic pages.
- [ ] Add diagrams for signal chains, spectrograms, and algorithm flows.
- [ ] Expand each topic using a consistent article template.
- [ ] Add source references and recommended reading lists.
- [ ] Prepare a future web interface for browsing the knowledge base.

## Writing Principles

- Keep explanations approachable without losing technical accuracy.
- Use diagrams for signal flow, hardware chains, and algorithm processes.
- Separate foundational concepts from advanced topics.
- Explain both traditional DSP and AI-based approaches.
- Include practical product and engineering context where useful.

## Language

This repository provides separate README files for each language:

- [English](./README.md)
- [简体中文](./READMEs/README.zh-CN.md)

GitHub README files do not run JavaScript, so language switching is implemented with normal Markdown links.

## License

No license has been selected yet.
