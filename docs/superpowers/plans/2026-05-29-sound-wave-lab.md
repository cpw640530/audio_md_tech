# Sound Wave Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an independent sound waveform lab view that lets readers adjust waveform type, frequency, amplitude, and phase without being constrained by the topic details modal.

**Architecture:** Keep the app as a single React page with an internal `activeView` state. Add a focused `SoundWaveLab` component for visualization and audio playback, and turn the sound topic details diagram area into an entry point that opens the lab.

**Tech Stack:** React 18, TypeScript, Web Audio API, SVG visualization, Testing Library/Vitest.

---

### Task 1: Add Lab Navigation Flow

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/TopicDetails.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing navigation test**

Add this test to `src/App.test.tsx`:

```tsx
it("opens the independent sound wave lab from the sound details panel", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /什么是声音/ }));
  const details = screen.getByRole("dialog", { name: "主题详情" });

  await user.click(within(details).getByRole("button", { name: "打开声音波形实验室" }));

  expect(screen.queryByRole("dialog", { name: "主题详情" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "声音波形实验室" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "返回知识库" }));

  expect(screen.getByRole("heading", { name: "音频技术知识库" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx -t "opens the independent sound wave lab"`

Expected: FAIL because the lab entry button and lab heading do not exist yet.

- [ ] **Step 3: Implement minimal navigation hooks**

In `src/App.tsx`, add an internal view state:

```tsx
const [activeView, setActiveView] = useState<"knowledge" | "soundLab">("knowledge");
```

Pass an `onOpenSoundLab` callback into `TopicDetails`:

```tsx
onOpenSoundLab={() => {
  setSelectedTopicId(null);
  setActiveView("soundLab");
}}
```

Render a temporary lab placeholder when `activeView === "soundLab"`:

```tsx
if (activeView === "soundLab") {
  return (
    <div className="app-shell">
      <main className="sound-lab-page">
        <button type="button" onClick={() => setActiveView("knowledge")}>
          返回知识库
        </button>
        <h1>声音波形实验室</h1>
      </main>
    </div>
  );
}
```

In `src/components/TopicDetails.tsx`, add `onOpenSoundLab` to props and render the button only for the sound-wave diagram:

```tsx
type TopicDetailsProps = {
  language: Language;
  topic: DisplayTopic;
  onClose: () => void;
  onOpenSoundLab: () => void;
};
```

```tsx
<button className="diagram-open-button" type="button" onClick={onOpenSoundLab}>
  {language === "zh" ? "打开声音波形实验室" : "Open sound wave lab"}
</button>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx -t "opens the independent sound wave lab"`

Expected: PASS.

### Task 2: Build SoundWaveLab Component

**Files:**
- Create: `src/components/SoundWaveLab.tsx`
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing interaction test**

Add this test to `src/App.test.tsx`:

```tsx
it("lets readers adjust parameters in the independent sound wave lab", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /什么是声音/ }));
  await user.click(
    within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
      name: "打开声音波形实验室"
    })
  );

  expect(screen.getByRole("img", { name: "当前声音波形图" })).toBeInTheDocument();
  expect(screen.getByText(/y\(t\) = 0.60 · sin\(2π · 440t \+ 0.00π\)/)).toBeInTheDocument();

  fireEvent.change(screen.getByRole("slider", { name: "频率" }), {
    target: { value: "880" }
  });
  fireEvent.change(screen.getByRole("slider", { name: "振幅" }), {
    target: { value: "0.8" }
  });
  fireEvent.change(screen.getByRole("slider", { name: "相位" }), {
    target: { value: "0.5" }
  });

  expect(screen.getByText(/y\(t\) = 0.80 · sin\(2π · 880t \+ 0.50π\)/)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "三角波" }));

  expect(screen.getByText("当前波形：三角波")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx -t "lets readers adjust parameters in the independent sound wave lab"`

Expected: FAIL because the full lab component is not implemented.

- [ ] **Step 3: Implement component**

Create `src/components/SoundWaveLab.tsx` with:

```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Pause, Play } from "lucide-react";
import type { Language } from "../content/knowledge";

type WaveformType = "sine" | "square" | "triangle";

type SoundWaveLabProps = {
  language: Language;
  onBack: () => void;
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const waveformLabels: Record<WaveformType, Record<Language, string>> = {
  sine: { zh: "正弦波", en: "Sine wave" },
  square: { zh: "方波", en: "Square wave" },
  triangle: { zh: "三角波", en: "Triangle wave" }
};

function createLabWavePath(type: WaveformType, amplitude: number, frequency: number, phase: number) {
  const width = 680;
  const midY = 160;
  const drawAmplitude = amplitude * 110;
  const cycles = frequency / 220;
  const phaseRadians = phase * Math.PI;

  const points = Array.from({ length: 220 }, (_, index) => {
    const ratio = index / 219;
    const angle = ratio * Math.PI * 2 * cycles + phaseRadians;
    const x = 40 + ratio * width;
    let value = Math.sin(angle);

    if (type === "square") {
      value = value >= 0 ? 1 : -1;
    }

    if (type === "triangle") {
      value = (2 / Math.PI) * Math.asin(Math.sin(angle));
    }

    const y = midY - value * drawAmplitude;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
}

export function SoundWaveLab({ language, onBack }: SoundWaveLabProps) {
  const [waveform, setWaveform] = useState<WaveformType>("sine");
  const [amplitude, setAmplitude] = useState(0.6);
  const [frequency, setFrequency] = useState(440);
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const path = useMemo(
    () => createLabWavePath(waveform, amplitude, frequency, phase),
    [amplitude, frequency, phase, waveform]
  );

  const formula = `y(t) = ${amplitude.toFixed(2)} · sin(2π · ${frequency}t + ${phase.toFixed(2)}π)`;

  function stopAudio() {
    if (!audioRef.current) {
      setIsPlaying(false);
      return;
    }

    try {
      audioRef.current.oscillator.stop();
    } catch {
      // Oscillator may already be stopped.
    }

    void audioRef.current.context.close();
    audioRef.current = null;
    setIsPlaying(false);
  }

  function playAudio() {
    stopAudio();
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(amplitude * 0.14, context.currentTime);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    audioRef.current = { context, oscillator, gain };
    setIsPlaying(true);
  }

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.oscillator.type = waveform;
    audioRef.current.oscillator.frequency.setValueAtTime(
      frequency,
      audioRef.current.context.currentTime
    );
    audioRef.current.gain.gain.setValueAtTime(
      amplitude * 0.14,
      audioRef.current.context.currentTime
    );
  }, [amplitude, frequency, waveform]);

  useEffect(() => stopAudio, []);

  const currentWaveLabel = waveformLabels[waveform][language];

  return (
    <main className="sound-lab-page">
      <section className="sound-lab-hero" aria-labelledby="sound-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">
            {language === "zh" ? "交互实验" : "Interactive lab"}
          </span>
          <h1 id="sound-lab-title">{language === "zh" ? "声音波形实验室" : "Sound Wave Lab"}</h1>
          <p>
            {language === "zh"
              ? "调节频率、振幅和相位，观察公式、图形和听感如何一起变化。"
              : "Adjust frequency, amplitude, and phase to see how formula, shape, and hearing change together."}
          </p>
        </div>
      </section>

      <section className="sound-lab-workbench" aria-label={language === "zh" ? "声音波形实验台" : "Sound waveform workbench"}>
        <div className="sound-lab-visual">
          <div className="sound-lab-formula">
            <strong>{language === "zh" ? "当前波形：" : "Current waveform: "}{currentWaveLabel}</strong>
            <code>{formula}</code>
          </div>
          <svg aria-label={language === "zh" ? "当前声音波形图" : "Current sound waveform"} role="img" viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="labWaveLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7ee7d8" />
                <stop offset="100%" stopColor="#f0b46a" />
              </linearGradient>
            </defs>
            <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
            <line className="lab-axis" x1="40" x2="720" y1="160" y2="160" />
            <line className="lab-axis faint" x1="40" x2="720" y1="50" y2="50" />
            <line className="lab-axis faint" x1="40" x2="720" y1="270" y2="270" />
            <path className="lab-wave-path" d={path} />
            <line className="lab-measure" x1="112" x2="112" y1={(160 - amplitude * 110).toFixed(2)} y2="160" />
            <text className="lab-label" x="126" y="112">{language === "zh" ? "A 振幅" : "A amplitude"}</text>
            <line className="lab-measure" x1="140" x2={(140 + 680 / (frequency / 220)).toFixed(2)} y1="300" y2="300" />
            <text className="lab-label" x="148" y="324">{language === "zh" ? "一个周期 / 波长" : "One cycle / wavelength"}</text>
            <text className="lab-chip" x="520" y="66">{`f = ${frequency} Hz`}</text>
            <text className="lab-chip" x="520" y="98">{`φ = ${phase.toFixed(2)}π`}</text>
            <text className="lab-chip" x="520" y="130">{`A = ${amplitude.toFixed(2)}`}</text>
          </svg>
        </div>

        <div className="sound-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "波形类型" : "Waveform type"}>
            {(Object.keys(waveformLabels) as WaveformType[]).map((type) => (
              <button
                className={waveform === type ? "waveform-tab active" : "waveform-tab"}
                key={type}
                type="button"
                onClick={() => setWaveform(type)}
              >
                {waveformLabels[type][language]}
              </button>
            ))}
          </div>

          <div className="sound-lab-actions">
            <button className="sine-button" type="button" onClick={playAudio}>
              <Play size={16} aria-hidden="true" />
              {language === "zh" ? "播放" : "Play"}
            </button>
            <button className="sine-button" type="button" onClick={stopAudio}>
              <Pause size={16} aria-hidden="true" />
              {language === "zh" ? "停止" : "Stop"}
            </button>
            <span className={isPlaying ? "sine-status playing" : "sine-status"}>
              {isPlaying ? (language === "zh" ? "播放中" : "Playing") : language === "zh" ? "未播放" : "Stopped"}
            </span>
          </div>

          <div className="lab-sliders">
            <label>
              <span>{language === "zh" ? "频率" : "Frequency"}<strong>{frequency} Hz</strong></span>
              <input aria-label={language === "zh" ? "频率" : "Frequency"} max="880" min="110" step="10" type="range" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} />
            </label>
            <label>
              <span>{language === "zh" ? "振幅" : "Amplitude"}<strong>{amplitude.toFixed(2)}</strong></span>
              <input aria-label={language === "zh" ? "振幅" : "Amplitude"} max="1" min="0.1" step="0.05" type="range" value={amplitude} onChange={(event) => setAmplitude(Number(event.target.value))} />
            </label>
            <label>
              <span>{language === "zh" ? "相位" : "Phase"}<strong>{phase.toFixed(2)}π</strong></span>
              <input aria-label={language === "zh" ? "相位" : "Phase"} max="2" min="-2" step="0.05" type="range" value={phase} onChange={(event) => setPhase(Number(event.target.value))} />
            </label>
          </div>

          <div className="lab-live-note">
            {language === "zh"
              ? `频率越高，单位时间内周期越多，听起来音调越高。振幅为 ${amplitude.toFixed(2)}，图中的波峰和波谷距离中心线更明显。`
              : `Higher frequency creates more cycles per second and sounds higher. Amplitude is ${amplitude.toFixed(2)}, which changes the distance from the center line.`}
          </div>
        </div>
      </section>

      <section className="lab-concepts" aria-label={language === "zh" ? "关键概念" : "Key concepts"}>
        <article><h2>{language === "zh" ? "频率" : "Frequency"}</h2><p>{language === "zh" ? "每秒振动次数，单位是 Hz，主要决定音高。" : "Vibrations per second in Hz, mainly perceived as pitch."}</p></article>
        <article><h2>{language === "zh" ? "振幅" : "Amplitude"}</h2><p>{language === "zh" ? "声压变化幅度，主要影响响度。" : "The strength of pressure change, mainly perceived as loudness."}</p></article>
        <article><h2>{language === "zh" ? "相位" : "Phase"}</h2><p>{language === "zh" ? "波形在时间轴上的起始位置，影响多个波叠加时的结果。" : "The starting offset on the time axis, important when waves combine."}</p></article>
        <article><h2>{language === "zh" ? "波长" : "Wavelength"}</h2><p>{language === "zh" ? "一个完整周期对应的空间长度，同一介质中频率越高波长越短。" : "The spatial length of one cycle; in the same medium, higher frequency means shorter wavelength."}</p></article>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Wire component into App**

Replace the temporary placeholder with:

```tsx
<SoundWaveLab language={language} onBack={() => setActiveView("knowledge")} />
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx -t "lets readers adjust parameters in the independent sound wave lab"`

Expected: PASS.

### Task 3: Style the Lab and Simplify Modal Diagram

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/TopicDetails.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write failing content expectations**

Update the existing sound diagram test so it expects the modal to show the lab entry and still show the key concept headings:

```tsx
expect(within(details).getByRole("button", { name: "打开声音波形实验室" })).toBeInTheDocument();
expect(within(details).getByText(/进入独立界面后，可以调节频率、振幅和相位/)).toBeInTheDocument();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx -t "explains sound topic bullets"`

Expected: FAIL until the modal diagram copy is updated.

- [ ] **Step 3: Replace modal interactive diagram with entry card**

In `TopicDetails.tsx`, keep `SoundWaveDiagram` only as a compact static/entry component or replace its controls with:

```tsx
<div className="sound-lab-entry">
  <div>
    <strong>{language === "zh" ? "交互式正弦波图解" : "Interactive sine wave diagram"}</strong>
    <p>
      {language === "zh"
        ? "进入独立界面后，可以调节频率、振幅和相位，观察波形和听感如何变化。"
        : "Open the lab to adjust frequency, amplitude, and phase while watching the waveform and sound change."}
    </p>
  </div>
  <button className="diagram-open-button" type="button" onClick={onOpenSoundLab}>
    {language === "zh" ? "打开声音波形实验室" : "Open sound wave lab"}
  </button>
</div>
```

Ensure the details modal no longer contains crowded sliders for the sound diagram.

- [ ] **Step 4: Add CSS**

Add focused CSS for:

```css
.sound-lab-page
.sound-lab-hero
.sound-lab-back
.sound-lab-workbench
.sound-lab-visual
.sound-lab-formula
.sound-lab-panel
.waveform-tabs
.waveform-tab
.sound-lab-actions
.lab-sliders
.lab-live-note
.lab-concepts
.sound-lab-entry
.diagram-open-button
```

Use responsive grid layout with one column under `900px`. Keep SVG width stable with `max-width: 100%` and avoid `overflow: hidden` around the diagram.

- [ ] **Step 5: Run relevant tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

### Task 4: Full Verification

**Files:**
- No new files.

- [ ] **Step 1: Run full test suite**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Start dev server for preview**

Run: `npm run dev -- --host 0.0.0.0 --port 5173`

Expected: Vite serves the app; if port 5173 is busy, use the next free port shown by Vite.
