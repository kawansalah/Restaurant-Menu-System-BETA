// Table configuration constants
export const SUBCATEGORY_TABLE_CONFIG = {
  PAGE_SIZE: 10,
  SEARCH_DEBOUNCE: 300,
  MAX_EXPORT_ITEMS: 1000,
} as const;

// Error messages
export const SUBCATEGORY_ERROR_MESSAGES = {
  FETCH_ERROR: "Failed to load subcategories",
  CREATE_ERROR: "Failed to create subcategory",
  UPDATE_ERROR: "Failed to update subcategory",
  DELETE_ERROR: "Failed to delete subcategory",
  BULK_DELETE_ERROR: "Failed to delete selected subcategories",
  NETWORK_ERROR: "Network error occurred",
  VALIDATION_ERROR: "Please fill in all required fields",
  UNEXPECTED_ERROR: "An unexpected error occurred",
} as const;

// Text translations
export const SUBCATEGORY_TEXTS = {
  // Page titles and headings
  pageTitle: {
    ku: "جۆرەکان",
    ar: "الفئات الفرعية",
    en: "SubCategories",
  },
  addSubCategory: {
    ku: "جۆری نوێ",
    ar: "إضافة فئة فرعية",
    en: "Add SubCategory",
  },
  editSubCategory: {
    ku: "دەستکاری جۆر",
    ar: "تعديل الفئة الفرعية",
    en: "Edit SubCategory",
  },

  // Form labels
  categoryLabel: {
    ku: "بەش",
    ar: "الفئة",
    en: "Category",
  },
  selectCategory: {
    ku: "بەشێک هەڵبژێرە",
    ar: "اختر فئة",
    en: "Select Category",
  },
  labelKu: {
    ku: "ناوی کوردی",
    ar: "الاسم الكردي",
    en: "Kurdish Name",
  },
  labelAr: {
    ku: "ناوی عەرەبی",
    ar: "الاسم العربي",
    en: "Arabic Name",
  },
  labelEn: {
    ku: "ناوی ئینگلیزی",
    ar: "الاسم الإنجليزي",
    en: "English Name",
  },
  imageUrl: {
    ku: "بەستەری وێنە",
    ar: "رابط الصورة",
    en: "Image URL",
  },

  // Placeholders
  placeholderKu: {
    ku: "ناوی کوردی داخڵ بکە",
    ar: "أدخل الاسم الكردي",
    en: "Enter Kurdish name",
  },
  placeholderAr: {
    ku: "ناوی عەرەبی داخڵ بکە",
    ar: "أدخل الاسم العربي",
    en: "Enter Arabic name",
  },
  placeholderEn: {
    ku: "ناوی ئینگلیزی داخڵ بکە",
    ar: "أدخل الاسم الإنجليزي",
    en: "Enter English name",
  },
  placeholderImageUrl: {
    ku: "بەستەری وێنە داخڵ بکە",
    ar: "أدخل رابط الصورة",
    en: "Enter image URL",
  },

  // Table columns
  columnId: {
    ku: "ژمارە",
    ar: "الرقم",
    en: "ID",
  },
  columnCategory: {
    ku: "بەش",
    ar: "الفئة",
    en: "Category",
  },
  columnName: {
    ku: "ناو",
    ar: "الاسم",
    en: "Name",
  },
  columnCreatedAt: {
    ku: "بەرواری دروستکردن",
    ar: "تاريخ الإنشاء",
    en: "Created",
  },
  columnActions: {
    ku: "کردارەکان",
    ar: "الإجراءات",
    en: "Actions",
  },

  // Actions
  edit: {
    ku: "دەستکاری",
    ar: "تعديل",
    en: "Edit",
  },
  delete: {
    ku: "سڕینەوە",
    ar: "حذف",
    en: "Delete",
  },
  save: {
    ku: "پاشەکەوتکردن",
    ar: "حفظ",
    en: "Save",
  },
  cancel: {
    ku: "پاشگەزبوونەوە",
    ar: "إلغاء",
    en: "Cancel",
  },
  export: {
    ku: "هەناردەکردن",
    ar: "تصدير",
    en: "Export",
  },
  refresh: {
    ku: "نوێکردنەوە",
    ar: "تحديث",
    en: "Refresh",
  },

  // Messages
  confirmDelete: {
    ku: "دڵنیایت لە سڕینەوەی ئەم جۆرە؟",
    ar: "هل أنت متأكد من حذف هذه الفئة الفرعية؟",
    en: "Are you sure you want to delete this subcategory?",
  },
  confirmBulkDelete: {
    ku: "دڵنیایت لە سڕینەوەی جۆرە هەڵبژێردراوەکان؟",
    ar: "هل أنت متأكد من حذف الفئات الفرعية المحددة؟",
    en: "Are you sure you want to delete the selected subcategories?",
  },
  selectedSubCategories: {
    ku: "جۆری هەڵبژێردراو",
    ar: "فئات فرعية محددة",
    en: "selected subcategories",
  },
  noSubCategoriesFound: {
    ku: "هیچ جۆرێک نەدۆزرایەوە",
    ar: "لم يتم العثور على أي فئات فرعية",
    en: "No subcategories found",
  },
  loadingSubCategories: {
    ku: "بارکردنی جۆرەکان...",
    ar: "جاري تحميل الفئات الفرعية...",
    en: "Loading subcategories...",
  },
  loadingMoreCategories: {
    ku: "بارکردنی جۆری زیاتر...",
    ar: "جاري تحميل المزيد من الفئات الفرعية...",
    en: "Loading more subcategories...",
  },
  loadingMore: {
    ku: "بارکردنی زیاتر...",
    ar: "جاري التحميل...",
    en: "Loading more...",
  },
  loadMoreCategories: {
    ku: "بارکردنی جۆری زیاتر",
    ar: "تحميل المزيد من الفئات الفرعية",
    en: "Load More SubCategories",
  },
  showing: {
    ku: "نیشاندان",
    ar: "عرض",
    en: "Showing",
  },
  of: {
    ku: "لە",
    ar: "من",
    en: "of",
  },
  allCategoriesLoaded: {
    ku: "هەموو جۆرەکان بارکران",
    ar: "تم تحميل جميع الفئات الفرعية",
    en: "All subcategories loaded",
  },
  errorLoadingCategories: {
    ku: "هەڵە لە بارکردنی جۆرەکان ڕوویدا",
    ar: "خطأ في تحميل الفئات الفرعية",
    en: "Error loading subcategories",
  },
  tryAgain: {
    ku: "دووبارە هەوڵبدەوە",
    ar: "حاول مرة أخرى",
    en: "Try Again",
  },

  // Success messages
  successCreate: {
    ku: "جۆر بە سەرکەوتووی دروست کرا",
    ar: "تم إنشاء الفئة الفرعية بنجاح",
    en: "SubCategory created successfully",
  },
  successUpdate: {
    ku: "جۆر بە سەرکەوتووی نوێ کرایەوە",
    ar: "تم تحديث الفئة الفرعية بنجاح",
    en: "SubCategory updated successfully",
  },
  successDelete: {
    ku: "جۆر بە سەرکەوتووی سڕایەوە",
    ar: "تم حذف الفئة الفرعية بنجاح",
    en: "SubCategory deleted successfully",
  },

  // Error messages
  failedToLoad: {
    ku: "بارکردنی جۆرەکان شکستی هێنا",
    ar: "فشل في تحميل الفئات الفرعية",
    en: "Failed to load subcategories",
  },
  failedToCreate: {
    ku: "دروستکردنی جۆر شکستی هێنا",
    ar: "فشل في إنشاء الفئة الفرعية",
    en: "Failed to create subcategory",
  },
  failedToUpdate: {
    ku: "نوێکردنەوەی جۆر شکستی هێنا",
    ar: "فشل في تحديث الفئة الفرعية",
    en: "Failed to update subcategory",
  },
  failedToDelete: {
    ku: "سڕینەوەی جۆر شکستی هێنا",
    ar: "فشل في حذف الفئة الفرعية",
    en: "Failed to delete subcategory",
  },
  errorPrefix: {
    ku: "هەڵە:",
    ar: "خطأ:",
    en: "Error:",
  },

  // Validation
  requiredField: {
    ku: "ئەم خانەیە پێویستە",
    ar: "هذا الحقل مطلوب",
    en: "This field is required",
  },
} as const;
