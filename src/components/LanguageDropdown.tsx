import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import KurdishFlag from "@/assets/icons/ku.png";
import ArabicFlag from "@/assets/icons/ar.png";
import EnglishFlag from "@/assets/icons/en.png";

interface LanguageOption {
  code: "ku" | "ar" | "en";
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: "ku",
    name: defaultMenuConfig.ui?.languages.kurdish.name.en || "Kurdish",
    nativeName: defaultMenuConfig.ui?.languages.kurdish.nativeName || "کوردی",
    flag: KurdishFlag,
  },
  {
    code: "ar",
    name: defaultMenuConfig.ui?.languages.arabic.name.en || "Arabic",
    nativeName: defaultMenuConfig.ui?.languages.arabic.nativeName || "العربية",
    flag: ArabicFlag,
  },
  {
    code: "en",
    name: defaultMenuConfig.ui?.languages.english.name.en || "English",
    nativeName: defaultMenuConfig.ui?.languages.english.nativeName || "English",
    flag: EnglishFlag,
  },
];

function LanguageDropdown({ isReverce = false, isMobile = false }) {
  const { language, setLanguage, isRTL } = useLanguage();
  const theme = useThemeClasses();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === language);

  const checkDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 300; // Approximate dropdown height
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        checkDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: "ku" | "ar" | "en") => {
    setLanguage(langCode);
    setIsOpen(false);

    if (location.pathname.startsWith("/menu/")) {
      navigate(`/menu/${langCode}`);
    }
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      checkDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className={`
          flex items-center gap-2 transition-colors duration-200
          ${theme.bgCard} border ${theme.borderCategory}
          hover:${theme.bgSearchBar}
          ${
            isMobile
              ? "w-full p-4 rounded-full min-h-[56px] justify-between touch-manipulation"
              : "p-2 rounded-full"
          }
        `}
        style={{ boxShadow: "var(--shadow)" }}
        aria-label={
          defaultMenuConfig.ui?.languageDropdown.selectLanguage[language] ||
          "Select language"
        }
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Globe
            className={`w-5 h-5 ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            }`}
          />
          <span
            className={`text-sm ${theme.textPrimary} ${
              isMobile ? "block" : "hidden sm:block"
            }`}
          >
            <img
              src={currentLanguage?.flag}
              alt={currentLanguage?.name}
              className="w-5 h-5 object-contain"
            />
          </span>
          {isMobile && (
            <span
              className={`text-sm font-medium ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } ml-2`}
            >
              {currentLanguage?.nativeName}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 ${
            theme.textSecondary
          } transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute rounded-2xl overflow-hidden
            ${theme.bgCard} border ${theme.borderLanguage}
            ${isMobile ? "w-full min-w-full" : "min-w-[200px]"}
            ${
              isReverce
                ? isRTL
                  ? "right-0"
                  : "right-0"
                : isRTL
                ? "left-0"
                : "right-0"
            }
            ${dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}
            z-50
            px-2
          `}
          style={{ boxShadow: "var(--shadow)" }}
        >
          <div className="py-2 flex flex-col gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full flex items-center gap-3 transition-colors duration-200
                  ${theme.languageHover}
                  ${language === lang.code ? theme.bgLanguage : ""}
                  ${isRTL ? "text-right" : "text-left"}
                  ${
                    isMobile
                      ? "px-4 py-4 min-h-[60px] touch-manipulation"
                      : "px-4 py-3"
                  }
                `}
              >
                <span className="text-lg">
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="w-5 h-5 object-contain"
                  />
                </span>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${
                      theme.isDark ? theme.textSecondary : theme.textPrimary
                    }`}
                  >
                    {lang.nativeName}
                  </div>
                  <div
                    className={`text-xs ${
                      theme.isDark ? theme.textSecondary : theme.textPrimary
                    }`}
                  >
                    {lang.name === "English"
                      ? defaultMenuConfig.ui?.languages.kurdish.englishName ||
                        "ئینگلیزی"
                      : lang.name}
                  </div>
                </div>
                {language === lang.code && (
                  <div className={`w-2 h-2 rounded-full ${theme.bgMain}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageDropdown;
