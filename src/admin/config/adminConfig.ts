import darklogo from "@/assets/logo/My Menu Dark.svg";
import lightlogo from "@/assets/logo/My Menu Light.svg";
import login_image from "@/assets/admin/Order food-amico 1.svg";
import login_image_dark from "@/assets/admin/Order food-amico 1 dark.svg";

export interface LocalizedText {
  ku: string;
  ar: string;
  en: string;
}

export interface AdminConfig {
  // logo: string;
  logo: {
    dark: string;
    light: string;
  };
  restaurantName: {};
  ui: {
    login: {
      login_image: string;
      login_image_dark: string;
      hello: LocalizedText;
      title: LocalizedText;
      subtitle: LocalizedText;
      username: LocalizedText;
      password: LocalizedText;
      signIn: LocalizedText;
      signingIn: LocalizedText;
      usernamePlaceholder: LocalizedText;
      passwordPlaceholder: LocalizedText;
      invalidCredentials: LocalizedText;
      loginFailed: LocalizedText;
      usernameRequired: LocalizedText;
      passwordRequired: LocalizedText;
      usernameMinLength: LocalizedText;
      emailRequired: LocalizedText;
      emailInvalid: LocalizedText;
      passwordMinLength: LocalizedText;
      passwordMismatch: LocalizedText;
      fullNameRequired: LocalizedText;
      welcomeBack: LocalizedText;
      demoCredentials: {
        title: LocalizedText;
        admin: LocalizedText;
        manager: LocalizedText;
        staff: LocalizedText;
      };
    };
    users: {
      title: LocalizedText;
      pageTitle: LocalizedText;
      addUser: LocalizedText;
      editUser: LocalizedText;
      viewDetails: LocalizedText;
      deleteUser: LocalizedText;
      toggleStatus: LocalizedText;
      exportUsers: LocalizedText;
      refreshUsers: LocalizedText;
      bulkActions: LocalizedText;
      activate: LocalizedText;
      deactivate: LocalizedText;
      delete: LocalizedText;
      selectedUsers: LocalizedText;
      confirmDelete: LocalizedText;
      confirmBulkDelete: LocalizedText;
      userManagementForm: LocalizedText;
      create: LocalizedText;
      update: LocalizedText;
      cancel: LocalizedText;
      // Form fields
      username: LocalizedText;
      fullName: LocalizedText;
      password: LocalizedText;
      confirmPassword: LocalizedText;
      // Form placeholders
      enterUsername: LocalizedText;
      enterEmail: LocalizedText;
      enterFullName: LocalizedText;
      enterPassword: LocalizedText;
      activeUser: LocalizedText;
      saving: LocalizedText;
      // Table columns
      user: LocalizedText;
      email: LocalizedText;
      role: LocalizedText;
      status: LocalizedText;
      lastLogin: LocalizedText;
      created: LocalizedText;
      // Status labels
      active: LocalizedText;
      inactive: LocalizedText;
      never: LocalizedText;
      // Role labels
      superAdmin: LocalizedText;
      admin: LocalizedText;
      manager: LocalizedText;
      staff: LocalizedText;
      // Stats
      totalUsers: LocalizedText;
      activeUsers: LocalizedText;
      superAdmins: LocalizedText;
      admins: LocalizedText;
      // Messages
      noUsersFound: LocalizedText;
      errorPrefix: LocalizedText;
      failedToLoad: LocalizedText;
      failedToToggleStatus: LocalizedText;
      failedToDelete: LocalizedText;
      failedToActivate: LocalizedText;
      failedToDeactivate: LocalizedText;
      userDeletedSuccess: LocalizedText;
      usersActivatedSuccess: LocalizedText;
      usersDeactivatedSuccess: LocalizedText;
      usersDeletedSuccess: LocalizedText;
    };
    categories: {
      title: LocalizedText;
      pageTitle: LocalizedText;
      addCategory: LocalizedText;
      editCategory: LocalizedText;
      deleteCategory: LocalizedText;
      exportCategories: LocalizedText;
      refreshCategories: LocalizedText;
      bulkActions: LocalizedText;
      delete: LocalizedText;
      selectedCategories: LocalizedText;
      confirmDelete: LocalizedText;
      confirmBulkDelete: LocalizedText;
      categoryManagementForm: LocalizedText;
      create: LocalizedText;
      update: LocalizedText;
      cancel: LocalizedText;
      labelKu: LocalizedText;
      labelAr: LocalizedText;
      labelEn: LocalizedText;
      enterLabelKu: LocalizedText;
      enterLabelAr: LocalizedText;
      enterLabelEn: LocalizedText;
      created: LocalizedText;
      updated: LocalizedText;
      noCategoriesFound: LocalizedText;
      errorPrefix: LocalizedText;
      failedToLoad: LocalizedText;
      failedToDelete: LocalizedText;
      categoriesDeletedSuccess: LocalizedText;
      // Loading states
      loadingCategories: LocalizedText;
      loadingMore: LocalizedText;
      loadMoreCategories: LocalizedText;
      allCategoriesLoaded: LocalizedText;
      tryAgain: LocalizedText;
      errorLoadingCategories: LocalizedText;
      loadingMoreCategories: LocalizedText;
      // Stats display
      showing: LocalizedText;
      of: LocalizedText;
      // Image upload related texts
      uploadImage: LocalizedText;
      changeImage: LocalizedText;
      chooseImage: LocalizedText;
      categoryImage: LocalizedText;
      subcategoryImage: LocalizedText;
      imageDescription: LocalizedText;
      uploading: LocalizedText;
      imageUploadedSuccess: LocalizedText;
      remove: LocalizedText;
      supportedFormats: LocalizedText;
    };
    feedback: {
      title: LocalizedText;
      pageTitle: LocalizedText;
      deleteFeedback: LocalizedText;
      exportFeedback: LocalizedText;
      refreshFeedback: LocalizedText;
      bulkActions: LocalizedText;
      delete: LocalizedText;
      selectedFeedback: LocalizedText;
      confirmDelete: LocalizedText;
      confirmBulkDelete: LocalizedText;
      customerName: LocalizedText;
      email: LocalizedText;
      phone: LocalizedText;
      message: LocalizedText;
      rating: LocalizedText;
      created: LocalizedText;
      noFeedbackFound: LocalizedText;
      errorPrefix: LocalizedText;
      failedToLoad: LocalizedText;
      failedToDelete: LocalizedText;
      feedbackDeletedSuccess: LocalizedText;
      feedbacksDeletedSuccess: LocalizedText;
      // Loading states
      loadingFeedback: LocalizedText;
      loadingMore: LocalizedText;
      loadMoreFeedback: LocalizedText;
      allFeedbackLoaded: LocalizedText;
      tryAgain: LocalizedText;
      errorLoadingFeedback: LocalizedText;
      loadingMoreFeedback: LocalizedText;
      // Stats
      totalFeedback: LocalizedText;
      averageRating: LocalizedText;
      totalWithRating: LocalizedText;
      ratingDistribution: LocalizedText;
      // Filters
      filterByRating: LocalizedText;
      allRatings: LocalizedText;
      // Stats display
      showing: LocalizedText;
      of: LocalizedText;
    };
    menuItems: {
      title: LocalizedText;
      pageTitle: LocalizedText;
      addMenuItem: LocalizedText;
      editMenuItem: LocalizedText;
      deleteMenuItem: LocalizedText;
      exportMenuItems: LocalizedText;
      refreshMenuItems: LocalizedText;
      bulkActions: LocalizedText;
      delete: LocalizedText;
      selectedMenuItems: LocalizedText;
      confirmDelete: LocalizedText;
      confirmBulkDelete: LocalizedText;
      menuItemManagementForm: LocalizedText;
      create: LocalizedText;
      update: LocalizedText;
      cancel: LocalizedText;
      // Form fields
      nameKu: LocalizedText;
      nameAr: LocalizedText;
      nameEn: LocalizedText;
      nameEnglish: LocalizedText;
      nameArabic: LocalizedText;
      nameKurdish: LocalizedText;
      price: LocalizedText;
      descriptionKu: LocalizedText;
      descriptionAr: LocalizedText;
      descriptionEn: LocalizedText;
      descriptionEnglish: LocalizedText;
      descriptionArabic: LocalizedText;
      descriptionKurdish: LocalizedText;
      availableForCustomers: LocalizedText;
      menuItemImage: LocalizedText;
      selectCategory: LocalizedText;
      selectSubcategory: LocalizedText;
      selectCategoryFirst: LocalizedText;
      saving: LocalizedText;
      // Form placeholders
      enterNameKu: LocalizedText;
      enterNameAr: LocalizedText;
      enterNameEn: LocalizedText;
      enterNameEnglish: LocalizedText;
      enterNameArabic: LocalizedText;
      enterNameKurdish: LocalizedText;
      enterPrice: LocalizedText;
      enterDescriptionKu: LocalizedText;
      enterDescriptionAr: LocalizedText;
      enterDescriptionEn: LocalizedText;
      enterDescriptionEnglish: LocalizedText;
      enterDescriptionArabic: LocalizedText;
      enterDescriptionKurdish: LocalizedText;
      // Image upload related texts
      uploadImage: LocalizedText;
      changeImage: LocalizedText;
      chooseImage: LocalizedText;
      imageDescription: LocalizedText;
      uploading: LocalizedText;
      imageUploadedSuccess: LocalizedText;
      remove: LocalizedText;
      supportedFormats: LocalizedText;
      // Table columns
      name: LocalizedText;
      category: LocalizedText;
      subcategory: LocalizedText;
      rating: LocalizedText;
      status: LocalizedText;
      created: LocalizedText;
      // Status labels
      available: LocalizedText;
      unavailable: LocalizedText;
      // Messages
      noMenuItemsFound: LocalizedText;
      errorPrefix: LocalizedText;
      failedToLoad: LocalizedText;
      failedToDelete: LocalizedText;
      menuItemDeletedSuccess: LocalizedText;
      menuItemsDeletedSuccess: LocalizedText;
      // Loading states
      loadingMenuItems: LocalizedText;
      loadingMore: LocalizedText;
      loadMoreMenuItems: LocalizedText;
      allMenuItemsLoaded: LocalizedText;
      tryAgain: LocalizedText;
      errorLoadingMenuItems: LocalizedText;
      loadingMoreMenuItems: LocalizedText;
      // Stats display
      totalMenuItems: LocalizedText;
      availableMenuItems: LocalizedText;
      showing: LocalizedText;
      of: LocalizedText;
    };
    restaurants: {
      title: LocalizedText;
      pageTitle: LocalizedText;
      addRestaurant: LocalizedText;
      editRestaurant: LocalizedText;
      deleteRestaurant: LocalizedText;
      exportRestaurants: LocalizedText;
      refreshRestaurants: LocalizedText;
      bulkActions: LocalizedText;
      activate: LocalizedText;
      deactivate: LocalizedText;
      delete: LocalizedText;
      selectedRestaurants: LocalizedText;
      confirmDelete: LocalizedText;
      confirmBulkDelete: LocalizedText;
      restaurantManagementForm: LocalizedText;
      create: LocalizedText;
      update: LocalizedText;
      cancel: LocalizedText;
      // Form fields
      name: LocalizedText;
      description: LocalizedText;
      address: LocalizedText;
      phone: LocalizedText;
      email: LocalizedText;
      website: LocalizedText;
      themeColor: LocalizedText;
      activeRestaurant: LocalizedText;
      restaurantLogo: LocalizedText;
      saving: LocalizedText;
      // Form placeholders
      enterName: LocalizedText;
      enterDescription: LocalizedText;
      enterAddress: LocalizedText;
      enterPhone: LocalizedText;
      enterEmail: LocalizedText;
      enterWebsite: LocalizedText;
      // Image upload related texts
      uploadLogo: LocalizedText;
      changeLogo: LocalizedText;
      chooseLogo: LocalizedText;
      logoDescription: LocalizedText;
      uploading: LocalizedText;
      logoUploadedSuccess: LocalizedText;
      remove: LocalizedText;
      supportedFormats: LocalizedText;
      // Table columns
      status: LocalizedText;
      created: LocalizedText;
      // Status labels
      active: LocalizedText;
      inactive: LocalizedText;
      // Messages
      noRestaurantsFound: LocalizedText;
      errorPrefix: LocalizedText;
      failedToLoad: LocalizedText;
      failedToDelete: LocalizedText;
      restaurantDeletedSuccess: LocalizedText;
      restaurantsDeletedSuccess: LocalizedText;
      // Loading states
      loadingRestaurants: LocalizedText;
      loadingMore: LocalizedText;
      loadMoreRestaurants: LocalizedText;
      allRestaurantsLoaded: LocalizedText;
      tryAgain: LocalizedText;
      errorLoadingRestaurants: LocalizedText;
      loadingMoreRestaurants: LocalizedText;
      // Stats display
      totalRestaurants: LocalizedText;
      activeRestaurants: LocalizedText;
      showing: LocalizedText;
      of: LocalizedText;
    };
    notFound: {
      title: LocalizedText;
      subtitle: LocalizedText;
      description: LocalizedText;
      goToDashboard: LocalizedText;
      goBack: LocalizedText;
      helpText: LocalizedText;
      support: LocalizedText;
    };
    loading: LocalizedText;
    accessibility: {
      toggleTheme: LocalizedText;
      selectLanguage: LocalizedText;
    };
  };
}

export const defaultAdminConfig: AdminConfig = {
  // logo: darklogo,
  logo: {
    dark: darklogo,
    light: lightlogo,
  },
  restaurantName: {
    ku: "مطعم سالار",
    ar: "مطعم سالار",
    en: "Salar Restaurant",
  },
  ui: {
    login: {
      login_image: login_image,
      login_image_dark: login_image_dark,
      hello: {
        ku: "سڵاو بەخێربێیتەوە",
        ar: "مرحبا",
        en: "Hello",
      },
      subtitle: {
        ku: "بڕۆ ژوورەوە بۆ ناو هەژمارەکەت",
        ar: "يمكنك تسجيل الدخول لبدء إدارة المطعم",
        en: "Sign in to manage your restaurant",
      },
      title: {
        ku: "ناوازەیی ناسنامەی کارەکەتە",
        ar: "تسجيل دخول المدير",
        en: "Admin Login",
      },
      username: {
        ku: "ناوی بەکارهێنەر",
        ar: "اسم المستخدم",
        en: "Username",
      },
      password: {
        ku: "وشەی نهێنی",
        ar: "كلمة المرور",
        en: "Password",
      },
      signIn: {
        ku: "چوونەژوورەوە",
        ar: "تسجيل الدخول",
        en: "Sign In",
      },
      signingIn: {
        ku: "چوونەژوورەوە...",
        ar: "جاري تسجيل الدخول...",
        en: "Signing in...",
      },
      usernamePlaceholder: {
        ku: "ناوی بەکارهێنەرت بنووسە",
        ar: "أدخل اسم المستخدم",
        en: "Enter your username",
      },
      passwordPlaceholder: {
        ku: "وشەی نهێنیت بنووسە",
        ar: "أدخل كلمة المرور",
        en: "Enter your password",
      },
      invalidCredentials: {
        ku: "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە",
        ar: "اسم المستخدم أو كلمة المرور غير صحيحة",
        en: "Invalid username or password",
      },
      loginFailed: {
        ku: "چوونەژوورەوە سەرکەوتوو نەبوو. دووبارە هەوڵ بدەوە",
        ar: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى",
        en: "Login failed. Please try again.",
      },
      usernameRequired: {
        ku: "ناوی بەکارهێنەر بنووسە",
        ar: "اسم المستخدم مطلوب",
        en: "Username is required",
      },
      passwordRequired: {
        ku: "وشەی نهێنی بنووسە",
        ar: "كلمة المرور مطلوبة",
        en: "Password is required",
      },
      usernameMinLength: {
        ku: "ناوی بەکارهێنەر دەبێت لانیکەم ٣ پیت بێت",
        ar: "يجب أن يكون اسم المستخدم 3 أحرف على الأقل",
        en: "Username must be at least 3 characters",
      },
      emailRequired: {
        ku: "ئیمەیڵ بنووسە",
        ar: "البريد الإلكتروني مطلوب",
        en: "Email is required",
      },
      emailInvalid: {
        ku: "ئیمەیڵی دروست بنووسە",
        ar: "يرجى إدخال بريد إلكتروني صحيح",
        en: "Please enter a valid email",
      },
      passwordMinLength: {
        ku: "وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت",
        ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        en: "Password must be at least 6 characters",
      },
      passwordMismatch: {
        ku: "وشەکانی نهێنی یەکناگرنەوە",
        ar: "كلمات المرور غير متطابقة",
        en: "Passwords do not match",
      },
      fullNameRequired: {
        ku: "ناوی تەواو بنووسە",
        ar: "الاسم الكامل مطلوب",
        en: "Full name is required",
      },
      welcomeBack: {
        ku: "بەخێربێیتەوە",
        ar: "مرحباً بعودتك",
        en: "Welcome back",
      },
      demoCredentials: {
        title: {
          ku: "زانیاری تاقیکردنەوە",
          ar: "بيانات التجربة",
          en: "Demo Credentials",
        },
        admin: {
          ku: "بەڕێوەبەر: admin / admin123",
          ar: "المدير: admin / admin123",
          en: "Admin: admin / admin123",
        },
        manager: {
          ku: "بەڕێوەبەری ڕێستۆرانت: manager / manager123",
          ar: "مدير المطعم: manager / manager123",
          en: "Manager: manager / manager123",
        },
        staff: {
          ku: "ستاف: staff / staff123",
          ar: "الموظف: staff / staff123",
          en: "Staff: staff / staff123",
        },
      },
    },
    users: {
      title: {
        ku: "بەکارهێنەران",
        ar: "المستخدمون",
        en: "Users",
      },
      pageTitle: {
        ku: "بەکارهێنەران",
        ar: "إدارة المستخدمين",
        en: "Admin Users",
      },
      addUser: {
        ku: "بەکارهێنەری نوێ زیادبکە",
        ar: "إضافة مستخدم جديد",
        en: "Add New User",
      },
      editUser: {
        ku: "چاککردن",
        ar: "تعديل المستخدم",
        en: "Edit User",
      },
      viewDetails: {
        ku: "وردەکارییەکان",
        ar: "عرض التفاصيل",
        en: "View Details",
      },
      deleteUser: {
        ku: "سڕینەوە",
        ar: "حذف المستخدم",
        en: "Delete User",
      },
      toggleStatus: {
        ku: "گۆڕینی دۆخ",
        ar: "تغيير الحالة",
        en: "Toggle Status",
      },
      exportUsers: {
        ku: "هەناردنی بەکارهێنەران",
        ar: "تصدير المستخدمين",
        en: "Export Users",
      },
      refreshUsers: {
        ku: "نوێکردنەوەی بەکارهێنەران",
        ar: "تحديث المستخدمين",
        en: "Refresh Users",
      },
      bulkActions: {
        ku: "کردارەکان",
        ar: "الإجراءات المجمعة",
        en: "Bulk Actions",
      },
      activate: {
        ku: "چالاککردن",
        ar: "تفعيل",
        en: "Activate",
      },
      deactivate: {
        ku: "ناچالاککردن",
        ar: "إلغاء التفعيل",
        en: "Deactivate",
      },
      delete: {
        ku: "سڕینەوە",
        ar: "حذف",
        en: "Delete",
      },
      selectedUsers: {
        ku: "بەکارهێنەری هەڵبژێردراو",
        ar: "مستخدم محدد",
        en: "selected",
      },
      confirmDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      confirmBulkDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      userManagementForm: {
        ku: "فۆڕمی بەڕێوەبردنی بەکارهێنەر لێرە جێبەجێ دەکرێت",
        ar: "سيتم تنفيذ نموذج إدارة المستخدم هنا",
        en: "User management form will be implemented here.",
      },
      create: {
        ku: "دروستکردن",
        ar: "إنشاء",
        en: "Create",
      },
      update: {
        ku: "نوێکردنەوە",
        ar: "تحديث",
        en: "Update",
      },
      cancel: {
        ku: "هەڵوەشاندنەوە",
        ar: "إلغاء",
        en: "Cancel",
      },
      // Form fields
      username: {
        ku: "ناوی بەکارهێنەر",
        ar: "اسم المستخدم",
        en: "Username",
      },
      fullName: {
        ku: "ناوی تەواو",
        ar: "الاسم الكامل",
        en: "Full Name",
      },
      password: {
        ku: "وشەی نهێنی",
        ar: "كلمة المرور",
        en: "Password",
      },
      confirmPassword: {
        ku: "دووبارەکردنەوەی وشەی نهێنی",
        ar: "تأكيد كلمة المرور",
        en: "Confirm Password",
      },
      // Form placeholders
      enterUsername: {
        ku: "ناوی بەکارهێنەر بنووسە",
        ar: "أدخل اسم المستخدم",
        en: "Enter username",
      },
      enterEmail: {
        ku: "ئیمەیڵ بنووسە",
        ar: "أدخل البريد الإلكتروني",
        en: "Enter email",
      },
      enterFullName: {
        ku: "ناوی تەواو بنووسە",
        ar: "أدخل الاسم الكامل",
        en: "Enter full name",
      },
      enterPassword: {
        ku: "وشەی نهێنی بنووسە",
        ar: "أدخل كلمة المرور",
        en: "Enter password",
      },
      activeUser: {
        ku: "بەکارهێنەری چالاک",
        ar: "مستخدم نشط",
        en: "Active User",
      },
      saving: {
        ku: "پاشەکەوتکردن...",
        ar: "جاري الحفظ...",
        en: "Saving...",
      },
      // Table columns
      user: {
        ku: "بەکارهێنەر",
        ar: "المستخدم",
        en: "User",
      },
      email: {
        ku: "ئیمەیڵ",
        ar: "البريد الإلكتروني",
        en: "Email",
      },
      role: {
        ku: "ڕۆڵ",
        ar: "الدور",
        en: "Role",
      },
      status: {
        ku: "دۆخ",
        ar: "الحالة",
        en: "Status",
      },
      lastLogin: {
        ku: "دوایین چوونەژوورەوە",
        ar: "آخر تسجيل دخول",
        en: "Last Login",
      },
      created: {
        ku: "دروستکراو",
        ar: "تاريخ الإنشاء",
        en: "Created",
      },
      // Status labels
      active: {
        ku: "چالاک",
        ar: "نشط",
        en: "Active",
      },
      inactive: {
        ku: "ناچالاک",
        ar: "غير نشط",
        en: "Inactive",
      },
      never: {
        ku: "نییە",
        ar: "غير موجود",
        en: "Null",
      },
      // Role labels
      superAdmin: {
        ku: "سوپەرئەدمین",
        ar: "مدير عام",
        en: "SUPER ADMIN",
      },
      admin: {
        ku: "ئەدمین",
        ar: "مدير",
        en: "ADMIN",
      },
      manager: {
        ku: "بەڕێوبەر",
        ar: "مدير المطعم",
        en: "MANAGER",
      },
      staff: {
        ku: "ستاف",
        ar: "موظف",
        en: "STAFF",
      },
      // Stats
      totalUsers: {
        ku: "کۆی بەکارهێنەرەکان",
        ar: "إجمالي المستخدمين",
        en: "Total Users",
      },
      activeUsers: {
        ku: "بەکارهێنەرە چالاکەکان",
        ar: "المستخدمون النشطون",
        en: "Active Users",
      },
      superAdmins: {
        ku: "سوپەر ئەدمینەکان",
        ar: "المديرون العامون",
        en: "Super Admins",
      },
      admins: {
        ku: "ئەدمینەکان",
        ar: "المديرون",
        en: "Admins",
      },
      // Messages
      noUsersFound: {
        ku: "هیچ بەکارهێنەرێک نەدۆزرایەوە. یەکەمین بەکارهێنەری بەڕێوەبەرت زیادبکە بۆ دەستپێکردن.",
        ar: "لم يتم العثور على مستخدمين. أضف أول مستخدم مدير للبدء.",
        en: "No users found. Add your first admin user to get started.",
      },
      errorPrefix: {
        ku: "هەڵە:",
        ar: "خطأ:",
        en: "Error:",
      },
      failedToLoad: {
        ku: "سەرکەوتوو نەبوو لە بارکردنی بەکارهێنەران",
        ar: "فشل في تحميل المستخدمين",
        en: "Failed to load users",
      },
      failedToToggleStatus: {
        ku: "سەرکەوتوو نەبوو لە گۆڕینی دۆخی بەکارهێنەر",
        ar: "فشل في تغيير حالة المستخدم",
        en: "Failed to toggle user status",
      },
      failedToDelete: {
        ku: "سەرکەوتوو نەبوو لە سڕینەوەی بەکارهێنەر",
        ar: "فشل في حذف المستخدم",
        en: "Failed to delete user",
      },
      failedToActivate: {
        ku: "سەرکەوتوو نەبوو لە چالاککردنی بەکارهێنەران",
        ar: "فشل في تفعيل المستخدمين",
        en: "Failed to activate users",
      },
      failedToDeactivate: {
        ku: "سەرکەوتوو نەبوو لە ناچالاککردنی بەکارهێنەران",
        ar: "فشل في إلغاء تفعيل المستخدمين",
        en: "Failed to deactivate users",
      },
      userDeletedSuccess: {
        ku: "بەکارهێنەر بە سەرکەوتوویی سڕایەوە",
        ar: "تم حذف المستخدم بنجاح",
        en: "User deleted successfully",
      },
      usersActivatedSuccess: {
        ku: "بەکارهێنەران بە سەرکەوتوویی چالاک کران",
        ar: "تم تفعيل المستخدمين بنجاح",
        en: "Users activated successfully",
      },
      usersDeactivatedSuccess: {
        ku: "بەکارهێنەران بە سەرکەوتوویی ناچالاک کران",
        ar: "تم إلغاء تفعيل المستخدمين بنجاح",
        en: "Users deactivated successfully",
      },
      usersDeletedSuccess: {
        ku: "بەکارهێنەران بە سەرکەوتوویی سڕانەوە",
        ar: "تم حذف المستخدمين بنجاح",
        en: "Users deleted successfully",
      },
    },
    categories: {
      title: {
        ku: "بەشەکان",
        ar: "الفئات",
        en: "Categories",
      },
      pageTitle: {
        ku: "بەشەکان",
        ar: "إدارة الفئات",
        en: "Categories",
      },
      addCategory: {
        ku: "زیادکردنی بەشی نوێ",
        ar: "إضافة فئة جديدة",
        en: "Add New Category",
      },
      editCategory: {
        ku: "دەستکاری",
        ar: "تعديل الفئة",
        en: "Edit Category",
      },
      deleteCategory: {
        ku: "سڕینەوە",
        ar: "حذف الفئة",
        en: "Delete Category",
      },
      exportCategories: {
        ku: "هەناردنی بەشەکان",
        ar: "تصدير الفئات",
        en: "Export Categories",
      },
      refreshCategories: {
        ku: "نوێکردنەوە",
        ar: "تحديث",
        en: "Refresh",
      },
      bulkActions: {
        ku: "کردارەکان",
        ar: "إجراءات مجمعة",
        en: "Bulk Actions",
      },
      delete: {
        ku: "سڕینەوە",
        ar: "حذف",
        en: "Delete",
      },
      selectedCategories: {
        ku: "هەڵبژێردراو",
        ar: "محدد",
        en: "selected",
      },
      confirmDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      confirmBulkDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      categoryManagementForm: {
        ku: "فۆڕمی بەڕێوەبردنی بەش",
        ar: "نموذج إدارة الفئة",
        en: "Category management form.",
      },
      create: {
        ku: "دروستکردن",
        ar: "إنشاء",
        en: "Create",
      },
      update: {
        ku: "نوێکردنەوە",
        ar: "تحديث",
        en: "Update",
      },
      cancel: {
        ku: "هەڵوەشاندنەوە",
        ar: "إلغاء",
        en: "Cancel",
      },
      labelKu: {
        ku: "ناوی کوردی",
        ar: "بالكردية",
        en: "Kurdish Label",
      },
      labelAr: {
        ku: "ناوی عەرەبی",
        ar: "بالعربية",
        en: "Arabic Label",
      },
      labelEn: {
        ku: "ناوی ئینگلیزی",
        ar: "بالإنجليزية",
        en: "English Label",
      },
      enterLabelKu: {
        ku: "ناوی کوردی بنووسە",
        ar: "أدخل الاسم بالكردية",
        en: "Enter Kurdish label",
      },
      enterLabelAr: {
        ku: "ناوی عەرەبی بنووسە",
        ar: "أدخل الاسم بالعربية",
        en: "Enter Arabic label",
      },
      enterLabelEn: {
        ku: "ناوی ئینگلیزی بنووسە",
        ar: "أدخل الاسم بالإنجليزية",
        en: "Enter English label",
      },
      created: {
        ku: "دروستکراو",
        ar: "تاريخ الإنشاء",
        en: "Created",
      },
      updated: {
        ku: "نوێکرایەوە",
        ar: "مُحدث",
        en: "Updated",
      },
      noCategoriesFound: {
        ku: "هیچ بەشێک نەدۆزرایەوە",
        ar: "لا توجد فئات",
        en: "No categories found",
      },
      errorPrefix: {
        ku: "هەڵە:",
        ar: "خطأ:",
        en: "Error:",
      },
      failedToLoad: {
        ku: "نەتوانرا بەشەکان باربکرێن",
        ar: "فشل في تحميل الفئات",
        en: "Failed to load categories",
      },
      failedToDelete: {
        ku: "نەتوانرا بسڕێتەوە",
        ar: "فشل الحذف",
        en: "Failed to delete",
      },
      categoriesDeletedSuccess: {
        ku: "بەشەکان سڕانەوە",
        ar: "تم حذف الفئات",
        en: "Categories deleted",
      },
      // Loading states
      loadingCategories: {
        ku: "بارکردنی بەشەکان...",
        ar: "جاري تحميل الفئات...",
        en: "Loading categories...",
      },
      loadingMore: {
        ku: "بارکردنی زیاتر...",
        ar: "جاري تحميل المزيد...",
        en: "Loading more...",
      },
      loadMoreCategories: {
        ku: "بینینی زیاتر",
        ar: "تحميل المزيد من الفئات",
        en: "Load More Categories",
      },
      allCategoriesLoaded: {
        ku: "هەموو بەشەکان بارکران",
        ar: "تم تحميل جميع الفئات",
        en: "All categories loaded",
      },
      tryAgain: {
        ku: "دووبارە هەوڵ بدەرەوە",
        ar: "حاول مرة أخرى",
        en: "Try Again",
      },
      errorLoadingCategories: {
        ku: "هەڵە لە بارکردنی بەشەکان",
        ar: "خطأ في تحميل الفئات",
        en: "Error Loading Categories",
      },
      loadingMoreCategories: {
        ku: "زیاتر...",
        ar: "جاري تحميل المزيد من الفئات...",
        en: "Loading more categories...",
      },
      // Stats display
      showing: {
        ku: "پیشاندان",
        ar: "عرض",
        en: "Showing",
      },
      of: {
        ku: "لە",
        ar: "من",
        en: "of",
      },
      // Image upload related texts
      uploadImage: {
        ku: "بارکردنی وێنە",
        ar: "رفع صورة",
        en: "Upload Image",
      },
      changeImage: {
        ku: "گۆڕینی وێنە",
        ar: "تغيير الصورة",
        en: "Change Image",
      },
      chooseImage: {
        ku: "هەڵبژاردنی وێنە",
        ar: "اختيار صورة",
        en: "Choose Image",
      },
      categoryImage: {
        ku: "وێنەی بەش",
        ar: "صورة الفئة",
        en: "Category Image",
      },
      subcategoryImage: {
        ku: "وێنەی جۆر",
        ar: "صورة الفئة الفرعية",
        en: "SubCategory Image",
      },
      imageDescription: {
        ku: "وێنەیەکی بەرز بۆ بەشەکەت هەڵبژێرە. قەبارەی پێشنیارکراو: ٤٠٠x٤٠٠ پیکسڵ",
        ar: "اختر صورة عالية الجودة للفئة. الحجم المقترح: 400x400 بكسل",
        en: "Choose a high-quality image for your subcategory. Recommended size: 400x400px",
      },
      uploading: {
        ku: "بارکردن...",
        ar: "جاري الرفع...",
        en: "Uploading...",
      },
      imageUploadedSuccess: {
        ku: "وێنە بە سەرکەوتووی بارکرا",
        ar: "تم رفع الصورة بنجاح",
        en: "Image uploaded successfully",
      },
      remove: {
        ku: "لابردن",
        ar: "إزالة",
        en: "Remove",
      },
      supportedFormats: {
        ku: "فۆڕماتی پشتگیریکراو: JPG, PNG, SVG (گەورەترین قەبارە: ١٠MB)",
        ar: "الصيغ المدعومة: JPG, PNG, SVG (الحد الأقصى: 10 ميجابايت)",
        en: "Supported formats: JPG, PNG, SVG (Max size: 10MB)",
      },
    },
    feedback: {
      title: {
        ku: "فیدباک",
        ar: "التعليقات",
        en: "Feedback",
      },
      pageTitle: {
        ku: "بەڕێوەبردنی فیدباک",
        ar: "إدارة التعليقات",
        en: "Feedback Management",
      },
      deleteFeedback: {
        ku: "سڕینەوەی فیدباک",
        ar: "حذف التعليق",
        en: "Delete Feedback",
      },
      exportFeedback: {
        ku: "هەناردنی فیدباک",
        ar: "تصدير التعليقات",
        en: "Export Feedback",
      },
      refreshFeedback: {
        ku: "نوێکردنەوەی فیدباک",
        ar: "تحديث التعليقات",
        en: "Refresh Feedback",
      },
      bulkActions: {
        ku: "کارکردن بە زۆر",
        ar: "العمليات المجمعة",
        en: "Bulk Actions",
      },
      delete: {
        ku: "سڕینەوە",
        ar: "حذف",
        en: "Delete",
      },
      selectedFeedback: {
        ku: "فیدباکی هەڵبژێردراو",
        ar: "التعليقات المحددة",
        en: "Selected Feedback",
      },
      confirmDelete: {
        ku: "دڵنیایت لە سڕینەوەی ئەم فیدباکە؟",
        ar: "هل أنت متأكد من حذف هذا التعليق؟",
        en: "Are you sure you want to delete this feedback?",
      },
      confirmBulkDelete: {
        ku: "دڵنیایت لە سڕینەوەی هەموو فیدباکە هەڵبژێردراوەکان؟",
        ar: "هل أنت متأكد من حذف جميع التعليقات المحددة؟",
        en: "Are you sure you want to delete all selected feedback?",
      },
      customerName: {
        ku: "ناوی کڕیار",
        ar: "اسم العميل",
        en: "Customer Name",
      },
      email: {
        ku: "ئیمەیڵ",
        ar: "البريد الإلكتروني",
        en: "Email",
      },
      phone: {
        ku: "تەلەفۆن",
        ar: "الهاتف",
        en: "Phone",
      },
      message: {
        ku: "پەیام",
        ar: "الرسالة",
        en: "Message",
      },
      rating: {
        ku: "نرخاندن",
        ar: "التقييم",
        en: "Rating",
      },
      created: {
        ku: "دروستکراو",
        ar: "تاريخ الإنشاء",
        en: "Created",
      },
      noFeedbackFound: {
        ku: "هیچ فیدباکێک نەدۆزرایەوە",
        ar: "لم يتم العثور على تعليقات",
        en: "No feedback found",
      },
      errorPrefix: {
        ku: "هەڵە:",
        ar: "خطأ:",
        en: "Error:",
      },
      failedToLoad: {
        ku: "شکستی بارکردن",
        ar: "فشل في التحميل",
        en: "Failed to load",
      },
      failedToDelete: {
        ku: "شکستی سڕینەوە",
        ar: "فشل في الحذف",
        en: "Failed to delete",
      },
      feedbackDeletedSuccess: {
        ku: "فیدباک بە سەرکەوتووی سڕایەوە",
        ar: "تم حذف التعليق بنجاح",
        en: "Feedback deleted successfully",
      },
      feedbacksDeletedSuccess: {
        ku: "فیدباکەکان بە سەرکەوتووی سڕانەوە",
        ar: "تم حذف التعليقات بنجاح",
        en: "Feedback deleted successfully",
      },
      loadingFeedback: {
        ku: "بارکردنی فیدباک...",
        ar: "جاري تحميل التعليقات...",
        en: "Loading feedback...",
      },
      loadingMore: {
        ku: "بارکردنی زیاتر...",
        ar: "جاري تحميل المزيد...",
        en: "Loading more...",
      },
      loadMoreFeedback: {
        ku: "بارکردنی فیدباکی زیاتر",
        ar: "تحميل المزيد من التعليقات",
        en: "Load More Feedback",
      },
      allFeedbackLoaded: {
        ku: "هەموو فیدباکەکان بارکران",
        ar: "تم تحميل جميع التعليقات",
        en: "All feedback loaded",
      },
      tryAgain: {
        ku: "دووبارە هەوڵ بدەوە",
        ar: "حاول مرة أخرى",
        en: "Try Again",
      },
      errorLoadingFeedback: {
        ku: "هەڵە لە بارکردنی فیدباک",
        ar: "خطأ في تحميل التعليقات",
        en: "Error Loading Feedback",
      },
      loadingMoreFeedback: {
        ku: "بارکردنی فیدباکی زیاتر...",
        ar: "جاري تحميل المزيد من التعليقات...",
        en: "Loading more feedback...",
      },
      totalFeedback: {
        ku: "کۆی فیدباک",
        ar: "إجمالي التعليقات",
        en: "Total Feedback",
      },
      averageRating: {
        ku: "تێکڕای نرخاندن",
        ar: "متوسط التقييم",
        en: "Average Rating",
      },
      totalWithRating: {
        ku: "کۆی نرخاندن",
        ar: "إجمالي التقييمات",
        en: "Total with Rating",
      },
      ratingDistribution: {
        ku: "دابەشکردنی نرخاندن",
        ar: "توزيع التقييمات",
        en: "Rating Distribution",
      },
      filterByRating: {
        ku: "پاڵاوتنەوە بە نرخاندن",
        ar: "تصفية حسب التقييم",
        en: "Filter by Rating",
      },
      allRatings: {
        ku: "هەموو نرخاندنەکان",
        ar: "جميع التقييمات",
        en: "All Ratings",
      },
      showing: {
        ku: "پیشاندان",
        ar: "عرض",
        en: "Showing",
      },
      of: {
        ku: "لە",
        ar: "من",
        en: "of",
      },
    },
    menuItems: {
      title: {
        ku: "خواردنەکان",
        ar: "عناصر القائمة",
        en: "Menu Items",
      },
      pageTitle: {
        ku: "بەڕێوەبردنی خواردنەکان",
        ar: "إدارة عناصر القائمة",
        en: "Menu Items Management",
      },
      addMenuItem: {
        ku: "زیادکردنی خواردنی نوێ",
        ar: "إضافة عنصر جديد",
        en: "Add New Menu Item",
      },
      editMenuItem: {
        ku: "دەستکاری",
        ar: "تعديل العنصر",
        en: "Edit Menu Item",
      },
      deleteMenuItem: {
        ku: "سڕینەوە",
        ar: "حذف العنصر",
        en: "Delete Menu Item",
      },
      exportMenuItems: {
        ku: "هەناردنی خواردنەکان",
        ar: "تصدير العناصر",
        en: "Export Menu Items",
      },
      refreshMenuItems: {
        ku: "نوێکردنەوە",
        ar: "تحديث",
        en: "Refresh",
      },
      bulkActions: {
        ku: "کردارەکان",
        ar: "إجراءات مجمعة",
        en: "Bulk Actions",
      },
      delete: {
        ku: "سڕینەوە",
        ar: "حذف",
        en: "Delete",
      },
      selectedMenuItems: {
        ku: "هەڵبژێردراو",
        ar: "محدد",
        en: "selected",
      },
      confirmDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      confirmBulkDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      menuItemManagementForm: {
        ku: "فۆڕمی بەڕێوەبردنی خواردن",
        ar: "نموذج إدارة العنصر",
        en: "Menu item management form.",
      },
      create: {
        ku: "دروستکردن",
        ar: "إنشاء",
        en: "Create",
      },
      update: {
        ku: "نوێکردنەوە",
        ar: "تحديث",
        en: "Update",
      },
      cancel: {
        ku: "هەڵوەشاندنەوە",
        ar: "إلغاء",
        en: "Cancel",
      },
      // Form fields
      nameKu: {
        ku: "ناوی کوردی",
        ar: "الاسم بالكردية",
        en: "Kurdish Name",
      },
      nameAr: {
        ku: "ناوی عەرەبی",
        ar: "الاسم بالعربية",
        en: "Arabic Name",
      },
      nameEn: {
        ku: "ناوی ئینگلیزی",
        ar: "الاسم بالإنجليزية",
        en: "English Name",
      },
      nameEnglish: {
        ku: "ناوی ئینگلیزی",
        ar: "الاسم بالإنجليزية",
        en: "English Name",
      },
      nameArabic: {
        ku: "ناوی عەرەبی",
        ar: "الاسم بالعربية",
        en: "Arabic Name",
      },
      nameKurdish: {
        ku: "ناوی کوردی",
        ar: "الاسم بالكردية",
        en: "Kurdish Name",
      },
      price: {
        ku: "نرخ (دینار)",
        ar: "السعر (دينار)",
        en: "Price (IQD)",
      },
      descriptionKu: {
        ku: "پێناسەی کوردی",
        ar: "الوصف بالكردية",
        en: "Kurdish Description",
      },
      descriptionAr: {
        ku: "پێناسەی عەرەبی",
        ar: "الوصف بالعربية",
        en: "Arabic Description",
      },
      descriptionEn: {
        ku: "پێناسەی ئینگلیزی",
        ar: "الوصف بالإنجليزية",
        en: "English Description",
      },
      descriptionEnglish: {
        ku: "پێناسەی ئینگلیزی",
        ar: "الوصف بالإنجليزية",
        en: "Description (English)",
      },
      descriptionArabic: {
        ku: "پێناسەی عەرەبی",
        ar: "الوصف بالعربية",
        en: "Description (Arabic)",
      },
      descriptionKurdish: {
        ku: "پێناسەی کوردی",
        ar: "الوصف بالكردية",
        en: "Description (Kurdish)",
      },
      availableForCustomers: {
        ku: "بەردەستە بۆ کڕیاران",
        ar: "متاح للعملاء",
        en: "Available for Customers",
      },
      menuItemImage: {
        ku: "وێنەی خواردن",
        ar: "صورة العنصر",
        en: "Menu Item Image",
      },
      selectCategory: {
        ku: "بەش هەڵبژێرە",
        ar: "اختر الفئة",
        en: "Select Category",
      },
      selectSubcategory: {
        ku: "ژێربەش هەڵبژێرە",
        ar: "اختر الفئة الفرعية",
        en: "Select Subcategory",
      },
      selectCategoryFirst: {
        ku: "سەرەتا بەش هەڵبژێرە",
        ar: "اختر الفئة أولاً",
        en: "Select Category First",
      },
      saving: {
        ku: "پاشەکەوتکردن...",
        ar: "جاري الحفظ...",
        en: "Saving...",
      },
      // Form placeholders
      enterNameKu: {
        ku: "ناوی کوردی بنووسە",
        ar: "أدخل الاسم بالكردية",
        en: "Enter Kurdish name",
      },
      enterNameAr: {
        ku: "ناوی عەرەبی بنووسە",
        ar: "أدخل الاسم بالعربية",
        en: "Enter Arabic name",
      },
      enterNameEn: {
        ku: "ناوی ئینگلیزی بنووسە",
        ar: "أدخل الاسم بالإنجليزية",
        en: "Enter English name",
      },
      enterNameEnglish: {
        ku: "ناوی ئینگلیزی بنووسە",
        ar: "أدخل الاسم بالإنجليزية",
        en: "Enter English name",
      },
      enterNameArabic: {
        ku: "ناوی عەرەبی بنووسە",
        ar: "أدخل الاسم بالعربية",
        en: "Enter Arabic name",
      },
      enterNameKurdish: {
        ku: "ناوی کوردی بنووسە",
        ar: "أدخل الاسم بالكردية",
        en: "Enter Kurdish name",
      },
      enterPrice: {
        ku: "نرخ بنووسە",
        ar: "أدخل السعر",
        en: "Enter price",
      },
      enterDescriptionKu: {
        ku: "پێناسەی کوردی بنووسە",
        ar: "أدخل الوصف بالكردية",
        en: "Enter Kurdish description",
      },
      enterDescriptionAr: {
        ku: "پێناسەی عەرەبی بنووسە",
        ar: "أدخل الوصف بالعربية",
        en: "Enter Arabic description",
      },
      enterDescriptionEn: {
        ku: "پێناسەی ئینگلیزی بنووسە",
        ar: "أدخل الوصف بالإنجليزية",
        en: "Enter English description",
      },
      enterDescriptionEnglish: {
        ku: "پێناسەی ئینگلیزی بنووسە",
        ar: "أدخل الوصف بالإنجليزية",
        en: "Enter English description",
      },
      enterDescriptionArabic: {
        ku: "پێناسەی عەرەبی بنووسە",
        ar: "أدخل الوصف بالعربية",
        en: "Enter Arabic description",
      },
      enterDescriptionKurdish: {
        ku: "پێناسەی کوردی بنووسە",
        ar: "أدخل الوصف بالكردية",
        en: "Enter Kurdish description",
      },
      // Image upload related texts
      uploadImage: {
        ku: "بارکردنی وێنە",
        ar: "رفع صورة",
        en: "Upload Image",
      },
      changeImage: {
        ku: "گۆڕینی وێنە",
        ar: "تغيير الصورة",
        en: "Change Image",
      },
      chooseImage: {
        ku: "هەڵبژاردنی وێنە",
        ar: "اختيار صورة",
        en: "Choose Image",
      },
      imageDescription: {
        ku: "وێنەیەکی بەرز بۆ خواردنەکەت هەڵبژێرە. قەبارەی پێشنیارکراو: ٤٠٠x٤٠٠ پیکسڵ",
        ar: "اختر صورة عالية الجودة للعنصر. الحجم المقترح: 400x400 بكسل",
        en: "Choose a high-quality image for your menu item. Recommended size: 400x400px",
      },
      uploading: {
        ku: "بارکردن...",
        ar: "جاري الرفع...",
        en: "Uploading...",
      },
      imageUploadedSuccess: {
        ku: "وێنە بە سەرکەوتووی بارکرا",
        ar: "تم رفع الصورة بنجاح",
        en: "Image uploaded successfully",
      },
      remove: {
        ku: "لابردن",
        ar: "إزالة",
        en: "Remove",
      },
      supportedFormats: {
        ku: "فۆڕماتی پشتگیریکراو: JPG, PNG, SVG (گەورەترین قەبارە: ١٠MB)",
        ar: "الصيغ المدعومة: JPG, PNG, SVG (الحد الأقصى: 10 ميجابايت)",
        en: "Supported formats: JPG, PNG, SVG (Max size: 10MB)",
      },
      // Table columns
      name: {
        ku: "ناو",
        ar: "الاسم",
        en: "Name",
      },
      category: {
        ku: "بەش",
        ar: "الفئة",
        en: "Category",
      },
      subcategory: {
        ku: "ژێربەش",
        ar: "الفئة الفرعية",
        en: "Subcategory",
      },
      rating: {
        ku: "نرخاندن",
        ar: "التقييم",
        en: "Rating",
      },
      status: {
        ku: "دۆخ",
        ar: "الحالة",
        en: "Status",
      },
      created: {
        ku: "دروستکراو",
        ar: "تاريخ الإنشاء",
        en: "Created",
      },
      // Status labels
      available: {
        ku: "بەردەست",
        ar: "متاح",
        en: "Available",
      },
      unavailable: {
        ku: "بەردەست نییە",
        ar: "غير متاح",
        en: "Unavailable",
      },
      // Messages
      noMenuItemsFound: {
        ku: "هیچ خواردنێک نەدۆزرایەوە",
        ar: "لا توجد عناصر قائمة",
        en: "No menu items found",
      },
      errorPrefix: {
        ku: "هەڵە:",
        ar: "خطأ:",
        en: "Error:",
      },
      failedToLoad: {
        ku: "نەتوانرا خواردنەکان باربکرێن",
        ar: "فشل في تحميل العناصر",
        en: "Failed to load menu items",
      },
      failedToDelete: {
        ku: "نەتوانرا بسڕێتەوە",
        ar: "فشل الحذف",
        en: "Failed to delete",
      },
      menuItemDeletedSuccess: {
        ku: "خواردن سڕایەوە",
        ar: "تم حذف العنصر",
        en: "Menu item deleted",
      },
      menuItemsDeletedSuccess: {
        ku: "خواردنەکان سڕانەوە",
        ar: "تم حذف العناصر",
        en: "Menu items deleted",
      },
      // Loading states
      loadingMenuItems: {
        ku: "بارکردنی خواردنەکان...",
        ar: "جاري تحميل العناصر...",
        en: "Loading menu items...",
      },
      loadingMore: {
        ku: "بارکردنی زیاتر...",
        ar: "جاري تحميل المزيد...",
        en: "Loading more...",
      },
      loadMoreMenuItems: {
        ku: "بینینی زیاتر",
        ar: "تحميل المزيد من العناصر",
        en: "Load More Menu Items",
      },
      allMenuItemsLoaded: {
        ku: "هەموو خواردنەکان بارکران",
        ar: "تم تحميل جميع العناصر",
        en: "All menu items loaded",
      },
      tryAgain: {
        ku: "دووبارە هەوڵ بدەرەوە",
        ar: "حاول مرة أخرى",
        en: "Try Again",
      },
      errorLoadingMenuItems: {
        ku: "هەڵە لە بارکردنی خواردنەکان",
        ar: "خطأ في تحميل العناصر",
        en: "Error Loading Menu Items",
      },
      loadingMoreMenuItems: {
        ku: "زیاتر...",
        ar: "جاري تحميل المزيد من العناصر...",
        en: "Loading more menu items...",
      },
      // Stats display
      totalMenuItems: {
        ku: "کۆی خواردنەکان",
        ar: "إجمالي العناصر",
        en: "Total Menu Items",
      },
      availableMenuItems: {
        ku: "خواردنە بەردەستەکان",
        ar: "العناصر المتاحة",
        en: "Available Menu Items",
      },
      showing: {
        ku: "پیشاندان",
        ar: "عرض",
        en: "Showing",
      },
      of: {
        ku: "لە",
        ar: "من",
        en: "of",
      },
    },
    restaurants: {
      title: {
        ku: "چێشتخانەکان",
        ar: "المطاعم",
        en: "Restaurants",
      },
      pageTitle: {
        ku: "بەڕێوەبردنی چێشتخانەکان",
        ar: "إدارة المطاعم",
        en: "Restaurant Management",
      },
      addRestaurant: {
        ku: "زیادکردنی چێشتخانەی نوێ",
        ar: "إضافة مطعم جديد",
        en: "Add New Restaurant",
      },
      editRestaurant: {
        ku: "دەستکاری چێشتخانە",
        ar: "تعديل المطعم",
        en: "Edit Restaurant",
      },
      deleteRestaurant: {
        ku: "سڕینەوەی چێشتخانە",
        ar: "حذف المطعم",
        en: "Delete Restaurant",
      },
      exportRestaurants: {
        ku: "هەناردنی چێشتخانەکان",
        ar: "تصدير المطاعم",
        en: "Export Restaurants",
      },
      refreshRestaurants: {
        ku: "نوێکردنەوە",
        ar: "تحديث",
        en: "Refresh",
      },
      bulkActions: {
        ku: "کردارەکان",
        ar: "إجراءات مجمعة",
        en: "Bulk Actions",
      },
      activate: {
        ku: "چالاککردن",
        ar: "تفعيل",
        en: "Activate",
      },
      deactivate: {
        ku: "ناچالاککردن",
        ar: "إلغاء التفعيل",
        en: "Deactivate",
      },
      delete: {
        ku: "سڕینەوە",
        ar: "حذف",
        en: "Delete",
      },
      selectedRestaurants: {
        ku: "چێشتخانە هەڵبژێردراوەکان",
        ar: "المطاعم المحددة",
        en: "Selected Restaurants",
      },
      confirmDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      confirmBulkDelete: {
        ku: "دڵنیایت لە سڕینەوەی",
        ar: "هل أنت متأكد من حذف",
        en: "Are you sure you want to delete",
      },
      restaurantManagementForm: {
        ku: "فۆڕمی بەڕێوەبردنی چێشتخانە",
        ar: "نموذج إدارة المطعم",
        en: "Restaurant management form",
      },
      create: {
        ku: "دروستکردن",
        ar: "إنشاء",
        en: "Create",
      },
      update: {
        ku: "نوێکردنەوە",
        ar: "تحديث",
        en: "Update",
      },
      cancel: {
        ku: "هەڵوەشاندنەوە",
        ar: "إلغاء",
        en: "Cancel",
      },
      // Form fields
      name: {
        ku: "ناوی چێشتخانە",
        ar: "اسم المطعم",
        en: "Restaurant Name",
      },
      description: {
        ku: "پێناسە",
        ar: "الوصف",
        en: "Description",
      },
      address: {
        ku: "ناونیشان",
        ar: "العنوان",
        en: "Address",
      },
      phone: {
        ku: "ژمارەی تەلەفۆن",
        ar: "رقم الهاتف",
        en: "Phone Number",
      },
      email: {
        ku: "ئیمەیڵ",
        ar: "البريد الإلكتروني",
        en: "Email",
      },
      website: {
        ku: "ماڵپەڕ",
        ar: "الموقع الإلكتروني",
        en: "Website",
      },
      themeColor: {
        ku: "ڕەنگی ڕووکار",
        ar: "لون المظهر",
        en: "Theme Color",
      },
      activeRestaurant: {
        ku: "چێشتخانەی چالاک",
        ar: "مطعم نشط",
        en: "Active Restaurant",
      },
      restaurantLogo: {
        ku: "لۆگۆی چێشتخانە",
        ar: "شعار المطعم",
        en: "Restaurant Logo",
      },
      saving: {
        ku: "پاشەکەوتکردن...",
        ar: "جاري الحفظ...",
        en: "Saving...",
      },
      // Form placeholders
      enterName: {
        ku: "ناوی چێشتخانە بنووسە",
        ar: "أدخل اسم المطعم",
        en: "Enter restaurant name",
      },
      enterDescription: {
        ku: "پێناسە بنووسە",
        ar: "أدخل الوصف",
        en: "Enter description",
      },
      enterAddress: {
        ku: "ناونیشان بنووسە",
        ar: "أدخل العنوان",
        en: "Enter address",
      },
      enterPhone: {
        ku: "ژمارەی تەلەفۆن بنووسە",
        ar: "أدخل رقم الهاتف",
        en: "Enter phone number",
      },
      enterEmail: {
        ku: "ئیمەیڵ بنووسە",
        ar: "أدخل البريد الإلكتروني",
        en: "Enter email address",
      },
      enterWebsite: {
        ku: "ماڵپەڕ بنووسە",
        ar: "أدخل الموقع الإلكتروني",
        en: "Enter website URL",
      },
      // Image upload related texts
      uploadLogo: {
        ku: "بارکردنی لۆگۆ",
        ar: "رفع الشعار",
        en: "Upload Logo",
      },
      changeLogo: {
        ku: "گۆڕینی لۆگۆ",
        ar: "تغيير الشعار",
        en: "Change Logo",
      },
      chooseLogo: {
        ku: "هەڵبژاردنی لۆگۆ",
        ar: "اختيار الشعار",
        en: "Choose Logo",
      },
      logoDescription: {
        ku: "لۆگۆیەکی بەرز بۆ چێشتخانەکەت هەڵبژێرە. قەبارەی پێشنیارکراو: ٢٠٠x٢٠٠ پیکسڵ",
        ar: "اختر شعاراً عالي الجودة للمطعم. الحجم المقترح: 200x200 بكسل",
        en: "Choose a high-quality logo for your restaurant. Recommended size: 200x200px",
      },
      uploading: {
        ku: "بارکردن...",
        ar: "جاري الرفع...",
        en: "Uploading...",
      },
      logoUploadedSuccess: {
        ku: "لۆگۆ بە سەرکەوتووی بارکرا",
        ar: "تم رفع الشعار بنجاح",
        en: "Logo uploaded successfully",
      },
      remove: {
        ku: "لابردن",
        ar: "إزالة",
        en: "Remove",
      },
      supportedFormats: {
        ku: "فۆڕماتی پشتگیریکراو: JPG, PNG, SVG (گەورەترین قەبارە: ٥MB)",
        ar: "الصيغ المدعومة: JPG, PNG, SVG (الحد الأقصى: 5 ميجابايت)",
        en: "Supported formats: JPG, PNG, SVG (Max size: 5MB)",
      },
      // Table columns
      status: {
        ku: "دۆخ",
        ar: "الحالة",
        en: "Status",
      },
      created: {
        ku: "دروستکراو",
        ar: "تاريخ الإنشاء",
        en: "Created",
      },
      // Status labels
      active: {
        ku: "چالاک",
        ar: "نشط",
        en: "Active",
      },
      inactive: {
        ku: "ناچالاک",
        ar: "غير نشط",
        en: "Inactive",
      },
      // Messages
      noRestaurantsFound: {
        ku: "هیچ چێشتخانەیەک نەدۆزرایەوە",
        ar: "لا توجد مطاعم",
        en: "No restaurants found",
      },
      errorPrefix: {
        ku: "هەڵە:",
        ar: "خطأ:",
        en: "Error:",
      },
      failedToLoad: {
        ku: "نەتوانرا چێشتخانەکان باربکرێن",
        ar: "فشل في تحميل المطاعم",
        en: "Failed to load restaurants",
      },
      failedToDelete: {
        ku: "نەتوانرا بسڕێتەوە",
        ar: "فشل الحذف",
        en: "Failed to delete",
      },
      restaurantDeletedSuccess: {
        ku: "چێشتخانە سڕایەوە",
        ar: "تم حذف المطعم",
        en: "Restaurant deleted",
      },
      restaurantsDeletedSuccess: {
        ku: "چێشتخانەکان سڕانەوە",
        ar: "تم حذف المطاعم",
        en: "Restaurants deleted",
      },
      // Loading states
      loadingRestaurants: {
        ku: "بارکردنی چێشتخانەکان...",
        ar: "جاري تحميل المطاعم...",
        en: "Loading restaurants...",
      },
      loadingMore: {
        ku: "بارکردنی زیاتر...",
        ar: "جاري تحميل المزيد...",
        en: "Loading more...",
      },
      loadMoreRestaurants: {
        ku: "بینینی زیاتر",
        ar: "تحميل المزيد من المطاعم",
        en: "Load More Restaurants",
      },
      allRestaurantsLoaded: {
        ku: "هەموو چێشتخانەکان بارکران",
        ar: "تم تحميل جميع المطاعم",
        en: "All restaurants loaded",
      },
      tryAgain: {
        ku: "دووبارە هەوڵ بدەرەوە",
        ar: "حاول مرة أخرى",
        en: "Try Again",
      },
      errorLoadingRestaurants: {
        ku: "هەڵە لە بارکردنی چێشتخانەکان",
        ar: "خطأ في تحميل المطاعم",
        en: "Error Loading Restaurants",
      },
      loadingMoreRestaurants: {
        ku: "زیاتر...",
        ar: "جاري تحميل المزيد من المطاعم...",
        en: "Loading more restaurants...",
      },
      // Stats display
      totalRestaurants: {
        ku: "کۆی چێشتخانەکان",
        ar: "إجمالي المطاعم",
        en: "Total Restaurants",
      },
      activeRestaurants: {
        ku: "چێشتخانە چالاکەکان",
        ar: "المطاعم النشطة",
        en: "Active Restaurants",
      },
      showing: {
        ku: "پیشاندان",
        ar: "عرض",
        en: "Showing",
      },
      of: {
        ku: "لە",
        ar: "من",
        en: "of",
      },
    },
    notFound: {
      title: {
        ku: "پەڕە نەدۆزرایەوە",
        ar: "الصفحة غير موجودة",
        en: "Page Not Found",
      },
      subtitle: {
        ku: "404",
        ar: "404",
        en: "404",
      },
      description: {
        ku: "ببوورە، ئەو پەڕەیەی بەدوایدا دەگەڕێیت بوونی نییە یان گوازراوەتەوە.",
        ar: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
        en: "Sorry, the page you are looking for doesn't exist or has been moved.",
      },
      goToDashboard: {
        ku: "بڕۆ بۆ داشبۆرد",
        ar: "الذهاب إلى لوحة التحكم",
        en: "Go to Dashboard",
      },
      goBack: {
        ku: "گەڕانەوە",
        ar: "العودة",
        en: "Go Back",
      },
      helpText: {
        ku: "پێویستت بە یارمەتییە؟ پەیوەندی بکە بە",
        ar: "تحتاج مساعدة؟ اتصل بـ",
        en: "Need help? Contact",
      },
      support: {
        ku: "پشتگیری",
        ar: "الدعم",
        en: "support",
      },
    },
    loading: {
      ku: "بارکردن...",
      ar: "جاري التحميل...",
      en: "Loading...",
    },
    accessibility: {
      toggleTheme: {
        ku: "گۆڕینی ڕووکار",
        ar: "تغيير المظهر",
        en: "Toggle theme",
      },
      selectLanguage: {
        ku: "هەڵبژاردنی زمان",
        ar: "اختر اللغة",
        en: "Select language",
      },
    },
  },
};
