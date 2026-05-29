import {
  Binary,
  BrainCircuit,
  Cpu,
  Headphones,
  RadioTower,
  SlidersHorizontal
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Language = "zh" | "en";

export type LocalizedText = Record<Language, string>;

export type Topic = {
  title: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedText[];
};

export type Category = {
  id: string;
  icon: LucideIcon;
  title: LocalizedText;
  description: LocalizedText;
  accent: string;
  topics: Topic[];
};

export type RoadmapItem = {
  done: boolean;
  text: LocalizedText;
};

export const interfaceCopy = {
  navDocs: { zh: "文档", en: "Docs" },
  navGithub: { zh: "GitHub", en: "GitHub" },
  languageButton: { zh: "English", en: "中文" },
  eyebrow: { zh: "音频技术科普", en: "Audio Technology Education" },
  title: { zh: "音频技术知识库", en: "Audio Technology Knowledge Base" },
  subtitle: {
    zh: "把音频基础、硬件、软件、传统 DSP、AI 算法和应用场景整理成可浏览、可搜索、可扩展的网页内容底座。",
    en: "A searchable, browsable foundation for audio fundamentals, hardware, software, traditional DSP, AI algorithms, and real-world applications."
  },
  searchLabel: { zh: "搜索知识点", en: "Search knowledge topics" },
  searchPlaceholder: {
    zh: "搜索 FFT、麦克风、TTS、蓝牙延迟...",
    en: "Search FFT, microphones, TTS, Bluetooth latency..."
  },
  allCategories: { zh: "全部", en: "All" },
  categoriesTitle: { zh: "知识分类", en: "Knowledge Areas" },
  categoriesSubtitle: {
    zh: "按学习路径浏览，也可以直接搜索具体概念。",
    en: "Browse by learning path, or search directly for a concept."
  },
  topicsTitle: { zh: "主题卡片", en: "Topic Cards" },
  topicsSubtitle: {
    zh: "每张卡片后续都可以扩展为独立文章、图解或交互页面。",
    en: "Each card can later become an article, diagram, or interactive page."
  },
  noResults: { zh: "没有找到匹配主题。", en: "No matching topics found." },
  detailsLabel: { zh: "主题详情", en: "Topic details" },
  closeDetails: { zh: "关闭详情", en: "Close details" },
  detailsExpandTitle: { zh: "后续扩展方向", en: "Expansion direction" },
  detailsExpandBody: {
    zh: "可扩展为一篇专题文章，加入图解、关键指标、常见误区和真实应用案例。",
    en: "Can be expanded into a topic article with diagrams, key metrics, common misconceptions, and real-world examples."
  },
  detailsFormatTitle: { zh: "适合内容形式", en: "Best content formats" },
  detailsFormats: {
    zh: "文章 / 图解 / 案例 / 交互说明",
    en: "Article / Diagram / Case study / Interactive explainer"
  },
  roadmapTitle: { zh: "内容路线图", en: "Content Roadmap" },
  roadmapSubtitle: {
    zh: "从大纲到网页内容的下一步建设顺序。",
    en: "The next steps from outline to web-ready content."
  },
  principlesTitle: { zh: "写作原则", en: "Writing Principles" },
  footer: {
    zh: "内容来自当前仓库的音频技术科普知识大纲。",
    en: "Content is derived from the repository's audio technology knowledge outline."
  }
} satisfies Record<string, LocalizedText>;

export const categories: Category[] = [
  {
    id: "fundamentals",
    icon: RadioTower,
    accent: "#1f9d8a",
    title: { zh: "音频基础", en: "Audio Fundamentals" },
    description: {
      zh: "理解声音、声学和数字音频的底层概念。",
      en: "Understand sound, acoustics, and the basics of digital audio."
    },
    topics: [
      {
        title: { zh: "什么是声音", en: "What Sound Is" },
        summary: {
          zh: "从振动、声波、传播介质和人耳感知建立第一层认知。",
          en: "Build first principles from vibration, waves, medium propagation, and human hearing."
        },
        bullets: [
          { zh: "频率、振幅、相位、波长", en: "Frequency, amplitude, phase, wavelength" },
          { zh: "人耳听觉范围", en: "Human hearing range" },
          { zh: "声音产生、传播和感知", en: "Generation, propagation, and perception" }
        ]
      },
      {
        title: { zh: "数字音频基础", en: "Digital Audio Basics" },
        summary: {
          zh: "解释采样、量化、编码，以及采样率和位深对音质的影响。",
          en: "Explain sampling, quantization, encoding, and how sample rate and bit depth affect audio quality."
        },
        bullets: [
          { zh: "采样定理", en: "Sampling theorem" },
          { zh: "采样率、位深、动态范围", en: "Sample rate, bit depth, dynamic range" },
          { zh: "WAV、MP3、AAC、FLAC、Opus", en: "WAV, MP3, AAC, FLAC, Opus" }
        ]
      },
      {
        title: { zh: "听感与指标", en: "Listening Perception and Metrics" },
        summary: {
          zh: "把响度、音色、空间感等主观听感和客观指标关联起来。",
          en: "Connect loudness, timbre, clarity, and spatial perception with measurable indicators."
        },
        bullets: [
          { zh: "响度、音色、清晰度", en: "Loudness, timbre, clarity" },
          { zh: "频响、SPL、THD", en: "Frequency response, SPL, THD" },
          { zh: "主观评价与客观测量", en: "Subjective evaluation and objective measurement" }
        ]
      }
    ]
  },
  {
    id: "hardware",
    icon: Headphones,
    accent: "#c46f2a",
    title: { zh: "音频硬件", en: "Audio Hardware" },
    description: {
      zh: "从采集、转换、放大到播放理解完整硬件链路。",
      en: "Understand the hardware chain from capture and conversion to amplification and playback."
    },
    topics: [
      {
        title: { zh: "麦克风", en: "Microphones" },
        summary: {
          zh: "比较动圈、电容、MEMS、模拟和数字麦克风的适用场景。",
          en: "Compare dynamic, condenser, MEMS, analog, and digital microphones."
        },
        bullets: [
          { zh: "灵敏度、信噪比、指向性", en: "Sensitivity, SNR, directivity" },
          { zh: "模拟麦克风与数字麦克风", en: "Analog and digital microphones" },
          { zh: "麦克风阵列基础", en: "Microphone array basics" }
        ]
      },
      {
        title: { zh: "ADC / DAC / Codec", en: "ADC / DAC / Codec" },
        summary: {
          zh: "说明模拟和数字之间的转换，以及时钟、电源和噪声如何影响音质。",
          en: "Explain conversion between analog and digital audio, and how clocking, power, and noise affect quality."
        },
        bullets: [
          { zh: "ADC 和 DAC 指标", en: "ADC and DAC specifications" },
          { zh: "音频 Codec 芯片", en: "Audio codec chips" },
          { zh: "时钟、抖动、电源噪声", en: "Clocking, jitter, power noise" }
        ]
      },
      {
        title: { zh: "功放与扬声器", en: "Amplifiers and Speakers" },
        summary: {
          zh: "覆盖 Class D 功放、扬声器单元、箱体、分频器和小体积声学限制。",
          en: "Cover Class D amplifiers, speaker drivers, enclosures, crossovers, and small-device acoustic constraints."
        },
        bullets: [
          { zh: "Class A / AB / D", en: "Class A / AB / D" },
          { zh: "频响、灵敏度、阻抗", en: "Frequency response, sensitivity, impedance" },
          { zh: "TWS 和嵌入式音频链路", en: "TWS and embedded audio chains" }
        ]
      }
    ]
  },
  {
    id: "software",
    icon: Cpu,
    accent: "#4f7cbd",
    title: { zh: "音频软件", en: "Audio Software" },
    description: {
      zh: "理解系统音频栈、数据流、编解码和实时处理。",
      en: "Understand system audio stacks, data flow, codecs, and real-time processing."
    },
    topics: [
      {
        title: { zh: "系统音频架构", en: "System Audio Architecture" },
        summary: {
          zh: "梳理 ALSA、PipeWire、AudioFlinger、Core Audio、WASAPI 等系统音频角色。",
          en: "Map the roles of ALSA, PipeWire, AudioFlinger, Core Audio, WASAPI, and other system audio layers."
        },
        bullets: [
          { zh: "驱动与系统音频服务", en: "Drivers and system audio services" },
          { zh: "采集链路和播放链路", en: "Capture and playback chains" },
          { zh: "全双工音频", en: "Full-duplex audio" }
        ]
      },
      {
        title: { zh: "实时音频处理", en: "Real-Time Audio Processing" },
        summary: {
          zh: "关注 buffer、延迟、回调线程、卡顿、爆音和丢帧。",
          en: "Focus on buffers, latency, callback threads, glitches, pops, and frame drops."
        },
        bullets: [
          { zh: "Buffer size 与 latency", en: "Buffer size and latency" },
          { zh: "实时线程与回调", en: "Real-time threads and callbacks" },
          { zh: "卡顿、爆音、杂音排查", en: "Debugging glitches, pops, and noise" }
        ]
      },
      {
        title: { zh: "音频编解码", en: "Audio Codecs" },
        summary: {
          zh: "比较无损、有损和蓝牙音频 Codec 的码率、延迟与稳定性。",
          en: "Compare lossless, lossy, and Bluetooth codecs by bitrate, latency, and stability."
        },
        bullets: [
          { zh: "MP3、AAC、Opus、LC3", en: "MP3, AAC, Opus, LC3" },
          { zh: "SBC、aptX、LDAC", en: "SBC, aptX, LDAC" },
          { zh: "编码延迟与码率", en: "Encoding latency and bitrate" }
        ]
      }
    ]
  },
  {
    id: "dsp",
    icon: SlidersHorizontal,
    accent: "#7d6ab8",
    title: { zh: "传统算法", en: "Traditional DSP" },
    description: {
      zh: "用信号处理方法解释音频分析、增强和空间音频。",
      en: "Use signal processing methods to explain audio analysis, enhancement, and spatial audio."
    },
    topics: [
      {
        title: { zh: "基础信号处理", en: "Core Signal Processing" },
        summary: {
          zh: "理解 FFT / STFT、滤波器、EQ、动态范围压缩和限幅器。",
          en: "Understand FFT / STFT, filters, EQ, dynamic range compression, and limiters."
        },
        bullets: [
          { zh: "FFT / STFT", en: "FFT / STFT" },
          { zh: "低通、高通、带通、陷波", en: "Low-pass, high-pass, band-pass, notch filters" },
          { zh: "EQ、DRC、Limiter", en: "EQ, DRC, limiter" }
        ]
      },
      {
        title: { zh: "语音增强", en: "Speech Enhancement" },
        summary: {
          zh: "覆盖降噪、回声消除、自动增益、波束成形和去混响。",
          en: "Cover noise suppression, echo cancellation, AGC, beamforming, and dereverberation."
        },
        bullets: [
          { zh: "Noise Suppression", en: "Noise suppression" },
          { zh: "AEC、AGC、VAD", en: "AEC, AGC, VAD" },
          { zh: "Beamforming 与 Dereverberation", en: "Beamforming and dereverberation" }
        ]
      },
      {
        title: { zh: "空间音频", en: "Spatial Audio" },
        summary: {
          zh: "解释双耳渲染、HRTF、环绕声、3D Audio 和头部追踪。",
          en: "Explain binaural rendering, HRTF, surround sound, 3D audio, and head tracking."
        },
        bullets: [
          { zh: "HRTF", en: "HRTF" },
          { zh: "双耳渲染", en: "Binaural rendering" },
          { zh: "头部追踪音频", en: "Head-tracked audio" }
        ]
      }
    ]
  },
  {
    id: "ai",
    icon: BrainCircuit,
    accent: "#b44c6d",
    title: { zh: "AI 音频", en: "AI Audio" },
    description: {
      zh: "把语音识别、合成、增强、分离和生成放进统一视角。",
      en: "Unify speech recognition, synthesis, enhancement, separation, and generation."
    },
    topics: [
      {
        title: { zh: "语音识别 ASR", en: "Speech Recognition ASR" },
        summary: {
          zh: "理解语音转文字、端到端识别、流式识别、唤醒词和多语言识别。",
          en: "Understand speech-to-text, end-to-end recognition, streaming ASR, wake words, and multilingual recognition."
        },
        bullets: [
          { zh: "语音转文字流程", en: "Speech-to-text pipeline" },
          { zh: "端到端与流式识别", en: "End-to-end and streaming recognition" },
          { zh: "唤醒词与多语言", en: "Wake words and multilingual ASR" }
        ]
      },
      {
        title: { zh: "语音合成 TTS", en: "Text-to-Speech TTS" },
        summary: {
          zh: "说明文本转语音、声学模型、声码器、多音色和情感语音。",
          en: "Explain text-to-speech, acoustic models, vocoders, multi-speaker voices, and expressive speech."
        },
        bullets: [
          { zh: "声学模型与声码器", en: "Acoustic models and vocoders" },
          { zh: "多音色、情感语音", en: "Multi-speaker and expressive speech" },
          { zh: "实时 TTS 与高保真 TTS", en: "Real-time and high-fidelity TTS" }
        ]
      },
      {
        title: { zh: "音频生成", en: "Audio Generation" },
        summary: {
          zh: "覆盖音乐生成、音效生成、声音克隆、音频修复和版权风险。",
          en: "Cover music generation, sound effects, voice cloning, audio restoration, and copyright risks."
        },
        bullets: [
          { zh: "音乐与音效生成", en: "Music and sound generation" },
          { zh: "声音克隆", en: "Voice cloning" },
          { zh: "隐私、版权与安全边界", en: "Privacy, copyright, and safety boundaries" }
        ]
      }
    ]
  },
  {
    id: "applications",
    icon: Binary,
    accent: "#6d8c3f",
    title: { zh: "应用场景", en: "Applications" },
    description: {
      zh: "把音频技术放进产品、设备和行业场景中理解。",
      en: "Understand audio technology through products, devices, and industry scenarios."
    },
    topics: [
      {
        title: { zh: "会议与通信", en: "Conferencing and Communication" },
        summary: {
          zh: "分析视频会议音频、远场拾音、回声消除、实时字幕和翻译。",
          en: "Analyze conferencing audio, far-field capture, echo cancellation, live captions, and translation."
        },
        bullets: [
          { zh: "远场拾音", en: "Far-field capture" },
          { zh: "多人语音增强", en: "Multi-speaker enhancement" },
          { zh: "实时字幕与翻译", en: "Live captions and translation" }
        ]
      },
      {
        title: { zh: "智能汽车", en: "Intelligent Vehicles" },
        summary: {
          zh: "关注车载语音助手、车内降噪、声源定位和座舱空间音频。",
          en: "Focus on in-car voice assistants, cabin noise control, localization, and spatial audio."
        },
        bullets: [
          { zh: "车载语音交互", en: "In-car voice interaction" },
          { zh: "声源定位", en: "Sound source localization" },
          { zh: "座舱空间音频", en: "Cabin spatial audio" }
        ]
      },
      {
        title: { zh: "IoT 与内容创作", en: "IoT and Content Creation" },
        summary: {
          zh: "覆盖语音唤醒、边缘 AI、播客、直播、AI 配音和自动混音。",
          en: "Cover wake words, edge AI, podcasts, streaming, AI dubbing, and automatic mixing."
        },
        bullets: [
          { zh: "本地语音控制", en: "Local voice control" },
          { zh: "播客与直播音频", en: "Podcast and live-stream audio" },
          { zh: "AI 配音与自动母带", en: "AI dubbing and automatic mastering" }
        ]
      }
    ]
  }
];

export const roadmapItems: RoadmapItem[] = [
  {
    done: true,
    text: {
      zh: "建立第一版音频技术知识大纲。",
      en: "Create the first audio technology knowledge outline."
    }
  },
  {
    done: true,
    text: {
      zh: "搭建可搜索、可筛选的知识库网页。",
      en: "Build a searchable and filterable knowledge-base web page."
    }
  },
  {
    done: false,
    text: {
      zh: "把重点主题拆分为独立文章页面。",
      en: "Split key topics into dedicated article pages."
    }
  },
  {
    done: false,
    text: {
      zh: "补充声波、频谱、音频链路和算法流程图。",
      en: "Add diagrams for waves, spectra, audio chains, and algorithm flows."
    }
  },
  {
    done: false,
    text: {
      zh: "增加参考资料、延伸阅读和真实案例。",
      en: "Add references, further reading, and real-world case studies."
    }
  }
];

export const writingPrinciples: LocalizedText[] = [
  {
    zh: "概念解释优先清晰，避免堆砌术语。",
    en: "Prioritize clarity over terminology density."
  },
  {
    zh: "硬件和算法内容优先配图解。",
    en: "Use diagrams for hardware chains and algorithm flows."
  },
  {
    zh: "同时解释传统 DSP 和 AI 方法的差异。",
    en: "Explain the differences between traditional DSP and AI approaches."
  },
  {
    zh: "在合适位置补充产品和工程实践背景。",
    en: "Add product and engineering context where it helps understanding."
  }
];
