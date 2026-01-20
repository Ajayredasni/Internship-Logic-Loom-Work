// src/components/custom_component/CustomDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, ChevronDown } from "react-feather";

/**
 * CustomDropdown Component - Bootstrap-based dropdown menu
 *
 * @param {ReactNode|string} trigger - Button text or custom trigger element
 * @param {Array} items - Menu items: [{ label, icon, onClick, variant, divider, disabled }]
 * @param {string} triggerVariant - Button variant if trigger is text (default: "light")
 * @param {string} triggerSize - Button size: "sm" | "md" | "lg" (default: "sm")
 * @param {string} placement - "bottom-start" | "bottom-end" | "top-start" | "top-end" (default: "bottom-end")
 * @param {boolean} showIcon - Show chevron/more icon (default: true)
 * @param {string} menuWidth - Dropdown menu width (default: "200px")
 * @param {object} style - Custom styles for trigger button
 * @param {string} className - Additional CSS classes
 */

const CustomDropdown = ({
  trigger = <MoreVertical size={18} />,
  items = [],
  triggerVariant = "light",
  triggerSize = "sm",
  placement = "bottom-end",
  showIcon = true,
  menuWidth = "178px",
  style = {},
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle item click
  const handleItemClick = (item) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Bootstrap dropdown classes
  const dropdownClasses = ["dropdown", isOpen ? "show" : "", className]
    .filter(Boolean)
    .join(" ");

  // Button size class
  const buttonSizeClass =
    triggerSize === "sm" ? "btn-sm" : triggerSize === "lg" ? "btn-lg" : "";

  // Placement class mapping
  const placementClass =
    {
      "bottom-start": "dropdown-menu-start",
      "bottom-end": "dropdown-menu-end",
      "top-start": "dropdown-menu-start dropup",
      "top-end": "dropdown-menu-end dropup",
    }[placement] || "dropdown-menu-end";

  // Determine if trigger is text or element
  const isTextTrigger = typeof trigger === "string";

  return (
    <>
      <div ref={dropdownRef} className={dropdownClasses}>
        {/* Trigger Button */}
        <button
          type="button"
          className={`btn btn-${triggerVariant} ${buttonSizeClass} dropdown-toggle-custom d-inline-flex align-items-center gap-1`}
          onClick={toggleDropdown}
          style={{
            border: "1px solid #e2e8f0",
            ...style,
          }}
        >
          {/* Trigger Content */}
          {isTextTrigger ? (
            <>
              <span>{trigger}</span>
              {showIcon && <ChevronDown size={14} />}
            </>
          ) : (
            trigger
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul
            className={`dropdown-menu ${placementClass} show`}
            style={{
              minWidth: menuWidth,
              maxHeight: "300px",
              // overflowY: "auto",
            }}
          >
            {items.map((item, index) => {
              // Divider
              if (item.divider) {
                return (
                  <li key={index}>
                    <hr className="dropdown-divider" />
                  </li>
                );
              }

              // Menu Item
              return (
                <li key={index}>
                  <button
                    type="button"
                    className={`dropdown-item d-flex align-items-center gap-2 ${
                      item.disabled ? "disabled" : ""
                    } ${item.variant ? `text-${item.variant}` : ""}`}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                  >
                    {/* Icon */}
                    {item.icon && (
                      <span className="dropdown-item-icon">{item.icon}</span>
                    )}

                    {/* Label */}
                    <span className="flex-grow-1">{item.label}</span>

                    {/* Badge (optional) */}
                    {item.badge && (
                      <span
                        className={`badge bg-${item.badge.variant || "secondary"} rounded-pill`}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Custom CSS - Only for removing default Bootstrap dropdown arrow */}
      <style>{`
        /* ========== REMOVE DEFAULT DROPDOWN ARROW ========== */
        .dropdown-toggle-custom::after {
          display: none !important;
        }

        /* ========== DROPDOWN ITEM HOVER ========== */
        .dropdown-item:hover:not(.disabled) {
          background-color: #f1f5f9;
        }

        .dropdown-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ========== ICON ALIGNMENT ========== */
        .dropdown-item-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* ========== DANGER VARIANT ========== */
        .dropdown-item.text-danger:hover:not(.disabled) {
          background-color: #fee2e2;
          color: #dc2626 !important;
        }

        /* ========== WARNING VARIANT ========== */
        .dropdown-item.text-warning:hover:not(.disabled) {
          background-color: #fef3c7;
          color: #f59e0b !important;
        }

        /* ========== SUCCESS VARIANT ========== */
        .dropdown-item.text-success:hover:not(.disabled) {
          background-color: #d1fae5;
          color: #10b981 !important;
        }

        /* ========== SCROLLBAR ========== */
        .dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }

        .dropdown-menu::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .dropdown-menu::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default CustomDropdown;
