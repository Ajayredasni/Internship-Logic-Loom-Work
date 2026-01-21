// src/components/custom_component/CustomToggleSwitch.jsx
import React from "react";

/**
 * CustomToggleSwitch Component - Bootstrap-based toggle switch
 *
 * @param {boolean} checked - Toggle state (true/false)
 * @param {function} onChange - Change handler: (checked) => {}
 * @param {string} label - Label text (optional)
 * @param {string} labelPosition - "left" | "right" (default: "left")
 * @param {boolean} disabled - Disabled state (default: false)
 * @param {string} size - "sm" | "md" | "lg" (default: "md")
 * @param {string} onColor - Color when ON: "primary" | "success" | "danger" | "warning" | "info" (default: "primary")
 * @param {string} offColor - Color when OFF (default: "secondary")
 * @param {string} name - Input name attribute
 * @param {string} id - Input id attribute
 * @param {object} style - Custom inline styles
 * @param {string} className - Additional CSS classes
 */

const CustomToggleSwitch = ({
  checked = false,
  onChange = () => {},
  label = "",
  labelPosition = "left",
  disabled = false,
  size = "md",
  onColor = "primary",
  offColor = "secondary",
  name = "",
  id = "",
  style = {},
  className = "",
}) => {
  // Generate unique ID if not provided
  const switchId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  // Handle toggle change
  const handleChange = (e) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  // Size classes
  const sizeClass =
    {
      sm: "form-switch-sm",
      md: "",
      lg: "form-switch-lg",
    }[size] || "";

  // Color classes
  const colorClass = checked ? `toggle-${onColor}` : `toggle-${offColor}`;

  // Complete classes
  const switchClasses = [
    "form-check",
    "form-switch",
    sizeClass,
    colorClass,
    disabled ? "opacity-50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className={`d-flex align-items-center gap-2 ${
          labelPosition === "right" ? "flex-row-reverse" : ""
        }`}
        style={style}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={switchId}
            className={`form-check-label fw-medium ${
              disabled ? "text-muted" : "text-dark"
            }`}
            style={{
              fontSize:
                size === "sm"
                  ? "0.875rem"
                  : size === "lg"
                    ? "1.125rem"
                    : "1rem",
              cursor: disabled ? "not-allowed" : "pointer",
              userSelect: "none",
            }}
          >
            {label}
          </label>
        )}

        {/* Toggle Switch */}
        <div className={switchClasses}>
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={switchId}
            name={name}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          />
        </div>
      </div>

      {/* Custom CSS - Only for colors and sizes */}
      <style>{`
        /* ========== SIZE VARIANTS ========== */
        .form-switch-sm .form-check-input {
          width: 2rem;
          height: 1rem;
          font-size: 0.75rem;
        }

        .form-switch-lg .form-check-input {
          width: 3.5rem;
          height: 1.75rem;
          font-size: 1.25rem;
        }

        /* ========== COLOR VARIANTS (ON STATE) ========== */
        .toggle-primary .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .toggle-success .form-check-input:checked {
          background-color: #198754;
          border-color: #198754;
        }

        .toggle-danger .form-check-input:checked {
          background-color: #dc3545;
          border-color: #dc3545;
        }

        .toggle-warning .form-check-input:checked {
          background-color: #ffc107;
          border-color: #ffc107;
        }

        .toggle-info .form-check-input:checked {
          background-color: #0dcaf0;
          border-color: #0dcaf0;
        }

        /* ========== OFF STATE ========== */
        .toggle-secondary .form-check-input:not(:checked) {
          background-color: #6c757d;
          border-color: #6c757d;
        }

        /* ========== HOVER EFFECTS ========== */
        .form-check-input:not(:disabled):hover {
          cursor: pointer;
          opacity: 0.9;
        }

        /* ========== FOCUS STATE ========== */
        .form-check-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .toggle-success .form-check-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
        }

        .toggle-danger .form-check-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
        }

        /* ========== DISABLED STATE ========== */
        .form-check-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ========== SMOOTH TRANSITION ========== */
        .form-check-input {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default CustomToggleSwitch;
