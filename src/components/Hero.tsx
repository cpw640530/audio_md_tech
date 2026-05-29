import { Activity, Cpu, Sparkles } from "lucide-react";
import type { Language } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

type HeroProps = {
  language: Language;
  totalTopics: number;
};

export function Hero({ language, totalTopics }: HeroProps) {
  const statLabels =
    language === "zh"
      ? [
          ["6", "知识分类"],
          [String(totalTopics), "主题卡片"],
          ["AI + DSP", "算法路径"]
        ]
      : [
          ["6", "Knowledge areas"],
          [String(totalTopics), "Topic cards"],
          ["AI + DSP", "Algorithm paths"]
        ];

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">
          <Sparkles size={16} aria-hidden="true" />
          {interfaceCopy.eyebrow[language]}
        </p>
        <h1>{interfaceCopy.title[language]}</h1>
        <p className="hero-subtitle">{interfaceCopy.subtitle[language]}</p>
        <div className="hero-stats" aria-label="Knowledge base stats">
          {statLabels.map(([value, label]) => (
            <div className="stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="signal-panel" data-testid="animated-signal-panel" aria-hidden="true">
        <div className="signal-scanline" data-testid="signal-scanline" />
        <div className="signal-header">
          <Activity size={18} />
          <span>audio.signal.map</span>
        </div>
        <div className="waveform">
          {Array.from({ length: 32 }, (_, index) => (
            <span
              data-testid="animated-wave-bar"
              key={index}
              style={
                {
                  "--bar-height": `${24 + ((index * 17) % 58)}px`,
                  "--bar-delay": `${(index % 8) * 0.12}s`
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <div className="pipeline">
          {["Mic", "ADC", "DSP", "AI", "Output"].map((node, index) => (
            <span
              key={node}
              style={{ "--node-delay": `${index * 0.22}s` } as React.CSSProperties}
            >
              {node}
            </span>
          ))}
        </div>
        <div className="chip-row">
          <span>
            <Cpu size={14} /> real-time
          </span>
          <span>low latency</span>
          <span>edge ready</span>
        </div>
      </div>
    </section>
  );
}
