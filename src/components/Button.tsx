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
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center w-full transition-all ease-in-out duration-200 cursor-pointer border-none outline-none focus:outline-none rounded-full font-bold " +
    "py-4 px-4 text-base sm:py-4 sm:px-5 sm:text-lg md:py-[18px] md:px-6 md:text-xl lg:py-5 lg:px-7 lg:text-xl xl:py-[18px] xl:px-5 xl:text-xl";
  
  const variantStyles = {
    primary: `${baseStyles} bg-main text-white shadow-[0px_4px_0px_0px_#A27F37] sm:shadow-[0px_5px_0px_0px_#A27F37] md:shadow-[0px_6px_0px_0px_#A27F37] hover:translate-y-[1px] sm:hover:translate-y-[1.5px] md:hover:translate-y-[2px] hover:shadow-[0px_2px_0px_0px_#A27F37] sm:hover:shadow-[0px_2.5px_0px_0px_#A27F37] md:hover:shadow-[0px_3px_0px_0px_#A27F37] active:translate-y-[3px] sm:active:translate-y-[4px] md:active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#e6bb00] gap-2`,
    secondary: `${baseStyles} bg-[#4B4B4B] text-white shadow-[0px_4px_0px_0px_#373737] sm:shadow-[0px_5px_0px_0px_#373737] md:shadow-[0px_6px_0px_0px_#373737] hover:translate-y-[1px] sm:hover:translate-y-[1.5px] md:hover:translate-y-[2px] hover:shadow-[0px_2px_0px_0px_#373737] sm:hover:shadow-[0px_2.5px_0px_0px_#373737] md:hover:shadow-[0px_3px_0px_0px_#373737] active:translate-y-[3px] sm:active:translate-y-[4px] md:active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#2c2c2c] gap-2`,
    adminpanel:
      "flex items-center justify-center w-full transition-all ease-in-out duration-200 cursor-pointer border-none outline-none focus:outline-none rounded-full font-bold " +
      "py-2 px-4 text-sm sm:py-2 sm:px-6 sm:text-base md:py-2 md:px-8 md:text-base lg:py-2 lg:px-10 lg:text-lg " +
      "bg-main text-white shadow-[0px_3px_0px_0px_#A27F37] sm:shadow-[0px_4px_0px_0px_#A27F37] md:shadow-[0px_5px_0px_0px_#A27F37] " +
      "hover:translate-y-[1px] sm:hover:translate-y-[1.5px] md:hover:translate-y-[1.5px] " +
      "hover:shadow-[0px_1.5px_0px_0px_#A27F37] sm:hover:shadow-[0px_2px_0px_0px_#A27F37] md:hover:shadow-[0px_2.5px_0px_0px_#A27F37] " +
      "active:translate-y-[3px] sm:active:translate-y-[4px] md:active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#e6bb00]",
    delete: `${baseStyles} bg-red-500 text-white shadow-[0px_4px_0px_0px_#D9534F] sm:shadow-[0px_5px_0px_0px_#D9534F] md:shadow-[0px_6px_0px_0px_#D9534F] hover:translate-y-[1px] sm:hover:translate-y-[1.5px] md:hover:translate-y-[2px] hover:shadow-[0px_2px_0px_0px_#D9534F] sm:hover:shadow-[0px_2.5px_0px_0px_#D9534F] md:hover:shadow-[0px_3px_0px_0px_#D9534F] active:translate-y-[3px] sm:active:translate-y-[4px] md:active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#C9302C] gap-2`,
  };

  const disabledStyles =
    variant === "primary"
      ? `${baseStyles} opacity-50 cursor-not-allowed bg-main text-white shadow-[0px_4px_0px_0px_#A27F37] sm:shadow-[0px_5px_0px_0px_#A27F37] md:shadow-[0px_6px_0px_0px_#A27F37] gap-2`
      : `${baseStyles} opacity-50 cursor-not-allowed bg-[#4B4B4B] text-white shadow-[0px_4px_0px_0px_#373737] sm:shadow-[0px_5px_0px_0px_#373737] md:shadow-[0px_6px_0px_0px_#373737] gap-2`;
  
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${className} ${disabled ? disabledStyles : variantStyles[variant]}`}
      style={style}
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
