# Amplifier Speaker Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chinese/English “功放与扬声器实验室” with expanded knowledge-card content, visual diagrams, and Web Audio listening demos for five amplifier/speaker problems.

**Architecture:** Keep the existing `activeView` single-page routing pattern. Add one focused `AmplifierSpeakerLab` component for lab state, diagrams, Web Audio playback, and effect explainers. Keep topic metadata in `src/content/knowledge.ts`, and route lab buttons through `TopicDetails`.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Web Audio API, SVG, CSS.

---

## Current Worktree Warning

The repository currently has unrelated uncommitted changes in `src/App.test.tsx`, `src/components/DigitalInterfaceLab.tsx`, `src/styles.css`, `public/`, and older untracked `docs/superpowers/` files. Do not run `git add -A`. Each commit in this plan must stage only the paths or hunks for the current task. If a task modifies a file with existing unrelated changes, use `git add -p <file>` and verify `git diff --cached` before committing.

## File Structure

- Modify `src/content/knowledge.ts`
  - Add `amplifier-speaker` to `TopicLab.type`.
  - Expand the “功放与扬声器” topic with detailed terms, lab metadata, and richer key concepts.
- Modify `src/components/TopicDetails.tsx`
  - Add `onOpenAmplifierSpeakerLab` prop.
  - Dispatch `topic.detail.lab.type === "amplifier-speaker"` to the new lab.
- Modify `src/App.tsx`
  - Import `AmplifierSpeakerLab`.
  - Add `amplifierSpeakerLab` to `activeView`.
  - Render the lab and pass the new opener to `TopicDetails`.
- Create `src/components/AmplifierSpeakerLab.tsx`
  - Owns diagram mode, amplifier class, effect mode, effect strength, info popup, and Web Audio playback lifecycle.
  - Renders signal chain, SVG diagrams, mode controls, effect cards, slider, play/stop button, and effect details.
- Modify `src/styles.css`
  - Add styles for `.amp-lab-*` classes, preserving the existing lab visual language.
- Modify `src/App.test.tsx`
  - Add tests for topic detail content, lab routing, diagram modes, effect explainers, and audio cleanup.

## Task 1: Expand Knowledge Content

**Files:**
- Modify: `src/content/knowledge.ts`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing topic-detail test**

Add this test near the existing hardware-card tests in `src/App.test.tsx`:

```tsx
it("expands amplifier speaker knowledge with detailed terms and a lab entry", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /功放与扬声器/ }));

  const details = screen.getByRole("dialog", { name: "主题详情" });
  expect(within(details).getByText(/功放负责把 DAC、Codec 或前级输出的小信号/)).toBeInTheDocument();
  expect(within(details).getByRole("heading", { name: "功放是什么" })).toBeInTheDocument();
  expect(within(details).getByRole("heading", { name: "Class A / AB / D" })).toBeInTheDocument();
  expect(within(details).getByRole("heading", { name: "动圈扬声器" })).toBeInTheDocument();
  expect(within(details).getByRole("heading", { name: "阻抗" })).toBeInTheDocument();
  expect(within(details).getByRole("heading", { name: "灵敏度" })).toBeInTheDocument();
  expect(within(details).getByRole("heading", { name: "分频器" })).toBeInTheDocument();
  expect(within(details).getByRole("button", { name: "打开功放与扬声器实验室" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "expands amplifier speaker knowledge"
```

Expected: FAIL because the new detailed headings and lab button are not present.

- [ ] **Step 3: Add the lab type**

In `src/content/knowledge.ts`, change `TopicLab.type` to include `amplifier-speaker`:

```ts
export type TopicLab = {
  type:
    | "sampling-quantization"
    | "listening-metrics"
    | "microphone"
    | "codec-hardware"
    | "digital-interface"
    | "amplifier-speaker";
  title: LocalizedText;
  description: LocalizedText;
  buttonLabel: LocalizedText;
};
```

- [ ] **Step 4: Replace the “功放与扬声器” detail block**

In `src/content/knowledge.ts`, keep the existing topic title/summary/bullets, then replace its `detail` object with this content:

```ts
detail: {
  explanation: {
    zh: "功放负责把 DAC、Codec 或前级输出的小信号变成能推动扬声器的电压、电流和功率；扬声器再把电能转换成振膜运动和空气声波。实际听感不是由某一个参数决定，而是由功放类型、输出能力、扬声器单元、箱体、分频、保护算法和声学结构共同决定。",
    en: "An amplifier turns the small signal from a DAC, codec, or preamp into voltage, current, and power that can drive a speaker. The speaker then turns electrical energy into diaphragm motion and air pressure. The listening result depends on amplifier class, output capability, driver design, enclosure, crossover, protection, and acoustics together."
  },
  keyConcepts: [
    { zh: "功放要提供足够电压摆幅和电流能力；电源电压、负载阻抗、散热和保护策略会限制最大输出。", en: "An amplifier needs enough voltage swing and current capability; supply voltage, load impedance, heat, and protection limit maximum output." },
    { zh: "Class A 线性好但效率低，Class AB 是传统折中方案，Class D 通过开关/PWM 工作，效率高但需要关注滤波、布局和 EMI。", en: "Class A is linear but inefficient, Class AB is a traditional compromise, and Class D uses switching/PWM for high efficiency while requiring care with filtering, layout, and EMI." },
    { zh: "扬声器的音圈在磁场中受力，推动振膜往复运动；行程、热容量和机械结构决定它能承受多大声压和低频。", en: "A speaker voice coil moves in a magnetic field and drives the diaphragm; excursion, thermal capacity, and mechanics determine sound pressure and bass limits." },
    { zh: "阻抗越低，同电压下电流越大，对功放输出级和散热要求越高。", en: "Lower impedance draws more current at the same voltage, increasing amplifier output-stage and thermal demands." },
    { zh: "灵敏度、功率、箱体和分频共同决定实际响度；瓦数更大不等于一定更响或更好听。", en: "Sensitivity, power, enclosure, and crossover jointly determine loudness; more watts do not guarantee louder or better sound." }
  ],
  termExplanations: [
    {
      name: { zh: "功放是什么", en: "What an amplifier does" },
      explanation: {
        zh: "功放把小信号变成可驱动负载的功率输出。它需要处理增益、电源电压、输出电流、效率、散热、削波和保护。",
        en: "An amplifier turns a small signal into power output for a load. It must handle gain, supply voltage, output current, efficiency, heat, clipping, and protection."
      }
    },
    {
      name: { zh: "Class A / AB / D", en: "Class A / AB / D" },
      explanation: {
        zh: "Class A 器件几乎一直导通，线性好但耗电；Class AB 让正负半周分担输出；Class D 把信号调制成高速开关脉冲，再由负载和滤波恢复为音频。",
        en: "Class A devices conduct most of the time, Class AB splits positive and negative halves, and Class D modulates audio into fast switching pulses before filtering through the load."
      }
    },
    {
      name: { zh: "动圈扬声器", en: "Moving-coil speaker" },
      explanation: {
        zh: "动圈单元由音圈、磁路、振膜、悬边和定心支片组成。音圈中的电流在磁场里产生力，带动振膜推动空气。",
        en: "A moving-coil driver has a voice coil, magnetic circuit, diaphragm, surround, and spider. Current in the coil creates force in the magnetic field and moves air."
      }
    },
    {
      name: { zh: "阻抗", en: "Impedance" },
      explanation: {
        zh: "阻抗不是固定电阻，而是随频率变化的交流负载。标称 4 Ω、8 Ω 只是参考值，真实曲线会影响功放电流和控制力。",
        en: "Impedance is a frequency-dependent AC load, not a fixed resistor. Nominal 4 ohm or 8 ohm values are references; the real curve affects current and control."
      }
    },
    {
      name: { zh: "灵敏度", en: "Sensitivity" },
      explanation: {
        zh: "灵敏度描述扬声器在给定输入下能产生多大声压。高灵敏度单元在同样功率下更容易响，但频响、失真和体积仍要一起看。",
        en: "Sensitivity describes sound pressure for a given input. Higher sensitivity gets louder with the same power, but frequency response, distortion, and size still matter."
      }
    },
    {
      name: { zh: "分频器", en: "Crossover" },
      explanation: {
        zh: "分频器把低频、中频和高频送给适合的单元。分频点、斜率、相位和单元摆位都会影响衔接和声像。",
        en: "A crossover sends bass, midrange, and treble to suitable drivers. Crossover point, slope, phase, and driver placement affect integration and imaging."
      }
    }
  ],
  lab: {
    type: "amplifier-speaker",
    title: { zh: "功放与扬声器实验室", en: "Amplifier and Speaker Lab" },
    description: {
      zh: "进入独立界面观察小信号、功放、分频/保护、扬声器单元和空气声波之间的关系，并试听削波、谐波失真、低频不足、箱体共振和动态保护。",
      en: "Open an independent lab to inspect the path from small signal to amplifier, crossover/protection, speaker driver, and air pressure, then audition clipping, harmonic distortion, bass loss, enclosure resonance, and limiting."
    },
    buttonLabel: { zh: "打开功放与扬声器实验室", en: "Open amplifier and speaker lab" }
  },
  misconception: {
    zh: "瓦数更大不等于一定更响或更好听；阻抗、灵敏度、箱体、失真、散热、保护和摆放都会影响最终声音。",
    en: "More watts do not guarantee louder or better sound; impedance, sensitivity, enclosure, distortion, heat, protection, and placement all shape the result."
  },
  contentDirection: {
    zh: "适合继续扩展为 Class D 工作原理图、扬声器结构动画、箱体/分频案例、小音箱保护算法和真实产品播放链路拆解。",
    en: "This can expand into Class D diagrams, speaker-structure animation, enclosure/crossover cases, small-speaker protection, and real product playback-chain breakdowns."
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run:

```bash
npm test -- --run src/App.test.tsx -t "expands amplifier speaker knowledge"
```

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

Use hunk staging if `src/App.test.tsx` already has unrelated edits:

```bash
git add -p src/App.test.tsx
git add src/content/knowledge.ts
git diff --cached --name-status
git commit -m "feat: 扩展功放与扬声器知识内容"
```

Expected staged files: only `src/App.test.tsx` and `src/content/knowledge.ts`.

## Task 2: Add Lab Routing and Shell

**Files:**
- Create: `src/components/AmplifierSpeakerLab.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/TopicDetails.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing routing test**

Add this test after the Task 1 test:

```tsx
it("opens the amplifier speaker lab from the hardware topic", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /功放与扬声器/ }));
  await user.click(
    within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
      name: "打开功放与扬声器实验室"
    })
  );

  expect(screen.getByRole("heading", { name: "功放与扬声器实验室" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "返回知识库" })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "功放与扬声器信号链" })).toBeInTheDocument();
  expect(screen.getByText("DAC / Codec 输出")).toBeInTheDocument();
  expect(screen.getByText("功放")).toBeInTheDocument();
  expect(screen.getByText("分频 / 保护")).toBeInTheDocument();
  expect(screen.getByText("扬声器单元")).toBeInTheDocument();
  expect(screen.getByText("空气声波")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "opens the amplifier speaker lab"
```

Expected: FAIL because the lab route and component do not exist.

- [ ] **Step 3: Create the lab shell**

Create `src/components/AmplifierSpeakerLab.tsx`:

```tsx
import type { Language } from "../content/knowledge";

type AmplifierSpeakerLabProps = {
  language: Language;
  onBack: () => void;
};

const chainLabels = {
  zh: ["DAC / Codec 输出", "功放", "分频 / 保护", "扬声器单元", "空气声波"],
  en: ["DAC / Codec out", "Amplifier", "Crossover / protection", "Speaker driver", "Air pressure"]
} satisfies Record<Language, string[]>;

export function AmplifierSpeakerLab({ language, onBack }: AmplifierSpeakerLabProps) {
  return (
    <main className="lab-page amp-lab">
      <section className="lab-hero">
        <button className="lab-back-button" type="button" onClick={onBack}>
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1>{language === "zh" ? "功放与扬声器实验室" : "Amplifier and Speaker Lab"}</h1>
          <p>
            {language === "zh"
              ? "观察小信号如何变成功率输出、振膜运动和空气声波，并试听常见功放与扬声器问题。"
              : "Inspect how a small signal becomes power output, diaphragm motion, and air pressure while auditioning common amplifier and speaker problems."}
          </p>
        </div>
      </section>

      <section className="amp-lab-chain" aria-label={language === "zh" ? "功放与扬声器信号链" : "Amplifier and speaker signal chain"}>
        {chainLabels[language].map((label, index) => (
          <div className="amp-chain-node" key={label}>
            <span>{label}</span>
            {index < chainLabels[language].length - 1 ? <strong aria-hidden="true">→</strong> : null}
          </div>
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Wire routing in `TopicDetails`**

In `src/components/TopicDetails.tsx`, add the prop:

```ts
onOpenAmplifierSpeakerLab: () => void;
```

Destructure it in `TopicDetails`, then add this branch before the fallback to `onOpenListeningMetricsLab()`:

```tsx
if (topic.detail.lab?.type === "amplifier-speaker") {
  onOpenAmplifierSpeakerLab();
  return;
}
```

- [ ] **Step 5: Wire routing in `App.tsx`**

Add import:

```ts
import { AmplifierSpeakerLab } from "./components/AmplifierSpeakerLab";
```

Add `"amplifierSpeakerLab"` to the `activeView` union:

```ts
| "amplifierSpeakerLab"
```

Add this render branch after the other lab branches:

```tsx
if (activeView === "amplifierSpeakerLab") {
  return (
    <div className="app-shell">
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
      />
      <AmplifierSpeakerLab language={language} onBack={() => setActiveView("knowledge")} />
      <footer className="site-footer">
        <span>{interfaceCopy.footer[language]}</span>
        <a href="docs/audio_technology_knowledge_outline.md">
          {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
        </a>
      </footer>
    </div>
  );
}
```

Pass the opener to `TopicDetails`:

```tsx
onOpenAmplifierSpeakerLab={() => {
  setSelectedTopic(null);
  setActiveView("amplifierSpeakerLab");
}}
```

- [ ] **Step 6: Run the routing test**

Run:

```bash
npm test -- --run src/App.test.tsx -t "opens the amplifier speaker lab"
```

Expected: PASS.

- [ ] **Step 7: Commit Task 2**

```bash
git add src/components/AmplifierSpeakerLab.tsx src/App.tsx src/components/TopicDetails.tsx
git add -p src/App.test.tsx
git diff --cached --name-status
git commit -m "feat: 新增功放与扬声器实验室入口"
```

Expected staged files: `src/components/AmplifierSpeakerLab.tsx`, `src/App.tsx`, `src/components/TopicDetails.tsx`, and only the routing-test hunk from `src/App.test.tsx`.

## Task 3: Add Diagram Modes and Amplifier Class Switching

**Files:**
- Modify: `src/components/AmplifierSpeakerLab.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing diagram-mode test**

Add this test after the routing test:

```tsx
it("switches amplifier speaker lab diagram modes and amplifier classes", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /功放与扬声器/ }));
  await user.click(within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", { name: "打开功放与扬声器实验室" }));

  expect(screen.getByRole("button", { name: "功放类型" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("img", { name: "Class D 功放图解" })).toBeInTheDocument();
  expect(screen.getByText("PWM 开关输出")).toBeInTheDocument();
  expect(screen.getByText("输出滤波 / 扬声器负载")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Class A" }));
  expect(screen.getByText("Class A：器件几乎一直导通，线性好但效率低")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Class AB" }));
  expect(screen.getByText("Class AB：正负半周分担输出，效率和失真折中")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "扬声器单元" }));
  expect(screen.getByRole("img", { name: "动圈扬声器结构图" })).toBeInTheDocument();
  expect(screen.getByText("音圈")).toBeInTheDocument();
  expect(screen.getByText("磁路")).toBeInTheDocument();
  expect(screen.getByText("振膜运动")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "箱体与分频" }));
  expect(screen.getByRole("img", { name: "箱体与分频图解" })).toBeInTheDocument();
  expect(screen.getByText("低音单元")).toBeInTheDocument();
  expect(screen.getByText("高音单元")).toBeInTheDocument();
  expect(screen.getByText("分频点")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "匹配关系" }));
  expect(screen.getByRole("img", { name: "功放扬声器匹配图" })).toBeInTheDocument();
  expect(screen.getByText("功率")).toBeInTheDocument();
  expect(screen.getByText("阻抗")).toBeInTheDocument();
  expect(screen.getByText("灵敏度")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "switches amplifier speaker lab diagram modes"
```

Expected: FAIL because mode controls and diagrams do not exist.

- [ ] **Step 3: Add state, labels, and mode controls**

In `src/components/AmplifierSpeakerLab.tsx`, add imports and types:

```tsx
import { useState } from "react";
import type { Language } from "../content/knowledge";

type DiagramMode = "amplifier" | "speaker" | "enclosure" | "matching";
type AmpClass = "class-a" | "class-ab" | "class-d";
```

Add localized control data:

```tsx
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
```

Inside the component, add:

```tsx
const [diagramMode, setDiagramMode] = useState<DiagramMode>("amplifier");
const [ampClass, setAmpClass] = useState<AmpClass>("class-d");
```

Render the mode buttons after the chain section:

```tsx
<section className="amp-lab-workbench" aria-label={language === "zh" ? "功放与扬声器实验台" : "Amplifier and speaker workbench"}>
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
      <div className="waveform-tabs amp-class-tabs" role="group" aria-label={language === "zh" ? "功放类型" : "Amplifier class"}>
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
```

- [ ] **Step 4: Add diagram renderers**

Add these helper functions above the component:

```tsx
function renderAmplifierDiagram(language: Language, ampClass: AmpClass) {
  const currentCopy = ampClasses.find((item) => item.id === ampClass)?.copy[language] ?? ampClasses[2].copy[language];
  return (
    <figure className="amp-diagram-figure">
      <svg aria-label={language === "zh" ? "Class D 功放图解" : "Class D amplifier diagram"} role="img" viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        <text className="lab-label" x="48" y="56">{language === "zh" ? "输入音频" : "Audio input"}</text>
        <path className="amp-wave-input" d="M 48 112 C 84 64 120 64 156 112 S 228 160 264 112 336 64 372 112" />
        <rect className="amp-block" height="80" rx="10" width="150" x="420" y="72" />
        <text className="interface-node-text" x="495" y="106">{ampClass === "class-d" ? "PWM" : ampClass === "class-ab" ? "AB" : "A"}</text>
        <text className="interface-node-sub" x="495" y="132">{language === "zh" ? "功率输出级" : "Power stage"}</text>
        <text className="lab-label" x="72" y="216">{language === "zh" ? "PWM 开关输出" : "PWM switching output"}</text>
        <path className="interface-clock-line" d="M 72 248 H 96 V 210 H 120 V 248 H 144 V 210 H 168 V 248 H 192 V 210 H 216 V 248 H 240 V 210 H 264 V 248" />
        <rect className="amp-block muted" height="76" rx="10" width="190" x="460" y="212" />
        <text className="interface-node-text" x="555" y="242">{language === "zh" ? "输出滤波 / 扬声器负载" : "Output filter / speaker load"}</text>
        <text className="interface-node-sub" x="555" y="270">{language === "zh" ? "恢复音频电流" : "Recover audio current"}</text>
      </svg>
      <figcaption>{currentCopy}</figcaption>
    </figure>
  );
}

function renderSpeakerDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg aria-label={language === "zh" ? "动圈扬声器结构图" : "Moving coil speaker diagram"} role="img" viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        <circle className="amp-magnet" cx="240" cy="178" r="72" />
        <rect className="amp-voice-coil" height="76" rx="12" width="88" x="286" y="140" />
        <path className="amp-cone" d="M 374 124 L 610 62 L 610 298 L 374 236 Z" />
        <path className="amp-air-wave" d="M 646 118 C 690 150 690 210 646 244" />
        <path className="amp-air-wave" d="M 676 92 C 736 140 736 220 676 270" />
        <text className="lab-chip" x="186" y="90">{language === "zh" ? "磁路" : "Magnet"}</text>
        <text className="lab-chip" x="286" y="122">{language === "zh" ? "音圈" : "Voice coil"}</text>
        <text className="lab-chip" x="446" y="78">{language === "zh" ? "振膜运动" : "Diaphragm motion"}</text>
        <text className="lab-chip" x="628" y="314">{language === "zh" ? "空气声波" : "Air pressure"}</text>
      </svg>
      <figcaption>{language === "zh" ? "电流经过音圈，在磁场中产生力，推动振膜往复运动。" : "Current through the voice coil creates force in the magnetic field and moves the diaphragm."}</figcaption>
    </figure>
  );
}

function renderEnclosureDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg aria-label={language === "zh" ? "箱体与分频图解" : "Enclosure and crossover diagram"} role="img" viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        <rect className="amp-speaker-box" height="220" rx="16" width="240" x="78" y="72" />
        <circle className="amp-driver-low" cx="198" cy="214" r="54" />
        <circle className="amp-driver-high" cx="198" cy="120" r="28" />
        <rect className="amp-block" height="86" rx="12" width="188" x="430" y="116" />
        <text className="interface-node-text" x="524" y="150">{language === "zh" ? "分频点" : "Crossover point"}</text>
        <text className="interface-node-sub" x="524" y="176">2.5 kHz</text>
        <text className="lab-chip" x="132" y="292">{language === "zh" ? "低音单元" : "Woofer"}</text>
        <text className="lab-chip" x="132" y="52">{language === "zh" ? "高音单元" : "Tweeter"}</text>
      </svg>
      <figcaption>{language === "zh" ? "箱体影响低频和共振，分频器把不同频段送给适合的单元。" : "The enclosure shapes bass and resonance; the crossover sends bands to suitable drivers."}</figcaption>
    </figure>
  );
}

function renderMatchingDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg aria-label={language === "zh" ? "功放扬声器匹配图" : "Amplifier speaker matching diagram"} role="img" viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
        <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
        {[
          { label: language === "zh" ? "功率" : "Power", x: 118, y: 104 },
          { label: language === "zh" ? "阻抗" : "Impedance", x: 382, y: 104 },
          { label: language === "zh" ? "灵敏度" : "Sensitivity", x: 250, y: 238 }
        ].map((node) => (
          <g key={node.label}>
            <circle className="amp-match-node" cx={node.x} cy={node.y} r="74" />
            <text className="interface-node-text" x={node.x} y={node.y + 6}>{node.label}</text>
          </g>
        ))}
        <path className="interface-flow-arrow" d="M 178 126 L 322 126" />
        <path className="interface-flow-arrow" d="M 358 164 L 292 216" />
        <path className="interface-flow-arrow" d="M 208 216 L 152 164" />
        <text className="lab-chip" x="462" y="260">{language === "zh" ? "保护限制最大输出" : "Protection limits maximum output"}</text>
      </svg>
      <figcaption>{language === "zh" ? "匹配关系决定响度、失真、热风险和保护动作。" : "Matching determines loudness, distortion, thermal risk, and protection behavior."}</figcaption>
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
```

- [ ] **Step 5: Run the diagram-mode test**

Run:

```bash
npm test -- --run src/App.test.tsx -t "switches amplifier speaker lab diagram modes"
```

Expected: PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add src/components/AmplifierSpeakerLab.tsx
git add -p src/App.test.tsx
git diff --cached --name-status
git commit -m "feat: 增加功放扬声器图解模式"
```

Expected staged files: `src/components/AmplifierSpeakerLab.tsx` and only the diagram-mode test hunk.

## Task 4: Add Effect Explainers and Web Audio Playback

**Files:**
- Modify: `src/components/AmplifierSpeakerLab.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing effect and audio-cleanup test**

Add this test after the diagram-mode test:

```tsx
it("plays amplifier speaker effects and stops the previous effect when switching", async () => {
  const createdOscillators: Array<{
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
    type: OscillatorType;
  }> = [];
  const audioContext = {
    currentTime: 0,
    destination: {},
    createOscillator: vi.fn(() => {
      const oscillator = {
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { setValueAtTime: vi.fn() },
        type: "sine" as OscillatorType
      };
      createdOscillators.push(oscillator);
      return oscillator;
    }),
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn()
      }
    })),
    createWaveShaper: vi.fn(() => ({
      connect: vi.fn(),
      curve: null as Float32Array | null,
      oversample: "none" as OverSampleType
    })),
    createBiquadFilter: vi.fn(() => ({
      connect: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      gain: { setValueAtTime: vi.fn() },
      Q: { setValueAtTime: vi.fn() },
      type: "lowpass" as BiquadFilterType
    })),
    createDynamicsCompressor: vi.fn(() => ({
      connect: vi.fn(),
      threshold: { setValueAtTime: vi.fn() },
      knee: { setValueAtTime: vi.fn() },
      ratio: { setValueAtTime: vi.fn() },
      attack: { setValueAtTime: vi.fn() },
      release: { setValueAtTime: vi.fn() }
    })),
    close: vi.fn()
  };
  Object.defineProperty(window, "AudioContext", {
    configurable: true,
    value: vi.fn(() => audioContext)
  });

  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /功放与扬声器/ }));
  await user.click(within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", { name: "打开功放与扬声器实验室" }));

  expect(screen.getByRole("button", { name: "削波失真" })).toHaveAttribute("aria-pressed", "true");
  await user.click(screen.getByRole("button", { name: "查看削波失真说明" }));
  expect(screen.getByRole("dialog", { name: "削波失真说明" })).toBeInTheDocument();
  expect(screen.getByText(/波形超过功放或数字链路允许范围/)).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "关闭说明" }));

  fireEvent.change(screen.getByRole("slider", { name: "效果强度" }), {
    target: { value: "82" }
  });
  await user.click(screen.getByRole("button", { name: "播放音效" }));
  expect(audioContext.createWaveShaper).toHaveBeenCalled();
  expect(createdOscillators[0]?.start).toHaveBeenCalledWith(0);
  expect(screen.getByText("播放中")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "谐波失真" }));
  expect(createdOscillators[0]?.stop).toHaveBeenCalled();
  expect(screen.getByText("已停止")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "箱体共振" }));
  await user.click(screen.getByRole("button", { name: "播放音效" }));
  expect(audioContext.createBiquadFilter).toHaveBeenCalled();

  await user.click(screen.getByRole("button", { name: "动态保护 / 限幅" }));
  await user.click(screen.getByRole("button", { name: "播放音效" }));
  expect(audioContext.createDynamicsCompressor).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "plays amplifier speaker effects"
```

Expected: FAIL because effect controls, popups, and audio playback do not exist.

- [ ] **Step 3: Add effect data and playback types**

In `src/components/AmplifierSpeakerLab.tsx`, update imports:

```tsx
import { useEffect, useRef, useState } from "react";
```

Add types:

```tsx
type EffectMode = "clipping" | "harmonics" | "bass-loss" | "cabinet-resonance" | "limiter";

type PlaybackHandle = {
  stop: () => void;
};
```

Add effect data:

```tsx
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
```

- [ ] **Step 4: Add playback helpers**

Add these functions above the component:

```tsx
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
  const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return AudioContextCtor ? new AudioContextCtor() : null;
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
        context.close();
      }
    };
  }

  outputGain.connect(context.destination);
  source.start(0);
  return {
    stop: () => {
      source.stop();
      context.close();
    }
  };
}
```

- [ ] **Step 5: Add component state and cleanup**

Inside `AmplifierSpeakerLab`, add:

```tsx
const [effectMode, setEffectMode] = useState<EffectMode>("clipping");
const [effectStrength, setEffectStrength] = useState(65);
const [activeInfo, setActiveInfo] = useState<EffectMode | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [audioUnsupported, setAudioUnsupported] = useState(false);
const playbackRef = useRef<PlaybackHandle | null>(null);

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
  setIsPlaying(true);
}

useEffect(() => {
  return () => {
    playbackRef.current?.stop();
    playbackRef.current = null;
  };
}, []);
```

- [ ] **Step 6: Render effects, slider, play button, and modal**

Add this section inside the workbench after the diagram panel:

```tsx
<aside className="amp-lab-effects" aria-label={language === "zh" ? "功放扬声器音效演示" : "Amplifier speaker effect demos"}>
  <h2>{language === "zh" ? "可听音效演示" : "Listening demos"}</h2>
  <div className="amp-effect-list">
    {effects.map((effect) => (
      <article className={effectMode === effect.id ? "amp-effect-card active" : "amp-effect-card"} key={effect.id}>
        <button
          aria-pressed={effectMode === effect.id}
          type="button"
          onClick={() => selectEffect(effect.id)}
        >
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
  <p className="amp-play-state">{isPlaying ? (language === "zh" ? "播放中" : "Playing") : language === "zh" ? "已停止" : "Stopped"}</p>
  {audioUnsupported ? <p className="lab-warning">{language === "zh" ? "当前浏览器不支持 Web Audio，仍可查看图解。" : "This browser does not support Web Audio; diagrams are still available."}</p> : null}
</aside>
```

Add the modal after the workbench:

```tsx
{activeInfo ? (
  <div className="effect-modal-layer">
    <section
      aria-label={`${effects.find((effect) => effect.id === activeInfo)?.label[language] ?? ""}${language === "zh" ? "说明" : " details"}`}
      aria-modal="true"
      className="effect-modal"
      role="dialog"
    >
      <h2>{effects.find((effect) => effect.id === activeInfo)?.label[language]}</h2>
      <p>{effects.find((effect) => effect.id === activeInfo)?.detail[language].cause}</p>
      <p>{effects.find((effect) => effect.id === activeInfo)?.detail[language].sound}</p>
      <p>{effects.find((effect) => effect.id === activeInfo)?.detail[language].fix}</p>
      <button type="button" onClick={() => setActiveInfo(null)}>
        {language === "zh" ? "关闭说明" : "Close details"}
      </button>
    </section>
  </div>
) : null}
```

- [ ] **Step 7: Run the effect test**

Run:

```bash
npm test -- --run src/App.test.tsx -t "plays amplifier speaker effects"
```

Expected: PASS.

- [ ] **Step 8: Commit Task 4**

```bash
git add src/components/AmplifierSpeakerLab.tsx
git add -p src/App.test.tsx
git diff --cached --name-status
git commit -m "feat: 增加功放扬声器音效演示"
```

Expected staged files: `src/components/AmplifierSpeakerLab.tsx` and only the effect-test hunk.

## Task 5: Add Styling and Responsive Layout

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add lab styles**

Append these styles to `src/styles.css`, grouped near other lab styles if possible:

```css
.amp-lab {
  display: grid;
  gap: 24px;
}

.amp-lab-chain {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  padding: 16px;
  border: 1px solid rgba(220, 236, 232, 0.14);
  border-radius: 14px;
  background: rgba(8, 20, 30, 0.72);
}

.amp-chain-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 58px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(126, 231, 216, 0.08);
  color: #eaf7f4;
  font-weight: 700;
}

.amp-chain-node strong {
  color: #f0b46a;
}

.amp-lab-workbench {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  gap: 18px;
  align-items: start;
}

.amp-lab-panel,
.amp-lab-effects {
  border: 1px solid rgba(220, 236, 232, 0.14);
  border-radius: 14px;
  background: rgba(8, 20, 30, 0.78);
  padding: 18px;
}

.amp-class-tabs {
  margin-top: 10px;
}

.amp-diagram-figure {
  margin: 16px 0 0;
}

.amp-diagram-figure svg {
  width: 100%;
  height: auto;
  display: block;
}

.amp-diagram-figure figcaption {
  margin-top: 10px;
  color: #b7c9c5;
}

.amp-block,
.amp-speaker-box {
  fill: rgba(126, 231, 216, 0.12);
  stroke: rgba(126, 231, 216, 0.48);
}

.amp-block.muted {
  fill: rgba(240, 180, 106, 0.12);
  stroke: rgba(240, 180, 106, 0.5);
}

.amp-wave-input,
.amp-air-wave {
  fill: none;
  stroke: #7ee7d8;
  stroke-width: 4;
  stroke-linecap: round;
}

.amp-magnet,
.amp-match-node {
  fill: rgba(240, 180, 106, 0.12);
  stroke: rgba(240, 180, 106, 0.56);
  stroke-width: 3;
}

.amp-voice-coil {
  fill: rgba(126, 231, 216, 0.18);
  stroke: rgba(126, 231, 216, 0.7);
}

.amp-cone {
  fill: rgba(220, 236, 232, 0.12);
  stroke: rgba(220, 236, 232, 0.58);
  stroke-width: 3;
}

.amp-driver-low,
.amp-driver-high {
  fill: rgba(126, 231, 216, 0.16);
  stroke: rgba(126, 231, 216, 0.58);
  stroke-width: 3;
}

.amp-effect-list {
  display: grid;
  gap: 10px;
}

.amp-effect-card {
  border: 1px solid rgba(220, 236, 232, 0.12);
  border-radius: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.035);
}

.amp-effect-card.active {
  border-color: rgba(240, 180, 106, 0.7);
  background: rgba(240, 180, 106, 0.1);
}

.amp-effect-card button {
  color: #f4fbf9;
}

.amp-info-button {
  margin-top: 8px;
  font-size: 0.88rem;
}

.amp-play-state {
  margin: 8px 0 0;
  color: #b7c9c5;
}

.effect-modal-layer {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(2, 8, 12, 0.72);
}

.effect-modal {
  width: min(560px, 100%);
  border: 1px solid rgba(220, 236, 232, 0.16);
  border-radius: 14px;
  padding: 22px;
  background: #10202b;
  color: #eaf7f4;
}

@media (max-width: 840px) {
  .amp-lab-chain,
  .amp-lab-workbench {
    grid-template-columns: 1fr;
  }

  .amp-chain-node {
    justify-content: flex-start;
  }

  .amp-chain-node strong {
    transform: rotate(90deg);
  }
}
```

- [ ] **Step 2: Run style and build checks**

Run:

```bash
git diff --check
npm run build
```

Expected: both commands pass.

- [ ] **Step 3: Commit Task 5**

Because `src/styles.css` already contains unrelated uncommitted changes, use interactive staging:

```bash
git add -p src/styles.css
git diff --cached --name-status
git commit -m "style: 优化功放扬声器实验室布局"
```

Expected staged file: `src/styles.css` with only `.amp-*` and `.effect-modal*` styles from this task.

## Task 6: Full Verification

**Files:**
- Test: `src/App.test.tsx`
- Build output only, no source edits expected.

- [ ] **Step 1: Run the full app test suite**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: TypeScript build and Vite build both pass.

- [ ] **Step 3: Run whitespace check**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 4: Inspect git status**

Run:

```bash
git status --short
```

Expected: only known unrelated pre-existing changes remain. The task-related files should either be committed or clean.

## Self-Review Checklist

- Spec coverage: Task 1 covers card content; Task 2 covers lab entry and route; Task 3 covers visual diagram modes; Task 4 covers five audio effects, popups, and playback cleanup; Task 5 covers layout; Task 6 covers tests and build.
- Type consistency: `TopicLab.type` uses `"amplifier-speaker"`, `activeView` uses `"amplifierSpeakerLab"`, component name is `AmplifierSpeakerLab`.
- Audio cleanup: effect switching calls `stopPlayback()` before changing effect state, and unmount cleanup stops any current playback handle.
- Worktree safety: all commits use path-specific or hunk-specific staging because several files already have unrelated uncommitted changes.
