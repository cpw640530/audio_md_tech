import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type FlowMode = "playback" | "capture" | "duplex";

type FlowStep = {
  label: Record<Language, string>;
  sub: Record<Language, string>;
  x: number;
  y: number;
};

type ArchitectureLayer = {
  kind: "app" | "middleware" | "software" | "driver" | "hardware";
  title: Record<Language, string>;
  detail: Record<Language, string>;
};

type SystemAudioLabProps = {
  language: Language;
  onBack: () => void;
};

const genericArchitectureLayers = [
  {
    kind: "app",
    title: { zh: "应用程序", en: "Application" },
    detail: { zh: "播放器 / 浏览器 / 录音 / 通话软件", en: "player / browser / recorder / call app" }
  },
  {
    kind: "middleware",
    title: { zh: "音频 API / 音频服务", en: "Audio API / audio service" },
    detail: { zh: "打开音频流、管理会话、权限和音量", en: "opens streams, manages sessions, permission, and volume" }
  },
  {
    kind: "software",
    title: { zh: "混音 / 路由 / 重采样 / 音量管理", en: "Mixing / routing / resampling / volume" },
    detail: { zh: "多路声音合成，选择目标设备，统一格式", en: "mixes streams, selects devices, normalizes formats" }
  },
  {
    kind: "driver",
    title: { zh: "驱动接口", en: "Driver interface" },
    detail: { zh: "PCM 数据、控制命令、DMA 和时钟配置", en: "PCM data, controls, DMA, and clock configuration" }
  },
  {
    kind: "hardware",
    title: { zh: "硬件设备", en: "Hardware device" },
    detail: { zh: "Codec / DAC / ADC / 麦克风 / 扬声器", en: "Codec / DAC / ADC / microphone / speaker" }
  }
] satisfies ArchitectureLayer[];

const linuxArchitectureLayers = [
  {
    kind: "app",
    title: { zh: "应用程序", en: "Application" },
    detail: { zh: "播放器 / 浏览器 / 录音软件 / 通话软件", en: "player / browser / recorder / call app" }
  },
  {
    kind: "middleware",
    title: { zh: "PipeWire / PulseAudio / JACK", en: "PipeWire / PulseAudio / JACK" },
    detail: { zh: "音频流管理、路由、会话和低延迟服务", en: "stream management, routing, sessions, low-latency service" }
  },
  {
    kind: "driver",
    title: { zh: "ALSA 用户态接口", en: "ALSA user-space interface" },
    detail: { zh: "alsa-lib / PCM API / mixer control", en: "alsa-lib / PCM API / mixer control" }
  },
  {
    kind: "driver",
    title: { zh: "Linux Kernel ALSA 驱动", en: "Linux kernel ALSA driver" },
    detail: { zh: "声卡驱动 / I2S / USB Audio / HDA / ASoC", en: "sound driver / I2S / USB Audio / HDA / ASoC" }
  },
  {
    kind: "hardware",
    title: { zh: "硬件层", en: "Hardware layer" },
    detail: { zh: "Codec / DAC / ADC / 功放 / 麦克风 / 扬声器", en: "Codec / DAC / ADC / amplifier / mic / speaker" }
  }
] satisfies ArchitectureLayer[];

const linuxScenarioCards = [
  {
    title: { zh: "桌面 Linux", en: "Desktop Linux" },
    body: {
      zh: "常见链路是 App 先连接 PipeWire 或 PulseAudio，再由服务层把声音路由到 ALSA 设备，例如 USB 声卡、蓝牙耳机或主板 HDA 声卡。",
      en: "A common path is app to PipeWire or PulseAudio, then the service routes audio to an ALSA device such as USB audio, Bluetooth headset, or motherboard HDA audio."
    }
  },
  {
    title: { zh: "嵌入式 Linux", en: "Embedded Linux" },
    body: {
      zh: "常见链路更靠近硬件。ASoC 把 CPU DAI、Codec DAI、I2S/TDM/PDM 接口、功放和麦克风阵列描述成一条可配置的声卡链路。",
      en: "The path is closer to hardware. ASoC describes CPU DAI, Codec DAI, I2S/TDM/PDM interfaces, amplifiers, and microphone arrays as one configurable sound-card path."
    }
  }
] satisfies Array<{ title: Record<Language, string>; body: Record<Language, string> }>;

const architectureKindLabels = {
  app: { zh: "应用", en: "App" },
  middleware: { zh: "中间件", en: "Middleware" },
  software: { zh: "软件", en: "Software" },
  driver: { zh: "驱动", en: "Driver" },
  hardware: { zh: "硬件", en: "Hardware" }
} satisfies Record<ArchitectureLayer["kind"], Record<Language, string>>;

const audioDataFlows = [
  {
    label: { zh: "播放数据流", en: "Playback data flow" },
    direction: "down",
    steps: [
      { zh: "App", en: "App" },
      { zh: "音频 API", en: "Audio API" },
      { zh: "音频服务 / 混音路由", en: "Audio service / mix routing" },
      { zh: "ALSA / 驱动", en: "ALSA / driver" },
      { zh: "DAC / 功放", en: "DAC / amplifier" },
      { zh: "扬声器 / 耳机", en: "Speaker / headset" }
    ]
  },
  {
    label: { zh: "采集数据流", en: "Capture data flow" },
    direction: "up",
    steps: [
      { zh: "麦克风 / ADC", en: "Mic / ADC" },
      { zh: "ALSA / 驱动", en: "ALSA / driver" },
      { zh: "输入路由 / 预处理", en: "Input routing / preprocess" },
      { zh: "音频 API", en: "Audio API" },
      { zh: "App", en: "App" }
    ]
  }
] satisfies Array<{
  label: Record<Language, string>;
  direction: "down" | "up";
  steps: Array<Record<Language, string>>;
}>;

const flowTabs: Array<{ id: FlowMode; label: Record<Language, string> }> = [
  { id: "playback", label: { zh: "播放链路", en: "Playback path" } },
  { id: "capture", label: { zh: "录音链路", en: "Capture path" } },
  { id: "duplex", label: { zh: "全双工语音", en: "Full-duplex voice" } }
];

const flowCopy = {
  playback: {
    title: { zh: "播放链路重点", en: "Playback focus" },
    summary: {
      zh: "播放链路重点：多路声音如何被混音、统一采样率并送到目标设备。",
      en: "Playback focus: how multiple streams are mixed, converted to a common rate, and sent to the target device."
    },
    concepts: [
      {
        zh: "音频焦点决定媒体、通知、通话和提示音谁能继续播放。",
        en: "Audio focus decides whether media, notifications, calls, and prompts can keep playing."
      },
      {
        zh: "混音器把不同 App 的流合成为一个或多个输出流。",
        en: "The mixer combines streams from different apps into one or more output streams."
      },
      {
        zh: "重采样把不同采样率统一到设备支持的输出格式。",
        en: "Resampling converts different sample rates into the device output format."
      }
    ]
  },
  capture: {
    title: { zh: "录音链路重点", en: "Capture focus" },
    summary: {
      zh: "录音链路重点：采集权限、输入增益、设备选择和时间戳连续性。",
      en: "Capture focus: permissions, input gain, device selection, and timestamp continuity."
    },
    concepts: [
      {
        zh: "麦克风权限和隐私指示会先于应用拿到音频数据。",
        en: "Microphone permission and privacy indicators apply before the app receives audio."
      },
      {
        zh: "输入路由决定使用内置麦、耳机麦、USB 麦还是蓝牙麦。",
        en: "Input routing selects built-in, headset, USB, or Bluetooth microphones."
      },
      {
        zh: "时间戳连续性会影响唇同步、语音识别和回声消除。",
        en: "Timestamp continuity affects lip sync, speech recognition, and echo cancellation."
      }
    ]
  },
  duplex: {
    title: { zh: "全双工重点", en: "Full-duplex focus" },
    summary: {
      zh: "全双工重点：系统要把采集流、回放流和语音处理模块接成同一条通话链路。",
      en: "Full-duplex focus: the system connects capture, playback, and voice-processing modules into one call path."
    },
    concepts: [
      {
        zh: "系统负责把回放参考送到语音处理模块，具体回声消除算法留给语音增强主题。",
        en: "The system routes playback reference into the voice-processing module; echo-cancellation algorithms belong to speech enhancement."
      },
      {
        zh: "NS、AGC、AEC 在这里作为链路中的处理模块出现，不展开参数和算法原理。",
        en: "NS, AGC, and AEC appear here as processing modules in the path, without expanding algorithm details."
      },
      {
        zh: "系统层关注输入设备、输出设备和会话状态是否保持一致。",
        en: "The system layer focuses on keeping input device, output device, and session state consistent."
      }
    ]
  }
} satisfies Record<FlowMode, { title: Record<Language, string>; summary: Record<Language, string>; concepts: Array<Record<Language, string>> }>;

const flowSteps = {
  playback: [
    {
      label: { zh: "App 播放请求", en: "App playback request" },
      sub: { zh: "媒体 / 游戏 / 提示音", en: "Media / game / prompt" },
      x: 108,
      y: 156
    },
    {
      label: { zh: "Audio API", en: "Audio API" },
      sub: { zh: "格式 / 会话", en: "format / session" },
      x: 250,
      y: 156
    },
    {
      label: { zh: "音频服务", en: "Audio service" },
      sub: { zh: "音频焦点 / session", en: "focus / session" },
      x: 392,
      y: 156
    },
    {
      label: { zh: "混音 / 重采样", en: "Mix / resample" },
      sub: { zh: "多路流统一输出", en: "streams to output" },
      x: 534,
      y: 156
    },
    {
      label: { zh: "HAL / 驱动", en: "HAL / driver" },
      sub: { zh: "DMA / 接口配置", en: "DMA / interface" },
      x: 676,
      y: 156
    },
    {
      label: { zh: "扬声器 / 耳机", en: "Speaker / headset" },
      sub: { zh: "Codec / DAC 输出", en: "Codec / DAC out" },
      x: 818,
      y: 156
    }
  ],
  capture: [
    {
      label: { zh: "麦克风 / ADC", en: "Mic / ADC" },
      sub: { zh: "声压转数字样本", en: "pressure to samples" },
      x: 108,
      y: 156
    },
    {
      label: { zh: "HAL / 驱动", en: "HAL / driver" },
      sub: { zh: "DMA / 时间戳", en: "DMA / timestamp" },
      x: 250,
      y: 156
    },
    {
      label: { zh: "输入路由", en: "Input routing" },
      sub: { zh: "内置 / USB / 蓝牙", en: "built-in / USB / BT" },
      x: 392,
      y: 156
    },
    {
      label: { zh: "权限 / 隐私指示", en: "Permission / privacy" },
      sub: { zh: "麦克风授权", en: "microphone grant" },
      x: 534,
      y: 156
    },
    {
      label: { zh: "预处理", en: "Preprocess" },
      sub: { zh: "增益 / 降噪 / 格式", en: "gain / denoise / format" },
      x: 676,
      y: 156
    },
    {
      label: { zh: "App 录音数据", en: "App capture data" },
      sub: { zh: "识别 / 通话 / 录制", en: "ASR / call / record" },
      x: 818,
      y: 156
    }
  ],
  duplex: [
    {
      label: { zh: "回放流", en: "Playback stream" },
      sub: { zh: "远端语音 / 提示音", en: "remote voice / prompt" },
      x: 144,
      y: 106
    },
    {
      label: { zh: "扬声器输出", en: "Speaker output" },
      sub: { zh: "进入空气和麦克风", en: "into air and mic" },
      x: 330,
      y: 106
    },
    {
      label: { zh: "回放参考", en: "Playback reference" },
      sub: { zh: "送入语音处理", en: "to voice processing" },
      x: 516,
      y: 106
    },
    {
      label: { zh: "采集流", en: "Capture stream" },
      sub: { zh: "近端语音 + 回声", en: "near voice + echo" },
      x: 144,
      y: 242
    },
    {
      label: { zh: "AEC / NS / AGC", en: "AEC / NS / AGC" },
      sub: { zh: "消回声 / 降噪 / 自动增益", en: "echo / noise / gain" },
      x: 392,
      y: 242
    },
    {
      label: { zh: "语音 App", en: "Voice app" },
      sub: { zh: "通话 / 会议 / 对讲", en: "call / meeting / intercom" },
      x: 702,
      y: 242
    }
  ]
} satisfies Record<FlowMode, FlowStep[]>;

function renderFlowDiagram(language: Language, flowMode: FlowMode) {
  const steps = flowSteps[flowMode];
  const isDuplex = flowMode === "duplex";
  const label = {
    playback: { zh: "播放链路流程图", en: "Playback path flowchart" },
    capture: { zh: "录音链路流程图", en: "Capture path flowchart" },
    duplex: { zh: "全双工语音流程图", en: "Full-duplex voice flowchart" }
  } satisfies Record<FlowMode, Record<Language, string>>;

  return (
    <figure className="system-audio-flow">
      <svg aria-label={label[flowMode][language]} role="img" viewBox="0 0 930 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="systemAudioArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="360" rx="14" width="930" />
        <text className="lab-label" x="46" y="42">
          {label[flowMode][language]}
        </text>
        {steps.map((step) => (
          <g key={step.label.en}>
            <rect className="system-audio-node" height="76" rx="12" width="126" x={step.x - 63} y={step.y - 38} />
            <text className="interface-node-text" x={step.x} y={step.y - 4}>
              {step.label[language]}
            </text>
            <text className="interface-node-sub" x={step.x} y={step.y + 22}>
              {step.sub[language]}
            </text>
          </g>
        ))}
        {isDuplex ? (
          <>
            <path className="system-audio-arrow" d="M 207 106 H 267" />
            <path className="system-audio-arrow" d="M 393 106 H 453" />
            <path className="system-audio-arrow reference" d="M 516 144 C 516 182 466 198 420 218" />
            <path className="system-audio-arrow" d="M 207 242 H 329" />
            <path className="system-audio-arrow" d="M 455 242 H 639" />
            <path className="system-audio-arrow echo" d="M 330 144 C 308 174 246 184 188 214" />
            <text className="system-audio-note" x="628" y="112">
              {language === "zh" ? "回放参考不出声，只给算法对齐" : "Reference is for algorithm alignment"}
            </text>
            <text className="system-audio-note" x="226" y="318">
              {language === "zh" ? "扬声器声可能被麦克风再次采到" : "Speaker sound may be captured by the mic"}
            </text>
          </>
        ) : (
          steps.slice(0, -1).map((step, index) => {
            const next = steps[index + 1];
            return (
              <path
                className="system-audio-arrow"
                d={`M ${step.x + 63} ${step.y} H ${next.x - 63}`}
                key={`${step.label.en}-${next.label.en}`}
              />
            );
          })
        )}
      </svg>
      <figcaption>{flowCopy[flowMode].summary[language]}</figcaption>
    </figure>
  );
}

function ArchitectureStack({
  ariaLabel,
  language,
  layers
}: {
  ariaLabel: string;
  language: Language;
  layers: ArchitectureLayer[];
}) {
  return (
    <figure aria-label={ariaLabel} className="system-audio-architecture-card" role="img">
      <div className="system-audio-architecture-stack">
        {layers.map((layer, index) => (
          <div className="system-audio-architecture-row" key={layer.title.en}>
            <div className={`system-audio-architecture-box ${layer.kind}`}>
              <span className={`system-audio-kind-badge ${layer.kind}`}>
                {architectureKindLabels[layer.kind][language]}
              </span>
              <strong>{layer.title[language]}</strong>
              <span>{layer.detail[language]}</span>
            </div>
            {index < layers.length - 1 ? <span aria-hidden="true" className="system-audio-down-arrow">↓</span> : null}
          </div>
        ))}
      </div>
    </figure>
  );
}

function DataFlowDiagram({ language }: { language: Language }) {
  return (
    <figure
      aria-label={language === "zh" ? "播放和采集数据流方向图" : "Playback and capture data-flow direction diagram"}
      className="system-audio-data-flow"
      role="img"
    >
      {audioDataFlows.map((flow) => (
        <div className={`system-audio-data-flow-lane ${flow.direction}`} key={flow.label.en}>
          <h3>{flow.label[language]}</h3>
          <div className="system-audio-data-flow-steps">
            {flow.steps.map((step, index) => (
              <div className="system-audio-data-flow-step" key={`${flow.label.en}-${step.en}`}>
                <span>{step[language]}</span>
                {index < flow.steps.length - 1 ? <b aria-hidden="true">→</b> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
      <figcaption>
        {language === "zh"
          ? "播放是从 App 向硬件输出；采集是从麦克风硬件向 App 回传。"
          : "Playback moves from app to output hardware; capture moves from microphone hardware back to the app."}
      </figcaption>
    </figure>
  );
}

export function SystemAudioLab({ language, onBack }: SystemAudioLabProps) {
  const [flowMode, setFlowMode] = useState<FlowMode>("playback");
  const currentCopy = flowCopy[flowMode];

  return (
    <main className="codec-lab-page system-audio-lab">
      <section className="sound-lab-hero" aria-labelledby="system-audio-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "软件实验" : "Software lab"}</span>
          <h1 id="system-audio-lab-title">
            {language === "zh" ? "系统音频架构实验室" : "System Audio Architecture Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "从应用、系统服务、策略路由、混音重采样、HAL/驱动到硬件设备，观察播放、录音和全双工语音链路如何流动。"
              : "Trace playback, capture, and full-duplex voice through apps, services, policy routing, mixing/resampling, HAL/drivers, and hardware."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "系统音频架构总览" : "System audio architecture overview"}
        className="system-audio-overview"
      >
        <div className="system-audio-overview-grid">
          <article className="system-audio-frame-panel">
            <span className="section-kicker">{language === "zh" ? "通用框架" : "Generic model"}</span>
            <h2>{language === "zh" ? "通用系统音频架构" : "Generic System Audio Architecture"}</h2>
            <ArchitectureStack
              ariaLabel={language === "zh" ? "通用系统音频架构框图" : "Generic system audio architecture block diagram"}
              language={language}
              layers={genericArchitectureLayers}
            />
          </article>

          <article className="system-audio-frame-panel">
            <span className="section-kicker">{language === "zh" ? "具体例子" : "Concrete example"}</span>
            <h2>{language === "zh" ? "Linux 音频架构示例" : "Linux Audio Architecture Example"}</h2>
            <ArchitectureStack
              ariaLabel={language === "zh" ? "Linux 音频架构示例框图" : "Linux audio architecture example block diagram"}
              language={language}
              layers={linuxArchitectureLayers}
            />
          </article>
        </div>

        <DataFlowDiagram language={language} />

        <div className="system-audio-linux-notes" aria-label={language === "zh" ? "Linux 音频场景对比" : "Linux audio scenario comparison"}>
          {linuxScenarioCards.map((card) => (
            <article className="system-audio-linux-note" key={card.title.en}>
              <h3>{card.title[language]}</h3>
              <p>{card.body[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "系统音频链路实验台" : "System audio path workbench"}
        className="system-audio-workbench"
      >
        <div className="amp-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "链路模式" : "Path mode"}>
            {flowTabs.map((tab) => (
              <button
                aria-pressed={flowMode === tab.id}
                className={flowMode === tab.id ? "waveform-tab active" : "waveform-tab"}
                key={tab.id}
                type="button"
                onClick={() => setFlowMode(tab.id)}
              >
                {tab.label[language]}
              </button>
            ))}
          </div>
          {renderFlowDiagram(language, flowMode)}
        </div>

        <aside className="system-audio-side" aria-label={currentCopy.title[language]}>
          <h2>{currentCopy.title[language]}</h2>
          <p>{currentCopy.summary[language]}</p>
          <div className="system-audio-concepts">
            {currentCopy.concepts.map((concept) => (
              <article className="system-audio-concept" key={concept.en}>
                <p>{concept[language]}</p>
              </article>
            ))}
          </div>
          <dl className="system-audio-stats">
            <div>
              <dt>{language === "zh" ? "核心变量" : "Core variables"}</dt>
              <dd>{language === "zh" ? "设备 / 路由 / 权限 / 会话" : "device / routing / permission / session"}</dd>
            </div>
            <div>
              <dt>{language === "zh" ? "常见风险" : "Common risks"}</dt>
              <dd>{language === "zh" ? "设备选错、权限缺失、切换中断" : "wrong device, missing permission, switch breaks"}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
