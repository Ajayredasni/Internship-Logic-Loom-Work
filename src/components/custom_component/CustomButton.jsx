// src/components/custom_component/CustomButton.jsx
import React from "react";
import { Loader } from "react-feather";

/**
 * CustomButton Component - Reusable button with variants, icons, loading states
 *
 * @param {string} variant - "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {ReactNode} icon - Icon component (from react-feather)
 * @param {string} iconPosition - "left" | "right"
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} disabled - Disable button
 * @param {boolean} fullWidth - Full width button
 * @param {boolean} outline - Outline variant
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button text/content
 * @param {string} type - "button" | "submit" | "reset"
 * @param {object} style - Custom inline styles
 * @param {string} className - Additional CSS classes
 */

const CustomButton = ({
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  outline = false,
  onClick = () => {},
  children,
  type = "button",
  style = {},
  className = "",
  ...rest
}) => {
  // ==================== VARIANT COLORS ====================
  const variantStyles = {
    primary: {
      bg: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      hoverBg: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
      hoverShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
    },
    secondary: {
      bg: "#64748b",
      hoverBg: "#475569",
      color: "#ffffff",
      border: "none",
      shadow: "0 2px 8px rgba(100, 116, 139, 0.2)",
      hoverShadow: "0 4px 12px rgba(100, 116, 139, 0.3)",
    },
    success: {
      bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      hoverBg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
      hoverShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
    },
    danger: {
      bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      hoverBg: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "0 2px 8px rgba(239, 68, 68, 0.25)",
      hoverShadow: "0 4px 12px rgba(239, 68, 68, 0.35)",
    },
    warning: {
      bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      hoverBg: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "0 2px 8px rgba(245, 158, 11, 0.25)",
      hoverShadow: "0 4px 12px rgba(245, 158, 11, 0.35)",
    },
    info: {
      bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      hoverBg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "0 2px 8px rgba(59, 130, 246, 0.25)",
      hoverShadow: "0 4px 12px rgba(59, 130, 246, 0.35)",
    },
    light: {
      bg: "#f8f9fa",
      hoverBg: "#e9ecef",
      color: "#1e293b",
      border: "1px solid #e2e8f0",
      shadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      hoverShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
    },
    dark: {
      bg: "#1e293b",
      hoverBg: "#0f172a",
      color: "#ffffff",
      border: "none",
      shadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
  };

  // ==================== OUTLINE VARIANT ====================
  const outlineStyles = {
    primary: {
      bg: "transparent",
      hoverBg: "#eff6ff",
      color: "#2563eb",
      border: "2px solid #2563eb",
      shadow: "none",
      hoverShadow: "0 2px 8px rgba(37, 99, 235, 0.15)",
    },
    secondary: {
      bg: "transparent",
      hoverBg: "#f8fafc",
      color: "#64748b",
      border: "2px solid #64748b",
      shadow: "none",
      hoverShadow: "0 2px 8px rgba(100, 116, 139, 0.15)",
    },
    success: {
      bg: "transparent",
      hoverBg: "#f0fdf4",
      color: "#10b981",
      border: "2px solid #10b981",
      shadow: "none",
      hoverShadow: "0 2px 8px rgba(16, 185, 129, 0.15)",
    },
    danger: {
      bg: "transparent",
      hoverBg: "#fef2f2",
      color: "#ef4444",
      border: "2px solid #ef4444",
      shadow: "none",
      hoverShadow: "0 2px 8px rgba(239, 68, 68, 0.15)",
    },
    warning: {
      bg: "transparent",
      hoverBg: "#fffbeb",
      color: "#f59e0b",
      border: "2px solid #f59e0b",
      shadow: "none",
      hoverShadow: "0 2px 8px rgba(245, 158, 11, 0.15)",
    },
    info: {
      bg: "transparent",
      hoverBg: "#eff6ff",
      color: "#3b82f6",
      border: "2px solid #3b82f6",
      shadow: "none",
      hoverShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
    },
    light: {
      bg: "transparent",
      hoverBg: "#f8f9fa",
      color: "#64748b",
      border: "2px solid #e2e8f0",
      shadow: "none",
      hoverShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    dark: {
      bg: "transparent",
      hoverBg: "#f8fafc",
      color: "#1e293b",
      border: "2px solid #1e293b",
      shadow: "none",
      hoverShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
  };

  // ==================== SIZE STYLES ====================
  const sizeStyles = {
    sm: {
      padding: "6px 14px",
      fontSize: "13px",
      iconSize: 14,
      gap: "6px",
    },
    md: {
      padding: "10px 20px",
      fontSize: "14px",
      iconSize: 16,
      gap: "8px",
    },
    lg: {
      padding: "14px 28px",
      fontSize: "16px",
      iconSize: 18,
      gap: "10px",
    },
  };

  // ==================== GET CURRENT STYLES ====================
  const currentVariant = outline
    ? outlineStyles[variant]
    : variantStyles[variant];
  const currentSize = sizeStyles[size];

  // ==================== BASE STYLES ====================
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: currentSize.gap,
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    fontWeight: "500",
    fontFamily: "inherit",
    lineHeight: "1.5",
    borderRadius: "8px",
    border: currentVariant.border,
    background: disabled
      ? "#e5e7eb"
      : loading
      ? currentVariant.bg
      : currentVariant.bg,
    color: disabled ? "#9ca3af" : currentVariant.color,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    boxShadow: disabled ? "none" : currentVariant.shadow,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : "auto",
    textDecoration: "none",
    userSelect: "none",
    ...style,
  };

  // ==================== MOUSE EVENTS ====================
  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.background = currentVariant.hoverBg;
      e.currentTarget.style.boxShadow = currentVariant.hoverShadow;
      e.currentTarget.style.transform = "translateY(-2px)";
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.background = currentVariant.bg;
      e.currentTarget.style.boxShadow = currentVariant.shadow;
      e.currentTarget.style.transform = "translateY(0)";
    }
  };

  const handleMouseDown = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = "translateY(0)";
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = "translateY(-2px)";
    }
  };

  // ==================== RENDER ICON ====================
  const renderIcon = () => {
    if (loading) {
      return (
        <Loader
          size={currentSize.iconSize}
          style={{
            animation: "spin 1s linear infinite",
          }}
        />
      );
    }
    if (icon) {
      return React.cloneElement(icon, { size: currentSize.iconSize });
    }
    return null;
  };

  // ==================== RENDER ====================
  return (
    <>
      <button
        type={type}
        onClick={disabled || loading ? undefined : onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={disabled || loading}
        className={`custom-button ${className}`}
        style={baseStyles}
        {...rest}
      >
        {/* Icon Left */}
        {iconPosition === "left" && renderIcon()}

        {/* Button Text */}
        {children && <span>{children}</span>}

        {/* Icon Right */}
        {iconPosition === "right" && !loading && renderIcon()}
      </button>

      {/* CSS for Loading Animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default CustomButton;
