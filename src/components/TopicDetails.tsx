import { X } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

type DisplayTopic = Topic & {
  category: Category;
};

type TopicDetailsProps = {
  language: Language;
  topic: DisplayTopic;
  onClose: () => void;
  onOpenCodecLab: () => void;
  onOpenDigitalLab: () => void;
  onOpenDigitalInterfaceLab: () => void;
  onOpenListeningMetricsLab: () => void;
  onOpenMicrophoneLab: () => void;
  onOpenSoundLab: () => void;
};

function SoundWaveDiagram({
  language,
  label,
  caption,
  onOpenSoundLab
}: {
  language: Language;
  label: Record<Language, string>;
  caption: Record<Language, string>;
  onOpenSoundLab: () => void;
}) {
  return (
    <figure className="sound-wave-diagram">
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
      <svg
        aria-label={label[language]}
        role="img"
        viewBox="0 0 720 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#7ee7d8" />
            <stop offset="100%" stopColor="#f0b46a" />
          </linearGradient>
          <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
          </marker>
        </defs>
        <rect className="diagram-bg" height="300" rx="14" width="720" />
        <line className="diagram-axis" x1="40" x2="680" y1="110" y2="110" />
        <line className="diagram-axis faint" x1="40" x2="680" y1="28" y2="28" />
        <line className="diagram-axis faint" x1="40" x2="680" y1="192" y2="192" />
        <path className="diagram-wave diagram-wave-high" d="M40 110 C80 28 120 28 160 110 S240 192 280 110 360 28 400 110 480 192 520 110 600 28 680 110" />
        <line
          className="diagram-measure"
          x1="92"
          x2="92"
          y1="60"
          y2="110"
        />
        <text className="diagram-label" x="106" y="82">{language === "zh" ? "A 振幅" : "A amplitude"}</text>
        <line className="diagram-arrow" markerEnd="url(#arrow)" markerStart="url(#arrow)" x1="160" x2="280" y1="236" y2="236" />
        <text className="diagram-label" x="48" y="226">{language === "zh" ? "一个周期 / 波长" : "One cycle / wavelength"}</text>
        <text className="diagram-chip" x="456" y="48">{language === "zh" ? "f 频率" : "f frequency"}</text>
        <text className="diagram-chip" x="456" y="78">{language === "zh" ? "φ 相位" : "φ phase"}</text>
        <text className="diagram-chip" x="456" y="108">{language === "zh" ? "A 振幅" : "A amplitude"}</text>
        <text className="diagram-chip" x="548" y="266">{language === "zh" ? "高频" : "High frequency"}</text>
        <text className="diagram-chip" x="48" y="266">{language === "zh" ? "低频" : "Low frequency"}</text>
      </svg>
      <figcaption>{caption[language]}</figcaption>
    </figure>
  );
}

export function TopicDetails({
  language,
  topic,
  onClose,
  onOpenCodecLab,
  onOpenDigitalLab,
  onOpenDigitalInterfaceLab,
  onOpenListeningMetricsLab,
  onOpenMicrophoneLab,
  onOpenSoundLab
}: TopicDetailsProps) {
  function closeDetails() {
    onClose();
  }

  return (
    <div className="topic-details-layer">
      <button
        aria-label={interfaceCopy.closeDetails[language]}
        className="topic-details-backdrop"
        data-testid="topic-details-backdrop"
        type="button"
        onClick={closeDetails}
      />
      <section
        aria-label={interfaceCopy.detailsLabel[language]}
        aria-modal="true"
        className="topic-details topic-details-modal"
        role="dialog"
        style={{ "--accent": topic.category.accent } as React.CSSProperties}
      >
        <div className="details-header">
          <div>
            <span className="details-category">{topic.category.title[language]}</span>
            <h2>{topic.title[language]}</h2>
          </div>
          <button
            aria-label={interfaceCopy.closeDetails[language]}
            className="details-close"
            type="button"
            onClick={closeDetails}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="details-scroll">
          <p className="details-summary">{topic.summary[language]}</p>
          <div className="details-block details-block-emphasis">
            <h3>{interfaceCopy.detailsExplanationTitle[language]}</h3>
            <p>{topic.detail.explanation[language]}</p>
          </div>
          <div className="details-block">
            <h3>{language === "zh" ? "关键知识点" : "Key points"}</h3>
            <ul>
              {topic.bullets.map((bullet) => (
                <li key={bullet.en}>{bullet[language]}</li>
              ))}
            </ul>
          </div>
          {topic.detail.termExplanations ? (
            <div className="details-block">
              <h3>{interfaceCopy.detailsRelatedTermsTitle[language]}</h3>
              <div className="term-grid">
                {topic.detail.termExplanations.map((term) => (
                  <article className="term-card" key={term.name.en}>
                    <h4>{term.name[language]}</h4>
                    <p>{term.explanation[language]}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          <div className="details-block">
            <h3>{interfaceCopy.detailsConceptsTitle[language]}</h3>
            <ul>
              {topic.detail.keyConcepts.map((concept) => (
                <li key={concept.en}>{concept[language]}</li>
              ))}
            </ul>
          </div>
          {topic.detail.diagram ? (
            <div className="details-block details-diagram-block">
              <h3>{interfaceCopy.detailsDiagramTitle[language]}</h3>
              {topic.detail.diagram.type === "sound-wave" ? (
                <SoundWaveDiagram
                  caption={topic.detail.diagram.caption}
                  label={topic.detail.diagram.label}
                  language={language}
                  onOpenSoundLab={onOpenSoundLab}
                />
              ) : null}
            </div>
          ) : null}
          {topic.detail.lab ? (
            <div className="details-block details-lab-block">
              <div className="sound-lab-entry">
                <div>
                  <strong>{topic.detail.lab.title[language]}</strong>
                  <p>{topic.detail.lab.description[language]}</p>
                </div>
                <button
                  className="diagram-open-button"
                  type="button"
                  onClick={() => {
                    if (topic.detail.lab?.type === "sampling-quantization") {
                      onOpenDigitalLab();
                      return;
                    }

                    if (topic.detail.lab?.type === "microphone") {
                      onOpenMicrophoneLab();
                      return;
                    }

                    if (topic.detail.lab?.type === "codec-hardware") {
                      onOpenCodecLab();
                      return;
                    }

                    if (topic.detail.lab?.type === "digital-interface") {
                      onOpenDigitalInterfaceLab();
                      return;
                    }

                    onOpenListeningMetricsLab();
                  }}
                >
                  {topic.detail.lab.buttonLabel[language]}
                </button>
              </div>
            </div>
          ) : null}
          <div className="details-block">
            <h3>{interfaceCopy.detailsMisconceptionTitle[language]}</h3>
            <p>{topic.detail.misconception[language]}</p>
          </div>
          <div className="details-block">
            <h3>{interfaceCopy.detailsContentDirectionTitle[language]}</h3>
            <p>{topic.detail.contentDirection[language]}</p>
          </div>
          <div className="details-formats">
            <span>{interfaceCopy.detailsFormatTitle[language]}</span>
            <strong>{interfaceCopy.detailsFormats[language]}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
