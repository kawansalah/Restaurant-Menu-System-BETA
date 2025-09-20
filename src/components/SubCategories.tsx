interface SubCategoriesProps {
  subCategories: Array<{
    id: string;
    label: string;
    img: string;
  }>;
  activeSubCategory: string;
  setActiveSubCategory: (subCategory: string) => void;
  theme: any;
}

function SubCategories({
  subCategories,
  activeSubCategory,
  setActiveSubCategory,
  theme,
}: SubCategoriesProps) {
  return (
    <div className={`flex gap-4 mb-3 overflow-x-auto hide-scrollbar py-[10px]`}>
      {subCategories.map((subCategory) => (
        <button
          key={subCategory.id}
          onClick={() => setActiveSubCategory(subCategory.id)} 
          className={`flex flex-col items-center justify-between px-4 gap-3 py-4 rounded-4xl whitespace-nowrap transition-all border cursor-pointer ${
            activeSubCategory === subCategory.id
              ? `${theme.bgMain} ${theme.topbarShadowStyle} ${ theme.isDark ? theme.buttonTextPrimary : theme.buttonTextPrimary} font-bold ${theme.borderMain}`
              : `${theme.bgCard} ${theme.topbarShadowStyle} ${theme.textSecondary} border ${theme.borderCategory} ${theme.itemHover}`
          }`}
        >
          <div className="flex items-center justify-center w-[80px] h-[80px] mb-2">
            <img src={subCategory.img} alt={subCategory.label} className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="text-base font-bold">{subCategory.label}</div> 
        </button>
      ))}
    </div>
  );
}

export default SubCategories; 