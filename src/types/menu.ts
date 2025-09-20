import React from "react";

export type Language = "ku" | "ar" | "en";

export interface LocalizedText {
  ku: string;
  ar: string;
  en: string;
}

export interface MenuItem {
  id: string; // Changed from number to string to support UUIDs
  name: LocalizedText;
  price: string;
  subcategory: string;
  image: string;
  description?: LocalizedText;
  rating?: number;
  isAvailable?: boolean;
}

export interface SubCategory {
  id: string;
  label: LocalizedText;
  img: string | React.ComponentType<{ className?: string }>;
}

export interface Category {
  id: string;
  label: LocalizedText;
  subCategories: SubCategory[];
  items: MenuItem[];
}

export interface MenuConfig {
  categories: Category[];
  searchPlaceholder?: LocalizedText;
  noResultsMessage?: LocalizedText;
  defaultDescription?: LocalizedText;
  // logo?: string;
  logo?: {
    dark: string;
    light: string;
  };
  restaurantName?: LocalizedText;
  currency?: LocalizedText;
  defaultRating?: number;
  showRating?: boolean;
  showDescription?: boolean;

  // Social media configuration
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    telegram?: string;
  };

  // Location configuration
  location?: {
    address?: LocalizedText;
    coordinates?: {
      lat: number;
      lng: number;
    };
    googleMapsUrl?: string;
  };

  ui?: {
    loader: {
      subtitles: LocalizedText;
      steps: {
        ku: string[];
        ar: string[];
        en: string[];
      };
      percentage: LocalizedText;
    };
    notFound: {
      title: LocalizedText;
      subtitle: LocalizedText;
      message: LocalizedText;
      homeButton: LocalizedText;
      orText: LocalizedText;
    };
    all: LocalizedText;
    allItems: LocalizedText;
    itemInfo: {
      addToCart: LocalizedText;
      total: LocalizedText;
      rating: LocalizedText;
      increaseQuantity: LocalizedText;
      decreaseQuantity: LocalizedText;
    };
    feedbackToast: {
      message: LocalizedText;
      closeLabel: LocalizedText;
    };
    languages: {
      kurdish: {
        name: LocalizedText;
        nativeName: string;
        englishName: string;
      };
      arabic: {
        name: LocalizedText;
        nativeName: string;
      };
      english: {
        name: LocalizedText;
        nativeName: string;
      };
    };
    footer: {
      developedBy: LocalizedText;
      connectWithUs: LocalizedText;
      allRightsReserved: LocalizedText;
      poweredBy: LocalizedText;
      copyright: LocalizedText;
      socialMedia: {
        facebook: LocalizedText;
        instagram: LocalizedText;
        linkedin: LocalizedText;
        whatsapp: LocalizedText;
      };
    };
    languageDropdown: {
      selectLanguage: LocalizedText;
    };
    accessibility: {
      closeModal: LocalizedText;
      loading: LocalizedText;
      cart: {
        colapssedCart: LocalizedText;
      };
      menu: LocalizedText;
      language: LocalizedText;
      icon: LocalizedText;
    };
    cart: {
      colapssedCart: LocalizedText;
    };

    feedback: {
      icon: string;
      title: LocalizedText;
      subtitle: LocalizedText;
      foodQuality: LocalizedText;
      serviceQuality: LocalizedText;
      cleanliness: LocalizedText;
      staffBehavior: LocalizedText;
      overallSatisfaction: LocalizedText;
      contact: LocalizedText;
      phoneNumber: LocalizedText;
      tableNumber: LocalizedText;
      yourComment: LocalizedText;
      submit: LocalizedText;
      submitted: LocalizedText;
    };

    // Food rating texts
    foodRating: {
      title: LocalizedText;
      subtitle: LocalizedText;
      phoneLabel: LocalizedText;
      closeButton: LocalizedText;
      submitButton: LocalizedText;
    };

    // Validation texts
    validation: {
      phoneRequired: LocalizedText;
      phoneInvalid: LocalizedText;
      tableRequired: LocalizedText;
      tableInvalid: LocalizedText;
      ratingRequired: LocalizedText;
    };

    alerts: {
      ratingSubmitted: LocalizedText;
      buttons: {
        ok: LocalizedText;
        yes: LocalizedText;
        no: LocalizedText;
        cancel: LocalizedText;
        confirm: LocalizedText;
        delete: LocalizedText;
        save: LocalizedText;
        close: LocalizedText;
        remove: LocalizedText;
      };
      titles: {
        success: LocalizedText;
        error: LocalizedText;
        warning: LocalizedText;
        information: LocalizedText;
        confirmation: LocalizedText;
        deleteConfirmation: LocalizedText;
        removeImage: LocalizedText;
      };
      messages: {
        deleteItem: LocalizedText;
        unsavedChanges: LocalizedText;
        logout: LocalizedText;
        operationSuccess: LocalizedText;
        operationFailed: LocalizedText;
        networkError: LocalizedText;
        removeImage: LocalizedText;
        imageRemoved: LocalizedText;
        imageRemoveFailed: LocalizedText;
      };
    };
  };
}

export interface MenuItemCardProps {
  item: MenuItem;
  language: Language;
  theme: any;
  currency?: LocalizedText;
  defaultDescription?: LocalizedText;
  defaultRating?: number;
  showRating?: boolean;
  showDescription?: boolean;
  onItemClick?: (item: MenuItem) => void;
}

export interface MenuProps {
  config: MenuConfig;
  language?: Language;
  className?: string;
  showSearch?: boolean;
  showThemeToggle?: boolean;
  onItemClick?: (item: MenuItem) => void;
}

export interface SystemSettings {
  id: string;
  setting_type: string;
  logo_url?: string; // Legacy logo field for backward compatibility
  light_logo_url?: string; // Logo for light theme
  dark_logo_url?: string; // Logo for dark theme
  theme_color: string;
  created_at: string;
  updated_at: string;
}
