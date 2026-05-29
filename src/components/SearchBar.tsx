import { Search } from "lucide-react";
import type { Language } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

type SearchBarProps = {
  language: Language;
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ language, value, onChange }: SearchBarProps) {
  return (
    <label className="search-box">
      <span>{interfaceCopy.searchLabel[language]}</span>
      <div className="search-input-wrap">
        <Search size={18} aria-hidden="true" />
        <input
          aria-label={interfaceCopy.searchLabel[language]}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={interfaceCopy.searchPlaceholder[language]}
        />
      </div>
    </label>
  );
}
