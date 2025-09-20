import React, {
  useState,
  forwardRef,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import {
  Eye,
  EyeOff,
  ChevronDown,
  Upload,
  X,
  Calendar,
  Clock,
  Search,
  Phone,
  Mail,
  User,
  Lock,
  Hash,
  Globe,
  FileText,
  Image as ImageIcon,
  File,
  Check,
  AlertCircle,
} from "lucide-react";

// Configuration constants
const DESIGN_CONFIG = {
  colors: {
    primary: "var(--bg-main)",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  },
  animations: {
    duration: "200ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  spacing: {
    sm: { padding: "0.75rem 1rem", height: "2.5rem", text: "0.875rem" },
    md: { padding: "1rem 1.25rem", height: "3rem", text: "1rem" },
    lg: { padding: "1.25rem 1.5rem", height: "3.5rem", text: "1.125rem" },
  },
  borderRadius: {
    input: "0.75rem",
    textarea: "1rem",
    dropdown: "0.75rem",
  },
} as const;

export interface InputProps {
  // Basic input props
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "search"
    | "url"
    | "dropdown"
    | "textarea"
    | "file"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "range"
    | "color"
    | "checkbox"
    | "radio"
    | "hidden";

  // Dropdown and select options
  options?: { value: string; label: string; icon?: ReactNode }[];
  onSelect?: (value: string) => void;

  // Basic props
  placeholder?: string;
  value?: string | number | boolean;
  onChange?: (value: string | number | boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;

  // File upload specific
  accept?: string;
  multiple?: boolean;
  onFileChange?: (files: FileList | null) => void;

  // Range specific
  min?: number;
  max?: number;
  step?: number;

  // Textarea specific
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";

  // Checkbox/Radio specific
  checked?: boolean;
  label?: string;

  // Validation and state
  error?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;

  // Styling and customization
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outlined";

  // Custom styling
  className?: string;
  containerClassName?: string;

  // Accessibility
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      error,
      success = false,
      disabled = false,
      required = false,
      icon,
      iconPosition = "left",
      size = "md",
      variant = "default",
      className = "",
      containerClassName = "",
      id,
      name,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      options,
      onSelect,
      accept,
      multiple,
      onFileChange,
      min,
      max,
      step,
      rows = 4,
      cols,
      resize = "vertical",
      checked,
      label,
      ...props
    },
    ref
  ) => {
    const theme = useThemeClasses();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
      "bottom"
    );
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isDropdownOpen]);

    // Calculate dropdown position based on available space
    const calculateDropdownPosition = () => {
      if (!dropdownRef.current || !options) return;

      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate dropdown height more accurately
      const optionHeight = 60; // Height per option (py-3 + gap)
      const containerPadding = 32; // py-2 + padding
      const maxVisibleOptions = 6; // Maximum options to show without scrolling
      const maxDropdownHeight = Math.min(
        options.length * optionHeight + containerPadding,
        maxVisibleOptions * optionHeight + containerPadding
      );

      const spaceBelow = viewportHeight - rect.bottom - 20; // 20px buffer
      const spaceAbove = rect.top - 20; // 20px buffer

      // If there's not enough space below but enough space above, position dropdown on top
      if (spaceBelow < maxDropdownHeight && spaceAbove > maxDropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    };

    // Update dropdown position when it opens
    useEffect(() => {
      if (isDropdownOpen && type === "dropdown") {
        // Use setTimeout to ensure DOM is updated
        setTimeout(calculateDropdownPosition, 0);

        // Add resize listener to recalculate position
        const handleResize = () => {
          calculateDropdownPosition();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }
    }, [isDropdownOpen, type, options]);

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (type === "checkbox") {
        onChange?.((e.target as HTMLInputElement).checked);
      } else if (type === "number" || type === "range") {
        onChange?.(Number(e.target.value));
      } else {
        onChange?.(e.target.value);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        setSelectedFiles(Array.from(files));
        onFileChange?.(files);
      }
    };

    const removeFile = (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);

      const dt = new DataTransfer();
      newFiles.forEach((file) => dt.items.add(file));

      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
        onFileChange?.(dt.files);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleDropdownSelect = (selectedValue: string) => {
      onSelect?.(selectedValue);
      onChange?.(selectedValue);
      setIsDropdownOpen(false);
    };

    // Get appropriate icon based on input type
    const getDefaultIcon = () => {
      const iconMap = {
        email: <Mail className="w-5 h-5" />,
        password: <Lock className="w-5 h-5" />,
        tel: <Phone className="w-5 h-5" />,
        search: <Search className="w-5 h-5" />,
        url: <Globe className="w-5 h-5" />,
        number: <Hash className="w-5 h-5" />,
        date: <Calendar className="w-5 h-5" />,
        time: <Clock className="w-5 h-5" />,
        "datetime-local": <Calendar className="w-5 h-5" />,
        file: <Upload className="w-5 h-5" />,
        textarea: <FileText className="w-5 h-5" />,
      };
      return (
        iconMap[type as keyof typeof iconMap] ||
        icon || <User className="w-5 h-5" />
      );
    };

    // Determine the actual input type
    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    // Check if we should show the password toggle
    const isPasswordField = type === "password";
    const hasRightIcon = icon && iconPosition === "right";
    const shouldShowPasswordToggle = isPasswordField && !hasRightIcon;

    // Get size configuration
    const sizeConfig = DESIGN_CONFIG.spacing[size];

    // Professional variant classes using theme system
    const getVariantClasses = () => {
      const baseRadius =
        type === "textarea" || type === "file"
          ? DESIGN_CONFIG.borderRadius.textarea
          : DESIGN_CONFIG.borderRadius.input;

      const baseClasses = `
        border transition-all duration-200 ease-in-out
        focus-within:ring-2
      `;
      
      // Apply the correct border radius based on type
      const radiusClass = type === "textarea" || type === "file" 
        ? "rounded-2xl" 
        : "rounded-full";

      if (error) {
        return `${baseClasses} ${radiusClass} border-red-500 focus-within:ring-red-500 ${theme.bgCard}`;
      }

      if (success) {
        return `${baseClasses} ${radiusClass} border-green-500 focus-within:ring-green-500 ${theme.inputBackground}`;
      }

      if (isFocused) {
        return `${baseClasses} ${radiusClass} border-[var(--bg-main)] focus-within:ring-[var(--bg-main)] ${theme.inputBackground}`;
      }

      switch (variant) {
        case "filled":
          return `${baseClasses} ${radiusClass} ${theme.bgSecondary} ${theme.border} hover:${theme.borderCategory}`;
        case "outlined":
          return `${baseClasses} ${radiusClass} bg-transparent ${theme.border} hover:${theme.borderCategory}`;
        default:
          return `${baseClasses} ${radiusClass} ${theme.inputBackground} ${theme.border} hover:${theme.borderCategory}`;
      }
    };

    // Clean input classes using theme
    const inputClasses = `
      w-full bg-transparent outline-none resize-none
      ${theme.isDark ? theme.textSecondary : theme.textPrimary} 
      placeholder:${theme.textSecondary}
      ${disabled ? "cursor-not-allowed opacity-50" : ""}
      ${className}
    `;

    // Container classes with proper spacing
    const containerClasses = `
      flex items-center gap-3 relative
      px-4 py-4
      min-h-[3rem]
      ${getVariantClasses()}
      ${disabled ? "cursor-not-allowed opacity-60" : ""}
      ${containerClassName}
    `;

    // Icon styling with animations
    const iconClasses = `
      flex-shrink-0 transition-all duration-200
      ${
        isFocused
          ? error
            ? "text-red-500"
            : success
            ? "text-green-500"
            : "text-[var(--bg-main)]"
          : theme.textSecondary
      }
      ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}
    `;

    // Password toggle button styling
    const passwordToggleClasses = `
      flex-shrink-0 transition-all duration-200 
      cursor-pointer hover:opacity-70 hover:scale-110
      ${isFocused ? "text-[var(--bg-main)]" : theme.textSecondary}
      ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}
    `;

    // Determine if this should be controlled or uncontrolled
    const isControlled = value !== undefined;

    // Handle value prop based on input type
    const getInputValue = () => {
      if (type === "checkbox" || type === "radio") {
        return undefined;
      }
      if (typeof value === "boolean") {
        return String(value);
      }
      return value || "";
    };

    const inputProps = isControlled
      ? { value: getInputValue() }
      : { defaultValue: getInputValue() };

    // Checkbox/Radio specific rendering
    if (type === "checkbox" || type === "radio") {
      return (
        <div className={`flex items-center gap-3 ${containerClassName}`}>
          <div className="relative group">
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              checked={checked}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              id={id}
              name={name}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              className="sr-only"
              {...props}
            />
            <div
              className={`
                w-5 h-5 border-2 transition-all duration-200 cursor-pointer
                group-hover:scale-110 transform
                ${type === "checkbox" ? "rounded-md" : "rounded-full"}
                ${
                  checked
                    ? "border-[var(--bg-main)] bg-[var(--bg-main)]"
                    : `${theme.border} ${theme.inputBackground} hover:border-[var(--bg-main)]`
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${error ? "border-red-500" : ""}
              `}
              onClick={() => !disabled && onChange?.(!checked)}
            >
              {checked && type === "checkbox" && (
                <Check className="w-3 h-3 text-white m-auto animate-scale-in" />
              )}
              {checked && type === "radio" && (
                <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5 animate-scale-in" />
              )}
            </div>
          </div>
          {label && (
            <label
              htmlFor={id}
              className={`${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } cursor-pointer transition-colors duration-200 ${
                disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
              }`}
            >
              {label}
            </label>
          )}
          {error && (
            <div
              className="text-sm text-red-500 flex items-center gap-1"
              id={ariaDescribedBy}
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      );
    }

    // Range slider specific rendering
    if (type === "range") {
      return (
        <div className={`w-full ${containerClassName}`}>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${theme.textSecondary} font-medium`}>
              {min}
            </span>
            <div className="flex-1 relative">
              <input
                ref={ref as React.Ref<HTMLInputElement>}
                type="range"
                min={min}
                max={max}
                step={step}
                value={typeof value === "number" ? value : 0}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                required={required}
                id={id}
                name={name}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                className={`
                  w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-200
                  ${theme.inputBackground} 
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-5 
                  [&::-webkit-slider-thumb]:h-5 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-[var(--bg-main)]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-5 
                  [&::-moz-range-thumb]:h-5 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-[var(--bg-main)]
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:border-none
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${className}
                `}
                {...props}
              />
              <div
                className={`text-center mt-2 text-sm font-semibold ${
                  theme.isDark ? theme.textSecondary : theme.textPrimary
                }`}
              >
                {value}
              </div>
            </div>
            <span className={`text-sm ${theme.textSecondary} font-medium`}>
              {max}
            </span>
          </div>
          {error && (
            <div
              className="mt-2 text-sm text-red-500 flex items-center gap-1"
              id={ariaDescribedBy}
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      );
    }

    // File upload specific rendering
    if (type === "file") {
      return (
        <div className={`w-full ${containerClassName}`}>
          <div
            className={`
              border-2 border-dashed rounded-xl p-6 text-center 
              transition-all duration-200 group
              ${
                isFocused || isDropdownOpen
                  ? "border-[var(--bg-main)] bg-[var(--bg-main)]/5"
                  : `${theme.border} ${theme.inputBackground}`
              }
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-[var(--bg-main)] hover:bg-[var(--bg-main)]/5 hover:scale-[1.02]"
              }
              ${error ? "border-red-500" : ""}
            `}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              id={id}
              name={name}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              className="hidden"
              {...props}
            />

            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-3 rounded-full ${theme.bgSecondary} group-hover:scale-110 transition-transform duration-200`}
              >
                <Upload className={`w-6 h-6 ${theme.textSecondary}`} />
              </div>
              <div>
                <p
                  className={`font-medium ${
                    theme.isDark ? theme.textSecondary : theme.textPrimary
                  }`}
                >
                  {placeholder || "Click to upload files"}
                </p>
                <p className={`text-sm ${theme.textSecondary} mt-1`}>
                  {accept
                    ? `Supported formats: ${accept}`
                    : "All file types supported"}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${theme.bgSecondary} ${theme.border} 
                    hover:${theme.bgSearchBar} transition-all duration-200 group`}
                >
                  <div className={`p-2 rounded ${theme.bgCard}`}>
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className={`w-4 h-4 ${theme.textSecondary}`} />
                    ) : (
                      <File className={`w-4 h-4 ${theme.textSecondary}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        theme.isDark ? theme.textSecondary : theme.textPrimary
                      } truncate`}
                    >
                      {file.name}
                    </p>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className={`p-1 rounded-full hover:${theme.bgSearchBar} ${theme.textSecondary} 
                      hover:text-red-500 transition-all duration-200
                      hover:scale-110 opacity-0 group-hover:opacity-100`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div
              className="mt-2 text-sm text-red-500 flex items-center gap-1"
              id={ariaDescribedBy}
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      );
    }

    // Textarea specific rendering
    if (type === "textarea") {
      return (
        <div className="w-full relative">
          <div
            className={containerClasses.replace("items-center", "items-start")}
          >
            {/* Left Icon */}
            {(icon || getDefaultIcon()) && iconPosition === "left" && (
              <div className={`${iconClasses} mt-1`}>
                {icon || getDefaultIcon()}
              </div>
            )}

            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...inputProps}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              id={id}
              name={name}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              className={`${inputClasses} resize-${resize} min-h-[100px]`}
              placeholder={placeholder}
              rows={rows}
              cols={cols}
              {...props}
            />

            {/* Right Icon */}
            {(icon || getDefaultIcon()) && iconPosition === "right" && (
              <div className={`${iconClasses} mt-1`}>
                {icon || getDefaultIcon()}
              </div>
            )}
          </div>

          {error && (
            <div
              className="mt-2 text-sm text-red-500 px-1 flex items-center gap-1"
              id={ariaDescribedBy}
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      );
    }

    // Default input rendering (text, email, password, number, etc.)
    return (
      <div className="w-full relative" ref={dropdownRef}>
        {/* Input Container */}
        <div
          className={`${containerClasses} ${
            type === "dropdown" ? "cursor-pointer select-none" : ""
          }`}
          onClick={() =>
            type === "dropdown" &&
            !disabled &&
            setIsDropdownOpen(!isDropdownOpen)
          }
        >
          {/* Left Icon */}
          {(icon || (iconPosition === "left" && getDefaultIcon())) &&
            iconPosition === "left" && (
              <div className={iconClasses}>{icon || getDefaultIcon()}</div>
            )}

          {/* Input or Display for Dropdown */}
          {type === "dropdown" ? (
            <div
              className={`w-full bg-transparent outline-none cursor-pointer ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } ${className}`}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              role="combobox"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              {options?.find((option) => option.value === value)?.label ||
                placeholder}
            </div>
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={inputType === "dropdown" ? "text" : inputType}
              {...inputProps}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              id={id}
              name={name}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              className={inputClasses}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              {...props}
            />
          )}

          {/* Password Toggle Button or Dropdown Indicator */}
          {shouldShowPasswordToggle ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={passwordToggleClasses}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          ) : type === "dropdown" ? (
            <ChevronDown
              className={`w-4 h-4 ${
                theme.textSecondary
              } transition-all duration-200 ${
                isDropdownOpen
                  ? dropdownPosition === "top"
                    ? "rotate-0 text-[var(--bg-main)]"
                    : "rotate-180 text-[var(--bg-main)]"
                  : ""
              }`}
            />
          ) : null}

          {/* Right Icon */}
          {(icon || (iconPosition === "right" && getDefaultIcon())) &&
            iconPosition === "right" &&
            !shouldShowPasswordToggle && (
              <div className={iconClasses}>{icon || getDefaultIcon()}</div>
            )}
        </div>

        {/* Custom Dropdown Options */}
        {type === "dropdown" && isDropdownOpen && options && (
          <div
            className={`
              absolute ${
                dropdownPosition === "top"
                  ? "bottom-full mb-2"
                  : "top-full mt-2"
              } 
              min-w-full rounded-2xl overflow-hidden
              ${theme.bgCard} border ${theme.borderLanguage}
              z-[999] px-2
            `}
            style={{
              boxShadow: "var(--shadow)",
              maxHeight: `${Math.min(options.length * 60 + 32, 6 * 60 + 32)}px`,
              minWidth: "100%",
            }}
          >
            <div
              className="py-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar max-h-[300px]"
              role="listbox"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDropdownSelect(option.value)}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200
                    ${theme.languageHover}
                    ${value === option.value ? theme.bgLanguage : ""}
                    text-left rounded-xl flex-shrink-0
                  `}
                  role="option"
                  aria-selected={value === option.value}
                  tabIndex={0}
                >
                  {option.icon && (
                    <span className="text-lg flex-shrink-0">{option.icon}</span>
                  )}
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        theme.isDark ? theme.textSecondary : theme.textPrimary
                      }`}
                    >
                      {option.label}
                    </div>
                  </div>
                  {value === option.value && (
                    <div className={`w-2 h-2 rounded-full ${theme.bgMain}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mt-2 text-sm text-red-500 px-1 flex items-center gap-1 animate-fade-in"
            id={ariaDescribedBy}
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && !error && (
          <div className="mt-2 text-sm text-green-500 px-1 flex items-center gap-1 animate-fade-in">
            <Check className="w-4 h-4" />
            Input is valid
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
