import { useEffect, useMemo, useState } from "react";
import { AmplifierSpeakerLab } from "./components/AmplifierSpeakerLab";
import { AudioCodecLab } from "./components/AudioCodecLab";
import { CategoryTabs } from "./components/CategoryTabs";
import { CodecHardwareLab } from "./components/CodecHardwareLab";
import { DigitalAudioLab } from "./components/DigitalAudioLab";
import { DigitalInterfaceLab } from "./components/DigitalInterfaceLab";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ListeningMetricsLab } from "./components/ListeningMetricsLab";
import { MicrophoneLab } from "./components/MicrophoneLab";
import { RealtimeAudioLab } from "./components/RealtimeAudioLab";
import { Roadmap } from "./components/Roadmap";
import { SearchBar } from "./components/SearchBar";
import { SoundWaveLab } from "./components/SoundWaveLab";
import { SystemAudioLab } from "./components/SystemAudioLab";
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
    topic.detail.explanation.zh,
    topic.detail.explanation.en,
    topic.detail.misconception.zh,
    topic.detail.misconception.en,
    topic.detail.contentDirection.zh,
    topic.detail.contentDirection.en,
    ...topic.bullets.flatMap((bullet) => [bullet.zh, bullet.en]),
    ...topic.detail.keyConcepts.flatMap((concept) => [concept.zh, concept.en]),
    ...(topic.detail.termExplanations?.flatMap((term) => [
      term.name.zh,
      term.name.en,
      term.explanation.zh,
      term.explanation.en
    ]) ?? []),
    ...(topic.detail.diagram
      ? [
          topic.detail.diagram.label.zh,
          topic.detail.diagram.label.en,
          topic.detail.diagram.caption.zh,
          topic.detail.diagram.caption.en
        ]
      : []),
    ...(topic.detail.lab
      ? [
          topic.detail.lab.title.zh,
          topic.detail.lab.title.en,
          topic.detail.lab.description.zh,
          topic.detail.lab.description.en,
          topic.detail.lab.buttonLabel.zh,
          topic.detail.lab.buttonLabel.en
        ]
      : [])
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export default function App() {
  const [language, setLanguage] = useState<Language>("zh");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeView, setActiveView] = useState<
    | "knowledge"
    | "soundLab"
    | "digitalLab"
    | "listeningLab"
    | "microphoneLab"
    | "codecLab"
    | "digitalInterfaceLab"
    | "amplifierSpeakerLab"
    | "systemAudioLab"
    | "audioCodecLab"
    | "realtimeAudioLab"
  >("knowledge");
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

  useEffect(() => {
    if (!selectedTopic) {
      return undefined;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedTopic(null);
      }
    }

    document.body.classList.add("details-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("details-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedTopic]);

  if (activeView === "soundLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <SoundWaveLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "digitalLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <DigitalAudioLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "listeningLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <ListeningMetricsLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "microphoneLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <MicrophoneLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "codecLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <CodecHardwareLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "digitalInterfaceLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <DigitalInterfaceLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "amplifierSpeakerLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <AmplifierSpeakerLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "systemAudioLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <SystemAudioLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "audioCodecLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <AudioCodecLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

  if (activeView === "realtimeAudioLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        />
        <RealtimeAudioLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
          <a href="docs/audio_technology_knowledge_outline.md">
            {language === "zh" ? "查看 Markdown 大纲" : "Open Markdown outline"}
          </a>
        </footer>
      </div>
    );
  }

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
              onOpenAmplifierSpeakerLab={() => {
                setSelectedTopic(null);
                setActiveView("amplifierSpeakerLab");
              }}
              onOpenAudioCodecLab={() => {
                setSelectedTopic(null);
                setActiveView("audioCodecLab");
              }}
              onOpenSoundLab={() => {
                setSelectedTopic(null);
                setActiveView("soundLab");
              }}
              onOpenDigitalLab={() => {
                setSelectedTopic(null);
                setActiveView("digitalLab");
              }}
              onOpenDigitalInterfaceLab={() => {
                setSelectedTopic(null);
                setActiveView("digitalInterfaceLab");
              }}
              onOpenListeningMetricsLab={() => {
                setSelectedTopic(null);
                setActiveView("listeningLab");
              }}
              onOpenMicrophoneLab={() => {
                setSelectedTopic(null);
                setActiveView("microphoneLab");
              }}
              onOpenRealtimeAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("realtimeAudioLab");
              }}
              onOpenCodecLab={() => {
                setSelectedTopic(null);
                setActiveView("codecLab");
              }}
              onOpenSystemAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("systemAudioLab");
              }}
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
