import { useTheme } from "@/contexts/ThemeContext";

export const useThemeClasses = () => {
  const { theme } = useTheme();

  return {
    
    // Background classes
    background:
      theme === "dark" ? "bg-[var(--bg-primary)]" : "bg-[var(--bg-primary)]", //new
    cardBackground: theme === "dark" ? "bg-[#313234)" : "bg-[#F1F1F1]", //new
    inputBackground: theme === "dark" ? "bg-[#313234]" : "bg-[#F7F7F7]", //new
    bgMain: "bg-[var(--bg-main)]",
    bgPrimary: "bg-[var(--bg-primary)]",
    bgSecondary: "bg-[var(--bg-secondary)]",
    bgCard: "bg-[var(--bg-card)]",
    bgTopbar: "bg-[var(--bg-topbar)]",
    bgButtomNavigation: "bg-[var(--buttom-navigation)]",
    bgSearchBar: "bg-[var(--bg-search-bar)]",
    bgRating: "bg-[var(--bg-rating)]",
    bgBottomNav: "bg-[var(--buttom-navigation)]",
    bgSeparator: "bg-[var(--category-stroke)]",
    bgLanguage: "bg-[var(--bg-language)]",

    // Text classes
    text: theme === "dark" ? "text-white" : "text-gray-900", //new
    textPrimary: "text-[var(--text-primary)]",
    textSecondary: "text-[var(--text-secondary)]",
    textTertiary: "text-[var(--text-tertiary)]",
    textMain: "text-[var(--bg-main)]",
    textSearch: "text-[var(--bg-search-text)]",

    // Border classes
    border:
      theme === "dark"
        ? "border-[var(--sub-category-stroke)]"
        : "border-[#F0F0F0]", //new
    borderMain: "border-[var(--main-stroke)]",
    borderCategory: "border-[var(--category-stroke)]",
    borderSubCategory: "border-[var(--sub-category-stroke)]",
    borderItem: "border-[var(--item-stroke)]",
    borderTopbar: "border-[var(--bg-topbar-border)]",
    borderBottomNav: "border-[var(--buttom-navigation-stroke)]",
    borderLightButton: "border-[var(--light-button-stroke)]",
    borderLanguage: "border-[var(--language-stroke)]",

    // Combined utility classes
    card: "bg-[var(--bg-card)] border-2 border-[var(--item-stroke)] rounded-[30px]",

    button:
      "bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--main-stroke)]",
    buttonSecondary:
      "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--category-stroke)]",
    // input: "bg-[var(--bg-search-bar)] text-[var(--text-primary)] border border-[var(--category-stroke)] placeholder:text-[var(--bg-search-placeholder)]",
    inputSearch:
      "bg-[var(--bg-search-bar)] text-[var(--bg-search-text)] border-none placeholder:text-[var(--bg-search-placeholder)]",
    buttonTextPrimary: "text-[var(--button-text-primary)]",
    buttonTextSecondary: "text-[var(--button-text-secondary)]",
    buttonShadowPrimary: "shadow-[var(--button-shadow-primary)]",
    buttonShadowSecondary: "shadow-[var(--button-shadow-secondary)]",

    buttonShadowPrimaryHover:
      "hover:shadow-[var(--button-shadow-primary-hover)]",
    buttonShadowSecondaryHover:
      "hover:shadow-[var(--button-shadow-secondary-hover)]",
    itemHover: "hover:bg-[var(--item-hover)]",
    languageHover: "hover:bg-[var(--item-hover)] rounded-xl",

    // Shadow style object (use with style prop)
    topbarShadowStyle: "shadow-[var(--topbar-shadow)]",
    // cardShadowStyle: "shadow-[var(--card-shadow)]",
    main:"#B6934B",
    shadow:"#A27F37",

    

    // Current theme
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
};
