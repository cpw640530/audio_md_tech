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

function getI2sBitLabel(cell: number, bitDepth: number) {
  const position = cell % 8;

  if (position === 0) {
    return "MSB";
  }

  if (position === 3) {
    return "...";
  }

  if (position === 6) {
    return "b1";
  }

  if (position === 7) {
    return "LSB";
  }

  return `b${bitDepth - position - 1}`;
}

function renderI2sDiagram(language: Language, bitDepth: number, channels: number) {
  const bitCells = Array.from({ length: 16 }, (_, index) => index);
  const dataLines = Array.from({ length: Math.ceil(channels / 2) }, (_, index) => index);
  const isMultichannelI2s = channels > 2;
  const i2sDataStartY = 166;
  const i2sDataRowGap = 44;
  const i2sDataRowHeight = 34;
  const i2sLastDataRowY = i2sDataStartY + (dataLines.length - 1) * i2sDataRowGap;
  const i2sNotesY = i2sLastDataRowY + i2sDataRowHeight + 44;
  const i2sMclkLabelY = i2sNotesY + 94;
  const i2sMclkWaveY = i2sMclkLabelY + 16;
  const i2sMappingY = i2sMclkWaveY + 58;
  const i2sDiagramHeight = isMultichannelI2s ? i2sMappingY + 36 : 360;
  const leftFrameChannels = dataLines.map((line) => `CH${line * 2 + 1}`).join(" / ");
  const rightFrameChannels = dataLines.map((line) => `CH${line * 2 + 2}`).join(" / ");

  return (
    <svg
      aria-label={language === "zh" ? "I2S 时序图" : "I2S timing diagram"}
      role="img"
      viewBox={`0 0 760 ${i2sDiagramHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height={i2sDiagramHeight} rx="14" width="760" />
      <text className="lab-label" x="42" y="44">BCLK</text>
      <text className="lab-label" x="42" y="116">LRCLK</text>
      <text className="lab-label" x="42" y={isMultichannelI2s ? 150 : 188}>{isMultichannelI2s ? "SD 数据线" : "SD"}</text>
      <text className="lab-label" x="42" y={isMultichannelI2s ? i2sMclkLabelY : 282}>MCLK</text>
      <path className="interface-clock-line" d={createSquareWavePath({ height: 28, pulses: 24, width: 588, x: 124, y: 72 })} />
      <path className="interface-frame-line" d="M 124 132 H 418 V 104 H 712 V 132" />
      {isMultichannelI2s ? (
        <>
          <text className="interface-channel-label" x="266" y="152">{language === "zh" ? "L 半帧" : "L half-frame"}</text>
          <text className="interface-channel-label" x="560" y="152">{language === "zh" ? "R 半帧" : "R half-frame"}</text>
          <g>
            {dataLines.map((line) => {
              const y = i2sDataStartY + line * i2sDataRowGap;
              const leftChannel = line * 2 + 1;
              const rightChannel = line * 2 + 2;

              return (
                <g key={line}>
                  <text className="lab-label interface-i2s-line-label" x="86" y={y + 20}>{`SD${line}`}</text>
                  <rect className="interface-i2s-data-pair" height={i2sDataRowHeight} width="284" x="124" y={y} />
                  <rect className="interface-i2s-data-pair right" height={i2sDataRowHeight} width="284" x="418" y={y} />
                  <text className="interface-slot-label" x="266" y={y + 18}>{`CH${leftChannel}`}</text>
                  <text className="interface-slot-label" x="560" y={y + 18}>{`CH${rightChannel}`}</text>
                </g>
              );
            })}
          </g>
          <text className="interface-tdm-note" x="124" y={i2sNotesY}>
            {language === "zh"
              ? `多通道 I2S：${dataLines.length} 条 SD 数据线并行，每条 SD 仍传一对左右声道`
              : `Multichannel I2S: ${dataLines.length} parallel SD lines, each still carries one L/R pair`}
          </text>
          <text className="interface-tdm-note" x="124" y={i2sNotesY + 22}>
            {language === "zh"
              ? `左半帧同时采集 ${leftFrameChannels}`
              : `The left half-frame captures ${leftFrameChannels} at the same time`}
          </text>
          <text className="interface-tdm-note" x="430" y={i2sNotesY + 22}>
            {language === "zh"
              ? `右半帧同时采集 ${rightFrameChannels}`
              : `The right half-frame captures ${rightFrameChannels} at the same time`}
          </text>
          <text className="interface-tdm-note" x="124" y={i2sNotesY + 44}>
            {language === "zh" ? "LRCLK 仍只区分每条 SD 上的 L / R" : "LRCLK still only separates L / R on each SD line"}
          </text>
          <text className="interface-tdm-note" x="430" y={i2sNotesY + 44}>
            {language === "zh" ? "单条 SD 要放多路声道时，应看 TDM" : "Use TDM when one SD line must carry many channels"}
          </text>
          <path className="interface-clock-line faint" d={createSquareWavePath({ height: 18, pulses: 12, width: 588, x: 124, y: i2sMclkWaveY })} />
          <g>
            {dataLines.map((line) => {
              const leftChannel = line * 2 + 1;
              const rightChannel = line * 2 + 2;
              return (
                <text className="interface-channel-label" key={`map-${line}`} x={124 + line * 150} y={i2sMappingY}>
                  {`SD${line}: CH${leftChannel} / CH${rightChannel}`}
                </text>
              );
            })}
          </g>
        </>
      ) : (
        <>
          <path className="interface-clock-line faint" d={createSquareWavePath({ height: 18, pulses: 12, width: 588, x: 124, y: 298 })} />
          <g>
            {bitCells.map((cell) => {
              const x = 124 + cell * 36;
              const isRight = cell >= 8;
              return (
                <g key={cell}>
                  <rect className={isRight ? "interface-bit-cell right" : "interface-bit-cell"} height="46" width="34" x={x} y="164" />
                  <text className="interface-bit-text" x={x + 17} y="192">
                    {getI2sBitLabel(cell, bitDepth)}
                  </text>
                </g>
              );
            })}
          </g>
          <text className="interface-channel-label" x="216" y="238">{language === "zh" ? `L: bit${bitDepth - 1} → bit0` : `L: bit${bitDepth - 1} to bit0`}</text>
          <text className="interface-channel-label" x="506" y="238">{language === "zh" ? `R: bit${bitDepth - 1} → bit0` : `R: bit${bitDepth - 1} to bit0`}</text>
          <text className="lab-chip" x="474" y="324">{language === "zh" ? "LRCLK 每翻转一次切换声道" : "LRCLK toggles between channels"}</text>
        </>
      )}
    </svg>
  );
}

function renderTdmDiagram(language: Language, channels: number, bitDepth: number) {
  const slots = Array.from({ length: channels }, (_, index) => index + 1);
  const slotWidth = 620 / channels;
  const channelBoxWidth = 548 / channels;

  return (
    <svg
      aria-label={language === "zh" ? "TDM 时隙图" : "TDM slot diagram"}
      role="img"
      viewBox="0 0 760 430"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
      <text className="lab-label" x="48" y="42">{language === "zh" ? "时钟与帧同步" : "Clock and frame sync"}</text>
      <text className="lab-chip" x="424" y="42">
        {language === "zh" ? `一帧 = ${channels} 个 slot` : `One frame = ${channels} slots`}
      </text>
      <text className="lab-label" x="48" y="86">BCLK</text>
      <path className="interface-clock-line" d={createSquareWavePath({ height: 22, pulses: 32, width: 620, x: 70, y: 94 })} />
      <text className="lab-label" x="48" y="138">FS</text>
      <path className="interface-frame-line" d="M 70 142 V 116 H 132 V 142 H 690" />
      <text className="interface-tdm-note" x="352" y="134">
        {language === "zh" ? "FS 帧同步：新一帧从这里开始" : "FS frame sync: a new frame starts here"}
      </text>

      <line className="interface-frame-marker" x1="70" x2="70" y1="160" y2="292" />
      <line className="interface-frame-marker" x1="690" x2="690" y1="160" y2="292" />
      <text className="lab-label" x="48" y="184">SD</text>
      <g>
        {slots.map((slot, index) => {
          const x = 70 + index * slotWidth;
          return (
            <g key={slot}>
              <rect className="interface-slot" height="82" width={slotWidth - 5} x={x} y="202" />
              <text className="interface-slot-label" x={x + slotWidth / 2 - 2.5} y="224">{`Slot ${slot}`}</text>
              <text className="interface-slot-sub" x={x + slotWidth / 2 - 2.5} y="246">{language === "zh" ? `CH${slot}` : `CH${slot}`}</text>
              <text className="interface-slot-sub" x={x + slotWidth / 2 - 2.5} y="268">
                {slotWidth > 100 ? `bit${bitDepth - 1} → bit0` : "MSB→LSB"}
              </text>
            </g>
          );
        })}
      </g>
      <text className="interface-tdm-note" x="70" y="316">
        {language === "zh" ? "每个 slot 内仍按 MSB → LSB 传一个采样字" : "Each slot still sends one sample word from MSB to LSB"}
      </text>
      <text className="interface-tdm-note" x="430" y="316">
        {language === "zh" ? `${channels} 个 slot 共用一条 SD 数据线` : `${channels} slots share one SD line`}
      </text>
      <path className="interface-flow-arrow" d="M 380 324 L 380 346" />
      <text className="lab-label" x="48" y="364">
        {language === "zh" ? "SD 串行数据拆回多声道" : "Serial SD data is split back into channels"}
      </text>
      <g>
        {slots.map((slot, index) => {
          const x = 106 + index * channelBoxWidth;
          return (
            <g key={`channel-${slot}`}>
              <rect className="interface-tdm-channel" height="30" rx="6" width={channelBoxWidth - 8} x={x} y="376" />
              <text className="interface-slot-sub" x={x + channelBoxWidth / 2 - 4} y="391">{`CH${slot}`}</text>
            </g>
          );
        })}
      </g>
      <text className="interface-tdm-note" x="70" y="420">
        {language === "zh" ? "slot 宽度可以大于有效位深，多余 bit 通常补 0" : "Slot width can exceed valid bit depth; extra bits are usually padded with 0"}
      </text>
      <text className="interface-tdm-note" x="408" y="420">
        {language === "zh" ? "slot 顺序两端必须一致，否则 CH1/CH2 会错位" : "Slot order must match at both ends, or CH1/CH2 will shift"}
      </text>
    </svg>
  );
}

function renderPdmDiagram(language: Language) {
  const bits = createPdmBits();
  const bitPreview = bits.slice(0, 32);

  return (
    <svg
      aria-label={language === "zh" ? "PDM 到 PCM 转换图" : "PDM to PCM conversion diagram"}
      role="img"
      viewBox="0 0 760 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="500" rx="14" width="760" />
      <text className="lab-label" x="48" y="44">{language === "zh" ? "PDM 从哪里来" : "Where PDM comes from"}</text>
      <path className="interface-pcm-wave" d="M 58 116 C 86 74 122 74 150 116 S 214 158 242 116" />
      <text className="lab-chip" x="58" y="76">{language === "zh" ? "模拟声音电压" : "Analog sound voltage"}</text>
      <rect className="interface-node" height="78" rx="10" width="128" x="286" y="76" />
      <text className="interface-node-text" x="350" y="104">{language === "zh" ? "Σ-Δ 调制器" : "Sigma-delta"}</text>
      <text className="interface-node-sub" x="350" y="132">{language === "zh" ? "模拟 → 1-bit" : "Analog to 1-bit"}</text>
      <path className="interface-flow-arrow" d="M 248 116 L 278 116" />
      <path className="interface-flow-arrow" d="M 422 116 L 472 116" />

      <g transform="translate(482 82)">
        {bitPreview.map((bit, index) => (
          <rect
            className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"}
            height={bit === "1" ? 58 : 16}
            key={`${bit}-${index}`}
            width="7"
            x={index * 11}
            y={bit === "1" ? 0 : 42}
          />
        ))}
      </g>
      <text className="lab-chip" x="492" y="170">{language === "zh" ? "1-bit 高速脉冲密度流" : "High-speed 1-bit pulse-density stream"}</text>

      <text className="lab-label" x="48" y="230">{language === "zh" ? "密度如何表示幅度" : "Density represents amplitude"}</text>
      <text className="interface-tdm-note" x="56" y="260">{language === "zh" ? "脉冲密度表示幅度" : "Pulse density represents amplitude"}</text>
      <g transform="translate(56 278)">
        {"1110111111011110".split("").map((bit, index) => (
          <rect className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"} height={bit === "1" ? 34 : 10} key={`dense-${index}`} width="9" x={index * 13} y={bit === "1" ? 0 : 24} />
        ))}
      </g>
      <text className="interface-tdm-note" x="56" y="334">{language === "zh" ? "1 更密 = 幅度更高" : "Denser 1s = higher amplitude"}</text>
      <g transform="translate(284 278)">
        {"1010101010101010".split("").map((bit, index) => (
          <rect className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"} height={bit === "1" ? 34 : 10} key={`mid-${index}`} width="9" x={index * 13} y={bit === "1" ? 0 : 24} />
        ))}
      </g>
      <text className="interface-tdm-note" x="284" y="334">{language === "zh" ? "1/0 接近一半 = 幅度接近 0" : "Balanced 1/0 = near zero amplitude"}</text>

      <rect className="interface-node" height="78" rx="10" width="158" x="534" y="250" />
      <text className="interface-node-text" x="613" y="280">{language === "zh" ? "低通滤波 + 抽取降采样" : "LPF + decimation"}</text>
      <text className="interface-node-sub" x="613" y="306">PDM → PCM</text>
      <path className="interface-flow-arrow" d="M 468 294 L 526 294" />
      <text className="interface-tdm-note" x="56" y="370">
        {language === "zh" ? "PDM 高速 1-bit 流 → PCM 多 bit 采样值" : "High-rate 1-bit PDM stream to multibit PCM samples"}
      </text>
      <text className="interface-tdm-note" x="56" y="392">{language === "zh" ? "抽取滤波后变成 PCM" : "Decimation turns it into PCM"}</text>
      <text className="lab-label" x="48" y="430">{language === "zh" ? "PDM 时钟与采样率" : "PDM clock and sample rate"}</text>
      <text className="interface-tdm-note" x="56" y="456">
        {language === "zh" ? "PDM 时钟 ≈ 目标采样率 × 抽取倍数" : "PDM clock roughly equals target sample rate times decimation ratio"}
      </text>
      <text className="interface-tdm-note" x="56" y="478">
        {language === "zh" ? "48 kHz PCM 常见：3.072 MHz PDM = 48 kHz × 64" : "Common 48 kHz PCM case: 3.072 MHz PDM = 48 kHz x 64"}
      </text>
      <text className="interface-tdm-note" x="392" y="478">
        {language === "zh" ? "PDM 时钟由麦克风/Codec/外设时钟提供，不等于 CPU 主频" : "PDM clock comes from mic/codec/peripheral clocks, not the CPU frequency"}
      </text>
    </svg>
  );
}

function renderSpdifDiagram(language: Language) {
  return (
    <svg
      aria-label={language === "zh" ? "SPDIF 设备链路图" : "SPDIF device link diagram"}
      role="img"
      viewBox="0 0 760 520"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="520" rx="14" width="760" />
      <image
        aria-label={language === "zh" ? "SPDIF 同轴光纤线示例图" : "SPDIF coaxial optical cable example"}
        height="210"
        href="/audio_md_tech/images/spdif-line.png"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        width="250"
        x="48"
        y="50"
      />
      <text className="lab-label" x="336" y="76">{language === "zh" ? "SPDIF 线缆示例" : "SPDIF cable example"}</text>
      <text className="interface-tdm-note" x="336" y="110">
        {language === "zh"
          ? "同轴或光纤用于设备之间传数字音频"
          : "Coaxial or optical links carry digital audio between devices"}
      </text>
      <text className="interface-tdm-note" x="336" y="136">
        {language === "zh"
          ? "音频数据和时钟信息嵌在同一条链路里，接收端再恢复时钟"
          : "Audio data and clocking are embedded in one link, then recovered by the receiver"}
      </text>
      <text className="interface-tdm-note" x="336" y="162">
        {language === "zh"
          ? "它是外部设备互连接口，不是芯片内部的 I2S/TDM 总线"
          : "It is an external device interconnect, not an internal I2S/TDM chip bus"}
      </text>
      <rect className="interface-device-node" height="96" rx="12" width="150" x="68" y="326" />
      <text className="interface-node-text" x="143" y="362">{language === "zh" ? "播放器 / 电视" : "Player / TV"}</text>
      <text className="interface-node-sub" x="143" y="390">{language === "zh" ? "SPDIF 输出" : "SPDIF out"}</text>
      <rect className="interface-device-node" height="96" rx="12" width="150" x="542" y="326" />
      <text className="interface-node-text" x="617" y="362">{language === "zh" ? "功放 / 声卡" : "Amp / interface"}</text>
      <text className="interface-node-sub" x="617" y="390">{language === "zh" ? "时钟恢复" : "Clock recovery"}</text>
      <path className="interface-link-line" d="M 232 374 C 306 318 454 318 528 374" />
      <path className="interface-link-line alt" d="M 232 388 C 306 444 454 444 528 388" />
      <text className="lab-chip" x="274" y="292">{language === "zh" ? "同轴 / 光纤" : "Coaxial / optical"}</text>
      <text className="lab-chip" x="250" y="484">{language === "zh" ? "嵌入式时钟 + 双相标记编码" : "Embedded clock + biphase mark coding"}</text>
    </svg>
  );
}

function renderUsbDiagram(language: Language) {
  return (
    <svg
      aria-label={language === "zh" ? "USB Audio 包传输图" : "USB Audio packet transfer diagram"}
      role="img"
      viewBox="0 0 760 520"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="520" rx="14" width="760" />
      <image
        aria-label={language === "zh" ? "USB 外置声卡示例图" : "USB external sound card example"}
        height="210"
        href="/audio_md_tech/images/usb-audio-card.png.png"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        width="250"
        x="48"
        y="50"
      />
      <text className="lab-label" x="336" y="76">{language === "zh" ? "USB 外置声卡示例" : "USB external sound card example"}</text>
      <text className="interface-tdm-note" x="336" y="110">
        {language === "zh"
          ? "USB 连接主机，设备提供耳机、麦克风和耳麦一体接口"
          : "USB connects to the host; the device provides headphone, mic, and combo headset ports"}
      </text>
      <text className="interface-tdm-note" x="336" y="136">
        {language === "zh"
          ? "这类产品属于 USB Audio 外设，不是 SPDIF 同轴/光纤接口"
          : "This is a USB Audio peripheral, not an SPDIF coaxial or optical interface"}
      </text>
      <text className="lab-chip" x="336" y="188">{language === "zh" ? "设备枚举 → 端点 → 等时包 → 音频缓冲" : "Enumeration to endpoints to isochronous packets to audio buffers"}</text>
      <rect className="interface-device-node" height="82" rx="12" width="136" x="54" y="326" />
      <text className="interface-node-text" x="122" y="354">{language === "zh" ? "主机" : "Host"}</text>
      <text className="interface-node-sub" x="122" y="380">PC / Phone</text>
      <rect className="interface-device-node" height="82" rx="12" width="146" x="560" y="326" />
      <text className="interface-node-text" x="633" y="354">{language === "zh" ? "声卡 / 耳机" : "Interface / headset"}</text>
      <text className="interface-node-sub" x="633" y="380">USB Audio</text>
      {[0, 1, 2, 3].map((packet) => (
        <g key={packet}>
          <rect className="interface-usb-packet" height="46" rx="8" width="70" x={232 + packet * 80} y={328 + (packet % 2) * 46} />
          <text className="interface-slot-label" x={267 + packet * 80} y={356 + (packet % 2) * 46}>{`Pkt ${packet + 1}`}</text>
        </g>
      ))}
      <path className="interface-flow-arrow" d="M 196 366 L 224 366" />
      <path className="interface-flow-arrow" d="M 552 366 L 526 366" />
      <path className="interface-link-line alt" d="M 224 452 C 330 494 430 494 536 452" />
      <text className="lab-chip" x="224" y="296">{language === "zh" ? "音频样本被装入 USB 等时包" : "Audio samples are packed into USB isochronous packets"}</text>
      <text className="lab-chip" x="156" y="492">{language === "zh" ? "主机 / 设备用缓冲和反馈端点校准速率" : "Host/device align rates with buffers and feedback endpoints"}</text>
    </svg>
  );
}

function renderProtocolDiagram(protocol: InterfaceProtocol, language: Language, bitDepth: number, channels: number) {
  if (protocol === "tdm") {
    return renderTdmDiagram(language, channels, bitDepth);
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

  return renderI2sDiagram(language, bitDepth, channels);
}

export function DigitalInterfaceLab({ language, onBack }: DigitalInterfaceLabProps) {
  const [protocol, setProtocol] = useState<InterfaceProtocol>("i2s");
  const [sampleRate, setSampleRate] = useState(48);
  const [bitDepth, setBitDepth] = useState(24);
  const [channels, setChannels] = useState(2);

  const bclkMhz = useMemo(() => formatMhz((sampleRate * bitDepth * channels) / 1000), [bitDepth, channels, sampleRate]);
  const mclkMhz = useMemo(() => formatMhz((sampleRate * 256) / 1000), [sampleRate]);
  const activeCopy = protocolCopy[protocol];
  const usesClockControls = protocol === "i2s" || protocol === "tdm";

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
            {usesClockControls ? (
              <span>
                {language === "zh"
                  ? `BCLK = ${sampleRate} kHz × ${bitDepth} bit × ${channels} ch = ${bclkMhz} MHz`
                  : `BCLK = ${sampleRate} kHz × ${bitDepth} bit × ${channels} ch = ${bclkMhz} MHz`}
              </span>
            ) : null}
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

          {usesClockControls ? (
            <>
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
            </>
          ) : null}

          <div className="lab-live-note">
            <strong>{language === "zh" ? "协议说明  :  " : "Protocol notes"}</strong>
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
