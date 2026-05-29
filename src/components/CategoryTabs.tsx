import type { Category, Language } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

type CategoryTabsProps = {
  categories: Category[];
  language: Language;
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
};

export function CategoryTabs({
  categories,
  language,
  activeCategory,
  onSelectCategory
}: CategoryTabsProps) {
  return (
    <section className="section-block" aria-labelledby="categories-heading">
      <div className="section-heading">
        <div>
          <h2 id="categories-heading">{interfaceCopy.categoriesTitle[language]}</h2>
          <p>{interfaceCopy.categoriesSubtitle[language]}</p>
        </div>
      </div>
      <div className="category-tabs" role="tablist" aria-label={interfaceCopy.categoriesTitle[language]}>
        <button
          className={activeCategory === "all" ? "category-tab active" : "category-tab"}
          type="button"
          onClick={() => onSelectCategory("all")}
        >
          <span className="tab-icon all">All</span>
          <span>{interfaceCopy.allCategories[language]}</span>
        </button>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              className={activeCategory === category.id ? "category-tab active" : "category-tab"}
              key={category.id}
              style={{ "--accent": category.accent } as React.CSSProperties}
              type="button"
              onClick={() => onSelectCategory(category.id)}
            >
              <span className="tab-icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span>{category.title[language]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
