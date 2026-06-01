import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type DigitalInterfaceLabProps = {
  language: Language;
  onBack: () => void;
};

type InterfaceProtocol = "i2s" | "tdm" | "pdm" | "spdif" | "usb";

const protocolLabels: Record<InterfaceProtocol, Record<Language, string>> = {
  i2s: { zh: "I2S", en: "I2S" },
  tdm: { zh: "TDM", en: "TDM" },
  pdm: { zh: "PDM", en: "PDM" },
  spdif: { zh: "SPDIF", en: "SPDIF" },
  usb: { zh: "USB Audio", en: "USB Audio" }
};

const protocolCopy: Record<
  InterfaceProtocol,
  {
    title: Record<Language, string>;
    body: Record<Language, string>;
    keyPoints: Array<Record<Language, string>>;
  }
> = {
  i2s: {
    title: { zh: "协议：I2S / IIS / I²S", en: "Protocol: I2S / IIS / I²S" },
    body: {
      zh: "I2S 用 BCLK 移动每一位数据，用 LRCLK 标记左右声道，SD 线上按固定对齐方式传 PCM 样本。MCLK 常作为 Codec 或 DAC 内部 PLL 的参考时钟。",
      en: "I2S uses BCLK to shift each data bit, LRCLK to mark left and right channels, and SD to carry PCM words with fixed alignment. MCLK is often the reference for a codec or DAC PLL."
    },
    keyPoints: [
      { zh: "BCLK = 采样率 × 位深 × 声道数。", en: "BCLK = sample rate × bit depth × channel count." },
      { zh: "LRCLK 的频率就是音频采样率。", en: "LRCLK frequency equals the audio sample rate." },
      { zh: "左右对齐、标准 I2S 和 DSP 模式不能混用。", en: "Left-justified, standard I2S, and DSP modes cannot be mixed casually." }
    ]
  },
  tdm: {
    title: { zh: "协议：TDM 多通道时分复用", en: "Protocol: TDM multichannel time division" },
    body: {
      zh: "TDM 把多个声道放进一帧里的多个 slot。它仍然依赖 BCLK 和帧同步，但每个声道只占自己的时隙，常用于多麦阵列、会议设备、车载和多通道 Codec。",
      en: "TDM packs multiple channels into slots within one frame. It still depends on BCLK and frame sync, but each channel owns a slot. It is common in mic arrays, conferencing devices, automotive systems, and multichannel codecs."
    },
    keyPoints: [
      { zh: "slot 数、slot 宽度和声道顺序必须两端一致。", en: "Slot count, slot width, and channel order must match at both ends." },
      { zh: "TDM 可以用一条 SD 数据线承载 4、8 或更多声道。", en: "TDM can carry 4, 8, or more channels on one SD line." },
      { zh: "帧同步极性或延迟错一位会导致声道错位。", en: "Wrong frame-sync polarity or one-bit delay can shift channels." }
    ]
  },
  pdm: {
    title: { zh: "协议：PDM 数字麦克风", en: "Protocol: PDM digital microphone" },
    body: {
      zh: "PDM 不是多 bit PCM，而是 1-bit 高速脉冲密度流。脉冲越密代表瞬时幅度越高，主控或 Codec 需要用抽取滤波把它变成普通 PCM。",
      en: "PDM is not multibit PCM. It is a high-speed 1-bit pulse-density stream. Denser pulses mean higher instantaneous amplitude, and a host or codec decimates it into regular PCM."
    },
    keyPoints: [
      { zh: "常见于数字 MEMS 麦克风。", en: "Common in digital MEMS microphones." },
      { zh: "需要 PDM 时钟、数据线和抽取滤波器。", en: "Needs a PDM clock, data line, and decimation filter." },
      { zh: "左右声道常通过时钟边沿或选择脚区分。", en: "Left and right channels are often separated by clock edge or a select pin." }
    ]
  },
  spdif: {
    title: { zh: "协议：SPDIF 设备间数字音频", en: "Protocol: SPDIF device-to-device audio" },
    body: {
      zh: "SPDIF 常走同轴或光纤，在一根链路里同时携带音频数据和时钟信息。它适合播放器、电视、功放、声卡之间连接，不适合作为芯片内部短距离总线。",
      en: "SPDIF often runs over coaxial or optical links and carries both audio data and clock information on one connection. It fits players, TVs, amplifiers, and audio interfaces rather than short internal chip buses."
    },
    keyPoints: [
      { zh: "嵌入式时钟 + 双相标记编码。", en: "Embedded clock plus biphase mark coding." },
      { zh: "常传立体声 PCM，也可承载压缩环绕声码流。", en: "Often carries stereo PCM and can carry compressed surround bitstreams." },
      { zh: "接收端需要从数据流中恢复时钟。", en: "The receiver recovers clock from the data stream." }
    ]
  },
  usb: {
    title: { zh: "协议：USB Audio 外设音频", en: "Protocol: USB Audio peripheral audio" },
    body: {
      zh: "USB Audio 是外设级协议，不是简单的几根时钟线。音频样本被装进 USB 等时包，主机和设备通过缓冲、反馈端点和描述符协商采样率、通道和格式。",
      en: "USB Audio is a peripheral-level protocol, not a few clock wires. Audio samples are packed into USB isochronous packets, while host and device coordinate sample rate, channels, and format through buffers, feedback endpoints, and descriptors."
    },
    keyPoints: [
      { zh: "音频样本被装入 USB 等时包。", en: "Audio samples are packed into USB isochronous packets." },
      { zh: "主机 / 设备用缓冲和反馈端点校准速率。", en: "Host and device use buffering and feedback endpoints to align rates." },
      { zh: "常见于 USB 声卡、耳机、麦克风和录音接口。", en: "Common in USB sound cards, headsets, microphones, and recording interfaces." }
    ]
  }
};

const protocolOverviews: Array<{
  protocol: InterfaceProtocol;
  title: Record<Language, string>;
  wires: Record<Language, string>;
  signals: Record<Language, string>;
  carries: Record<Language, string>;
}> = [
  {
    protocol: "i2s",
    title: { zh: "I2S / IIS / I²S", en: "I2S / IIS / I²S" },
    wires: { zh: "常见 3-4 根信号线", en: "Usually 3-4 signal lines" },
    signals: {
      zh: "BCLK 位时钟、LRCLK 左右声道时钟、SD 数据线、可选 MCLK 主时钟",
      en: "BCLK bit clock, LRCLK left/right clock, SD data, optional MCLK master clock"
    },
    carries: {
      zh: "主要传双声道 PCM，常见于主控、Codec、DAC、ADC 和数字功放之间。",
      en: "Mainly carries stereo PCM between hosts, codecs, DACs, ADCs, and digital amplifiers."
    }
  },
  {
    protocol: "tdm",
    title: { zh: "TDM", en: "TDM" },
    wires: { zh: "常见 3-4 根信号线", en: "Usually 3-4 signal lines" },
    signals: {
      zh: "BCLK 位时钟、FS 帧同步、SD 数据线、可选 MCLK 主时钟",
      en: "BCLK bit clock, FS frame sync, SD data, optional MCLK master clock"
    },
    carries: {
      zh: "一帧里放多个 slot，适合 4 路、8 路或更多多通道音频。",
      en: "Packs multiple slots in one frame, useful for 4, 8, or more audio channels."
    }
  },
  {
    protocol: "pdm",
    title: { zh: "PDM", en: "PDM" },
    wires: { zh: "常见 2-3 根信号线", en: "Usually 2-3 signal lines" },
    signals: {
      zh: "CLK 时钟、DATA 1-bit 数据、可选左右声道选择脚",
      en: "CLK clock, DATA 1-bit data, optional left/right select pin"
    },
    carries: {
      zh: "数字 MEMS 麦常用的 1-bit 脉冲密度流，后端要抽取滤波成 PCM。",
      en: "A 1-bit pulse-density stream common in digital MEMS microphones, later decimated to PCM."
    }
  },
  {
    protocol: "spdif",
    title: { zh: "SPDIF", en: "SPDIF" },
    wires: { zh: "常见 1 根同轴或 1 路光纤", en: "Usually one coaxial line or one optical link" },
    signals: {
      zh: "数据和时钟嵌在同一条链路里，接收端恢复时钟",
      en: "Data and clock are embedded on one link; the receiver recovers the clock"
    },
    carries: {
      zh: "设备之间传立体声 PCM 或压缩环绕声码流，不是芯片内部常用总线。",
      en: "Carries stereo PCM or compressed surround streams between devices, not a common internal chip bus."
    }
  },
  {
    protocol: "usb",
    title: { zh: "USB Audio", en: "USB Audio" },
    wires: { zh: "常见 USB D+ / D- 差分线加电源地", en: "Usually USB D+ / D- differential pair plus power and ground" },
    signals: {
      zh: "USB 包、端点、描述符、反馈端点和缓冲机制",
      en: "USB packets, endpoints, descriptors, feedback endpoints, and buffering"
    },
    carries: {
      zh: "电脑、手机、声卡、耳机之间传音频包，不是简单的同步时钟线接口。",
      en: "Carries audio packets between computers, phones, interfaces, and headsets, not a simple synchronous clock-line interface."
    }
  }
];

function formatMhz(value: number) {
  return value.toFixed(3);
}

function createSquareWavePath({
  height,
  pulses,
  width,
  x,
  y
}: {
  height: number;
  pulses: number;
  width: number;
  x: number;
  y: number;
}) {
  const step = width / (pulses * 2);
  const commands = [`M ${x} ${y}`];

  Array.from({ length: pulses * 2 }, (_, index) => {
    const nextX = x + (index + 1) * step;
    const nextY = index % 2 === 0 ? y - height : y;
    commands.push(`V ${nextY.toFixed(2)}`);
    commands.push(`H ${nextX.toFixed(2)}`);
  });

  return commands.join(" ");
}

function createPdmBits() {
  return "1011110111101110011110110011011011110010".split("");
}

function renderI2sDiagram(language: Language, bitDepth: number) {
  const bitCells = Array.from({ length: 16 }, (_, index) => index);

  return (
    <svg
      aria-label={language === "zh" ? "I2S 时序图" : "I2S timing diagram"}
      role="img"
      viewBox="0 0 760 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
      <text className="lab-label" x="42" y="44">BCLK</text>
      <text className="lab-label" x="42" y="116">LRCLK</text>
      <text className="lab-label" x="42" y="188">SD</text>
      <text className="lab-label" x="42" y="282">MCLK</text>
      <path className="interface-clock-line" d={createSquareWavePath({ height: 28, pulses: 24, width: 588, x: 124, y: 72 })} />
      <path className="interface-frame-line" d="M 124 132 H 418 V 104 H 712 V 132" />
      <path className="interface-clock-line faint" d={createSquareWavePath({ height: 18, pulses: 12, width: 588, x: 124, y: 298 })} />
      <g>
        {bitCells.map((cell) => {
          const x = 124 + cell * 36;
          const isRight = cell >= 8;
          return (
            <g key={cell}>
              <rect className={isRight ? "interface-bit-cell right" : "interface-bit-cell"} height="46" width="34" x={x} y="164" />
              <text className="interface-bit-text" x={x + 17} y="192">
                {cell % 8 === 0 ? "MSB" : cell % 8 === 7 ? "LSB" : bitDepth - (cell % 8) - 1}
              </text>
            </g>
          );
        })}
      </g>
      <text className="interface-channel-label" x="216" y="238">{language === "zh" ? "左声道样本" : "Left sample"}</text>
      <text className="interface-channel-label" x="506" y="238">{language === "zh" ? "右声道样本" : "Right sample"}</text>
      <text className="lab-chip" x="474" y="324">{language === "zh" ? "LRCLK 每翻转一次切换声道" : "LRCLK toggles between channels"}</text>
    </svg>
  );
}

function renderTdmDiagram(language: Language, channels: number) {
  const slots = Array.from({ length: channels }, (_, index) => index + 1);
  const slotWidth = 620 / channels;

  return (
    <svg
      aria-label={language === "zh" ? "TDM 时隙图" : "TDM slot diagram"}
      role="img"
      viewBox="0 0 760 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
      <text className="lab-label" x="48" y="54">{language === "zh" ? "一帧音频" : "One audio frame"}</text>
      <path className="interface-clock-line" d={createSquareWavePath({ height: 24, pulses: 32, width: 620, x: 70, y: 112 })} />
      <text className="lab-label" x="48" y="116">BCLK</text>
      <line className="interface-frame-marker" x1="70" x2="70" y1="142" y2="270" />
      <line className="interface-frame-marker" x1="690" x2="690" y1="142" y2="270" />
      <g>
        {slots.map((slot, index) => {
          const x = 70 + index * slotWidth;
          return (
            <g key={slot}>
              <rect className="interface-slot" height="78" width={slotWidth - 5} x={x} y="170" />
              <text className="interface-slot-label" x={x + slotWidth / 2 - 2.5} y="202">{`Slot ${slot}`}</text>
              <text className="interface-slot-sub" x={x + slotWidth / 2 - 2.5} y="226">{language === "zh" ? `CH${slot}` : `CH${slot}`}</text>
            </g>
          );
        })}
      </g>
      <text className="lab-chip" x="430" y="306">{language === "zh" ? `${channels} 个 slot 共用一条 SD 数据线` : `${channels} slots share one SD line`}</text>
    </svg>
  );
}

function renderPdmDiagram(language: Language) {
  const bits = createPdmBits();

  return (
    <svg
      aria-label={language === "zh" ? "PDM 到 PCM 转换图" : "PDM to PCM conversion diagram"}
      role="img"
      viewBox="0 0 760 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
      <text className="lab-label" x="48" y="54">{language === "zh" ? "数字 MEMS 麦" : "Digital MEMS mic"}</text>
      <g transform="translate(56 92)">
        {bits.map((bit, index) => (
          <rect
            className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"}
            height={bit === "1" ? 56 : 18}
            key={`${bit}-${index}`}
            width="8"
            x={index * 11}
            y={bit === "1" ? 0 : 38}
          />
        ))}
      </g>
      <path className="interface-flow-arrow" d="M 492 120 L 570 120" />
      <rect className="interface-node" height="86" rx="10" width="118" x="574" y="78" />
      <text className="interface-node-text" x="633" y="108">{language === "zh" ? "抽取滤波" : "Decimation"}</text>
      <text className="interface-node-sub" x="633" y="136">PDM → PCM</text>
      <path className="interface-pcm-wave" d="M 82 264 C 124 206 174 206 216 264 S 308 322 350 264 442 206 484 264 576 322 618 264" />
      <text className="lab-chip" x="56" y="202">{language === "zh" ? "1-bit 高速脉冲密度流" : "High-speed 1-bit pulse-density stream"}</text>
      <text className="lab-chip" x="430" y="304">{language === "zh" ? "抽取滤波后变成 PCM" : "Decimation turns it into PCM"}</text>
    </svg>
  );
}

function renderSpdifDiagram(language: Language) {
  return (
    <svg
      aria-label={language === "zh" ? "SPDIF 设备链路图" : "SPDIF device link diagram"}
      role="img"
      viewBox="0 0 760 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
      <rect className="interface-device-node" height="96" rx="12" width="150" x="68" y="128" />
      <text className="interface-node-text" x="143" y="164">{language === "zh" ? "播放器 / 电视" : "Player / TV"}</text>
      <text className="interface-node-sub" x="143" y="192">{language === "zh" ? "SPDIF 输出" : "SPDIF out"}</text>
      <rect className="interface-device-node" height="96" rx="12" width="150" x="542" y="128" />
      <text className="interface-node-text" x="617" y="164">{language === "zh" ? "功放 / 声卡" : "Amp / interface"}</text>
      <text className="interface-node-sub" x="617" y="192">{language === "zh" ? "时钟恢复" : "Clock recovery"}</text>
      <path className="interface-link-line" d="M 232 176 C 306 120 454 120 528 176" />
      <path className="interface-link-line alt" d="M 232 190 C 306 246 454 246 528 190" />
      <text className="lab-chip" x="274" y="94">{language === "zh" ? "同轴 / 光纤" : "Coaxial / optical"}</text>
      <text className="lab-chip" x="250" y="286">{language === "zh" ? "嵌入式时钟 + 双相标记编码" : "Embedded clock + biphase mark coding"}</text>
    </svg>
  );
}

function renderUsbDiagram(language: Language) {
  return (
    <svg
      aria-label={language === "zh" ? "USB Audio 包传输图" : "USB Audio packet transfer diagram"}
      role="img"
      viewBox="0 0 760 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
      <rect className="interface-device-node" height="102" rx="12" width="146" x="54" y="128" />
      <text className="interface-node-text" x="127" y="164">{language === "zh" ? "主机" : "Host"}</text>
      <text className="interface-node-sub" x="127" y="192">PC / Phone</text>
      <rect className="interface-device-node" height="102" rx="12" width="146" x="560" y="128" />
      <text className="interface-node-text" x="633" y="164">{language === "zh" ? "声卡 / 耳机" : "Interface / headset"}</text>
      <text className="interface-node-sub" x="633" y="192">USB Audio</text>
      {[0, 1, 2, 3].map((packet) => (
        <g key={packet}>
          <rect className="interface-usb-packet" height="50" rx="8" width="72" x={244 + packet * 78} y={142 + (packet % 2) * 48} />
          <text className="interface-slot-label" x={280 + packet * 78} y={172 + (packet % 2) * 48}>{`Pkt ${packet + 1}`}</text>
        </g>
      ))}
      <path className="interface-flow-arrow" d="M 206 178 L 236 178" />
      <path className="interface-flow-arrow" d="M 556 178 L 526 178" />
      <path className="interface-link-line alt" d="M 224 272 C 330 318 430 318 536 272" />
      <text className="lab-chip" x="246" y="84">{language === "zh" ? "音频样本被装入 USB 等时包" : "Audio samples are packed into USB isochronous packets"}</text>
      <text className="lab-chip" x="174" y="326">{language === "zh" ? "主机 / 设备用缓冲和反馈端点校准速率" : "Host/device align rates with buffers and feedback endpoints"}</text>
    </svg>
  );
}

function renderProtocolDiagram(protocol: InterfaceProtocol, language: Language, bitDepth: number, channels: number) {
  if (protocol === "tdm") {
    return renderTdmDiagram(language, channels);
  }

  if (protocol === "pdm") {
    return renderPdmDiagram(language);
  }

  if (protocol === "spdif") {
    return renderSpdifDiagram(language);
  }

  if (protocol === "usb") {
    return renderUsbDiagram(language);
  }

  return renderI2sDiagram(language, bitDepth);
}

export function DigitalInterfaceLab({ language, onBack }: DigitalInterfaceLabProps) {
  const [protocol, setProtocol] = useState<InterfaceProtocol>("i2s");
  const [sampleRate, setSampleRate] = useState(48);
  const [bitDepth, setBitDepth] = useState(24);
  const [channels, setChannels] = useState(2);

  const bclkMhz = useMemo(() => formatMhz((sampleRate * bitDepth * channels) / 1000), [bitDepth, channels, sampleRate]);
  const mclkMhz = useMemo(() => formatMhz((sampleRate * 256) / 1000), [sampleRate]);
  const activeCopy = protocolCopy[protocol];

  return (
    <main className="digital-interface-page">
      <section className="sound-lab-hero" aria-labelledby="digital-interface-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1 id="digital-interface-title">{language === "zh" ? "数字音频接口实验室" : "Digital Audio Interface Lab"}</h1>
          <p>
            {language === "zh"
              ? "切换常见数字音频接口，观察时钟线、数据线、帧同步、slot、PDM 抽取和 USB 包传输之间的区别。"
              : "Switch common digital audio interfaces and compare clocks, data lines, frame sync, slots, PDM decimation, and USB packet transport."}
          </p>
        </div>
      </section>

      <section className="interface-overview-section" aria-label={language === "zh" ? "接口速览" : "Interface overview"}>
        <div className="codec-mode-concepts-header">
          <strong>{language === "zh" ? "接口速览" : "Interface overview"}</strong>
          <span>{language === "zh" ? "先看线数和信号脚" : "Start with wires and pins"}</span>
        </div>
        <div className="interface-overview-grid">
          {protocolOverviews.map((item) => (
            <article className="interface-overview-card" key={item.protocol}>
              <h2>{`${item.title[language]}：${item.wires[language]}`}</h2>
              <strong>{item.signals[language]}</strong>
              <p>{item.carries[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="digital-interface-workbench" aria-label={language === "zh" ? "数字音频接口实验台" : "Digital audio interface workbench"}>
        <div className="digital-lab-visual">
          <div className="digital-lab-status">
            <strong>{activeCopy.title[language]}</strong>
            <span>
              {language === "zh"
                ? `BCLK = ${sampleRate} kHz × ${bitDepth} bit × ${channels} ch = ${bclkMhz} MHz`
                : `BCLK = ${sampleRate} kHz × ${bitDepth} bit × ${channels} ch = ${bclkMhz} MHz`}
            </span>
          </div>
          {renderProtocolDiagram(protocol, language, bitDepth, channels)}
        </div>

        <div className="digital-interface-panel">
          <div className="interface-tabs" role="group" aria-label={language === "zh" ? "接口协议" : "Interface protocol"}>
            {(Object.keys(protocolLabels) as InterfaceProtocol[]).map((item) => (
              <button
                className={protocol === item ? "waveform-tab active" : "waveform-tab"}
                key={item}
                type="button"
                onClick={() => setProtocol(item)}
              >
                {protocolLabels[item][language]}
              </button>
            ))}
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {language === "zh" ? "采样率" : "Sample rate"}
                <strong>{sampleRate} kHz</strong>
              </span>
              <input
                aria-label={language === "zh" ? "采样率" : "Sample rate"}
                max="96"
                min="16"
                step="8"
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
                max="32"
                min="16"
                step="8"
                type="range"
                value={bitDepth}
                onChange={(event) => setBitDepth(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "通道数" : "Channels"}
                <strong>{channels} ch</strong>
              </span>
              <input
                aria-label={language === "zh" ? "通道数" : "Channels"}
                max="8"
                min="2"
                step="2"
                type="range"
                value={channels}
                onChange={(event) => setChannels(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="digital-lab-metrics">
            <strong>{language === "zh" ? `BCLK ${bclkMhz} MHz` : `BCLK ${bclkMhz} MHz`}</strong>
            <strong>{language === "zh" ? `MCLK 常见 ${mclkMhz} MHz` : `Common MCLK ${mclkMhz} MHz`}</strong>
          </div>

          <div className="lab-live-note">
            <strong>{language === "zh" ? "协议说明" : "Protocol notes"}</strong>
            <span>{activeCopy.body[language]}</span>
          </div>
        </div>

        <section className="codec-mode-concepts" aria-label={language === "zh" ? "接口关键知识点" : "Interface key concepts"}>
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "当前协议关键点" : "Current protocol key points"}</strong>
            <span>{protocolLabels[protocol][language]}</span>
          </div>
          <div className="codec-concept-grid">
            {activeCopy.keyPoints.map((point, index) => (
              <article key={point.en}>
                <h2>{language === "zh" ? `关键点 ${index + 1}` : `Key point ${index + 1}`}</h2>
                <p>{point[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
