import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type DiagramMode = "amplifier" | "speaker" | "enclosure" | "matching";
type AmpClass = "class-a" | "class-ab" | "class-d";
type AmpPrincipleDetail = {
  principle: string;
  advantage: string;
  caution: string;
  usage: string;
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

const ampPrinciples = {
  "class-a": {
    zh: {
      principle: "基本原理：输出器件始终处在导通区，完整正负半周都由线性放大路径连续处理。",
      advantage: "优势：线性好，交越失真少，声音细节容易保持。",
      caution: "注意：静态电流大，效率低，发热明显。",
      usage: "常见：小功率高保真、耳放、前级或偏重音质的线性电路。"
    },
    en: {
      principle:
        "Principle: the output device stays biased on, so the full positive and negative waveform is handled through a continuous linear path.",
      advantage: "Benefit: good linearity and very little crossover distortion.",
      caution: "Watch out: high idle current, low efficiency, and obvious heat.",
      usage: "Common in: low-power hi-fi, headphone amps, preamps, and linear circuits focused on sound quality."
    }
  },
  "class-ab": {
    zh: {
      principle: "基本原理：正半周和负半周主要由上下两组输出器件分担，并保留少量偏置来减轻交越失真。",
      advantage: "优势：比 Class A 效率高，又比纯 B 类更容易控制交越失真。",
      caution: "注意：偏置设置不好会有交越失真，仍有一定发热。",
      usage: "常见：传统音箱功放、车载功放和较多线性功放。"
    },
    en: {
      principle:
        "Principle: positive and negative halves are mainly shared by upper and lower output devices, with a small bias to reduce crossover distortion.",
      advantage: "Benefit: more efficient than Class A and easier to keep clean than pure Class B.",
      caution: "Watch out: poor biasing causes crossover distortion, and it still produces heat.",
      usage: "Common in: traditional speaker amps, car amplifiers, and many linear power amplifiers."
    }
  },
  "class-d": {
    zh: {
      principle: "基本原理：音频信号先变成 PWM 或类似的高速开关脉冲，输出级只在开/关之间切换，再通过滤波和扬声器还原音频电流。",
      advantage: "优势：效率高、发热低，适合电池供电和小体积设备。",
      caution: "注意：需要输出滤波，并关注 EMI、电源和 PCB 布局。",
      usage: "常见：蓝牙音箱、手机、电视、便携设备和高效率大功率功放。"
    },
    en: {
      principle:
        "Principle: the audio signal is converted into PWM or a similar high-speed switching pulse stream, the output stage switches on/off, then filtering and the speaker recover audio current.",
      advantage: "Benefit: high efficiency and low heat, well suited to battery-powered and compact devices.",
      caution: "Watch out: output filtering, EMI, power supply, and PCB layout matter.",
      usage: "Common in: Bluetooth speakers, phones, TVs, portable devices, and high-efficiency high-power amps."
    }
  }
} satisfies Record<AmpClass, Record<Language, AmpPrincipleDetail>>;

function renderAmplifierDiagram(language: Language, ampClass: AmpClass) {
  const currentCopy = ampClasses.find((item) => item.id === ampClass)?.copy[language] ?? ampClasses[2].copy[language];
  const ampClassLabel = ampClasses.find((item) => item.id === ampClass)?.label ?? "Class D";
  const stageLabel = {
    "class-a": { zh: "线性放大", en: "Linear gain" },
    "class-ab": { zh: "AB 推挽", en: "AB push-pull" },
    "class-d": { zh: "PWM 调制", en: "PWM modulation" }
  } satisfies Record<AmpClass, Record<Language, string>>;
  const outputLabel = {
    "class-a": { zh: "线性连续输出", en: "Linear continuous output" },
    "class-ab": { zh: "正负半周交替输出", en: "Positive and negative halves alternate" },
    "class-d": { zh: "PWM 开关输出", en: "PWM switching output" }
  } satisfies Record<AmpClass, Record<Language, string>>;
  const outputWave = {
    "class-a": "M 438 190 C 456 134 474 134 492 190 S 528 246 546 190",
    "class-ab": "M 438 190 C 452 144 466 144 480 190 H 492 C 506 236 520 236 534 190 H 546",
    "class-d": "M 438 190 H 451 V 138 H 464 V 242 H 477 V 138 H 490 V 242 H 503 V 138 H 516 V 242 H 529 V 138 H 542 V 190"
  } satisfies Record<AmpClass, string>;
  const inputWave = "M 62 190 C 80 152 98 152 116 190 S 152 228 170 190 206 152 224 190";

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? `${ampClassLabel} 功放图解` : `${ampClassLabel} amplifier diagram`}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "从左到右：输入小信号 → 功放工作方式 → 功率输出 → 扬声器负载"
            : "Left to right: small input signal -> amplifier method -> power output -> speaker load"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "同一条中线表示同一个时间基准，方便比较波形如何变化"
            : "The shared center line uses the same time reference so waveform changes are easier to compare"}
        </text>

        <line className="amp-flow-centerline" x1="48" x2="712" y1="190" y2="190" />
        <path className="amp-flow-arrow" d="M 240 190 L 270 190" />
        <path className="amp-flow-arrow" d="M 358 190 L 408 190" />
        <path className="amp-flow-arrow" d="M 560 190 L 598 190" />

        <text className="lab-label" x="144" y="112">
          {language === "zh" ? "输入小信号" : "Small input signal"}
        </text>
        <path className="amp-wave-input" d={inputWave} />
        <text className="interface-node-sub" x="144" y="268">
          {language === "zh" ? "DAC / Codec 输出，电压小" : "DAC / codec out, low voltage"}
        </text>

        <text className="lab-label" x="314" y="112">
          {language === "zh" ? "功放工作方式" : "Amplifier method"}
        </text>
        <rect className="amp-block" height="86" rx="12" width="104" x="276" y="146" />
        <text className="interface-node-text" x="328" y="180">{ampClassLabel}</text>
        <text className="interface-node-sub" x="328" y="207">{stageLabel[ampClass][language]}</text>
        <text className="interface-node-sub" x="328" y="268">
          {language === "zh" ? "决定效率、失真和发热" : "Sets efficiency, distortion, and heat"}
        </text>

        <text className="lab-label" x="492" y="112">
          {language === "zh" ? "功率输出" : "Power output"}
        </text>
        <path className="interface-clock-line" d={outputWave[ampClass]} />
        {ampClass === "class-ab" ? (
          <>
            <text className="interface-node-sub" x="470" y="246">
              {language === "zh" ? "正半周" : "Positive half"}
            </text>
            <text className="interface-node-sub" x="528" y="246">
              {language === "zh" ? "负半周" : "Negative half"}
            </text>
          </>
        ) : null}
        <text className="interface-node-sub" x="492" y="268">{outputLabel[ampClass][language]}</text>

        <text className="lab-label" x="656" y="112">
          {language === "zh" ? "扬声器负载" : "Speaker load"}
        </text>
        <rect className="amp-block muted" height="86" rx="12" width="104" x="604" y="146" />
        <path className="amp-cone small" d="M 626 162 L 678 146 L 678 234 L 626 218 Z" />
        <path className="amp-air-wave" d="M 686 170 C 708 184 708 206 686 220" />
        <text className="interface-node-sub" x="656" y="268">
          {language === "zh" ? "滤波后推动扬声器" : "Filtered current drives speaker"}
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
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="speakerFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "从左到右：电流输入 → 音圈受力 → 振膜运动 → 空气声波"
            : "Left to right: current input -> coil force -> diaphragm motion -> air pressure wave"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "这张图看的是电能如何变成机械运动和声波"
            : "This diagram shows how electrical energy becomes mechanical motion and sound"}
        </text>

        <line className="amp-flow-centerline" x1="52" x2="708" y1="196" y2="196" />
        <path className="amp-speaker-arrow" d="M 154 196 L 196 196" />
        <path className="amp-speaker-arrow" d="M 328 196 L 374 196" />
        <path className="amp-speaker-arrow" d="M 552 196 L 608 196" />

        <text className="lab-label" x="106" y="118">
          {language === "zh" ? "电流输入" : "Current input"}
        </text>
        <path className="amp-wave-input" d="M 60 196 C 76 166 92 166 108 196 S 140 226 156 196" />
        <text className="interface-node-sub" x="106" y="272">
          {language === "zh" ? "来自功放的交流电流" : "AC current from amplifier"}
        </text>

        <text className="lab-label" x="262" y="118">
          {language === "zh" ? "音圈受力" : "Voice coil force"}
        </text>
        <circle className="amp-magnet" cx="262" cy="196" r="56" />
        <rect className="amp-voice-coil" height="64" rx="10" width="68" x="296" y="164" />
        <text className="interface-node-sub" x="262" y="278">
          {language === "zh" ? "磁路" : "Magnet"}
        </text>
        <text className="interface-node-sub" x="330" y="252">
          {language === "zh" ? "音圈" : "Voice coil"}
        </text>
        <text className="interface-node-sub" x="292" y="334">
          {language === "zh" ? "电流在磁场中产生推/拉力" : "Current in the magnetic field creates push/pull force"}
        </text>

        <text className="lab-label" x="466" y="118">
          {language === "zh" ? "振膜运动" : "Diaphragm motion"}
        </text>
        <path className="amp-cone" d="M 388 138 L 552 92 L 552 300 L 388 252 Z" />
        <path className="amp-motion-line" d="M 434 118 L 466 118" />
        <path className="amp-motion-line reverse" d="M 434 318 L 466 318" />
        <text className="interface-node-sub" x="466" y="354">
          {language === "zh" ? "振膜前后运动，压缩/稀疏空气" : "Diaphragm moves forward/backward and moves air"}
        </text>

        <text className="lab-label" x="654" y="118">
          {language === "zh" ? "空气声波" : "Air pressure wave"}
        </text>
        <path className="amp-air-wave" d="M 614 132 C 650 162 650 230 614 260" />
        <path className="amp-air-wave" d="M 650 106 C 706 154 706 238 650 288" />
        <text className="interface-node-sub" x="654" y="354">
          {language === "zh" ? "空气压力变化被耳朵听到" : "Air pressure variation reaches the ear"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "动圈扬声器的核心是音圈、磁路和振膜：功放输出电流，音圈在磁场中受力，振膜把机械运动变成空气压力变化。"
          : "A moving-coil speaker is built around the coil, magnet, and diaphragm: amplifier current creates force, and the diaphragm turns that motion into air pressure."}
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
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="enclosureFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "从左到右：全频信号 → 分频器 → 低音/高音单元 → 箱体声学"
            : "Left to right: full-range signal -> crossover -> woofer/tweeter -> enclosure acoustics"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "分频器决定谁负责低频、谁负责高频"
            : "The crossover decides which driver handles low or high frequencies"}
        </text>

        <text className="lab-label" x="96" y="134">
          {language === "zh" ? "全频信号" : "Full-range signal"}
        </text>
        <path className="amp-wave-input" d="M 54 198 C 72 168 90 168 108 198 S 144 228 162 198" />
        <text className="interface-node-sub" x="96" y="256">
          {language === "zh" ? "功放输出含低频和高频" : "Amplifier output contains lows and highs"}
        </text>

        <path className="amp-enclosure-arrow" d="M 176 198 L 220 198" />
        <rect className="amp-block" height="92" rx="12" width="128" x="224" y="152" />
        <text className="interface-node-text" x="288" y="188">
          {language === "zh" ? "分频器" : "Crossover"}
        </text>
        <text className="interface-node-sub" x="288" y="216">
          {language === "zh" ? "低通 / 高通" : "Low-pass / high-pass"}
        </text>
        <text className="interface-node-sub" x="288" y="276">
          {language === "zh" ? "分频点常见 2-3 kHz" : "Typical crossover point: 2-3 kHz"}
        </text>

        <path className="amp-enclosure-arrow" d="M 352 178 C 390 136 416 128 456 126" />
        <path className="amp-enclosure-arrow" d="M 352 218 C 394 260 420 274 456 276" />
        <text className="lab-label" x="432" y="104">
          {language === "zh" ? "高频通路" : "High-frequency path"}
        </text>
        <text className="lab-label" x="432" y="316">
          {language === "zh" ? "低频通路" : "Low-frequency path"}
        </text>

        <rect className="amp-speaker-box" height="230" rx="16" width="190" x="474" y="90" />
        <circle className="amp-driver-high" cx="568" cy="136" r="28" />
        <circle className="amp-driver-low" cx="568" cy="248" r="52" />
        <text className="interface-node-sub" x="568" y="184">
          {language === "zh" ? "高音单元" : "Tweeter"}
        </text>
        <text className="interface-node-sub" x="568" y="322">
          {language === "zh" ? "低音单元" : "Woofer"}
        </text>

        <path className="amp-port" d="M 622 260 H 654" />
        <text className="lab-chip" x="626" y="214">
          {language === "zh" ? "箱体低频响应" : "Enclosure bass response"}
        </text>
        <path className="amp-air-wave" d="M 682 224 C 710 244 710 282 682 304" />
        <text className="interface-node-sub" x="628" y="354">
          {language === "zh" ? "密闭 / 倒相会影响低频" : "Sealed/ported designs affect bass"}
        </text>
        <text className="interface-node-sub" x="628" y="374">
          {language === "zh" ? "腔体容积会改变共振" : "Cabinet volume changes resonance"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "分频器把全频信号拆给不同单元，箱体负责控制低频效率、下潜、共振和漏气问题。"
          : "The crossover splits the full-range signal across drivers, while the enclosure controls bass efficiency, extension, resonance, and leakage."}
      </figcaption>
    </figure>
  );
}

function renderMatchingDiagram(language: Language) {
  const nodes = [
    {
      label: language === "zh" ? "功率" : "Power",
      sub: language === "zh" ? "能提供多少电压/电流余量" : "Voltage/current headroom",
      x: 164,
      y: 118
    },
    {
      label: language === "zh" ? "阻抗" : "Impedance",
      sub: language === "zh" ? "负载越低，电流压力越大" : "Lower load means higher current stress",
      x: 164,
      y: 212
    },
    {
      label: language === "zh" ? "灵敏度" : "Sensitivity",
      sub: language === "zh" ? "同样功率能换来多少声压" : "SPL produced per watt",
      x: 164,
      y: 306
    }
  ];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "功放扬声器匹配图" : "Amplifier speaker matching diagram"}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampMatchArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "不是信号流，而是三个参数共同决定结果"
            : "This is not a signal flow: three parameters jointly decide the result"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "匹配关系看的是响度、失真、发热和保护余量"
            : "Matching is about loudness, distortion, heat, and protection margin"}
        </text>
        {nodes.map((node) => (
          <g key={node.label}>
            <rect className="amp-match-card" height="82" rx="12" width="172" x={node.x - 86} y={node.y - 41} />
            <text className="interface-node-text" x={node.x} y={node.y + 6}>
              {node.label}
            </text>
            <text className="interface-node-sub" x={node.x} y={node.y + 30}>
              {node.sub}
            </text>
          </g>
        ))}

        <path className="amp-matching-arrow" d="M 250 118 C 330 118 402 154 484 176" />
        <path className="amp-matching-arrow" d="M 250 212 H 484" />
        <path className="amp-matching-arrow" d="M 250 306 C 330 306 404 250 484 226" />

        <rect className="amp-block" height="142" rx="16" width="204" x="494" y="132" />
        <text className="interface-node-text" x="595" y="178">
          {language === "zh" ? "实际声压" : "Actual SPL"}
        </text>
        <text className="interface-node-sub" x="595" y="204">
          {language === "zh" ? "听起来有多响" : "How loud it sounds"}
        </text>
        <line className="amp-match-divider" x1="526" x2="670" y1="222" y2="222" />
        <text className="interface-node-text" x="595" y="240">
          {language === "zh" ? "失真 / 保护风险" : "Distortion / protection risk"}
        </text>
        <text className="interface-node-sub" x="595" y="282">
          {language === "zh" ? "功率过小会削波，阻抗过低会过流" : "Too little power clips; too low impedance overcurrents"}
        </text>
        <text className="interface-node-sub" x="595" y="302">
          {language === "zh" ? "灵敏度低需要更多功率" : "Low sensitivity needs more power"}
        </text>
        <text className="lab-chip" x="368" y="366">
          {language === "zh" ? "目标：够响、不破音、不过热" : "Goal: loud enough, clean, and not overheating"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "匹配不是只看一个参数：功放功率、扬声器阻抗和灵敏度共同决定可达到的声压、失真风险和保护动作。"
          : "Matching is not one number: amplifier power, speaker impedance, and sensitivity together determine achievable SPL, distortion risk, and protection behavior."}
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

function renderAmpPrinciple(language: Language, ampClass: AmpClass) {
  const ampClassLabel = ampClasses.find((item) => item.id === ampClass)?.label ?? "Class D";
  const principle = ampPrinciples[ampClass][language];
  const items = [
    {
      key: "principle",
      label: language === "zh" ? "基本原理" : "Principle",
      copy: principle.principle
    },
    {
      key: "advantage",
      label: language === "zh" ? "优势" : "Benefit",
      copy: principle.advantage
    },
    {
      key: "caution",
      label: language === "zh" ? "注意" : "Watch out",
      copy: principle.caution
    },
    {
      key: "usage",
      label: language === "zh" ? "常见场景" : "Common uses",
      copy: principle.usage
    }
  ];

  return (
    <section
      aria-label={language === "zh" ? `${ampClassLabel} 基本原理` : `${ampClassLabel} principle`}
      className="amp-principle-panel"
    >
      <div className="amp-principle-header">
        <span>{language === "zh" ? "功放类型原理" : "Amplifier class principle"}</span>
        <h2>{language === "zh" ? `${ampClassLabel} 基本原理` : `${ampClassLabel} Principle`}</h2>
      </div>
      <div className="amp-principle-grid">
        {items.map((item) => (
          <article className={`amp-principle-card ${item.key}`} key={item.key}>
            <strong>{item.label}</strong>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
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
              ? "观察小信号如何变成功率输出、振膜运动和空气声波，理解功放、分频、箱体和扬声器匹配关系。"
              : "Inspect how a small signal becomes power output, diaphragm motion, and air pressure while learning amplifier, crossover, enclosure, and speaker matching relationships."}
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
            {index < chainLabels[language].length - 1 ? <span aria-hidden="true" className="amp-chain-arrow">→</span> : null}
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
          {diagramMode === "amplifier" ? renderAmpPrinciple(language, ampClass) : null}
        </div>
      </section>
    </main>
  );
}
