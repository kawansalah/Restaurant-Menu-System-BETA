import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import CartIcon from "@/assets/icons/cart_2.svg";

interface CartInfoProps {
  onClose: () => void;
  currency?: {
    ku: string;
    ar: string;
    en: string;
  };
}

const CartInfo: React.FC<CartInfoProps> = ({ onClose, currency }) => {
  const {
    cartItems,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { language } = useLanguage();
  const themeClasses = useThemeClasses();
  const [isVisible, setIsVisible] = useState(false);
  const [ServiceFee] = useState(2500);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + ServiceFee;

  const formatPrice = (price: number) => {
    const formattedPrice = price.toLocaleString();
    if (currency) {
      const currencyText = currency[language] || currency.ku;
      return language === "en"
        ? `${currencyText} ${formattedPrice}`
        : `${formattedPrice} ${currencyText}`;
    }
    return language === "en"
      ? `IQD ${formattedPrice}`
      : `${formattedPrice} دینار`;
  };

  const getTexts = () => {
    return {
      title:
        {
          ku: "سەبەتەی کڕین",
          ar: "سلة التسوق",
          en: "Shopping Cart",
        }[language] || "Shopping Cart",
      empty:
        {
          ku: "سەبەتەکەت بەتاڵە",
          ar: "سلة التسوق فارغة",
          en: "Your cart is empty",
        }[language] || "Your cart is empty",
      emptySubtext:
        {
          ku: "دەستبکە بە زیادکردنی خواردن",
          ar: "ابدأ بإضافة بعض الطعام",
          en: "Start adding some delicious items",
        }[language] || "Start adding some delicious items",
      checkout:
        {
          ku: "بەتاڵکردنەوەی سەبەتە",
          ar: "إفراغ سلة المهملات",
          en: "Proceed to Checkout",
        }[language] || "Proceed to Checkout",
      clearCart:
        {
          ku: "بەتاڵکردنەوەی سەبەتە",
          ar: "تفريغ السلة",
          en: "Clear Cart",
        }[language] || "Clear Cart",
      confirmClear:
        {
          ku: "دڵنیایت لە بەتاڵکردنەوەی سەبەتە؟",
          ar: "هل أنت متأكد من تفريغ السلة؟",
          en: "Are you sure you want to clear the cart?",
        }[language] || "Are you sure you want to clear the cart?",
      cancel:
        {
          ku: "هەڵوەشاندنەوە",
          ar: "إلغاء",
          en: "Cancel",
        }[language] || "Cancel",
      confirm:
        {
          ku: "دڵنیام",
          ar: "تأكيد",
          en: "Confirm",
        }[language] || "Confirm",
      subtotal:
        {
          ku: "کۆی پارەی خواردنەکان",
          ar: "إجمالي فاتورة الوجبات",
          en: "Subtotal",
        }[language] || "Subtotal",
      showCartDetails:
        {
          ku: " پیشاندانی وردەکاریەکان",
          ar: "عرض التفاصيل السلة",
          en: "Show Cart Details",
        }[language] || "Show Cart Details",
      hideCartDetails:
        {
          ku: " شاردنەوەی وردەکاریەکان",
          ar: "إخفاء التفاصيل السلة",
          en: "Hide Cart Details",
        }[language] || "Hide Cart Details",
      delivery:
        {
          ku: "کرێی خزمەتگوزاری",
          ar: "رسوم الخدمة",
          en: "Service Fee",
        }[language] || "Service Fee",
      total:
        {
          ku: "کۆی گشتی",
          ar: "المجموع الإجمالي",
          en: "Total",
        }[language] || "Total",
      items:
        {
          ku: "خواردن",
          ar: "طعام",
          en: "foods",
        }[language] || "foods",
      itemsPlural:
        {
          ku: "عدد خواردن",
          ar: "عدد طعام",
          en: "number of foods",
        }[language] || "number of foods",
    };
  };

  const texts = getTexts();

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

  const TrashIcon = ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  const backIcon = (color: string, size: number, className: string) => (
    <svg
      className={`${className} ${language === "en" ? "scale-x-[-1]" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={"transparent"}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ShoppingBagIcon = ({ className = "" }: { className?: string }) => (
    <svg
      className={`${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
      />
    </svg>
  );

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleClearCart = () => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
      handleClose();
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id); // Remove Number() conversion
    } else {
      updateQuantity(id, newQuantity); // Remove Number() conversion
    }
  };

  const totalItems = getTotalItems();

  return (
    <div
      className={`fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } modal-content`}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={handleClose}
    >
      <div
        className={`w-full h-full max-h-[100%] 2xl:max-h-[80%] lg:max-h-[80%] sm:h-auto sm:max-w-lg sm:mx-4 sm:mb-4 sm:rounded-3xl pt-4 overflow-scroll ${
          themeClasses.bgPrimary
        } ${
          themeClasses.isDark
            ? themeClasses.buttonTextPrimary
            : themeClasses.textPrimary
        } shadow-2xl transform transition-all duration-300 ease-out ${
          isVisible
            ? "translate-y-0 scale-100"
            : "translate-y-full sm:translate-y-0 sm:scale-95"
        } modal-content border-2 border-[var(--buttom-navigation-stroke)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header with Safe Area */}
        <div
          className={`sticky top-0 z-20 flex justify-between items-center px-4 py-4 mx-4 ${themeClasses.bgPrimary} ${themeClasses.textSecondary} border-2 ${themeClasses.borderSubCategory} relative rounded-full overflow-hidden`}
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex flex-row items-center">
            <div className="flex items-center gap-3 w-full">
              <div className="w-12 h-12 rounded-full bg-[rgba(253,186,42,0.20)] flex items-center justify-center">
                <img src={CartIcon} alt="" className="w-6 h-6 " />
              </div>
              <div>
                <h2 className="text-xl sm:text-xl font-bold">{texts.title}</h2>
                {totalItems > 0 && (
                  <p className="text-sm opacity-80">
                    {totalItems}{" "}
                    {totalItems === 1 ? texts.items : texts.itemsPlural}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-[rgba(209,209,209,0.2)] hover:bg-[rgba(209,209,209,0.4)] flex items-center justify-center transition-all duration-200 active:scale-95"
            aria-label="Close cart"
          >
            {themeClasses.isDark
              ? backIcon("#ffffff", 24, "transition-transform duration-200")
              : backIcon("#8F8F8F", 24, "transition-transform duration-200")}
          </button>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex flex-col min-h-[calc(100vh-90px)] sm:min-h-[500px]">
          <div className="flex-1 overflow-y-auto overscroll-contain modal-content">
            {cartItems.length === 0 ? (
              // Mobile-Optimized Empty State
              <div className="px-4 sm:px-6 py-16 sm:py-12 text-center flex flex-col items-center justify-center min-h-[50vh] sm:min-h-0">
                <div
                  className={`mx-auto mb-8 w-32 h-32 sm:w-24 sm:h-24 rounded-full ${themeClasses.bgSecondary} flex items-center justify-center`}
                >
                  <ShoppingBagIcon
                    className={`w-16 h-16 sm:w-12 sm:h-12 opacity-40 ${themeClasses.textSecondary}`}
                  />
                </div>
                <h3 className="text-2xl sm:text-xl font-bold mb-3">
                  {texts.empty}
                </h3>
                <p
                  className={`${themeClasses.textSecondary} text-base sm:text-sm max-w-xs`}
                >
                  {texts.emptySubtext}
                </p>
              </div>
            ) : (
              // Mobile-Optimized Cart Items
              <div className="px-4 sm:px-6 py-4 space-y-3 sm:space-y-3">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-3xl ${themeClasses.bgSecondary} border ${themeClasses.borderCategory} transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:scale-[1.02] backdrop-blur-sm`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isVisible
                        ? "slideInUp 0.4s ease-out forwards"
                        : "none",
                    }}
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    <div className="relative p-5 sm:p-4">
                      <div className="flex items-start gap-4">
                        {/* Enhanced Item Image */}
                        <div className="relative w-20 h-20 sm:w-18 sm:h-18 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                          <img
                            src={item.image}
                            alt={item.name[language]}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        </div>

                        {/* Enhanced Item Details */}
                        <div className="flex-1 min-w-0 space-y-3">
                          {/* Header with title and remove button */}
                          <div className="flex items-start justify-between gap-3">
                            <h3
                              className={`font-bold text-lg sm:text-base leading-tight line-clamp-2 ${
                                themeClasses.isDark
                                  ? themeClasses.buttonTextPrimary
                                  : themeClasses.textPrimary
                              }`}
                            >
                              {item.name[language] || item.name.ku}
                            </h3>

                            {/* Enhanced Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 active:scale-95"
                              aria-label="Remove item"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price Information */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm ${themeClasses.textSecondary} font-medium`}
                              >
                                {formatPrice(
                                  Number(item.price.replace(/,/g, ""))
                                )}{" "}
                                × {item.quantity}
                              </span>
                              <span className="font-bold text-[#FDBB2A] text-lg">
                                {formatPrice(
                                  Number(item.price.replace(/,/g, "")) *
                                    item.quantity
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Enhanced Quantity Controls */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    String(item.id),
                                    item.quantity - 1
                                  )
                                }
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 border ${
                                  themeClasses.isDark
                                    ? "bg-[#727272] hover:bg-[#575757] border-[#727272] text-white"
                                    : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
                                }`}
                                aria-label="Decrease quantity"
                              >
                                {themeClasses.isDark
                                  ? getMinusIcon("#FFFFFF", 16)
                                  : getMinusIcon("#374151", 16)}
                              </button>

                              <div
                                className={`min-w-[2.5rem] h-9 rounded-xl ${themeClasses.bgCard} border ${themeClasses.borderCategory} flex items-center justify-center shadow-sm`}
                              >
                                <span className="text-base font-bold">
                                  {item.quantity}
                                </span>
                              </div>

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    String(item.id),
                                    item.quantity + 1
                                  )
                                }
                                className="w-9 h-9 bg-gradient-to-r from-[#FDBB2A] to-[#F59E0B] hover:from-[#E5A625] hover:to-[#D97706] text-white rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg border border-[#FDBB2A]/20"
                                aria-label="Increase quantity"
                              >
                                {getPlusIcon("#FFFFFF", 16)}
                              </button>
                            </div>

                            {/* Item status indicator */}
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                Available
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FDBB2A]/20 to-transparent"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile-Optimized Footer with Safe Area - Collapsible */}
          {cartItems.length > 0 && (
            <div
              className={`mt-auto sticky bottom-0 z-20 px-4 sm:px-6 py-6 sm:py-5 border-t ${themeClasses.borderCategory} ${themeClasses.bgCard} shadow-[0px_0px_30px_0px_rgba(0,0,0,0.20)] rounded-t-3xl`}
              style={{
                paddingBottom:
                  "max(1.5rem, env(safe-area-inset-bottom) + 1rem)",
              }}
            >
              {/* Rest of the footer content remains the same */}
              <div className="mb-6 sm:mb-5">
                {/* Always Visible Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl sm:text-xl font-bold">
                    {texts.total}
                  </span>
                  <span className="text-xl sm:text-xl font-bold text-[#FDBB2A]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                {/* Collapsible Details Toggle */}
                <button
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg ${themeClasses.textSecondary} hover:${themeClasses.bgSecondary} transition-all duration-200`}
                >
                  <span className="text-sm font-medium">
                    {showPriceBreakdown
                      ? texts.hideCartDetails
                      : texts.showCartDetails}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showPriceBreakdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Collapsible Price Details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showPriceBreakdown
                      ? "max-h-40 opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        className={`${themeClasses.textSecondary} text-base sm:text-sm`}
                      >
                        {texts.subtotal}
                      </span>
                      <span className="font-semibold text-base sm:text-sm">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`${themeClasses.textSecondary} text-base sm:text-sm`}
                      >
                        {texts.delivery}
                      </span>
                      <span className="font-semibold text-base sm:text-sm">
                        {formatPrice(ServiceFee)}
                      </span>
                    </div>
                    <div
                      className={`h-px ${themeClasses.bgSeparator} my-2`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized Action Buttons */}
              {showClearConfirm ? (
                <div className="space-y-4">
                  <p className="text-center text-base sm:text-sm font-medium px-4">
                    {texts.confirmClear}
                  </p>
                  <div className="flex gap-4 sm:gap-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className={`flex-1 py-4 sm:py-3 rounded-xl border ${themeClasses.borderCategory} font-bold text-base sm:text-sm ${themeClasses.itemHover} transition-all duration-200 active:scale-95`}
                    >
                      {texts.cancel}
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="flex-1 py-4 sm:py-3 rounded-xl bg-red-500 active:bg-red-600 text-white font-bold text-base sm:text-sm transition-all duration-200 active:scale-95"
                    >
                      {texts.confirm}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Clear Cart Button */}
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className={`w-full flex justify-center items-center gap-2 px-4 sm:px-4 py-3 sm:py-2.5 rounded-xl border ${themeClasses.borderCategory} font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-300 transition-all duration-200 active:scale-95`}
                  >
                    <TrashIcon className="w-4 h-4" />
                    {texts.clearCart}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Smooth scrolling for mobile */
        .overscroll-contain {
          overscroll-behavior: contain;
        }
        
        /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
        .modal-content::-webkit-scrollbar {
          display: none !important;
        }
        
        /* Hide scrollbar for Firefox */
        .modal-content {
          scrollbar-width: none !important;;
        }
        
        /* Hide scrollbar for IE and Edge */
        .modal-content {
          -ms-overflow-style: none !important;;
        }
        
        /* Custom scrollbar for mobile - fallback */
        @media (max-width: 640px) {
          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default CartInfo;
