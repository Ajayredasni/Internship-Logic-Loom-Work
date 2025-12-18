// src/components/common/CustomInput.jsx
import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "react-feather";
const CustomInput = ({
  type = "text",
  name = "",
  label = "",
  placeholder = "",
  value = "",
  onChange = () => {},
  error = "",
  required = false,
  disabled = false,
  rows = 2,
  style = {},
  className = "",
  ...rest
}) => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Determine if it's a password field
  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  // Input type (convert password to text when showing)
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Base styles
  const containerStyle = {
    marginBottom: "14px",
    width: "100%",
    ...style,
  };

  const inputContainerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const baseInputStyle = {
    width: "100%",
    padding: ".375rem .75rem",
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.5,
    display: "block",
    color: "#1e293b",
    backgroundColor: disabled ? "#f8f9fa" : "#ffffff",
    border: error ? "2px solid #dc2626" : "2px solid #e2e8f0",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const inputStyle = {
    ...baseInputStyle,
    paddingRight: isPassword ? "45px" : "16px",
  };

  const textareaStyle = {
    ...baseInputStyle,
    resize: "vertical",
    minHeight: "80px",
  };

  const passwordToggleStyle = {
    position: "absolute",
    right: "12px",
    top: "40%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    transition: "color 0.2s ease",
  };

  const errorStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "6px",
    fontSize: "12px",
    color: "#dc2626",
    fontWeight: "500",
  };

  const requiredStyle = {
    color: "#dc2626",
    marginLeft: "4px",
  };

  // Handle focus styles
  const handleFocus = (e) => {
    if (!disabled && !error) {
      e.target.style.borderColor = "#2563eb";
      e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
    }
  };

  const handleBlur = (e) => {
    if (!error) {
      e.target.style.borderColor = "#e2e8f0";
      e.target.style.boxShadow = "none";
    }
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="form-label fw-semibold">
          {label}
          {required && <span style={requiredStyle}>*</span>}
        </label>
      )}

      {/* Input Container */}
      <div style={inputContainerStyle}>
        {isTextarea ? (
          /* Textarea */
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            style={textareaStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            // className="p-2"
            {...rest}
          />
        ) : (
          /* Input */
          <>
            <input
              id={name}
              name={name}
              type={inputType}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              // className="p-2"
              {...rest}
            />

            {/* Password Toggle Button */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1e293b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748b";
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={errorStyle}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
