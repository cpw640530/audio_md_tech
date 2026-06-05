import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type RealtimeAudioLabProps = {
  language: Language;
  onBack: () => void;
};

type FlowStep = {
  title: Record<Language, string>;
  detail: Record<Language, string>;
  type?: "hardware" | "driver" | "buffer" | "process" | "codec";
};

const bytesPerSample = 2;
const channels = 1;
const sampleRate = 16000;
const bufferFrames = 512;
const dspMs = 1.4;
const jitterMs = 0.4;
const periodMs = (bufferFrames / sampleRate) * 1000;
const samples = bufferFrames * channels;
const bytes = samples * bytesPerSample;
const worstProcessingMs = dspMs + jitterMs;
const latencyMs = periodMs * 3;

const basicFlowSteps = [
  {
    title: { zh: "声音输入", en: "Sound input" },
    detail: { zh: "空气压力变化进入麦克风", en: "air pressure enters the microphone" },
    type: "hardware"
  },
  {
    title: { zh: "麦克风 / ADC", en: "Microphone / ADC" },
    detail: { zh: "模拟声音变为 PCM 采样", en: "analog sound becomes PCM samples" },
    type: "hardware"
  },
  {
    title: { zh: "驱动采集 PCM", en: "Driver captures PCM" },
    detail: { zh: "硬件 DMA 和驱动持续搬运数据", en: "DMA and driver move samples continuously" },
    type: "driver"
  },
  {
    title: { zh: "采集 buffer", en: "Capture buffer" },
    detail: { zh: "暂存原始 PCM，等待应用读取", en: "stores raw PCM until the app reads it" },
    type: "buffer"
  },
  {
    title: { zh: "用户态读取 PCM", en: "User-space PCM read" },
    detail: { zh: "read 或 mmap 取到一段 PCM", en: "read or mmap obtains a PCM block" },
    type: "process"
  },
  {
    title: { zh: "filter / DSP", en: "filter / DSP" },
    detail: { zh: "滤波、降噪、AEC、AGC", en: "filtering, NS, AEC, AGC" },
    type: "process"
  },
  {
    title: { zh: "编码器输入 buffer", en: "Encoder input buffer" },
    detail: { zh: "攒够编码器需要的样本数", en: "accumulates enough samples for codec frames" },
    type: "buffer"
  },
  {
    title: { zh: "编码 / 传输 / 播放", en: "Encode / transmit / play" },
    detail: { zh: "输出码流，或解码回 PCM 播放", en: "outputs bitstream, or decodes back to PCM" },
    type: "codec"
  }
] satisfies FlowStep[];

const alsaFlowSteps = [
  {
    title: { zh: "麦克风 / ADC", en: "Microphone / ADC" },
    detail: { zh: "16 kHz / mono / 16-bit PCM", en: "16 kHz / mono / 16-bit PCM" },
    type: "hardware"
  },
  {
    title: { zh: "I2S / PDM / USB Audio", en: "I2S / PDM / USB Audio" },
    detail: { zh: "硬件接口把采样送到 SoC 或声卡", en: "hardware interface sends samples to SoC or audio card" },
    type: "hardware"
  },
  {
    title: { zh: "DMA", en: "DMA" },
    detail: { zh: "不经过 CPU 逐点拷贝，直接写内存", en: "writes memory without CPU copying every sample" },
    type: "driver"
  },
  {
    title: { zh: "ALSA ring buffer", en: "ALSA ring buffer" },
    detail: { zh: "内核态 PCM 环形 buffer，保存原始采集数据", en: "kernel PCM ring buffer storing captured data" },
    type: "buffer"
  },
  {
    title: { zh: "period ready", en: "period ready" },
    detail: { zh: "达到一个 period 后中断或唤醒应用", en: "interrupts or wakes the app when one period is ready" },
    type: "driver"
  },
  {
    title: { zh: "copy_to_user / mmap", en: "copy_to_user / mmap" },
    detail: { zh: "read 走拷贝，mmap 可减少显式拷贝", en: "read copies data; mmap reduces explicit copies" },
    type: "process"
  },
  {
    title: { zh: "用户态 capture buffer", en: "User capture buffer" },
    detail: { zh: "应用拿到可处理的 PCM", en: "PCM block ready for the application" },
    type: "buffer"
  },
  {
    title: { zh: "32ms filter frame", en: "32 ms filter frame" },
    detail: { zh: "16 kHz 下 512 samples / 1024 bytes", en: "512 samples / 1024 bytes at 16 kHz" },
    type: "buffer"
  },
  {
    title: { zh: "filter / DSP", en: "filter / DSP" },
    detail: { zh: "高通滤波、降噪、AEC、AGC", en: "high-pass, noise suppression, AEC, AGC" },
    type: "process"
  },
  {
    title: { zh: "编码器输入 buffer", en: "Encoder input buffer" },
    detail: { zh: "按编码器帧长重新攒样本", en: "accumulates samples according to codec frame size" },
    type: "buffer"
  },
  {
    title: { zh: "MP3 frame", en: "MP3 frame" },
    detail: { zh: "例如 MP3 常见 1152 samples 一帧", en: "for example, MP3 commonly uses 1152 samples per frame" },
    type: "codec"
  }
] satisfies FlowStep[];

const bufferCards = [
  {
    title: { zh: "ALSA PCM ring buffer", en: "ALSA PCM ring buffer" },
    body: {
      zh: "在内核态保存原始 PCM。DMA 持续写入，ALSA 用读写指针管理哪些数据已经被应用取走。",
      en: "Stores raw PCM in kernel space. DMA writes continuously, while ALSA manages read/write pointers for consumed data."
    }
  },
  {
    title: { zh: "period buffer", en: "period buffer" },
    body: {
      zh: "period 是 ALSA 唤醒应用的节奏单位。这里默认 512 samples，也就是 16 kHz 下 32 ms。",
      en: "A period is the cadence that wakes the app. Here it is 512 samples, or 32 ms at 16 kHz."
    }
  },
  {
    title: { zh: "用户态 capture buffer", en: "User capture buffer" },
    body: {
      zh: "应用通过 read 得到拷贝后的 PCM，或通过 mmap 访问映射区域。这里开始进入应用自己的处理节奏。",
      en: "The app receives copied PCM through read, or accesses a mapped area through mmap. This is where app-side timing begins."
    }
  },
  {
    title: { zh: "filter frame", en: "filter frame" },
    body: {
      zh: "算法通常按固定时长处理，例如 32 ms。它不一定等于 ALSA period，也不一定等于编码器帧长。",
      en: "Algorithms often process fixed frame durations, such as 32 ms. This does not have to match ALSA period or codec frame size."
    }
  },
  {
    title: { zh: "encoder input buffer", en: "Encoder input buffer" },
    body: {
      zh: "编码器会按自己的帧长攒样本。比如 MP3 需要 1152 samples，32 ms 的 512 samples 需要多次拼帧。",
      en: "The codec accumulates samples according to its own frame length. MP3 needs 1152 samples, so multiple 512-sample blocks are combined."
    }
  },
  {
    title: { zh: "encoded frame buffer", en: "Encoded frame buffer" },
    body: {
      zh: "PCM 编码后变成 MP3、AAC、Opus 等码流帧，后面才能进入文件、RTSP/RTP 或其他网络队列。",
      en: "After encoding, PCM becomes MP3, AAC, Opus, or other bitstream frames for files, RTSP/RTP, or network queues."
    }
  }
] satisfies Array<{ title: Record<Language, string>; body: Record<Language, string> }>;

const ruleCards = [
  {
    title: { zh: "实时安全规则", en: "Real-time safety rules" },
    body: {
      zh: "不要在采集回调或低延迟线程里做磁盘 IO、网络请求、锁等待或动态内存分配。把不可预测工作放到非实时线程。",
      en: "Do not do disk IO, network calls, lock waits, or runtime allocation inside capture callbacks or low-latency threads. Move unpredictable work elsewhere."
    }
  },
  {
    title: { zh: "排查方向", en: "Troubleshooting direction" },
    body: {
      zh: "CPU 峰值过高、period 太小、filter 太慢、copy 阻塞或编码器攒帧过多，都可能让采集链路发生 overrun。",
      en: "CPU peaks, tiny periods, slow filters, blocking copies, or excessive codec buffering can cause capture overruns."
    }
  },
  {
    title: { zh: "线程分工", en: "Thread split" },
    body: {
      zh: "采集线程负责按时取 PCM；处理线程负责 filter；编码线程负责攒帧和输出码流。线程之间用预分配队列传递数据。",
      en: "The capture thread reads PCM on time; the processing thread filters; the encoder thread frames and outputs bitstream. Preallocated queues pass data across threads."
    }
  },
  {
    title: { zh: "延迟取舍", en: "Latency tradeoff" },
    body: {
      zh: "period 越小响应越快，但唤醒更频繁、CPU 余量更少。语音链路常在 10 ms、20 ms、32 ms 等处理帧之间取舍。",
      en: "Smaller periods respond faster, but wake more often and leave less CPU headroom. Voice pipelines commonly trade off among 10 ms, 20 ms, and 32 ms frames."
    }
  }
] satisfies Array<{ title: Record<Language, string>; body: Record<Language, string> }>;

function formatMs(value: number) {
  return `${value.toFixed(2)} ms`;
}

function formatFrameMs(value: number) {
  return Number.isInteger(value) ? `${value} ms` : formatMs(value);
}

function FlowChart({
  ariaLabel,
  id,
  language,
  steps,
  title
}: {
  ariaLabel: Record<Language, string>;
  id: string;
  language: Language;
  steps: FlowStep[];
  title: Record<Language, string>;
}) {
  const canvasWidth = 1180;
  const nodeHeight = 58;
  const gap = 18;
  const top = 84;
  const height = top + steps.length * (nodeHeight + gap) + 16;
  const nodeX = 76;
  const nodeWidth = 1040;
  const arrowX = 590;

  return (
    <svg
      aria-label={ariaLabel[language]}
      className="realtime-flow-chart"
      role="img"
      viewBox={`0 0 ${canvasWidth} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={`${id}Arrow`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height={height} rx="14" width={canvasWidth} />
      <text className="lab-label" x="42" y="48">
        {title[language]}
      </text>
      {steps.map((step, index) => {
        const y = top + index * (nodeHeight + gap);

        return (
          <g key={`${id}-${step.title.en}`}>
            <rect
              className={`realtime-flow-node ${step.type ?? "process"}`}
              height={nodeHeight}
              rx="9"
              width={nodeWidth}
              x={nodeX}
              y={y}
            />
            <text className="realtime-flow-node-title" x="112" y={y + 29}>
              {step.title[language]}
            </text>
            <text className="realtime-flow-node-detail" x="520" y={y + 29}>
              {step.detail[language]}
            </text>
            {index < steps.length - 1 ? (
              <path
                className="realtime-flow-arrow"
                d={`M ${arrowX} ${y + nodeHeight + 5} L ${arrowX} ${y + nodeHeight + gap - 5}`}
                markerEnd={`url(#${id}Arrow)`}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function RealtimeAudioLab({ language, onBack }: RealtimeAudioLabProps) {
  const statusLabel = language === "zh" ? "状态：稳定" : "Status: stable";

  return (
    <main className="codec-lab-page realtime-audio-lab-page">
      <section className="sound-lab-hero" aria-labelledby="realtime-audio-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "软件实验" : "Software lab"}</span>
          <h1 id="realtime-audio-lab-title">
            {language === "zh" ? "实时音频处理实验室" : "Real-Time Audio Processing Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "用一个 16 kHz 单声道语音采集例子，区分驱动、ALSA、用户态 filter 和编码器里的不同 buffer。"
              : "Use a 16 kHz mono voice-capture example to separate buffers in the driver, ALSA, user-space filter, and encoder."}
          </p>
        </div>
      </section>

      <section
        className="realtime-audio-workbench"
        aria-label={language === "zh" ? "实时音频处理实验台" : "Real-time audio processing workbench"}
      >
        <section className="realtime-audio-visual" aria-label={language === "zh" ? "实时音频调度图" : "Real-time audio scheduling diagram"}>
          <div className="digital-lab-status">
            <strong>{language === "zh" ? "从 PCM 采集到编码" : "From PCM capture to encoding"}</strong>
            <span>
              {language === "zh"
                ? "先看通用链路，再看 ALSA 具体例子"
                : "Start with the generic path, then inspect the ALSA example"}
            </span>
          </div>

          <div className="realtime-audio-metrics">
            <strong>{language === "zh" ? "默认格式：16 kHz / mono / 16-bit PCM" : "Default format: 16 kHz / mono / 16-bit PCM"}</strong>
            <strong>
              {language === "zh"
                ? `${formatFrameMs(periodMs)} 处理帧：${samples} samples / ${bytes} bytes`
                : `${formatFrameMs(periodMs)} frame: ${samples} samples / ${bytes} bytes`}
            </strong>
            <strong>{language === "zh" ? `采集 period：${formatMs(periodMs)}` : `Capture period: ${formatMs(periodMs)}`}</strong>
            <strong>{language === "zh" ? `Deadline：${formatMs(periodMs)}` : `Deadline: ${formatMs(periodMs)}`}</strong>
            <strong>{language === "zh" ? `最坏处理耗时：${formatMs(worstProcessingMs)}` : `Worst processing time: ${formatMs(worstProcessingMs)}`}</strong>
            <strong>{language === "zh" ? `估算采集到编码延迟：${formatMs(latencyMs)}` : `Estimated capture-to-encode latency: ${formatMs(latencyMs)}`}</strong>
            <strong className="realtime-status stable">{statusLabel}</strong>
          </div>

          <div className="realtime-flow-grid">
            <FlowChart
              ariaLabel={{ zh: "基础音频处理流程图", en: "Basic audio processing flow chart" }}
              id="basicAudioFlow"
              language={language}
              steps={basicFlowSteps}
              title={{ zh: "基础流程：输入 PCM 到编码 / 播放", en: "Basic flow: PCM input to encoding / playback" }}
            />
            <FlowChart
              ariaLabel={{ zh: "ALSA 采集 PCM 到编码流程图", en: "ALSA PCM capture to encoding flow chart" }}
              id="alsaCaptureFlow"
              language={language}
              steps={alsaFlowSteps}
              title={{ zh: "具体例子：ALSA 采集 PCM -> filter -> MP3 编码", en: "Example: ALSA PCM capture -> filter -> MP3 encode" }}
            />
          </div>
        </section>

        <aside className="realtime-audio-panel" aria-label={language === "zh" ? "当前示例参数" : "Current example parameters"}>
          <div className="realtime-static-list">
            <strong>{language === "zh" ? "当前示例参数" : "Current example parameters"}</strong>
            <dl>
              <div>
                <dt>{language === "zh" ? "PCM 格式" : "PCM format"}</dt>
                <dd>16 kHz / mono / 16-bit S16_LE</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "ALSA period" : "ALSA period"}</dt>
                <dd>{bufferFrames} frames / {formatMs(periodMs)}</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "filter frame" : "filter frame"}</dt>
                <dd>{samples} samples / {bytes} bytes / 32 ms</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "处理预算" : "Processing budget"}</dt>
                <dd>
                  {language === "zh"
                    ? `DSP ${formatMs(dspMs)} + CPU 抖动 ${formatMs(jitterMs)}，小于 32 ms deadline`
                    : `DSP ${formatMs(dspMs)} + CPU jitter ${formatMs(jitterMs)}, below the 32 ms deadline`}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lab-live-note">
            <strong>{language === "zh" ? `DSP 耗时：${formatMs(dspMs)}` : `DSP time: ${formatMs(dspMs)}`}</strong>
            <span>
              {language === "zh"
                ? "当前示例留有充足处理余量，filter 处理加 CPU 抖动仍明显小于 32 ms deadline。"
                : "The current example has enough processing headroom; filter time plus CPU jitter stays well below the 32 ms deadline."}
            </span>
          </div>
        </aside>

        <section
          className="codec-mode-concepts realtime-buffer-guide"
          aria-label={language === "zh" ? "实时音频 buffer 分层说明" : "Real-time audio buffer layers"}
        >
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "这些 buffer 不是同一个东西" : "These buffers are not the same thing"}</strong>
            <span>{language === "zh" ? "按数据位置和用途区分" : "Separate them by location and purpose"}</span>
          </div>
          <div className="realtime-buffer-card-grid">
            {bufferCards.map((card) => (
              <article key={card.title.en}>
                <h2>{card.title[language]}</h2>
                <p>{card.body[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="codec-mode-concepts realtime-audio-rules"
          aria-label={language === "zh" ? "实时音频规则和排查" : "Real-time audio rules and troubleshooting"}
        >
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "关键规则" : "Key rules"}</strong>
            <span>{language === "zh" ? "实时处理的重点是确定性" : "The priority is deterministic timing"}</span>
          </div>
          <div className="codec-concept-grid realtime-rule-grid">
            {ruleCards.map((card) => (
              <article key={card.title.en}>
                <h2>{card.title[language]}</h2>
                <p>{card.body[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
