// src/components/custom_component/CustomSelect.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Check } from "react-feather";

/**
 * CustomSelect Component - Beautiful dropdown with search
 *
 * @param {Array} options - Array of options: [{value: "", label: ""}] or ["string1", "string2"]
 * @param {string|Array} value - Selected value(s)
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {boolean} required - Required field
 * @param {boolean} disabled - Disabled state
 * @param {boolean} searchable - Enable search (default: true)
 * @param {boolean} clearable - Show clear button (default: true)
 * @param {boolean} multiple - Multiple selection (default: false)
 * @param {string} name - Field name
 * @param {object} style - Custom styles
 * @param {string} className - Custom CSS class
 */

const CustomSelect = ({
  options = [],
  value = "",
  onChange = () => {},
  placeholder = "Select an option",
  label = "",
  error = "",
  required = false,
  disabled = false,
  searchable = true,
  clearable = true,
  multiple = false,
  name = "",
  style = {},
  className = "",
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to {value, label} format
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  // Filter options based on search
  const filteredOptions = searchable
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : normalizedOptions;

  // Get selected label(s)
  const getSelectedLabel = () => {
    if (!value) return placeholder;

    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      const selectedOpts = normalizedOptions.filter((opt) =>
        value.includes(opt.value)
      );
      return selectedOpts.map((opt) => opt.label).join(", ");
    }

    const selectedOpt = normalizedOptions.find((opt) => opt.value === value);
    return selectedOpt ? selectedOpt.label : placeholder;
  };

  // Check if option is selected
  const isSelected = (optValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optValue);
    }
    return value === optValue;
  };

  // Handle option click
  const handleOptionClick = (optValue) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optValue)
        ? currentValues.filter((v) => v !== optValue)
        : [...currentValues, optValue];

      onChange({
        target: { name, value: newValues },
      });
    } else {
      onChange({
        target: { name, value: optValue },
      });
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange({
      target: { name, value: multiple ? [] : "" },
    });
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        break;
      default:
        break;
    }
  };

  // Styles
  const containerStyle = {
    marginBottom: "14px",
    width: "100%",
    ...style,
  };

  const selectContainerStyle = {
    position: "relative",
    width: "100%",
  };

  const selectHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    backgroundColor: disabled ? "#f8f9fa" : "#ffffff",
    border: error ? "2px solid #dc2626" : "2px solid #e2e8f0",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    minHeight: "42px",
    opacity: disabled ? 0.6 : 1,
  };

  const selectHeaderFocusStyle = {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
  };

  const placeholderStyle = {
    color: value || (multiple && value?.length > 0) ? "#1e293b" : "#94a3b8",
    fontSize: "14px",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const iconsContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
  };

  const dropdownStyle = {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxHeight: "240px",
    overflowY: "auto",
    zIndex: 1000,
    animation: "slideDown 0.2s ease-out",
  };

  const searchInputStyle = {
    width: "100%",
    padding: "10px 16px",
    border: "none",
    borderBottom: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    color: "#1e293b",
  };

  const optionStyle = (isHighlighted, isOptionSelected) => ({
    padding: "10px 16px",
    cursor: "pointer",
    backgroundColor: isHighlighted
      ? "#f1f5f9"
      : isOptionSelected
      ? "#eff6ff"
      : "transparent",
    color: isOptionSelected ? "#2563eb" : "#1e293b",
    fontSize: "14px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: isOptionSelected ? "500" : "400",
  });

  const emptyStateStyle = {
    padding: "20px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
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

  return (
    <div style={containerStyle} className={className}>
      {/* Label */}
      {label && (
        <label className="form-label fw-semibold">
          {label}
          {required && <span style={requiredStyle}>*</span>}
        </label>
      )}

      {/* Select Container */}
      <div ref={dropdownRef} style={selectContainerStyle}>
        {/* Select Header */}
        <div
          style={{
            ...selectHeaderStyle,
            ...(isOpen && !disabled ? selectHeaderFocusStyle : {}),
          }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span style={placeholderStyle}>{getSelectedLabel()}</span>

          <div style={iconsContainerStyle}>
            {/* Clear Button */}
            {clearable &&
              !disabled &&
              (value || (multiple && value?.length > 0)) && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    color: "#64748b",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#1e293b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#64748b";
                  }}
                >
                  <X size={16} />
                </button>
              )}

            {/* Chevron */}
            {isOpen ? (
              <ChevronUp size={18} color="#64748b" />
            ) : (
              <ChevronDown size={18} color="#64748b" />
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div style={dropdownStyle} role="listbox">
            {/* Search Input */}
            {searchable && (
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInputStyle}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Options List */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  style={optionStyle(
                    index === highlightedIndex,
                    isSelected(option.value)
                  )}
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={isSelected(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected(option.value) && (
                    <Check size={16} color="#2563eb" />
                  )}
                </div>
              ))
            ) : (
              <div style={emptyStateStyle}>No options found</div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={errorStyle}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomSelect;
