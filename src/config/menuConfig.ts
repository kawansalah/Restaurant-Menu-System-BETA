import {fetchSystemSettings} from "@/services/theme";

import { MenuConfig } from "@/types/menu";
import appetizers from "@/assets/images/foods/morning.png";
import drinks from "@/assets/images/foods/drinks.png";
import mains from "@/assets/images/foods/stick.png";
import desserts from "@/assets/images/foods/cold.png";
import defaultFoodImage from "@/assets/images/foods/Frame 46.png";
import morning_1 from "@/assets/images/foods/morning_1.png";
import morning_2 from "@/assets/images/foods/morning_2.png";
import morning_3 from "@/assets/images/foods/morning_3.png";
import morning_4 from "@/assets/images/foods/morning_4.png";
// import logo from "@/assets/logo/sardar-logo.png";
import sardardark from "@/assets/logo/dark.svg";
import sardarlight from "@/assets/logo/light.svg";
import drinks_cover from "@/assets/images/foods/drinks_cover.jpg";
import milkshake_cover from "@/assets/images/foods/milkshake.jpg";
import main_cover from "@/assets/images/foods/main.jpg";
import hot_drinks from "@/assets/images/foods/tea.png";
import sweets from "@/assets/images/foods/sweets.png";
import feedback from "@/assets/icons/feedback.png";


// Function to get menu configuration with system settings
export const getMenuConfig = async (): Promise<MenuConfig> => {
  try {
    const systemSettings = await fetchSystemSettings();
    console.log('System settings loaded:', systemSettings);
    
    // Find the appearance settings
    const appearanceSettings = systemSettings.find(setting => setting.setting_type === 'appearance');
    
    return {
      ...defaultMenuConfig,
      // Override logo URLs if available from Supabase
      logo: {
        dark: appearanceSettings?.dark_logo_url || sardardark,
        light: appearanceSettings?.light_logo_url || sardarlight,
      },
    };
  } catch (error) {
    console.error('Failed to load system settings, using defaults:', error);
    return defaultMenuConfig;
  }
};

export const defaultMenuConfig: MenuConfig = {
  // logo: logo,
  logo: {
    dark: sardardark,
    light: sardarlight,
  },
  restaurantName: { 
    ku: "مطعم سالار",
    ar: "مطعم سالار",
    en: "Salar Restaurant",
  },
  searchPlaceholder: {
    ku: "گــەڕان...",
    ar: "بحث...",
    en: "Search...",
  },
  noResultsMessage: {
    ku: "هیچ ئەنجامێک نەدۆزرایەوە",
    ar: "لم يتم العثور على نتائج",
    en: "No results found",
  },
  defaultDescription: {
    ku: "وەسفی خۆراک",
    ar: "وصف الطبق",
    en: "Delicious dish description",
  },
  currency: {
    ku: "دینار",
    ar: "دینار",
    en: "IQD",
  },
  defaultRating: 4.5,
  showRating: true,
  showDescription: true,

  // Localized UI texts
  ui: {
    // Loader texts
    loader: {
      subtitles: {
        ku: "تەمەنێک لە ڕەسەنایەتی",
        ar: "طعم أصيل ومميز",
        en: "Authentic Taste & Quality",
      },
      steps: {
        ku: [
          "دامەزراندنی پەیوەندی",
          "بارکردنی مینیو",
          "ئامادەکردن",
          "تەواو بوو",
        ],
        ar: ["تأسيس الاتصال", "تحميل القائمة", "تحضير التجربة", "اكتمل"],
        en: [
          "Establishing Connection",
          "Loading Menu",
          "Preparing Experience",
          "Complete",
        ],
      },
      percentage: {
        ku: "%",
        ar: "%",
        en: "%",
      },
    },

    // Error pages
    notFound: {
      title: {
        ku: "٤٠٤",
        ar: "٤٠٤",
        en: "404",
      },
      subtitle: {
        ku: "لاپەڕەکە نەدۆزرایەوە",
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
      orText: {
        ku: "یان",
        ar: "أو",
        en: "or",
      },
    },

    // General UI elements
    all: {
      ku: "هەموو",
      ar: "الكل",
      en: "All",
    },
    allItems: {
      ku: "هەموو خواردنەکان",
      ar: "جميع الأطباق",
      en: "All Items",
    },

    // Item info modal
    itemInfo: {
      addToCart: {
        ku: "زیادکرن",
        ar: "إضافة إلى السلة",
        en: "Add to Cart",
      },
      total: {
        ku: "کۆی گشتی:",
        ar: "المجموع:",
        en: "Total:",
      },
      rating: {
        ku: "ڕەیتینگ:",
        ar: "التقييم:",
        en: "Rating:",
      },
      increaseQuantity: {
        ku: "زیادکردنی بڕ",
        ar: "زيادة الكمية",
        en: "Increase quantity",
      },
      decreaseQuantity: {
        ku: "کەمکردنەوەی بڕ",
        ar: "تقليل الكمية",
        en: "Decrease quantity",
      },
    },

    // Feedback toast
    feedbackToast: {
      message: {
        ku: "دوای خواردن، دەتوانیت ڕەیتینگ بدەیت!",
        ar: "بعد تناول الطعام، يمكنك تقييمه!",
        en: "After eating, you can rate this food!",
      },
      closeLabel: {
        ku: "داخستنی ئاگادارکردنەوە",
        ar: "إغلاق التنبيه",
        en: "Close toast",
      },
    },

    // Languages
    languages: {
      kurdish: {
        name: {
          ku: "کوردی",
          ar: "کوردی",
          en: "Kurdish",
        },
        nativeName: "کوردی",
        englishName: "ئینگلیزی",
      },
      arabic: {
        name: {
          ku: "عەرەبی",
          ar: "العربية",
          en: "Arabic",
        },
        nativeName: "العربية",
      },
      english: {
        name: {
          ku: "ئینگلیزی",
          ar: "الإنجليزية",
          en: "English",
        },
        nativeName: "English",
      },
    },

    // Footer
    footer: {
      developedBy: {
        ku: "پەرەی پێدراوە لەلایەن",
        ar: "طُور بواسطة",
        en: "Developed by",
      },
      connectWithUs: {
        ku: "لە تۆڕەکۆمەڵایەتیەکان لەگەڵمان بن",
        ar: "تواصل معنا",
        en: "Contact us",
      },
      allRightsReserved: {
        ku: "هەموو مافەکانی پارێزراوە",
        ar: "جميع الحقوق محفوظة",
        en: "All rights reserved",
      },
      poweredBy: {
        ku: "تەمەنێک لە ڕەسەنایەتی",
        ar: "حياة من الأصالة",
        en: "A lifetime of authenticity",
      },
      copyright: {
        ku: "© ٢٠٢٥ کاوان صەلاحەدین",
        ar: "© ٢٠٢٥ کاوان صەلاحەدین",
        en: "© 2025 Kawan Salahadin Dev",
      },
      socialMedia: {
        facebook: {
          ku: "فەیسبووک",
          ar: "فيسبوك",
          en: "Facebook",
        },
        instagram: {
          ku: "ئینستاگرام",
          ar: "إنستغرام",
          en: "Instagram",
        },
        linkedin: {
          ku: "لینکدین",
          ar: "لينكدإن",
          en: "LinkedIn",
        },
      },
    },

    // Language dropdown
    languageDropdown: {
      selectLanguage: {
        ku: "هەڵبژاردنی زمان",
        ar: "اختر اللغة",
        en: "Select language",
      },
    },

    // Accessibility and common labels
    accessibility: {
      closeModal: {
        ku: "داخستن",
        ar: "إغلاق النافذة",
        en: "Close modal",
      },
      loading: {
        ku: "بارکردن...",
        ar: "جاري التحميل...",
        en: "Loading...",
      },
      cart: {
        colapssedCart: {
          ku: "سەبەتە",
          ar: "السلة",
          en: "Cart",
        },
      },
      menu: {
        ku: "مینیو",
        ar: "القائمة",
        en: "Menu",
      },
      language: {
        ku: "زمان",
        ar: "اللغة",
        en: "Language",
      },
      icon: {
        ku: "وێنۆچکە",
        ar: "أيقونة",
        en: "Icon",
      },
    },

    cart: {
      colapssedCart: {
        ku: "بینینی سەبەتە",
        ar: "عرض السلة",
        en: "View Cart",
      },
    },

    // Feedback page texts
    feedback: {
      icon: feedback,
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

    // Food rating texts
    foodRating: {
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
      phoneLabel: {
        ku: "ژمارەی تەلەفۆن",
        ar: "رقم الهاتف",
        en: "Phone Number",
      },
      closeButton: {
        ku: "داخستن",
        ar: "إغلاق",
        en: "Close",
      },
      submitButton: {
        ku: "ناردن",
        ar: "إرسال",
        en: "Submit",
      },
    },

    // Validation messages
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

    // Alert messages
    alerts: {
      ratingSubmitted: {
        ku: "ڕەیتینگەکەت نێردرا",
        ar: "تم إرسال التقييم",
        en: "Rating submitted",
      },
      // Common alert texts
      buttons: {
        ok: {
          ku: "باشە",
          ar: "موافق",
          en: "OK",
        },
        yes: {
          ku: "بەڵێ",
          ar: "نعم",
          en: "Yes",
        },
        no: {
          ku: "نەخێر",
          ar: "لا",
          en: "No",
        },
        cancel: {
          ku: "هەڵوەشاندنەوە",
          ar: "إلغاء",
          en: "Cancel",
        },
        confirm: {
          ku: "پشتڕاستکردنەوە",
          ar: "تأكيد",
          en: "Confirm",
        },
        delete: {
          ku: "سڕینەوە",
          ar: "حذف",
          en: "Delete",
        },
        save: {
          ku: "خەزنکردن",
          ar: "حفظ",
          en: "Save",
        },
        close: {
          ku: "داخستن",
          ar: "إغلاق",
          en: "Close",
        },
        remove: {
          ku: "لابردن",
          ar: "إزالة",
          en: "Remove",
        },
      },
      // Common alert titles
      titles: {
        success: {
          ku: "سەرکەوتن",
          ar: "نجح",
          en: "Success",
        },
        error: {
          ku: "هەڵە",
          ar: "خطأ",
          en: "Error",
        },
        warning: {
          ku: "ئاگادارکردنەوە",
          ar: "تحذير",
          en: "Warning",
        },
        information: {
          ku: "زانیاری",
          ar: "معلومات",
          en: "Information",
        },
        confirmation: {
          ku: "پشتڕاستکردنەوە",
          ar: "تأكيد",
          en: "Confirmation",
        },
        deleteConfirmation: {
          ku: "پشتڕاستکردنەوەی سڕینەوە",
          ar: "تأكيد الحذف",
          en: "Delete Confirmation",
        },
        removeImage: {
          ku: "لابردنی وێنە",
          ar: "إزالة الصورة",
          en: "Remove Image",
        },
      },
      // Common alert messages
      messages: {
        deleteItem: {
          ku: "دڵنیایت لە سڕینەوەی ئەم بابەتە؟ ئەم کردارە ناگەڕێتەوە.",
          ar: "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
          en: "Are you sure you want to delete this item? This action cannot be undone.",
        },
        unsavedChanges: {
          ku: "گۆڕانکاریەکانت خەزن نەکراون. دڵنیایت لە جێهێشتنی لاپەڕەکە؟ گۆڕانکاریەکانت لەدەست دەچن.",
          ar: "لديك تغييرات غير محفوظة. هل أنت متأكد من مغادرة الصفحة؟ ستفقد تغييراتك.",
          en: "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
        },
        logout: {
          ku: "دڵنیایت لە دەرچوون؟",
          ar: "هل أنت متأكد من تسجيل الخروج؟",
          en: "Are you sure you want to logout?",
        },
        operationSuccess: {
          ku: "کردارەکە بە سەرکەوتوویی تەواو بوو!",
          ar: "تمت العملية بنجاح!",
          en: "Operation completed successfully!",
        },
        operationFailed: {
          ku: "کردارەکە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدەوە.",
          ar: "فشلت العملية. يرجى المحاولة مرة أخرى.",
          en: "Operation failed. Please try again.",
        },
        networkError: {
          ku: "کێشەی پەیوەندی. تکایە پەیوەندی ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵ بدەوە.",
          ar: "خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
          en: "Network error. Please check your internet connection and try again.",
        },
        removeImage: {
          ku: "دڵنیایت لە لابردنی ئەم وێنەیە؟ ئەم کردارە ناگەڕێتەوە.",
          ar: "هل أنت متأكد من إزالة هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء.",
          en: "Are you sure you want to remove this image? This action cannot be undone.",
        },
        imageRemoved: {
          ku: "وێنەکە بە سەرکەوتوویی لابرا",
          ar: "تم حذف الصورة بنجاح",
          en: "Image removed successfully",
        },
        imageRemoveFailed: {
          ku: "لابردنی وێنەکە سەرکەوتوو نەبوو",
          ar: "فشل في حذف الصورة",
          en: "Failed to delete image",
        },
      },
    },
  },

  categories: [
    {
      id: "appetizers",
      label: {
        ku: "موقەبیلات",
        ar: "المقبلات",
        en: "Appetizers",
      },
      subCategories: [
        {
          id: "all-appetizers",
          label: {
            ku: "هەموو",
            ar: "جميع المقبلات",
            en: "All Appetizers",
          },
          img: appetizers,
        },
        {
          id: "cold-appetizers",
          label: {
            ku: "موقەبیلاتی سارد",
            ar: "مقبلات باردة",
            en: "Cold Appetizers",
          },
          img: appetizers,
        },
        {
          id: "hot-appetizers",
          label: {
            ku: "موقەبیلاتی گەرم",
            ar: "مقبلات ساخنة",
            en: "Hot Appetizers",
          },
          img: appetizers,
        },
      ],
      items: [
        {
          id: 1,
          name: {
            ku: "حمص",
            ar: "حمص",
            en: "Hummus",
          },
          price: "30,000",
          subcategory: "cold-appetizers",
          image: morning_1,
        },
        {
          id: 2,
          name: {
            ku: "زەڵاتەی سیسزەر",
            ar: "زغالتي سيسر",
            en: "Sisir Salad",
          },
          price: "2000",
          subcategory: "cold-appetizers",
          image: morning_2,
        },
        {
          id: 3,
          name: {
            ku: "فەتوش",
            ar: "فتوش",
            en: "Fattoush",
          },
          price: "3500",
          subcategory: "cold-appetizers",
          image: morning_3,
        },
        {
          id: 21,
          name: {
            ku: "کەبابی حەلەب",
            ar: "كباب حلب",
            en: "Aleppo Kebab",
          },
          price: "5000",
          subcategory: "hot-appetizers",
          image: morning_4,
        },
        {
          id: 22,
          name: {
            ku: "زەڵاتەی یۆنانی",
            ar: "زغالتي يونان",
            en: "Greek Salad",
          },
          price: "2000",
          subcategory: "hot-appetizers",
          image: defaultFoodImage,
        },
      ],
    },
    {
      id: "mains",
      label: {
        ku: "خواردنی سەرەکییەکان",
        ar: "الأطباق الرئيسية",
        en: "Main Dishes",
      },
      subCategories: [
        {
          id: "all-mains",
          label: {
            ku: "هەموو",
            ar: "جميع الأطباق",
            en: "All Main Dishes",
          },
          img: mains,
        },
        {
          id: "grilled",
          label: {
            ku: "برژاو",
            ar: "مشوي",
            en: "Grilled",
          },
          img: mains,
        },
        {
          id: "traditional",
          label: {
            ku: "کوردەواری",
            ar: "تقليدي",
            en: "Traditional",
          },
          img: mains,
        },
      ],
      items: [
        {
          id: 4,
          name: {
            ku: "کەباب",
            ar: "كباب",
            en: "Kebab",
          },
          price: "8000",
          subcategory: "grilled",
          image: main_cover,
        },
        {
          id: 5,
          name: {
            ku: "مەنسەف",
            ar: "منسف",
            en: "Mansaf",
          },
          price: "10000",
          subcategory: "traditional",
          image: main_cover,
        },
        {
          id: 6,
          name: {
            ku: "شاورما",
            ar: "شاورما",
            en: "Shawarma",
          },
          price: "6000",
          subcategory: "grilled",
          image: main_cover,
        },
        {
          id: 23,
          name: {
            ku: "کوببە",
            ar: "كبة",
            en: "Kibbeh",
          },
          price: "9000",
          subcategory: "traditional",
          image: main_cover,
        },
        {
          id: 24,
          name: {
            ku: "تکەی کەباب",
            ar: "تكا كباب",
            en: "Tikka Kebab",
          },
          price: "9500",
          subcategory: "grilled",
          image: main_cover,
        },
      ],
    },
    {
      id: "desserts",
      label: {
        ku: "شیرینی",
        ar: "الحلويات",
        en: "Desserts",
      },
      subCategories: [
        {
          id: "all-desserts",
          label: {
            ku: "هەموو",
            ar: "جميع الحلويات",
            en: "All Desserts",
          },
          img: desserts,
        },
        {
          id: "pastries",
          label: {
            ku: "شیرینی",
            ar: "معجنات",
            en: "Pastries",
          },
          img: sweets,
        },
        {
          id: "milkshakes",
          label: {
            ku: "میڵک شیک",
            ar: "ميلك شيك",
            en: "Milkshakes",
          },
          img: desserts,
        },
      ],
      items: [
        {
          id: 7,
          name: {
            ku: "پاقلاوە",
            ar: "بقلاوة",
            en: "Baklava",
          },
          price: "3000",
          subcategory: "pastries",
          image: milkshake_cover,
        },
        {
          id: 8,
          name: {
            ku: "کونافە",
            ar: "كنافة",
            en: "Knafeh",
          },
          price: "3500",
          subcategory: "pastries",
          image: milkshake_cover,
        },
        {
          id: 25,
          name: {
            ku: "میڵک شیک وانیلا",
            ar: "ميلك شيك فانيليا",
            en: "Vanilla Milkshake",
          },
          price: "2500",
          subcategory: "milkshakes",
          image: milkshake_cover,
        },
        {
          id: 26,
          name: {
            ku: "میڵک شیک چۆکلێت",
            ar: "ميلك شيك شوكولاتة",
            en: "Chocolate Milkshake",
          },
          price: "2500",
          subcategory: "milkshakes",
          image: milkshake_cover,
        },
      ],
    },
    {
      id: "drinks",
      label: {
        ku: "خواردنەوە",
        ar: "المشروبات",
        en: "Beverages",
      },
      subCategories: [
        {
          id: "all-drinks",
          label: {
            ku: "هەموو",
            ar: "جميع المشروبات",
            en: "All Beverages",
          },
          img: drinks,
        },
        {
          id: "hot-drinks",
          label: {
            ku: "خواردنەوەی گەرم",
            ar: "مشروبات ساخنة",
            en: "Hot Drinks",
          },
          img: hot_drinks,
        },
        {
          id: "cold-drinks",
          label: {
            ku: "خواردنەوەی سارد",
            ar: "مشروبات باردة",
            en: "Cold Drinks",
          },
          img: drinks,
        },
      ],
      items: [
        {
          id: 9,
          name: {
            ku: "چای",
            ar: "شاي",
            en: "Tea",
          },
          price: "1000",
          subcategory: "hot-drinks",
          image: drinks_cover,
        },
        {
          id: 10,
          name: {
            ku: "قاوە",
            ar: "قهوة",
            en: "Coffee",
          },
          price: "1500",
          subcategory: "hot-drinks",
          image: drinks_cover,
        },
        {
          id: 11,
          name: {
            ku: "شەربەت",
            ar: "عصير",
            en: "Fresh Juice",
          },
          price: "2000",
          subcategory: "cold-drinks",
          image: drinks_cover,
        },
        {
          id: 27,
          name: {
            ku: "چای سەوز",
            ar: "شاي أخضر",
            en: "Green Tea",
          },
          price: "1,200",
          subcategory: "hot-drinks",
          image: drinks_cover,
        },
        {
          id: 28,
          name: {
            ku: "کۆکاکۆلا",
            ar: "كوكاكولا",
            en: "Coca Cola",
          },
          price: "1000",
          subcategory: "cold-drinks",
          image: drinks_cover,
        },
      ],
    },
  ],
};
