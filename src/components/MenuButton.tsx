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
}

function MenuButton({ item, onClick, type = "button" }: MenuButtonProps) {
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
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-between w-full py-[18px] px-5 rounded-[40px] text-xl font-bold transition-all ease-in-out duration-200 cursor-pointer outline-none focus:outline-none border-1 ${
        item.isSelected
          ? `${theme.bgMain} ${theme.buttonTextPrimary} ${theme.buttonShadowPrimary} hover:translate-y-[2px] ${theme.buttonShadowPrimaryHover} active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#e6bb00] border-none`
          : `${theme.bgSecondary} ${theme.buttonTextSecondary} ${theme.buttonShadowSecondary} hover:translate-y-[2px] ${theme.buttonShadowSecondaryHover} active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#2c2c2c] ${theme.isLight? theme.borderLightButton  : "border-none"}`
      }`}
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