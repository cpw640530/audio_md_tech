import { Github, LibraryBig } from "lucide-react";
import type { Language } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

type HeaderProps = {
  language: Language;
  onToggleLanguage: () => void;
};

export function Header({ language, onToggleLanguage }: HeaderProps) {
  const nextLanguageLabel = interfaceCopy.languageButton[language];

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Audio Technology Knowledge Base">
        <span className="brand-mark">
          <LibraryBig size={20} aria-hidden="true" />
        </span>
        <span>Audio MD Tech</span>
      </a>
      <nav className="header-actions" aria-label="Primary navigation">
        <a href="docs/audio_technology_knowledge_outline.md">{interfaceCopy.navDocs[language]}</a>
        <a href="https://github.com/cpw640530/audio_md_tech" rel="noreferrer" target="_blank">
          <Github size={18} aria-hidden="true" />
          <span>{interfaceCopy.navGithub[language]}</span>
        </a>
        <button className="language-toggle" type="button" onClick={onToggleLanguage}>
          {nextLanguageLabel}
        </button>
      </nav>
    </header>
  );
}
