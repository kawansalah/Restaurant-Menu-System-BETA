import React, { useState, forwardRef, ReactNode } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";

export interface FormInputProps {
  // Basic input props
  type?: "text" | "email" | "tel" | "number" | "password" | "textarea";
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  
  // Validation and state
  error?: string;
  disabled?: boolean;
  required?: boolean;
  
  // Styling and customization
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
  
  // Textarea specific
  rows?: number;
  resize?: boolean;
  
  // RTL support
  direction?: "ltr" | "rtl";
  
  // Custom styling
  className?: string;
  containerClassName?: string;
  
  // Accessibility
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  (
    {
      type = "text",
      placeholder,
      value = "",
      onChange,
      onFocus,
      onBlur,
      error,
      disabled = false,
      required = false,
      icon,
      iconPosition = "left",
      variant = "default",
      size = "md",
      rows = 4,
      resize = false,
      direction = "ltr",
      className = "",
      containerClassName = "",
      id,
      name,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const theme = useThemeClasses();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    // Validation function for number and tel inputs
    const validateInput = (inputValue: string): string => {
      if (type === "number") {
        // Remove any non-digit characters and prevent negative numbers
        const cleanValue = inputValue.replace(/[^0-9.]/g, "");
        // Ensure only one decimal point
        const parts = cleanValue.split(".");
        if (parts.length > 2) {
          return parts[0] + "." + parts.slice(1).join("");
        }
        return cleanValue;
      }
      
      if (type === "tel") {
        // Remove any non-digit characters (allow only numbers for tel)
        return inputValue.replace(/[^0-9]/g, "");
      }
      
      return inputValue;
    };

    // Handle key press to prevent invalid characters
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (type === "number") {
        // Allow: backspace, delete, tab, escape, enter, decimal point
        if ([8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
          return;
        }
        // Prevent: letters, negative sign, and other special characters
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      }
      
      if (type === "tel") {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
          return;
        }
        // Prevent: letters and special characters, allow only numbers
        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let newValue = e.target.value;
      
      // Apply validation for number and tel inputs
      if (type === "number" || type === "tel") {
        newValue = validateInput(newValue);
      }
      
      onChange?.(newValue);
    };

    // Handle paste events to validate pasted content
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (type === "number" || type === "tel") {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const validatedText = validateInput(pastedText);
        
        // Create a synthetic event to trigger onChange with validated text
        const syntheticEvent = {
          target: { value: validatedText }
        } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
        
        handleChange(syntheticEvent);
      }
    };

    // Size classes
    const sizeClasses = {
      sm: "p-3 text-sm",
      md: "p-4 text-base",
      lg: "p-5 text-lg",
    };

    // Simple variant classes
    const getVariantClasses = () => {
      const baseClasses = "rounded-2xl border-2 transition-colors duration-200";
      
      if (error) {
        return `${baseClasses} border-[#fa7072] ${theme.isDark ? "bg-[#393939]" : "bg-[#F4F4F4]"}`;
      }
      
      if (isFocused) {
        return `${baseClasses} border-[#FDBB2A] ${theme.isDark ? "bg-[#444444]" : "bg-[#FAFAFA]"}`;
      }
      
      return `${baseClasses} ${theme.isDark ? "bg-[#393939] border-[#555555]" : "bg-[#F4F4F4] border-[#EBEBEB]"}`;
    };

    // Simple input classes
    const inputClasses = `
      w-full h-full bg-transparent outline-none ${theme.text} 
      placeholder:${theme.isDark ? "text-[#888888]" : "text-[#999999]"}
      ${disabled ? "cursor-not-allowed opacity-50" : ""}
      ${className}
    `;

    // Simple container classes
    const containerClasses = `
      flex items-${type === "textarea" ? "start" : "center"} gap-3 
      ${sizeClasses[size]} ${getVariantClasses()}
      ${disabled ? "cursor-not-allowed opacity-60" : ""}
      ${containerClassName}
    `;

    const renderInput = () => {
      const baseProps = {
        value,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyPress,
        onPaste: handlePaste,
        disabled,
        required,
        id,
        name,
        "aria-label": ariaLabel,
        "aria-describedby": ariaDescribedBy,
        className: inputClasses,
        placeholder,
      };

      if (type === "textarea") {
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            style={{
              direction,
              resize: resize ? "vertical" : "none",
            }}
            {...baseProps}
          />
        );
      }

      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          style={{ direction }}
          {...baseProps}
        />
      );
    };

    return (
      <div className="relative">
        {/* Input Container */}
        <div className={containerClasses}>
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <div
              className={`
                flex-shrink-0 transition-colors duration-200
                ${isFocused ? "text-[#FDBB2A]" : theme.text}
                ${type === "textarea" ? "mt-1" : ""}
              `}
            >
              {icon}
            </div>
          )}

          {/* Input/Textarea */}
          {renderInput()}

          {/* Right Icon */}
          {icon && iconPosition === "right" && (
            <div
              className={`
                flex-shrink-0 transition-colors duration-200
                ${isFocused ? "text-[#FDBB2A]" : theme.text}
                ${type === "textarea" ? "mt-1" : ""}
              `}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 text-sm text-[#fa7072] px-3" id={ariaDescribedBy}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;