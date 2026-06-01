import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type CodecHardwareLabProps = {
  language: Language;
  onBack: () => void;
};

type CodecMode = "adc" | "dac" | "codec";

type ModeConcept = {
  title: string;
  body: string;
};

type ModeCopy = {
  title: string;
  body: string;
  chain: string[];
  concepts: ModeConcept[];
  playbackChain?: string[];
  recordLabel?: string;
  playbackLabel?: string;
};

const modeLabels: Record<CodecMode, Record<Language, string>> = {
  adc: { zh: "ADC 采集", en: "ADC capture" },
  dac: { zh: "DAC 重建", en: "DAC reconstruction" },
  codec: { zh: "Codec 芯片链路", en: "Codec chip path" }
};

const fixedConverterSettings = {
  bitDepth: 5,
  inputLevel: 86,
  jitter: 8,
  sampleRate: 24
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
  const visibleQuantizationLineCount = Math.min(33, levels);
  const visibleQuantizationLines = Array.from({ length: visibleQuantizationLineCount }, (_, index) => {
    const ratio = visibleQuantizationLineCount <= 1 ? 0 : index / (visibleQuantizationLineCount - 1);
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
          : ["Analog in", "PGA", "Anti-alias", "Sample/quantize", "I2S PCM"],
      concepts:
        language === "zh"
          ? [
              {
                title: "输入范围",
                body: "ADC 只能接收有限电压范围，超出满量程会把波峰压平，形成不可恢复的削波失真。"
              },
              {
                title: "PGA / 前级增益",
                body: "PGA 在采样前调整模拟电平，让弱信号远离噪声底，同时避免大信号把 ADC 推到削波。"
              },
              {
                title: "抗混叠滤波",
                body: "采样前的低通滤波会压掉高于奈奎斯特频率的成分，防止它们折叠到可听频段。"
              },
              {
                title: "量化误差",
                body: "连续电压被映射到有限等级，位深越低，台阶越粗，误差和量化噪声越明显。"
              }
            ]
          : [
              {
                title: "Input range",
                body: "The ADC accepts a limited voltage span. Exceeding full scale flattens peaks and creates irreversible clipping."
              },
              {
                title: "PGA / front-end gain",
                body: "The PGA sets analog level before sampling so quiet signals clear the noise floor without clipping loud signals."
              },
              {
                title: "Anti-alias filter",
                body: "A pre-sampling low-pass filter attenuates content above Nyquist so it cannot fold into the audible band."
              },
              {
                title: "Quantization error",
                body: "Continuous voltage is mapped to finite levels. Lower bit depth means coarser steps and more quantization noise."
              }
            ]
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
          : ["I2S PCM", "Interpolation", "DAC core", "Reconstruction", "Analog out"],
      concepts:
        language === "zh"
          ? [
              {
                title: "插值与过采样",
                body: "DAC 常先插入中间样本并提高内部采样率，让后面的模拟滤波更容易处理。"
              },
              {
                title: "保持输出",
                body: "数字样本会先变成阶梯状电压，阶梯边沿包含采样镜像和高频成分。"
              },
              {
                title: "重建滤波",
                body: "低通重建滤波把阶梯和镜像成分抹平，输出更接近连续模拟波形。"
              },
              {
                title: "输出驱动",
                body: "缓冲器、耳放或功放负责提供电流能力，决定能否稳定推动耳机、线路输入或扬声器。"
              }
            ]
          : [
              {
                title: "Interpolation and oversampling",
                body: "DACs often insert intermediate samples and raise the internal rate so analog filtering can be gentler."
              },
              {
                title: "Hold output",
                body: "Digital samples first become stepped voltage. Step edges contain sampling images and high-frequency content."
              },
              {
                title: "Reconstruction filter",
                body: "A low-pass reconstruction filter smooths the steps and images into a more continuous analog waveform."
              },
              {
                title: "Output driver",
                body: "Buffers, headphone amps, or speaker amps supply current for headphones, line inputs, or speakers."
              }
            ]
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
    concepts:
      language === "zh"
        ? [
            {
              title: "路由矩阵",
              body: "Codec 内部会把 Mic、Line、ADC、DAC、Mixer 和输出端按寄存器配置连接起来。"
            },
            {
              title: "I2S / TDM 接口",
              body: "I2S 常用于左右声道，TDM 可在同一组时钟上传多路音频，必须匹配位宽、帧长和主从时钟。"
            },
            {
              title: "寄存器配置",
              body: "软件通过控制寄存器设置输入选择、增益、采样率、静音、数字滤波和接口格式。"
            },
            {
              title: "电源与静音控制",
              body: "Codec 会分区管理 ADC、DAC、PGA、PLL 和功放电源，切换时需要软静音避免爆音。"
            }
          ]
        : [
            {
              title: "Routing matrix",
              body: "The codec connects mic, line, ADC, DAC, mixer, and outputs through register-controlled routing."
            },
            {
              title: "I2S / TDM interface",
              body: "I2S commonly carries stereo audio, while TDM carries more channels on one clock group with matched framing."
            },
            {
              title: "Register configuration",
              body: "Software sets input selection, gain, sample rate, mute, digital filters, and interface format through registers."
            },
            {
              title: "Power and mute control",
              body: "Codecs gate ADC, DAC, PGA, PLL, and amplifier power domains and use soft mute to avoid pops during changes."
            }
          ],
    playbackLabel: language === "zh" ? "播放链路" : "Playback path",
    recordLabel: language === "zh" ? "录音链路" : "Capture path"
  };
}

function getModeStatus({
  bitDepth,
  language,
  levels,
  mode,
  sampleRate
}: {
  bitDepth: number;
  language: Language;
  levels: number;
  mode: CodecMode;
  sampleRate: number;
}) {
  if (mode === "adc") {
    return language === "zh"
      ? `量化等级：${levels} 级 · 采样点：${sampleRate}`
      : `Quantization levels: ${levels} · samples: ${sampleRate}`;
  }

  if (mode === "dac") {
    return language === "zh"
      ? `输出位深：${bitDepth} bit · 重建样本：${sampleRate}`
      : `Output depth: ${bitDepth} bit · reconstruction samples: ${sampleRate}`;
  }

  return language === "zh"
    ? `双向链路 · I2S/TDM · 每帧样本：${sampleRate}`
    : `Duplex path · I2S/TDM · samples per frame: ${sampleRate}`;
}

function renderCodecSvgDefs() {
  return (
    <defs>
      <linearGradient id="codecAnalogLine" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#7ee7d8" />
        <stop offset="100%" stopColor="#f0b46a" />
      </linearGradient>
    </defs>
  );
}

function renderCodecSvgBase() {
  return (
    <>
      <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
      <line className="lab-axis" x1="50" x2="710" y1="150" y2="150" />
      <line className="lab-axis faint" x1="50" x2="710" y1="58" y2="58" />
      <line className="lab-axis faint" x1="50" x2="710" y1="242" y2="242" />
    </>
  );
}

function renderCodecMetricChips({
  clippingRisk,
  jitterRisk,
  language,
  quantizationError
}: {
  clippingRisk: number;
  jitterRisk: number;
  language: Language;
  quantizationError: number;
}) {
  return (
    <>
      <text className="lab-chip" x="518" y="54">{language === "zh" ? `削波风险 ${clippingRisk}%` : `Clipping risk ${clippingRisk}%`}</text>
      <text className="lab-chip" x="518" y="88">{language === "zh" ? `抖动风险 ${jitterRisk}%` : `Jitter risk ${jitterRisk}%`}</text>
      <text className="lab-chip" x="518" y="122">
        {language === "zh" ? `量化误差 ${quantizationError.toFixed(3)}` : `Quantization error ${quantizationError.toFixed(3)}`}
      </text>
    </>
  );
}

export function CodecHardwareLab({ language, onBack }: CodecHardwareLabProps) {
  const [mode, setMode] = useState<CodecMode>("adc");
  const [inputLevel, setInputLevel] = useState(fixedConverterSettings.inputLevel);
  const [sampleRate, setSampleRate] = useState(fixedConverterSettings.sampleRate);
  const [bitDepth, setBitDepth] = useState(fixedConverterSettings.bitDepth);
  const [jitter, setJitter] = useState(fixedConverterSettings.jitter);
  const data = useMemo(
    () => createConverterData({ bitDepth, inputLevel, jitter, sampleRate }),
    [bitDepth, inputLevel, jitter, sampleRate]
  );
  const modeCopy = getModeCopy(mode, language);
  const levels = 2 ** bitDepth;
  const modeStatus = getModeStatus({ bitDepth, language, levels, mode, sampleRate });

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
            <span>{modeStatus}</span>
          </div>
          {mode === "adc" ? (
            <svg
              aria-label={language === "zh" ? "ADC 采集图" : "ADC capture chart"}
              role="img"
              viewBox="0 0 760 340"
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderCodecSvgDefs()}
              {renderCodecSvgBase()}
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
              {renderCodecMetricChips({ ...data, language })}
            </svg>
          ) : null}
          {mode === "dac" ? (
            <svg
              aria-label={language === "zh" ? "DAC 重建图" : "DAC reconstruction chart"}
              role="img"
              viewBox="0 0 760 340"
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderCodecSvgDefs()}
              {renderCodecSvgBase()}
                <line className="codec-sub-axis" x1="50" x2="710" y1="112" y2="112" />
                <line className="codec-sub-axis" x1="50" x2="710" y1="232" y2="232" />
                <path className="codec-step-path" d={data.dacHoldPath} />
                <path className="codec-reconstruction-path" d={data.dacReconstructionPath} />
                {data.samples.map((sample, index) => (
                  <circle className="digital-quantized-dot" cx={sample.x.toFixed(2)} cy={(112 - sample.quantized * 52).toFixed(2)} key={`${index}-${sample.x.toFixed(2)}`} r="4.5" />
                ))}
                <text className="lab-label" x="54" y="42">{language === "zh" ? "保持输出：阶梯状电压" : "Hold output: stepped voltage"}</text>
                <text className="lab-label" x="54" y="192">{language === "zh" ? "重建滤波后：平滑模拟波形" : "After reconstruction filter: smooth analog wave"}</text>
              {renderCodecMetricChips({ ...data, language })}
            </svg>
          ) : null}
          {mode === "codec" ? (
            <svg
              aria-label={language === "zh" ? "Codec 芯片链路图" : "Codec chip path chart"}
              role="img"
              viewBox="0 0 760 340"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker id="codecRecordArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M 0 0 L 8 4 L 0 8 Z" fill="#7ee7d8" />
                </marker>
                <marker id="codecPlaybackArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
                </marker>
              </defs>
              <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
              <text className="lab-label" x="54" y="42">{language === "zh" ? "录音链路" : "Capture path"}</text>
              <text className="lab-label" x="54" y="190">{language === "zh" ? "播放链路" : "Playback path"}</text>
              <text className="codec-block-note" x="534" y="42">{language === "zh" ? "控制面" : "Control plane"}</text>

              <g className="codec-block-row">
                {["Mic/Line", "PGA", "ADC", "I2S/TDM", language === "zh" ? "主控" : "Host"].map((item, index) => {
                  const x = 54 + index * 126;
                  return (
                    <g key={item}>
                      <rect className="codec-block-node" height="58" rx="8" width="96" x={x} y="70" />
                      <text className="codec-block-text" x={x + 48} y="105">{item}</text>
                      {index < 4 ? <path className="codec-block-arrow" d={`M ${x + 100} 99 L ${x + 122} 99`} /> : null}
                    </g>
                  );
                })}
              </g>

              <g className="codec-block-row playback">
                {[language === "zh" ? "主控" : "Host", "I2S/TDM", "DAC", language === "zh" ? "耳放/功放" : "HP/Amp", "Speaker"].map((item, index) => {
                  const x = 54 + index * 126;
                  return (
                    <g key={item}>
                      <rect className="codec-block-node playback" height="58" rx="8" width="96" x={x} y="218" />
                      <text className="codec-block-text" x={x + 48} y="253">{item}</text>
                      {index < 4 ? <path className="codec-block-arrow playback" d={`M ${x + 100} 247 L ${x + 122} 247`} /> : null}
                    </g>
                  );
                })}
              </g>

              <g>
                <rect className="codec-control-node" height="70" rx="10" width="138" x="552" y="120" />
                <text className="codec-control-text" x="621" y="150">{language === "zh" ? "寄存器控制" : "Registers"}</text>
                <text className="codec-control-subtext" x="621" y="174">{language === "zh" ? "路由 / 增益 / 静音" : "route / gain / mute"}</text>
                <path className="codec-control-line" d="M 590 120 L 400 128" />
                <path className="codec-control-line" d="M 590 190 L 400 218" />
              </g>
            </svg>
          ) : null}
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

          {mode !== "codec" ? (
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
          ) : null}

          <div className="lab-live-note">
            <strong>{modeLabels[mode][language]}</strong>
            <span>{modeCopy.body}</span>
          </div>
        </div>

        <section className="codec-mode-concepts" aria-label={language === "zh" ? "当前模式关键知识点" : "Current mode key concepts"}>
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "当前模式关键知识点" : "Current mode key concepts"}</strong>
            <span>{modeLabels[mode][language]}</span>
          </div>
          <div className="codec-concept-grid">
            {modeCopy.concepts.map((concept) => (
              <article key={concept.title}>
                <h2>{concept.title}</h2>
                <p>{concept.body}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
