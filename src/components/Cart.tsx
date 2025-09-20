import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import CartIcon from "@/assets/icons/cart_2.svg";
import CartInfo from "./CartInfo";
import {Cart as CartSVG} from "@/components/Icons";

interface CartProps {
  currency?: {
    ku: string;
    ar: string;
    en: string;
  };
}

const Cart: React.FC<CartProps> = ({ currency }) => {
  const {
    cartItems,
    getTotalItems,
    getTotalPrice,
    openCartInfo,
    closeCartInfo,
    isCartInfoOpen,
  } = useCart();
  const { language, isRTL } = useLanguage();
  const themeClasses = useThemeClasses();

  // Don't render if cart is empty
  if (cartItems.length === 0) {
    return null;
  }

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

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
    const Texts = defaultMenuConfig.ui?.cart.colapssedCart || {
      ku: "بینینی سەبەتە",
      ar: "عرض السلة",
      en: "View Cart",
    };
    return Texts[language] || Texts.en;
  };

  const handleCartClick = () => {
    openCartInfo();
  };

  return (
    <>
      <div
        className={`fixed bottom-4 max-w-2xl w-fit 2xl:w-full lg:w-full md:w-full left-0 right-0 z-50 rounded-3xl ${
          themeClasses.bgPrimary
        } ${
          themeClasses.borderBottomNav
        } border-2 mx-auto p-4 shadow-[0px_3px_34px_rgba(0,0,0,0.30)] ${
          themeClasses.itemHover
        } cursor-pointer transition-all hover:scale-105 active:scale-95`}
        onClick={handleCartClick}
      >
        <div className="mx-auto">
          <div
            className={`flex items-center justify-between gap-8 ${
              isRTL ? "flex-row-reverse" : "flex-row-reverse"
            }`}
          >
            {/* Price */}
            <div
              className={`${themeClasses.buttonTextPrimary} ${themeClasses.bgMain} py-2 px-5 rounded-full text-base font-bold`}
            >
              {formatPrice(totalPrice)}
            </div>

            {/* Cart Info */}
            <div
              className={`flex flex-row items-center gap-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {/* Cart Icon with Badge */}
              <div className="relative">
                <div
                  className={`flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-[rgba(162,126,55,0.26)] font-bold text-sm transition-all duration-200`}
                >
                  <CartSVG className="w-6 h-6 text-main" />
                </div>

                {/* Quantity Badge */}
                {totalItems > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 ${
                      themeClasses.bgMain
                    } ${
                      themeClasses.buttonTextPrimary
                    } text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center min-w-[20px] border-2 border-[var(--bg-primary)]`}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>

              <h3
                className={`font-bold text-lg ${
                  themeClasses.isDark
                    ? themeClasses.buttonTextPrimary
                    : themeClasses.textPrimary
                } line-clamp-1`}
              >
                {getTexts()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Info Modal */}
      {isCartInfoOpen && (
        <CartInfo onClose={closeCartInfo} currency={currency} />
      )}
    </>
  );
};

export default Cart;
