import type { Category, Language, Topic } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

type DisplayTopic = Topic & {
  category: Category;
};

type TopicGridProps = {
  language: Language;
  topics: DisplayTopic[];
  selectedTopicKey?: string;
  onSelectTopic: (topic: DisplayTopic) => void;
};

export function TopicGrid({ language, topics, selectedTopicKey, onSelectTopic }: TopicGridProps) {
  return (
    <section className="section-block" aria-labelledby="topics-heading">
      <div className="section-heading">
        <div>
          <h2 id="topics-heading">{interfaceCopy.topicsTitle[language]}</h2>
          <p>{interfaceCopy.topicsSubtitle[language]}</p>
        </div>
        <span className="result-count">{topics.length}</span>
      </div>
      {topics.length === 0 ? (
        <div className="empty-state">{interfaceCopy.noResults[language]}</div>
      ) : (
        <div className="topic-grid" data-testid="topic-grid">
          {topics.map((topic) => (
            <button
              aria-pressed={selectedTopicKey === `${topic.category.id}-${topic.title.en}`}
              className="topic-card"
              key={`${topic.category.id}-${topic.title.en}`}
              onClick={() => onSelectTopic(topic)}
              style={{ "--accent": topic.category.accent } as React.CSSProperties}
              type="button"
            >
              <div className="topic-meta">{topic.category.title[language]}</div>
              <h3>{topic.title[language]}</h3>
              <p>{topic.summary[language]}</p>
              <ul>
                {topic.bullets.map((bullet) => (
                  <li key={bullet.en}>{bullet[language]}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
