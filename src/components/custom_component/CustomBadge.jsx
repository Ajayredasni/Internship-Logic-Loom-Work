// src/components/custom_component/CustomBadge.jsx
import React from "react";
import { X } from "react-feather";

/**
 * CustomBadge Component - Bootstrap-based status indicators
 *
 * @param {ReactNode} children - Badge text/content
 * @param {string} variant - "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"
 * @param {string} size - "xs" | "sm" | "md" | "lg"
 * @param {boolean} outline - Show outline style (default: false)
 * @param {boolean} pill - Fully rounded (default: false)
 * @param {boolean} dot - Show dot indicator only (default: false)
 * @param {ReactNode} icon - Icon component (optional)
 * @param {boolean} removable - Show remove button (default: false)
 * @param {function} onRemove - Remove handler
 * @param {number} count - Show count number (optional)
 * @param {number} maxCount - Max count to display before showing "+" (default: 99)
 * @param {object} style - Custom inline styles
 * @param {string} className - Additional CSS classes
 */

const CustomBadge = ({
  children,
  variant = "primary",
  size = "md",
  outline = false,
  pill = false,
  dot = false,
  icon = null,
  removable = false,
  onRemove = null,
  count = null,
  maxCount = 99,
  style = {},
  className = "",
  ...rest
}) => {
  // Bootstrap badge classes
  const baseClasses = [
    "badge", // Bootstrap: Base badge class
    outline ? `badge-outline-${variant}` : `bg-${variant}`, // Bootstrap: Color variants
    pill ? "rounded-pill" : "rounded-2", // Bootstrap: Pill or slightly rounded
    dot ? "badge-dot" : "", // Custom: Dot indicator
    `badge-${size}`, // Custom: Size classes
    "d-inline-flex", // Bootstrap: Inline flex
    "align-items-center", // Bootstrap: Vertical center
    "gap-1", // Bootstrap: Gap between elements
    "text-decoration-none", // Bootstrap: No underline
    "user-select-none", // Bootstrap: Prevent text selection
    "fw-medium", // Bootstrap: Font weight medium
    className, // User's custom classes
  ]
    .filter(Boolean)
    .join(" ");

  // Display count or children
  const displayContent =
    count !== null ? (count > maxCount ? `${maxCount}+` : count) : children;

  // Text color for outline variants
  const textColorClass = outline ? `text-${variant}` : "";

  return (
    <>
      <span
        className={`${baseClasses} ${textColorClass}`}
        style={style}
        {...rest}
      >
        {/* Dot Indicator */}
        {dot && <span className="badge-dot-indicator"></span>}

        {/* Icon */}
        {icon && !dot && <span className="badge-icon">{icon}</span>}

        {/* Content */}
        {!dot && <span>{displayContent}</span>}

        {/* Remove Button */}
        {removable && onRemove && (
          <button
            type="button"
            className="btn-close btn-close-white badge-remove-btn"
            aria-label="Remove"
            onClick={onRemove}
            style={{
              width: "12px",
              height: "12px",
              fontSize: "8px",
              marginLeft: "4px",
            }}
          ></button>
        )}
      </span>

      {/* Custom CSS - Only for sizes and outline variants */}
      <style>{`
        /* ========== SIZE VARIANTS ========== */
        .badge-xs {
          font-size: 0.625rem;    /* 10px */
          padding: 0.125rem 0.375rem; /* 2px 6px */
          line-height: 1.2;
        }

        .badge-sm {
          font-size: 0.75rem;     /* 12px */
          padding: 0.25rem 0.5rem;   /* 4px 8px */
          line-height: 1.3;
        }

        .badge-md {
          font-size: 0.875rem;    /* 14px */
          padding: 0.375rem 0.75rem; /* 6px 12px */
          line-height: 1.4;
        }

        .badge-lg {
          font-size: 1rem;        /* 16px */
          padding: 0.5rem 1rem;      /* 8px 16px */
          line-height: 1.5;
        }

        /* ========== OUTLINE VARIANTS ========== */
        .badge-outline-primary {
          background: transparent;
          border: 2px solid #0d6efd;
          color: #0d6efd !important;
        }

        .badge-outline-secondary {
          background: transparent;
          border: 2px solid #6c757d;
          color: #6c757d !important;
        }

        .badge-outline-success {
          background: transparent;
          border: 2px solid #198754;
          color: #198754 !important;
        }

        .badge-outline-danger {
          background: transparent;
          border: 2px solid #dc3545;
          color: #dc3545 !important;
        }

        .badge-outline-warning {
          background: transparent;
          border: 2px solid #ffc107;
          color: #ffc107 !important;
        }

        .badge-outline-info {
          background: transparent;
          border: 2px solid #0dcaf0;
          color: #0dcaf0 !important;
        }

        .badge-outline-light {
          background: transparent;
          border: 2px solid #f8f9fa;
          color: #495057 !important;
        }

        .badge-outline-dark {
          background: transparent;
          border: 2px solid #212529;
          color: #212529 !important;
        }

        /* ========== DOT INDICATOR ========== */
        .badge-dot {
          padding: 0.25rem;
          width: 10px;
          height: 10px;
        }

        .badge-dot-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: currentColor;
        }

        /* ========== ICON STYLING ========== */
        .badge-icon {
          display: flex;
          align-items: center;
        }

        /* ========== REMOVE BUTTON ========== */
        .badge-remove-btn {
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .badge-remove-btn:hover {
          opacity: 1;
        }

        /* ========== HOVER EFFECTS ========== */
        .badge:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
};

export default CustomBadge;
