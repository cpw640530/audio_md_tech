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
};

export function TopicDetails({ language, topic, onClose }: TopicDetailsProps) {
  return (
    <aside
      aria-label={interfaceCopy.detailsLabel[language]}
      className="topic-details"
      role="complementary"
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
          onClick={onClose}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="details-summary">{topic.summary[language]}</p>
      <div className="details-block">
        <h3>{language === "zh" ? "关键知识点" : "Key points"}</h3>
        <ul>
          {topic.bullets.map((bullet) => (
            <li key={bullet.en}>{bullet[language]}</li>
          ))}
        </ul>
      </div>
      <div className="details-block">
        <h3>{interfaceCopy.detailsExpandTitle[language]}</h3>
        <p>{interfaceCopy.detailsExpandBody[language]}</p>
      </div>
      <div className="details-formats">
        <span>{interfaceCopy.detailsFormatTitle[language]}</span>
        <strong>{interfaceCopy.detailsFormats[language]}</strong>
      </div>
    </aside>
  );
}
