import languageIcon from "@/assets/icons/language.svg";
import { useThemeClasses } from "@/hooks/useThemeClasses";
interface MenuItem {
  code: string;
  label: string;
  isSelected: boolean;
}

interface MenuButtonProps {
  item: MenuItem;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function MenuButton({
  item,
  onClick,
  type = "button",
  onMouseEnter,
  onMouseLeave,
}: MenuButtonProps) {
  const theme = useThemeClasses();

  // Determine icon filter based on theme and selection state
  const getIconStyle = () => {
    if (item.isSelected) {
      // Selected button - always white text/icon
      return { filter: "brightness(0) invert(1)" };
    } else {
      // Unselected button - different colors based on theme
      if (theme.isLight) {
        // Light mode unselected: #4B4B4B (dark gray) - approximately 29% brightness
        return { filter: "brightness(0) invert(0.29)" };
      } else {
        // Dark mode unselected: white
        return { filter: "brightness(0) invert(1)" };
      }
    }
  };

  // Get inline styles based on selection state
  const getInlineStyles = () => {
    if (item.isSelected) {
      return {
        backgroundColor: "var(--bg-main)",
        color: "var(--button-text-primary)",
        boxShadow: " var(--button-shadow-primary)",
        border: "none",
      };
    } else {
      return {
        backgroundColor: theme.isLight ? "#f5f5f5" : "#4B4B4B",
        color: "var(--button-text-secondary)",
        boxShadow: " var(--button-shadow-secondary)",
        border: "none",
      };
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Enhanced hover effect based on selection state
    if (item.isSelected) {
      e.currentTarget.style.boxShadow = " var(--button-shadow-primary-hover)";
    } else {
      e.currentTarget.style.boxShadow = " var(--button-shadow-secondary-hover)";
    }
    e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";

    // Call custom onMouseEnter if provided
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Reset to default styling based on selection state
    if (item.isSelected) {
      e.currentTarget.style.boxShadow = " var(--button-shadow-primary)";
    } else {
      e.currentTarget.style.boxShadow = " var(--button-shadow-secondary)";
    }
    e.currentTarget.style.transform = "translateY(0) scale(1)";

    // Call custom onMouseLeave if provided
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center justify-between w-full py-[18px] px-5 rounded-3xl text-xl font-bold transform transition-all duration-300 cursor-pointer outline-none focus:outline-none"
      style={getInlineStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex-1 text-center">{item.label}</span>
      <img
        src={languageIcon}
        alt="language"
        className="w-6 h-6 ml-2"
        style={getIconStyle()}
      />
    </button>
  );
}

export default MenuButton;
