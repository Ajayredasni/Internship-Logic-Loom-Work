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
 * @param {boolean} fullWidth - Full width button 100% width
 * @param {boolean} outline - Outline variant border button
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
  // ==================== SIZE MAPPING ====================
  const bootstrapSize = {
    sm: "btn-sm", // Bootstrap class for small button
    md: "", // Bootstrap default size (no class needed)
    lg: "btn-lg", // Bootstrap class for large button
  };

  const iconSizes = {
    sm: 14, // Icon size in pixels for small
    md: 16, // Icon size in pixels for medium
    lg: 18, // Icon size in pixels for large
  };

  const gapSizes = {
    sm: "gap-1", // Bootstrap gap class for small (0.25rem)
    md: "gap-2", // Bootstrap gap class for medium (0.5rem)
    lg: "gap-2", // Bootstrap gap class for large (0.5rem)
  };

  // ==================== BUILD BOOTSTRAP CLASSES ====================
  const buttonClasses = [
    "btn", // Bootstrap: Base button class
    "custom-btn", // Custom: For our custom styling
    `custom-btn-${variant}`, // Custom: For color variants
    outline ? "custom-btn-outline" : "", // Custom: For outline style
    bootstrapSize[size], // Bootstrap: Size class (btn-sm, btn-lg)
    fullWidth ? "w-100" : "", // Bootstrap: Full width class
    "d-inline-flex", // Bootstrap: Display inline-flex
    "align-items-center", // Bootstrap: Vertical center alignment
    "justify-content-center", // Bootstrap: Horizontal center alignment
    gapSizes[size], // Bootstrap: Gap between icon and text
    "text-decoration-none", // Bootstrap: Remove underline
    "user-select-none", // Bootstrap: Prevent text selection
    "fw-medium", // Bootstrap: Font weight medium (500)
    "rounded-2", // Bootstrap: Border radius
    className, // User's custom classes
  ]
    .filter(Boolean)
    .join(" ");

  // ==================== RENDER ICON ====================
  const renderIcon = () => {
    if (loading) {
      return <Loader size={iconSizes[size]} className="spinner-icon" />;
    }
    if (icon) {
      return React.cloneElement(icon, { size: iconSizes[size] });
    }
    return null;
  };

  // ==================== RENDER ====================
  return (
    <>
      <button
        type={type}
        onClick={disabled || loading ? undefined : onClick}
        disabled={disabled || loading}
        className={buttonClasses}
        style={style}
        {...rest}
      >
        {/* Icon Left */}
        {iconPosition === "left" && renderIcon()}

        {/* Button Text */}
        {children && <span>{children}</span>}

        {/* Icon Right */}
        {iconPosition === "right" && !loading && renderIcon()}
      </button>

      {/* ==================== CUSTOM CSS ==================== */}
      {/* Normal CSS for colors, gradients, shadows - Bootstrap doesn't provide these custom styles */}
      <style>{`
        /* ========== BASE CUSTOM BUTTON ========== */
        /* Normal CSS: Base transition and border reset */
        .custom-btn {
          transition: all 0.3s ease;  /* Normal CSS: Smooth transitions */
          border: none;               /* Normal CSS: Remove default border */
        }

        /* ========== PRIMARY VARIANT ========== */
        /* Normal CSS: Custom blue gradient background */
        .custom-btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
        }
        /* Normal CSS: Hover effect with darker gradient */
        .custom-btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
          transform: translateY(-2px);
          color: #ffffff;
        }
        /* Normal CSS: Outline variant with transparent background */
        .custom-btn-primary.custom-btn-outline {
          background: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover with light background */
        .custom-btn-primary.custom-btn-outline:hover:not(:disabled) {
          background: #eff6ff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
          color: #2563eb;
        }

        /* ========== SECONDARY VARIANT ========== */
        /* Normal CSS: Custom gray solid background */
        .custom-btn-secondary {
          background: #64748b;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(100, 116, 139, 0.2);
        }
        /* Normal CSS: Hover with darker gray */
        .custom-btn-secondary:hover:not(:disabled) {
          background: #475569;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
          transform: translateY(-2px);
          color: #ffffff;
        }
        /* Normal CSS: Outline variant */
        .custom-btn-secondary.custom-btn-outline {
          background: transparent;
          color: #64748b;
          border: 2px solid #64748b;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover */
        .custom-btn-secondary.custom-btn-outline:hover:not(:disabled) {
          background: #f8fafc;
          box-shadow: 0 2px 8px rgba(100, 116, 139, 0.15);
          color: #64748b;
        }

        /* ========== SUCCESS VARIANT ========== */
        /* Normal CSS: Custom green gradient background */
        .custom-btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        }
        /* Normal CSS: Hover with darker green gradient */
        .custom-btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
          transform: translateY(-2px);
          color: #ffffff;
        }
        /* Normal CSS: Outline variant */
        .custom-btn-success.custom-btn-outline {
          background: transparent;
          color: #10b981;
          border: 2px solid #10b981;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover */
        .custom-btn-success.custom-btn-outline:hover:not(:disabled) {
          background: #f0fdf4;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        /* ========== DANGER VARIANT ========== */
        /* Normal CSS: Custom red gradient background */
        .custom-btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
        }
        /* Normal CSS: Hover with darker red gradient */
        .custom-btn-danger:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
          transform: translateY(-2px);
          color: #ffffff;
        }
        /* Normal CSS: Outline variant */
        .custom-btn-danger.custom-btn-outline {
          background: transparent;
          color: #ef4444;
          border: 2px solid #ef4444;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover */
        .custom-btn-danger.custom-btn-outline:hover:not(:disabled) {
          background: #fef2f2;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        /* ========== WARNING VARIANT ========== */
        /* Normal CSS: Custom orange gradient background */
        .custom-btn-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
        }
        /* Normal CSS: Hover with darker orange gradient */
        .custom-btn-warning:hover:not(:disabled) {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
          transform: translateY(-2px);
          color: #ffffff;
        }
        /* Normal CSS: Outline variant */
        .custom-btn-warning.custom-btn-outline {
          background: transparent;
          color: #f59e0b;
          border: 2px solid #f59e0b;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover */
        .custom-btn-warning.custom-btn-outline:hover:not(:disabled) {
          background: #fffbeb;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        /* ========== INFO VARIANT ========== */
        /* Normal CSS: Custom light blue gradient background */
        .custom-btn-info {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
        }
        /* Normal CSS: Hover with darker blue gradient */
        .custom-btn-info:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
          transform: translateY(-2px);
          color: #ffffff;
        }
        /* Normal CSS: Outline variant */
        .custom-btn-info.custom-btn-outline {
          background: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover */
        .custom-btn-info.custom-btn-outline:hover:not(:disabled) {
          background: #eff6ff;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }

        /* ========== LIGHT VARIANT ========== */
        /* Normal CSS: Custom light gray background */
        .custom-btn-light {
          background: #f8f9fa;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        /* Normal CSS: Hover with slightly darker gray */
        .custom-btn-light:hover:not(:disabled) {
          background: #e9ecef;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
          color: #1e293b;
        }
        /* Normal CSS: Outline variant */
        .custom-btn-light.custom-btn-outline {
          background: transparent;
          color: #64748b;
          border: 2px solid #e2e8f0;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover */
        .custom-btn-light.custom-btn-outline:hover:not(:disabled) {
          background: #f8f9fa;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          color: #64748b;
        }

        /* ========== DARK VARIANT ========== */
        /* Normal CSS: Custom dark background */
        .custom-btn-dark {
          background: #1e293b;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        /* Normal CSS: Hover with darker background */
        .custom-btn-dark:hover:not(:disabled) {
          background: #0f172a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
          color: #ffffff;
        }
        /* Normal CSS: Outline variant */
        .custom-btn-dark.custom-btn-outline {
          background: transparent;
          color: #1e293b;
          border: 2px solid #1e293b;
          box-shadow: none;
        }
        /* Normal CSS: Outline hover */
        .custom-btn-dark.custom-btn-outline:hover:not(:disabled) {
          background: #f8fafc;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          color: #1e293b;
        }

        /* ========== DISABLED STATE ========== */
        /* Normal CSS: Gray disabled state for all variants */
        .custom-btn:disabled {
          background: #e5e7eb !important;
          color: #9ca3af !important;
          cursor: not-allowed !important;
          box-shadow: none !important;
          opacity: 0.6;
          transform: translateY(0) !important;
          border: none !important;
        }

        /* ========== ACTIVE STATE ========== */
        /* Normal CSS: Reset transform on click */
        .custom-btn:active:not(:disabled) {
          transform: translateY(0) !important;
        }

        /* ========== LOADING SPINNER ANIMATION ========== */
        /* Normal CSS: Keyframe animation for loading spinner */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Normal CSS: Apply spin animation to loader icon */
        .spinner-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default CustomButton;
