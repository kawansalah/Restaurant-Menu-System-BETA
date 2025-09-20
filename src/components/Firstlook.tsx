import videoBackground from "@/assets/video/salar.mp4";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRestaurantOptional } from "@/contexts/RestaurantContext";
import { useTheme } from "@/contexts/ThemeContext";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import MenuButton from "./MenuButton";
import ThemeToggle from "./ThemeToggle";
import FeedbackButton from "@/components/FeedbackButton";
import SocialMediaLocationBar from "./SocialMediaLocationBar";
import { useThemeClasses } from "@/hooks/useThemeClasses";

function Firstlook() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const restaurantContext = useRestaurantOptional();
  const restaurant = restaurantContext?.restaurant || null;
  const dynamicMenuConfig = restaurantContext?.menuConfig || null;
  const { theme } = useTheme();
  const [selected, setSelected] = useState<"ku" | "ar" | "en">(language);
  const themeClasses = useThemeClasses();

  // Determine which configuration to use
  const config = dynamicMenuConfig || defaultMenuConfig;

  // Determine the logo to use based on theme and configuration
  const logoUrl =
    config.logo && typeof config.logo === "object"
      ? theme === "dark"
        ? config.logo.dark
        : config.logo.light
      : config.logo;

  // Determine restaurant name to display
  const restaurantName = restaurant
    ? restaurant.name
    : config.restaurantName?.[language] ||
      config.restaurantName?.en ||
      "Restaurant";

  // Get language labels from config
  const getLanguageLabels = () => {
    const uiConfig = config.ui?.languages || defaultMenuConfig.ui?.languages;
    return [
      { code: "ku", label: uiConfig?.kurdish.nativeName || "کوردی" },
      { code: "ar", label: uiConfig?.arabic.nativeName || "العربية" },
      { code: "en", label: uiConfig?.english.nativeName || "English" },
    ];
  };

  // Sync selected state with language context
  useEffect(() => {
    setSelected(language);
  }, [language]);

  const handleLanguageClick = (languageCode: string) => {
    const typedLanguageCode = languageCode as "ku" | "ar" | "en";
    setSelected(typedLanguageCode);
    // Update language context to change body direction immediately
    setLanguage(typedLanguageCode);

    // Add a small delay to show the selection before navigating
    setTimeout(() => {
      if (restaurant) {
        // Restaurant-specific navigation
        navigate(`/${restaurant.slug}/menu/${languageCode}`);
      } else {
        // Default navigation
        navigate(`/menu/${languageCode}`);
      }
    }, 200);
  };

  return (
    <div className="relative w-full h-screen lg:h-screen xl:h-screen 2xl:h-screen flex items-end justify-center bg-black overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoBackground} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Top-right buttons container */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <ThemeToggle />
        <FeedbackButton />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full max-w-md mx-auto px-0">
        <div className="flex flex-col items-center mt-12 mb-8">
          <div className=" p-4 flex items-center justify-center h-[250px]">
            <img
              src={logoUrl || defaultMenuConfig.logo?.dark}
              alt={`${restaurantName} Logo`}
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Social Media and Location Buttons */}
          <SocialMediaLocationBar
            socialMedia={config.socialMedia}
            location={config.location}
            className="mt-6"
            iconSize="lg"
            spacing="normal"
            showSeparator={true}
            orientation="horizontal"
            customStyles={{
              container: "flex items-center justify-center gap-4",
              socialContainer: "flex items-center gap-3",
              iconButton: `p-2.5 rounded-full ${themeClasses.bgCard} ${themeClasses.textMain} hover:opacity-80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`,
              separator: `w-px h-6 ${themeClasses.bgCard} opacity-50`,
            }}
          />
        </div>

        {/* Language Selection Card */}
        <div
          className={`w-full ${themeClasses.bgCard} rounded-t-[40px] pb-10 pt-6 px-[60px] flex flex-col items-center shadow-2xl ${themeClasses.topbarShadowStyle}`}
        >
          {/* Top bar indicator */}
          <div
            className={`w-24 h-2 ${themeClasses.bgMain} rounded-full mb-8 mx-auto`}
          />
          <div className="flex flex-col gap-6 w-full">
            {getLanguageLabels().map(
              (lang: { code: string; label: string }) => (
                <MenuButton
                  key={lang.code}
                  item={{
                    code: lang.code,
                    label: lang.label,
                    isSelected: selected === lang.code,
                  }}
                  onClick={() => handleLanguageClick(lang.code)}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Firstlook;
