import React, { useState, useEffect, useRef } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import { MenuItem, LocalizedText } from "@/types/menu";
import {
  submitRating,
  hasUserRated,
  getRatingStats,
} from "@/services/ratingService";
import Button from "./Button";
import CartIcon from "@/assets/icons/Cart.svg";
import RatingIcon from "@/assets/icons/rating.svg";
import FeedbackToast from "./FeedbackToast";
import FoodRating from "./FoodRating";

interface ItemInfoProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  currency?: LocalizedText;
  isOpen: boolean;
}

const ItemInfo: React.FC<ItemInfoProps> = ({
  item,
  onClose,
  onAddToCart,
  currency,
  isOpen,
}) => {
  const themeClasses = useThemeClasses();
  const { language, isRTL } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState<number>(item.rating || 0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const defaultDescription = defaultMenuConfig.defaultDescription || {
    ku: "پێکهاتووە لە هێلکەو ڕۆن - ماست - چا - میوە - قەیماخ - تاقیکردنەوە تاقیکردنەوەتاقیکردنەوە تاقیکردنەوە تاقیکردنەوە...",
    ar: "وصف المنتج للطعام اللذيذ",
    en: "Delicious dish description",
  };

  // Load rating stats when modal opens
  useEffect(() => {
    if (isOpen) {
      loadRatingStats();
    }
  }, [isOpen]);

  const loadRatingStats = async () => {
    try {
      const stats = await getRatingStats(item.id);
      setCurrentRating(stats.average_rating);
      setTotalRatings(stats.total_ratings);
    } catch (error) {
      console.error("Error loading rating stats:", error);
      // Use fallback values
      setCurrentRating(item.rating || 0);
      setTotalRatings(0);
    }
  };

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";

      // Focus the modal for accessibility
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 200);
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Show feedback toast after modal opens
  useEffect(() => {
    if (isOpen) {
      setShowFeedbackToast(true);
    } else {
      setShowFeedbackToast(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    handleClose();
  };

  const handleCloseFeedbackToast = () => {
    setShowFeedbackToast(false);
  };

  const getLocalizedText = (text: LocalizedText) => {
    return text[language] || text.en || text.ku || text.ar;
  };

  const handleRatingSubmit = async (rating: number) => {
    try {
      // Check if user has already rated this item
      const hasAlreadyRated = await hasUserRated(item.id);

      if (hasAlreadyRated) {
        const alreadyRatedText = getLocalizedText({
          ku: "تۆ پێشتر ڕەیتینگت داوە بۆ ئەم خواردنە",
          ar: "لقد قمت بتقييم هذا الطعام مسبقاً",
          en: "You have already rated this item",
        });
        alert(alreadyRatedText);
        setShowRatingModal(false);
        return;
      }

      // Submit the rating
      await submitRating(item.id, rating);

      // Refresh rating stats after successful submission
      await loadRatingStats();

      const ratingText = getLocalizedText(
        defaultMenuConfig.ui?.alerts?.ratingSubmitted || {
          ku: "ڕەیتینگەکەت نێردرا",
          ar: "تم إرسال التقييم",
          en: "Rating submitted successfully",
        }
      );

      alert(`${ratingText}: ${rating} ${rating === 1 ? "star" : "stars"}`);
      setShowRatingModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      const errorText = getLocalizedText({
        ku: "هەڵەیەک ڕوویدا لە ناردنی ڕەیتینگ",
        ar: "حدث خطأ في إرسال التقييم",
        en: "Error submitting rating",
      });
      alert(errorText);
    }
  };

  const handleRatingClose = () => {
    setShowRatingModal(false);
  };

  const getCurrencyText = () => {
    if (currency) {
      return currency[language] || currency.ku;
    }
    return language === "en" ? "IQD" : "دينار";
  };

  const getAddToCartText = () => {
    const texts = defaultMenuConfig.ui?.itemInfo.addToCart || {
      ku: "زیادکرن",
      ar: "إضافة إلى السلة",
      en: "Add to Cart",
    };
    return texts[language] || texts.en;
  };

  const getTotalText = () => {
    const texts = defaultMenuConfig.ui?.itemInfo.total || {
      ku: "کۆی گشتی:",
      ar: "المجموع:",
      en: "Total:",
    };
    return texts[language] || texts.en;
  };

  const getPlusIcon = (color: string, size: number) => {
    return (
      <svg
        viewBox="0 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill={color}
        width={size}
        height={size}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <title>plus</title>
          <desc>Created with Sketch Beta.</desc>
          <defs></defs>
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Icon-Set-Filled"
              transform="translate(-362.000000, -1037.000000)"
              fill={color}
            >
              <path
                d="M390,1049 L382,1049 L382,1041 C382,1038.79 380.209,1037 378,1037 C375.791,1037 374,1038.79 374,1041 L374,1049 L366,1049 C363.791,1049 362,1050.79 362,1053 C362,1055.21 363.791,1057 366,1057 L374,1057 L374,1065 C374,1067.21 375.791,1069 378,1069 C380.209,1069 382,1067.21 382,1065 L382,1057 L390,1057 C392.209,1057 394,1055.21 394,1053 C394,1050.79 392.209,1049 390,1049"
                id="plus"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    );
  };
  const getMinusIcon = (color: string, size: number) => {
    return (
      <svg
        viewBox="0 -12 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill={color}
        width={size}
        height={size}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <title>minus</title>
          <desc>Created with Sketch Beta.</desc>
          <defs></defs>
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Icon-Set-Filled"
              transform="translate(-414.000000, -1049.000000)"
              fill={color}
            >
              <path
                d="M442,1049 L418,1049 C415.791,1049 414,1050.79 414,1053 C414,1055.21 415.791,1057 418,1057 L442,1057 C444.209,1057 446,1055.21 446,1053 C446,1050.79 444.209,1049 442,1049"
                id="minus"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/70 flex items-start  2xl:items-center lg:items-center md:items-center justify-center z-100 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`2xl:max-w-md xl:max-w-md lg:max-w-md md:max-w-md sm:max-w-full max-h-screen h-screen w-full 2xl:h-auto lg:h-auto md:h-auto rounded-none 2xl:rounded-3xl lg:rounded-3xl md:rounded-3xl overflow-hidden ${
          themeClasses.bgButtomNavigation
        } ${
          themeClasses.isDark
            ? themeClasses.buttonTextPrimary
            : themeClasses.textPrimary
        } transform transition-all duration-300 ease-out ${
          isClosing
            ? "translate-y-full 2xl:translate-y-0 2xl:scale-90 opacity-0"
            : "translate-y-0 2xl:scale-100 opacity-100"
        } shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="relative">
          <button
            onClick={handleClose}
            className={`absolute top-4 left-4 z-10 ${
              themeClasses.isDark ? themeClasses.bgCard : themeClasses.bgPrimary
            } bg-opacity-80 backdrop-blur-sm ${
              themeClasses.isDark
                ? themeClasses.buttonTextPrimary
                : themeClasses.textPrimary
            } rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 hover:scale-105 active:scale-95 border-2 ${
              themeClasses.borderBottomNav
            }`}
            aria-label={
              defaultMenuConfig.ui?.accessibility.closeModal[language] ||
              "Close modal"
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-200"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Food Image */}
          <div className="w-full h-64 bg-gray-200 overflow-visible relative">
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDBB2A]"></div>
              </div>
            )}
            <img
              src={item.image}
              alt={item.name[language]}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />

            {/* Rating Badge */}
            <div
              className={`absolute z-20 bottom-4 left-1/2 transform -translate-x-1/2 ${
                themeClasses.bgSecondary
              } bg-opacity-90 backdrop-blur-sm ${
                themeClasses.isDark
                  ? themeClasses.buttonTextPrimary
                  : themeClasses.textPrimary
              } border-2 ${
                themeClasses.borderBottomNav
              } px-4 py-2 rounded-full flex flex-row-reverse items-center gap-2 animate-fade-in-up ${
                themeClasses.buttonShadowSecondary
              } hover:translate-y-[2px] ${
                themeClasses.buttonShadowSecondaryHover
              } active:translate-y-[6px] ${
                themeClasses.isDark
                  ? "active:shadow-[0px_0px_0px_0px_#373737]"
                  : "active:shadow-[0px_0px_0px_0px_#DDDDDD]"
              } transition-all duration-200 cursor-pointer`}
              style={{
                animationDelay: "0.3s",
                animationFillMode: "both",
              }}
              onClick={() => setShowRatingModal(true)}
            >
              <img src={RatingIcon} alt="rating" className="w-5 h-5" />
              <span className="text-lg font-bold">
                {currentRating > 0 ? currentRating.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm opacity-80">
                {defaultMenuConfig.ui?.itemInfo.rating[language] ||
                  (language === "en" ? "Rating" : "ڕەیتینگ")}
                {totalRatings > 0 && ` (${totalRatings})`}
              </span>
            </div>

            {/* Feedback Toast - Positioned relative to image container */}
            <FeedbackToast
              isVisible={showFeedbackToast}
              onClose={handleCloseFeedbackToast}
              delay={1200}
            />
          </div>
        </div>

        {/* Content */}
        <div
          className={`modal-content relative flex-1 overflow-y-auto ${themeClasses.bgButtomNavigation} border-2 border-b-0 lg:border-b-2 2xl:border-b-2 ${themeClasses.borderBottomNav} rounded-t-3xl 2xl:rounded-b-3xl lg:rounded-b-3xl z-10 -mt-10 animate-slide-up-content`}
          style={{
            animationDelay: "0.1s",
            animationFillMode: "both",
            maxHeight: "calc(100vh - 256px)",
            height: "100%",
          }}
        >
          <div className="p-6 pt-14 space-y-6 min-h-full">
            {/* Item Name */}
            <h2
              id="modal-title"
              className={`text-2xl font-bold text-center animate-fade-in-up`}
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                animationDelay: "0.2s",
                animationFillMode: "both",
              }}
            >
              {item.name[language]}
            </h2>

            {/* Quantity Selector and Price */}
            <div
              className={`flex items-center justify-between animate-fade-in-up`}
              style={{
                animationDelay: "0.3s",
                animationFillMode: "both",
              }}
            >
              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-12 h-12 bg-[#FDBB2A] text-white rounded-full flex items-center justify-center text-2xl font-bold hover:bg-[#e6a821] transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                  aria-label={
                    defaultMenuConfig.ui?.itemInfo.increaseQuantity[language] ||
                    "Increase quantity"
                  }
                >
                  {getPlusIcon("#FFFFFF", 24)}
                </button>
                <span className="text-2xl font-bold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg`}
                  style={{
                    backgroundColor: themeClasses.isDark
                      ? "#515151"
                      : "#ECECEC",
                  }}
                  aria-label={
                    defaultMenuConfig.ui?.itemInfo.decreaseQuantity[language] ||
                    "Decrease quantity"
                  }
                >
                  {themeClasses.isDark
                    ? getMinusIcon("#FFFFFF", 24)
                    : getMinusIcon("#313234", 24)}
                </button>
              </div>

              {/* Price */}
              <div
                className={`${themeClasses.bgMain} text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200`}
              >
                <span className="text-lg font-bold">
                  {item.price} {getCurrencyText()}
                </span>
              </div>
            </div>

            {/* Description */}
            {(item.description || defaultDescription) && (
              <div
                className={`p-4 font-normal rounded-2xl ${
                  themeClasses.bgSecondary
                } border-2 ${themeClasses.borderCategory} ${
                  themeClasses.isDark
                    ? themeClasses.buttonTextPrimary
                    : themeClasses.textPrimary
                } shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up`}
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "both",
                }}
              >
                <p className="text-base leading-relaxed">
                  {(item.description && item.description[language]) ||
                    (defaultDescription && defaultDescription[language])}
                </p>
              </div>
            )}

            {/* Total price */}
            <div
              className={`flex justify-between items-center p-4 rounded-2xl ${
                themeClasses.bgSecondary
              } border-2 ${themeClasses.borderCategory} ${
                themeClasses.isDark
                  ? themeClasses.buttonTextPrimary
                  : themeClasses.textPrimary
              } shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up`}
              style={{
                animationDelay: "0.5s",
                animationFillMode: "both",
              }}
            >
              <span className="text-lg font-bold">{getTotalText()}</span>
              <span className="text-lg font-bold text-[#FDBB2A]">
                {(
                  Number(item.price.replace(/,/g, "")) * quantity
                ).toLocaleString()}{" "}
                {getCurrencyText()}
              </span>
            </div>

            {/* Add to Cart Button */}
            <div
              className={`animate-fade-in-up pb-10`}
              style={{
                animationDelay: "0.6s",
                animationFillMode: "both",
              }}
            >
              <Button
                onClick={handleAddToCart}
                icon={CartIcon}
                iconAlt="cart"
                variant="primary"
              >
                {getAddToCartText()}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Food Rating Modal */}
      <FoodRating
        isOpen={showRatingModal}
        onSubmit={handleRatingSubmit}
        onClose={handleRatingClose}
        itemName={item.name}
      />

      <style>
        {`
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

          @keyframes slide-up-content {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out;
          }

          .animate-slide-up-content {
            animation: slide-up-content 0.4s ease-out;
          }

          /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
          .modal-content::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for Firefox */
          .modal-content {
            scrollbar-width: none;
          }

          /* Hide scrollbar for IE and Edge */
          .modal-content {
            -ms-overflow-style: none;
          }
        `}
      </style>
    </div>
  );
};

export default ItemInfo;
