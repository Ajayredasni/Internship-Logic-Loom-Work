// src/components/custom_component/Stepper.jsx
import React from "react";
import { Check } from "react-feather";

/**
 * Stepper Component - Multi-step process indicator
 *
 * @param {Array} steps - Array of step objects: [{ label, icon?, description? }]
 * @param {number} currentStep - Current active step index (0-based)
 * @param {function} onStepClick - Callback when step is clicked (optional)
 * @param {boolean} clickable - Allow clicking on completed steps (default: true)
 * @param {string} orientation - "horizontal" | "vertical" (default: "horizontal")
 * @param {object} style - Custom styles
 * @param {string} className - Custom CSS class
 */

const Stepper = ({
  steps = [],
  currentStep = 0,
  onStepClick = null,
  clickable = true,
  orientation = "horizontal",
  style = {},
  className = "",
}) => {
  // Handle step click
  const handleStepClick = (index) => {
    // Only allow clicking on completed steps or current step
    if (clickable && index <= currentStep && onStepClick) {
      onStepClick(index);
    }
  };

  // Get step status
  const getStepStatus = (index) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "pending";
  };

  // Horizontal Stepper
  if (orientation === "horizontal") {
    return (
      <div
        className={`stepper-horizontal ${className}`}
        style={{
          padding: "20px 0",
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = clickable && index <= currentStep;

            return (
              <React.Fragment key={index}>
                {/* Step Item */}
                <div
                  onClick={() => handleStepClick(index)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    cursor: isClickable ? "pointer" : "default",
                    transition: "all 0.3s ease",
                    zIndex: 2,
                  }}
                >
                  {/* Step Circle */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      backgroundColor:
                        status === "completed"
                          ? "#10b981"
                          : status === "current"
                          ? "#2563eb"
                          : "#e5e7eb",
                      color:
                        status === "completed" || status === "current"
                          ? "#ffffff"
                          : "#9ca3af",
                      border:
                        status === "current"
                          ? "3px solid #93c5fd"
                          : "3px solid transparent",
                      boxShadow:
                        status === "current"
                          ? "0 0 0 4px rgba(37, 99, 235, 0.1)"
                          : "none",
                      transform: isClickable ? "scale(1)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                  >
                    {status === "completed" ? (
                      <Check size={24} strokeWidth={3} />
                    ) : step.icon ? (
                      <span style={{ fontSize: "20px" }}>{step.icon}</span>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step Label */}
                  <div
                    style={{
                      marginTop: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: status === "current" ? "600" : "500",
                        color:
                          status === "completed"
                            ? "#10b981"
                            : status === "current"
                            ? "#1e293b"
                            : "#64748b",
                        marginBottom: step.description ? "4px" : "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          marginTop: "2px",
                        }}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "3px",
                      backgroundColor: "#e5e7eb",
                      position: "relative",
                      top: "-32px",
                      margin: "0 8px",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "#10b981",
                        transition: "width 0.3s ease",
                        width: index < currentStep ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical Stepper
  return (
    <div
      className={`stepper-vertical ${className}`}
      style={{
        padding: "20px 0",
        ...style,
      }}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isClickable = clickable && index <= currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            onClick={() => handleStepClick(index)}
            style={{
              display: "flex",
              cursor: isClickable ? "pointer" : "default",
              marginBottom: isLast ? "0" : "24px",
            }}
          >
            {/* Left Side - Circle & Line */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: "16px",
              }}
            >
              {/* Step Circle */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    status === "completed"
                      ? "#10b981"
                      : status === "current"
                      ? "#2563eb"
                      : "#e5e7eb",
                  color:
                    status === "completed" || status === "current"
                      ? "#ffffff"
                      : "#9ca3af",
                  border:
                    status === "current"
                      ? "3px solid #93c5fd"
                      : "3px solid transparent",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (isClickable) {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isClickable) {
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                {status === "completed" ? (
                  <Check size={20} strokeWidth={3} />
                ) : step.icon ? (
                  <span style={{ fontSize: "18px" }}>{step.icon}</span>
                ) : (
                  index + 1
                )}
              </div>

              {/* Vertical Line */}
              {!isLast && (
                <div
                  style={{
                    width: "3px",
                    flex: 1,
                    minHeight: "40px",
                    backgroundColor: "#e5e7eb",
                    position: "relative",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#10b981",
                      transition: "height 0.3s ease",
                      height: index < currentStep ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Right Side - Content */}
            <div
              style={{
                flex: 1,
                paddingTop: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: status === "current" ? "600" : "500",
                  color:
                    status === "completed"
                      ? "#10b981"
                      : status === "current"
                      ? "#1e293b"
                      : "#64748b",
                  marginBottom: step.description ? "4px" : "0",
                }}
              >
                {step.label}
              </div>
              {step.description && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "2px",
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
