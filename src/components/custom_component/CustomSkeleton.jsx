// src/components/custom_component/CustomSkeleton.jsx
import React from "react";

/**
 * CustomSkeleton Component - Bootstrap-based loading placeholders
 *
 * @param {string} variant - "text" | "card" | "table" | "avatar" | "thumbnail" | "button" (default: "text")
 * @param {number} count - Number of skeleton items (default: 1)
 * @param {number} rows - For table variant: number of rows (default: 5)
 * @param {number} columns - For table variant: number of columns (default: 4)
 * @param {string} height - Custom height (e.g., "200px", "50%")
 * @param {string} width - Custom width (e.g., "100%", "250px")
 * @param {boolean} circle - Make avatar circular (default: true for avatar)
 * @param {string} animation - "pulse" | "wave" | "none" (default: "pulse")
 * @param {object} style - Custom inline styles
 * @param {string} className - Additional CSS classes
 */

const CustomSkeleton = ({
  variant = "text",
  count = 1,
  rows = 5,
  columns = 4,
  height = "",
  width = "",
  circle = true,
  animation = "pulse",
  style = {},
  className = "",
}) => {
  // Animation class
  const animationClass =
    {
      pulse: "skeleton-pulse",
      wave: "skeleton-wave",
      none: "",
    }[animation] || "skeleton-pulse";

  // Base skeleton classes (Bootstrap placeholder)
  const baseClasses = [
    "placeholder",
    animationClass,
    "bg-secondary",
    "rounded",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Render based on variant
  const renderSkeleton = () => {
    switch (variant) {
      // ========== TEXT VARIANT ==========
      case "text":
        return (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="mb-2">
                <span
                  className={baseClasses}
                  style={{
                    display: "block",
                    height: height || "1rem",
                    width: width || (index === count - 1 ? "60%" : "100%"),
                    ...style,
                  }}
                ></span>
              </div>
            ))}
          </>
        );

      // ========== CARD VARIANT ==========
      case "card":
        return (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className="card mb-3"
                style={{
                  border: "1px solid #e2e8f0",
                  ...style,
                }}
              >
                <div className="card-body">
                  {/* Image placeholder */}
                  <div
                    className={`${baseClasses} mb-3`}
                    style={{
                      height: height || "200px",
                      width: "100%",
                    }}
                  ></div>

                  {/* Title placeholder */}
                  <div
                    className={`${baseClasses} mb-2`}
                    style={{
                      height: "1.5rem",
                      width: "70%",
                    }}
                  ></div>

                  {/* Description placeholder - 3 lines */}
                  <div
                    className={`${baseClasses} mb-2`}
                    style={{
                      height: "1rem",
                      width: "100%",
                    }}
                  ></div>
                  <div
                    className={`${baseClasses} mb-2`}
                    style={{
                      height: "1rem",
                      width: "90%",
                    }}
                  ></div>
                  <div
                    className={`${baseClasses} mb-3`}
                    style={{
                      height: "1rem",
                      width: "60%",
                    }}
                  ></div>

                  {/* Button placeholder */}
                  <div
                    className={`${baseClasses}`}
                    style={{
                      height: "2.5rem",
                      width: "120px",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </>
        );

      // ========== TABLE VARIANT ==========
      case "table":
        return (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <th key={colIndex}>
                      <span
                        className={baseClasses}
                        style={{
                          display: "block",
                          height: "1rem",
                          width: "80%",
                        }}
                      ></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                      <td key={colIndex}>
                        <span
                          className={baseClasses}
                          style={{
                            display: "block",
                            height: "1rem",
                            width: colIndex === 0 ? "60%" : "90%",
                          }}
                        ></span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // ========== AVATAR VARIANT ==========
      case "avatar":
        return (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="d-inline-block me-2 mb-2">
                <span
                  className={`${baseClasses} ${circle ? "rounded-circle" : ""}`}
                  style={{
                    display: "block",
                    height: height || "48px",
                    width: width || "48px",
                    ...style,
                  }}
                ></span>
              </div>
            ))}
          </>
        );

      // ========== THUMBNAIL VARIANT ==========
      case "thumbnail":
        return (
          <div className="row g-3">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="col-md-4 col-sm-6 col-12">
                <div
                  className={baseClasses}
                  style={{
                    height: height || "180px",
                    width: "100%",
                    ...style,
                  }}
                ></div>
              </div>
            ))}
          </div>
        );

      // ========== BUTTON VARIANT ==========
      case "button":
        return (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <span
                key={index}
                className={`${baseClasses} me-2 mb-2`}
                style={{
                  display: "inline-block",
                  height: height || "38px",
                  width: width || "100px",
                  ...style,
                }}
              ></span>
            ))}
          </>
        );

      // ========== DEFAULT (TEXT) ==========
      default:
        return (
          <span
            className={baseClasses}
            style={{
              display: "block",
              height: height || "1rem",
              width: width || "100%",
              ...style,
            }}
          ></span>
        );
    }
  };

  return (
    <>
      {renderSkeleton()}

      {/* ========== CUSTOM CSS - Only for animations ========== */}
      <style>{`
        /* ========== PULSE ANIMATION ========== */
        .skeleton-pulse {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* ========== WAVE ANIMATION ========== */
        .skeleton-wave {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            90deg,
            #e2e8f0 0%,
            #e2e8f0 40%,
            #f1f5f9 50%,
            #e2e8f0 60%,
            #e2e8f0 100%
          );
          background-size: 200% 100%;
          animation: skeleton-wave 1.5s ease-in-out infinite;
        }

        @keyframes skeleton-wave {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* ========== ENSURE PROPER SPACING ========== */
        .placeholder {
          pointer-events: none;
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default CustomSkeleton;
