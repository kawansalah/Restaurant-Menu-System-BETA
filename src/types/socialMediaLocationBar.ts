// Type definitions for SocialMediaLocationBar component

export interface SocialMediaConfig {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  telegram?: string;
}

export interface LocationConfig {
  address?: {
    ku: string;
    ar: string;
    en: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
}

export interface CustomStyles {
  container?: string;
  socialContainer?: string;
  locationContainer?: string;
  iconButton?: string;
  separator?: string;
}

export type IconSize = "sm" | "md" | "lg";
export type Spacing = "tight" | "normal" | "wide";
export type Orientation = "horizontal" | "vertical";

export interface SocialMediaLocationBarProps {
  socialMedia?: SocialMediaConfig;
  location?: LocationConfig;
  className?: string;
  iconSize?: IconSize;
  spacing?: Spacing;
  showSeparator?: boolean;
  orientation?: Orientation;
  customStyles?: CustomStyles;
  onSocialClick?: (platform: string, url: string) => void;
  onLocationClick?: (url: string) => void;
}

// Predefined configurations for common use cases
export const PRESET_CONFIGS = {
  // Minimal configuration with just essential social media
  minimal: {
    iconSize: "sm" as IconSize,
    spacing: "tight" as Spacing,
    showSeparator: false,
  },

  // Standard restaurant configuration
  restaurant: {
    iconSize: "md" as IconSize,
    spacing: "normal" as Spacing,
    showSeparator: true,
    orientation: "horizontal" as Orientation,
  },

  // Large, prominent display
  featured: {
    iconSize: "lg" as IconSize,
    spacing: "wide" as Spacing,
    showSeparator: true,
    orientation: "horizontal" as Orientation,
  },

  // Compact vertical layout for sidebars
  sidebar: {
    iconSize: "sm" as IconSize,
    spacing: "tight" as Spacing,
    orientation: "vertical" as Orientation,
    showSeparator: false,
  },
} as const;

// Helper function to generate social media URLs
export const generateSocialUrls = (businessName: string) => ({
  facebook: `https://facebook.com/${businessName}`,
  instagram: `https://instagram.com/${businessName}`,
  twitter: `https://twitter.com/${businessName}`,
  telegram: `https://t.me/${businessName}`,
});

// Helper function to generate WhatsApp URL
export const generateWhatsAppUrl = (phoneNumber: string, message?: string) => {
  const baseUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

// Helper function to generate Google Maps URL from coordinates
export const generateMapsUrl = (lat: number, lng: number, label?: string) => {
  const coords = `${lat},${lng}`;
  return label
    ? `https://www.google.com/maps/search/?api=1&query=${coords}&query_place_id=${encodeURIComponent(
        label
      )}`
    : `https://www.google.com/maps?q=${coords}`;
};
