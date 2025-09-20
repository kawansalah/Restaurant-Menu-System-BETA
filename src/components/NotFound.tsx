import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import ThemeToggle from "./ThemeToggle";
import { useRestaurantOptional } from "@/contexts/RestaurantContext";
import { getRestaurantBySlug, Restaurant } from "@/services/restaurantService";

function NotFound() {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const restaurantContext = useRestaurantOptional();
  const [localRestaurant, setLocalRestaurant] = useState<Restaurant | null>(
    null
  );

  // Get restaurant from context or local state
  const restaurant = restaurantContext?.restaurant || localRestaurant;

  // Load restaurant data if we have a slug but no restaurant in context
  useEffect(() => {
    const loadRestaurantData = async () => {
      if (
        restaurantSlug &&
        !restaurantContext?.restaurant &&
        !localRestaurant
      ) {
        try {
          const restaurantData = await getRestaurantBySlug(restaurantSlug);
          if (restaurantData) {
            setLocalRestaurant(restaurantData);
          }
        } catch (error) {
          console.error("Error loading restaurant:", error);
        }
      }
    };

    loadRestaurantData();
  }, [restaurantSlug, restaurantContext?.restaurant, localRestaurant]);

  // Multi-language support from config
  const getText = () => {
    const config = defaultMenuConfig.ui?.notFound || {
      title: { ku: "٤٠٤", ar: "٤٠٤", en: "404" },
      subtitle: {
        ku: "لاپەڕە نەدۆزرایەوە",
        ar: "الصفحة غير موجودة",
        en: "Page Not Found",
      },
      message: {
        ku: "ببوورە، ئەو لاپەڕەیەی  کە بۆی دەگەڕێیت بوونی نییە یان گواستراوەتەوە.",
        ar: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
        en: "Sorry, the page you're looking for doesn't exist or has been moved.",
      },
      homeButton: {
        ku: "گەڕانەوە بۆ سەرەتا",
        ar: "العودة للرئيسية",
        en: "Go to Home",
      },
      orText: { ku: "یان", ar: "أو", en: "or" },
    };

    return {
      title: config.title[language] || config.title.en,
      subtitle: config.subtitle[language] || config.subtitle.en,
      message: config.message[language] || config.message.en,
      buttonText: config.homeButton[language] || config.homeButton.en,
      orText: config.orText[language] || config.orText.en,
    };
  };

  const text = getText();

  // Generate links based on restaurant context
  const getHomeLink = () => {
    return restaurant ? `/${restaurant.slug}` : "/";
  };

  const getMenuLink = (languageCode: string) => {
    return restaurant
      ? `/${restaurant.slug}/menu/${languageCode}`
      : `/menu/${languageCode}`;
  };

  return (
    <div className={`min-h-screen ${theme.bgPrimary} flex flex-col relative`}>
      {/* Theme Toggle - positioned in top-right corner */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="mb-8">
              <img
                src={defaultMenuConfig.logo?.light}
                alt="Restaurant Logo"
                className="w-20 h-20 object-contain opacity-80"
              />
            </div>

            {/* Error Card */}
            <div
              className={`w-full ${theme.bgCard} rounded-[40px] p-8 ${theme.topbarShadowStyle} border border-[var(--category-stroke)]`}
            >
              {/* 404 Number */}
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold ${theme.textMain} mb-2`}>
                  {text.title}
                </div>
                <div
                  className={`text-2xl font-bold ${
                    theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
                  } mb-4`}
                >
                  {text.subtitle}
                </div>
                <div
                  className={`text-base ${theme.textSecondary} leading-relaxed`}
                >
                  {text.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-8">
                {/* Primary Button - Go Home */}
                <Link
                  to={getHomeLink()}
                  className={`flex items-center justify-center w-full py-[18px] px-6 rounded-[40px] text-xl font-bold transition-all ease-in-out duration-200 cursor-pointer border-none outline-none focus:outline-none ${theme.bgMain} ${theme.buttonTextPrimary} ${theme.buttonShadowPrimary} hover:translate-y-[2px] ${theme.buttonShadowPrimaryHover} active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#e6bb00] text-center`}
                >
                  {text.buttonText}
                </Link>

                {/* Secondary Options */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className={`h-px flex-1 ${theme.bgSeparator}`}></div>
                  <span className={`text-sm ${theme.textSecondary}`}>
                    {text.orText}
                  </span>
                  <div className={`h-px flex-1 ${theme.bgSeparator}`}></div>
                </div>

                {/* Menu Links */}
                <div className="flex flex-col gap-2 mt-4">
                  <Link
                    to={getMenuLink("ku")}
                    className={`py-3 px-6 rounded-[30px] text-center transition-all duration-200 ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} border border-[var(--category-stroke)]`}
                  >
                    {defaultMenuConfig.ui?.languages.kurdish.nativeName ||
                      "کوردی"}
                  </Link>
                  <Link
                    to={getMenuLink("ar")}
                    className={`py-3 px-6 rounded-[30px] text-center transition-all duration-200 ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} border border-[var(--category-stroke)]`}
                  >
                    {defaultMenuConfig.ui?.languages.arabic.nativeName ||
                      "عەرەبی"}
                  </Link>
                  <Link
                    to={getMenuLink("en")}
                    className={`py-3 px-6 rounded-[30px] text-center transition-all duration-200 ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgSearchBar} border border-[var(--category-stroke)]`}
                  >
                    {defaultMenuConfig.ui?.languages.english.nativeName ||
                      "English"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className={`text-sm ${theme.textSecondary} opacity-70`}>
          {defaultMenuConfig.ui?.footer.copyright[language] ||
            "© 2025 Kawan Salahadin Dev"}
        </p>
      </div>
    </div>
  );
}

export default NotFound;
