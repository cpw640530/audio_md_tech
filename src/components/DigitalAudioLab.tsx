import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type DigitalAudioLabProps = {
  language: Language;
  onBack: () => void;
};

type DisplayMode = "waveform" | "samples" | "quantized" | "error" | "pcm";

const modeLabels: Record<DisplayMode, Record<Language, string>> = {
  waveform: { zh: "原始波形", en: "Original waveform" },
  samples: { zh: "采样点", en: "Samples" },
  quantized: { zh: "量化阶梯", en: "Quantized steps" },
  error: { zh: "误差曲线", en: "Error curve" },
  pcm: { zh: "PCM 编码", en: "PCM encoding" }
};

const codecPrinciples = [
  {
    format: "PCM",
    ratio: { zh: "1:1", en: "1:1" },
    relation: { zh: "原始数字采样", en: "Raw digital samples" },
    principle: {
      zh: "直接保存每个采样点的整数值，不压缩，数据量由采样率、位深和声道数决定。",
      en: "Stores each sample's integer value directly with no compression; size is determined by sample rate, bit depth, and channel count."
    }
  },
  {
    format: "WAV",
    ratio: { zh: "约 1:1", en: "About 1:1" },
    relation: { zh: "常见为 PCM + 文件头", en: "Often PCM plus a file header" },
    principle: {
      zh: "给 PCM 加上 RIFF/WAVE 文件头，写入采样率、位深、声道数和数据长度等信息。",
      en: "Adds a RIFF/WAVE header to PCM with sample rate, bit depth, channel count, and data length."
    }
  },
  {
    format: "MP3",
    ratio: { zh: "约 6:1 到 12:1", en: "About 6:1 to 12:1" },
    relation: { zh: "感知有损压缩", en: "Perceptual lossy compression" },
    principle: {
      zh: "利用人耳掩蔽效应，丢弃不容易听到的频率成分，再做频域编码。",
      en: "Uses auditory masking to remove less audible frequency content, then encodes in the frequency domain."
    }
  },
  {
    format: "AAC",
    ratio: { zh: "约 8:1 到 16:1", en: "About 8:1 to 16:1" },
    relation: { zh: "更高效的感知有损压缩", en: "More efficient perceptual lossy compression" },
    principle: {
      zh: "和 MP3 思路类似，但工具更丰富，同码率下通常能保留更多细节。",
      en: "Similar idea to MP3, but with richer tools that usually preserve more detail at the same bitrate."
    }
  },
  {
    format: "AMR",
    ratio: { zh: "约 10:1 到 30:1", en: "About 10:1 to 30:1" },
    relation: { zh: "语音专用低码率编码", en: "Low-bitrate speech coding" },
    principle: {
      zh: "用人声产生模型和参数来描述语音，适合电话语音，不适合高保真音乐。",
      en: "Uses a speech production model and parameters, good for telephony speech but not high-fidelity music."
    }
  },
  {
    format: "Opus",
    ratio: { zh: "约 6:1 到 30:1", en: "About 6:1 to 30:1" },
    relation: { zh: "低延迟语音/音乐编码", en: "Low-latency speech and music coding" },
    principle: {
      zh: "结合语音编码和音乐编码思路，能在通话、会议、实时互动中自适应内容和码率。",
      en: "Combines speech and music coding ideas, adapting to content and bitrate for calls, meetings, and real-time interaction."
    }
  },
  {
    format: "ADPCM",
    ratio: { zh: "约 4:1", en: "About 4:1" },
    relation: { zh: "预测差分编码", en: "Predictive differential coding" },
    principle: {
      zh: "不保存完整采样值，而是保存当前采样与预测值之间的差分，实现简单、延迟低。",
      en: "Stores the difference between the current sample and a prediction instead of the full value; simple and low-latency."
    }
  }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createAnalogValue(xRatio: number, frequency: number) {
  return Math.sin(xRatio * Math.PI * 2 * frequency);
}

function quantize(value: number, bitDepth: number) {
  const levels = 2 ** bitDepth;
  const normalized = (value + 1) / 2;
  const quantizedIndex = Math.round(clamp(normalized, 0, 1) * (levels - 1));
  return (quantizedIndex / (levels - 1)) * 2 - 1;
}

function toPcmInteger(value: number, bitDepth: number) {
  const levels = 2 ** bitDepth;
  return Math.round(((value + 1) / 2) * (levels - 1));
}

function toBinaryWord(value: number, bitDepth: number) {
  return value.toString(2).padStart(bitDepth, "0");
}

function createAnalogPath(frequency: number) {
  const points = Array.from({ length: 241 }, (_, index) => {
    const ratio = index / 240;
    const x = 36 + ratio * 688;
    const y = 170 - createAnalogValue(ratio, frequency) * 94;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
}

function createSamplePoints(sampleCount: number, bitDepth: number, frequency: number) {
  return Array.from({ length: sampleCount }, (_, index) => {
    const ratio = sampleCount === 1 ? 0 : index / (sampleCount - 1);
    const analogValue = createAnalogValue(ratio, frequency);
    const quantizedValue = quantize(analogValue, bitDepth);
    const pcmInteger = toPcmInteger(quantizedValue, bitDepth);
    return {
      analogY: 170 - analogValue * 94,
      errorY: 170 - (analogValue - quantizedValue) * 180,
      pcmBinary: toBinaryWord(pcmInteger, bitDepth),
      pcmInteger,
      quantizedY: 170 - quantizedValue * 94,
      quantizedValue,
      x: 36 + ratio * 688
    };
  });
}

function createSteppedPath(points: ReturnType<typeof createSamplePoints>) {
  if (!points.length) {
    return "";
  }

  const commands = [`M ${points[0].x.toFixed(2)} ${points[0].quantizedY.toFixed(2)}`];
  points.slice(1).forEach((point, index) => {
    const previous = points[index];
    const midX = (previous.x + point.x) / 2;
    commands.push(`H ${midX.toFixed(2)}`);
    commands.push(`V ${point.quantizedY.toFixed(2)}`);
    commands.push(`H ${point.x.toFixed(2)}`);
  });

  return commands.join(" ");
}

function createErrorPath(points: ReturnType<typeof createSamplePoints>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.errorY.toFixed(2)}`)
    .join(" ");
}

export function DigitalAudioLab({ language, onBack }: DigitalAudioLabProps) {
  const [sampleCount, setSampleCount] = useState(24);
  const [bitDepth, setBitDepth] = useState(4);
  const [frequency, setFrequency] = useState(2);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("quantized");

  const analogPath = useMemo(() => createAnalogPath(frequency), [frequency]);
  const samplePoints = useMemo(
    () => createSamplePoints(sampleCount, bitDepth, frequency),
    [bitDepth, frequency, sampleCount]
  );
  const steppedPath = useMemo(() => createSteppedPath(samplePoints), [samplePoints]);
  const errorPath = useMemo(() => createErrorPath(samplePoints), [samplePoints]);
  const quantizationLevels = 2 ** bitDepth;
  const pcmPreview = samplePoints.slice(0, 5);
  const showSamples = displayMode === "samples" || displayMode === "quantized" || displayMode === "pcm";
  const showQuantized = displayMode === "quantized" || displayMode === "pcm";
  const showError = displayMode === "error";

  return (
    <main className="digital-lab-page">
      <section className="sound-lab-hero" aria-labelledby="digital-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">
            {language === "zh" ? "数字音频实验" : "Digital audio lab"}
          </span>
          <h1 id="digital-lab-title">
            {language === "zh" ? "采样、量化与编码实验室" : "Sampling, Quantization, and Encoding Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "把连续波形转换成采样点和量化等级，再观察 PCM 与常见压缩格式如何承接这些数字。"
              : "Turn a continuous waveform into samples and quantized levels, then see how PCM and common compressed formats carry those numbers."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "采样、量化与编码实验台" : "Sampling, quantization, and encoding workbench"}
        className="digital-lab-workbench"
      >
        <div className="digital-lab-visual">
          <div className="digital-lab-status">
            <strong>{language === "zh" ? "显示模式：" : "Display mode: "}{modeLabels[displayMode][language]}</strong>
            <span>{language === "zh" ? `输入频率：${frequency} 个周期` : `Input frequency: ${frequency} cycles`}</span>
          </div>
          <svg
            aria-label={language === "zh" ? "采样与量化可视化图" : "Sampling and quantization visualization"}
            role="img"
            viewBox="0 0 760 360"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="digitalAnalogLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7ee7d8" />
                <stop offset="100%" stopColor="#f0b46a" />
              </linearGradient>
            </defs>
            <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
            <line className="lab-axis" x1="36" x2="724" y1="170" y2="170" />
            <line className="lab-axis faint" x1="36" x2="724" y1="76" y2="76" />
            <line className="lab-axis faint" x1="36" x2="724" y1="264" y2="264" />
            <text className="lab-label" x="46" y="46">{language === "zh" ? "模拟波形" : "Analog waveform"}</text>
            <path className="digital-analog-path" d={analogPath} />
            {showQuantized ? <path className="digital-step-path" d={steppedPath} /> : null}
            {showError ? <path className="digital-error-path" d={errorPath} /> : null}
            {showSamples
              ? samplePoints.map((point) => (
                  <g key={`${point.x}-${point.quantizedY}`}>
                    <line className="digital-sample-stem" x1={point.x} x2={point.x} y1="170" y2={point.quantizedY} />
                    <circle className="digital-sample-dot" cx={point.x} cy={point.analogY} r="4.5" />
                    <circle className="digital-quantized-dot" cx={point.x} cy={point.quantizedY} r="4" />
                  </g>
                ))
              : null}
            {showError ? (
              <text className="lab-chip" x="500" y="316">
                {language === "zh" ? "误差 = 原始值 - 量化值" : "Error = original - quantized"}
              </text>
            ) : (
              <text className="lab-chip" x="500" y="316">
                {language === "zh" ? "采样点越多，时间越细" : "More samples, finer time detail"}
              </text>
            )}
          </svg>
        </div>

        <div className="digital-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "显示模式" : "Display mode"}>
            {(Object.keys(modeLabels) as DisplayMode[]).map((mode) => (
              <button
                className={displayMode === mode ? "waveform-tab active" : "waveform-tab"}
                key={mode}
                type="button"
                onClick={() => setDisplayMode(mode)}
              >
                {modeLabels[mode][language]}
              </button>
            ))}
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {language === "zh" ? "采样率" : "Sample rate"}
                <strong>{sampleCount}</strong>
              </span>
              <input
                aria-label={language === "zh" ? "采样率" : "Sample rate"}
                max="48"
                min="8"
                step="4"
                type="range"
                value={sampleCount}
                onChange={(event) => setSampleCount(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "位深" : "Bit depth"}
                <strong>{bitDepth}-bit</strong>
              </span>
              <input
                aria-label={language === "zh" ? "位深" : "Bit depth"}
                max="8"
                min="2"
                step="1"
                type="range"
                value={bitDepth}
                onChange={(event) => setBitDepth(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "输入频率" : "Input frequency"}
                <strong>{frequency}</strong>
              </span>
              <input
                aria-label={language === "zh" ? "输入频率" : "Input frequency"}
                max="7"
                min="1"
                step="1"
                type="range"
                value={frequency}
                onChange={(event) => setFrequency(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="digital-lab-metrics">
            <strong>{language === "zh" ? `当前采样点：${sampleCount} 个` : `Current samples: ${sampleCount}`}</strong>
            <strong>{language === "zh" ? `当前量化等级：${quantizationLevels} 级` : `Quantization levels: ${quantizationLevels}`}</strong>
          </div>

          <div className="lab-live-note">
            {language === "zh"
              ? `采样点数量越少，越容易漏掉快速变化；位深为 ${bitDepth}-bit 时只有 ${quantizationLevels} 个幅度等级，量化阶梯会更明显。`
              : `Fewer samples miss fast changes more easily; at ${bitDepth}-bit there are ${quantizationLevels} amplitude levels, so quantization steps become more visible.`}
          </div>
        </div>
      </section>

      {displayMode === "pcm" ? (
        <section className="pcm-encoding-section" aria-label={language === "zh" ? "PCM 编码说明" : "PCM encoding explanation"}>
          <div className="section-heading">
            <div>
              <span className="section-kicker">PCM</span>
              <h2>{language === "zh" ? "如何变成 PCM" : "How samples become PCM"}</h2>
            </div>
          </div>
          <p className="pcm-flow">
            {language === "zh"
              ? "模拟值 → 量化值 → 整数样本值 → 二进制 PCM"
              : "Analog value → Quantized value → Integer sample → Binary PCM"}
          </p>
          <div className="pcm-word-grid">
            {pcmPreview.map((point, index) => (
              <article key={`${point.x}-${point.pcmBinary}`} className="pcm-word-card">
                <strong>{language === "zh" ? `采样 #${index + 1}` : `Sample #${index + 1}`}</strong>
                <span>{language === "zh" ? "量化值" : "Quantized"}: {point.quantizedValue.toFixed(3)}</span>
                <span>{language === "zh" ? "整数样本值" : "Integer sample"}: {point.pcmInteger}</span>
                <code>{point.pcmBinary}</code>
              </article>
            ))}
          </div>
          <div className="pcm-formula-card">
            <strong>{language === "zh" ? "PCM 码率 = 采样率 × 位深 × 声道数" : "PCM bitrate = sample rate × bit depth × channels"}</strong>
            <span>{language === "zh" ? "48 kHz × 16-bit × 2 声道 = 1536 kbps" : "48 kHz × 16-bit × 2 channels = 1536 kbps"}</span>
            <p>
              {language === "zh"
                ? "PCM 按固定节奏保存样本：采样率决定每秒多少个样本，位深决定每个样本多少 bit，声道数决定单声道、双声道或多声道样本如何排列。"
                : "PCM stores samples at a fixed cadence: sample rate sets samples per second, bit depth sets bits per sample, and channel count defines how mono, stereo, or multichannel samples are arranged."}
            </p>
          </div>
        </section>
      ) : null}

      <section className="wav-container-section" aria-label={language === "zh" ? "PCM 和 WAV 关系" : "PCM and WAV relationship"}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">WAV</span>
            <h2>{language === "zh" ? "PCM 如何变成 WAV" : "How PCM becomes WAV"}</h2>
          </div>
        </div>
        <div className="wav-container-card">
          <div className="wav-header-box">
            <strong>RIFF / WAVE Header</strong>
            <span>{language === "zh" ? "采样率 / 位深 / 声道数 / 数据长度" : "Sample rate / bit depth / channels / data length"}</span>
          </div>
          <div className="wav-plus">+</div>
          <div className="wav-data-box">
            <strong>PCM Data</strong>
            <span>{language === "zh" ? "按时间顺序排列的采样字" : "Sample words ordered in time"}</span>
          </div>
        </div>
        <p className="codec-note">
          {language === "zh"
            ? "给 PCM 加上 RIFF/WAVE 文件头，写明采样率、位深、声道数、数据长度等信息，播放器就知道如何解释后面的裸 PCM 数据。"
            : "Add a RIFF/WAVE header to PCM with sample rate, bit depth, channel count, and data length, and a player knows how to interpret the following raw PCM data."}
        </p>
      </section>

      <section className="codec-table-section" aria-label={language === "zh" ? "编码格式对比" : "Codec comparison"}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">{language === "zh" ? "编码" : "Encoding"}</span>
            <h2>{language === "zh" ? "编码格式原理速览" : "Codec principles at a glance"}</h2>
          </div>
        </div>
        <div className="codec-table">
          {codecPrinciples.map((row) => (
            <article key={row.format}>
              <h3>{row.format}</h3>
              <strong>{row.ratio[language]}</strong>
              <p>{row.relation[language]}</p>
              <p>{row.principle[language]}</p>
            </article>
          ))}
        </div>
        <p className="codec-note">
          {language === "zh"
            ? "压缩比是大致范围，会随原始 PCM 参数、目标码率、内容类型和编码器实现变化。"
            : "Compression ratios are rough ranges and vary with PCM source settings, target bitrate, content type, and encoder implementation."}
        </p>
      </section>
    </main>
  );
}
