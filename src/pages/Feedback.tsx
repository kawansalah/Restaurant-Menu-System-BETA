import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Language, LocalizedText } from "@/types/menu";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import { submitFeedback, FeedbackSubmission } from "@/services/feedbackService";

import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

interface FeedbackData {
  foodQuality: number;
  serviceQuality: number;
  cleanliness: number;
  overallSatisfaction: number;
  staffBehavior: number;
}

interface ContactFormData {
  phone: string;
  tableNumber: string;
  comment: string;
}

function Feedback() {
  const navigate = useNavigate();
  const { language: urlLanguage } = useParams<{ language: string }>();
  const { language: contextLanguage, setLanguage } = useLanguage();
  const { restaurant } = useRestaurant();
  const theme = useThemeClasses();
  const currentLanguage: Language =
    contextLanguage || (urlLanguage as Language) || "ku";
  const isRTL = currentLanguage === "ku" || currentLanguage === "ar";

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    foodQuality: 0,
    serviceQuality: 0,
    cleanliness: 0,
    overallSatisfaction: 0,
    staffBehavior: 0,
  });

  useEffect(() => {
    if (
      urlLanguage &&
      (urlLanguage === "ku" || urlLanguage === "ar" || urlLanguage === "en") &&
      urlLanguage !== contextLanguage
    ) {
      setLanguage(urlLanguage as Language);
    }
  }, [urlLanguage, contextLanguage, setLanguage]);

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactFormData>({
    phone: "",
    tableNumber: "",
    comment: "",
  });

  // Form validation errors
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  // Scroll-based collapse state
  const [scrollState, setScrollState] = useState({
    isSubtitleCollapsed: false,
    scrollY: 0,
    isScrollingDown: false,
    lastScrollY: 0,
    isLargeScreen: false,
  });

  const ticking = useRef(false);

  // Check if screen is large (desktop)
  const checkScreenSize = useCallback(() => {
    const isLarge = window.innerWidth >= 1024; // lg breakpoint in Tailwind
    setScrollState((prev) => ({
      ...prev,
      isLargeScreen: isLarge,
    }));
  }, []);

  // Optimized scroll handler with requestAnimationFrame
  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > scrollState.lastScrollY;

    // Disable collapse feature on large screens
    if (scrollState.isLargeScreen) {
      setScrollState((prev) => ({
        ...prev,
        scrollY: currentScrollY,
        isScrollingDown,
        lastScrollY: currentScrollY,
        isSubtitleCollapsed: false, // Always show subtitle on large screens
      }));
      ticking.current = false;
      return;
    }

    // Hysteresis for better UX on small screens
    const collapseThreshold = 60;
    const expandThreshold = 10;

    let shouldCollapse = scrollState.isSubtitleCollapsed;

    if (currentScrollY === 0) {
      shouldCollapse = false;
    } else if (
      !scrollState.isSubtitleCollapsed &&
      currentScrollY > collapseThreshold &&
      isScrollingDown
    ) {
      shouldCollapse = true;
    } else if (
      scrollState.isSubtitleCollapsed &&
      currentScrollY < expandThreshold &&
      !isScrollingDown
    ) {
      shouldCollapse = false;
    }

    setScrollState((prev) => ({
      ...prev,
      scrollY: currentScrollY,
      isScrollingDown,
      lastScrollY: currentScrollY,
      isSubtitleCollapsed: shouldCollapse,
    }));

    ticking.current = false;
  }, [
    scrollState.lastScrollY,
    scrollState.isSubtitleCollapsed,
    scrollState.isLargeScreen,
  ]);

  // Scroll listener with RAF throttling
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollState);
      ticking.current = true;
    }
  }, [updateScrollState]);

  // Enhanced scroll listener and screen size check
  useEffect(() => {
    // Check screen size on mount and resize
    checkScreenSize();

    const handleResize = () => {
      checkScreenSize();
    };

    // Only add scroll listener on small screens
    if (!scrollState.isLargeScreen) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, checkScreenSize, scrollState.isLargeScreen]);

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
  const getSendIcon = (color: string, size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.1391 2.95907L7.10914 5.95907C1.03914 7.98907 1.03914 11.2991 7.10914 13.3191L9.78914 14.2091L10.6791 16.8891C12.6991 22.9591 16.0191 22.9591 18.0391 16.8891L21.0491 7.86907C22.3891 3.81907 20.1891 1.60907 16.1391 2.95907ZM16.4591 8.33907L12.6591 12.1591C12.5091 12.3091 12.3191 12.3791 12.1291 12.3791C11.9391 12.3791 11.7491 12.3091 11.5991 12.1591C11.3091 11.8691 11.3091 11.3891 11.5991 11.0991L15.3991 7.27907C15.6891 6.98907 16.1691 6.98907 16.4591 7.27907C16.7491 7.56907 16.7491 8.04907 16.4591 8.33907Z"
          fill={color}
        />
      </svg>
    );
  };
  const getNumberIcon = (color: string, size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 17 18"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.49996 17.5C13.1416 17.5 17 13.65 17 9C17 4.35834 13.1333 0.5 8.49164 0.5C3.84163 0.5 0 4.35834 0 9C0 13.65 3.84998 17.5 8.49996 17.5ZM6.24162 13.275C5.88329 13.275 5.61663 12.9667 5.69161 12.6167L6.04162 10.8833H5.2583C4.96664 10.8833 4.75832 10.6667 4.75832 10.375C4.75832 10.0333 5.00831 9.78332 5.34164 9.78332H6.27497L6.64998 8.00832H5.88329C5.59163 8.00832 5.37499 7.79168 5.37499 7.49166C5.37499 7.15833 5.6333 6.89999 5.95828 6.89999H6.88329L7.26665 5.10835C7.32496 4.77501 7.54164 4.60833 7.89165 4.60833C8.25829 4.60833 8.50832 4.91667 8.4333 5.26667L8.09997 6.89999H9.72496L10.1 5.10835C10.1666 4.77501 10.3916 4.60833 10.7333 4.60833C11.0916 4.60833 11.3499 4.90835 11.2833 5.26667L10.95 6.89999H11.725C12.0083 6.89999 12.2166 7.11666 12.2166 7.41668C12.2166 7.75833 11.9749 8.00832 11.6333 8.00832H10.7166L10.3333 9.78332H11.1C11.3916 9.78332 11.6 10 11.6 10.2917C11.6 10.6333 11.3499 10.8833 11.0166 10.8833H10.1083L9.70828 12.7666C9.64165 13.1 9.41662 13.275 9.05829 13.275C8.70828 13.275 8.45829 12.9667 8.52496 12.6167L8.88329 10.8917H7.2583L6.8583 12.7666C6.79999 13.1 6.58331 13.275 6.24162 13.275ZM7.41662 9.88334H9.17495L9.5833 7.92502H7.82494L7.41662 9.88334Z"
          fill={color}
        />
      </svg>
    );
  };
  const getPhoneIcon = (color: string, size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 17 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.8103 11.9461L10.4182 12.3589C10.4182 12.3589 9.48638 13.34 6.94283 10.6621C4.3993 7.98419 5.33114 7.00312 5.33114 7.00312L5.57803 6.7432C6.18622 6.10291 6.24355 5.07493 5.71293 4.32446L4.62753 2.7893C3.97078 1.86045 2.70175 1.73775 1.949 2.53024L0.597956 3.95265C0.224714 4.3456 -0.0254057 4.85499 0.00492745 5.42007C0.0825249 6.86573 0.700266 9.97612 4.14731 13.6053C7.80273 17.4537 11.2326 17.6067 12.6352 17.4683C13.0788 17.4244 13.4646 17.1852 13.7755 16.8579L14.9983 15.5705C15.8237 14.7016 15.591 13.2119 14.5349 12.604L12.8904 11.6574C12.197 11.2583 11.3522 11.3755 10.8103 11.9461Z"
          fill={color}
        />
        <path
          d="M8.83348 1.04213C8.89047 0.690179 9.22315 0.45143 9.57511 0.508403C9.59689 0.512578 9.66704 0.525679 9.70371 0.533856C9.77722 0.550219 9.87965 0.575396 10.0074 0.612607C10.2629 0.687011 10.6197 0.809592 11.048 1.00596C11.9056 1.39912 13.0468 2.08686 14.231 3.2711C15.4153 4.45533 16.103 5.59653 16.4961 6.45409C16.6926 6.88242 16.8151 7.2393 16.8895 7.49475C16.9267 7.6225 16.9519 7.72495 16.9683 7.79839C16.9764 7.83512 16.9825 7.86461 16.9866 7.8864L16.9916 7.91325C17.0485 8.26517 16.812 8.61172 16.46 8.6687C16.1091 8.72551 15.7784 8.48785 15.7201 8.13761C15.7183 8.12814 15.7133 8.10292 15.708 8.07908C15.6974 8.03139 15.679 7.9558 15.6499 7.85581C15.5917 7.65583 15.4905 7.35859 15.3225 6.99218C14.987 6.26027 14.3836 5.24958 13.318 4.18407C12.2526 3.11857 11.2419 2.51519 10.51 2.17964C10.1436 2.01165 9.84634 1.91049 9.6463 1.85223C9.54636 1.82311 9.42069 1.79427 9.37301 1.78365C9.02268 1.72527 8.77667 1.39308 8.83348 1.04213Z"
          fill={color}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.02817 4.01136C9.12612 3.66854 9.48342 3.47003 9.82626 3.56797L9.64895 4.18871C9.82626 3.56797 9.82626 3.56797 9.82626 3.56797L9.82755 3.56833L9.82885 3.56871L9.83169 3.56955L9.8384 3.57154L9.85544 3.57685C9.86835 3.581 9.88462 3.5864 9.9039 3.59326C9.94255 3.60698 9.99368 3.62649 10.0563 3.65334C10.1818 3.70709 10.353 3.79008 10.5636 3.91464C10.9848 4.16399 11.56 4.57817 12.2357 5.25384C12.9114 5.92952 13.3255 6.50466 13.5749 6.92598C13.6994 7.13644 13.7824 7.30778 13.8362 7.43319C13.8631 7.49585 13.8826 7.54695 13.8963 7.5856C13.9032 7.60493 13.9085 7.62114 13.9127 7.63412L13.918 7.65115L13.92 7.65782L13.9208 7.66069L13.9212 7.66201C13.9212 7.66201 13.9216 7.66325 13.3008 7.8406L13.9216 7.66325C14.0195 8.00607 13.821 8.36336 13.4782 8.46131C13.1383 8.55841 12.7841 8.36413 12.6826 8.02666L12.6794 8.01738C12.6749 8.00444 12.6654 7.97898 12.6495 7.94179C12.6176 7.86748 12.5599 7.74591 12.4638 7.58358C12.2719 7.2593 11.9252 6.76931 11.3227 6.16681C10.7202 5.56432 10.2302 5.2177 9.90597 5.02577C9.74363 4.92969 9.62209 4.87194 9.54772 4.84009C9.51054 4.82416 9.48506 4.81465 9.47215 4.81007L9.46285 4.80689C9.12543 4.70542 8.93107 4.35126 9.02817 4.01136Z"
          fill={color}
        />
      </svg>
    );
  };
  const getFeedbackIcon = (color: string, size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 21 20"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5005 0.000244141C5.00049 0.000244141 0.500488 4.50024 0.500488 10.0002C0.500488 12.3002 1.30049 14.5002 2.80049 16.3002L0.800488 18.3002C0.400488 18.7002 0.400488 19.3002 0.800488 19.7002C1.00049 19.9002 1.20049 20.0002 1.50049 20.0002H10.5005C16.0005 20.0002 20.5005 15.5002 20.5005 10.0002C20.5005 4.50024 16.0005 0.000244141 10.5005 0.000244141ZM6.50049 11.0002C5.90049 11.0002 5.50049 10.6002 5.50049 10.0002C5.50049 9.40024 5.90049 9.00024 6.50049 9.00024C7.10049 9.00024 7.50049 9.40024 7.50049 10.0002C7.50049 10.6002 7.10049 11.0002 6.50049 11.0002ZM10.5005 11.0002C9.90049 11.0002 9.50049 10.6002 9.50049 10.0002C9.50049 9.40024 9.90049 9.00024 10.5005 9.00024C11.1005 9.00024 11.5005 9.40024 11.5005 10.0002C11.5005 10.6002 11.1005 11.0002 10.5005 11.0002ZM14.5005 11.0002C13.9005 11.0002 13.5005 10.6002 13.5005 10.0002C13.5005 9.40024 13.9005 9.00024 14.5005 9.00024C15.1005 9.00024 15.5005 9.40024 15.5005 10.0002C15.5005 10.6002 15.1005 11.0002 14.5005 11.0002Z"
          fill={color}
        />
      </svg>
    );
  };
  const backIcon = (color: string, size: number, className: string) => (
    <svg
      className={`${className} ${
        contextLanguage === "en" ? "scale-x-[-1]" : ""
      }`}
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

  const getLocalizedText = (text: LocalizedText): string => {
    return text[currentLanguage] || text.ku || "";
  };

  const handleRatingChange = (field: keyof FeedbackData, rating: number) => {
    setFeedbackData((prev) => ({ ...prev, [field]: rating }));
  };

  const defaultTexts = {
    feedback: {
      title: {
        ku: "هەڵسەنگاندن",
        ar: "تقييمك",
        en: "Feedback",
      },
      subtitle: {
        ku: "میوانی بەڕێز ئەتوانی لێرە فیدباکی خۆت بدەیت سەبارەت بە چێشتخانەکەمان بە گشتی.",
        ar: "عزيزي الضيف، يمكنك تقديم ملاحظاتك حول مطعمنا بشكل عام هنا.",
        en: "Dear guest, you can give your feedback here About our restaurant in general.",
      },
      foodQuality: {
        ku: "خواردنەکەت بەلاوە چۆن بوو؟",
        ar: "كيف تقيم جودة الطعام؟",
        en: "How would you rate the quality of the food?",
      },
      serviceQuality: {
        ku: "ئایا لە کاتی گەیشتنی خواردنەکان ڕازی بوویت؟",
        ar: "ما مدى سرعة استلامك للطعام/الخدمة؟",
        en: "How fast did you receive your food/service?",
      },
      cleanliness: {
        ku: "پاکوخاوێنی ڕێستۆرانتت بەلاوە چۆن بوو؟",
        ar: "كيف كانت النظافة؟",
        en: "How was the cleanliness?",
      },
      staffBehavior: {
        ku: "ستافەکەت بەلاوە چۆن بوو؟",
        ar: "كيف كان سلوك موظفي المطعم؟",
        en: "How was the staff behavior?",
      },
      overallSatisfaction: {
        ku: "ئەزموونی گشتیتان چۆن بوو؟",
        ar: "بشكل عام، كيف كانت تجربتك معنا؟",
        en: "Overall, how was your experience with us?",
      },
      contact: {
        ku: "زیاتر",
        ar: "المزيد",
        en: "More",
      },
      phoneNumber: {
        ku: "ژمارەی تەلەفۆن",
        ar: "رقم الهاتف",
        en: "Phone Number",
      },
      tableNumber: {
        ku: "ژمارەی مێز",
        ar: "رقم الطاولة",
        en: "Table Number",
      },
      yourComment: {
        ku: "تێبینی",
        ar: "تعليقك",
        en: "Your Comment",
      },
      submit: {
        ku: "ناردن",
        ar: "إرسال",
        en: "Submit",
      },
      submitted: {
        ku: "فیدباکەکەت نێردرا!",
        ar: "تم إرسال ملاحظاتك!",
        en: "Feedback Submitted!",
      },
    },

    validation: {
      phoneRequired: {
        ku: "ژمارەی تەلەفۆن پێویستە",
        ar: "رقم الهاتف مطلوب",
        en: "Phone number is required",
      },
      phoneInvalid: {
        ku: "تکایە ژمارەی تەلەفۆنێکی دروست بنووسە",
        ar: "يرجى إدخال رقم هاتف صحيح",
        en: "Please enter a valid phone number",
      },
      tableRequired: {
        ku: "ژمارەی مێز پێویستە",
        ar: "رقم الطاولة مطلوب",
        en: "Table number is required",
      },
      tableInvalid: {
        ku: "تکایە ژمارەی مێزێکی دروست بنووسە",
        ar: "يرجى إدخال رقم طاولة صحيح",
        en: "Please enter a valid table number",
      },
      ratingRequired: {
        ku: "تکایە ڕەیتینگ هەڵبژێرە",
        ar: "يرجى اختيار تقييم",
        en: "Please select a rating",
      },
    },

    alerts: {
      ratingSubmitted: {
        ku: "ڕەیتینگەکەت نێردرا",
        ar: "تم إرسال التقييم",
        en: "Rating submitted",
      },
    },
  };
  const getText = () => {
    const config = defaultMenuConfig.ui?.feedback;
    const validation = defaultMenuConfig.ui?.validation;
    const alerts = defaultMenuConfig.ui?.alerts;

    return {
      icon: config?.icon || "",
      title: config?.title
        ? getLocalizedText(config.title)
        : getLocalizedText(defaultTexts.feedback.title),
      subtitle: config?.subtitle
        ? getLocalizedText(config.subtitle)
        : getLocalizedText(defaultTexts.feedback.subtitle),
      foodQuality: config?.foodQuality || defaultTexts.feedback.foodQuality,
      serviceQuality:
        config?.serviceQuality || defaultTexts.feedback.serviceQuality,
      cleanliness: config?.cleanliness || defaultTexts.feedback.cleanliness,
      staffBehavior:
        config?.staffBehavior || defaultTexts.feedback.staffBehavior,
      overallSatisfaction:
        config?.overallSatisfaction ||
        defaultTexts.feedback.overallSatisfaction,
      contact: config?.contact
        ? getLocalizedText(config.contact)
        : getLocalizedText(defaultTexts.feedback.contact),
      phoneNumber: config?.phoneNumber
        ? getLocalizedText(config.phoneNumber)
        : getLocalizedText(defaultTexts.feedback.phoneNumber),
      tableNumber: config?.tableNumber
        ? getLocalizedText(config.tableNumber)
        : getLocalizedText(defaultTexts.feedback.tableNumber),
      yourComment: config?.yourComment
        ? getLocalizedText(config.yourComment)
        : getLocalizedText(defaultTexts.feedback.yourComment),
      submit: config?.submit
        ? getLocalizedText(config.submit)
        : getLocalizedText(defaultTexts.feedback.submit),
      submitted: config?.submitted
        ? getLocalizedText(config.submitted)
        : getLocalizedText(defaultTexts.feedback.submitted),

      validation: {
        phoneRequired: validation?.phoneRequired
          ? getLocalizedText(validation.phoneRequired)
          : getLocalizedText(defaultTexts.validation.phoneRequired),
        phoneInvalid: validation?.phoneInvalid
          ? getLocalizedText(validation.phoneInvalid)
          : getLocalizedText(defaultTexts.validation.phoneInvalid),
        tableRequired: validation?.tableRequired
          ? getLocalizedText(validation.tableRequired)
          : getLocalizedText(defaultTexts.validation.tableRequired),
        tableInvalid: validation?.tableInvalid
          ? getLocalizedText(validation.tableInvalid)
          : getLocalizedText(defaultTexts.validation.tableInvalid),
        ratingRequired: validation?.ratingRequired
          ? getLocalizedText(validation.ratingRequired)
          : getLocalizedText(defaultTexts.validation.ratingRequired),
      },

      alerts: {
        ratingSubmitted: alerts?.ratingSubmitted
          ? getLocalizedText(alerts.ratingSubmitted)
          : getLocalizedText(defaultTexts.alerts.ratingSubmitted),
      },
    };
  };
  const text = getText();

  const handleContactFormChange =
    (field: keyof ContactFormData) => (value: string) => {
      setContactForm((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  // Validate contact form
  const validateContactForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!contactForm.phone.trim()) {
      newErrors.phone = text.validation.phoneRequired;
    } else if (!/^\+?[\d\s-()]+$/.test(contactForm.phone)) {
      newErrors.phone = text.validation.phoneInvalid;
    }

    if (!contactForm.tableNumber.trim()) {
      newErrors.tableNumber = text.validation.tableRequired;
    } else if (
      isNaN(Number(contactForm.tableNumber)) ||
      Number(contactForm.tableNumber) <= 0
    ) {
      newErrors.tableNumber = text.validation.tableInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!restaurant?.id) {
      setSubmitError("Restaurant not found. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate that at least one rating is provided
      const hasRating = Object.values(feedbackData).some(
        (rating) => rating > 0
      );
      if (!hasRating) {
        setSubmitError(text.validation.ratingRequired);
        setIsSubmitting(false);
        return;
      }

      const feedbackSubmission: FeedbackSubmission = {
        restaurantId: restaurant.id,
        phone: contactForm.phone,
        tableNumber: contactForm.tableNumber,
        comment:
          `Table: ${contactForm.tableNumber}\n\n${contactForm.comment}`.trim(), // Include table number in comment
        foodQuality: feedbackData.foodQuality,
        serviceQuality: feedbackData.serviceQuality,
        cleanliness: feedbackData.cleanliness,
        overallSatisfaction: feedbackData.overallSatisfaction,
        staffBehavior: feedbackData.staffBehavior,
      };

      await submitFeedback(feedbackSubmission);

      setSubmitSuccess(true);

      // Reset form after successful submission
      setFeedbackData({
        foodQuality: 0,
        serviceQuality: 0,
        cleanliness: 0,
        overallSatisfaction: 0,
        staffBehavior: 0,
      });
      setContactForm({
        phone: "",
        tableNumber: "",
        comment: "",
      });

      // Show success message and navigate back after delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (
    rating: number,
    onRatingChange: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-3 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`flex flex-row items-center justify-center rounded-2xl w-12 h-12 transition-all duration-200 ${
              star <= rating
                ? "bg-main"
                : theme.isDark
                ? "bg-[#373737]"
                : "bg-[#F4F4F4]"
            } hover:scale-110 cursor-pointer active:scale-95`}
          >
            {star <= rating
              ? getStarIcon("#FFFFFF", 20)
              : getStarIcon("#9A9A9A", 20)}
          </button>
        ))}
      </div>
    );
  };

  const renderFeedbackSection = (
    title: LocalizedText,
    field: keyof FeedbackData
  ) => (
    <div
      className={`${
        theme.isDark ? "bg-[#232323]" : "bg-[#ffffff]"
      } rounded-4xl p-6 border-1 ${theme.border}`}
    >
      <h3 className={`text-lg font-bold mb-6 text-center ${theme.text}`}>
        {getLocalizedText(title)}
      </h3>
      {renderStarRating(feedbackData[field], (rating) =>
        handleRatingChange(field, rating)
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${
        theme.isLight ? theme.bgSecondary : theme.bgPrimary
      } transition-colors duration-300 px-4`}
    >
      {/* Fixed Header with Safe Area */}
      <div className={`sticky top-5 z-20 w-full max-w-3xl mb-20`}>
        <div
          className={`w-full z-20 flex justify-between items-center px-4 py-4 ${
            theme.bgTopbar
          } ${theme.textSecondary} border-1 ${
            theme.isLight ? theme.border : theme.border
          } relative rounded-full overflow-hidden backdrop-blur-md`}
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex flex-row items-center">
            <div className="flex items-center gap-3 w-full">
              <div className="w-12 h-12 rounded-full bg-[rgba(182,146,75,0.20)] flex items-center justify-center">
                {getFeedbackIcon("#B6934B", 24)}
              </div>
              <div>
                <h2
                  className={`${
                    theme.isDark ? theme.buttonTextSecondary : theme.textPrimary
                  } text-xl sm:text-xl font-bold`}
                >
                  {text.title}
                </h2>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-[rgba(209,209,209,0.2)] hover:bg-[rgba(209,209,209,0.4)] flex items-center justify-center transition-all duration-200 active:scale-95"
            aria-label="Close cart"
          >
            {theme.isDark
              ? backIcon("#ffffff", 24, "transition-transform duration-200")
              : backIcon("#8F8F8F", 24, "transition-transform duration-200")}
          </button>
        </div>

        {/* Scroll-based Collapsible Subtitle - Fixed positioning */}
        <div
          className={`absolute -mt-12 mx-auto z-10 ${
            theme.isDark ? "bg-[#191919]" : theme.bgPrimary
          } rounded-4xl border ${
            theme.border
          } overflow-hidden backdrop-blur-sm mx-4
          transition-all duration-500 
          w-full max-w-3xl
          ${
            scrollState.isSubtitleCollapsed
              ? "opacity-0 scale-y-0 -translate-y-4 pointer-events-none"
              : "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
          }`}
          style={{
            top: "calc(100% - 17px)",
            boxShadow: scrollState.isSubtitleCollapsed
              ? "none"
              : "0 8px 32px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)",
            transformOrigin: "top center",
          }}
        >
          <div
            className={`flex items-center gap-3 p-6 transition-all duration-400 ease-out ${
              scrollState.isSubtitleCollapsed ? "opacity-0" : "opacity-100"
            }`}
            style={{ marginTop: "64px" }}
          >
            <div
              className={`w-13 h-13 2xl:w-18 2xl:h-18 flex items-center justify-center
              transition-all duration-300 ${
                scrollState.isSubtitleCollapsed
                  ? "scale-75 opacity-0"
                  : "scale-100 opacity-100"
              }`}
            >
              <img
                src={text.icon}
                alt="feedback.svg"
                className="w-full h-full transition-transform duration-300"
              />
            </div>
            <div
              className={`flex-1 transition-all duration-300 ${
                scrollState.isSubtitleCollapsed
                  ? "translate-x-2 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <p
                className={`text-base 2xl:text-xl lg:text-xl ${theme.text} font-normal leading-relaxed
                  transition-all duration-300`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {text.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with consistent spacing */}
      <div className="w-full mx-auto mt-20">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Feedback Sections */}
          {renderFeedbackSection(text.foodQuality, "foodQuality")}
          {renderFeedbackSection(text.cleanliness, "cleanliness")}
          {renderFeedbackSection(text.serviceQuality, "serviceQuality")}
          {renderFeedbackSection(text.staffBehavior, "staffBehavior")}
          {renderFeedbackSection(
            text.overallSatisfaction,
            "overallSatisfaction"
          )}

          {/* Contact Section */}
          <div
            className={`${
              theme.isDark ? "bg-[#232323]" : "bg-[#ffffff]"
            } rounded-4xl p-6 border ${theme.border}`}
          >
            <h3 className={`text-lg text-center font-bold mb-4 ${theme.text}`}>
              {text.contact}
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                {/* Phone Input */}
                <FormInput
                  type="tel"
                  placeholder={text.phoneNumber}
                  value={contactForm.phone}
                  onChange={handleContactFormChange("phone")}
                  icon={
                    theme.isDark
                      ? getPhoneIcon("#FFFFFF", 24)
                      : getPhoneIcon("#313234", 24)
                  }
                  iconPosition="left"
                  direction={isRTL ? "rtl" : "ltr"}
                  error={errors.phone}
                  required
                  variant="filled"
                  size="md"
                  aria-label={text.phoneNumber}
                />

                {/* Table Number Input */}
                <FormInput
                  type="number"
                  placeholder={text.tableNumber}
                  value={contactForm.tableNumber}
                  onChange={handleContactFormChange("tableNumber")}
                  icon={
                    theme.isDark
                      ? getNumberIcon("#FFFFFF", 24)
                      : getNumberIcon("#313234", 24)
                  }
                  iconPosition="left"
                  direction={isRTL ? "rtl" : "ltr"}
                  error={errors.tableNumber}
                  required
                  variant="filled"
                  size="md"
                  aria-label={text.tableNumber}
                />

                {/* Comment Input */}
                <FormInput
                  type="textarea"
                  placeholder={text.yourComment}
                  value={contactForm.comment}
                  onChange={handleContactFormChange("comment")}
                  icon={
                    theme.isDark
                      ? getFeedbackIcon("#FFFFFF", 24)
                      : getFeedbackIcon("#313234", 24)
                  }
                  iconPosition="left"
                  direction={isRTL ? "rtl" : "ltr"}
                  required
                  rows={4}
                  resize={false}
                  variant="filled"
                  size="md"
                  aria-label={text.yourComment}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 mb-20 flex flex-col justify-center items-center gap-4">
            {/* Error Message */}
            {submitError && (
              <div className="w-full max-w-md p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 text-center">
                {submitError}
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="w-full max-w-md p-4 bg-green-100 border border-green-300 rounded-2xl text-green-700 text-center">
                {text.submitted}
              </div>
            )}

            <Button
              type="button"
              onClick={() => {
                if (validateContactForm()) {
                  handleSubmit();
                }
              }}
              disabled={isSubmitting || submitSuccess}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {currentLanguage === "ku"
                    ? "ناردن..."
                    : currentLanguage === "ar"
                    ? "جاري الإرسال..."
                    : "Submitting..."}
                </>
              ) : (
                <>
                  {getSendIcon("#ffffff", 24)}
                  {text.submit}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
