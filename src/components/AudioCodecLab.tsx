import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type AudioCodecLabProps = {
  language: Language;
  onBack: () => void;
};

type ScenarioId = "music" | "video" | "speech" | "meeting" | "bluetooth" | "lowLatency";

type CodecRow = {
  name: string;
  family: Record<Language, string>;
  bitrate: Record<Language, string>;
  latency: Record<Language, string>;
  principle: Record<Language, string>;
  example: Record<Language, string>;
  scenario: Record<Language, string>;
};

const encodeSteps = [
  { title: { zh: "PCM 输入", en: "PCM input" }, detail: { zh: "系统或文件中的原始样本", en: "raw samples from system or file" } },
  { title: { zh: "分帧", en: "Framing" }, detail: { zh: "按固定时长切块", en: "split into time blocks" } },
  { title: { zh: "分析 / 建模", en: "Analysis / model" }, detail: { zh: "预测、频域或听觉模型", en: "prediction, transform, or hearing model" } },
  { title: { zh: "量化 / 码率控制", en: "Quantize / rate control" }, detail: { zh: "按目标质量分配比特", en: "allocate bits for target quality" } },
  { title: { zh: "码流 / 封装", en: "Bitstream / package" }, detail: { zh: "写入文件或网络包", en: "write file or network packets" } }
] satisfies Array<{ title: Record<Language, string>; detail: Record<Language, string> }>;

const decodeSteps = [
  { title: { zh: "码流 / 文件 / 网络包", en: "Bitstream / file / packet" }, detail: { zh: "来自存储、流媒体或蓝牙", en: "from storage, streaming, or Bluetooth" } },
  { title: { zh: "解包 / 纠错", en: "Unpack / repair" }, detail: { zh: "取出帧、时间戳和冗余", en: "read frames, timestamps, redundancy" } },
  { title: { zh: "反量化 / 合成", en: "Inverse quantize / synthesize" }, detail: { zh: "还原频域或语音模型参数", en: "restore transform or speech parameters" } },
  { title: { zh: "PCM 输出", en: "PCM output" }, detail: { zh: "恢复为系统可播放样本", en: "samples ready for the system" } },
  { title: { zh: "播放 / 后处理", en: "Playback / post-process" }, detail: { zh: "混音、音效、DAC 或蓝牙输出", en: "mix, effects, DAC, or Bluetooth out" } }
] satisfies Array<{ title: Record<Language, string>; detail: Record<Language, string> }>;

const codecRows = [
  {
    name: "PCM",
    family: { zh: "不压缩基准", en: "Uncompressed baseline" },
    bitrate: { zh: "约 1411 kbps / CD 双声道", en: "about 1411 kbps / CD stereo" },
    latency: { zh: "极低", en: "Very low" },
    principle: { zh: "通俗理解：像把原始录音直接逐点记下来，不猜、不省、不压缩。", en: "Plainly: it writes down the original audio point by point, without guessing, skipping, or compressing." },
    example: { zh: "例子：48 kHz / 16-bit / 双声道 PCM 每秒固定约 1536 kbps，安静片段和复杂音乐一样大。", en: "Example: 48 kHz / 16-bit / stereo PCM is always about 1536 kbps, whether the audio is silence or dense music." },
    scenario: { zh: "编辑、系统内部、短素材", en: "editing, system internals, short assets" }
  },
  {
    name: "FLAC",
    family: { zh: "无损压缩", en: "Lossless compression" },
    bitrate: { zh: "约为 PCM 的 40%-70%", en: "about 40%-70% of PCM" },
    latency: { zh: "低到中", en: "Low to medium" },
    principle: { zh: "通俗理解：先找波形里的重复规律，再把规律写短；解码后每个采样点还能还原回来。", en: "Plainly: it finds repeated patterns in the waveform and writes them shorter; every sample can be restored exactly." },
    example: { zh: "例子：FLAC 像把重复规律写成公式，连续安静、稳定音符和相似片段会比 PCM 小很多。", en: "Example: FLAC is like writing repeated patterns as formulas, so silence, steady notes, and similar passages become much smaller than PCM." },
    scenario: { zh: "音乐归档、母带备份", en: "music archive, master backup" }
  },
  {
    name: "MP3",
    family: { zh: "有损音乐", en: "Lossy music" },
    bitrate: { zh: "常见 128-320 kbps", en: "often 128-320 kbps" },
    latency: { zh: "中", en: "Medium" },
    principle: { zh: "通俗理解：先把声音拆成很多频率小格子，再把人耳不敏感、被大声音盖住的细节少记或不记。", en: "Plainly: it splits sound into frequency bins, then spends fewer bits on details that are masked or hard to hear." },
    example: { zh: "例子：16 kHz 采样率的 PCM 最高只到 8 kHz。MP3 不会固定砍掉某个频率，但低码率时会优先弱化接近 8 kHz、能量弱、被人声或乐器盖住的细节。", en: "Example: 16 kHz PCM only reaches 8 kHz. MP3 does not cut a fixed frequency, but at low bitrate it may weaken details near 8 kHz when they are quiet or masked by voice or instruments." },
    scenario: { zh: "兼容性优先的音乐文件", en: "music files where compatibility matters" }
  },
  {
    name: "AAC",
    family: { zh: "有损音乐 / 视频", en: "Lossy music / video" },
    bitrate: { zh: "常见 96-256 kbps", en: "often 96-256 kbps" },
    latency: { zh: "中", en: "Medium" },
    principle: { zh: "通俗理解：和 MP3 一样会按听感取舍，但工具更细，能用更少码率保留更多细节。", en: "Plainly: like MP3, it makes hearing-based trade-offs, but with finer tools that preserve more detail at lower bitrate." },
    example: { zh: "例子：同样 128 kbps，AAC 通常比 MP3 更容易保住鼓镲、空气感和视频里的背景音乐。", en: "Example: at the same 128 kbps, AAC often keeps cymbals, air, and video background music cleaner than MP3." },
    scenario: { zh: "在线视频、手机音乐、蓝牙 AAC", en: "online video, phone music, Bluetooth AAC" }
  },
  {
    name: "Opus",
    family: { zh: "实时语音 / 音乐", en: "Real-time speech / music" },
    bitrate: { zh: "约 16-256 kbps", en: "about 16-256 kbps" },
    latency: { zh: "低", en: "Low" },
    principle: { zh: "通俗理解：会判断当前更像语音还是音乐，并尽量用很短的等待时间完成压缩。", en: "Plainly: it can treat content more like speech or music while keeping the wait time short." },
    example: { zh: "例子：Opus 在网络变差时可以降低码率，先保证人声不断，再牺牲一点音乐细节。", en: "Example: Opus can lower bitrate when the network gets worse, keeping speech continuous before preserving music detail." },
    scenario: { zh: "语音会议、直播互动、游戏语音", en: "meetings, interactive streaming, game chat" }
  },
  {
    name: "AMR",
    family: { zh: "语音专用", en: "Speech specific" },
    bitrate: { zh: "约 4.75-23.85 kbps", en: "about 4.75-23.85 kbps" },
    latency: { zh: "低到中", en: "Low to medium" },
    principle: { zh: "通俗理解：不试图完整保存声音，而是保存“这句话怎么发出来”的人声参数。", en: "Plainly: it does not preserve the whole sound; it stores speech parameters describing how the voice was produced." },
    example: { zh: "例子：AMR 可以用很低码率让电话里的人声还听得懂，但音乐会明显变窄、变薄。", en: "Example: AMR can keep phone speech understandable at very low bitrate, but music becomes narrow and thin." },
    scenario: { zh: "蜂窝语音、窄带或宽带通话", en: "cellular voice, narrowband or wideband calls" }
  },
  {
    name: "LC3",
    family: { zh: "低功耗蓝牙 / 通信", en: "LE Audio / communication" },
    bitrate: { zh: "约 16-345 kbps", en: "about 16-345 kbps" },
    latency: { zh: "低", en: "Low" },
    principle: { zh: "通俗理解：为新一代低功耗蓝牙设计，在省电、稳定和音质之间找平衡。", en: "Plainly: it is designed for modern low-power Bluetooth, balancing battery, stability, and quality." },
    example: { zh: "例子：LC3 可以在较低码率下维持通话清晰度，适合耳机、助听器和广播音频。", en: "Example: LC3 can keep calls clear at lower bitrate, fitting earbuds, hearing aids, and broadcast audio." },
    scenario: { zh: "蓝牙 LE 耳机、助听、广播音频", en: "LE headsets, hearing aids, broadcast audio" }
  },
  {
    name: "SBC",
    family: { zh: "蓝牙基础", en: "Bluetooth baseline" },
    bitrate: { zh: "常见 192-345 kbps", en: "often 192-345 kbps" },
    latency: { zh: "中到高", en: "Medium to high" },
    principle: { zh: "通俗理解：把声音分成几个粗频段，再给每段分配比特；做法稳妥但不算特别省。", en: "Plainly: it splits sound into coarse bands and assigns bits to each; reliable but not especially efficient." },
    example: { zh: "例子：SBC 像蓝牙耳机的保底方案，两端大多能用，但同码率下细节通常不如 AAC、LDAC 或 LC3。", en: "Example: SBC is the fallback for Bluetooth headsets: widely usable, but usually less detailed than AAC, LDAC, or LC3 at similar bitrate." },
    scenario: { zh: "A2DP 默认兼容模式", en: "default compatible A2DP mode" }
  },
  {
    name: "aptX",
    family: { zh: "蓝牙有损", en: "Bluetooth lossy" },
    bitrate: { zh: "约 352-420 kbps", en: "about 352-420 kbps" },
    latency: { zh: "中，低延迟版本更低", en: "Medium, lower with low-latency variants" },
    principle: { zh: "通俗理解：不直接记完整波形，而是记相邻采样之间怎么变，计算量相对可控。", en: "Plainly: it stores how samples change from one to the next rather than storing the full waveform directly." },
    example: { zh: "例子：aptX 需要手机和耳机都支持；如果任一端不支持，通常会退回 SBC 或其他公共格式。", en: "Example: aptX needs support on both phone and headset; otherwise it usually falls back to SBC or another common format." },
    scenario: { zh: "兼容设备间的蓝牙音乐", en: "Bluetooth music between compatible devices" }
  },
  {
    name: "LDAC",
    family: { zh: "高码率蓝牙", en: "High-bitrate Bluetooth" },
    bitrate: { zh: "330 / 660 / 990 kbps", en: "330 / 660 / 990 kbps" },
    latency: { zh: "中到高", en: "Medium to high" },
    principle: { zh: "通俗理解：尽量给蓝牙音频更大的数据通道，让压缩少一点，但无线条件要跟得上。", en: "Plainly: it gives Bluetooth audio a larger data pipe so compression can be gentler, but the radio link must keep up." },
    example: { zh: "例子：LDAC 990 kbps 更像走更宽的无线通道，近距离稳定时细节更多，干扰大时可能切到 660 或 330 kbps。", en: "Example: LDAC 990 kbps is like using a wider wireless lane; it can keep more detail nearby, but may drop to 660 or 330 kbps under interference." },
    scenario: { zh: "稳定近距离的高码率蓝牙听音", en: "stable close-range high-bitrate Bluetooth listening" }
  }
] satisfies CodecRow[];

const scenarios = {
  music: {
    label: { zh: "音乐存储", en: "Music storage" },
    summary: { zh: "音乐存储：优先考虑音质、文件大小和长期兼容。", en: "Music storage: prioritize quality, file size, and long-term compatibility." },
    recommendation: { zh: "推荐：FLAC / AAC / MP3", en: "Recommended: FLAC / AAC / MP3" },
    metrics: [
      { zh: "无损归档选 FLAC；日常分发常用 AAC 或 MP3。", en: "Use FLAC for lossless archive; AAC or MP3 for everyday delivery." },
      { zh: "码率越高不一定线性提升听感，内容和编码器实现同样重要。", en: "Higher bitrate does not linearly improve listening quality; content and encoder quality matter." }
    ]
  },
  video: {
    label: { zh: "在线视频", en: "Online video" },
    summary: { zh: "在线视频：关注音画同步、平台兼容和自适应码率。", en: "Online video: focus on AV sync, platform support, and adaptive bitrate." },
    recommendation: { zh: "推荐：AAC / Opus", en: "Recommended: AAC / Opus" },
    metrics: [
      { zh: "容器、时间戳和播放器缓冲会影响音画同步。", en: "Container timestamps and player buffering affect AV sync." },
      { zh: "直播更看重端到端延迟，点播更看重质量和兼容性。", en: "Live streaming values latency; on-demand values quality and compatibility." }
    ]
  },
  speech: {
    label: { zh: "语音通话", en: "Voice call" },
    summary: { zh: "语音通话：清晰度、抗丢包和低码率更关键。", en: "Voice call: intelligibility, packet-loss robustness, and low bitrate matter most." },
    recommendation: { zh: "推荐：Opus / AMR / LC3", en: "Recommended: Opus / AMR / LC3" },
    metrics: [
      { zh: "语音 Codec 会优先保留人声可懂度，而不是音乐细节。", en: "Speech codecs preserve intelligibility before musical detail." },
      { zh: "网络抖动、丢包隐藏和回声处理常比纯码率更影响体验。", en: "Jitter, packet-loss concealment, and echo handling often matter more than bitrate alone." }
    ]
  },
  meeting: {
    label: { zh: "会议", en: "Meeting" },
    summary: { zh: "会议：要在多人语音、弱网和设备切换中保持稳定。", en: "Meeting: stay stable across multi-speaker voice, weak networks, and device changes." },
    recommendation: { zh: "推荐：Opus / LC3", en: "Recommended: Opus / LC3" },
    metrics: [
      { zh: "会议链路通常还会叠加降噪、回声消除、自动增益和混音。", en: "Meeting paths usually add noise suppression, echo cancellation, AGC, and mixing." },
      { zh: "可变码率和抗丢包能力比极高保真更重要。", en: "Variable bitrate and packet-loss resilience matter more than maximum fidelity." }
    ]
  },
  bluetooth: {
    label: { zh: "蓝牙耳机", en: "Bluetooth headset" },
    summary: { zh: "蓝牙耳机：无线稳定性、功耗、延迟和设备兼容一起决定体验。", en: "Bluetooth headset: radio stability, power, latency, and compatibility decide the experience." },
    recommendation: { zh: "推荐：SBC / AAC / aptX / LDAC / LC3", en: "Recommended: SBC / AAC / aptX / LDAC / LC3" },
    metrics: [
      { zh: "LDAC 高码率需要稳定无线环境；SBC 兼容性强但效率较普通。", en: "LDAC high bitrate needs stable radio; SBC is compatible but less efficient." },
      { zh: "LE Audio 的 LC3 更重视低功耗、多设备和广播音频。", en: "LC3 in LE Audio targets low power, multi-device use, and broadcast audio." }
    ]
  },
  lowLatency: {
    label: { zh: "低延迟互动", en: "Low-latency interaction" },
    summary: { zh: "低延迟互动：帧长、缓冲、网络和解码等待都必须压低。", en: "Low-latency interaction: frame size, buffering, network, and decode wait must stay low." },
    recommendation: { zh: "推荐：Opus / LC3 / 低延迟专用链路", en: "Recommended: Opus / LC3 / dedicated low-latency paths" },
    metrics: [
      { zh: "游戏语音、实时合奏和监听返送对 100 ms 以内体验更敏感。", en: "Game chat, live jamming, and monitoring are sensitive to sub-100 ms experiences." },
      { zh: "过度追求压缩率会增加算法等待和错误恢复成本。", en: "Chasing compression ratio can increase algorithmic wait and recovery cost." }
    ]
  }
} satisfies Record<
  ScenarioId,
  {
    label: Record<Language, string>;
    summary: Record<Language, string>;
    recommendation: Record<Language, string>;
    metrics: Array<Record<Language, string>>;
  }
>;

const scenarioOrder = Object.keys(scenarios) as ScenarioId[];

const metricCards = [
  { title: { zh: "码率", en: "Bitrate" }, body: { zh: "每秒码流大小，影响文件体积、带宽和压缩余量。", en: "Bitstream size per second; affects file size, bandwidth, and compression headroom." } },
  { title: { zh: "压缩比", en: "Compression ratio" }, body: { zh: "编码后大小相对 PCM 的缩小程度，通常要和音质一起看。", en: "How much smaller the encoded stream is than PCM; must be judged with quality." } },
  { title: { zh: "延迟", en: "Latency" }, body: { zh: "包含分帧等待、编码、传输缓冲、解码和播放缓冲。", en: "Includes framing wait, encode, transport buffer, decode, and playback buffer." } },
  { title: { zh: "抗丢包", en: "Packet-loss resilience" }, body: { zh: "实时通信会用冗余、PLC 和自适应码率降低断续感。", en: "Real-time communication uses redundancy, PLC, and adaptive bitrate to reduce dropouts." } }
] satisfies Array<{ title: Record<Language, string>; body: Record<Language, string> }>;

function CodecFlowChart({
  label,
  language,
  steps,
  tone,
  title
}: {
  label: Record<Language, string>;
  language: Language;
  steps: Array<{ title: Record<Language, string>; detail: Record<Language, string> }>;
  tone: "encode" | "decode";
  title: Record<Language, string>;
}) {
  return (
    <svg
      aria-label={label[language]}
      className={`audio-codec-flow-chart ${tone}`}
      role="img"
      viewBox="0 0 960 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={`audioCodecArrow-${tone}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="260" rx="14" width="960" />
      <text className="lab-label" x="44" y="42">{title[language]}</text>
      {steps.map((step, index) => {
        const x = 42 + index * 176;
        return (
          <g key={step.title.en}>
            <rect className="audio-codec-pipeline-node" height="88" rx="10" width="136" x={x} y="86" />
            <text className="audio-codec-node-title" x={x + 68} y="119">{step.title[language]}</text>
            <text className="audio-codec-node-detail" x={x + 68} y="148">{step.detail[language]}</text>
            {index < steps.length - 1 ? <path className="audio-codec-pipeline-arrow" d={`M ${x + 142} 130 L ${x + 170} 130`} /> : null}
          </g>
        );
      })}
      <path className="audio-codec-bitrate-line" d="M 72 212 C 260 198 414 198 548 212 S 746 228 888 204" />
    </svg>
  );
}

export function AudioCodecLab({ language, onBack }: AudioCodecLabProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("music");
  const scenario = scenarios[activeScenario];

  return (
    <main className="codec-lab-page audio-codec-lab-page">
      <section className="sound-lab-hero" aria-labelledby="audio-codec-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "软件实验" : "Software lab"}</span>
          <h1 id="audio-codec-lab-title">{language === "zh" ? "音频编解码实验室" : "Audio Codec Lab"}</h1>
          <p>
            {language === "zh"
              ? "观察 PCM 如何被分帧、压缩成码流、传输或封装，并在播放端解码回 PCM。这里讨论的是 MP3、AAC、Opus、LC3、SBC 等压缩算法，不是硬件 Codec 芯片。"
              : "See how PCM is framed, compressed into a bitstream, transported or packaged, then decoded back to PCM. This lab covers compression algorithms such as MP3, AAC, Opus, LC3, and SBC, not hardware codec chips."}
          </p>
        </div>
      </section>

      <section className="audio-codec-workbench" aria-label={language === "zh" ? "音频编解码实验台" : "Audio codec workbench"}>
        <section className="audio-codec-visual" aria-label={language === "zh" ? "音频编码和解码流程图" : "Audio encoding and decoding flow charts"}>
          <div className="digital-lab-status">
            <strong>{language === "zh" ? "编码和解码是两个方向" : "Encoding and decoding are two directions"}</strong>
            <span>{language === "zh" ? "上行压缩，下行还原为 PCM" : "Compress on one side, reconstruct PCM on the other"}</span>
          </div>
          <div className="audio-codec-flow-grid stacked">
            <CodecFlowChart
              label={{ zh: "音频编码流程图", en: "Audio encoding flow chart" }}
              language={language}
              steps={encodeSteps}
              title={{ zh: "编码：PCM 变成更小的码流", en: "Encoding: PCM becomes a smaller bitstream" }}
              tone="encode"
            />
            <CodecFlowChart
              label={{ zh: "音频解码流程图", en: "Audio decoding flow chart" }}
              language={language}
              steps={decodeSteps}
              title={{ zh: "解码：码流还原为可播放 PCM", en: "Decoding: bitstream returns to playable PCM" }}
              tone="decode"
            />
          </div>
        </section>

        <section className="codec-mode-concepts audio-codec-metrics" aria-label={language === "zh" ? "编解码关键指标" : "Codec key metrics"}>
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "关键指标" : "Key metrics"}</strong>
            <span>{language === "zh" ? "不要只看码率" : "Do not only compare bitrate"}</span>
          </div>
          <div className="codec-concept-grid">
            {metricCards.map((metric) => (
              <article key={metric.title.en}>
                <h2>{metric.title[language]}</h2>
                <p>{metric.body[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="audio-codec-scenarios" aria-label={language === "zh" ? "音频编解码应用场景" : "Audio codec use cases"}>
        <div className="codec-mode-concepts-header">
          <h2>{language === "zh" ? "应用场景" : "Use cases"}</h2>
          <span>{language === "zh" ? "先看用途，再选 Codec" : "Start with the use case, then pick a codec"}</span>
        </div>
        <div className="waveform-tabs audio-codec-scenario-tabs" role="group" aria-label={language === "zh" ? "应用场景" : "Use cases"}>
          {scenarioOrder.map((id) => (
            <button
              aria-pressed={activeScenario === id}
              className={activeScenario === id ? "waveform-tab active" : "waveform-tab"}
              key={id}
              type="button"
              onClick={() => setActiveScenario(id)}
            >
              {scenarios[id].label[language]}
            </button>
          ))}
        </div>
        <div className="audio-codec-scenario-card">
          <div className="lab-live-note audio-codec-scenario-note">
            <strong>{scenario.summary[language]}</strong>
            <span>{scenario.recommendation[language]}</span>
          </div>
          <div className="audio-codec-scenario-points">
            {scenario.metrics.map((metric) => (
              <p key={metric.en}>{metric[language]}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="audio-codec-comparison" aria-label={language === "zh" ? "音频编码格式对比" : "Audio codec comparison"}>
        <div className="codec-mode-concepts-header">
          <h2>{language === "zh" ? "格式对比" : "Codec comparison"}</h2>
          <span>{language === "zh" ? "按用途理解，而不是按名字背诵" : "Understand by use case, not by name alone"}</span>
        </div>
        <div className="audio-codec-table">
          {codecRows.map((row) => (
            <article key={row.name}>
              <div className="audio-codec-table-head">
                <h2>{row.name}</h2>
                <span>{row.family[language]}</span>
              </div>
              <dl>
                <div>
                  <dt>{language === "zh" ? "码率 / 压缩" : "Bitrate / compression"}</dt>
                  <dd>{row.bitrate[language]}</dd>
                </div>
                <div>
                  <dt>{language === "zh" ? "延迟" : "Latency"}</dt>
                  <dd>{row.latency[language]}</dd>
                </div>
                <div>
                  <dt>{language === "zh" ? "通俗原理" : "Plain principle"}</dt>
                  <dd>{row.principle[language]}</dd>
                </div>
                <div>
                  <dt>{language === "zh" ? "简单例子" : "Simple example"}</dt>
                  <dd>{row.example[language]}</dd>
                </div>
                <div>
                  <dt>{language === "zh" ? "适合场景" : "Best fit"}</dt>
                  <dd>{row.scenario[language]}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
