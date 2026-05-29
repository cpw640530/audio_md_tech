import { render, screen, within } from "@testing-library/react";
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

    expect(screen.queryByRole("complementary", { name: "主题详情" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /语音识别 ASR/ }));

    const details = screen.getByRole("complementary", { name: "主题详情" });
    expect(within(details).getByRole("heading", { name: "语音识别 ASR" })).toBeInTheDocument();
    expect(within(details).getByText("后续扩展方向")).toBeInTheDocument();

    await user.click(within(details).getByRole("button", { name: "关闭详情" }));

    expect(screen.queryByRole("complementary", { name: "主题详情" })).not.toBeInTheDocument();
  });
});
