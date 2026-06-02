import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type DiagramMode = "amplifier" | "speaker" | "enclosure" | "matching";
type AmpClass = "class-a" | "class-ab" | "class-d";

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

function renderAmplifierDiagram(language: Language, ampClass: AmpClass) {
  const currentCopy = ampClasses.find((item) => item.id === ampClass)?.copy[language] ?? ampClasses[2].copy[language];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "Class D 功放图解" : "Class D amplifier diagram"}
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
          {language === "zh" ? "PWM 开关输出" : "PWM switching output"}
        </text>
        <path className="interface-clock-line" d="M 72 248 H 96 V 210 H 120 V 248 H 144 V 210 H 168 V 248 H 192 V 210 H 216 V 248 H 240 V 210 H 264 V 248" />
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
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        {nodes.map((node) => (
          <g key={node.label}>
            <circle className="amp-match-node" cx={node.x} cy={node.y} r="74" />
            <text className="interface-node-text" x={node.x} y={node.y + 6}>
              {node.label}
            </text>
          </g>
        ))}
        <path className="interface-flow-arrow" d="M 178 126 L 322 126" />
        <path className="interface-flow-arrow" d="M 358 164 L 292 216" />
        <path className="interface-flow-arrow" d="M 208 216 L 152 164" />
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
                className={diagramMode === mode.id ? "active" : ""}
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
                  className={ampClass === item.id ? "active" : ""}
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
      </section>
    </main>
  );
}
