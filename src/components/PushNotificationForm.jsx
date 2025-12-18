// src/components/PushNotificationForm.jsx
import React, { useState, useEffect } from "react";
import {
  generateDynamicToken,
  setupMessageListener,
} from "../firebase/firebaseConfig";
import { Send } from "react-feather";
import CustomAlert from "./custom_component/CustomAlert";
import CustomButton from "./custom_component/CustomButton";
import CustomCard from "./custom_component/CustomCard"; // ✨ NEW IMPORT

const PushNotificationForm = () => {
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Helper functions
  const showAlert = (type, alertTitle, alertMessage) => {
    setAlert({ show: true, type, title: alertTitle, message: alertMessage });
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("fcm_token");
    if (savedToken) {
      setToken(savedToken);
    }

    setupMessageListener((payload) => {
      console.log("📱 Foreground notification received");
      handleNewNotification({
        title: payload.notification?.title,
        body: payload.notification?.body,
      });
    });

    const handleServiceWorkerMessage = (event) => {
      console.log("📬 Message from Service Worker:", event.data);

      if (event.data && event.data.type === "FIREBASE_NOTIFICATION") {
        console.log("💾 Storing Firebase notification in localStorage");
        handleNewNotification({
          title: event.data.notification.title,
          body: event.data.notification.body,
        });
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );
    }

    const handleStorageChange = () => {
      console.log("💾 Storage changed");
    };
    window.addEventListener("storage", handleStorageChange);

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

  const handleNewNotification = (notif) => {
    console.log("💾 Saving notification:", notif);

    const newNotification = {
      title: notif.title,
      body: notif.body,
      timestamp: new Date().toISOString(),
      read: false,
    };

    let allNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    allNotifications.unshift(newNotification);
    localStorage.setItem("notifications", JSON.stringify(allNotifications));
    console.log("✅ Notification saved. Total:", allNotifications.length);

    window.dispatchEvent(new Event("storage"));
  };

  // Token generation with alerts
  const handleGenerateToken = async () => {
    setLoading(true);

    try {
      const newToken = await generateDynamicToken();

      if (newToken) {
        setToken(newToken);
        showAlert(
          "success",
          "Token Generated!",
          "Token generated successfully!"
        );
        console.log("🔑 Token:", newToken);
      } else {
        showAlert(
          "error",
          "Token Failed",
          "Failed to generate token. Please allow notifications."
        );
      }
    } catch (err) {
      console.error("❌ Error:", err);
      showAlert(
        "error",
        "Token Error",
        "Error generating token: " + err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Send Notification with alerts
  const handleSendNotification = () => {
    if (!title.trim()) {
      showAlert("warning", "Title Missing", "Title is required.");
      return;
    }
    if (!message.trim()) {
      showAlert("warning", "Message Missing", "Message is required.");
      return;
    }

    const newNotification = {
      title: title,
      body: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    let allNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    allNotifications.unshift(newNotification);
    localStorage.setItem("notifications", JSON.stringify(allNotifications));

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/logo192.png",
      });
    }

    setTitle("");
    setMessage("");
    setToken("");

    window.dispatchEvent(new Event("storage"));

    showAlert(
      "success",
      "Notification Sent!",
      "Notification sent successfully!"
    );
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
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      {/* ✨ UPDATED: Main Card with CustomCard */}
      <CustomCard
        variant="elevated"
        padding="none"
        style={{
          maxWidth: "900px",
          width: "100%",
          marginBottom: "10px",
        }}
        header={
          // ✨ UPDATED: Custom Gradient Header
          <div
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              padding: "22px 40px",
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
                  style={{
                    margin: "6px 0 0 0",
                    fontSize: "15px",
                    opacity: 0.9,
                  }}
                >
                  Generate token and send notifications (Firebase Campaign
                  Ready)
                </p>
              </div>
            </div>
          </div>
        }
      >
        {/* ✨ Form Section - Now inside CustomCard body */}
        <div style={{ padding: "20px 40px" }}>
          {/* Custom Alert */}
          <CustomAlert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            show={alert.show}
            onClose={closeAlert}
            autoClose={3000}
          />

          {/* Token Field */}
          <div style={{ marginBottom: "20px" }}>
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
              <CustomButton
                variant="success"
                loading={loading}
                disabled={loading}
                onClick={handleGenerateToken}
              >
                {loading ? "Generating..." : "Generate Token"}
              </CustomButton>
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
          <div style={{ marginBottom: "20px" }}>
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
            />
          </div>

          {/* Message Field */}
          <div style={{ marginBottom: "15px" }}>
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
              rows="3"
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
            />
          </div>

          {/* Send Button */}
          <CustomButton
            variant="primary"
            fullWidth
            icon={<Send size={20} />}
            disabled={!title || !message}
            onClick={handleSendNotification}
          >
            Send Notification
          </CustomButton>
        </div>
      </CustomCard>
    </div>
  );
};

export default PushNotificationForm;
