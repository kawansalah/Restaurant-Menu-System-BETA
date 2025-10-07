interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "adminpanel" | "delete";
  icon?: string;
  iconAlt?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  icon,
  iconAlt = "icon",
  disabled = false,
  className = "",
  style = {},
  onMouseEnter,
  onMouseLeave,
}: ButtonProps) {
  // Base styles with responsive sizing
  const baseStyles =
    "flex items-center justify-center w-full transform transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none rounded-3xl font-bold " +
    "py-4 px-4 text-base sm:py-4 sm:px-5 sm:text-lg md:py-[18px] md:px-6 md:text-xl lg:py-5 lg:px-7 lg:text-xl xl:py-[18px] xl:px-5 xl:text-xl";

  // Admin panel specific sizing
  const adminPanelSizing =
    "py-2 px-4 text-sm sm:py-2 sm:px-6 sm:text-base md:py-2 md:px-8 md:text-base lg:py-2 lg:px-10 lg:text-lg";

  // Variant-specific background colors and base shadows
  const getVariantStyles = (variant: string) => {
    const baseClass =
      variant === "adminpanel"
        ? `flex items-center justify-center w-full transform transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none rounded-3xl font-bold ${adminPanelSizing}`
        : baseStyles;

    switch (variant) {
      case "primary":
        return `${baseClass} gap-2`;
      case "secondary":
        return `${baseClass} gap-2`;
      case "adminpanel":
        return baseClass;
      case "delete":
        return `${baseClass} gap-2`;
      default:
        return `${baseClass} gap-2`;
    }
  };

  // Get inline styles for each variant
  const getVariantInlineStyles = (variant: string) => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "var(--bg-main)",
          color: "var(--button-text-primary)",
          boxShadow:
            "0 10px 30px rgba(182, 147, 75, 0.4), var(--button-shadow-primary)",
          border: "none",
        };
      case "secondary":
        return {
          backgroundColor: "#4B4B4B",
          color: "white",
          boxShadow: "0 10px 30px rgba(55, 55, 55, 0.4)",
          border: "none",
        };
      case "adminpanel":
        return {
          backgroundColor: "var(--bg-main)",
          color: "var(--button-text-primary)",
          boxShadow:
            "0 10px 30px rgba(182, 147, 75, 0.4), var(--button-shadow-primary)",
          border: "none",
        };
      case "delete":
        return {
          backgroundColor: "#ef4444",
          color: "white",
          boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)",
          border: "none",
        };
      default:
        return {
          backgroundColor: "var(--bg-main)",
          color: "var(--button-text-primary)",
          boxShadow:
            "0 10px 30px rgba(182, 147, 75, 0.4), var(--button-shadow-primary)",
          border: "none",
        };
    }
  };

  const disabledStyles = `${getVariantStyles(
    variant
  )} opacity-50 cursor-not-allowed`;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Enhanced hover effect based on variant
    switch (variant) {
      case "primary":
      case "adminpanel":
        e.currentTarget.style.boxShadow =
          "0 15px 40px rgba(182, 147, 75, 0.6), var(--button-shadow-primary-hover)";
        break;
      case "secondary":
        e.currentTarget.style.boxShadow = "0 15px 40px rgba(55, 55, 55, 0.6)";
        break;
      case "delete":
        e.currentTarget.style.boxShadow = "0 15px 40px rgba(239, 68, 68, 0.6)";
        break;
    }
    e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";

    // Call custom onMouseEnter if provided
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Reset to default styling based on variant
    switch (variant) {
      case "primary":
      case "adminpanel":
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(182, 147, 75, 0.4), var(--button-shadow-primary)";
        break;
      case "secondary":
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(55, 55, 55, 0.4)";
        break;
      case "delete":
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(239, 68, 68, 0.4)";
        break;
    }
    e.currentTarget.style.transform = "translateY(0) scale(1)";

    // Call custom onMouseLeave if provided
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  };

  // Combine user style with variant styles
  const combinedStyle = {
    ...getVariantInlineStyles(variant),
    ...style,
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${className} ${
        disabled ? disabledStyles : getVariantStyles(variant)
      }`}
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex items-center justify-center gap-1 sm:gap-2 text-center">
        {children}
      </span>
      {icon && (
        <img
          src={icon}
          alt={iconAlt}
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      )}
    </button>
  );
}

export default Button;
