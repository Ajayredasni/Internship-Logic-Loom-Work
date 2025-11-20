import { ArrowRight, Home, Menu, ChevronUp, ChevronDown } from "react-feather";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ activeItem, setActiveItem }) => {
  const { formDataStore } = useSelector((store) => store.formDataStore);
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div
      className="flex-shrink-0 text-white position-relative"
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)",
        boxShadow: "2px 0 15px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo/Brand Section */}
      <div
        className="p-4 border-bottom border-white border-opacity-10"
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      >
        <Link
          to="/app"
          className="d-flex align-items-center text-white text-decoration-none"
          onClick={() => setActiveItem("home")}
        >
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ width: "40px", height: "40px" }}
          >
            <span className="text-primary fw-bold fs-5">LL</span>
          </div>
          <span className="fs-4 fw-bold">Logic Loom</span>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="p-3">
        {/* Home Link */}
        <Link
          to="/app"
          className={`d-flex align-items-center gap-3 px-3 py-3 mb-2 text-white text-decoration-none rounded-3 ${
            activeItem === "home" ? "bg-white bg-opacity-25" : ""
          }`}
          onClick={() => setActiveItem("home")}
          style={{
            transition: "all 0.3s ease",
            fontWeight: activeItem === "home" ? "600" : "500",
          }}
          onMouseEnter={(e) => {
            if (activeItem !== "home") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeItem !== "home") {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <Home size={20} />
          <span
            className="text-uppercase"
            style={{ letterSpacing: "0.5px", fontSize: "0.875rem" }}
          >
            Home
          </span>
        </Link>

        <Link
          to="/app/push-notifications"
          className={`d-flex align-items-center gap-3 px-3 py-3 mb-2 text-white text-decoration-none rounded-3 `}
          onClick={() => setActiveItem("notification")}
          style={{
            transition: "all 0.3s ease",
            fontWeight: activeItem === "notification" ? "600" : "500",
          }}
          onMouseEnter={(e) => {
            if (activeItem !== "notification") {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeItem !== "notification") {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <Home size={20} />
          <span
            className="text-uppercase"
            style={{ letterSpacing: "0.5px", fontSize: "0.875rem" }}
          >
            Send Notification
          </span>
        </Link>

        {/* Menu Section */}
        <div className="mt-4">
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded-3"
            style={{
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.3s ease",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <Menu size={20} />
              <span
                className="text-uppercase fw-semibold"
                style={{ letterSpacing: "0.5px", fontSize: "0.875rem" }}
              >
                Menu
              </span>
            </div>
            {menuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {/* Menu Items */}
          {menuOpen && (
            <ul className="list-unstyled ps-2">
              {formDataStore
                .filter((f) => f.formType === "Main Form")
                .map((f, idx) => (
                  <li key={idx} className="mb-1">
                    <Link
                      to={`/app/formMenu-Table/${f.formId}`}
                      className={`d-flex justify-content-between align-items-center px-3 py-2 text-white text-decoration-none rounded-3 position-relative overflow-hidden ${
                        activeItem === f.formId ? "bg-white bg-opacity-25" : ""
                      }`}
                      onClick={() => setActiveItem(f.formId)}
                      style={{
                        transition: "all 0.3s ease",
                        fontWeight: activeItem === f.formId ? "600" : "400",
                        fontSize: "0.9rem",
                      }}
                      onMouseEnter={(e) => {
                        if (activeItem !== f.formId) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.1)";
                        }
                        const icon =
                          e.currentTarget.querySelector(".arrow-icon");
                        if (icon) {
                          icon.style.transform = "translateX(5px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeItem !== f.formId) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                        const icon =
                          e.currentTarget.querySelector(".arrow-icon");
                        if (icon) {
                          icon.style.transform = "translateX(0)";
                        }
                      }}
                    >
                      <span>{f.formName}</span>
                      <ArrowRight
                        className="arrow-icon"
                        size={16}
                        style={{
                          transition: "transform 0.3s ease",
                          opacity: 0.7,
                        }}
                      />
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom decoration - optional */}
      <div
        className="position-absolute bottom-0 start-0 end-0 p-3 border-top border-white border-opacity-10"
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      >
        <div className="text-center opacity-50" style={{ fontSize: "0.75rem" }}>
          <div className="mb-1">Dynamic Form Builder</div>
          <div className="fw-semibold">v1.0.0</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
