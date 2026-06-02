import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type DiagramMode = "amplifier" | "speaker" | "enclosure" | "matching";
type AmpClass = "class-a" | "class-ab" | "class-d";
type EffectMode = "clipping" | "harmonics" | "bass-loss" | "cabinet-resonance" | "limiter";

type PlaybackHandle = {
  stop: () => void;
};

type AmplifierSpeakerLabProps = {
  language: Language;
  onBack: () => void;
};

const chainLabels = {
  zh: ["DAC / Codec 输出", "功放", "分频 / 保护", "扬声器单元", "空气声波"],
  en: ["DAC / Codec out", "Amplifier", "Crossover / protection", "Speaker driver", "Air pressure"]
} satisfies Record<Language, string[]>;

const diagramModes: Array<{ id: DiagramMode; label: Record<Language, string> }> = [
  { id: "amplifier", label: { zh: "功放类型", en: "Amplifier class" } },
  { id: "speaker", label: { zh: "扬声器单元", en: "Speaker driver" } },
  { id: "enclosure", label: { zh: "箱体与分频", en: "Enclosure and crossover" } },
  { id: "matching", label: { zh: "匹配关系", en: "Matching" } }
];

const ampClasses: Array<{ id: AmpClass; label: string; copy: Record<Language, string> }> = [
  {
    id: "class-a",
    label: "Class A",
    copy: {
      zh: "Class A：器件几乎一直导通，线性好但效率低",
      en: "Class A: devices conduct almost all the time, with good linearity but low efficiency"
    }
  },
  {
    id: "class-ab",
    label: "Class AB",
    copy: {
      zh: "Class AB：正负半周分担输出，效率和失真折中",
      en: "Class AB: positive and negative halves share output, balancing efficiency and distortion"
    }
  },
  {
    id: "class-d",
    label: "Class D",
    copy: {
      zh: "Class D：用高速开关和 PWM 表示音频，效率高但要关注滤波和 EMI",
      en: "Class D: represents audio with fast switching and PWM, efficient but sensitive to filtering and EMI"
    }
  }
];

const effects: Array<{
  id: EffectMode;
  label: Record<Language, string>;
  description: Record<Language, string>;
  detail: Record<Language, { cause: string; sound: string; fix: string }>;
}> = [
  {
    id: "clipping",
    label: { zh: "削波失真", en: "Clipping" },
    description: { zh: "波峰被压平，声音变硬、刺耳。", en: "Peaks flatten, making sound hard and harsh." },
    detail: {
      zh: {
        cause: "波形超过功放或数字链路允许范围，输出无法继续跟随输入。",
        sound: "听感常见为刺耳、粗糙、瞬态发毛，严重时像破音。",
        fix: "降低增益、提高供电余量、换更合适的功放/扬声器匹配或启用软限幅。"
      },
      en: {
        cause: "The waveform exceeds the amplifier or digital path headroom, so output can no longer follow input.",
        sound: "It sounds harsh, rough, and broken on peaks.",
        fix: "Reduce gain, improve headroom, match amplifier and speaker, or use soft limiting."
      }
    }
  },
  {
    id: "harmonics",
    label: { zh: "谐波失真", en: "Harmonic distortion" },
    description: { zh: "非线性产生额外倍频成分。", en: "Nonlinearity adds extra multiples of the tone." },
    detail: {
      zh: {
        cause: "功放输出级、扬声器悬边、磁路或振膜在大信号下不再完全线性。",
        sound: "少量低阶谐波可能只觉得变厚，过多会变浑、变脏或刺耳。",
        fix: "降低工作强度、优化单元和箱体、使用失真更低的功放或保护曲线。"
      },
      en: {
        cause: "The amplifier stage or speaker mechanics become nonlinear at higher levels.",
        sound: "Small low-order harmonics can sound thicker; too much sounds dirty or harsh.",
        fix: "Reduce level, improve driver/enclosure design, or use a lower-distortion amplifier/protection curve."
      }
    }
  },
  {
    id: "bass-loss",
    label: { zh: "低频不足", en: "Bass loss" },
    description: { zh: "低频被削弱，声音变薄。", en: "Bass is reduced and the sound becomes thin." },
    detail: {
      zh: {
        cause: "小扬声器振膜面积、行程和箱体容积有限，低频无法产生足够声压。",
        sound: "鼓和贝斯缺少重量，人声可能偏薄。",
        fix: "增大单元/箱体、改善密封和倒相设计，或用 DSP 在安全范围内补偿。"
      },
      en: {
        cause: "Small drivers have limited area, excursion, and enclosure volume, so bass SPL is limited.",
        sound: "Kick and bass lose weight; voices may sound thin.",
        fix: "Use a larger driver/enclosure, improve sealing or porting, or apply DSP within safe limits."
      }
    }
  },
  {
    id: "cabinet-resonance",
    label: { zh: "箱体共振", en: "Enclosure resonance" },
    description: { zh: "某一段频率被突出，出现嗡、闷或箱声。", en: "A narrow band is emphasized, causing boom or boxiness." },
    detail: {
      zh: {
        cause: "箱体、腔体、出音孔或结构件在某个频率附近发生共振。",
        sound: "声音有明显嗡声、闷声或某个音总是特别突出。",
        fix: "优化箱体容积、加强结构、加入吸音材料、调整 EQ 或分频。"
      },
      en: {
        cause: "The enclosure, cavity, vent, or mechanical parts resonate around a frequency.",
        sound: "The sound becomes boomy, boxy, or dominated by one note.",
        fix: "Adjust volume, stiffening, damping, EQ, or crossover design."
      }
    }
  },
  {
    id: "limiter",
    label: { zh: "动态保护 / 限幅", en: "Dynamic protection / limiting" },
    description: { zh: "峰值被压低，避免破音、过热或过行程。", en: "Peaks are reduced to avoid clipping, heat, or over-excursion." },
    detail: {
      zh: {
        cause: "小音箱或便携设备为了保护扬声器和功放，会在大音量时压低峰值。",
        sound: "声音变稳但动态变小，鼓点和瞬态可能不够冲。",
        fix: "优化保护参数、提升硬件余量，或降低目标响度。"
      },
      en: {
        cause: "Small speakers or portable devices reduce peaks to protect the driver and amplifier.",
        sound: "The sound is safer but less dynamic; transients lose impact.",
        fix: "Tune protection, increase hardware headroom, or reduce target loudness."
      }
    }
  }
];

function createClippingCurve(strength: number) {
  const samples = 1024;
  const curve = new Float32Array(samples);
  const drive = 1 + strength * 24;

  for (let index = 0; index < samples; index += 1) {
    const x = (index / (samples - 1)) * 2 - 1;
    curve[index] = Math.tanh(x * drive);
  }

  return curve;
}

function getAudioContext() {
  const AudioContextConstructor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  return AudioContextConstructor ? new AudioContextConstructor() : null;
}

function startEffectPlayback(effectMode: EffectMode, strengthPercent: number): PlaybackHandle | null {
  const context = getAudioContext();

  if (!context) {
    return null;
  }

  const strength = strengthPercent / 100;
  const source = context.createOscillator();
  const inputGain = context.createGain();
  const outputGain = context.createGain();

  source.type = "sawtooth";
  source.frequency.setValueAtTime(180, context.currentTime);
  inputGain.gain.setValueAtTime(0.08 + strength * 0.14, context.currentTime);
  outputGain.gain.setValueAtTime(0.18, context.currentTime);

  if (effectMode === "clipping") {
    const shaper = context.createWaveShaper();
    shaper.curve = createClippingCurve(strength);
    shaper.oversample = "4x";
    source.connect(inputGain);
    inputGain.connect(shaper);
    shaper.connect(outputGain);
  } else if (effectMode === "bass-loss") {
    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(120 + strength * 520, context.currentTime);
    highpass.Q.setValueAtTime(0.8, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(highpass);
    highpass.connect(outputGain);
  } else if (effectMode === "cabinet-resonance") {
    const peak = context.createBiquadFilter();
    peak.type = "peaking";
    peak.frequency.setValueAtTime(180 + strength * 420, context.currentTime);
    peak.Q.setValueAtTime(8 + strength * 14, context.currentTime);
    peak.gain.setValueAtTime(4 + strength * 16, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(peak);
    peak.connect(outputGain);
  } else if (effectMode === "limiter") {
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18 - strength * 28, context.currentTime);
    compressor.knee.setValueAtTime(6, context.currentTime);
    compressor.ratio.setValueAtTime(4 + strength * 14, context.currentTime);
    compressor.attack.setValueAtTime(0.004, context.currentTime);
    compressor.release.setValueAtTime(0.18, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(compressor);
    compressor.connect(outputGain);
  } else {
    const second = context.createOscillator();
    const third = context.createOscillator();
    const secondGain = context.createGain();
    const thirdGain = context.createGain();

    second.type = "sine";
    third.type = "sine";
    second.frequency.setValueAtTime(360, context.currentTime);
    third.frequency.setValueAtTime(540, context.currentTime);
    secondGain.gain.setValueAtTime(0.02 + strength * 0.08, context.currentTime);
    thirdGain.gain.setValueAtTime(0.01 + strength * 0.06, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(outputGain);
    second.connect(secondGain);
    third.connect(thirdGain);
    secondGain.connect(outputGain);
    thirdGain.connect(outputGain);
    outputGain.connect(context.destination);
    source.start(0);
    second.start(0);
    third.start(0);

    return {
      stop: () => {
        source.stop();
        second.stop();
        third.stop();
        void context.close();
      }
    };
  }

  outputGain.connect(context.destination);
  source.start(0);

  return {
    stop: () => {
      source.stop();
      void context.close();
    }
  };
}

function renderAmplifierDiagram(language: Language, ampClass: AmpClass) {
  const currentCopy = ampClasses.find((item) => item.id === ampClass)?.copy[language] ?? ampClasses[2].copy[language];
  const ampClassLabel = ampClasses.find((item) => item.id === ampClass)?.label ?? "Class D";
  const outputLabel = {
    "class-a": { zh: "线性连续输出", en: "Linear continuous output" },
    "class-ab": { zh: "正负半周交替输出", en: "Positive and negative halves alternate" },
    "class-d": { zh: "PWM 开关输出", en: "PWM switching output" }
  } satisfies Record<AmpClass, Record<Language, string>>;
  const outputWave = {
    "class-a": "M 72 248 C 108 196 144 196 180 248 S 252 300 288 248",
    "class-ab": "M 72 248 C 96 208 120 208 144 248 H 168 C 192 288 216 288 240 248 H 264",
    "class-d": "M 72 248 H 96 V 210 H 120 V 248 H 144 V 210 H 168 V 248 H 192 V 210 H 216 V 248 H 240 V 210 H 264 V 248"
  } satisfies Record<AmpClass, string>;

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? `${ampClassLabel} 功放图解` : `${ampClassLabel} amplifier diagram`}
        role="img"
        viewBox="0 0 760 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        <text className="lab-label" x="48" y="56">
          {language === "zh" ? "输入音频" : "Audio input"}
        </text>
        <path className="amp-wave-input" d="M 48 112 C 84 64 120 64 156 112 S 228 160 264 112 336 64 372 112" />
        <rect className="amp-block" height="80" rx="10" width="150" x="420" y="72" />
        <text className="interface-node-text" x="495" y="106">
          {ampClass === "class-d" ? "PWM" : ampClass === "class-ab" ? "AB" : "A"}
        </text>
        <text className="interface-node-sub" x="495" y="132">
          {language === "zh" ? "功率输出级" : "Power stage"}
        </text>
        <text className="lab-label" x="72" y="216">
          {outputLabel[ampClass][language]}
        </text>
        <path className="interface-clock-line" d={outputWave[ampClass]} />
        {ampClass === "class-ab" ? (
          <>
            <text className="interface-node-sub" x="122" y="300">
              {language === "zh" ? "正半周" : "Positive half"}
            </text>
            <text className="interface-node-sub" x="220" y="300">
              {language === "zh" ? "负半周" : "Negative half"}
            </text>
          </>
        ) : null}
        <rect className="amp-block muted" height="76" rx="10" width="190" x="460" y="212" />
        <text className="interface-node-text" x="555" y="242">
          {language === "zh" ? "输出滤波 / 扬声器负载" : "Output filter / speaker load"}
        </text>
        <text className="interface-node-sub" x="555" y="270">
          {language === "zh" ? "恢复音频电流" : "Recover audio current"}
        </text>
      </svg>
      <figcaption>{currentCopy}</figcaption>
    </figure>
  );
}

function renderSpeakerDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "动圈扬声器结构图" : "Moving coil speaker diagram"}
        role="img"
        viewBox="0 0 760 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        <circle className="amp-magnet" cx="240" cy="178" r="72" />
        <rect className="amp-voice-coil" height="76" rx="12" width="88" x="286" y="140" />
        <path className="amp-cone" d="M 374 124 L 610 62 L 610 298 L 374 236 Z" />
        <path className="amp-air-wave" d="M 646 118 C 690 150 690 210 646 244" />
        <path className="amp-air-wave" d="M 676 92 C 736 140 736 220 676 270" />
        <text className="lab-chip" x="186" y="90">
          {language === "zh" ? "磁路" : "Magnet"}
        </text>
        <text className="lab-chip" x="286" y="122">
          {language === "zh" ? "音圈" : "Voice coil"}
        </text>
        <text className="lab-chip" x="446" y="78">
          {language === "zh" ? "振膜运动" : "Diaphragm motion"}
        </text>
        <text className="lab-chip" x="628" y="314">
          {language === "zh" ? "空气声波" : "Air pressure"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "电流经过音圈，在磁场中产生力，推动振膜往复运动。"
          : "Current through the voice coil creates force in the magnetic field and moves the diaphragm."}
      </figcaption>
    </figure>
  );
}

function renderEnclosureDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "箱体与分频图解" : "Enclosure and crossover diagram"}
        role="img"
        viewBox="0 0 760 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        <rect className="amp-speaker-box" height="220" rx="16" width="240" x="78" y="72" />
        <circle className="amp-driver-low" cx="198" cy="214" r="54" />
        <circle className="amp-driver-high" cx="198" cy="120" r="28" />
        <rect className="amp-block" height="86" rx="12" width="188" x="430" y="116" />
        <text className="interface-node-text" x="524" y="150">
          {language === "zh" ? "分频点" : "Crossover point"}
        </text>
        <text className="interface-node-sub" x="524" y="176">
          2.5 kHz
        </text>
        <text className="lab-chip" x="132" y="292">
          {language === "zh" ? "低音单元" : "Woofer"}
        </text>
        <text className="lab-chip" x="132" y="52">
          {language === "zh" ? "高音单元" : "Tweeter"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "箱体影响低频和共振，分频器把不同频段送给适合的单元。"
          : "The enclosure shapes bass and resonance; the crossover sends bands to suitable drivers."}
      </figcaption>
    </figure>
  );
}

function renderMatchingDiagram(language: Language) {
  const nodes = [
    { label: language === "zh" ? "功率" : "Power", x: 118, y: 104 },
    { label: language === "zh" ? "阻抗" : "Impedance", x: 382, y: 104 },
    { label: language === "zh" ? "灵敏度" : "Sensitivity", x: 250, y: 238 }
  ];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "功放扬声器匹配图" : "Amplifier speaker matching diagram"}
        role="img"
        viewBox="0 0 760 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampMatchArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        {nodes.map((node) => (
          <g key={node.label}>
            <circle className="amp-match-node" cx={node.x} cy={node.y} r="74" />
            <text className="interface-node-text" x={node.x} y={node.y + 6}>
              {node.label}
            </text>
          </g>
        ))}
        <path className="interface-flow-arrow amp-matching-arrow" d="M 178 126 L 322 126" />
        <path className="interface-flow-arrow amp-matching-arrow" d="M 358 164 L 292 216" />
        <path className="interface-flow-arrow amp-matching-arrow" d="M 208 216 L 152 164" />
        <text className="lab-chip" x="462" y="260">
          {language === "zh" ? "保护限制最大输出" : "Protection limits maximum output"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "匹配关系决定响度、失真、热风险和保护动作。"
          : "Matching determines loudness, distortion, thermal risk, and protection behavior."}
      </figcaption>
    </figure>
  );
}

function renderDiagram({
  language,
  diagramMode,
  ampClass
}: {
  language: Language;
  diagramMode: DiagramMode;
  ampClass: AmpClass;
}) {
  if (diagramMode === "speaker") {
    return renderSpeakerDiagram(language);
  }
  if (diagramMode === "enclosure") {
    return renderEnclosureDiagram(language);
  }
  if (diagramMode === "matching") {
    return renderMatchingDiagram(language);
  }

  return renderAmplifierDiagram(language, ampClass);
}

export function AmplifierSpeakerLab({ language, onBack }: AmplifierSpeakerLabProps) {
  const [diagramMode, setDiagramMode] = useState<DiagramMode>("amplifier");
  const [ampClass, setAmpClass] = useState<AmpClass>("class-d");
  const [effectMode, setEffectMode] = useState<EffectMode>("clipping");
  const [effectStrength, setEffectStrength] = useState(65);
  const [activeInfo, setActiveInfo] = useState<EffectMode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUnsupported, setAudioUnsupported] = useState(false);
  const playbackRef = useRef<PlaybackHandle | null>(null);
  const closeInfoButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const activeInfoEffect = activeInfo ? effects.find((effect) => effect.id === activeInfo) : null;

  function stopPlayback() {
    playbackRef.current?.stop();
    playbackRef.current = null;
    setIsPlaying(false);
  }

  function selectEffect(nextEffect: EffectMode) {
    stopPlayback();
    setEffectMode(nextEffect);
  }

  function togglePlayback() {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const playback = startEffectPlayback(effectMode, effectStrength);

    if (!playback) {
      setAudioUnsupported(true);
      return;
    }

    playbackRef.current = playback;
    setAudioUnsupported(false);
    setIsPlaying(true);
  }

  useEffect(() => {
    return () => {
      playbackRef.current?.stop();
      playbackRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!activeInfoEffect) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeInfoButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveInfo(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [activeInfoEffect]);

  return (
    <main className="codec-lab-page amp-lab">
      <section className="sound-lab-hero" aria-labelledby="amplifier-speaker-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1 id="amplifier-speaker-lab-title">
            {language === "zh" ? "功放与扬声器实验室" : "Amplifier and Speaker Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "观察小信号如何变成功率输出、振膜运动和空气声波，并试听常见功放与扬声器问题。"
              : "Inspect how a small signal becomes power output, diaphragm motion, and air pressure while auditioning common amplifier and speaker problems."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "功放与扬声器信号链" : "Amplifier and speaker signal chain"}
        className="amp-lab-chain"
      >
        {chainLabels[language].map((label, index) => (
          <div className="amp-chain-node" key={label}>
            <span>{label}</span>
            {index < chainLabels[language].length - 1 ? <strong aria-hidden="true">→</strong> : null}
          </div>
        ))}
      </section>

      <section
        aria-label={language === "zh" ? "功放与扬声器实验台" : "Amplifier and speaker workbench"}
        className="amp-lab-workbench"
      >
        <div className="amp-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "图解模式" : "Diagram mode"}>
            {diagramModes.map((mode) => (
              <button
                aria-pressed={diagramMode === mode.id}
                className={diagramMode === mode.id ? "waveform-tab active" : "waveform-tab"}
                key={mode.id}
                type="button"
                onClick={() => setDiagramMode(mode.id)}
              >
                {mode.label[language]}
              </button>
            ))}
          </div>

          {diagramMode === "amplifier" ? (
            <div
              className="waveform-tabs amp-class-tabs"
              role="group"
              aria-label={language === "zh" ? "功放类型" : "Amplifier class"}
            >
              {ampClasses.map((item) => (
                <button
                  aria-pressed={ampClass === item.id}
                  className={ampClass === item.id ? "waveform-tab active" : "waveform-tab"}
                  key={item.id}
                  type="button"
                  onClick={() => setAmpClass(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          {renderDiagram({ language, diagramMode, ampClass })}
        </div>

        <aside
          className="amp-lab-effects"
          aria-label={language === "zh" ? "功放扬声器音效演示" : "Amplifier speaker effect demos"}
        >
          <h2>{language === "zh" ? "可听音效演示" : "Listening demos"}</h2>
          <div className="amp-effect-list">
            {effects.map((effect) => (
              <article className={effectMode === effect.id ? "amp-effect-card active" : "amp-effect-card"} key={effect.id}>
                <button aria-pressed={effectMode === effect.id} type="button" onClick={() => selectEffect(effect.id)}>
                  {effect.label[language]}
                </button>
                <p>{effect.description[language]}</p>
                <button className="amp-info-button" type="button" onClick={() => setActiveInfo(effect.id)}>
                  {language === "zh" ? `查看${effect.label.zh}说明` : `View ${effect.label.en} details`}
                </button>
              </article>
            ))}
          </div>

          <label className="lab-slider">
            <span>{language === "zh" ? "效果强度" : "Effect strength"}</span>
            <input
              aria-label={language === "zh" ? "效果强度" : "Effect strength"}
              max="100"
              min="0"
              type="range"
              value={effectStrength}
              onChange={(event) => setEffectStrength(Number(event.target.value))}
            />
            <strong>{effectStrength}%</strong>
          </label>

          <button className="lab-play-button" type="button" onClick={togglePlayback}>
            {isPlaying ? (language === "zh" ? "停止音效" : "Stop effect") : language === "zh" ? "播放音效" : "Play effect"}
          </button>
          <p className="amp-play-state">
            {isPlaying ? (language === "zh" ? "播放中" : "Playing") : language === "zh" ? "已停止" : "Stopped"}
          </p>
          {audioUnsupported ? (
            <p className="lab-warning">
              {language === "zh"
                ? "当前浏览器不支持 Web Audio，仍可查看图解。"
                : "This browser does not support Web Audio; diagrams are still available."}
            </p>
          ) : null}
        </aside>
      </section>

      {activeInfoEffect ? (
        <div className="effect-modal-layer" onClick={() => setActiveInfo(null)}>
          <section
            aria-label={`${activeInfoEffect.label[language]}${language === "zh" ? "说明" : " details"}`}
            aria-modal="true"
            className="effect-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{activeInfoEffect.label[language]}</h2>
            <p>{activeInfoEffect.detail[language].cause}</p>
            <p>{activeInfoEffect.detail[language].sound}</p>
            <p>{activeInfoEffect.detail[language].fix}</p>
            <button ref={closeInfoButtonRef} type="button" onClick={() => setActiveInfo(null)}>
              {language === "zh" ? "关闭说明" : "Close details"}
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
