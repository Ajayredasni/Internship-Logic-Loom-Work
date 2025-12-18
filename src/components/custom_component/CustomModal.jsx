// src/components/custom_component/CustomModal.jsx
import React, { useEffect } from "react";
import { X } from "react-feather";

/**
 * CustomModal Component - Beautiful, reusable modal
 *
 * @param {boolean} show - Show/hide modal
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Modal footer (optional)
 * @param {string} size - "sm" | "md" | "lg" | "xl" | "full"
 * @param {boolean} closeOnOverlayClick - Close on outside click (default: true)
 * @param {boolean} closeOnEsc - Close on ESC key (default: true)
 * @param {boolean} showCloseButton - Show X button (default: true)
 * @param {object} style - Custom styles
 * @param {string} className - Custom CSS class
 */

const CustomModal = ({
  show = false,
  onClose = () => {},
  title = "",
  children,
  footer = null,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  style = {},
  className = "",
  ...rest
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!show || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [show, closeOnEsc, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  // Size configurations
  const sizeStyles = {
    sm: { maxWidth: "400px" },
    md: { maxWidth: "600px" },
    lg: { maxWidth: "800px" },
    xl: { maxWidth: "1200px" },
    full: { maxWidth: "95%", height: "95vh" },
  };

  // Styles
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    animation: "fadeIn 0.3s ease-out",
    backdropFilter: "blur(4px)",
  };

  const modalStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    ...sizeStyles[size],
    maxHeight: size === "full" ? "95vh" : "90vh",
    display: "flex",
    flexDirection: "column",
    animation: "slideUp 0.3s ease-out",
    overflow: "hidden",
    ...style,
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    flexShrink: 0,
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  };

  const closeButtonStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    borderRadius: "8px",
    transition: "all 0.2s ease",
  };

  const bodyStyle = {
    padding: "24px",
    overflowY: "auto",
    flex: 1,
  };

  const footerStyle = {
    padding: "16px 24px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    flexShrink: 0,
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={overlayStyle}
        onClick={handleOverlayClick}
        className={className}
        {...rest}
      >
        {/* Modal */}
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={headerStyle}>
            <h3 style={titleStyle}>{title}</h3>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                  e.currentTarget.style.color = "#1e293b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Body */}
          <div style={bodyStyle}>{children}</div>

          {/* Footer */}
          {footer && <div style={footerStyle}>{footer}</div>}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Custom scrollbar for modal body */
        .custom-modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .custom-modal-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .custom-modal-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .custom-modal-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default CustomModal;
