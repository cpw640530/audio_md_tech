import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("Audio knowledge app", () => {
  it("switches between Chinese and English interface copy", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "音频技术知识库" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("heading", { name: "Audio Technology Knowledge Base" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "中文" })).toBeInTheDocument();
  });

  it("filters topics by category", async () => {
    const user = userEvent.setup();
    render(<App />);

    const categoriesRegion = screen.getByRole("region", { name: "知识分类" });
    await user.click(within(categoriesRegion).getByRole("button", { name: /AI 音频/ }));

    const topicGrid = screen.getByTestId("topic-grid");
    expect(within(topicGrid).getByText("语音识别 ASR")).toBeInTheDocument();
    expect(within(topicGrid).getByText("音频生成")).toBeInTheDocument();
    expect(within(topicGrid).queryByText("麦克风")).not.toBeInTheDocument();
  });

  it("searches across visible knowledge topics", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("searchbox", { name: "搜索知识点" }), "FFT");

    const topicGrid = screen.getByTestId("topic-grid");
    expect(within(topicGrid).getByText("基础信号处理")).toBeInTheDocument();
    expect(within(topicGrid).getAllByText(/FFT \/ STFT/).length).toBeGreaterThan(0);
    expect(within(topicGrid).queryByText("语音识别 ASR")).not.toBeInTheDocument();
  });

  it("renders the animated signal visualization on the homepage", () => {
    render(<App />);

    expect(screen.getByTestId("animated-signal-panel")).toBeInTheDocument();
    expect(screen.getByTestId("signal-scanline")).toBeInTheDocument();
    expect(screen.getAllByTestId("animated-wave-bar")).toHaveLength(32);
  });

  it("opens and closes topic details from a topic card", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByRole("dialog", { name: "主题详情" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /语音识别 ASR/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(details).toHaveClass("topic-details-modal");
    expect(screen.getByTestId("topic-details-backdrop")).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "语音识别 ASR" })).toBeInTheDocument();
    expect(within(details).getByText("内容扩展建议")).toBeInTheDocument();

    await user.click(within(details).getByRole("button", { name: "关闭详情" }));

    expect(screen.queryByRole("dialog", { name: "主题详情" })).not.toBeInTheDocument();
  });

  it("shows detailed topic-specific explanations in the details panel", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /语音识别 ASR/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByRole("heading", { name: "详细解释" })).toBeInTheDocument();
    expect(within(details).getByText(/把连续的语音波形转换成可编辑、可检索的文字/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "常见误区" })).toBeInTheDocument();
    expect(within(details).getByText(/识别率高不等于在所有噪声、口音和设备上都稳定/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "内容扩展建议" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "English" }));

    const englishDetails = screen.getByRole("dialog", { name: "Topic details" });
    expect(
      within(englishDetails).getByRole("heading", { name: "Detailed explanation" })
    ).toBeInTheDocument();
    expect(
      within(englishDetails).getByText(/turns continuous speech waveforms into editable/)
    ).toBeInTheDocument();
    expect(within(englishDetails).getByRole("heading", { name: "Common misconception" })).toBeInTheDocument();
  });

  it("explains sound topic bullets one by one with a diagram", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /什么是声音/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByRole("heading", { name: "相关知识点逐条解释" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "频率" })).toBeInTheDocument();
    expect(within(details).getByText(/频率表示声波每秒振动的次数/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "振幅" })).toBeInTheDocument();
    expect(within(details).getByText(/振幅表示压力变化的幅度/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "相位" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "波长" })).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "打开声音波形实验室" })).toBeInTheDocument();
    expect(within(details).getByText(/进入独立界面后，可以调节频率、振幅和相位/)).toBeInTheDocument();
    expect(within(details).getByRole("img", { name: "声波频率、振幅、相位和波长图解" })).toBeInTheDocument();
    expect(within(details).getByText("高频")).toBeInTheDocument();
    expect(within(details).getByText("低频")).toBeInTheDocument();
  });

  it("places lab entries after the key concepts block in topic details", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /什么是声音/ }));
    let details = screen.getByRole("dialog", { name: "主题详情" });
    expect(
      within(details).getByRole("heading", { name: "关键概念" }).compareDocumentPosition(
        within(details).getByRole("button", { name: "打开声音波形实验室" })
      ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    await user.click(within(details).getByRole("button", { name: "关闭详情" }));
    await user.click(screen.getByRole("button", { name: /数字音频基础/ }));
    details = screen.getByRole("dialog", { name: "主题详情" });
    expect(
      within(details).getByRole("heading", { name: "关键概念" }).compareDocumentPosition(
        within(details).getByRole("button", { name: "打开采样、量化与编码实验室" })
      ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    await user.click(within(details).getByRole("button", { name: "关闭详情" }));
    await user.click(screen.getByRole("button", { name: /听感与指标/ }));
    details = screen.getByRole("dialog", { name: "主题详情" });
    expect(
      within(details).getByRole("heading", { name: "关键概念" }).compareDocumentPosition(
        within(details).getByRole("button", { name: "打开听感与指标实验室" })
      ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

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

  it("replaces the active sound when switching waveforms during playback", async () => {
    const createdOscillators: Array<{
      connect: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
      start: ReturnType<typeof vi.fn>;
      stop: ReturnType<typeof vi.fn>;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
      type: OscillatorType;
    }> = [];
    const createdGains: Array<{
      connect: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
      gain: {
        cancelScheduledValues: ReturnType<typeof vi.fn>;
        setValueAtTime: ReturnType<typeof vi.fn>;
      };
    }> = [];
    const createdContexts: Array<{
      currentTime: number;
      destination: object;
      createOscillator: ReturnType<typeof vi.fn>;
      createGain: ReturnType<typeof vi.fn>;
      close: ReturnType<typeof vi.fn>;
    }> = [];

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: vi.fn(() => {
        const context = {
          currentTime: 0,
          destination: {},
          createOscillator: vi.fn(() => {
            const oscillator = {
              connect: vi.fn(),
              disconnect: vi.fn(),
              start: vi.fn(),
              stop: vi.fn(),
              frequency: { setValueAtTime: vi.fn() },
              type: "sine" as OscillatorType
            };
            createdOscillators.push(oscillator);
            return oscillator;
          }),
          createGain: vi.fn(() => {
            const gain = {
              connect: vi.fn(),
              disconnect: vi.fn(),
              gain: {
                cancelScheduledValues: vi.fn(),
                setValueAtTime: vi.fn()
              }
            };
            createdGains.push(gain);
            return gain;
          }),
          close: vi.fn()
        };
        createdContexts.push(context);
        return context;
      })
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /什么是声音/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开声音波形实验室"
      })
    );

    await user.click(screen.getByRole("button", { name: "播放" }));
    expect(createdOscillators).toHaveLength(1);
    expect(createdOscillators[0].type).toBe("sine");

    await user.click(screen.getByRole("button", { name: "方波" }));

    expect(createdOscillators).toHaveLength(2);
    expect(createdOscillators[0].stop).toHaveBeenCalledWith(0);
    expect(createdOscillators[0].disconnect).toHaveBeenCalled();
    expect(createdGains[0].gain.setValueAtTime).toHaveBeenLastCalledWith(0, 0);
    expect(createdGains[0].disconnect).toHaveBeenCalled();
    expect(createdContexts[0].close).toHaveBeenCalled();
    expect(createdOscillators[1].type).toBe("square");

    await user.click(screen.getByRole("button", { name: "三角波" }));

    expect(createdOscillators).toHaveLength(3);
    expect(createdOscillators[1].stop).toHaveBeenCalledWith(0);
    expect(createdContexts[1].close).toHaveBeenCalled();
    expect(createdOscillators[2].type).toBe("triangle");
    expect(screen.getByText("播放中")).toBeInTheDocument();
  });

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

  it("explains digital audio basics and links to the sampling lab", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /数字音频基础/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByRole("heading", { name: "采样" })).toBeInTheDocument();
    expect(within(details).getByText(/采样把连续时间中的模拟波形/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "量化" })).toBeInTheDocument();
    expect(within(details).getByText(/量化把连续幅度映射到有限个数字等级/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "编码" })).toBeInTheDocument();
    expect(within(details).getByText(/编码决定这些采样值如何组织/)).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "打开采样、量化与编码实验室" })).toBeInTheDocument();
  });

  it("lets readers compare sampling rate and bit depth in the digital audio lab", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /数字音频基础/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开采样、量化与编码实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "采样、量化与编码实验室" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "采样与量化可视化图" })).toBeInTheDocument();
    expect(screen.getByText("当前采样点：24 个")).toBeInTheDocument();
    expect(screen.getByText("当前量化等级：16 级")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("slider", { name: "采样率" }), {
      target: { value: "12" }
    });
    fireEvent.change(screen.getByRole("slider", { name: "位深" }), {
      target: { value: "3" }
    });

    expect(screen.getByText("当前采样点：12 个")).toBeInTheDocument();
    expect(screen.getByText("当前量化等级：8 级")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "误差曲线" }));

    expect(screen.getByText("显示模式：误差曲线")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "返回知识库" }));

    expect(screen.getByRole("heading", { name: "音频技术知识库" })).toBeInTheDocument();
  });

  it("shows how quantized samples become PCM words", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /数字音频基础/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByText(/PCM 不是压缩算法/)).toBeInTheDocument();

    await user.click(within(details).getByRole("button", { name: "打开采样、量化与编码实验室" }));
    await user.click(screen.getByRole("button", { name: "PCM 编码" }));

    expect(screen.getByText("显示模式：PCM 编码")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "如何变成 PCM" })).toBeInTheDocument();
    expect(screen.getByText("模拟值 → 量化值 → 整数样本值 → 二进制 PCM")).toBeInTheDocument();
    expect(screen.getByText("PCM 码率 = 采样率 × 位深 × 声道数")).toBeInTheDocument();
    expect(screen.getByText("48 kHz × 16-bit × 2 声道 = 1536 kbps")).toBeInTheDocument();
    expect(screen.getByText(/采样 #1/)).toBeInTheDocument();
  });

  it("summarizes common codec principles and compression ratios in the digital audio lab", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /数字音频基础/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开采样、量化与编码实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "如何变成 PCM" })).toBeInTheDocument();
    expect(screen.getByText("模拟值 → 量化值 → 整数样本值 → 二进制 PCM")).toBeInTheDocument();
    expect(screen.getByText("PCM 码率 = 采样率 × 位深 × 声道数")).toBeInTheDocument();
    expect(screen.getByText(/采样 #1/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PCM 如何变成 WAV" })).toBeInTheDocument();
    expect(screen.getAllByText(/给 PCM 加上 RIFF\/WAVE 文件头/).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "编码格式原理速览" })).toBeInTheDocument();
    expect(screen.getByText("MP3")).toBeInTheDocument();
    expect(screen.getByText("约 6:1 到 12:1")).toBeInTheDocument();
    expect(screen.getByText("AAC")).toBeInTheDocument();
    expect(screen.getByText("约 8:1 到 16:1")).toBeInTheDocument();
    expect(screen.getByText("AMR")).toBeInTheDocument();
    expect(screen.getByText("约 10:1 到 30:1")).toBeInTheDocument();
    expect(screen.getByText("Opus")).toBeInTheDocument();
    expect(screen.getByText("ADPCM")).toBeInTheDocument();
    expect(screen.getByText(/保存当前采样与预测值之间的差分/)).toBeInTheDocument();
  });

  it("expands ADC DAC Codec hardware knowledge with detailed terms and a lab entry", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /ADC \/ DAC \/ Codec/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByText(/ADC 把麦克风、线路输入等模拟电压/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "ADC" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "DAC" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "音频 Codec 芯片" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "PGA / 前级增益" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "I2S / PDM / TDM" })).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "打开 ADC / DAC / Codec 实验室" })).toBeInTheDocument();
  });

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

  it("expands system audio architecture knowledge with detailed terms and a lab entry", async () => {
    const user = userEvent.setup();
    render(<App />);

    const categoriesRegion = screen.getByRole("region", { name: "知识分类" });
    await user.click(within(categoriesRegion).getByRole("button", { name: /音频软件/ }));
    await user.click(screen.getByRole("button", { name: /系统音频架构/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByText(/系统音频架构不是单个模块/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "应用层 API" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "音频服务" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "音频策略与路由" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "混音器与重采样" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "HAL / 驱动" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "低延迟通路入口" })).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "打开系统音频架构实验室" })).toBeInTheDocument();
  });

  it("expands real-time audio processing knowledge with detailed buffer and xrun terms", async () => {
    const user = userEvent.setup();
    render(<App />);

    const categoriesRegion = screen.getByRole("region", { name: "知识分类" });
    await user.click(within(categoriesRegion).getByRole("button", { name: /音频软件/ }));
    await user.click(screen.getByRole("button", { name: /实时音频处理/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByText(/每一小块音频都在截止时间前完成计算/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "Buffer size" })).toBeInTheDocument();
    expect(within(details).getByText(/48 kHz 下 128 帧 buffer 约等于 2\.67 ms/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "回调 deadline" })).toBeInTheDocument();
    expect(within(details).getByText(/deadline 由 buffer 帧数和采样率决定/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "XRUN" })).toBeInTheDocument();
    expect(within(details).getByText(/XRUN 是 underrun 或 overrun 的统称/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "实时安全操作" })).toBeInTheDocument();
    expect(within(details).getByText(/避免锁等待、磁盘 IO、网络请求、大量日志和运行期分配/)).toBeInTheDocument();
    expect(within(details).getByText(/实时回调时间线/)).toBeInTheDocument();
    expect(within(details).queryByRole("button", { name: "打开系统音频架构实验室" })).not.toBeInTheDocument();
  });

  it("opens the system audio architecture lab from the software topic", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /系统音频架构/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开系统音频架构实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "系统音频架构实验室" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "返回知识库" })).toBeInTheDocument();
    const overview = screen.getByRole("region", { name: "系统音频架构总览" });
    expect(overview).toBeInTheDocument();
    const genericDiagram = within(overview).getByRole("img", { name: "通用系统音频架构框图" });
    const linuxDiagram = within(overview).getByRole("img", { name: "Linux 音频架构示例框图" });
    expect(genericDiagram).toBeInTheDocument();
    expect(linuxDiagram).toBeInTheDocument();
    expect(within(genericDiagram).getByText("应用程序")).toBeInTheDocument();
    expect(within(genericDiagram).getByText("音频 API / 音频服务")).toBeInTheDocument();
    expect(within(linuxDiagram).getByText("PipeWire / PulseAudio / JACK")).toBeInTheDocument();
    expect(within(linuxDiagram).getByText("ALSA 用户态接口")).toBeInTheDocument();
    expect(within(linuxDiagram).getByText("Linux Kernel ALSA 驱动")).toBeInTheDocument();
    expect(within(overview).getByRole("heading", { name: "桌面 Linux" })).toBeInTheDocument();
    expect(within(overview).getByRole("heading", { name: "嵌入式 Linux" })).toBeInTheDocument();
    expect(within(overview).getByText(/ASoC 把 CPU DAI、Codec DAI/)).toBeInTheDocument();
  });

  it("switches system audio architecture lab flows", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /系统音频架构/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开系统音频架构实验室"
      })
    );

    expect(screen.getByRole("button", { name: "播放链路" })).toHaveAttribute("aria-pressed", "true");
    let flowChart = screen.getByRole("img", { name: "播放链路流程图" });
    expect(within(flowChart).getByText("App 播放请求")).toBeInTheDocument();
    expect(within(flowChart).getByText("混音 / 重采样")).toBeInTheDocument();
    expect(screen.getAllByText("播放链路重点：多路声音如何被混音、统一采样率并送到目标设备。").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "录音链路" }));
    flowChart = screen.getByRole("img", { name: "录音链路流程图" });
    expect(within(flowChart).getByText("麦克风 / ADC")).toBeInTheDocument();
    expect(within(flowChart).getByText("权限 / 隐私指示")).toBeInTheDocument();
    expect(screen.getAllByText("录音链路重点：采集权限、输入增益、设备选择和时间戳连续性。").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "全双工语音" }));
    flowChart = screen.getByRole("img", { name: "全双工语音流程图" });
    expect(within(flowChart).getByText("采集流")).toBeInTheDocument();
    expect(within(flowChart).getByText("AEC / NS / AGC")).toBeInTheDocument();
    expect(within(flowChart).getByText("回放参考")).toBeInTheDocument();
    expect(screen.getAllByText("全双工重点：系统要把采集流、回放流和语音处理模块接成同一条通话链路。").length).toBeGreaterThan(0);
  });

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
    const signalChain = screen.getByRole("region", { name: "功放与扬声器信号链" });
    expect(signalChain).toBeInTheDocument();
    expect(within(signalChain).getByText("DAC / Codec 输出")).toBeInTheDocument();
    expect(within(signalChain).getByText("功放")).toBeInTheDocument();
    expect(within(signalChain).getByText("分频 / 保护")).toBeInTheDocument();
    expect(within(signalChain).getByText("扬声器单元")).toBeInTheDocument();
    expect(within(signalChain).getByText("空气声波")).toBeInTheDocument();
  });

  it("switches amplifier speaker lab diagram modes and amplifier classes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /功放与扬声器/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开功放与扬声器实验室"
      })
    );

    expect(screen.getByRole("button", { name: "功放类型" })).toHaveAttribute("aria-pressed", "true");
    const classDChart = screen.getByRole("img", { name: "Class D 功放图解" });
    expect(classDChart).toBeInTheDocument();
    expect(within(classDChart).getByText("从左到右：输入小信号 → 功放工作方式 → 功率输出 → 扬声器负载")).toBeInTheDocument();
    expect(within(classDChart).getByText("同一条中线表示同一个时间基准，方便比较波形如何变化")).toBeInTheDocument();
    expect(within(classDChart).getByText("输入小信号")).toBeInTheDocument();
    expect(within(classDChart).getByText("功放工作方式")).toBeInTheDocument();
    expect(within(classDChart).getByText("功率输出")).toBeInTheDocument();
    expect(within(classDChart).getByText("扬声器负载")).toBeInTheDocument();
    expect(within(classDChart).getByText("PWM 开关输出")).toBeInTheDocument();
    expect(within(classDChart).getByText("滤波后推动扬声器")).toBeInTheDocument();
    let ampPrinciple = screen.getByRole("region", { name: "Class D 基本原理" });
    expect(within(ampPrinciple).getByRole("heading", { name: "Class D 基本原理" })).toBeInTheDocument();
    expect(within(ampPrinciple).getByText(/音频信号先变成 PWM 或类似的高速开关脉冲/)).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("优势：效率高、发热低，适合电池供电和小体积设备。")).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("注意：需要输出滤波，并关注 EMI、电源和 PCB 布局。")).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("常见：蓝牙音箱、手机、电视、便携设备和高效率大功率功放。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Class A" }));
    const classAChart = screen.getByRole("img", { name: "Class A 功放图解" });
    expect(classAChart).toBeInTheDocument();
    expect(within(classAChart).getByText("线性连续输出")).toBeInTheDocument();
    expect(screen.getByText("Class A：器件几乎一直导通，线性好但效率低")).toBeInTheDocument();
    ampPrinciple = screen.getByRole("region", { name: "Class A 基本原理" });
    expect(within(ampPrinciple).getByText(/输出器件始终处在导通区/)).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("优势：线性好，交越失真少，声音细节容易保持。")).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("注意：静态电流大，效率低，发热明显。")).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("常见：小功率高保真、耳放、前级或偏重音质的线性电路。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Class AB" }));
    const classAbChart = screen.getByRole("img", { name: "Class AB 功放图解" });
    expect(classAbChart).toBeInTheDocument();
    expect(within(classAbChart).getByText("正负半周交替输出")).toBeInTheDocument();
    expect(screen.getByText("Class AB：正负半周分担输出，效率和失真折中")).toBeInTheDocument();
    ampPrinciple = screen.getByRole("region", { name: "Class AB 基本原理" });
    expect(within(ampPrinciple).getByText(/正半周和负半周主要由上下两组输出器件分担/)).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("优势：比 Class A 效率高，又比纯 B 类更容易控制交越失真。")).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("注意：偏置设置不好会有交越失真，仍有一定发热。")).toBeInTheDocument();
    expect(within(ampPrinciple).getByText("常见：传统音箱功放、车载功放和较多线性功放。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "扬声器单元" }));
    const speakerChart = screen.getByRole("img", { name: "动圈扬声器结构图" });
    expect(speakerChart).toBeInTheDocument();
    expect(within(speakerChart).getByText("从左到右：电流输入 → 音圈受力 → 振膜运动 → 空气声波")).toBeInTheDocument();
    expect(within(speakerChart).getByText("这张图看的是电能如何变成机械运动和声波")).toBeInTheDocument();
    expect(within(speakerChart).getByText("电流输入")).toBeInTheDocument();
    expect(within(speakerChart).getByText("音圈受力")).toBeInTheDocument();
    expect(within(speakerChart).getByText("振膜运动")).toBeInTheDocument();
    expect(within(speakerChart).getByText("空气声波")).toBeInTheDocument();
    expect(Number(within(speakerChart).getByText("电流在磁场中产生推/拉力").getAttribute("y"))).toBeGreaterThan(320);
    expect(Number(within(speakerChart).getByText("振膜前后运动，压缩/稀疏空气").getAttribute("y"))).toBeGreaterThan(344);

    await user.click(screen.getByRole("button", { name: "箱体与分频" }));
    const enclosureChart = screen.getByRole("img", { name: "箱体与分频图解" });
    expect(enclosureChart).toBeInTheDocument();
    expect(within(enclosureChart).getByText("从左到右：全频信号 → 分频器 → 低音/高音单元 → 箱体声学")).toBeInTheDocument();
    expect(within(enclosureChart).getByText("分频器决定谁负责低频、谁负责高频")).toBeInTheDocument();
    expect(within(enclosureChart).getByText("全频信号")).toBeInTheDocument();
    expect(within(enclosureChart).getByText("分频器")).toBeInTheDocument();
    expect(within(enclosureChart).getByText("低频通路")).toBeInTheDocument();
    expect(within(enclosureChart).getByText("高频通路")).toBeInTheDocument();
    expect(within(enclosureChart).getByText("箱体低频响应")).toBeInTheDocument();
    expect(Number(within(enclosureChart).getByText("箱体低频响应").getAttribute("x"))).toBeLessThan(646);
    expect(Number(within(enclosureChart).getByText("密闭 / 倒相会影响低频").getAttribute("y"))).toBeGreaterThan(346);
    expect(Number(within(enclosureChart).getByText("腔体容积会改变共振").getAttribute("y"))).toBeGreaterThan(
      Number(within(enclosureChart).getByText("密闭 / 倒相会影响低频").getAttribute("y")) + 16
    );

    await user.click(screen.getByRole("button", { name: "匹配关系" }));
    const matchingChart = screen.getByRole("img", { name: "功放扬声器匹配图" });
    expect(matchingChart).toBeInTheDocument();
    expect(within(matchingChart).getByText("不是信号流，而是三个参数共同决定结果")).toBeInTheDocument();
    expect(within(matchingChart).getByText("功率")).toBeInTheDocument();
    expect(within(matchingChart).getByText("阻抗")).toBeInTheDocument();
    expect(within(matchingChart).getByText("灵敏度")).toBeInTheDocument();
    expect(within(matchingChart).getByText("功率").getAttribute("x")).toBe(
      within(matchingChart).getByText("阻抗").getAttribute("x")
    );
    expect(within(matchingChart).getByText("功率").getAttribute("x")).toBe(
      within(matchingChart).getByText("灵敏度").getAttribute("x")
    );
    expect(within(matchingChart).getByText("实际声压")).toBeInTheDocument();
    expect(within(matchingChart).getByText("失真 / 保护风险")).toBeInTheDocument();
    expect(Number(within(matchingChart).getByText("失真 / 保护风险").getAttribute("y"))).toBeLessThan(244);
    expect(Number(within(matchingChart).getByText("功率过小会削波，阻抗过低会过流").getAttribute("y"))).toBeLessThan(286);
    expect(Number(within(matchingChart).getByText("目标：够响、不破音、不过热").getAttribute("y"))).toBeGreaterThan(348);
  });

  it("does not render audible amplifier speaker effect demos", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /功放与扬声器/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开功放与扬声器实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "功放与扬声器实验室" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Class D 功放图解" })).toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "功放扬声器音效演示" })).not.toBeInTheDocument();
    expect(screen.queryByText("可听音效演示")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "播放音效" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "效果强度" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "削波失真" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "查看削波失真说明" })).not.toBeInTheDocument();
  });

  it("places digital audio interfaces as a separate hardware topic", async () => {
    const user = userEvent.setup();
    render(<App />);

    const categoriesRegion = screen.getByRole("region", { name: "知识分类" });
    await user.click(within(categoriesRegion).getByRole("button", { name: /音频硬件/ }));

    const topicGrid = screen.getByTestId("topic-grid");
    expect(within(topicGrid).getByText("数字音频接口 / 传输协议")).toBeInTheDocument();
    expect(within(topicGrid).getByText(/I2S \/ IIS \/ I²S、TDM、PDM、SPDIF、USB Audio/)).toBeInTheDocument();

    await user.click(within(topicGrid).getByRole("button", { name: /数字音频接口 \/ 传输协议/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByText(/接口协议关注的是芯片和设备之间如何搬运音频样本/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "I2S / IIS / I²S" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "TDM" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "PDM" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "SPDIF" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "USB Audio" })).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "打开数字音频接口实验室" })).toBeInTheDocument();
  });

  it("lets readers compare digital audio interfaces and timing relationships", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /数字音频接口 \/ 传输协议/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开数字音频接口实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "数字音频接口实验室" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "接口速览" })).toBeInTheDocument();
    expect(screen.getByText("I2S / IIS / I²S：常见 3-4 根信号线")).toBeInTheDocument();
    expect(screen.getByText("BCLK 位时钟、LRCLK 左右声道时钟、SD 数据线、可选 MCLK 主时钟")).toBeInTheDocument();
    expect(screen.getByText("TDM：常见 3-4 根信号线")).toBeInTheDocument();
    expect(screen.getByText("PDM：常见 2-3 根信号线")).toBeInTheDocument();
    expect(screen.getByText("SPDIF：常见 1 根同轴或 1 路光纤")).toBeInTheDocument();
    expect(screen.getByText("USB Audio：常见 USB D+ / D- 差分线加电源地")).toBeInTheDocument();
    const i2sChart = screen.getByRole("img", { name: "I2S 时序图" });
    expect(i2sChart).toBeInTheDocument();
    expect(within(i2sChart).getByText("L: bit23 → bit0")).toBeInTheDocument();
    expect(within(i2sChart).getByText("R: bit23 → bit0")).toBeInTheDocument();
    expect(within(i2sChart).getAllByText("b22")).toHaveLength(2);
    expect(within(i2sChart).getAllByText("b21")).toHaveLength(2);
    expect(screen.getByText("协议：I2S / IIS / I²S")).toBeInTheDocument();
    expect(screen.getByText("BCLK = 48 kHz × 24 bit × 2 ch = 2.304 MHz")).toBeInTheDocument();
    expect(screen.getByText("MCLK 常见 12.288 MHz")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "采样率" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "位深" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "通道数" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("slider", { name: "位深" }), {
      target: { value: "16" }
    });
    fireEvent.change(screen.getByRole("slider", { name: "通道数" }), {
      target: { value: "8" }
    });
    expect(screen.getByText("BCLK = 48 kHz × 16 bit × 8 ch = 6.144 MHz")).toBeInTheDocument();
    const multichannelI2sChart = screen.getByRole("img", { name: "I2S 时序图" });
    expect(within(multichannelI2sChart).getByText("SD0")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("SD1")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("SD2")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("SD3")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("SD0: CH1 / CH2")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("SD3: CH7 / CH8")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("左半帧同时采集 CH1 / CH3 / CH5 / CH7")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("右半帧同时采集 CH2 / CH4 / CH6 / CH8")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("LRCLK 仍只区分每条 SD 上的 L / R")).toBeInTheDocument();
    expect(within(multichannelI2sChart).getByText("单条 SD 要放多路声道时，应看 TDM")).toBeInTheDocument();
    expect(
      Math.abs(
        Number(within(multichannelI2sChart).getByText("SD 数据线").getAttribute("y")) -
          Number(within(multichannelI2sChart).getByText("SD0").getAttribute("y"))
      )
    ).toBeGreaterThan(24);
    expect(
      Number(within(multichannelI2sChart).getByText(/多通道 I2S/).getAttribute("y"))
    ).toBeGreaterThan(Number(within(multichannelI2sChart).getByText("SD3").getAttribute("y")) + 42);
    expect(Number(within(multichannelI2sChart).getByText("MCLK").getAttribute("y"))).toBeGreaterThan(
      Number(within(multichannelI2sChart).getByText("单条 SD 要放多路声道时，应看 TDM").getAttribute("y")) + 32
    );

    await user.click(screen.getByRole("button", { name: "TDM" }));
    expect(screen.getByRole("img", { name: "TDM 时隙图" })).toBeInTheDocument();
    expect(screen.getByText("协议：TDM 多通道时分复用")).toBeInTheDocument();
    expect(screen.getByText("8 个 slot 共用一条 SD 数据线")).toBeInTheDocument();
    expect(screen.getByText("FS 帧同步：新一帧从这里开始")).toBeInTheDocument();
    expect(screen.getByText("一帧 = 8 个 slot")).toBeInTheDocument();
    expect(screen.getByText("每个 slot 内仍按 MSB → LSB 传一个采样字")).toBeInTheDocument();
    expect(screen.getByText("SD 串行数据拆回多声道")).toBeInTheDocument();
    expect(screen.getByText("slot 宽度可以大于有效位深，多余 bit 通常补 0")).toBeInTheDocument();
    expect(screen.getByText("slot 顺序两端必须一致，否则 CH1/CH2 会错位")).toBeInTheDocument();
    expect(screen.getByText(/Slot 1/)).toBeInTheDocument();
    expect(screen.getByText(/Slot 8/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "PDM" }));
    expect(screen.getByRole("img", { name: "PDM 到 PCM 转换图" })).toBeInTheDocument();
    expect(screen.getByText("协议：PDM 数字麦克风")).toBeInTheDocument();
    expect(screen.getByText("模拟声音电压")).toBeInTheDocument();
    expect(screen.getByText("Σ-Δ 调制器")).toBeInTheDocument();
    expect(screen.getByText("脉冲密度表示幅度")).toBeInTheDocument();
    expect(screen.getByText("1 更密 = 幅度更高")).toBeInTheDocument();
    expect(screen.getByText("1-bit 高速脉冲密度流")).toBeInTheDocument();
    expect(screen.getByText("低通滤波 + 抽取降采样")).toBeInTheDocument();
    expect(screen.getByText("PDM 高速 1-bit 流 → PCM 多 bit 采样值")).toBeInTheDocument();
    expect(screen.getByText("抽取滤波后变成 PCM")).toBeInTheDocument();
    expect(screen.getByText("PDM 时钟 ≈ 目标采样率 × 抽取倍数")).toBeInTheDocument();
    expect(screen.getByText("48 kHz PCM 常见：3.072 MHz PDM = 48 kHz × 64")).toBeInTheDocument();
    expect(screen.getByText("PDM 时钟由麦克风/Codec/外设时钟提供，不等于 CPU 主频")).toBeInTheDocument();
    const pdmChart = screen.getByRole("img", { name: "PDM 到 PCM 转换图" });
    expect(
      Number(within(pdmChart).getByText("抽取滤波后变成 PCM").getAttribute("y"))
    ).toBeGreaterThan(Number(within(pdmChart).getByText("PDM 高速 1-bit 流 → PCM 多 bit 采样值").getAttribute("y")) + 16);
    expect(screen.queryByRole("slider", { name: "采样率" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "位深" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "通道数" })).not.toBeInTheDocument();
    expect(screen.queryByText(/BCLK =/)).not.toBeInTheDocument();
    expect(screen.queryByText(/BCLK 6\.144 MHz/)).not.toBeInTheDocument();
    expect(screen.queryByText(/MCLK 常见/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SPDIF" }));
    expect(screen.getByRole("img", { name: "SPDIF 设备链路图" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "SPDIF 同轴光纤线示例图" })).toHaveAttribute(
      "href",
      "/audio_md_tech/images/spdif-line.png"
    );
    expect(screen.getByText("SPDIF 线缆示例")).toBeInTheDocument();
    expect(screen.getByText("同轴或光纤用于设备之间传数字音频")).toBeInTheDocument();
    expect(screen.getByText("嵌入式时钟 + 双相标记编码")).toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "采样率" })).not.toBeInTheDocument();
    expect(screen.queryByText(/BCLK =/)).not.toBeInTheDocument();
    expect(screen.queryByText(/MCLK 常见/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "USB Audio" }));
    expect(screen.getByRole("img", { name: "USB Audio 包传输图" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "USB 外置声卡示例图" })).toHaveAttribute(
      "href",
      "/audio_md_tech/images/usb-audio-card.png.png"
    );
    expect(screen.getByText("USB 外置声卡示例")).toBeInTheDocument();
    expect(screen.getByText("USB 连接主机，设备提供耳机、麦克风和耳麦一体接口")).toBeInTheDocument();
    expect(screen.getByText("音频样本被装入 USB 等时包")).toBeInTheDocument();
    expect(screen.getByText("主机 / 设备用缓冲和反馈端点校准速率")).toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "采样率" })).not.toBeInTheDocument();
    expect(screen.queryByText(/BCLK =/)).not.toBeInTheDocument();
    expect(screen.queryByText(/MCLK 常见/)).not.toBeInTheDocument();
  });

  it("lets readers explore ADC DAC Codec conversion and interface behavior", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /ADC \/ DAC \/ Codec/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开 ADC / DAC / Codec 实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "ADC / DAC / Codec 实验室" })).toBeInTheDocument();
    const conversionChart = screen.getByRole("img", { name: "ADC 采集图" });
    const modeConcepts = screen.getByRole("region", { name: "当前模式关键知识点" });
    expect(conversionChart).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "DAC 重建图" })).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Codec 芯片链路图" })).not.toBeInTheDocument();
    expect(conversionChart.querySelector(".codec-diagram-chain")).not.toBeInTheDocument();
    expect(conversionChart.querySelector(".codec-analog-path")).toBeInTheDocument();
    expect(conversionChart.querySelector(".codec-quant-grid")).toBeInTheDocument();
    expect(conversionChart.querySelector(".codec-reconstruction-path")).not.toBeInTheDocument();
    expect(conversionChart.querySelector(".codec-playback-path")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("ADC 采集流程图")).not.toBeInTheDocument();
    expect(document.querySelector(".codec-chain")).not.toBeInTheDocument();
    expect(screen.getByText("ADC：模拟电压变成数字样本")).toBeInTheDocument();
    expect(within(modeConcepts).getByRole("heading", { name: "输入范围" })).toBeInTheDocument();
    expect(within(modeConcepts).getByRole("heading", { name: "PGA / 前级增益" })).toBeInTheDocument();
    expect(within(modeConcepts).queryByRole("heading", { name: "重建滤波" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("slider", { name: "输入电平" }), {
      target: { value: "120" }
    });
    fireEvent.change(screen.getByRole("slider", { name: "采样点数" }), {
      target: { value: "40" }
    });
    const lowBitDepthGridCount = conversionChart.querySelectorAll(".codec-quant-grid").length;
    fireEvent.change(screen.getByRole("slider", { name: "位深" }), {
      target: { value: "7" }
    });
    fireEvent.change(screen.getByRole("slider", { name: "时钟抖动" }), {
      target: { value: "32" }
    });

    expect(screen.getByRole("img", { name: "ADC 采集图" }).querySelectorAll(".codec-quant-grid").length).toBeGreaterThan(lowBitDepthGridCount);
    expect(screen.getByText("量化等级：128 级 · 采样点：40")).toBeInTheDocument();
    expect(screen.getByText("削波风险 36%")).toBeInTheDocument();
    expect(screen.getByText("抖动风险 27%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "DAC 重建" }));
    expect(screen.getByText("DAC：数字样本重建成模拟输出")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "ADC 采集图" })).not.toBeInTheDocument();
    const dacChart = screen.getByRole("img", { name: "DAC 重建图" });
    expect(screen.queryByRole("img", { name: "Codec 芯片链路图" })).not.toBeInTheDocument();
    expect(dacChart.querySelector(".codec-analog-path")).not.toBeInTheDocument();
    expect(dacChart.querySelector(".codec-quant-grid")).not.toBeInTheDocument();
    expect(dacChart.querySelectorAll(".codec-sub-axis")).toHaveLength(2);
    expect(dacChart.querySelector(".codec-step-path")).toBeInTheDocument();
    expect(dacChart.querySelector(".codec-reconstruction-path")).toBeInTheDocument();
    expect(screen.queryByLabelText("DAC 重建流程图")).not.toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "输入电平" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "采样点数" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "位深" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "时钟抖动" })).toBeInTheDocument();
    expect(screen.getAllByText("重建滤波").length).toBeGreaterThan(0);
    expect(within(modeConcepts).getByRole("heading", { name: "重建滤波" })).toBeInTheDocument();
    expect(within(modeConcepts).getByRole("heading", { name: "输出驱动" })).toBeInTheDocument();
    expect(within(modeConcepts).queryByRole("heading", { name: "PGA / 前级增益" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Codec 芯片链路" }));
    expect(screen.getByText("Codec 芯片：采集、播放和路由集成")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "ADC 采集图" })).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "DAC 重建图" })).not.toBeInTheDocument();
    const codecChart = screen.getByRole("img", { name: "Codec 芯片链路图" });
    expect(codecChart.querySelector(".codec-capture-path")).not.toBeInTheDocument();
    expect(codecChart.querySelector(".codec-playback-path")).not.toBeInTheDocument();
    expect(codecChart.querySelectorAll(".codec-block-node")).toHaveLength(10);
    expect(within(codecChart).getByText("ADC")).toBeInTheDocument();
    expect(within(codecChart).getByText("DAC")).toBeInTheDocument();
    expect(within(codecChart).getAllByText("I2S/TDM")).toHaveLength(2);
    expect(within(codecChart).getByText("寄存器控制")).toBeInTheDocument();
    expect(screen.queryByLabelText("Codec 芯片链路流程图")).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "输入电平" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "采样点数" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "位深" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "时钟抖动" })).not.toBeInTheDocument();
    expect(within(modeConcepts).getByRole("heading", { name: "路由矩阵" })).toBeInTheDocument();
    expect(within(modeConcepts).getByRole("heading", { name: "寄存器配置" })).toBeInTheDocument();
    expect(within(modeConcepts).queryByRole("heading", { name: "输出驱动" })).not.toBeInTheDocument();
  });

  it("expands microphone knowledge with detailed hardware concepts and a lab entry", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^音频硬件 麦克风/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByText(/声波推动振膜振动/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "动圈麦克风" })).toBeInTheDocument();
    expect(within(details).getByText(/不需要幻象电源/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "电容麦克风" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "驻极体 \/ MEMS" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "最大 SPL" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "麦克风阵列" })).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "打开麦克风实验室" })).toBeInTheDocument();
  });

  it("lets readers explore microphone polar pattern, distance, gain, and pickup examples", async () => {
    const createdOscillators: Array<{
      connect: ReturnType<typeof vi.fn>;
      start: ReturnType<typeof vi.fn>;
      stop: ReturnType<typeof vi.fn>;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
      type: OscillatorType;
    }> = [];
    const bufferData = new Float32Array(4410);
    const audioContext = {
      currentTime: 0,
      destination: {},
      sampleRate: 44100,
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
      createBiquadFilter: vi.fn(() => ({
        connect: vi.fn(),
        frequency: { setValueAtTime: vi.fn() },
        Q: { setValueAtTime: vi.fn() },
        type: "bandpass" as BiquadFilterType
      })),
      createWaveShaper: vi.fn(() => ({
        connect: vi.fn(),
        curve: null as Float32Array | null,
        oversample: "none" as OverSampleType
      })),
      createBuffer: vi.fn(() => ({
        getChannelData: vi.fn(() => bufferData)
      })),
      createBufferSource: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        buffer: null as AudioBuffer | null,
        loop: false
      })),
      close: vi.fn()
    };
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: vi.fn(() => audioContext)
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^音频硬件 麦克风/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开麦克风实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "麦克风指向性与拾音实验室" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "麦克风指向性极坐标图" })).toBeInTheDocument();
    expect(screen.getByText("指向性：心形")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "8 字形" }));
    fireEvent.change(screen.getByRole("slider", { name: "声源角度" }), {
      target: { value: "90" }
    });
    fireEvent.change(screen.getByRole("slider", { name: "拾音距离" }), {
      target: { value: "2.5" }
    });
    fireEvent.change(screen.getByRole("slider", { name: "前级增益" }), {
      target: { value: "82" }
    });

    expect(screen.getByText("指向性：8 字形")).toBeInTheDocument();
    expect(screen.getByText("角度 90°")).toBeInTheDocument();
    expect(screen.getByText("距离 2.5 m")).toBeInTheDocument();
    expect(screen.getByText("前级增益 82%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "削波失真" }));
    await user.click(screen.getByRole("button", { name: "播放拾音示例" }));

    expect(audioContext.createWaveShaper).toHaveBeenCalled();
    expect(createdOscillators[createdOscillators.length - 1]?.start).toHaveBeenCalledWith(0);
    expect(screen.getByText("播放中")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "环境底噪" }));
    await user.click(screen.getByRole("button", { name: "播放拾音示例" }));

    expect(audioContext.createBufferSource).toHaveBeenCalled();
    expect(bufferData.some((sample) => sample !== 0)).toBe(true);
  });

  it("visualizes analog, digital, vocal, and array microphone working principles", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^音频硬件 麦克风/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开麦克风实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "麦克风工作原理" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "模拟驻极体咪头工作原理图" })).toBeInTheDocument();
    expect(screen.getByText(/驻极体材料预先带电/)).toBeInTheDocument();
    expect(screen.getAllByText("输出：模拟电压").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "数字 MEMS 麦" }));
    expect(screen.getByRole("img", { name: "数字 MEMS 麦工作原理图" })).toBeInTheDocument();
    expect(screen.getByText(/Σ-Δ 调制输出 PDM/)).toBeInTheDocument();
    expect(screen.getAllByText("输出：PDM / I2S").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "动圈话筒" }));
    expect(screen.getByRole("img", { name: "动圈话筒工作原理图" })).toBeInTheDocument();
    expect(screen.getByText(/线圈在磁场中随声音运动/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "多麦阵列" }));
    const arrayDiagram = screen.getByRole("img", { name: "多麦阵列工作原理图" });
    expect(arrayDiagram).toBeInTheDocument();
    expect(arrayDiagram.querySelectorAll(".mic-array-capsule")).toHaveLength(4);
    expect(arrayDiagram.querySelectorAll("path.mic-signal-line[d*='404']")).toHaveLength(4);
    expect(screen.getByText(/延时对齐并加权求和/)).toBeInTheDocument();
    expect(screen.getAllByText("输出：增强后的目标声").length).toBeGreaterThan(0);
  });

  it("expands listening perception with metrics and an audio effects lab", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /听感与指标/ }));

    const details = screen.getByRole("dialog", { name: "主题详情" });
    expect(within(details).getByRole("heading", { name: "响度" })).toBeInTheDocument();
    expect(within(details).getAllByText(/LUFS 更适合描述节目整体响度/).length).toBeGreaterThan(0);
    expect(within(details).getByRole("heading", { name: "频响曲线" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "THD / THD+N" })).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "打开听感与指标实验室" })).toBeInTheDocument();
  });

  it("lets readers compare listening effects with generated audio examples", async () => {
    const oscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      type: "sine"
    };
    const gain = {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn()
      }
    };
    const biquadFilter = {
      connect: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      gain: { setValueAtTime: vi.fn() },
      Q: { setValueAtTime: vi.fn() },
      type: "peaking"
    };
    const stereoPanner = {
      connect: vi.fn(),
      pan: { setValueAtTime: vi.fn() }
    };
    const audioContext = {
      currentTime: 0,
      destination: {},
      createOscillator: vi.fn(() => oscillator),
      createGain: vi.fn(() => gain),
      createBiquadFilter: vi.fn(() => biquadFilter),
      createStereoPanner: vi.fn(() => stereoPanner),
      close: vi.fn()
    };
    const AudioContextMock = vi.fn(() => audioContext);
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: AudioContextMock
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /听感与指标/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开听感与指标实验室"
      })
    );

    expect(screen.getByRole("heading", { name: "听感与指标实验室" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "听感与指标效果图" })).toBeInTheDocument();
    expect(screen.getByText("指标：频响曲线")).toBeInTheDocument();
    expect(screen.getByText(/明亮：提升高频能量/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "播放对照音效" }));

    expect(AudioContextMock).toHaveBeenCalled();
    expect(screen.getByText("播放中")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "噪声底噪" }));
    expect(screen.getByText("指标：SNR")).toBeInTheDocument();
    expect(screen.getByText(/底噪：在信号下方加入持续噪声/)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("slider", { name: "效果强度" }), {
      target: { value: "75" }
    });

    expect(screen.getByText("效果强度：75%")).toBeInTheDocument();
  });

  it("opens metric detail modals from the listening metrics cards", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /听感与指标/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开听感与指标实验室"
      })
    );

    await user.click(screen.getByRole("button", { name: /LUFS/ }));

    const modal = screen.getByRole("dialog", { name: "LUFS 详细介绍" });
    expect(within(modal).getByRole("heading", { name: "LUFS 详细介绍" })).toBeInTheDocument();
    expect(within(modal).getByText(/面向人耳感知的节目响度指标/)).toBeInTheDocument();
    expect(within(modal).getByText(/不是瞬时峰值/)).toBeInTheDocument();

    await user.click(within(modal).getByRole("button", { name: "关闭指标详情" }));

    expect(screen.queryByRole("dialog", { name: "LUFS 详细介绍" })).not.toBeInTheDocument();
  });

  it("configures distinct audio processing for every listening effect", async () => {
    const createdOscillators: Array<{
      connect: ReturnType<typeof vi.fn>;
      start: ReturnType<typeof vi.fn>;
      stop: ReturnType<typeof vi.fn>;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
      type: OscillatorType;
    }> = [];
    const createdFilters: Array<{
      connect: ReturnType<typeof vi.fn>;
      frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
      gain: { setValueAtTime: ReturnType<typeof vi.fn> };
      Q: { setValueAtTime: ReturnType<typeof vi.fn> };
      type: BiquadFilterType;
    }> = [];
    const createdPanners: Array<{
      connect: ReturnType<typeof vi.fn>;
      pan: { setValueAtTime: ReturnType<typeof vi.fn> };
    }> = [];
    const createdWaveShapers: Array<{
      connect: ReturnType<typeof vi.fn>;
      curve: Float32Array | null;
      oversample: OverSampleType;
    }> = [];
    const createdCompressors: Array<{
      connect: ReturnType<typeof vi.fn>;
      threshold: { setValueAtTime: ReturnType<typeof vi.fn> };
      knee: { setValueAtTime: ReturnType<typeof vi.fn> };
      ratio: { setValueAtTime: ReturnType<typeof vi.fn> };
      attack: { setValueAtTime: ReturnType<typeof vi.fn> };
      release: { setValueAtTime: ReturnType<typeof vi.fn> };
    }> = [];
    const bufferData = new Float32Array(4410);
    const bufferSource = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      buffer: null as AudioBuffer | null,
      loop: false
    };
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
      createBiquadFilter: vi.fn(() => {
        const filter = {
          connect: vi.fn(),
          frequency: { setValueAtTime: vi.fn() },
          gain: { setValueAtTime: vi.fn() },
          Q: { setValueAtTime: vi.fn() },
          type: "peaking" as BiquadFilterType
        };
        createdFilters.push(filter);
        return filter;
      }),
      createStereoPanner: vi.fn(() => {
        const panner = {
          connect: vi.fn(),
          pan: { setValueAtTime: vi.fn() }
        };
        createdPanners.push(panner);
        return panner;
      }),
      createWaveShaper: vi.fn(() => {
        const waveShaper = {
          connect: vi.fn(),
          curve: null as Float32Array | null,
          oversample: "none" as OverSampleType
        };
        createdWaveShapers.push(waveShaper);
        return waveShaper;
      }),
      createDynamicsCompressor: vi.fn(() => {
        const compressor = {
          connect: vi.fn(),
          threshold: { setValueAtTime: vi.fn() },
          knee: { setValueAtTime: vi.fn() },
          ratio: { setValueAtTime: vi.fn() },
          attack: { setValueAtTime: vi.fn() },
          release: { setValueAtTime: vi.fn() }
        };
        createdCompressors.push(compressor);
        return compressor;
      }),
      createBuffer: vi.fn(() => ({
        getChannelData: vi.fn(() => bufferData)
      })),
      createBufferSource: vi.fn(() => bufferSource),
      close: vi.fn()
    };
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: vi.fn(() => audioContext)
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /听感与指标/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开听感与指标实验室"
      })
    );

    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    expect(createdFilters[createdFilters.length - 1]?.type).toBe("highshelf");
    expect(createdFilters[createdFilters.length - 1]?.frequency.setValueAtTime).toHaveBeenLastCalledWith(3600, 0);

    await user.click(screen.getByRole("button", { name: "浑浊低中频" }));
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    expect(createdFilters[createdFilters.length - 1]?.type).toBe("lowshelf");
    expect(createdFilters[createdFilters.length - 1]?.frequency.setValueAtTime).toHaveBeenLastCalledWith(260, 0);

    await user.click(screen.getByRole("button", { name: "噪声底噪" }));
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    expect(audioContext.createBufferSource).toHaveBeenCalled();
    expect(audioContext.createBuffer).toHaveBeenCalledWith(1, 4410, 44100);
    expect(bufferData.some((sample) => sample !== 0)).toBe(true);

    await user.click(screen.getByRole("button", { name: "谐波失真" }));
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    expect(audioContext.createWaveShaper).toHaveBeenCalled();
    expect(createdWaveShapers[createdWaveShapers.length - 1]?.curve).toBeInstanceOf(Float32Array);
    expect(createdWaveShapers[createdWaveShapers.length - 1]?.oversample).toBe("4x");

    await user.click(screen.getByRole("button", { name: "动态压缩" }));
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    expect(audioContext.createDynamicsCompressor).toHaveBeenCalled();
    expect(createdCompressors[createdCompressors.length - 1]?.ratio.setValueAtTime).toHaveBeenLastCalledWith(expect.any(Number), 0);

    await user.click(screen.getByRole("button", { name: "声像偏移" }));
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    expect(createdPanners[createdPanners.length - 1]?.pan.setValueAtTime).toHaveBeenLastCalledWith(expect.any(Number), 0);
  });

  it("changes distortion and compression processing when effect intensity changes", async () => {
    const createdWaveShapers: Array<{
      connect: ReturnType<typeof vi.fn>;
      curve: Float32Array | null;
      oversample: OverSampleType;
    }> = [];
    const createdCompressors: Array<{
      connect: ReturnType<typeof vi.fn>;
      threshold: { setValueAtTime: ReturnType<typeof vi.fn> };
      knee: { setValueAtTime: ReturnType<typeof vi.fn> };
      ratio: { setValueAtTime: ReturnType<typeof vi.fn> };
      attack: { setValueAtTime: ReturnType<typeof vi.fn> };
      release: { setValueAtTime: ReturnType<typeof vi.fn> };
    }> = [];
    const audioContext = {
      currentTime: 0,
      destination: {},
      sampleRate: 44100,
      createOscillator: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { setValueAtTime: vi.fn() },
        type: "sine" as OscillatorType
      })),
      createGain: vi.fn(() => ({
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn()
        }
      })),
      createBiquadFilter: vi.fn(() => ({
        connect: vi.fn(),
        frequency: { setValueAtTime: vi.fn() },
        gain: { setValueAtTime: vi.fn() },
        Q: { setValueAtTime: vi.fn() },
        type: "peaking" as BiquadFilterType
      })),
      createStereoPanner: vi.fn(() => ({
        connect: vi.fn(),
        pan: { setValueAtTime: vi.fn() }
      })),
      createWaveShaper: vi.fn(() => {
        const waveShaper = {
          connect: vi.fn(),
          curve: null as Float32Array | null,
          oversample: "none" as OverSampleType
        };
        createdWaveShapers.push(waveShaper);
        return waveShaper;
      }),
      createDynamicsCompressor: vi.fn(() => {
        const compressor = {
          connect: vi.fn(),
          threshold: { setValueAtTime: vi.fn() },
          knee: { setValueAtTime: vi.fn() },
          ratio: { setValueAtTime: vi.fn() },
          attack: { setValueAtTime: vi.fn() },
          release: { setValueAtTime: vi.fn() }
        };
        createdCompressors.push(compressor);
        return compressor;
      }),
      createBuffer: vi.fn(() => ({
        getChannelData: vi.fn(() => new Float32Array(4410))
      })),
      createBufferSource: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        buffer: null as AudioBuffer | null,
        loop: false
      })),
      close: vi.fn()
    };
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: vi.fn(() => audioContext)
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /听感与指标/ }));
    await user.click(
      within(screen.getByRole("dialog", { name: "主题详情" })).getByRole("button", {
        name: "打开听感与指标实验室"
      })
    );
    await user.click(screen.getByRole("button", { name: "谐波失真" }));

    fireEvent.change(screen.getByRole("slider", { name: "效果强度" }), {
      target: { value: "5" }
    });
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    const lowDistortionCurve = createdWaveShapers[createdWaveShapers.length - 1]?.curve;

    fireEvent.change(screen.getByRole("slider", { name: "效果强度" }), {
      target: { value: "100" }
    });
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    const highDistortionCurve = createdWaveShapers[createdWaveShapers.length - 1]?.curve;

    expect(lowDistortionCurve?.[384]).toBeGreaterThan(0.45);
    expect(highDistortionCurve?.[384]).toBeGreaterThan(lowDistortionCurve?.[384] ?? 0);

    await user.click(screen.getByRole("button", { name: "动态压缩" }));
    fireEvent.change(screen.getByRole("slider", { name: "效果强度" }), {
      target: { value: "5" }
    });
    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    const lowCompressor = createdCompressors[createdCompressors.length - 1];

    expect(lowCompressor?.threshold.setValueAtTime).toHaveBeenLastCalledWith(-10.65, 0);
    expect(lowCompressor?.ratio.setValueAtTime).toHaveBeenLastCalledWith(1.85, 0);

    fireEvent.change(screen.getByRole("slider", { name: "效果强度" }), {
      target: { value: "100" }
    });

    expect(lowCompressor?.threshold.setValueAtTime).toHaveBeenLastCalledWith(-42, 0);
    expect(lowCompressor?.ratio.setValueAtTime).toHaveBeenLastCalledWith(18, 0);

    await user.click(screen.getByRole("button", { name: "播放对照音效" }));
    const highCompressor = createdCompressors[createdCompressors.length - 1];

    expect(highCompressor?.threshold.setValueAtTime).toHaveBeenLastCalledWith(-42, 0);
    expect(highCompressor?.ratio.setValueAtTime).toHaveBeenLastCalledWith(18, 0);

    fireEvent.change(screen.getByRole("slider", { name: "效果强度" }), {
      target: { value: "30" }
    });

    expect(highCompressor?.threshold.setValueAtTime).toHaveBeenLastCalledWith(-18.9, 0);
    expect(highCompressor?.ratio.setValueAtTime).toHaveBeenLastCalledWith(6.1, 0);
  });
});
