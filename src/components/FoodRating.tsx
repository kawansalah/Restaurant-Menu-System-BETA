import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, LocalizedText } from "@/types/menu";
import Button from "./Button";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";

interface FoodRatingProps {
  onSubmit?: (rating: number) => void;
  onClose?: () => void;
  isOpen?: boolean;
  itemName?: LocalizedText;
}

const FoodRating: React.FC<FoodRatingProps> = ({
  onSubmit,
  onClose,
  isOpen = false,
  itemName,
}) => {
  const theme = useThemeClasses();
  const { language: urlLanguage } = useParams<{ language: string }>();
  const { language: contextLanguage } = useLanguage();
  const currentLanguage: Language =
    contextLanguage || (urlLanguage as Language) || "ku";
  const isRTL = contextLanguage === "ku" || contextLanguage === "ar";

  const [rating, setRating] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);

  // Animation effect
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      // Small delay to trigger content animation after modal appears
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 50);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      return () => clearTimeout(contentTimer);
    } else {
      setIsClosing(true);
      setShowContent(false);
      // Restore body scroll
      document.body.style.overflow = "unset";
      // Hide modal after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getLocalizedText = (text: LocalizedText): string => {
    return text[currentLanguage] || text.ku || "";
  };

  const defaultTexts = {
    title: {
      ku: "هەڵسەنگاندنی خواردن",
      ar: "تقييم الطعام",
      en: "Rate Food",
    },
    subtitle: {
      ku: "خواردنەکەت بەلاوە چۆن بوو؟",
      ar: "يرجى تقييم هذا الطعام",
      en: "Please rate this food",
    },
    submitButton: {
      ku: "ناردن",
      ar: "إرسال",
      en: "Submit Rating",
    },
    closeButton: {
      ku: "داخستن",
      ar: "إغلاق",
      en: "Close",
    },
  };

  const getTexts = () => {
    const config = defaultMenuConfig.ui?.foodRating;
    return {
      title: config?.title
        ? getLocalizedText(config.title)
        : getLocalizedText(defaultTexts.title),
      subtitle: config?.subtitle
        ? getLocalizedText(config.subtitle)
        : getLocalizedText(defaultTexts.subtitle),
      closeButton: config?.closeButton
        ? getLocalizedText(config.closeButton)
        : getLocalizedText(defaultTexts.closeButton),
      submitButton: config?.submitButton
        ? getLocalizedText(config.submitButton)
        : getLocalizedText(defaultTexts.submitButton),
    };
  };
  const text = getTexts();

  const getStarIcon = (color: string, size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.58378 4.09006C10.1037 1.36336 10.8637 0 12 0C13.1363 0 13.8962 1.36335 15.4161 4.09005L15.8094 4.79548C16.2414 5.57032 16.4573 5.95776 16.7941 6.21338C17.1308 6.46901 17.5501 6.56389 18.3889 6.75367L19.1526 6.92645C22.1041 7.59428 23.58 7.9282 23.9311 9.05729C24.2822 10.1863 23.2761 11.3629 21.2639 13.7159L20.7433 14.3247C20.1715 14.9933 19.8855 15.3276 19.7569 15.7413C19.6284 16.1549 19.6716 16.6009 19.758 17.4931L19.8367 18.3053C20.1409 21.4448 20.2931 23.0145 19.3739 23.7123C18.4545 24.4101 17.0727 23.7738 14.3091 22.5015L13.5942 22.1722C12.8089 21.8106 12.4163 21.6298 12 21.6298C11.5837 21.6298 11.1911 21.8106 10.4058 22.1722L9.69083 22.5015C6.92721 23.7738 5.54541 24.4101 4.62618 23.7123C3.70694 23.0145 3.85905 21.4448 4.16328 18.3053L4.24197 17.4931C4.32843 16.6009 4.37166 16.1549 4.24303 15.7413C4.11441 15.3276 3.82851 14.9933 3.2567 14.3247L2.73612 13.7159C0.723901 11.3629 -0.282213 10.1863 0.0689063 9.05729C0.420026 7.9282 1.89583 7.59428 4.84744 6.92645L5.61106 6.75367C6.44981 6.56389 6.86919 6.46901 7.20592 6.21338C7.54265 5.95776 7.75863 5.57034 8.19056 4.79548L8.58378 4.09006Z"
          fill={color}
        />
      </svg>
    );
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    onSubmit?.(rating);

    // Reset form
    setRating(0);
  };

  const handleClose = () => {
    // Reset form
    setRating(0);
    onClose?.();
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-3 justify-center mb-6">
        {[1, 2, 3, 4, 5].map((star, index) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className={`flex flex-row items-center justify-center rounded-2xl w-12 h-12 transition-all duration-200 transform hover:scale-110 ${
              star <= rating
                ? "bg-[#FDBB2A] animate-bounce-once"
                : theme.isDark
                ? "bg-[#373737] hover:bg-[#404040]"
                : "bg-[#F4F4F4] hover:bg-[#E8E8E8]"
            } ${showContent ? "animate-fade-in-up" : ""}`}
            style={{
              animationDelay: showContent ? `${200 + index * 50}ms` : "0ms",
            }}
          >
            {star <= rating
              ? getStarIcon("#FFFFFF", 20)
              : getStarIcon("#9A9A9A", 20)}
          </button>
        ))}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out ${
        isOpen && !isClosing
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-black/0 backdrop-blur-none"
      }`}
      style={{
        backdropFilter: isOpen && !isClosing ? "blur(8px)" : "blur(0px)",
        WebkitBackdropFilter: isOpen && !isClosing ? "blur(8px)" : "blur(0px)",
      }}
      onClick={handleClose}
    >
      <div
        className={`max-w-md w-full mx-4 ${
          theme.isDark ? "bg-[#232323]" : "bg-[#ffffff]"
        } rounded-3xl p-6 border ${
          theme.border
        } shadow-2xl transition-all duration-300 ease-out transform ${
          isOpen && !isClosing
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div
          className={`text-center mb-6 transition-all duration-300 ${
            showContent ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: showContent ? "100ms" : "0ms" }}
        >
          <h2 className={`text-xl font-bold mb-2 ${theme.text}`}>
            {text.title}
          </h2>
          {itemName && (
            <p className={`text-lg font-medium mb-2 ${theme.text}`}>
              {getLocalizedText(itemName)}
            </p>
          )}
          <p className={`text-sm opacity-80 ${theme.text}`}>{text.subtitle}</p>
        </div>

        {/* Star Rating */}
        <div
          className={`transition-all duration-300 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          {renderStarRating()}
        </div>

        {/* Action Buttons */}
        <div
          className={`flex gap-3 transition-all duration-300 ${
            showContent ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: showContent ? "450ms" : "0ms" }}
        >
          <Button variant="secondary" onClick={handleClose}>
            {text.closeButton}
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            {text.submitButton}
          </Button>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }

        .animate-bounce-once {
          animation: bounce-once 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FoodRating;
