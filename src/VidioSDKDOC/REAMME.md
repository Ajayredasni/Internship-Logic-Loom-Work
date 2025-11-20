# VideoSDK Prebuilt - Complete Implementation Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Features Implemented](#features-implemented)
5. [Configuration Details](#configuration-details)
6. [Code Implementation](#code-implementation)
7. [How to Run](#how-to-run)
8. [Features Breakdown](#features-breakdown)

---

## 🎯 Overview

This project implements VideoSDK Prebuilt v0.3.43 in a React application. Prebuilt SDK allows you to integrate real-time video communication without writing explicit code for UI components. VideoSDK provides a ready-to-use meeting interface with all features built-in.

### What is Prebuilt SDK?

- No custom UI needed - VideoSDK provides complete meeting interface
- 10-minute integration - Quick setup with minimal code
- All features included - Camera, mic, screen share, recording, chat, etc.

---

## ✅ Prerequisites

Before starting, ensure you have:

1. Node.js installed (v14 or higher)
2. React project set up
3. VideoSDK API Key (Get from: https://app.videosdk.live/signup)

---

## 📦 Installation Steps

### Step 1: Create React App (if not already created)

```bash
npx create-react-app videosdk-prebuilt-demo
cd videosdk-prebuilt-demo
```

### Step 2: No Package Installation Required!

Prebuilt SDK loads via CDN script tag. No npm packages needed.

### Step 3: Get API Key

1. Go to https://app.videosdk.live/signup
2. Sign up and create account
3. Copy your API Key from dashboard

---

## 🚀 Features Implemented

All features from VideoSDK Prebuilt Documentation (v0.3.43):

### ✅ Basic Features

- [x] Join Screen - Custom join screen with meeting title and URL
- [x] Camera Controls - Enable/disable webcam, toggle self camera
- [x] Mic Controls - Enable/disable microphone, toggle self mic
- [x] Screen Share - Share screen with audio support
- [x] Chat - Send messages to participants
- [x] Raise Hand - Virtual hand raise feature
- [x] Leave Meeting - Leave with redirect URL
- [x] Left Screen - Custom screen after leaving meeting

### ✅ Advanced Features

- [x] Recording - Record meetings with custom layout
- [x] Live Streaming - Go live on Facebook/YouTube
- [x] HLS Streaming - Broadcast to viewers
- [x] Whiteboard - Interactive drawing board
- [x] Virtual Background - Blur or custom image backgrounds
- [x] AI Noise Removal - Filter background noise (BETA)
- [x] Live Polls - Create and participate in polls
- [x] Pin Participants - Pin important participants
- [x] Remove Participant - Remove users from meeting
- [x] End Meeting - Host can end meeting for all
- [x] Change Layout - Switch between Grid/Sidebar/Spotlight
- [x] Theme - Dark/Light/Default themes
- [x] Max Resolution - Set video quality (SD/HD)

### ✅ Permissions

- [x] Toggle recording
- [x] Toggle live streaming
- [x] Toggle HLS
- [x] Toggle participant mode (Co-host)
- [x] Toggle virtual background
- [x] Toggle noise removal
- [x] Create polls
- [x] Change layout
- [x] Draw on whiteboard
- [x] Toggle whiteboard
- [x] Pin participants
- [x] Remove participants
- [x] End meeting

---

## ⚙️ Configuration Details

### Complete Config Object

```javascript
const config = {
  // Basic Settings
  name: "Demo User",
  meetingId: "milkyway",
  apiKey: "YOUR_API_KEY_HERE",
  containerId: null,

  // Theme
  theme: "DARK", // "DARK" | "LIGHT" | "DEFAULT"

  // Meeting Mode
  mode: "CONFERENCE", // "VIEWER" | "CONFERENCE"

  // Camera Controls
  webcamEnabled: false,
  participantCanToggleSelfWebcam: true,
  maxResolution: "sd", // "sd" | "hd"

  // Mic Controls
  micEnabled: false,
  participantCanToggleSelfMic: true,

  // Screen Share
  screenShareEnabled: true,

  // Whiteboard
  whiteboardEnabled: true,

  // Chat and Raise Hand
  chatEnabled: true,
  raiseHandEnabled: true,

  // Leave Meeting
  participantCanLeave: true,
  redirectOnLeave: "https://www.videosdk.live/",

  // Recording Configuration
  recording: {
    enabled: true,
    webhookUrl: "https://www.videosdk.live/callback",
    autoStart: false,
    theme: "DARK",
    layout: {
      type: "SIDEBAR",
      priority: "PIN",
      gridSize: 3,
    },
  },

  // Livestream Configuration
  livestream: {
    autoStart: true,
    enabled: true,
    theme: "DARK",
  },

  // HLS Configuration
  hls: {
    enabled: true,
    autoStart: false,
    theme: "DARK",
    playerControlsVisible: true,
  },

  // Permissions
  permissions: {
    pin: true,
    removeParticipant: true,
    endMeeting: true,
    toggleRecording: true,
    toggleLivestream: true,
    toggleHls: true,
    toggleParticipantMode: true,
    toggleVirtualBackground: true,
    canToggleNoiseRemoval: true,
    canCreatePoll: true,
    changeLayout: true,
    drawOnWhiteboard: true,
    toggleWhiteboard: true,
  },

  // Layout Configuration
  layout: {
    type: "SIDEBAR", // "SPOTLIGHT" | "SIDEBAR" | "GRID"
    priority: "PIN", // "SPEAKER" | "PIN"
    gridSize: 3,
  },

  // Join Screen Configuration
  joinScreen: {
    visible: true,
    title: "Daily scrum",
    meetingUrl: "customURL.com",
  },

  // Left Screen Configuration
  leftScreen: {
    actionButton: {
      label: "Video SDK",
      href: "https://videosdk.live/",
    },
    rejoinButtonEnabled: true,
  },
};
```

---

## 💻 Code Implementation

### Complete React Component: `VideoSDKMeeting.jsx`

```jsx
import React, { useEffect, useRef, useState } from "react";

const VideoSDKMeeting = () => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.VideoSDKMeeting) {
      setSdkLoaded(true);
      return;
    }

    // Create and load the VideoSDK script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.43/rtc-js-prebuilt.js";

    script.addEventListener("load", function (event) {
      setSdkLoaded(true);
    });

    script.addEventListener("error", function (event) {
      setError("Failed to load VideoSDK script");
    });

    document.getElementsByTagName("head")[0].appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid reloading
    };
  }, []);

  useEffect(() => {
    if (sdkLoaded && window.VideoSDKMeeting && !meeting) {
      try {
        const config = {
          name: "Demo User",
          meetingId: "milkyway",
          apiKey: "YOUR_API_KEY_HERE", // Replace with your actual API key

          containerId: null,

          // Meeting Theme
          theme: "DARK", // "DARK" || "LIGHT" || "DEFAULT"

          // Meeting Mode
          mode: "CONFERENCE", // "VIEWER" || "CONFERENCE"

          // Camera Controls
          webcamEnabled: false,
          participantCanToggleSelfWebcam: true,
          maxResolution: "sd",

          // Mic Controls
          micEnabled: false,
          participantCanToggleSelfMic: true,

          // Screen Share
          screenShareEnabled: true,

          // Whiteboard
          whiteboardEnabled: true,

          // Chat and Raise Hand
          chatEnabled: true,
          raiseHandEnabled: true,

          // Leave Meeting
          participantCanLeave: true,
          redirectOnLeave: "https://www.videosdk.live/",

          // Recording Configuration
          recording: {
            enabled: true,
            webhookUrl: "https://www.videosdk.live/callback",
            autoStart: false,
            theme: "DARK",

            layout: {
              type: "SIDEBAR",
              priority: "PIN",
              gridSize: 3,
            },
          },

          // Livestream Configuration
          livestream: {
            autoStart: true,
            enabled: true,
            theme: "DARK",
          },

          // HLS Configuration
          hls: {
            enabled: true,
            autoStart: false,
            theme: "DARK",
            playerControlsVisible: true,
          },

          // Permissions
          permissions: {
            pin: true,
            removeParticipant: true,
            endMeeting: true,
            toggleRecording: true,
            toggleLivestream: true,
            toggleHls: true,
            toggleParticipantMode: true,
            toggleVirtualBackground: true,
            canToggleNoiseRemoval: true,
            canCreatePoll: true,
            changeLayout: true,
            drawOnWhiteboard: true,
            toggleWhiteboard: true,
          },

          // Layout Configuration
          layout: {
            type: "SIDEBAR", // "SPOTLIGHT" | "SIDEBAR" | "GRID"
            priority: "PIN", // "SPEAKER" | "PIN"
            gridSize: 3,
          },

          // Join Screen Configuration
          joinScreen: {
            visible: true,
            title: "Daily scrum",
            meetingUrl: "customURL.com",
          },

          // Left Screen Configuration
          leftScreen: {
            actionButton: {
              label: "Video SDK",
              href: "https://videosdk.live/",
            },
            rejoinButtonEnabled: true,
          },
        };

        const meetingInstance = new window.VideoSDKMeeting();
        meetingInstance.init(config);
        setMeeting(meetingInstance);
      } catch (err) {
        setError("Failed to initialize meeting: " + err.message);
      }
    }
  }, [sdkLoaded, meeting]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {!sdkLoaded && !error && (
          <div className="bg-gray-800 text-white p-8 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading VideoSDK...</p>
          </div>
        )}

        {sdkLoaded && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div ref={containerRef} id="videosdk-container"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSDKMeeting;
```

### App.js Integration

```jsx
import React from "react";
import VideoSDKMeeting from "./VideoSDKMeeting";

function App() {
  return (
    <div className="App">
      <VideoSDKMeeting />
    </div>
  );
}

export default App;
```

---

## 🏃 How to Run

### Step 1: Replace API Key

Open `VideoSDKMeeting.jsx` and replace:

```javascript
apiKey: "YOUR_API_KEY_HERE";
```

with your actual API key.

### Step 2: Start Development Server

```bash
npm start
```

### Step 3: Open in Browser

Navigate to: `http://localhost:3000`

### Step 4: Join Meeting

1. Join screen will appear with "Daily scrum" title
2. Enable camera/mic if needed
3. Click "Join" to start meeting
4. Meeting ID: `milkyway` (you can change this)

---

## 📖 Features Breakdown

### 1. Join Screen

What it does: Shows a pre-meeting screen where users can test camera/mic before joining.

Configuration:

```javascript
joinScreen: {
  visible: true,           // Show join screen
  title: "Daily scrum",    // Meeting title
  meetingUrl: "customURL.com", // Meeting URL
}
```

How it works:

- If `visible: true` → Join screen appears
- If `visible: false` → Click anywhere to join

---

### 2. Camera Controls

What it does: Control webcam settings and permissions.

Configuration:

```javascript
webcamEnabled: false,  // Camera off by default
participantCanToggleSelfWebcam: true,  // Allow user to toggle
maxResolution: "sd",  // "sd" (360p) or "hd" (720p)
```

Features:

- Toggle camera on/off
- Set video quality (SD/HD)
- Control who can toggle camera

---

### 3. Mic Controls

What it does: Control microphone settings and permissions.

Configuration:

```javascript
micEnabled: false,  // Mic off by default
participantCanToggleSelfMic: true,  // Allow user to toggle
```

Features:

- Mute/unmute microphone
- Control who can toggle mic

---

### 4. Screen Share

What it does: Share screen/window/tab with other participants.

Configuration:

```javascript
screenShareEnabled: true,  // Enable screen share button
```

Features:

- Share entire screen
- Share specific window
- Share Chrome tab with audio

---

### 5. Chat

What it does: Send text messages to participants.

Configuration:

```javascript
chatEnabled: true,  // Enable chat feature
```

Features:

- Send messages to all participants
- View message history
- Real-time messaging

---

### 6. Raise Hand

What it does: Virtual hand raise to get attention.

Configuration:

```javascript
raiseHandEnabled: true,  // Enable raise hand button
```

Features:

- Raise/lower hand
- Visible to all participants

---

### 7. Recording

What it does: Record meeting audio and video.

Configuration:

```javascript
recording: {
  enabled: true,  // Show recording button
  webhookUrl: "https://www.videosdk.live/callback",  // Webhook for notifications
  autoStart: false,  // Don't start automatically
  theme: "DARK",  // Recording theme
  layout: {
    type: "SIDEBAR",  // Layout type
    priority: "PIN",  // Prioritize pinned participants
    gridSize: 3,  // Number of participants on screen
  },
},
permissions: {
  toggleRecording: true,  // Allow starting/stopping
}
```

Layout Types:

- GRID - Equal grid layout
- SIDEBAR - Main view + sidebar
- SPOTLIGHT - Focus on pinned participants

---

### 8. Live Streaming (YouTube/Facebook)

What it does: Broadcast meeting to social media platforms.

Configuration:

```javascript
livestream: {
  autoStart: true,  // Auto start when meeting begins
  enabled: true,  // Enable livestream feature
  theme: "DARK",  // Stream theme
},
permissions: {
  toggleLivestream: true,  // Allow adding platforms
}
```

How to use:

1. Click "Go Live" button
2. Click "Add Live Streams"
3. Enter platform details (YouTube/Facebook stream key)
4. Start streaming

---

### 9. HLS Streaming

What it does: Broadcast to viewers via HLS protocol.

Configuration:

```javascript
mode: "CONFERENCE",  // Or "VIEWER"
hls: {
  enabled: true,  // Enable HLS
  autoStart: false,  // Manual start
  theme: "DARK",  // Theme
  playerControlsVisible: true,  // Show player controls
},
permissions: {
  toggleHls: true,  // Allow starting HLS
  toggleParticipantMode: true,  // Add co-hosts
}
```

Modes:

- CONFERENCE - Full meeting with HLS streaming option
- VIEWER - Watch-only mode with HLS player

---

### 10. Whiteboard

What it does: Interactive drawing board for collaboration.

Configuration:

```javascript
whiteboardEnabled: true,  // Enable whiteboard
permissions: {
  drawOnWhiteboard: true,  // Allow drawing
  toggleWhiteboard: true,  // Allow starting/stopping
}
```

Features:

- Draw shapes and text
- Multiple colors
- Erase and clear
- Real-time collaboration

---

### 11. Virtual Background

What it does: Blur background or use custom images.

Configuration:

```javascript
permissions: {
  toggleVirtualBackground: true,  // Enable feature
}
```

Features:

- Blur effect
- Custom image backgrounds
- Remove background effect

Supported Browsers: Chrome, Safari, Firefox, Brave

---

### 12. AI Noise Removal (BETA)

What it does: Filter background noise from audio.

Configuration:

```javascript
permissions: {
  canToggleNoiseRemoval: true,  // Enable noise removal
}
```

How to use:

- Click on mic dropdown
- Select "AI Noise Removal"
- Background noise filtered

---

### 13. Live Polls

What it does: Create and participate in polls during meeting.

Configuration:

```javascript
permissions: {
  canCreatePoll: true,  // Allow creating polls
}
```

Features:

- Create polls with multiple options
- Participants vote
- View real-time results

---

### 14. Pin Participants

What it does: Highlight important participants.

Configuration:

```javascript
permissions: {
  pin: true,  // Allow pinning
}
```

Features:

- Pin/unpin participants
- Pinned participants appear prominently
- Affects layout priority

---

### 15. Remove Participant

What it does: Remove users from meeting.

Configuration:

```javascript
permissions: {
  removeParticipant: true,  // Allow removal
}
```

How to use:

- Click participant menu
- Click remove icon
- Participant is removed

---

### 16. End Meeting

What it does: Host ends meeting for everyone.

Configuration:

```javascript
permissions: {
  endMeeting: true,  // Allow ending meeting
}
```

Features:

- End meeting for all participants
- All users are disconnected

---

### 17. Change Layout

What it does: Switch between different view layouts.

Configuration:

```javascript
permissions: {
  changeLayout: true,  // Allow changing layout
},
layout: {
  type: "SIDEBAR",  // Default layout
  priority: "PIN",  // Priority setting
  gridSize: 3,  // Grid size
}
```

Layout Types:

1. GRID - Equal grid, pinned on top
2. SIDEBAR - Main view + sidebar (only pinned visible)
3. SPOTLIGHT - Only pinned participants

---

### 18. Theme

What it does: Change UI appearance.

Configuration:

```javascript
theme: "DARK",  // "DARK" | "LIGHT" | "DEFAULT"
```

Options:

- DARK - Dark theme
- LIGHT - Light theme
- DEFAULT - System default

---

### 19. Left Screen

What it does: Custom screen shown after leaving meeting.

Configuration:

```javascript
leftScreen: {
  actionButton: {
    label: "Video SDK",  // Button text
    href: "https://videosdk.live/",  // Button link
  },
  rejoinButtonEnabled: true,  // Show rejoin button
}
```

Features:

- Custom action button
- Rejoin meeting option
- Or redirect via `redirectOnLeave`

---

## 🎓 Implementation Steps Followed

### Step 1: Documentation Study

- Read VideoSDK Prebuilt documentation (v0.3.43)
- Understood all features and configuration options

### Step 2: HTML to React Conversion

- Converted HTML script tag approach to React hooks
- Used `useEffect` for script loading
- Used `useState` for state management

### Step 3: Configuration Setup

- Created complete config object with all features
- Matched exactly with documentation examples

### Step 4: Feature Implementation

Added features in this order:

1. Basic setup (script loading, initialization)
2. Join screen
3. Camera & mic controls
4. Screen share
5. Chat & raise hand
6. Leave meeting
7. Recording
8. Live streaming
9. HLS
10. Whiteboard
11. Virtual background
12. AI noise removal
13. Live polls
14. Pin/remove/end meeting
15. Layout options
16. Theme
17. Left screen

### Step 5: Testing

- Verified all buttons appear correctly
- Tested feature toggles
- Confirmed UI matches documentation screenshots

---

## 📚 Documentation References

All features implemented according to:

- VideoSDK Prebuilt Documentation v0.3.43
- Official URL: https://docs.videosdk.live/prebuilt/guide/prebuilt-video-and-audio-calling

---

## 🔑 Important Notes

1. API Key Required: Replace `YOUR_API_KEY_HERE` with actual API key
2. Meeting ID: Change `milkyway` to your preferred meeting ID
3. CDN Version: Using v0.3.43 (locked version for stability)
4. Browser Support: Works best on Chrome, Firefox, Safari, Brave
5. No Package Installation: Everything loads via CDN

---

## 🎯 Summary

This implementation provides a complete video conferencing solution using VideoSDK Prebuilt:

- ✅ 15+ Features - All major features enabled
- ✅ Zero UI Code - VideoSDK provides complete interface
- ✅ Production Ready - All permissions and settings configured
- ✅ React Integration - Clean React component implementation
- ✅ Documentation Match - 100% aligned with official docs

Total Implementation Time: ~10 minutes (as promised by VideoSDK!)

---

## Support

For issues or questions:

- VideoSDK Documentation: https://docs.videosdk.live
- VideoSDK Support: https://www.videosdk.live/contact

---

Created with using VideoSDK Prebuilt v0.3.43
