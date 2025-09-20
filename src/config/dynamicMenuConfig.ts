import {
  getRestaurantBySlug,
  getRestaurantSettings,
} from "@/services/restaurantService";
import { getCategoriesByRestaurant } from "@/services/categoryService";
import {
  getSubCategoriesByRestaurant,
  SubCategoryWithLabel,
} from "@/services/subcategoryService";
import {
  getMenuItemsByRestaurant,
  MenuItemWithLabel,
} from "@/services/menuItemService";

import { MenuConfig, Category, SubCategory, MenuItem } from "@/types/menu";
import mymenudark from "@/assets/logo/My Menu Dark.svg";
import mymenulight from "@/assets/logo/MyMenu.svg";
import defaultFoodImage from "@/assets/images/foods/Frame 46.png";
import feedback from "@/assets/icons/feedback.png";

// Category-specific "All" subcategory icons - React components from Icons.tsx
import {
  all as AllIcon,
  drinksIcon as DrinksIcon,
  sweetsIcon as SweetsIcon,
} from "@/components/Icons";

/**
 * Dynamic "All" Subcategory Image System
 *
 * This configuration now supports dynamic images for the "All" subcategory in each category.
 * The system uses a consistent icon-based approach:
 *
 * 1. Category-specific images: Uses predefined icons for specific categories (drinks, sweets, etc.)
 * 2. Priority subcategories: Uses images from subcategories with keywords like "main", "popular", "featured"
 * 3. General fallback: Always uses the "all.svg" icon for consistency
 *
 * This ensures all categories have consistent, professional icons rather than random subcategory images.
 *
 * To add category-specific "All" images:
 * - Add entries to the categorySpecificImages object in getDynamicAllSubcategoryImage()
 * - Use the category name (in any language, lowercase) as the key
 * - Import your icons and use them as values
 *
 * Current categories with custom icons:
 * - Beverages/Drinks: drinks.svg
 * - Desserts/Sweets: sweets.svg
 * - General/All: all.svg
 *
 * Example:
 * const categorySpecificImages = {
 *   'beverages': drinksIcon,
 *   'مشروبات': drinksIcon,
 *   'desserts': sweetsIcon,
 *   'حلويات': sweetsIcon,
 * };
 */

// Default menu configuration with UI texts and static assets
export const defaultMenuConfig: MenuConfig = {
  logo: {
    dark: mymenudark,
    light: mymenulight,
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

  // Social media and location configuration
  socialMedia: {
    // facebook: "https://facebook.com/salarrestaurant",
    instagram: "https://www.instagram.com/the_first_cafe_",
    // twitter: "https://twitter.com/salarrestaurant",
    // whatsapp: "https://wa.me/9647701234567",
    // telegram: "https://t.me/salarrestaurant",
  },

  location: {
    address: {
      ku: "سلێمانی، عێراق",
      ar: "السليمانية، العراق",
      en: "Sulaymaniyah, Iraq",
    },
    coordinates: {
      lat: 35.5617,
      lng: 45.4355,
    },
    googleMapsUrl: "https://goo.gl/maps/example",
  },

  // Localized UI texts (keeping all existing UI translations)
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
        whatsapp: {
          ku: "وەتساپ",
          ar: "واتساب",
          en: "WhatsApp",
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

  // Empty categories array - will be populated dynamically
  categories: [],
};

/**
 * Function to get menu configuration with dynamic data from Supabase
 */
export const getMenuConfig = async (
  restaurantSlug?: string
): Promise<MenuConfig> => {
  try {
    // If no restaurant slug provided, return default config
    if (!restaurantSlug) {
      console.log("No restaurant slug provided, returning default config");
      return defaultMenuConfig;
    }

    // Get restaurant data by slug
    const restaurant = await getRestaurantBySlug(restaurantSlug);
    if (!restaurant) {
      console.error(`Restaurant not found with slug: ${restaurantSlug}`);
      return defaultMenuConfig;
    }

    console.log("Restaurant found:", restaurant);

    // Get restaurant settings and system settings for logos and theme
    const [restaurantSettings] = await Promise.all([
      getRestaurantSettings(restaurant.id),
      // fetchSystemSettings(),
    ]);

    // console.log("System settings loaded:", systemSettings);
    console.log("Restaurant settings loaded:", restaurantSettings);
    // console.log("System settings loaded:", systemSettings);

    // Get dynamic menu data
    const [categories, subcategoriesData, menuItemsData] = await Promise.all([
      getCategoriesByRestaurant(restaurant.id),
      getSubCategoriesByRestaurant(restaurant.id),
      getMenuItemsByRestaurant(restaurant.id),
    ]);

    console.log("Categories loaded:", categories.length);
    console.log("Subcategories loaded:", subcategoriesData.length);
    console.log("Menu items loaded:", menuItemsData.length);

    // Group subcategories by category
    const subcategoriesMap = new Map<string, SubCategoryWithLabel[]>();
    subcategoriesData.forEach((sub) => {
      const categoryId = sub.category_id;
      if (!subcategoriesMap.has(categoryId)) {
        subcategoriesMap.set(categoryId, []);
      }
      subcategoriesMap.get(categoryId)!.push(sub);
    });

    // Group menu items by category and subcategory
    const menuItemsMap = new Map<string, MenuItemWithLabel[]>();
    menuItemsData.forEach((item) => {
      const key = `${item.category_id}-${item.subcategory_id}`;
      if (!menuItemsMap.has(key)) {
        menuItemsMap.set(key, []);
      }
      menuItemsMap.get(key)!.push(item);
    });

    // Helper function to get dynamic "All" subcategory icon component for each category
    const getDynamicAllSubcategoryImage = (
      categoryId: string,
      categoryLabel: { ku: string; ar: string; en: string },
      subcategories: SubCategoryWithLabel[]
    ): React.ComponentType<{ className?: string }> | string => {
      // Option 1: Category-specific mapping based on category name (add more as needed)
      const categorySpecificImages: Record<
        string,
        React.ComponentType<{ className?: string }>
      > = {
        // Beverages/Drinks category
        beverages: DrinksIcon,
        drinks: DrinksIcon,
        مشروبات: DrinksIcon,
        خواردنەوە: DrinksIcon,

        // Desserts/Sweets category
        desserts: SweetsIcon,
        sweets: SweetsIcon,
        حلويات: SweetsIcon,
        شیرینی: SweetsIcon,

        // General/All items - can be used as fallback
        all: AllIcon,
        main: AllIcon,
        general: AllIcon,
        عام: AllIcon,
        گشتی: AllIcon,
      };

      // Check for category-specific image by ID
      const categoryKey = categoryId.toLowerCase();
      console.log("🔍 Category Debug Info:", {
        categoryId,
        categoryKey,
        categoryLabel,
        availableKeys: Object.keys(categorySpecificImages),
      });

      if (categorySpecificImages[categoryKey]) {
        console.log("✅ Found match by ID:", categoryKey);
        return categorySpecificImages[categoryKey];
      }

      // Check for category-specific image by name in all languages
      const categoryNames = [
        categoryLabel.en?.toLowerCase(),
        categoryLabel.ar?.toLowerCase(),
        categoryLabel.ku?.toLowerCase(),
      ].filter(Boolean);

      console.log("🔍 Checking category names:", categoryNames);

      for (const name of categoryNames) {
        if (name && categorySpecificImages[name]) {
          console.log("✅ Found match by name:", name);
          return categorySpecificImages[name];
        }
      }

      // Option 2: Use the most representative subcategory image
      // Prioritize subcategories with 'main', 'popular', 'featured' in their name
      const priorityKeywords = [
        "main",
        "popular",
        "featured",
        "signature",
        "special",
      ];
      const prioritySubcategory = subcategories.find((sub) =>
        priorityKeywords.some((keyword) =>
          Object.values(sub.label).some((label) =>
            label.toLowerCase().includes(keyword)
          )
        )
      );

      if (prioritySubcategory?.img) {
        return prioritySubcategory.img;
      }

      // Option 3: Always use the general "all" icon as primary fallback
      // This ensures consistency across all categories
      return AllIcon;

      // Note: Removed subcategory image fallbacks to always use the consistent icon list
    };

    // Transform categories to expected format
    const transformedCategories: Category[] = categories.map((category) => {
      const categorySubcategories = subcategoriesMap.get(category.id) || [];

      // Add "All" subcategory as first item with dynamic image
      const allSubcategory: SubCategory = {
        id: `all-${category.id}`,
        label: {
          ku: "هەموو",
          ar: "الكل",
          en: "All",
        },
        img: getDynamicAllSubcategoryImage(
          category.id,
          category.label,
          categorySubcategories
        ),
      };

      const transformedSubcategories: SubCategory[] = [
        allSubcategory,
        ...categorySubcategories.map((sub) => ({
          id: sub.id,
          label: sub.label,
          img: sub.img || defaultFoodImage,
        })),
      ];

      // Get all items for this category
      const categoryItems: MenuItem[] = [];
      categorySubcategories.forEach((sub) => {
        const key = `${category.id}-${sub.id}`;
        const items = menuItemsMap.get(key) || [];
        categoryItems.push(
          ...items.map((item) => ({
            id: item.id, // Keep as string UUID
            name: item.name,
            description: item.description,
            price: item.price,
            subcategory: item.subcategory_id,
            image: item.image || defaultFoodImage,
            rating: item.rating,
          }))
        );
      });

      return {
        id: category.id,
        label: category.label,
        subCategories: transformedSubcategories,
        items: categoryItems,
      };
    });

    const restaurantAppearanceSettings = restaurantSettings.find(
      (setting) => setting.setting_type === "appearance"
    );

    // Find system appearance settings
    const systemAppearanceSettings = restaurantSettings.find(
      (setting) => setting.setting_type === "appearance"
    );

    // Build the dynamic config
    const dynamicConfig: MenuConfig = {
      ...defaultMenuConfig,
      restaurantName: {
        ku: restaurant.name,
        ar: restaurant.name,
        en: restaurant.name,
      },
      // Prioritize system settings, then restaurant settings, then defaults
      logo: {
        dark:
          systemAppearanceSettings?.dark_logo_url ||
          restaurantAppearanceSettings?.dark_logo_url ||
          restaurant.logo_url ||
          mymenudark,
        light:
          systemAppearanceSettings?.light_logo_url ||
          restaurantAppearanceSettings?.light_logo_url ||
          restaurant.logo_url ||
          mymenulight,
      },
      categories: transformedCategories,
    };

    console.log(
      "Dynamic config created with",
      transformedCategories.length,
      "categories"
    );
    return dynamicConfig;
  } catch (error) {
    console.error("Failed to load dynamic menu configuration:", error);
    return defaultMenuConfig;
  }
};

// For backward compatibility
export { defaultMenuConfig as default };
