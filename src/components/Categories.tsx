interface CategoriesProps {
  categories: Array<{
    id: string;
    label: string;
  }>;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  theme: any;
}

function Categories({
  categories,
  activeCategory,
  setActiveCategory,
  theme,
}: CategoriesProps) {
  return (
    <div className="px-4 py-2 w-full max-w-3xl mx-auto">
      <div className={`flex gap-2 overflow-x-auto hide-scrollbar`}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-1 rounded-full whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === category.id
                ? `${theme.bgMain} ${ theme.isDark ? theme.buttonTextPrimary : theme.buttonTextPrimary} font-bold ${theme.borderMain}`
                : `${theme.buttonSecondary} ${theme.itemHover}`
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Categories; 