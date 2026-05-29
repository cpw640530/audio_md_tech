import { useMemo, useState } from "react";
import { CategoryTabs } from "./components/CategoryTabs";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Roadmap } from "./components/Roadmap";
import { SearchBar } from "./components/SearchBar";
import { TopicDetails } from "./components/TopicDetails";
import { TopicGrid } from "./components/TopicGrid";
import {
  categories,
  interfaceCopy,
  roadmapItems,
  type Category,
  type Language,
  type Topic
} from "./content/knowledge";
import "./styles.css";

type DisplayTopic = Topic & {
  category: Category;
};

function topicMatchesSearch(topic: DisplayTopic, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const searchableText = [
    topic.category.title.zh,
    topic.category.title.en,
    topic.title.zh,
    topic.title.en,
    topic.summary.zh,
    topic.summary.en,
    ...topic.bullets.flatMap((bullet) => [bullet.zh, bullet.en])
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export default function App() {
  const [language, setLanguage] = useState<Language>("zh");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<DisplayTopic | null>(null);

  const allTopics = useMemo<DisplayTopic[]>(
    () =>
      categories.flatMap((category) =>
        category.topics.map((topic) => ({
          ...topic,
          category
        }))
      ),
    []
  );

  const visibleTopics = useMemo(
    () =>
      allTopics.filter((topic) => {
        const inCategory = activeCategory === "all" || topic.category.id === activeCategory;
        return inCategory && topicMatchesSearch(topic, query);
      }),
    [activeCategory, allTopics, query]
  );

  const selectedTopicKey = selectedTopic
    ? `${selectedTopic.category.id}-${selectedTopic.title.en}`
    : undefined;

  return (
    <div className="app-shell">
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
      />
      <main>
        <Hero language={language} totalTopics={allTopics.length} />
        <div className="content-layout">
          <SearchBar language={language} value={query} onChange={setQuery} />
          <CategoryTabs
            activeCategory={activeCategory}
            categories={categories}
            language={language}
            onSelectCategory={setActiveCategory}
          />
          <TopicGrid
            language={language}
            onSelectTopic={setSelectedTopic}
            selectedTopicKey={selectedTopicKey}
            topics={visibleTopics}
          />
          {selectedTopic ? (
            <TopicDetails
              language={language}
              onClose={() => setSelectedTopic(null)}
              topic={selectedTopic}
            />
          ) : null}
          <Roadmap language={language} items={roadmapItems} />
        </div>
      </main>
      <footer className="site-footer">
        <span>{interfaceCopy.footer[language]}</span>
        <a href="docs/audio_technology_knowledge_outline.md">
          {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
        </a>
      </footer>
    </div>
  );
}
