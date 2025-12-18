import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, Menu, X, Bell } from "react-feather";
import { logout, selectUser, selectIsAuthenticated } from "./store/authSlice";
import { formDataAction } from "./store/formDataStoreSlice";
import { formMenuAction } from "./store/formMenuStoreSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "./custom_component/CustomButton";

function Navbar({ activeItem, setActiveItem }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //  Get user data from Redux
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();

    // Listen for new notifications
    const handleStorageChange = () => {
      loadNotifications();
    };

    window.addEventListener("storage", handleStorageChange);

    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (event.data?.type === "NEW_NOTIFICATION") {
        loadNotifications();
      }
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loadNotifications = () => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };

  const markAsRead = (index) => {
    const updated = [...notifications];
    updated[index].read = true;
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated);
  };

  const clearAllNotifications = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    console.log(`🔓 Logging out user: ${currentUser?.email}`);
    dispatch(formDataAction.clearFormData());
    dispatch(formMenuAction.clearFormMenuData());
    dispatch(logout());
    // localStorage.setItem("users", JSON.stringify([]));   // delete all user in the regeistered
    navigate("/");
  };

  //  Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ width: "100%" }}>
      {/* Desktop Navbar */}
      <nav
        className="d-none d-lg-flex justify-content-between align-items-center px-4 py-3 bg-white border-bottom"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Left Section - Title */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            }}
          >
            <span className="text-white fw-bold" style={{ fontSize: "1.1rem" }}>
              🚀
            </span>
          </div>
          <span
            className="fw-bold fs-5"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Dynamic Form Builder
          </span>
        </div>

        {/* Right Section - User Info & Actions */}
        <div className="d-flex align-items-center gap-3">
          {/* Home Link */}
          <Link
            to="/app"
            className={`d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-3 ${
              activeItem === "home" ? "text-white" : "text-dark"
            }`}
            onClick={() => setActiveItem("home")}
            style={{
              background:
                activeItem === "home"
                  ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)"
                  : "transparent",
              transition: "all 0.3s ease",
              fontWeight: "500",
              fontSize: "0.9rem",
            }}
            onMouseEnter={(e) => {
              if (activeItem !== "home") {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
              }
            }}
            onMouseLeave={(e) => {
              if (activeItem !== "home") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <Home size={18} />
            <span className="text-uppercase" style={{ letterSpacing: "0.5px" }}>
              Home
            </span>
          </Link>

          {/* https://feathericons.dev/?search=video&iconset=feather  */}
          <button
            style={{ border: "none", background: "none" }}
            onClick={() => navigate("./meeting")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="main-grid-item-icon"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect height="14" rx="2" ry="2" width="15" x="1" y="5" />
            </svg>
          </button>

          {/*  BELL ICON - Notification Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s ease",
                padding: "0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(102, 126, 234, 0.4)";
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/*  Notifications Dropdown */}
            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: "0",
                  width: "360px",
                  maxHeight: "450px",
                  overflowY: "auto",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                  border: "1px solid #e2e8f0",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                >
                  <h5
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "white",
                    }}
                  >
                    🔔 Notifications
                  </h5>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "500",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.2)";
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "50px 20px",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    <Bell
                      size={40}
                      style={{ marginBottom: "12px", opacity: 0.3 }}
                    />
                    <p style={{ margin: 0, fontSize: "14px" }}>
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div
                      key={index}
                      onClick={() => markAsRead(index)}
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        cursor: "pointer",
                        background: notif.read ? "white" : "#f0f9ff",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = notif.read
                          ? "#f9fafb"
                          : "#dbeafe";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = notif.read
                          ? "white"
                          : "#f0f9ff";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "13px",
                            color: "#1e293b",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          {notif.title}
                        </strong>
                        {!notif.read && (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#3b82f6",
                              marginTop: "4px",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                      <p
                        style={{
                          margin: "4px 0 6px 0",
                          fontSize: "12px",
                          color: "#64748b",
                          lineHeight: "1.4",
                        }}
                      >
                        {notif.body}
                      </p>
                      <small
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🕒 {new Date(notif.timestamp).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/*  User Welcome - Redux Data */}
          {currentUser && (
            <div
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                {currentUser.firstName?.charAt(0)}
                {currentUser.lastName?.charAt(0)}
                {console.log(currentUser.firstName, currentUser.lastName)}
              </div>
              <div>
                <div
                  className="text-dark fw-semibold"
                  style={{ fontSize: "0.875rem", lineHeight: "1.2" }}
                >
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Welcome back!
                </div>
              </div>
            </div>
          )}

          {/*  Logout Button - Redux Action */}
          <CustomButton
            variant="danger"
            outline
            icon={<LogOut size={16} />}
            onClick={handleLogout}
            size="md"
          >
            Logout
          </CustomButton>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className="d-lg-none d-flex justify-content-between align-items-center px-3 py-3 bg-white border-bottom"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            }}
          >
            <span className="text-white" style={{ fontSize: "0.9rem" }}>
              🚀
            </span>
          </div>
          <span
            className="fw-bold"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "0.95rem",
            }}
          >
            Form Builder
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Mobile Bell Icon */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-3px",
                    right: "-3px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "9px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <button
            className="btn p-2 rounded-3"
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: "#f1f5f9",
              border: "none",
            }}
          >
            <Menu size={22} color="#1e3a8a" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
            transition: "opacity 0.3s ease",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className="position-fixed top-0 end-0 h-100 bg-white"
        style={{
          width: "280px",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050,
          boxShadow: isOpen ? "-4px 0 15px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {/* Mobile Sidebar Header */}
        <div
          className="d-flex justify-content-between align-items-center p-3 border-bottom"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          }}
        >
          <span className="text-white fw-bold">Menu</span>
          <button
            className="btn btn-sm p-1"
            onClick={() => setIsOpen(false)}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "8px",
            }}
          >
            <X size={20} color="white" />
          </button>
        </div>

        {/* Mobile Sidebar Content */}
        <div className="p-3">
          {/* User Info */}
          {currentUser && (
            <div
              className="d-flex align-items-center gap-3 p-3 rounded-3 mb-3"
              style={{
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
              >
                {currentUser.firstName?.charAt(0)}
                {currentUser.lastName?.charAt(0)}
              </div>
              <div>
                <div className="fw-semibold text-dark">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Welcome back!
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <ul className="list-unstyled">
            <li className="mb-2">
              <Link
                to="/app"
                className={`d-flex align-items-center gap-3 px-3 py-3 text-decoration-none rounded-3 ${
                  activeItem === "home" ? "text-white" : "text-dark"
                }`}
                onClick={() => {
                  setActiveItem("home");
                  setIsOpen(false);
                }}
                style={{
                  background:
                    activeItem === "home"
                      ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)"
                      : "transparent",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
              >
                <Home size={20} />
                <span
                  className="text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Home
                </span>
              </Link>
            </li>
          </ul>

          {/* Logout Button */}
          <CustomButton
            variant="danger"
            outline
            fullWidth
            icon={<LogOut size={18} />}
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            style={{ marginTop: "16px" }}
          >
            Logout
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
