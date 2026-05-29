import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
});
