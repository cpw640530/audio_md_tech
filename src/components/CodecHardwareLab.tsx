import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type CodecHardwareLabProps = {
  language: Language;
  onBack: () => void;
};

type CodecMode = "adc" | "dac" | "codec";

type ModeCopy = {
  title: string;
  body: string;
  chain: string[];
  playbackChain?: string[];
  recordLabel?: string;
  playbackLabel?: string;
};

const modeLabels: Record<CodecMode, Record<Language, string>> = {
  adc: { zh: "ADC 采集", en: "ADC capture" },
  dac: { zh: "DAC 重建", en: "DAC reconstruction" },
  codec: { zh: "Codec 芯片链路", en: "Codec chip path" }
};

function quantizeSample(value: number, bitDepth: number) {
  const levels = 2 ** bitDepth;
  const quantized = Math.round(((value + 1) / 2) * (levels - 1));
  return (quantized / (levels - 1)) * 2 - 1;
}

function createConverterData({
  bitDepth,
  inputLevel,
  jitter,
  sampleRate
}: {
  bitDepth: number;
  inputLevel: number;
  jitter: number;
  sampleRate: number;
}) {
  const width = 660;
  const midY = 150;
  const amplitude = 92;
  const levels = 2 ** bitDepth;
  const analogPoints = Array.from({ length: 140 }, (_, index) => {
    const ratio = index / 139;
    const value = Math.sin(ratio * Math.PI * 4.6) * (inputLevel / 100);
    const clipped = Math.max(-1, Math.min(1, value));
    return {
      x: 50 + ratio * width,
      y: midY - clipped * amplitude,
      value: clipped
    };
  });

  const samples = Array.from({ length: sampleRate }, (_, index) => {
    const baseRatio = sampleRate === 1 ? 0 : index / (sampleRate - 1);
    const jitterOffset = Math.sin(index * 1.9) * (jitter / 100) * 0.018;
    const ratio = Math.max(0, Math.min(1, baseRatio + jitterOffset));
    const value = Math.sin(ratio * Math.PI * 4.6) * (inputLevel / 100);
    const clipped = Math.max(-1, Math.min(1, value));
    const quantized = quantizeSample(clipped, bitDepth);
    return {
      x: 50 + ratio * width,
      y: midY - clipped * amplitude,
      quantizedY: midY - quantized * amplitude,
      value: clipped,
      quantized
    };
  });

  const buildAnalogPath = (
    getValue: (point: (typeof analogPoints)[number], index: number) => number,
    centerY = midY,
    pathAmplitude = amplitude
  ) =>
    analogPoints
      .map((point, index) => {
        const y = centerY - getValue(point, index) * pathAmplitude;
        return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  const buildSamplePath = (
    getValue: (sample: (typeof samples)[number], index: number) => number,
    centerY = midY,
    pathAmplitude = amplitude
  ) =>
    samples
      .map((sample, index) => {
        const y = centerY - getValue(sample, index) * pathAmplitude;
        return `${index === 0 ? "M" : "L"} ${sample.x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  const analogPath = buildAnalogPath((point) => point.value);
  const stepPath = buildSamplePath((sample) => sample.quantized);
  const reconstructionPath = analogPoints
    .map((point, index) => {
      const smoothedValue = point.value * 0.86 + Math.sin((index / 139) * Math.PI * 9.2) * 0.025;
      const y = midY - smoothedValue * amplitude;
      return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const dacHoldPath = buildSamplePath((sample) => sample.quantized, 112, 52);
  const dacReconstructionPath = buildAnalogPath((point, index) => {
    const smoothedValue = point.value * 0.82 + Math.sin((index / 139) * Math.PI * 9.2) * 0.02;
    return smoothedValue;
  }, 232, 52);
  const codecCapturePath = buildAnalogPath((point) => point.value * 0.72, 108, 52);
  const codecPlaybackPath = buildAnalogPath((point, index) => {
    const ratio = index / 139;
    return point.value * 0.48 + Math.sin(ratio * Math.PI * 2.2) * 0.08;
  }, 232, 52);
  const quantizationError =
    samples.reduce((total, sample) => total + Math.abs(sample.value - sample.quantized), 0) / samples.length;
  const clippingRisk = Math.max(0, Math.round((inputLevel - 100) * 1.8));
  const jitterRisk = Math.round(jitter * 0.85);
  const visibleQuantizationLines = Array.from({ length: Math.min(9, levels) }, (_, index) => {
    const ratio = Math.min(8, levels - 1) === 0 ? 0 : index / Math.min(8, levels - 1);
    const value = ratio * 2 - 1;
    return midY - value * amplitude;
  });

  return {
    analogPath,
    clippingRisk,
    codecCapturePath,
    codecPlaybackPath,
    dacHoldPath,
    dacReconstructionPath,
    jitterRisk,
    quantizationError,
    reconstructionPath,
    samples,
    stepPath,
    visibleQuantizationLines
  };
}

function getModeCopy(mode: CodecMode, language: Language): ModeCopy {
  if (mode === "adc") {
    return {
      title: language === "zh" ? "ADC：模拟电压变成数字样本" : "ADC: analog voltage to digital samples",
      body:
        language === "zh"
          ? "输入信号先经过 PGA 和抗混叠滤波，再按采样时钟取点并量化。电平过高会削波，位深过低会增加量化噪声，时钟不稳会让采样时刻产生偏差。"
          : "The input passes through PGA and anti-alias filtering, then is sampled and quantized by the clock. Too much level clips, low bit depth raises quantization noise, and unstable clocks shift sample timing.",
      chain:
        language === "zh"
          ? ["模拟输入", "PGA", "抗混叠", "采样量化", "I2S PCM"]
          : ["Analog in", "PGA", "Anti-alias", "Sample/quantize", "I2S PCM"]
    };
  }

  if (mode === "dac") {
    return {
      title: language === "zh" ? "DAC：数字样本重建成模拟输出" : "DAC: digital samples to analog output",
      body:
        language === "zh"
          ? "数字样本进入 DAC 后经过插值、噪声整形和保持输出，再由模拟低通滤波器去除采样镜像，最后通过缓冲或耳放驱动负载。"
          : "Digital samples enter interpolation, noise shaping, and hold output; an analog low-pass filter removes sampling images, then buffers or headphone amps drive the load.",
      chain:
        language === "zh"
          ? ["I2S PCM", "插值", "DAC 核心", "重建滤波", "模拟输出"]
          : ["I2S PCM", "Interpolation", "DAC core", "Reconstruction", "Analog out"]
    };
  }

  return {
    title: language === "zh" ? "Codec 芯片：采集、播放和路由集成" : "Codec chip: integrated capture, playback, and routing",
    body:
      language === "zh"
        ? "Codec 芯片不是单向链路，而是同时包含录音和播放两条通路。录音时麦克风/线路输入经 PGA 和 ADC 变成数字音频送给主控；播放时主控把 I2S/TDM 数字音频送回 Codec，经 DAC 和耳放/功放输出。"
        : "A codec chip is not one single direction. It contains capture and playback paths at the same time. Capture sends mic/line input through PGA and ADC to the host; playback sends I2S/TDM audio from the host through DAC and output amplifiers.",
    chain:
      language === "zh"
        ? ["Mic/Line", "PGA", "ADC", "I2S/TDM", "主控"]
        : ["Mic/Line", "PGA", "ADC", "I2S/TDM", "Host"],
    playbackChain:
      language === "zh"
        ? ["主控", "I2S/TDM", "DAC", "耳放/功放", "Speaker"]
        : ["Host", "I2S/TDM", "DAC", "HP/Speaker amp", "Speaker"],
    playbackLabel: language === "zh" ? "播放链路" : "Playback path",
    recordLabel: language === "zh" ? "录音链路" : "Capture path"
  };
}

export function CodecHardwareLab({ language, onBack }: CodecHardwareLabProps) {
  const [mode, setMode] = useState<CodecMode>("adc");
  const [inputLevel, setInputLevel] = useState(86);
  const [sampleRate, setSampleRate] = useState(24);
  const [bitDepth, setBitDepth] = useState(5);
  const [jitter, setJitter] = useState(8);
  const data = useMemo(
    () => createConverterData({ bitDepth, inputLevel, jitter, sampleRate }),
    [bitDepth, inputLevel, jitter, sampleRate]
  );
  const modeCopy = getModeCopy(mode, language);
  const levels = 2 ** bitDepth;

  return (
    <main className="codec-lab-page">
      <section className="sound-lab-hero" aria-labelledby="codec-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1 id="codec-lab-title">{language === "zh" ? "ADC / DAC / Codec 实验室" : "ADC / DAC / Codec Lab"}</h1>
          <p>
            {language === "zh"
              ? "用同一条音频链路观察模拟采集、数字样本、DAC 重建、接口时钟和 Codec 芯片内部模块。"
              : "Use one audio path to inspect analog capture, digital samples, DAC reconstruction, interface clocks, and codec-chip blocks."}
          </p>
        </div>
      </section>

      <section className="codec-lab-workbench" aria-label={language === "zh" ? "ADC DAC Codec 实验台" : "ADC DAC Codec workbench"}>
        <div className="codec-lab-visual">
          <div className="digital-lab-status">
            <strong>{modeCopy.title}</strong>
            <span>
              {language === "zh"
                ? `量化等级：${levels} 级 · 采样点：${sampleRate}`
                : `Quantization levels: ${levels} · samples: ${sampleRate}`}
            </span>
          </div>
          <svg
            aria-label={language === "zh" ? "ADC DAC Codec 转换图" : "ADC DAC Codec conversion chart"}
            role="img"
            viewBox="0 0 760 340"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="codecAnalogLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7ee7d8" />
                <stop offset="100%" stopColor="#f0b46a" />
              </linearGradient>
            </defs>
            <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
            <line className="lab-axis" x1="50" x2="710" y1="150" y2="150" />
            <line className="lab-axis faint" x1="50" x2="710" y1="58" y2="58" />
            <line className="lab-axis faint" x1="50" x2="710" y1="242" y2="242" />
            {mode === "adc" ? (
              <>
                {data.visibleQuantizationLines.map((y, index) => (
                  <line className="codec-quant-grid" key={`${index}-${y.toFixed(2)}`} x1="50" x2="710" y1={y.toFixed(2)} y2={y.toFixed(2)} />
                ))}
                <path className="codec-analog-path" d={data.analogPath} />
                {data.samples.map((sample, index) => (
                  <g key={`${index}-${sample.x.toFixed(2)}`}>
                    <line className="digital-sample-stem" x1={sample.x.toFixed(2)} x2={sample.x.toFixed(2)} y1="150" y2={sample.quantizedY.toFixed(2)} />
                    <circle className="digital-sample-dot" cx={sample.x.toFixed(2)} cy={sample.y.toFixed(2)} r="3.5" />
                    <circle className="digital-quantized-dot" cx={sample.x.toFixed(2)} cy={sample.quantizedY.toFixed(2)} r="4.5" />
                  </g>
                ))}
                <text className="lab-label" x="54" y="40">{language === "zh" ? "ADC 输入模拟波形" : "ADC analog input"}</text>
                <text className="lab-label" x="54" y="270">{language === "zh" ? "采样点与量化等级" : "Samples and quantization levels"}</text>
              </>
            ) : null}
            {mode === "dac" ? (
              <>
                <line className="codec-sub-axis" x1="50" x2="710" y1="112" y2="112" />
                <line className="codec-sub-axis" x1="50" x2="710" y1="232" y2="232" />
                <path className="codec-step-path" d={data.dacHoldPath} />
                <path className="codec-reconstruction-path" d={data.dacReconstructionPath} />
                {data.samples.map((sample, index) => (
                  <circle className="digital-quantized-dot" cx={sample.x.toFixed(2)} cy={(112 - sample.quantized * 52).toFixed(2)} key={`${index}-${sample.x.toFixed(2)}`} r="4.5" />
                ))}
                <text className="lab-label" x="54" y="42">{language === "zh" ? "保持输出：阶梯状电压" : "Hold output: stepped voltage"}</text>
                <text className="lab-label" x="54" y="192">{language === "zh" ? "重建滤波后：平滑模拟波形" : "After reconstruction filter: smooth analog wave"}</text>
              </>
            ) : null}
            {mode === "codec" ? (
              <>
                <rect className="codec-lane-bg" height="104" rx="8" width="660" x="50" y="54" />
                <rect className="codec-lane-bg" height="104" rx="8" width="660" x="50" y="178" />
                <path className="codec-analog-path codec-capture-path" d={data.codecCapturePath} />
                <path className="codec-playback-path" d={data.codecPlaybackPath} />
                {data.samples.filter((_, index) => index % 2 === 0).map((sample, index) => (
                  <circle className="digital-sample-dot" cx={sample.x.toFixed(2)} cy={(108 - sample.quantized * 52).toFixed(2)} key={`${index}-${sample.x.toFixed(2)}`} r="3.8" />
                ))}
                <text className="lab-label" x="54" y="40">{language === "zh" ? "采集输入链路" : "Capture input path"}</text>
                <text className="lab-label" x="54" y="176">{language === "zh" ? "播放输出链路" : "Playback output path"}</text>
              </>
            ) : null}
            <text className="lab-chip" x="518" y="54">{language === "zh" ? `削波风险 ${data.clippingRisk}%` : `Clipping risk ${data.clippingRisk}%`}</text>
            <text className="lab-chip" x="518" y="88">{language === "zh" ? `抖动风险 ${data.jitterRisk}%` : `Jitter risk ${data.jitterRisk}%`}</text>
            <text className="lab-chip" x="518" y="122">
              {language === "zh"
                ? `量化误差 ${data.quantizationError.toFixed(3)}`
                : `Quantization error ${data.quantizationError.toFixed(3)}`}
            </text>
          </svg>
          <div className="codec-flow-diagram" aria-label={language === "zh" ? `${modeLabels[mode].zh}流程图` : `${modeLabels[mode].en} flow diagram`}>
            <div className="codec-flow-header">
              <strong>{language === "zh" ? "流程图" : "Flow diagram"}</strong>
              <span>{modeLabels[mode][language]}</span>
            </div>
            {modeCopy.playbackChain ? (
              <div className="codec-flow-lanes">
                <div className="codec-flow-lane">
                  <h3>{modeCopy.recordLabel}</h3>
                  <div className="codec-flow-step-row">
                    {modeCopy.chain.map((item, index) => (
                      <div className="codec-flow-step" key={item}>
                        <span>{index + 1}</span>
                        <strong>{item}</strong>
                        {index < modeCopy.chain.length - 1 ? <em>→</em> : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="codec-flow-lane">
                  <h3>{modeCopy.playbackLabel}</h3>
                  <div className="codec-flow-step-row">
                    {modeCopy.playbackChain.map((item, index) => (
                      <div className="codec-flow-step playback" key={item}>
                        <span>{index + 1}</span>
                        <strong>{item}</strong>
                        {index < (modeCopy.playbackChain?.length ?? 0) - 1 ? <em>→</em> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="codec-flow-step-row">
                {modeCopy.chain.map((item, index) => (
                  <div className="codec-flow-step" key={item}>
                    <span>{index + 1}</span>
                    <strong>{item}</strong>
                    {index < modeCopy.chain.length - 1 ? <em>→</em> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="codec-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "转换模式" : "Conversion mode"}>
            {(Object.keys(modeLabels) as CodecMode[]).map((item) => (
              <button
                className={mode === item ? "waveform-tab active" : "waveform-tab"}
                key={item}
                type="button"
                onClick={() => setMode(item)}
              >
                {modeLabels[item][language]}
              </button>
            ))}
          </div>

          <div className="codec-chain">
            <div className="codec-chain-group">
              {modeCopy.recordLabel ? <h3>{modeCopy.recordLabel}</h3> : null}
              {modeCopy.chain.map((item, index) => (
                <div className="codec-chain-item" key={item}>
                  <strong>{item}</strong>
                  {index < modeCopy.chain.length - 1 ? <span>→</span> : null}
                </div>
              ))}
            </div>
            {modeCopy.playbackChain ? (
              <div className="codec-chain-group">
                <h3>{modeCopy.playbackLabel}</h3>
                {modeCopy.playbackChain.map((item, index) => (
                  <div className="codec-chain-item playback" key={item}>
                    <strong>{item}</strong>
                    {index < (modeCopy.playbackChain?.length ?? 0) - 1 ? <span>→</span> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {language === "zh" ? "输入电平" : "Input level"}
                <strong>{inputLevel}%</strong>
              </span>
              <input
                aria-label={language === "zh" ? "输入电平" : "Input level"}
                max="130"
                min="20"
                step="5"
                type="range"
                value={inputLevel}
                onChange={(event) => setInputLevel(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "采样点数" : "Sample count"}
                <strong>{sampleRate}</strong>
              </span>
              <input
                aria-label={language === "zh" ? "采样点数" : "Sample count"}
                max="48"
                min="8"
                step="4"
                type="range"
                value={sampleRate}
                onChange={(event) => setSampleRate(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "位深" : "Bit depth"}
                <strong>{bitDepth} bit</strong>
              </span>
              <input
                aria-label={language === "zh" ? "位深" : "Bit depth"}
                max="8"
                min="3"
                step="1"
                type="range"
                value={bitDepth}
                onChange={(event) => setBitDepth(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "时钟抖动" : "Clock jitter"}
                <strong>{jitter}%</strong>
              </span>
              <input
                aria-label={language === "zh" ? "时钟抖动" : "Clock jitter"}
                max="80"
                min="0"
                step="4"
                type="range"
                value={jitter}
                onChange={(event) => setJitter(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="lab-live-note">
            <strong>{modeLabels[mode][language]}</strong>
            <span>{modeCopy.body}</span>
          </div>
        </div>
      </section>

      <section className="codec-concept-grid" aria-label={language === "zh" ? "转换器关键指标" : "Converter key metrics"}>
        <article>
          <h2>{language === "zh" ? "输入范围" : "Input range"}</h2>
          <p>{language === "zh" ? "模拟输入必须落在 ADC 可接受范围内，超过范围会硬削波。" : "Analog input must stay inside the ADC range, or it clips hard."}</p>
        </article>
        <article>
          <h2>{language === "zh" ? "动态范围" : "Dynamic range"}</h2>
          <p>{language === "zh" ? "位深、噪声底、模拟前端和电源共同决定可用动态范围。" : "Bit depth, noise floor, analog front end, and power define usable range."}</p>
        </article>
        <article>
          <h2>{language === "zh" ? "重建滤波" : "Reconstruction filter"}</h2>
          <p>{language === "zh" ? "DAC 输出需要滤除采样镜像，避免超声频成分进入后级。" : "DAC output needs filtering to remove sampling images before later stages."}</p>
        </article>
        <article>
          <h2>{language === "zh" ? "接口时钟" : "Interface clocks"}</h2>
          <p>{language === "zh" ? "I2S/PDM/TDM 的时钟和帧同步不匹配会造成变调、错位或爆音。" : "I2S/PDM/TDM clock or frame mismatch causes pitch errors, channel shifts, or pops."}</p>
        </article>
      </section>
    </main>
  );
}
