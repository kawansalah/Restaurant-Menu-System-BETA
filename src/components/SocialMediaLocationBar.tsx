import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsAppIcon,
  TelegramIcon,
  LocationIcon,
} from "./Icons";
import type { SocialMediaLocationBarProps } from "@/types/socialMediaLocationBar";

const SocialMediaLocationBar: React.FC<SocialMediaLocationBarProps> = ({
  socialMedia,
  location,
  className = "",
  iconSize = "md",
  spacing = "normal",
  showSeparator = true,
  orientation = "horizontal",
  customStyles = {},
  onSocialClick,
  onLocationClick,
}) => {
  const { language } = useLanguage();
  const themeClasses = useThemeClasses();

  // Icon size mapping
  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  // Padding size mapping
  const paddingSizeClasses = {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
  };

  // Spacing mapping
  const spacingClasses = {
    tight: "gap-2",
    normal: "gap-3",
    wide: "gap-4",
  };

  // Orientation classes
  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  // Check if any social media links exist
  const hasSocialMedia =
    socialMedia && Object.values(socialMedia).some((url) => url);

  // Default button styles
  const defaultButtonStyles = `${paddingSizeClasses[iconSize]} rounded-full ${themeClasses.bgCard} ${themeClasses.textMain} hover:opacity-80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`;

  // Handle social media click
  const handleSocialClick = (platform: string, url: string) => {
    if (onSocialClick) {
      onSocialClick(platform, url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Handle location click
  const handleLocationClick = () => {
    const url =
      location?.googleMapsUrl ||
      `https://www.google.com/maps?q=${location?.coordinates?.lat},${location?.coordinates?.lng}`;

    if (onLocationClick) {
      onLocationClick(url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Render social media icons
  const renderSocialMedia = () => {
    if (!hasSocialMedia) return null;

    const socialIcons = [
      { key: "facebook", icon: FacebookIcon, url: socialMedia?.facebook },
      { key: "instagram", icon: InstagramIcon, url: socialMedia?.instagram },
      { key: "twitter", icon: TwitterIcon, url: socialMedia?.twitter },
      { key: "whatsapp", icon: WhatsAppIcon, url: socialMedia?.whatsapp },
      { key: "telegram", icon: TelegramIcon, url: socialMedia?.telegram },
    ];

    return (
      <div
        className={`flex items-center ${spacingClasses[spacing]} ${
          customStyles.socialContainer || ""
        }`}
      >
        {socialIcons.map(({ key, icon: Icon, url }) => {
          if (!url) return null;

          return (
            <button
              key={key}
              onClick={() => handleSocialClick(key, url)}
              className={customStyles.iconButton || defaultButtonStyles}
              aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
              type="button"
            >
              <Icon className={iconSizeClasses[iconSize]} />
            </button>
          );
        })}
      </div>
    );
  };

  // Render location button
  const renderLocation = () => {
    if (!location) return null;

    return (
      <div className={customStyles.locationContainer || ""}>
        <button
          onClick={handleLocationClick}
          className={customStyles.iconButton || defaultButtonStyles}
          aria-label={location.address?.[language] || "Location"}
          title={location.address?.[language] || "View Location"}
          type="button"
        >
          <LocationIcon className={iconSizeClasses[iconSize]} />
        </button>
      </div>
    );
  };

  // Render separator
  const renderSeparator = () => {
    if (!showSeparator || !hasSocialMedia || !location) return null;

    const separatorOrientation =
      orientation === "vertical" ? "h-px w-6" : "w-px h-6";

    return (
      <div
        className={
          customStyles.separator ||
          `${separatorOrientation} ${themeClasses.bgCard} opacity-50`
        }
      />
    );
  };

  // Don't render if no content
  if (!hasSocialMedia && !location) return null;

  return (
    <div
      className={`flex items-center justify-center ${spacingClasses[spacing]} ${
        orientationClasses[orientation]
      } ${className} ${customStyles.container || ""}`}
    >
      {renderSocialMedia()}
      {renderSeparator()}
      {renderLocation()}
    </div>
  );
};

export default SocialMediaLocationBar;
