import React, { useState, useEffect } from "react";
import {
  generateDynamicToken,
  setupMessageListener,
} from "../firebase/firebaseConfig";
import { Send } from "react-feather";
// import "./PushNotificationForm.css";

const PushNotificationForm = () => {
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load token from localStorage
    const savedToken = localStorage.getItem("fcm_token");
    if (savedToken) {
      setToken(savedToken);
    }

    //  Setup foreground message listener
    setupMessageListener((payload) => {
      console.log("📱 Foreground notification received");
      handleNewNotification({
        title: payload.notification?.title,
        body: payload.notification?.body,
      });
    });

    //  NEW: Listen for Service Worker messages (Firebase Campaign notifications)
    const handleServiceWorkerMessage = (event) => {
      console.log("📬 Message from Service Worker:", event.data);

      if (event.data && event.data.type === "FIREBASE_NOTIFICATION") {
        console.log(" Storing Firebase notification in localStorage");
        handleNewNotification({
          title: event.data.notification.title,
          body: event.data.notification.body,
        });
      }
    };

    // Register Service Worker message listener
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );
      console.log(" Service Worker listener registered");
    }

    // Storage event listener
    const handleStorageChange = () => {
      console.log("💾 Storage changed");
    };
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      }
    };
  }, []);

  //  Handle new notification (add to localStorage and bell icon)
  const handleNewNotification = (notif) => {
    console.log("💾 Saving notification:", notif);

    const newNotification = {
      title: notif.title,
      body: notif.body,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Get existing notifications
    let allNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    // Add new notification at the beginning
    allNotifications.unshift(newNotification);

    // Save back to localStorage
    localStorage.setItem("notifications", JSON.stringify(allNotifications));
    console.log(" Notification saved. Total:", allNotifications.length);

    // Trigger storage event for UI update
    window.dispatchEvent(new Event("storage"));
  };

  // Token generation
  const handleGenerateToken = async () => {
    setLoading(true);
    setError("");

    try {
      const newToken = await generateDynamicToken();

      if (newToken) {
        setToken(newToken);
        alert(" Token generated successfully!");
        console.log("🔑 Token:", newToken);
      } else {
        setError("Failed to generate token. Please allow notifications.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Error generating token: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send Notification (LocalStorage only)
  const handleSendNotification = () => {
    // Validation
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!message.trim()) {
      setError("Message is required.");
      return;
    }

    setError("");

    // Create notification object
    const newNotification = {
      title: title,
      body: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Store in localStorage
    let allNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    allNotifications.unshift(newNotification);
    localStorage.setItem("notifications", JSON.stringify(allNotifications));

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/logo192.png",
      });
    }

    // Clear form
    setTitle("");
    setMessage("");
    setToken("");

    // Trigger storage event
    window.dispatchEvent(new Event("storage"));

    alert("📨 Notification sent successfully!");
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f6fa",
        minHeight: "80vh",
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            padding: "32px 40px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🔔
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
                Push Notification Manager
              </h2>
              <p
                style={{ margin: "6px 0 0 0", fontSize: "15px", opacity: 0.9 }}
              >
                Generate token and send notifications (Firebase Campaign Ready)
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div style={{ padding: "32px 40px" }}>
          {/* Error Alert */}
          {error && (
            <div
              style={{
                padding: "14px 16px",
                background: "#FEE2E2",
                border: "1px solid #FCA5A5",
                borderRadius: "10px",
                marginBottom: "24px",
                fontSize: "14px",
                color: "#991B1B",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "18px" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Token Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#1F2937",
                letterSpacing: "0.3px",
              }}
            >
              FCM TOKEN <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                value={token}
                readOnly
                placeholder="Click 'Generate Token' to create"
                style={{
                  flex: 1,
                  minWidth: "250px",
                  padding: "12px 16px",
                  border: "2px solid #E5E7EB",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  backgroundColor: "#F9FAFB",
                  color: "#374151",
                  outline: "none",
                }}
              />
              <button
                onClick={handleGenerateToken}
                disabled={loading}
                style={{
                  padding: "12px 28px",
                  background: loading
                    ? "#9CA3AF"
                    : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 12px rgba(16, 185, 129, 0.3)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(16, 185, 129, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(16, 185, 129, 0.3)";
                  }
                }}
              >
                {loading ? "Generating..." : "Generate Token"}
              </button>
            </div>
            <small
              style={{
                fontSize: "12px",
                color: "#6B7280",
                display: "block",
                marginTop: "8px",
              }}
            >
              Token saved automatically. Use this in Firebase Campaign.
            </small>
          </div>

          {/* Title Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#1F2937",
                letterSpacing: "0.3px",
              }}
            >
              NOTIFICATION TITLE <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #E5E7EB",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#1F2937",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4F46E5";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(79, 70, 229, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Message Field */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#1F2937",
                letterSpacing: "0.3px",
              }}
            >
              NOTIFICATION MESSAGE <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your notification message..."
              rows="5"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #E5E7EB",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#1F2937",
                outline: "none",
                resize: "vertical",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4F46E5";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(79, 70, 229, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendNotification}
            disabled={!title || !message}
            style={{
              width: "100%",
              padding: "16px",
              background:
                !title || !message
                  ? "#D1D5DB"
                  : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: !title || !message ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.3s ease",
              boxShadow:
                !title || !message
                  ? "none"
                  : "0 6px 20px rgba(99, 102, 241, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (title && message) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(99, 102, 241, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (title && message) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(99, 102, 241, 0.4)";
              }
            }}
          >
            <Send size={20} />
            Send Notification
          </button>
        </div>

        {/* Info Footer */}
        <div
          style={{
            padding: "20px 40px",
            background: "linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)",
            borderTop: "1px solid #BFDBFE",
          }}
        >
          <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>ℹ️</span>
            <div>
              <strong
                style={{
                  fontSize: "14px",
                  color: "#1E3A8A",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                How it works:
              </strong>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#1E40AF",
                  lineHeight: "1.6",
                }}
              >
                Local notifications AND Firebase Campaign notifications both
                will appear in bell icon.
                <br /> No localStorage errors in Service Worker anymore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationForm;
