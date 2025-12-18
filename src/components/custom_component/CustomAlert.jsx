// src/components/custom_component/CustomAlert.jsx
import React from "react";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "react-feather";

/**
 * CustomAlert Component
 *
 * @param {string} type - "success" | "error" | "warning" | "info"
 * @param {string} title - Alert title (optional)
 * @param {string} message - Alert message (required)
 * @param {function} onClose - Close callback (optional)
 * @param {boolean} show - Show/hide alert
 * @param {number} autoClose - Auto close after ms (optional, e.g., 3000)
 */

const CustomAlert = ({
  type = "info",
  title = "",
  message = "",
  onClose = null,
  show = false,
  autoClose = null,
  style = {},
  className = "",
}) => {
  // Auto close functionality
  React.useEffect(() => {
    if (show && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  if (!show) return null;

  // Alert configurations based on type
  const alertConfig = {
    success: {
      icon: <CheckCircle size={24} />,
      bgColor: "#d1fae5",
      borderColor: "#a7f3d0",
      textColor: "#065f46",
      iconColor: "#10b981",
      defaultTitle: "Success!",
    },
    error: {
      icon: <XCircle size={24} />,
      bgColor: "#fee2e2",
      borderColor: "#fecaca",
      textColor: "#991b1b",
      iconColor: "#ef4444",
      defaultTitle: "Error!",
    },
    warning: {
      icon: <AlertCircle size={24} />,
      bgColor: "#fef3c7",
      borderColor: "#fde68a",
      textColor: "#92400e",
      iconColor: "#f59e0b",
      defaultTitle: "Warning!",
    },
    info: {
      icon: <Info size={24} />,
      bgColor: "#dbeafe",
      borderColor: "#bfdbfe",
      textColor: "#1e40af",
      iconColor: "#3b82f6",
      defaultTitle: "Info",
    },
  };

  const config = alertConfig[type] || alertConfig.info;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={`custom-alert ${className}`}
      style={{
        display: "flex",
        alignItems: "start",
        gap: "12px",
        padding: "16px 20px",
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        marginBottom: "16px",
        position: "relative",
        animation: "slideInDown 0.3s ease-out",
        ...style,
      }}
      role="alert"
    >
      {/* Icon */}
      <div style={{ color: config.iconColor, flexShrink: 0, marginTop: "2px" }}>
        {config.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, color: config.textColor }}>
        {displayTitle && (
          <div
            style={{
              fontWeight: "600",
              fontSize: "15px",
              marginBottom: message ? "4px" : "0",
              letterSpacing: "0.3px",
            }}
          >
            {displayTitle}
          </div>
        )}
        {message && (
          <div
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              opacity: 0.9,
            }}
          >
            {message}
          </div>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.textColor,
            opacity: 0.6,
            transition: "all 0.2s ease",
            borderRadius: "6px",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.6";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
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

export default CustomAlert;
