import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD0Hfy6mpaEuDYHQ1iAtKvYMy5DlN8D8yA",
  authDomain: "formbuilderapp-39b8c.firebaseapp.com",
  projectId: "formbuilderapp-39b8c",
  storageBucket: "formbuilderapp-39b8c.firebasestorage.app",
  messagingSenderId: "273257516409",
  appId: "1:273257516409:web:9b74f80f580e7d006cf3a8",
  measurementId: "G-3LGSRK43HY",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

//  VAPID Key (Web Push Certificate)
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VIPKEY;

//  Function to generate DYNAMIC token (Documentation ke according)
export const generateDynamicToken = async () => {
  try {
    // Step 1: Delete old token (Fresh token generate karne ke liye)
    await deleteToken(messaging);
    console.log("Old token deleted successfully");

    // Step 2: Request notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Step 3: Generate NEW token
    const newToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (newToken) {
      console.log(" Generated New Token:", newToken);

      // Step 4: Save to localStorage
      localStorage.setItem("fcm_token", newToken);

      return newToken;
    } else {
      console.log("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

//  Listen for foreground messages
export const setupMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo192.png",
      });
    }

    // Callback for UI update
    if (callback) callback(payload);
  });
};

export { messaging };
