// // public/firebase-messaging-sw.js
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyD0Hfy6mpaEuDYHQ1iAtKvYMy5DlN8D8yA",
//   authDomain: "formbuilderapp-39b8c.firebaseapp.com",
//   projectId: "formbuilderapp-39b8c",
//   storageBucket: "formbuilderapp-39b8c.firebasestorage.app",
//   messagingSenderId: "273257516409",
//   appId: "1:273257516409:web:9b74f80f580e7d006cf3a8",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("Background Message:", payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/logo192.png",
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

//  Updated to latest Firebase version (10.7.1 as per documentation)

// correct code
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
// );

// //  Initialize Firebase
// firebase.initializeApp({
//   apiKey: "AIzaSyD0Hfy6mpaEuDYHQ1iAtKvYMy5DlN8D8yA",
//   authDomain: "formbuilderapp-39b8c.firebaseapp.com",
//   projectId: "formbuilderapp-39b8c",
//   storageBucket: "formbuilderapp-39b8c.firebasestorage.app",
//   messagingSenderId: "273257516409",
//   appId: "1:273257516409:web:9b74f80f580e7d006cf3a8",
// });

// const messaging = firebase.messaging();

// //  Handle background messages (when app is closed/minimized)
// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message:", payload);

//   const notificationTitle = payload.notification?.title || "New Notification";
//   const notificationOptions = {
//     body: payload.notification?.body || "",
//     icon: "/logo192.png",
//   };

//   // Show notification
//   self.registration.showNotification(notificationTitle, notificationOptions);

//   //  Store notification in localStorage (Documentation requirement)
//   try {
//     // Get existing notifications
//     let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

//     // Add new notification at the beginning
//     notifications.unshift({
//       title: notificationTitle,
//       body: notificationOptions.body,
//       timestamp: new Date().toISOString(),
//       read: false, // Mark as unread
//     });

//     // Save back to localStorage
//     localStorage.setItem("notifications", JSON.stringify(notifications));

//     // Trigger storage event for UI update
//     self.clients.matchAll().then((clients) => {
//       clients.forEach((client) => {
//         client.postMessage({
//           type: "NEW_NOTIFICATION",
//           notification: {
//             title: notificationTitle,
//             body: notificationOptions.body,
//           },
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Error storing notification:", error);
//   }
// });

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD0Hfy6mpaEuDYHQ1iAtKvYMy5DlN8D8yA",
  authDomain: "formbuilderapp-39b8c.firebaseapp.com",
  projectId: "formbuilderapp-39b8c",
  storageBucket: "formbuilderapp-39b8c.firebasestorage.app",
  messagingSenderId: "273257516409",
  appId: "1:273257516409:web:9b74f80f580e7d006cf3a8",
});

const messaging = firebase.messaging();

// FIXED: Handle background messages (Firebase Campaign notifications)
messaging.onBackgroundMessage(async (payload) => {
  console.log("📩 Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo192.png",
    badge: "/badge.png",
    vibrate: [200, 100, 200],
    tag: "notification-" + Date.now(),
  };

  try {
    // Show notification
    await self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );

    // Send message to React app (React will handle localStorage)
    const clients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    if (clients && clients.length > 0) {
      clients.forEach((client) => {
        client.postMessage({
          type: "FIREBASE_NOTIFICATION",
          notification: {
            title: notificationTitle,
            body: notificationOptions.body,
            timestamp: new Date().toISOString(),
            read: false,
          },
        });
      });
      console.log(" Message sent to", clients.length, "client(s)");
    } else {
      console.log("⚠️ No active clients found");
    }
  } catch (error) {
    console.error("❌ Error handling notification:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked");
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus existing window
      for (let client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
    })
  );
});
