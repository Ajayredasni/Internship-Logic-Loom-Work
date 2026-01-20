// src/components/custom_component/CustomTooltip.jsx
import React, { useState, useRef, useEffect } from "react";

/**
 * CustomTooltip Component - Bootstrap-based tooltips
 *
 * @param {ReactNode} children - Element to attach tooltip to
 * @param {string} content - Tooltip text
 * @param {string} placement - "top" | "bottom" | "left" | "right" (default: "top")
 * @param {string} trigger - "hover" | "click" | "focus" (default: "hover")
 * @param {number} delay - Show delay in ms (default: 200)
 * @param {boolean} arrow - Show arrow (default: true)
 * @param {object} style - Custom styles
 * @param {string} className - Additional CSS classes
 */

const CustomTooltip = ({
  children,
  content,
  placement = "top",
  trigger = "hover",
  delay = 200,
  arrow = true,
  style = {},
  className = "",
}) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = 8; // Gap between element and tooltip

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = childRect.top - tooltipRect.height - offset;
        left = childRect.left + childRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = childRect.bottom + offset;
        left = childRect.left + childRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = childRect.top + childRect.height / 2 - tooltipRect.height / 2;
        left = childRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = childRect.top + childRect.height / 2 - tooltipRect.height / 2;
        left = childRect.right + offset;
        break;
      default:
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding;
    }

    setPosition({ top, left });
  };

  // Show tooltip
  const handleShow = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShow(true);
    }, delay);
  };

  // Hide tooltip
  const handleHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  // Update position when shown
  useEffect(() => {
    if (show) {
      calculatePosition();
      window.addEventListener("scroll", calculatePosition);
      window.addEventListener("resize", calculatePosition);

      return () => {
        window.removeEventListener("scroll", calculatePosition);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [show]);

  // Event handlers based on trigger
  const eventHandlers = {
    hover: {
      onMouseEnter: handleShow,
      onMouseLeave: handleHide,
    },
    click: {
      onClick: () => setShow(!show),
    },
    focus: {
      onFocus: handleShow,
      onBlur: handleHide,
    },
  };

  // Arrow direction class
  const arrowClass = `tooltip-arrow-${placement}`;

  return (
    <>
      {/* Child element wrapper */}
      <span
        ref={childRef}
        className="custom-tooltip-trigger d-inline-block"
        {...eventHandlers[trigger]}
        style={{ cursor: "help" }}
      >
        {children}
      </span>

      {/* Tooltip */}
      {show && content && (
        <div
          ref={tooltipRef}
          className={`tooltip bs-tooltip-${placement} show ${className}`}
          role="tooltip"
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999,
            maxWidth: "200px",
            ...style,
          }}
        >
          {/* Arrow */}
          {arrow && <div className={`tooltip-arrow ${arrowClass}`}></div>}

          {/* Content */}
          <div className="tooltip-inner">{content}</div>
        </div>
      )}

      {/* Custom CSS - Only for arrow positioning */}
      <style>{`
        /* ========== TOOLTIP ARROW POSITIONS ========== */
        .tooltip-arrow {
          position: absolute;
          width: 0;
          height: 0;
        }

        .tooltip-arrow-top {
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid var(--bs-tooltip-bg);
        }

        .tooltip-arrow-bottom {
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid var(--bs-tooltip-bg);
        }

        .tooltip-arrow-left {
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 5px solid var(--bs-tooltip-bg);
        }

        .tooltip-arrow-right {
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-right: 5px solid var(--bs-tooltip-bg);
        }

        /* ========== TOOLTIP ANIMATION ========== */
        .tooltip.show {
          opacity: 1;
          animation: tooltipFadeIn 0.15s ease-in;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ========== CURSOR STYLE ========== */
        .custom-tooltip-trigger {
          cursor: help;
        }
      `}</style>
    </>
  );
};

export default CustomTooltip;
