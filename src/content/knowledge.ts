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

export type TopicTerm = {
  name: LocalizedText;
  explanation: LocalizedText;
};

export type TopicDiagram = {
  type: "sound-wave";
  label: LocalizedText;
  caption: LocalizedText;
};

export type TopicLab = {
  type:
    | "sampling-quantization"
    | "listening-metrics"
    | "microphone"
    | "codec-hardware"
    | "digital-interface"
    | "amplifier-speaker"
    | "system-audio";
  title: LocalizedText;
  description: LocalizedText;
  buttonLabel: LocalizedText;
};

export type TopicDetail = {
  explanation: LocalizedText;
  keyConcepts: LocalizedText[];
  termExplanations?: TopicTerm[];
  diagram?: TopicDiagram;
  lab?: TopicLab;
  misconception: LocalizedText;
  contentDirection: LocalizedText;
};

export type Topic = {
  title: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedText[];
  detail: TopicDetail;
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
  detailsExplanationTitle: { zh: "详细解释", en: "Detailed explanation" },
  detailsRelatedTermsTitle: { zh: "相关知识点逐条解释", en: "Related knowledge explained" },
  detailsConceptsTitle: { zh: "关键概念", en: "Key concepts" },
  detailsDiagramTitle: { zh: "交互式正弦波图解", en: "Interactive sine wave diagram" },
  detailsMisconceptionTitle: { zh: "常见误区", en: "Common misconception" },
  detailsContentDirectionTitle: { zh: "内容扩展建议", en: "Content expansion idea" },
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
        ],
        detail: {
          explanation: {
            zh: "声音本质上是物体振动引起的压力变化。振动通过空气、水或固体传播到耳朵，耳膜和内耳把这些压力变化转换成神经信号，大脑再把它们理解成音高、响度、音色和方向。",
            en: "Sound is a pressure variation caused by vibration. The vibration travels through air, water, or solids to the ear, where the eardrum and inner ear convert it into neural signals that the brain interprets as pitch, loudness, timbre, and direction."
          },
          keyConcepts: [
            { zh: "频率决定音高，振幅通常影响响度。", en: "Frequency shapes pitch, while amplitude usually affects loudness." },
            { zh: "相位描述波形在周期中的位置，多个声音叠加时会影响抵消或增强。", en: "Phase describes position within a waveform cycle and affects cancellation or reinforcement when sounds combine." },
            { zh: "波长和传播速度相关，同一频率在不同介质中的波长不同。", en: "Wavelength depends on propagation speed, so the same frequency has different wavelengths in different media." }
          ],
          termExplanations: [
            {
              name: { zh: "频率", en: "Frequency" },
              explanation: {
                zh: "频率表示声波每秒振动的次数，单位是赫兹 Hz。频率越高，通常听起来音调越高；频率越低，通常听起来越低沉。",
                en: "Frequency is the number of waveform cycles per second, measured in hertz. Higher frequency usually sounds like a higher pitch, while lower frequency usually sounds deeper."
              }
            },
            {
              name: { zh: "振幅", en: "Amplitude" },
              explanation: {
                zh: "振幅表示压力变化的幅度，反映声波偏离平衡位置的大小。振幅越大，通常能量越强，听起来也更响，但实际响度还受频率和人耳敏感度影响。",
                en: "Amplitude is the size of the pressure change, showing how far the wave moves away from its resting level. Larger amplitude usually means more energy and louder sound, though perceived loudness also depends on frequency and hearing sensitivity."
              }
            },
            {
              name: { zh: "相位", en: "Phase" },
              explanation: {
                zh: "相位描述声波在一个周期中走到哪里。两个相同频率的声音相位接近时会增强，相位相反时可能互相抵消，这也是降噪和阵列处理的重要基础。",
                en: "Phase describes where a wave is within its cycle. Two sounds with similar frequency can reinforce each other when aligned, or cancel when opposite, which is important for noise cancellation and array processing."
              }
            },
            {
              name: { zh: "波长", en: "Wavelength" },
              explanation: {
                zh: "波长是声波完成一个周期所占的空间距离。低频声音波长更长，更容易绕过障碍物；高频声音波长更短，更容易被遮挡或吸收。",
                en: "Wavelength is the physical distance of one full cycle. Low-frequency sound has longer wavelengths and bends around obstacles more easily; high-frequency sound has shorter wavelengths and is blocked or absorbed more easily."
              }
            },
            {
              name: { zh: "人耳听觉范围", en: "Human hearing range" },
              explanation: {
                zh: "多数年轻人可听到大约 20 Hz 到 20 kHz 的声音，但年龄、环境噪声和个体差异会改变实际范围。人耳对 2 kHz 到 5 kHz 附近通常更敏感。",
                en: "Many young listeners can hear roughly 20 Hz to 20 kHz, but age, noise exposure, and individual differences change the actual range. Human hearing is often more sensitive around 2 kHz to 5 kHz."
              }
            },
            {
              name: { zh: "传播介质", en: "Propagation medium" },
              explanation: {
                zh: "声音需要介质传递压力变化。空气中的声速约为 343 m/s，水和固体中的速度通常更快，因此同样频率在不同介质中的波长也不同。",
                en: "Sound needs a medium to carry pressure changes. In air the speed of sound is about 343 m/s, while it is usually faster in water and solids, so the same frequency has different wavelengths in different media."
              }
            }
          ],
          diagram: {
            type: "sound-wave",
            label: { zh: "声波频率、振幅、相位和波长图解", en: "Diagram of sound-wave frequency, amplitude, phase, and wavelength" },
            caption: {
              zh: "同样的振幅下，高频波形周期更密；同样的频率下，振幅越大代表压力变化越强。波长对应一个完整周期在空间中的距离。",
              en: "At the same amplitude, higher frequency creates tighter cycles. At the same frequency, larger amplitude means stronger pressure variation. Wavelength is the spatial distance of one full cycle."
            }
          },
          misconception: {
            zh: "声音不是只存在于空气中的东西，它需要介质传播，但介质可以是气体、液体或固体；真空中没有普通声波传播。",
            en: "Sound is not limited to air. It needs a medium, which can be gas, liquid, or solid; ordinary sound waves do not propagate through a vacuum."
          },
          contentDirection: {
            zh: "上方交互实验已经把频率、振幅、相位和播放音高连接起来；后续可以继续补充谐波、噪声和真实乐器波形对比。",
            en: "The interactive experiment above already connects frequency, amplitude, phase, and audible pitch; next it can add harmonics, noise, and real-instrument waveform comparisons."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "数字音频把连续的声波转换成一串离散数字。采样率决定每秒记录多少个点，位深决定每个点能表达多细的幅度变化，编码格式则决定这些数字如何保存、压缩和传输。",
            en: "Digital audio turns a continuous waveform into discrete numbers. Sample rate controls how many points are captured per second, bit depth controls amplitude precision, and the encoding format defines how those numbers are stored, compressed, and transmitted."
          },
          keyConcepts: [
            { zh: "采样率决定时间轴上的记录密度，常见音乐和视频音频会使用 44.1 kHz 或 48 kHz。", en: "Sample rate determines density along the time axis; music and video commonly use 44.1 kHz or 48 kHz." },
            { zh: "奈奎斯特采样定理说明采样率至少要高于最高有效频率的两倍，采样前通常需要抗混叠滤波。", en: "The Nyquist theorem says the sample rate must be more than twice the highest useful frequency, so anti-alias filtering is usually needed before sampling." },
            { zh: "位深影响量化噪声和理论动态范围，16-bit 常用于发行，24-bit 常用于录音和制作。", en: "Bit depth affects quantization noise and theoretical dynamic range; 16-bit is common for delivery, while 24-bit is common for recording and production." },
            { zh: "编码把采样值组织成文件或码流，PCM 保留原始采样，FLAC 无损压缩，MP3、AAC、Opus 有损压缩。", en: "Encoding organizes samples into files or streams: PCM preserves raw samples, FLAC compresses losslessly, and MP3, AAC, and Opus compress lossily." }
          ],
          termExplanations: [
            {
              name: { zh: "采样", en: "Sampling" },
              explanation: {
                zh: "采样把连续时间中的模拟波形按固定时间间隔记录成一个个离散点。采样率越高，每秒记录的点越多，时间细节越容易保留；采样率不足时，高频内容可能被误判成低频，这叫混叠。",
                en: "Sampling records a continuous-time analog waveform as discrete points at fixed time intervals. A higher sample rate captures more points per second and preserves time detail more easily; if it is too low, high-frequency content can appear as a false lower frequency, called aliasing."
              }
            },
            {
              name: { zh: "量化", en: "Quantization" },
              explanation: {
                zh: "量化把连续幅度映射到有限个数字等级。位深越高，可用等级越多，量化误差越小，理论动态范围越大；位深较低时，波形会变成更明显的阶梯，并产生更容易听到的量化噪声。",
                en: "Quantization maps continuous amplitude to a finite set of numeric levels. Higher bit depth provides more levels, lower quantization error, and wider theoretical dynamic range; low bit depth creates more obvious stair-steps and more audible quantization noise."
              }
            },
            {
              name: { zh: "编码", en: "Encoding" },
              explanation: {
                zh: "编码决定这些采样值如何组织、封装、压缩和传输。PCM 不是压缩算法，而是把每个量化后的采样值按固定字长顺序写成二进制样本；WAV 常封装 PCM 原始采样，FLAC 做无损压缩，MP3、AAC、Opus 会进一步做感知压缩。",
                en: "Encoding defines how sample values are organized, wrapped, compressed, and transmitted. PCM is not a compression algorithm; it writes each quantized sample as a fixed-width binary word in sequence. WAV often wraps raw PCM, FLAC compresses losslessly, while MP3, AAC, and Opus add perceptual compression."
              }
            },
            {
              name: { zh: "采样率", en: "Sample rate" },
              explanation: {
                zh: "采样率是每秒采样次数，单位是 Hz。44.1 kHz 表示每秒 44100 个采样点；48 kHz 常用于视频、会议和系统音频。采样率提高会增加数据量，但不自动等于更好听。",
                en: "Sample rate is the number of samples per second, measured in Hz. 44.1 kHz means 44,100 samples per second; 48 kHz is common for video, conferencing, and system audio. Raising it increases data size but does not automatically sound better."
              }
            },
            {
              name: { zh: "位深", en: "Bit depth" },
              explanation: {
                zh: "位深表示每个采样点用多少位二进制描述幅度。n-bit 可以表示 2 的 n 次方个幅度等级。16-bit 理论动态范围约 96 dB，24-bit 理论动态范围约 144 dB。",
                en: "Bit depth is how many binary bits describe each sample's amplitude. n-bit audio can represent 2^n amplitude levels. 16-bit has about 96 dB theoretical dynamic range, while 24-bit has about 144 dB."
              }
            },
            {
              name: { zh: "码率", en: "Bitrate" },
              explanation: {
                zh: "码率表示每秒音频数据量，通常用 kbps 表示。无压缩 PCM 的码率由采样率、位深和通道数决定；有损编码的码率还受到编码器算法和内容复杂度影响。",
                en: "Bitrate is the amount of audio data per second, often shown in kbps. Uncompressed PCM bitrate comes from sample rate, bit depth, and channel count; lossy codec bitrate is also affected by codec design and content complexity."
              }
            },
            {
              name: { zh: "PCM", en: "PCM" },
              explanation: {
                zh: "PCM 的完整过程是：先采样得到时间点，再量化得到幅度等级，最后把每个等级转换成固定位数的整数样本。播放器按采样率、位深和声道顺序读取这些样本，就能还原出连续播放的数字音频流。",
                en: "PCM works by sampling time points, quantizing amplitude levels, then converting each level into a fixed-width integer sample. Playback reads those samples according to sample rate, bit depth, and channel order to reconstruct a continuous digital audio stream."
              }
            }
          ],
          lab: {
            type: "sampling-quantization",
            title: { zh: "采样、量化与编码实验室", en: "Sampling, Quantization, and Encoding Lab" },
            description: {
              zh: "进入独立界面调节采样率、位深和输入频率，观察采样点、量化阶梯、PCM 编码和常见压缩格式如何连接。",
              en: "Open an independent lab to adjust sample rate, bit depth, and input frequency while connecting samples, quantized steps, PCM encoding, and common compressed formats."
            },
            buttonLabel: { zh: "打开采样、量化与编码实验室", en: "Open sampling, quantization, and encoding lab" }
          },
          misconception: {
            zh: "采样率越高并不一定代表最终听感越好，码率相同也不代表不同编码器音质相同；录音、混音、播放链路、编码器实现和内容类型往往同样重要。",
            en: "A higher sample rate does not automatically mean better perceived quality, and equal bitrate does not mean equal quality across codecs; recording, mixing, playback hardware, codec implementation, and content type often matter just as much."
          },
          contentDirection: {
            zh: "适合做采样点可视化、量化阶梯图和不同编码格式对比表，解释音质、文件大小和延迟之间的取舍。",
            en: "This can become a sampling visualization, quantization staircase diagram, and codec comparison table explaining trade-offs among quality, file size, and latency."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "听感是人对声音的综合判断，受到响度、频率分布、瞬态、失真、空间反射和个人经验影响。工程指标能帮助定位问题，但需要结合实际试听和场景目标解读。",
            en: "Listening perception is a combined judgment shaped by loudness, frequency balance, transients, distortion, spatial reflections, and personal experience. Engineering metrics help locate issues, but they must be interpreted with listening tests and product goals."
          },
          keyConcepts: [
            { zh: "响度和声压级不同，LUFS 更适合描述节目整体响度。", en: "Loudness and sound pressure level are different; LUFS is better for program loudness." },
            { zh: "频响曲线描述不同频率的能量变化，但不能单独决定音质。", en: "Frequency response describes energy variation by frequency, but it does not determine quality alone." },
            { zh: "THD、SNR、延迟、串扰等指标分别反映失真、噪声、同步和通道隔离问题。", en: "THD, SNR, latency, and crosstalk describe distortion, noise, synchronization, and channel separation issues." }
          ],
          termExplanations: [
            {
              name: { zh: "响度", en: "Loudness" },
              explanation: {
                zh: "响度是人耳主观感受到的声音大小，不等同于瞬时声压。SPL 常用于物理声压测量，LUFS 更适合描述节目整体响度，播客、视频和流媒体通常会按 LUFS 做响度归一。",
                en: "Loudness is perceived sound level, not the same as instantaneous pressure. SPL measures physical sound pressure, while LUFS is better for program loudness and is commonly used for podcasts, video, and streaming normalization."
              }
            },
            {
              name: { zh: "频响曲线", en: "Frequency response" },
              explanation: {
                zh: "频响曲线描述设备或处理链对不同频率的增强或衰减。高频偏多可能听起来明亮甚至刺耳，低中频堆积可能显得浑浊，低频不足则容易单薄。",
                en: "Frequency response shows how a device or processing chain boosts or cuts different frequencies. More treble can sound bright or harsh, low-mid buildup can sound muddy, and weak bass can feel thin."
              }
            },
            {
              name: { zh: "动态范围", en: "Dynamic range" },
              explanation: {
                zh: "动态范围描述最小可听细节和最大声音之间的跨度。压缩器会缩小动态范围，让声音更稳定、更靠前，但过度压缩会让音乐失去起伏和冲击力。",
                en: "Dynamic range is the span between quiet details and loud peaks. Compression reduces that range, making sound steadier and more forward, but too much compression removes contrast and impact."
              }
            },
            {
              name: { zh: "SNR", en: "SNR" },
              explanation: {
                zh: "SNR 是信噪比，表示有效信号与底噪之间的差距。SNR 越低，底噪、嘶声或电流声越容易被听见，语音清晰度和安静段质量会下降。",
                en: "SNR is signal-to-noise ratio, the gap between useful signal and noise floor. Lower SNR makes hiss or electrical noise easier to hear and reduces speech clarity and quiet-section quality."
              }
            },
            {
              name: { zh: "THD / THD+N", en: "THD / THD+N" },
              explanation: {
                zh: "THD 描述非线性失真产生的谐波成分，THD+N 还把噪声一起算入。少量谐波可能带来温暖感，过多会变成破音、毛刺或刺耳感。",
                en: "THD describes harmonic components caused by nonlinear distortion, while THD+N also includes noise. A little harmonic content may feel warm; too much becomes clipping, grit, or harshness."
              }
            },
            {
              name: { zh: "声像与空间感", en: "Stereo image and space" },
              explanation: {
                zh: "声像来自左右声道的电平差、时间差和频率差，空间感还受混响和早期反射影响。串扰、相位问题或过强混响都会让定位变糊。",
                en: "Stereo image comes from level, timing, and frequency differences between channels; space also depends on reverberation and early reflections. Crosstalk, phase issues, or too much reverb can blur localization."
              }
            }
          ],
          lab: {
            type: "listening-metrics",
            title: { zh: "听感与指标实验室", en: "Listening Metrics Lab" },
            description: {
              zh: "进入独立界面切换明亮、浑浊、底噪、失真、动态压缩和声像偏移，查看对应指标并播放短音效对照。",
              en: "Open an independent lab to switch between brightness, muddiness, noise floor, distortion, compression, and stereo shift while viewing metrics and hearing short examples."
            },
            buttonLabel: { zh: "打开听感与指标实验室", en: "Open listening metrics lab" }
          },
          misconception: {
            zh: "一个漂亮的指标不能代表完整听感；同样的曲线在不同房间、耳机佩戴方式和内容类型下可能听起来完全不同。",
            en: "One impressive metric cannot represent the whole listening experience; the same curve can sound different across rooms, headphone fits, and content types."
          },
          contentDirection: {
            zh: "适合扩展为指标速查卡、主观听感词典和真实测量案例，帮助读者建立“听到什么，对应可能是什么指标”的判断路径。",
            en: "This can become a metric cheat sheet, listening vocabulary guide, and measurement case study that maps perceived problems to likely indicators."
          }
        }
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
          zh: "从换能原理、类型、参数和使用场景理解麦克风如何把声音变成电信号。",
          en: "Understand how microphones convert sound into electrical signals through transducer principles, types, specifications, and use cases."
        },
        bullets: [
          { zh: "换能原理与常见麦克风类型", en: "Transducer principle and microphone types" },
          { zh: "灵敏度、频响、SNR、最大 SPL", en: "Sensitivity, frequency response, SNR, maximum SPL" },
          { zh: "指向性、距离、增益和阵列拾音", en: "Polar pattern, distance, gain, and array pickup" }
        ],
        detail: {
          explanation: {
            zh: "麦克风是把空气中的声压变化转换成电信号的换能器。声波推动振膜振动，振膜运动再通过线圈、电容变化、驻极体材料或 MEMS 结构变成电压或数字脉冲流，随后经过前置放大、滤波和 ADC 进入数字音频系统。",
            en: "A microphone is a transducer that converts air-pressure variation into an electrical signal. Sound moves a diaphragm; that motion is converted by a coil, capacitance change, electret material, or MEMS structure into voltage or a digital pulse stream, then passes through preamp, filtering, and ADC stages."
          },
          keyConcepts: [
            { zh: "动圈麦耐用、抗大声压，适合舞台和近讲；电容麦灵敏、细节多，常用于录音棚和播客。", en: "Dynamic microphones are durable and tolerate high SPL, useful on stage and close speech; condenser microphones are sensitive and detailed, common in studios and podcasts." },
            { zh: "驻极体和 MEMS 麦克风体积小、成本低，广泛用于手机、耳机、会议设备、IoT 和车载语音。", en: "Electret and MEMS microphones are compact and low-cost, widely used in phones, earbuds, conferencing devices, IoT, and vehicle voice systems." },
            { zh: "灵敏度、等效自噪声、SNR、最大 SPL、频响和指向性共同决定可录到的声音质量。", en: "Sensitivity, equivalent self-noise, SNR, maximum SPL, frequency response, and polar pattern together shape capture quality." },
            { zh: "距离、房间反射、安装位置和增益设置经常比麦克风价格更直接影响录音结果。", en: "Distance, room reflections, placement, and gain staging often affect the recording more directly than microphone price." }
          ],
          termExplanations: [
            {
              name: { zh: "换能过程", en: "Transduction" },
              explanation: {
                zh: "声波先推动振膜运动，振膜运动再被转换成电信号。动圈麦利用线圈在磁场中运动产生电压；电容麦利用振膜和背板之间的电容变化；MEMS 麦则把微型机械结构和电子电路集成在芯片中。",
                en: "Sound first moves a diaphragm, and that movement becomes an electrical signal. Dynamic mics generate voltage from a moving coil in a magnetic field; condenser mics use capacitance changes; MEMS mics integrate micro-mechanical structures and electronics on a chip."
              }
            },
            {
              name: { zh: "动圈麦克风", en: "Dynamic microphone" },
              explanation: {
                zh: "动圈麦结构像小型反向扬声器，耐用、抗摔、能承受很高声压，不需要幻象电源。它通常灵敏度较低，需要较多前级增益，适合舞台、人声近讲、鼓和吉他箱体。",
                en: "A dynamic mic works like a small speaker in reverse. It is rugged, handles high SPL, and needs no phantom power. It is usually less sensitive and needs more preamp gain, making it useful for stage vocals, close speech, drums, and guitar cabinets."
              }
            },
            {
              name: { zh: "电容麦克风", en: "Condenser microphone" },
              explanation: {
                zh: "电容麦利用振膜和背板组成电容，需要极化电压和内部放大电路，常通过 48V 幻象电源供电。它灵敏度高、瞬态和高频细节好，但更容易收进房间噪声和反射。",
                en: "A condenser mic uses a diaphragm and backplate as a capacitor, requiring polarization and active electronics, often powered by 48V phantom power. It is sensitive and detailed, but also captures more room noise and reflections."
              }
            },
            {
              name: { zh: "驻极体 / MEMS", en: "Electret / MEMS" },
              explanation: {
                zh: "驻极体麦把电荷固化在材料中，降低供电需求；MEMS 麦把机械振膜、前端电路和封装做成芯片级器件。它们适合小体积、多麦阵列和量产设备，数字 MEMS 常直接输出 PDM 或 I2S 数据。",
                en: "Electret mics store charge in material, reducing bias requirements; MEMS mics package diaphragm, front-end electronics, and housing as chip-scale parts. They suit compact devices, arrays, and mass production, with digital MEMS often outputting PDM or I2S."
              }
            },
            {
              name: { zh: "灵敏度", en: "Sensitivity" },
              explanation: {
                zh: "灵敏度表示在标准声压下麦克风输出多大的电平，常用 mV/Pa 或 dBV/Pa 表示。灵敏度高不等于音质更好，它只说明同样声音下输出更大，后端增益需求更低。",
                en: "Sensitivity describes output level at a standard sound pressure, often in mV/Pa or dBV/Pa. Higher sensitivity does not mean better quality; it means more output for the same sound and less required downstream gain."
              }
            },
            {
              name: { zh: "频率响应", en: "Frequency response" },
              explanation: {
                zh: "频率响应描述麦克风对不同频率的拾取差异。人声麦常会有低频近讲增强或高频存在感提升；测量麦则追求更平直，用来反映真实声场。",
                en: "Frequency response shows how a mic captures different frequencies. Vocal mics may add proximity bass or presence boost; measurement mics aim to be flatter to represent the real sound field."
              }
            },
            {
              name: { zh: "指向性", en: "Polar pattern" },
              explanation: {
                zh: "指向性描述麦克风从不同方向收声的强弱。全指向各方向接近一致，心形主要收前方并抑制后方，8 字形收前后并抑制侧面。它直接影响抗噪、离轴音色和多人拾音。",
                en: "Polar pattern describes pickup strength by direction. Omni captures nearly all directions, cardioid favors the front and rejects the rear, and figure-8 captures front/back while rejecting the sides. It affects noise rejection, off-axis tone, and multi-person capture."
              }
            },
            {
              name: { zh: "自噪声 / SNR", en: "Self-noise / SNR" },
              explanation: {
                zh: "自噪声是麦克风自身电子和热噪声造成的底噪，SNR 表示目标声和噪声之间的差距。安静录音、人声远场和会议拾音尤其依赖低自噪声和高 SNR。",
                en: "Self-noise is the mic's own electronic and thermal noise floor, while SNR is the gap between target sound and noise. Quiet recording, far-field voice, and conferencing depend strongly on low self-noise and high SNR."
              }
            },
            {
              name: { zh: "最大 SPL", en: "Maximum SPL" },
              explanation: {
                zh: "最大 SPL 表示麦克风在失真达到规定阈值前能承受多大的声压。鼓、铜管、吉他箱体和近距离喊叫需要更高最大 SPL，否则前端可能过载产生破音。",
                en: "Maximum SPL indicates how loud a source can be before distortion reaches a specified threshold. Drums, brass, guitar cabinets, and close shouting need higher maximum SPL to avoid front-end overload."
              }
            },
            {
              name: { zh: "幻象电源 48V", en: "48V phantom power" },
              explanation: {
                zh: "48V 幻象电源通过平衡线给电容麦内部电路供电。它不是音质增强开关，动圈麦通常不需要；错误接线或不兼容设备可能带来噪声或风险。",
                en: "48V phantom power feeds condenser mic electronics through balanced cables. It is not a quality boost switch, and dynamic mics usually do not need it; wrong wiring or incompatible gear can cause noise or risk."
              }
            },
            {
              name: { zh: "麦克风阵列", en: "Microphone array" },
              explanation: {
                zh: "多个麦克风可以利用到达时间差、相位差和电平差判断方向，并通过波束成形增强目标声源、抑制噪声和回声。手机、会议机、智能音箱和车载语音常用阵列。",
                en: "Multiple microphones can use time, phase, and level differences to estimate direction, then beamform toward the target while suppressing noise and echo. Phones, conference devices, smart speakers, and cars commonly use arrays."
              }
            }
          ],
          lab: {
            type: "microphone",
            title: { zh: "麦克风指向性与拾音实验室", en: "Microphone Pickup Lab" },
            description: {
              zh: "进入独立界面切换全指向、心形和 8 字形，拖动声源角度、距离和增益，观察拾音强度、噪声和削波风险。",
              en: "Open an independent lab to switch omni, cardioid, and figure-8 patterns, then adjust source angle, distance, and gain to see pickup strength, noise, and clipping risk."
            },
            buttonLabel: { zh: "打开麦克风实验室", en: "Open microphone lab" }
          },
          misconception: {
            zh: "更贵的麦克风不能自动解决糟糕声学环境；房间混响、安装位置、拾音距离、结构噪声和前级增益经常比麦克风型号更关键。",
            en: "A more expensive microphone does not automatically fix bad acoustics; room reverberation, placement, pickup distance, mechanical noise, and preamp gain are often more important than the model."
          },
          contentDirection: {
            zh: "适合继续扩展为麦克风类型对比表、指向性极坐标图、近讲效应示例、阵列拾音动画和真实录音问题排查清单。",
            en: "This can expand into microphone type comparisons, polar diagrams, proximity-effect examples, array pickup animations, and recording troubleshooting checklists."
          }
        }
      },
      {
        title: { zh: "ADC / DAC / Codec", en: "ADC / DAC / Codec" },
        summary: {
          zh: "理解模拟音频如何采样成数字、数字音频如何重建为模拟，以及音频 Codec 芯片如何整合整条链路。",
          en: "Understand how analog audio becomes digital samples, how digital audio is reconstructed to analog, and how audio codec chips integrate the whole chain."
        },
        bullets: [
          { zh: "ADC 采样、量化、抗混叠和输入范围", en: "ADC sampling, quantization, anti-aliasing, and input range" },
          { zh: "DAC 重建、保持、低通滤波和输出驱动", en: "DAC reconstruction, hold, low-pass filtering, and output drive" },
          { zh: "Codec 芯片、PGA、混音、I2S/PDM/TDM、时钟和电源噪声", en: "Codec chips, PGA, mixing, I2S/PDM/TDM, clocking, and power noise" }
        ],
        detail: {
          explanation: {
            zh: "ADC 把麦克风、线路输入等模拟电压按固定时钟采样并量化成数字样本；DAC 把数字样本转换成阶梯状或调制后的模拟信号，再经过重建滤波和输出级驱动耳机、功放或线路输出。音频 Codec 芯片通常把 ADC、DAC、PGA、耳机放大、混音、数字滤波、时钟和 I2S/PDM/TDM 接口集成在一起，是嵌入式音频链路的核心器件。",
            en: "An ADC samples and quantizes analog voltage from microphones or line inputs into digital samples. A DAC converts digital samples into stepped or modulated analog signals, then uses reconstruction filtering and output stages to drive headphones, amplifiers, or line outputs. An audio codec chip often integrates ADCs, DACs, PGA, headphone amps, mixers, digital filters, clocks, and I2S/PDM/TDM interfaces."
          },
          keyConcepts: [
            { zh: "ADC 之前的模拟前端决定输入电平、增益和抗混叠；输入过大会削波，输入太小会让底噪占比变高。", en: "The analog front end before an ADC sets input level, gain, and anti-aliasing; too much level clips, while too little level exposes noise." },
            { zh: "DAC 之后的重建滤波、输出阻抗、负载能力和耳机/功放匹配决定实际播放质量。", en: "After a DAC, reconstruction filtering, output impedance, load drive, and headphone/amplifier matching shape playback quality." },
            { zh: "Codec 芯片不是 MP3/AAC 压缩算法，而是集成音频转换、模拟通路、数字接口和控制寄存器的硬件芯片。", en: "A codec chip is not an MP3/AAC compression algorithm; it is hardware integrating conversion, analog paths, digital interfaces, and control registers." },
            { zh: "采样时钟、PLL、MCLK/BCLK/LRCLK 配置错误会造成采样率不准、变调、爆音、丢帧或左右声道错位。", en: "Wrong sample clocks, PLL, MCLK/BCLK/LRCLK settings can cause sample-rate errors, pitch shift, pops, dropouts, or channel misalignment." }
          ],
          termExplanations: [
            {
              name: { zh: "ADC", en: "ADC" },
              explanation: {
                zh: "ADC 是模数转换器，把连续的模拟电压转换成离散数字样本。音频 ADC 通常包含采样保持、量化、数字滤波和抽取，现代芯片多采用 Σ-Δ 架构以获得较高动态范围。",
                en: "An ADC converts continuous analog voltage into discrete digital samples. Audio ADCs usually include sample-and-hold, quantization, digital filtering, and decimation; modern parts often use sigma-delta architectures for high dynamic range."
              }
            },
            {
              name: { zh: "DAC", en: "DAC" },
              explanation: {
                zh: "DAC 是数模转换器，把数字样本重建为模拟电压或电流。音频 DAC 通常经过过采样、噪声整形、模拟低通滤波和输出缓冲，最后驱动线路输出、耳机或功放。",
                en: "A DAC reconstructs digital samples into analog voltage or current. Audio DACs usually use oversampling, noise shaping, analog low-pass filtering, and output buffering before driving line out, headphones, or amplifiers."
              }
            },
            {
              name: { zh: "音频 Codec 芯片", en: "Audio codec chip" },
              explanation: {
                zh: "硬件 Codec 芯片把 ADC、DAC、PGA、耳机放大、麦克风偏置、混音矩阵、音量控制和数字接口集成在一起。它负责硬件通路，不等同于 MP3、AAC、Opus 这类压缩编码算法。",
                en: "A hardware codec chip integrates ADCs, DACs, PGA, headphone amps, mic bias, mixers, volume controls, and digital interfaces. It handles hardware paths, not compression formats such as MP3, AAC, or Opus."
              }
            },
            {
              name: { zh: "PGA / 前级增益", en: "PGA / preamp gain" },
              explanation: {
                zh: "PGA 是可编程增益放大器，用来把麦克风或线路输入调整到 ADC 合适范围。增益太小会浪费动态范围，增益太大则可能削波并把噪声一起放大。",
                en: "A PGA is a programmable gain amplifier that brings mic or line input into the ADC's usable range. Too little gain wastes dynamic range; too much clips and amplifies noise."
              }
            },
            {
              name: { zh: "抗混叠滤波", en: "Anti-alias filter" },
              explanation: {
                zh: "采样前需要限制高于奈奎斯特频率的内容，否则高频会折叠成错误低频。现代音频 ADC 通常用模拟前端加过采样数字滤波共同完成抗混叠。",
                en: "Before sampling, content above the Nyquist frequency must be limited or it folds into false lower frequencies. Modern audio ADCs combine analog front-end filtering with oversampled digital filtering."
              }
            },
            {
              name: { zh: "重建滤波", en: "Reconstruction filter" },
              explanation: {
                zh: "DAC 输出后会出现采样镜像和阶梯成分，需要低通重建滤波去除超声频镜像，让输出更接近连续模拟波形。",
                en: "DAC output contains sampling images and stepped components. A low-pass reconstruction filter removes ultrasonic images and makes the output closer to a continuous analog waveform."
              }
            },
            {
              name: { zh: "动态范围 / SNR", en: "Dynamic range / SNR" },
              explanation: {
                zh: "动态范围描述最大不失真信号和噪声底之间的跨度。ADC/DAC 的 ENOB、SNR、THD+N、模拟布局和电源噪声都会影响真实可用动态范围。",
                en: "Dynamic range is the span between maximum unclipped signal and noise floor. ENOB, SNR, THD+N, analog layout, and power noise all affect usable converter range."
              }
            },
            {
              name: { zh: "时钟与抖动", en: "Clocking and jitter" },
              explanation: {
                zh: "音频采样依赖稳定时钟。抖动是采样或重建时刻的微小偏差，严重时会带来噪声、失真或声像模糊；实际系统还要正确配置 MCLK、BCLK、LRCLK 和 PLL。",
                en: "Audio conversion depends on stable clocks. Jitter is tiny timing error in sampling or reconstruction; when severe it can add noise, distortion, or image blur. Systems also need correct MCLK, BCLK, LRCLK, and PLL configuration."
              }
            },
            {
              name: { zh: "I2S / PDM / TDM", en: "I2S / PDM / TDM" },
              explanation: {
                zh: "I2S 常用于双声道 PCM 音频，PDM 常见于数字 MEMS 麦克风，TDM 可在一组时钟线上承载多路音频。接口格式、位宽、左右对齐和主从时钟必须匹配。",
                en: "I2S commonly carries stereo PCM, PDM is common for digital MEMS microphones, and TDM carries multiple channels on shared clocks. Format, word length, alignment, and clock master/slave roles must match."
              }
            },
            {
              name: { zh: "电源与模拟布局", en: "Power and analog layout" },
              explanation: {
                zh: "Codec 周围的电源纹波、地回路、模拟/数字隔离、参考电压和去耦电容会直接影响噪声、串扰和爆音。数据手册推荐布局通常非常关键。",
                en: "Power ripple, ground loops, analog/digital separation, voltage references, and decoupling near a codec directly affect noise, crosstalk, and pops. Datasheet layout guidance is often critical."
              }
            }
          ],
          lab: {
            type: "codec-hardware",
            title: { zh: "ADC / DAC / Codec 实验室", en: "ADC / DAC / Codec Lab" },
            description: {
              zh: "进入独立界面切换 ADC 采集、DAC 重建和 Codec 芯片链路，调节输入电平、采样率、位深和时钟抖动，观察削波、量化噪声、重建滤波和接口数据流。",
              en: "Open an independent lab to switch ADC capture, DAC reconstruction, and codec-chip paths, then adjust input level, sample rate, bit depth, and clock jitter to observe clipping, quantization noise, reconstruction filtering, and interface flow."
            },
            buttonLabel: { zh: "打开 ADC / DAC / Codec 实验室", en: "Open ADC / DAC / Codec lab" }
          },
          misconception: {
            zh: "硬件 Codec 芯片和 MP3、AAC 这类编解码算法不是同一个概念；前者是音频转换、模拟通路和接口芯片，后者是压缩格式算法。",
            en: "A hardware codec chip is not the same thing as an MP3 or AAC codec algorithm; the former handles conversion, analog paths, and interfaces, while the latter compresses audio data."
          },
          contentDirection: {
            zh: "适合继续扩展为从麦克风到扬声器的硬件链路图、Codec 寄存器配置示例、I2S/PDM/TDM 时序图，以及噪声、失真、爆音和时钟问题排查清单。",
            en: "This can expand into microphone-to-speaker hardware chain diagrams, codec register examples, I2S/PDM/TDM timing diagrams, and checklists for noise, distortion, pops, and clocking problems."
          }
        }
      },
      {
        title: { zh: "数字音频接口 / 传输协议", en: "Digital Audio Interfaces / Transport Protocols" },
        summary: {
          zh: "理解主控、Codec、数字麦克风、功放和外设之间如何传输音频样本、时钟和多通道数据。",
          en: "Understand how hosts, codecs, digital microphones, amplifiers, and peripherals move audio samples, clocks, and multichannel data."
        },
        bullets: [
          { zh: "I2S / IIS / I²S、TDM、PDM、SPDIF、USB Audio", en: "I2S / IIS / I²S, TDM, PDM, SPDIF, USB Audio" },
          { zh: "MCLK、BCLK、LRCLK、帧同步和主从时钟", en: "MCLK, BCLK, LRCLK, frame sync, and clock master/slave roles" },
          { zh: "声道排布、位宽、对齐方式、延迟和兼容性", en: "Channel layout, word length, alignment, latency, and compatibility" }
        ],
        detail: {
          explanation: {
            zh: "接口协议关注的是芯片和设备之间如何搬运音频样本，而不是声音如何被采样或压缩。ADC、DAC、Codec、数字 MEMS 麦克风、DSP、蓝牙芯片和主控之间通常要约定数据线、时钟线、帧同步、位宽、声道顺序和主从关系，任何一项不匹配都可能导致无声、变调、左右声道错位、噪声或爆音。",
            en: "Interface protocols are about moving audio samples between chips and devices, not about how sound is sampled or compressed. ADCs, DACs, codecs, digital MEMS microphones, DSPs, Bluetooth chips, and hosts must agree on data lines, clocks, frame sync, word length, channel order, and master/slave roles; mismatches can cause silence, pitch errors, swapped channels, noise, or pops."
          },
          keyConcepts: [
            { zh: "I2S/IIS/I²S 主要用于传输已经采样量化后的 PCM 数据，常见于主控和 Codec、DAC、功放之间。", en: "I2S/IIS/I²S carries already sampled and quantized PCM data, commonly between a host and codec, DAC, or amplifier." },
            { zh: "PDM 常见于数字 MEMS 麦克风，传的是高速 1-bit 脉冲密度流，后端需要抽取滤波变成 PCM。", en: "PDM is common for digital MEMS microphones. It carries a high-rate 1-bit pulse-density stream that must be decimated into PCM." },
            { zh: "TDM 适合多通道音频，把多个声道按时隙塞进同一条数据线和同一组时钟。", en: "TDM fits multichannel audio by packing channels into time slots on one data line and shared clocks." },
            { zh: "接口调试要同时检查采样率、位深、左右/帧同步、主从时钟、边沿采样和 DMA buffer 配置。", en: "Interface debugging checks sample rate, bit depth, left/right or frame sync, master/slave clocks, sampling edge, and DMA buffer configuration together." }
          ],
          termExplanations: [
            {
              name: { zh: "I2S / IIS / I²S", en: "I2S / IIS / I²S" },
              explanation: {
                zh: "I2S 是最常见的芯片级数字音频接口之一，也常被写成 IIS 或 I²S。它通常包含 BCLK 位时钟、LRCLK 左右声道时钟和 SD 数据线，可选 MCLK 主时钟。它主要传输 PCM 样本，常用于主控连接 Codec、DAC、ADC、DSP 或数字功放。",
                en: "I2S is one of the most common chip-level digital audio interfaces, also written as IIS or I²S. It usually has BCLK bit clock, LRCLK left/right clock, SD data, and optionally MCLK master clock. It carries PCM samples between hosts, codecs, DACs, ADCs, DSPs, or digital amplifiers."
              }
            },
            {
              name: { zh: "TDM", en: "TDM" },
              explanation: {
                zh: "TDM 是时分复用接口，可以把 4 路、8 路甚至更多声道按固定时隙放进同一条数据线上。会议设备、多麦阵列、车载音频和多通道 DSP 常用 TDM，但帧长、slot 宽度、声道顺序必须严格匹配。",
                en: "TDM uses time slots to place 4, 8, or more channels on one data line. It is common in conferencing devices, microphone arrays, automotive audio, and multichannel DSP systems, but frame length, slot width, and channel order must match exactly."
              }
            },
            {
              name: { zh: "PDM", en: "PDM" },
              explanation: {
                zh: "PDM 是脉冲密度调制，常见于数字 MEMS 麦克风。它不是普通多 bit PCM，而是高速 1-bit 数据流，密度代表瞬时幅度。主控或 Codec 需要用抽取滤波把 PDM 转换成 PCM 后再处理。",
                en: "PDM means pulse-density modulation and is common in digital MEMS microphones. It is not normal multibit PCM; it is a high-rate 1-bit stream where pulse density represents amplitude. A host or codec decimates it into PCM before processing."
              }
            },
            {
              name: { zh: "PCM 接口", en: "PCM interface" },
              explanation: {
                zh: "PCM 接口这个名字在不同芯片手册中含义不完全一致，有时指电话/语音窄带接口，有时泛指同步串行 PCM 传输。看数据手册时要确认帧同步、位宽、对齐方式和是否兼容 I2S/TDM。",
                en: "The term PCM interface varies by datasheet. It can mean a telephony voice interface or a generic synchronous serial PCM transport. Check frame sync, word length, alignment, and whether it is compatible with I2S or TDM."
              }
            },
            {
              name: { zh: "SPDIF", en: "SPDIF" },
              explanation: {
                zh: "SPDIF 常用于消费电子的数字音频输出，可通过同轴或光纤传输立体声 PCM，也可承载压缩环绕声码流。它适合设备间连接，不常用于芯片内部短距离连接。",
                en: "SPDIF is common in consumer digital audio output over coaxial or optical links. It can carry stereo PCM or compressed surround bitstreams. It is useful between devices rather than short chip-to-chip links."
              }
            },
            {
              name: { zh: "USB Audio", en: "USB Audio" },
              explanation: {
                zh: "USB Audio 是电脑、手机和声卡之间常见的外设级音频协议。它不仅传音频样本，还包含设备枚举、端点、同步方式、控制请求、采样率切换和多通道描述。",
                en: "USB Audio is a peripheral-level protocol between computers, phones, and audio interfaces. It carries samples and also handles enumeration, endpoints, synchronization, control requests, sample-rate changes, and multichannel descriptors."
              }
            },
            {
              name: { zh: "MCLK / BCLK / LRCLK", en: "MCLK / BCLK / LRCLK" },
              explanation: {
                zh: "MCLK 是主时钟，BCLK 是每一位数据的时钟，LRCLK 或 FS 用来标记左右声道或帧边界。采样率、位宽和声道数会共同决定这些时钟频率。",
                en: "MCLK is the master clock, BCLK clocks each data bit, and LRCLK or FS marks left/right channels or frame boundaries. Sample rate, word length, and channel count together determine these clock rates."
              }
            },
            {
              name: { zh: "主从时钟", en: "Clock master/slave" },
              explanation: {
                zh: "数字音频链路中必须明确谁输出时钟、谁跟随时钟。两个设备都当主机会打架，两个设备都当从机则没有时钟。复杂系统通常还要统一 PLL 和采样率域。",
                en: "A digital audio link must define who generates clocks and who follows them. Two masters conflict, while two slaves provide no clock. Complex systems also need aligned PLL and sample-rate domains."
              }
            }
          ],
          lab: {
            type: "digital-interface",
            title: { zh: "数字音频接口实验室", en: "Digital Audio Interface Lab" },
            description: {
              zh: "进入独立界面切换 I2S、TDM、PDM、SPDIF 和 USB Audio，观察时钟线、数据线、帧同步、声道 slot、PDM 抽取和 USB 包传输。",
              en: "Open an independent lab to switch I2S, TDM, PDM, SPDIF, and USB Audio while inspecting clock lines, data lines, frame sync, channel slots, PDM decimation, and USB packet transport."
            },
            buttonLabel: { zh: "打开数字音频接口实验室", en: "Open digital audio interface lab" }
          },
          misconception: {
            zh: "I2S/TDM/PDM 不是 MP3、AAC、Opus 这类压缩格式，也不是 ADC/DAC 本身；它们是芯片或设备之间搬运数字音频数据的接口协议。",
            en: "I2S/TDM/PDM are not compression formats like MP3, AAC, or Opus, and they are not ADC/DAC conversion itself; they are interface protocols for transporting digital audio data between chips or devices."
          },
          contentDirection: {
            zh: "后续适合扩展为接口时序图实验室：切换 I2S、TDM、PDM、SPDIF 和 USB Audio，观察时钟线、数据线、帧同步、声道 slot 和常见配置错误。",
            en: "This can later become an interface timing lab: switch I2S, TDM, PDM, SPDIF, and USB Audio to inspect clock lines, data lines, frame sync, channel slots, and common configuration mistakes."
          }
        }
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
        ],
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
          zh: "先建立通用系统音频链路，再用 Linux ALSA、PipeWire 和 ASoC 作为具体例子。",
          en: "Build a generic system audio path first, then use Linux ALSA, PipeWire, and ASoC as concrete examples."
        },
        bullets: [
          { zh: "应用层 API、音频服务和策略路由", en: "Application APIs, audio service, and policy routing" },
          { zh: "采集链路、播放链路和全双工同步", en: "Capture, playback, and full-duplex synchronization" },
          { zh: "设备管理、混音路径、HAL 和驱动边界", en: "Device management, mixing paths, HAL, and driver boundaries" }
        ],
        detail: {
          explanation: {
            zh: "系统音频架构不是单个模块，而是一条从应用、媒体框架、系统音频服务、策略路由、混音路径、HAL/驱动到硬件设备的完整链路。它负责把多个应用的播放请求、麦克风采集、蓝牙/USB/内置声卡切换、权限与隐私、音量和设备状态统一协调起来。",
            en: "System audio architecture is not a single module; it is the complete path from applications, media frameworks, system audio services, policy routing, mixing paths, HAL/drivers, and hardware devices. It coordinates playback requests, microphone capture, Bluetooth/USB/built-in devices, permissions, privacy, volume, and device state."
          },
          keyConcepts: [
            { zh: "播放链路通常从 App 输出音频流，经过系统服务、音量、混音路径和设备路由后进入驱动与硬件。", en: "Playback usually starts from an app stream, then goes through service management, volume, mixing paths, device routing, drivers, and hardware." },
            { zh: "录音链路从麦克风和 ADC 进入驱动，再经过权限、输入路由、设备选择和时间戳管理后交给应用。", en: "Capture starts at the microphone and ADC, then passes through drivers, permissions, input routing, device selection, and timestamp management before reaching apps." },
            { zh: "全双工语音同时存在采集和回放，系统层负责把回放参考、采集流和语音处理模块接在正确位置。", en: "Full-duplex voice runs capture and playback together; the system layer connects playback reference, capture stream, and voice-processing modules at the right points." },
            { zh: "低延迟在系统架构中只表现为可选择的专用路径或设备能力，本卡不展开具体调参。", en: "In system architecture, low latency appears only as selectable paths or device capability; this card does not expand tuning details." }
          ],
          termExplanations: [
            {
              name: { zh: "应用层 API", en: "Application API" },
              explanation: {
                zh: "应用通常通过 AudioTrack、AAudio、OpenSL ES、Core Audio、WASAPI、WebAudio 等 API 提交或获取音频数据。API 会把应用请求交给系统音频栈，并完成基本的格式、设备和会话协商。",
                en: "Apps usually submit or receive audio through APIs such as AudioTrack, AAudio, OpenSL ES, Core Audio, WASAPI, or WebAudio. The API hands app requests to the system audio stack and negotiates basic format, device, and session properties."
              }
            },
            {
              name: { zh: "音频服务", en: "Audio service" },
              explanation: {
                zh: "音频服务是系统里的集中管理层。在 Linux 中常见为 PipeWire、PulseAudio 或 JACK，负责管理多个客户端、混音路径、设备状态和数据搬运。",
                en: "The audio service is the central manager. On Linux it is commonly PipeWire, PulseAudio, or JACK, managing clients, mixing paths, device state, and data movement."
              }
            },
            {
              name: { zh: "音频策略与路由", en: "Audio policy and routing" },
              explanation: {
                zh: "策略层决定声音应该走扬声器、听筒、耳机、蓝牙、USB 声卡还是虚拟设备，也处理来电、通知、媒体、语音助手之间的优先级和音频焦点。",
                en: "The policy layer decides whether audio goes to speaker, earpiece, headphones, Bluetooth, USB audio, or virtual devices, and handles priority and focus among calls, notifications, media, and voice assistants."
              }
            },
            {
              name: { zh: "混音器与重采样", en: "Mixer and resampler" },
              explanation: {
                zh: "当多个应用同时播放，系统会把不同流汇入目标输出路径。混音和重采样在这里作为系统职责出现，本卡只说明它们位于哪一层。",
                en: "When multiple apps play at once, the system merges streams into the target output path. Mixing and resampling appear here as system responsibilities; this card only shows where they sit."
              }
            },
            {
              name: { zh: "HAL / 驱动", en: "HAL / driver" },
              explanation: {
                zh: "HAL 和驱动把系统抽象命令转换成具体硬件操作，例如配置 I2S/TDM、Codec 寄存器、DMA 通道、蓝牙音频通道或 USB Audio 端点。",
                en: "HAL and drivers translate system abstractions into hardware operations, such as configuring I2S/TDM, codec registers, DMA channels, Bluetooth audio paths, or USB Audio endpoints."
              }
            },
            {
              name: { zh: "低延迟通路入口", en: "Low-latency path entry" },
              explanation: {
                zh: "系统架构层只说明低延迟请求会走哪条输出或输入路径，以及哪些设备支持该路径。具体实时调参不在本卡展开。",
                en: "At the architecture layer, low latency only describes which input or output path is selected and which devices support it. Detailed real-time tuning is outside this card."
              }
            }
          ],
          lab: {
            type: "system-audio",
            title: { zh: "系统音频架构实验室", en: "System Audio Architecture Lab" },
            description: {
              zh: "进入独立界面切换播放链路、录音链路和全双工语音链路，观察 App、音频服务、策略路由、混音/重采样、HAL/驱动与硬件之间如何协作。",
              en: "Open an independent lab to switch between playback, capture, and full-duplex voice paths, and inspect how apps, audio services, policy routing, mixing/resampling, HAL/drivers, and hardware work together."
            },
            buttonLabel: { zh: "打开系统音频架构实验室", en: "Open system audio architecture lab" }
          },
          misconception: {
            zh: "应用通常不是直接把数据写到扬声器，也不是直接从麦克风读到最终数据；系统会在中间做权限、策略、混音、重采样、设备路由和硬件适配。",
            en: "Applications usually do not write directly to speakers or read final microphone data directly; the system sits in between for permissions, policy, mixing, resampling, device routing, and hardware adaptation."
          },
          contentDirection: {
            zh: "适合继续扩展为桌面 Linux 与嵌入式 Linux 的分层对比图，也可以后续再加入 Android AudioFlinger、Windows WASAPI、macOS Core Audio 的系统级对比。",
            en: "This can expand into desktop Linux versus embedded Linux layered comparisons, and later compare Android AudioFlinger, Windows WASAPI, and macOS Core Audio."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "实时音频处理要求每一小块音频都在截止时间前完成计算。只要回调线程被阻塞、CPU 峰值过高或 buffer 供给不连续，就可能出现卡顿、爆音、断续和延迟增加。",
            en: "Real-time audio processing requires each small audio block to be computed before its deadline. If the callback thread blocks, CPU spikes, or buffers are not supplied continuously, users may hear glitches, pops, dropouts, or increased latency."
          },
          termExplanations: [
            {
              name: { zh: "Buffer size", en: "Buffer size" },
              explanation: {
                zh: "Buffer size 表示一次回调处理多少帧音频。48 kHz 下 128 帧 buffer 约等于 2.67 ms，64 帧约等于 1.33 ms；buffer 越小，端到端延迟越低，但每次回调的可用计算时间也越短。",
                en: "Buffer size is the number of audio frames processed by one callback. At 48 kHz, a 128-frame buffer is about 2.67 ms and a 64-frame buffer is about 1.33 ms. Smaller buffers lower end-to-end latency but reduce the available compute time per callback."
              }
            },
            {
              name: { zh: "回调 deadline", en: "Callback deadline" },
              explanation: {
                zh: "deadline 由 buffer 帧数和采样率决定。实时线程必须在下一块 buffer 到来前完成 DSP、格式转换和数据交付，否则播放端会缺样本，采集端会丢样本。",
                en: "The deadline is set by buffer frames and sample rate. The real-time thread must finish DSP, format conversion, and handoff before the next buffer arrives, otherwise playback runs out of samples or capture drops samples."
              }
            },
            {
              name: { zh: "XRUN", en: "XRUN" },
              explanation: {
                zh: "XRUN 是 underrun 或 overrun 的统称。播放 underrun 表示输出端来不及拿到新数据，采集 overrun 表示输入端数据没有及时被取走，常见听感是爆音、断续或短暂静音。",
                en: "XRUN is a shared term for underrun or overrun. A playback underrun means the output side did not receive new data in time; a capture overrun means input data was not consumed in time. Users may hear pops, dropouts, or short silence."
              }
            },
            {
              name: { zh: "实时安全操作", en: "Real-time safe operations" },
              explanation: {
                zh: "实时回调中应只做可预测的计算，避免锁等待、磁盘 IO、网络请求、大量日志和运行期分配。耗时或不可预测任务应放到非实时线程，通过无锁队列或预分配 buffer 交换数据。",
                en: "A real-time callback should do predictable computation only, avoiding lock waits, disk IO, network requests, heavy logging, and runtime allocation. Slow or unpredictable work should move to non-real-time threads and exchange data through lock-free queues or preallocated buffers."
              }
            }
          ],
          keyConcepts: [
            { zh: "Buffer 越小延迟越低，但留给处理的时间也越少。", en: "Smaller buffers reduce latency but leave less time for processing." },
            { zh: "实时回调中应避免阻塞 IO、锁竞争、动态内存分配和不可预测操作。", en: "Real-time callbacks should avoid blocking IO, lock contention, dynamic allocation, and unpredictable operations." },
            { zh: "XRUN、underrun、overrun 是定位播放或采集不连续的重要线索。", en: "XRUN, underrun, and overrun events are important clues for playback or capture discontinuity." }
          ],
          misconception: {
            zh: "把 buffer 调到最小不一定最好；设备性能、系统调度、算法复杂度和稳定性需要一起平衡。",
            en: "The smallest buffer is not always best; device performance, scheduler behavior, algorithm cost, and stability must be balanced."
          },
          contentDirection: {
            zh: "适合做实时回调时间线、不同 buffer 大小的延迟对比，以及卡顿问题排查清单。",
            en: "This fits a real-time callback timeline, latency comparisons for buffer sizes, and a glitch debugging checklist."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "音频编解码器决定声音如何被压缩、传输和还原。无损编码保留原始信息，有损编码利用人耳掩蔽效应丢弃不易察觉的信息，蓝牙和实时通信还要额外考虑延迟、丢包和功耗。",
            en: "Audio codecs determine how sound is compressed, transmitted, and reconstructed. Lossless codecs preserve original information, lossy codecs discard less audible information using hearing models, and Bluetooth or real-time communication codecs must also handle latency, packet loss, and power."
          },
          keyConcepts: [
            { zh: "码率影响文件大小和压缩余量，但不同编码器在同码率下质量不同。", en: "Bitrate affects file size and compression headroom, but different codecs have different quality at the same bitrate." },
            { zh: "帧长和算法复杂度会影响端到端延迟。", en: "Frame size and algorithmic complexity affect end-to-end latency." },
            { zh: "Opus、LC3 等更适合低延迟或通信场景，FLAC 更适合无损归档。", en: "Opus and LC3 are useful for low-latency or communication scenarios, while FLAC is better for lossless archiving." }
          ],
          misconception: {
            zh: "相同码率不代表相同音质或相同延迟；编码器实现、内容类型和传输环境都会改变结果。",
            en: "The same bitrate does not mean the same quality or latency; encoder implementation, content type, and network conditions change the result."
          },
          contentDirection: {
            zh: "适合做格式对比表、蓝牙 Codec 延迟路径图和不同码率试听素材说明。",
            en: "This can become a codec comparison table, Bluetooth latency path diagram, and listening guide for different bitrates."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "基础信号处理把音频从时间域、频率域和能量变化三个角度分析。FFT/STFT 用来观察频谱，滤波器和 EQ 用来改变频率能量，动态处理器用来控制响度和瞬态。",
            en: "Core signal processing analyzes audio through time, frequency, and energy changes. FFT/STFT reveal spectra, filters and EQ reshape frequency energy, and dynamics processors control loudness and transients."
          },
          keyConcepts: [
            { zh: "窗口长度影响时间分辨率和频率分辨率，是 STFT 的核心取舍。", en: "Window length trades time resolution against frequency resolution, which is central to STFT." },
            { zh: "滤波器的截止频率、斜率、Q 值决定频率响应形状。", en: "Filter cutoff frequency, slope, and Q determine the response shape." },
            { zh: "压缩器、限幅器通过阈值、比率、启动和释放时间改变动态范围。", en: "Compressors and limiters alter dynamic range through threshold, ratio, attack, and release." }
          ],
          misconception: {
            zh: "FFT 只是分析工具，不会自动让声音变好；真正改变声音还需要滤波、增益、重建或其他处理策略。",
            en: "FFT is an analysis tool and does not improve sound by itself; changing sound requires filtering, gain changes, reconstruction, or another processing strategy."
          },
          contentDirection: {
            zh: "适合做频谱瀑布图、滤波器响应交互控件和压缩器参数前后对比。",
            en: "This fits spectrogram visuals, interactive filter response controls, and before-after compressor parameter examples."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "语音增强的目标是在复杂环境中让人声更清楚、更稳定。它通常组合降噪、回声消除、自动增益、语音活动检测、波束成形和去混响，用于通话、会议、语音助手和录音场景。",
            en: "Speech enhancement aims to make speech clearer and more stable in complex environments. It often combines noise suppression, echo cancellation, automatic gain control, voice activity detection, beamforming, and dereverberation for calls, meetings, assistants, and recording."
          },
          keyConcepts: [
            { zh: "AEC 处理扬声器声音被麦克风再次收进来的回声问题。", en: "AEC handles echo caused by loudspeaker audio being picked up again by the microphone." },
            { zh: "VAD 判断当前帧是否包含语音，是降噪和唤醒链路的重要基础。", en: "VAD detects whether a frame contains speech and supports noise suppression and wake-word pipelines." },
            { zh: "波束成形利用多麦克风的时间差和相位差增强目标方向。", en: "Beamforming uses time and phase differences across microphones to enhance a target direction." }
          ],
          misconception: {
            zh: "语音增强不能无损移除所有噪声；强处理可能带来金属音、吞字、泵音和空间感变化。",
            en: "Speech enhancement cannot remove all noise losslessly; aggressive processing can create metallic artifacts, clipped words, pumping, and spatial changes."
          },
          contentDirection: {
            zh: "适合做通话音频处理流程图，并用噪声、回声、混响三个案例展示算法前后差异。",
            en: "This can become a call-processing flow diagram with before-after examples for noise, echo, and reverberation."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "空间音频通过声源方向、距离、房间反射和头部运动线索，让听众感到声音来自三维空间。耳机中常用双耳渲染和 HRTF，扬声器系统则常结合声道布局、对象音频和房间校正。",
            en: "Spatial audio uses cues for direction, distance, room reflections, and head movement to make sound feel located in 3D space. Headphones often use binaural rendering and HRTFs, while speaker systems use channel layouts, object audio, and room correction."
          },
          keyConcepts: [
            { zh: "ITD 和 ILD 分别描述左右耳到达时间差和声级差。", en: "ITD and ILD describe interaural time and level differences." },
            { zh: "HRTF 记录头部、耳廓和躯干对不同方向声音的滤波效果。", en: "HRTFs capture how the head, ears, and torso filter sound from different directions." },
            { zh: "头部追踪需要低延迟更新声场，否则空间位置会漂移或眩晕。", en: "Head tracking requires low-latency scene updates, otherwise the image can drift or feel uncomfortable." }
          ],
          misconception: {
            zh: "简单把左右声道拉宽不等于真正空间音频；真实空间感需要方向、距离、反射和头部运动等线索配合。",
            en: "Simply widening stereo is not true spatial audio; convincing space needs direction, distance, reflections, and head-motion cues."
          },
          contentDirection: {
            zh: "适合做 HRTF 示意、头部转动时声源保持不动的交互演示，以及游戏、影院、耳机的案例对比。",
            en: "This fits an HRTF explainer, an interactive head-rotation demo where the source stays fixed, and comparisons across games, cinema, and headphones."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "语音识别把连续的语音波形转换成可编辑、可检索的文字。典型系统会先做特征提取或神经网络编码，再结合声学、语言和上下文信息，输出分词、标点和时间戳等结果。",
            en: "Speech recognition turns continuous speech waveforms into editable, searchable text. A typical system extracts features or neural encodings, combines acoustic, language, and contextual information, then outputs words, punctuation, and timestamps."
          },
          keyConcepts: [
            { zh: "离线 ASR 可利用更完整上下文，流式 ASR 更重视低延迟和增量输出。", en: "Offline ASR can use fuller context, while streaming ASR prioritizes low latency and incremental output." },
            { zh: "WER、CER、实时率和首字延迟是评估识别系统的重要指标。", en: "WER, CER, real-time factor, and first-token latency are key ASR evaluation metrics." },
            { zh: "唤醒词、端点检测、标点恢复和说话人分离常与 ASR 组成完整语音入口。", en: "Wake words, endpointing, punctuation restoration, and speaker diarization often combine with ASR to form a complete voice interface." }
          ],
          misconception: {
            zh: "识别率高不等于在所有噪声、口音和设备上都稳定；真实产品还要验证远场、多人、打断、专有名词和隐私边界。",
            en: "High recognition accuracy does not mean stable behavior across all noise, accents, and devices; real products must also validate far-field use, multiple speakers, interruptions, proper nouns, and privacy boundaries."
          },
          contentDirection: {
            zh: "适合扩展为从波形到文字的流程图，并加入流式字幕、会议纪要和车载语音三个应用案例。",
            en: "This can become a waveform-to-text pipeline diagram with examples for live captions, meeting notes, and in-car voice control."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "语音合成把文本转换成自然语音。现代 TTS 通常先处理文本、读音和韵律，再由声学模型生成声学表示，最后通过声码器输出波形，可用于导航、客服、播客、配音和无障碍阅读。",
            en: "Text-to-speech converts text into natural speech. Modern TTS usually normalizes text, predicts pronunciation and prosody, generates acoustic representations, and uses a vocoder to output waveforms for navigation, support, podcasts, dubbing, and accessibility."
          },
          keyConcepts: [
            { zh: "文本规范化负责把数字、日期、单位和缩写转换成可朗读形式。", en: "Text normalization converts numbers, dates, units, and abbreviations into speakable forms." },
            { zh: "韵律包含停顿、重音、语速和语调，决定语音是否自然。", en: "Prosody includes pauses, stress, speed, and intonation, which strongly shape naturalness." },
            { zh: "声码器把声学特征转换成最终波形，影响音质、速度和设备成本。", en: "The vocoder converts acoustic features into the final waveform and affects quality, speed, and device cost." }
          ],
          misconception: {
            zh: "音色像真人不代表表达自然；断句、重音、情绪、上下文理解和长文本稳定性同样决定体验。",
            en: "A realistic voice timbre does not guarantee natural expression; phrasing, stress, emotion, context, and long-form stability also define the experience."
          },
          contentDirection: {
            zh: "适合做文本到波形的模块图，并用同一句话的不同语速、情绪和停顿展示韵律作用。",
            en: "This fits a text-to-waveform module diagram and examples showing how speed, emotion, and pauses change the same sentence."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "音频生成使用 AI 根据文本、旋律、参考声音或视频画面生成新的音乐、音效、人声或环境声。它能提升内容生产效率，但也需要处理可控性、版权、身份冒用和质量一致性问题。",
            en: "Audio generation uses AI to create music, sound effects, voices, or ambience from text, melody, reference audio, or video. It can speed up content creation, but it also raises control, copyright, impersonation, and consistency challenges."
          },
          keyConcepts: [
            { zh: "条件控制决定生成结果如何响应文本、风格、节奏、旋律或参考音色。", en: "Conditioning determines how generation responds to text, style, rhythm, melody, or reference timbre." },
            { zh: "扩散、Transformer、神经声码器等方法常用于不同粒度的音频生成。", en: "Diffusion models, Transformers, neural vocoders, and related methods are used at different audio granularities." },
            { zh: "水印、授权数据和滥用检测是生成式音频产品的重要安全环节。", en: "Watermarking, licensed data, and abuse detection are important safety layers for generative audio products." }
          ],
          misconception: {
            zh: "AI 生成内容不天然等于可商用或可控；训练数据来源、相似性、声音授权和平台规则都需要确认。",
            en: "AI-generated audio is not automatically commercial-safe or controllable; training data, similarity, voice consent, and platform rules must be checked."
          },
          contentDirection: {
            zh: "适合做生成式音频应用地图，分别讲音乐、音效、声音克隆、修复和自动配乐的边界。",
            en: "This can become a generative-audio application map covering music, sound effects, voice cloning, restoration, and automatic scoring."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "会议与通信音频要在网络、设备和环境都不稳定的情况下保持清晰、同步和低延迟。完整链路通常包含采集、回声消除、降噪、编码、传输、解码、播放、字幕和翻译。",
            en: "Conferencing and communication audio must stay clear, synchronized, and low-latency despite unstable networks, devices, and rooms. The full chain often includes capture, echo cancellation, noise suppression, encoding, transport, decoding, playback, captions, and translation."
          },
          keyConcepts: [
            { zh: "回声消除和双讲处理决定远程会议能否自然打断。", en: "Echo cancellation and double-talk handling determine whether remote meetings support natural interruptions." },
            { zh: "抖动缓冲和丢包隐藏影响网络波动时的连续性。", en: "Jitter buffers and packet-loss concealment affect continuity under network variation." },
            { zh: "说话人分离、实时字幕和翻译把音频链路连接到会议生产力。", en: "Diarization, live captions, and translation connect the audio chain to meeting productivity." }
          ],
          misconception: {
            zh: "会议音质不是只靠一个好麦克风；房间、扬声器回放、网络、算法和平台策略都会共同决定体验。",
            en: "Meeting quality does not come from a good microphone alone; room acoustics, speaker playback, network behavior, algorithms, and platform policy all shape the experience."
          },
          contentDirection: {
            zh: "适合做视频会议端到端链路图，并拆解“回声大、听不清、字幕慢”三个典型问题。",
            en: "This fits an end-to-end conferencing chain diagram and breakdowns of echo, poor intelligibility, and delayed captions."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "智能汽车中的音频系统同时服务语音交互、通话、娱乐、提示音和主动降噪。车内空间封闭、噪声随车速变化、乘员位置固定但反射复杂，因此算法和硬件布置需要一起设计。",
            en: "Vehicle audio systems support voice interaction, calls, entertainment, alerts, and active noise control. Cabins are enclosed, noise changes with speed, occupants have known seats but complex reflections, so algorithms and hardware placement must be designed together."
          },
          keyConcepts: [
            { zh: "多麦克风阵列可用于唤醒、定位、分区拾音和免提通话。", en: "Microphone arrays support wake words, localization, zone pickup, and hands-free calls." },
            { zh: "主动降噪和路噪控制需要低延迟传感、建模和扬声器补偿。", en: "Active noise and road-noise control need low-latency sensing, modeling, and speaker compensation." },
            { zh: "座舱空间音频要考虑座位差异、声场校准和安全提示优先级。", en: "Cabin spatial audio must consider seat differences, field calibration, and safety alert priority." }
          ],
          misconception: {
            zh: "车内更安静不代表语音更容易；空调、路噪、音乐、乘客说话和车窗状态都会让场景快速变化。",
            en: "A quieter cabin does not automatically make speech easier; HVAC, road noise, music, passengers, and window state can change the scene quickly."
          },
          contentDirection: {
            zh: "适合做座舱音频拓扑图，展示麦克风、扬声器、座位和算法模块之间的关系。",
            en: "This can become a cabin audio topology showing microphones, speakers, seats, and algorithm modules."
          }
        }
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
        ],
        detail: {
          explanation: {
            zh: "IoT 音频强调低功耗、低成本、隐私和边缘响应，内容创作音频强调效率、可编辑性和一致交付。两者都在使用语音唤醒、降噪、自动混音、AI 配音和云端协作来降低使用门槛。",
            en: "IoT audio emphasizes low power, low cost, privacy, and edge responsiveness, while content-creation audio emphasizes efficiency, editability, and consistent delivery. Both use wake words, noise reduction, automatic mixing, AI dubbing, and cloud collaboration to lower the barrier."
          },
          keyConcepts: [
            { zh: "边缘语音唤醒需要在功耗、误唤醒、漏唤醒和模型大小之间取舍。", en: "Edge wake-word detection trades power, false accepts, false rejects, and model size." },
            { zh: "播客和直播常用响度标准、降噪、压缩、限幅和自动电平控制。", en: "Podcasts and live streams often use loudness targets, noise reduction, compression, limiting, and automatic leveling." },
            { zh: "AI 配音和自动母带把复杂后期流程变成可重复的工具链。", en: "AI dubbing and automatic mastering turn complex post-production into repeatable toolchains." }
          ],
          misconception: {
            zh: "边缘 AI 不代表完全不需要云端；很多产品会把本地唤醒、轻量命令和云端大模型能力组合使用。",
            en: "Edge AI does not mean the cloud disappears; many products combine local wake words and lightweight commands with larger cloud models."
          },
          contentDirection: {
            zh: "适合做 IoT 语音链路和创作者音频工具链两条路径，对比实时控制与内容生产的不同目标。",
            en: "This fits two paths: an IoT voice pipeline and a creator audio toolchain, comparing real-time control with content production goals."
          }
        }
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
