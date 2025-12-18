// src/components/custom_component/CustomCard.jsx
import React from "react";

/**
 * CustomCard Component - Reusable card with multiple variants
 *
 * @param {ReactNode} children - Card content
 * @param {string} variant - "elevated" | "bordered" | "flat" | "gradient" (default: "elevated")
 * @param {string} padding - "none" | "sm" | "md" | "lg" | "xl" (default: "md")
 * @param {boolean} hoverable - Enable hover effect (default: false)
 * @param {function} onClick - Click handler (makes card clickable)
 * @param {string} title - Card title (optional)
 * @param {string} subtitle - Card subtitle (optional)
 * @param {ReactNode} header - Custom header content (optional)
 * @param {ReactNode} footer - Custom footer content (optional)
 * @param {object} style - Custom inline styles
 * @param {string} className - Additional CSS classes
 * @param {string} headerBg - Header background color
 * @param {string} footerBg - Footer background color
 */

const CustomCard = ({
  children,
  variant = "elevated",
  padding = "md",
  hoverable = false,
  onClick = null,
  title = "",
  subtitle = "",
  header = null,
  footer = null,
  style = {},
  className = "",
  headerBg = "#f8f9fa",
  footerBg = "#f8f9fa",
  ...rest
}) => {
  // ==================== VARIANT STYLES ====================
  const variantStyles = {
    elevated: {
      backgroundColor: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
    },
    bordered: {
      backgroundColor: "#ffffff",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow: "none",
      transition: "all 0.3s ease",
    },
    flat: {
      backgroundColor: "#ffffff",
      border: "none",
      borderRadius: "12px",
      boxShadow: "none",
      transition: "all 0.3s ease",
    },
    gradient: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
      color: "#ffffff",
      transition: "all 0.3s ease",
    },
  };

  // ==================== PADDING STYLES ====================
  const paddingStyles = {
    none: "0",
    sm: "12px",
    md: "20px",
    lg: "28px",
    xl: "36px",
  };

  // ==================== BASE STYLES ====================
  const baseStyles = {
    ...variantStyles[variant],
    padding: header || footer ? "0" : paddingStyles[padding],
    cursor: onClick ? "pointer" : "default",
    overflow: "hidden",
    ...style,
  };

  // ==================== HOVER STYLES ====================
  const hoverStyles = {
    elevated: {
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      transform: "translateY(-4px)",
    },
    bordered: {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
    },
    flat: {
      backgroundColor: "#f8f9fa",
    },
    gradient: {
      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
      transform: "translateY(-4px)",
    },
  };

  // ==================== MOUSE EVENTS ====================
  const handleMouseEnter = (e) => {
    if (hoverable || onClick) {
      Object.assign(e.currentTarget.style, hoverStyles[variant]);
    }
  };

  const handleMouseLeave = (e) => {
    if (hoverable || onClick) {
      e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow;
      e.currentTarget.style.transform = "translateY(0)";
      if (variant === "bordered") {
        e.currentTarget.style.borderColor = "#e2e8f0";
      }
      if (variant === "flat") {
        e.currentTarget.style.backgroundColor = "#ffffff";
      }
    }
  };

  // ==================== HEADER RENDER ====================
  const renderHeader = () => {
    if (header) {
      return (
        <div
          style={{
            padding: paddingStyles[padding],
            backgroundColor:
              variant === "gradient" ? "rgba(255,255,255,0.1)" : headerBg,
            borderBottom:
              variant === "gradient"
                ? "1px solid rgba(255,255,255,0.2)"
                : "1px solid #e2e8f0",
          }}
        >
          {header}
        </div>
      );
    }

    if (title || subtitle) {
      return (
        <div
          style={{
            padding: paddingStyles[padding],
            backgroundColor:
              variant === "gradient" ? "rgba(255,255,255,0.1)" : headerBg,
            borderBottom:
              variant === "gradient"
                ? "1px solid rgba(255,255,255,0.2)"
                : "1px solid #e2e8f0",
          }}
        >
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: variant === "gradient" ? "#ffffff" : "#1e293b",
                marginBottom: subtitle ? "4px" : "0",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color:
                  variant === "gradient" ? "rgba(255,255,255,0.8)" : "#64748b",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  // ==================== FOOTER RENDER ====================
  const renderFooter = () => {
    if (footer) {
      return (
        <div
          style={{
            padding: paddingStyles[padding],
            backgroundColor:
              variant === "gradient" ? "rgba(255,255,255,0.1)" : footerBg,
            borderTop:
              variant === "gradient"
                ? "1px solid rgba(255,255,255,0.2)"
                : "1px solid #e2e8f0",
          }}
        >
          {footer}
        </div>
      );
    }
    return null;
  };

  // ==================== RENDER ====================
  return (
    <div
      className={`custom-card ${className}`}
      style={baseStyles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {renderHeader()}

      <div
        style={{
          padding: header || footer ? paddingStyles[padding] : "0",
        }}
      >
        {children}
      </div>

      {renderFooter()}
    </div>
  );
};

export default CustomCard;
