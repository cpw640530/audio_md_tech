import { CheckCircle2, Circle } from "lucide-react";
import type { Language, RoadmapItem } from "../content/knowledge";
import { interfaceCopy, writingPrinciples } from "../content/knowledge";

type RoadmapProps = {
  language: Language;
  items: RoadmapItem[];
};

export function Roadmap({ language, items }: RoadmapProps) {
  return (
    <section className="roadmap-section" aria-labelledby="roadmap-heading">
      <div className="roadmap-panel">
        <div className="section-heading">
          <div>
            <h2 id="roadmap-heading">{interfaceCopy.roadmapTitle[language]}</h2>
            <p>{interfaceCopy.roadmapSubtitle[language]}</p>
          </div>
        </div>
        <ol className="roadmap-list">
          {items.map((item) => (
            <li key={item.text.en} className={item.done ? "done" : ""}>
              {item.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              <span>{item.text[language]}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="principles-panel">
        <h2>{interfaceCopy.principlesTitle[language]}</h2>
        <ul>
          {writingPrinciples.map((principle) => (
            <li key={principle.en}>{principle[language]}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
