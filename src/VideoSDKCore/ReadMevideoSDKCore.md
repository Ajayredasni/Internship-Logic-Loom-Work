# VideoSDK Core (Custom SDK) - React Implementation Guide

Complete step-by-step guide to implement VideoSDK Core in React application from scratch.

---

## 📋 Table of Contents

1. [What is VideoSDK Core?](#what-is-videosdk-core)
2. [Difference: Core vs Prebuilt](#difference-core-vs-prebuilt)
3. [Prerequisites](#prerequisites)
4. [Project Setup](#project-setup)
5. [File Structure](#file-structure)
6. [Step-by-Step Implementation](#step-by-step-implementation)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)

---

## 🎥 What is VideoSDK Core?

VideoSDK Core (also called Custom SDK) is a low-level video conferencing SDK that gives you complete control over UI and functionality.

Key Features:

- Build your own custom UI
- Full control over every feature
- Use React hooks and components
- Flexible and highly customizable

Official Website: https://www.videosdk.live/

---

## 🔄 Difference: Core vs Prebuilt

| Feature        | VideoSDK Core (Custom) | Prebuilt SDK           |
| -------------- | ---------------------- | ---------------------- |
| UI             | Build yourself         | Ready-made UI          |
| Setup Time     | 1-2 hours              | 10-15 minutes          |
| Code Required  | 200-500 lines          | 50-100 lines           |
| Customization  | 100% control           | Limited (config-based) |
| Complexity     | Medium to High         | Low                    |
| Use Case       | Custom requirements    | Quick implementation   |
| Learning Curve | Steeper                | Easy                   |

When to use Core SDK:

- Need custom UI/UX
- Specific business requirements
- Full control over features
- Want to learn VideoSDK deeply

When to use Prebuilt SDK:

- Quick implementation needed
- Standard meeting UI is fine
- Limited development time
- Proof of concept

---

## ✅ Prerequisites

Before starting, ensure you have:

### 1. **Node.js & NPM**

```bash
node --version  # v14 or higher
npm --version   # v6 or higher
```

### 2. React Knowledge

- React Hooks: `useState`, `useEffect`, `useRef`
- Component architecture
- Props and state management

### 3. VideoSDK Account & Token

- Sign up: https://app.videosdk.live/
- Go to API section in Dashboard
- Click "Generate Token"
- Copy the token (we'll use it directly in code)

### 4. Basic Understanding

- JavaScript ES6+
- MediaStream API (audio/video)
- REST APIs

---

## 📦 Project Setup

### Step 1: Create React App

```bash
npx create-react-app videosdk-core-app
cd videosdk-core-app
```

### Step 2: Install VideoSDK Package

```bash
npm install @videosdk.live/react-sdk
```

### Step 3: Verify Installation

Check `package.json`:

```json
{
  "dependencies": {
    "@videosdk.live/react-sdk": "^0.1.x",
    "react": "^18.x.x"
  }
}
```

---

## 📁 File Structure

Create this folder structure:

```
videosdk-core-app/
├── node_modules/
├── public/
├── src/
│   ├── api/
│   │   └── api.js              # API calls & default token
│   ├── components/
│   │   ├── JoinScreen.js       # Join/Create meeting screen
│   │   ├── MeetingView.js      # Main meeting container
│   │   ├── ParticipantView.js  # Individual participant
│   │   └── Controls.js         # Mic/Camera/Leave controls
│   ├── App.js                  # Main app component
│   ├── App.css                 # Styling
│   └── index.js                # Entry point
├── package.json
└── README.md
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Setup API with Default Token

File: `src/api/api.js`

This file handles:

- ✅ Default hardcoded authentication token (NO BACKEND)
- ✅ Meeting creation API
- ✅ LocalStorage keys for user name

```javascript
// API Configuration
const API_BASE_URL = "https://api.videosdk.live/v2";

// ⭐ Default Auth Token - Replace with YOUR token from dashboard
// No backend required! Token is directly used here.
export const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0ODI2NmFjNS01YTM3LTQxYjAtYTkwMi1hNTE1ZTcxODRmOTQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sInJvbGVzIjpbInJ0YyJdLCJpYXQiOjE3NjIzMTM3MjAsImV4cCI6MTc5Mzg0OTcyMH0.QR_QS_zaZHZrcDFnaqXhFEGjouPq9cZnfyIiUxfDFeE";

// LocalStorage keys
export const STORAGE_KEYS = {
  USER_NAME: "videosdk_user_name",
};

// Create Meeting API - Calls VideoSDK directly
export const createMeeting = async () => {
  const res = await fetch(`${API_BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const { roomId } = await res.json();
  return roomId;
};
```

⚠️ Important:

- Replace `AUTH_TOKEN` with your token from VideoSDK Dashboard
- No backend server needed!
- Token is used directly in frontend (for development/testing only)

How to get your token:

1. Visit https://app.videosdk.live/
2. Login/Signup
3. Go to "API" section
4. Click "Generate Token"
5. Copy and paste above

---

### Step 2: Create Join Screen Component

File: `src/components/JoinScreen.js`

User can:

- Enter name (saved in localStorage)
- Enter Meeting ID to join existing meeting
- Or leave empty to create new meeting

```javascript
import React, { useState } from "react";
import { STORAGE_KEYS } from "../api/api";

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState("");
  const [userName, setUserName] = useState(
    localStorage.getItem(STORAGE_KEYS.USER_NAME) || ""
  );

  const handleClick = async () => {
    if (!userName.trim()) {
      alert("Please enter your name");
      return;
    }

    // Save name to localStorage (persists across sessions)
    localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);

    // Call parent function to create/join meeting
    await getMeetingAndToken(meetingId || null, userName);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Meeting Id"
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
      />
      <button onClick={handleClick}>
        {meetingId ? "Join" : "Create Meeting"}
      </button>
    </div>
  );
}

export default JoinScreen;
```

What happens:

1. Name stored in localStorage (so you don't have to type again)
2. If Meeting ID entered → Join that meeting
3. If Meeting ID empty → Create new meeting

---

### Step 3: Create Participant View Component

File: `src/components/ParticipantView.js`

Displays each participant with video/audio:

```javascript
import React, { useEffect, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

function ParticipantView({ participantId }) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  // Handle microphone audio
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("micRef.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  // Handle webcam video
  useEffect(() => {
    const videoElement = document.getElementById(`video-${participantId}`);
    if (videoElement) {
      if (webcamOn && webcamStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        videoElement.srcObject = mediaStream;
        videoElement
          .play()
          .catch((error) => console.error("video play failed", error));
      } else {
        videoElement.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn, participantId]);

  return (
    <div>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <video
          id={`video-${participantId}`}
          autoPlay
          playsInline
          muted={isLocal}
          style={{
            height: "300px",
            width: "300px",
          }}
        />
      )}
    </div>
  );
}

export default ParticipantView;
```

Key Points:

- `useParticipant()` hook gives us participant data
- `useRef` for audio element reference
- MediaStream API to attach audio/video tracks
- `muted={isLocal}` prevents echo (mute your own audio)

---

### Step 4: Create Controls Component

File: `src/components/Controls.js`

Simple controls for meeting:

```javascript
import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
    </div>
  );
}

export default Controls;
```

Methods:

- `leave()` - Exit meeting
- `toggleMic()` - Mute/unmute microphone
- `toggleWebcam()` - Turn camera on/off

---

### Step 5: Create Meeting View Component

File: `src/components/MeetingView.js`

Main container for the meeting:

```javascript
import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";

function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(null);

  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      onMeetingLeave();
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {meetingId}</h3>
      {joined && joined === "JOINED" ? (
        <div>
          <Controls />
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

export default MeetingView;
```

Flow:

1. Show "Join" button initially
2. Click → "Joining the meeting..."
3. After joined → Show controls + participants

---

### Step 6: Create Main App Component

**File: `src/App.js`**

Connects everything together:

```javascript
import React, { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import JoinScreen from "./components/JoinScreen";
import MeetingView from "./components/MeetingView";
import { AUTH_TOKEN, createMeeting } from "./api/api";
import "./App.css";

function App() {
  const [meetingId, setMeetingId] = useState(null);
  const [userName, setUserName] = useState(null);

  const getMeetingAndToken = async (id, name) => {
    try {
      // Create new meeting if no ID provided, else use provided ID
      const newMeetingId = id || (await createMeeting());
      setMeetingId(newMeetingId);
      setUserName(name);
    } catch (error) {
      console.error("Error creating/joining meeting:", error);
      alert("Failed to create/join meeting. Please try again.");
    }
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return AUTH_TOKEN && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: userName || "C.V. Raman",
      }}
      token={AUTH_TOKEN}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;
```

What happens:

- If no meetingId → Show JoinScreen
- If meetingId exists → Wrap with MeetingProvider and show MeetingView
- MeetingProvider gives context to all child components

---

### Step 7: Add Simple Styling

**File: `src/App.css`**

```css
.container {
  padding: 20px;
}

input {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 300px;
}

button {
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

h3 {
  margin-bottom: 10px;
}

p {
  margin: 5px 0;
}

video {
  display: block;
  margin: 10px 0;
  border: 2px solid #000;
}
```

---

## 🧪 Testing the Application

### Step 1: Start Development Server

```bash
npm start
```

Browser will automatically open at `http://localhost:3000`

---

### Step 2: Test Single User

1. Enter your name (e.g., "Amit")
2. Leave Meeting ID empty
3. Click "Create Meeting"
4. Click "Join" button
5. Allow camera/mic permissions in browser
6. You should see your video!

---

### Step 3: Test Multiple Users (Same Device)

Method 1: Two Browser Tabs

Tab 1 (Normal Browser):

1. Enter name "User 1"
2. Create meeting
3. Note the Meeting ID displayed (e.g., "abc-xyz-123")

Tab 2 (Incognito/Private Window):

1. Open incognito window: `Ctrl+Shift+N` (Chrome) or `Ctrl+Shift+P` (Firefox)
2. Go to `http://localhost:3000`
3. Enter name "User 2"
4. Enter the Meeting ID from Tab 1
5. Click "Join"

Result: Both users should see each other's video!

---

### Step 4: Test Multiple Users (Different Devices)

Device 1:

1. Create meeting
2. Note Meeting ID (e.g., "abc-xyz-123")

Device 2:

1. Open `http://YOUR_IP:3000` (find IP using `ipconfig` or `ifconfig`)
2. Enter Meeting ID from Device 1
3. Join meeting

Find Your IP:

```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

---

### Step 5: Test Controls

- Toggle Mic: Audio should mute/unmute
- Toggle Webcam: Video should turn on/off
- Leave: Should return to join screen

---

## 🔧 Troubleshooting

### Issue 1: Token Invalid

Error: "Token is invalid or expired"

Solution:

1. Go to https://app.videosdk.live/
2. Login and go to API section
3. Generate new token
4. Copy and replace in `src/api/api.js`:

```javascript
export const AUTH_TOKEN = "YOUR_NEW_TOKEN_HERE";
```

---

### Issue 2: Camera/Mic Permission Denied

Error: Video/audio not showing

Solution:

1. Click lock icon in browser address bar
2. Allow camera and microphone permissions
3. Refresh page
4. Try again

Note: Only works on `localhost` or `https://` domains

---

### Issue 3: Video Too Large

Problem: Video overflows screen

Solution:
Adjust size in `ParticipantView.js`:

```javascript
<video
  style={{
    height: "200px", // Reduce this
    width: "200px", // Reduce this
  }}
/>
```

---

### Issue 4: Can't Join Same Meeting

Problem: Second user can't join

Check:

1. Both using same Meeting ID? (copy-paste carefully)
2. Both using valid token?
3. Check browser console for errors

---

### Issue 5: Audio Echo

Problem: Hearing own voice

Solution:
Already fixed! Check this line in `ParticipantView.js`:

```javascript
<audio ref={micRef} autoPlay playsInline muted={isLocal} />
```

The `muted={isLocal}` prevents echo by muting your own audio.

---

### Issue 6: Meeting Not Creating

Error: Failed to create meeting

Check:

1. Valid token in `api.js`?
2. Internet connection working?
3. Check browser console for error details

---

## 📚 What We Built

### Architecture

```
App.js
  ↓
├─ JoinScreen (Initial)
│   ├─ Name Input (localStorage)
│   ├─ Meeting ID Input
│   └─ Create/Join Button
│
└─ MeetingProvider + MeetingView (After Join)
    ├─ Meeting ID Display
    ├─ Controls
    │   ├─ Leave
    │   ├─ Toggle Mic
    │   └─ Toggle Webcam
    └─ ParticipantView (for each participant)
        ├─ Name + Status
        ├─ Audio Element
        └─ Video Element (300x300)
```

---

### Key Points

1. ✅ No Backend Required

   - Token hardcoded in `api.js`
   - Direct API calls to VideoSDK
   - localStorage for user name only

2. ✅ Simple UI

   - Basic inputs and buttons
   - 300x300 video size
   - Simple CSS styling

3. ✅ Core Hooks Used

   - `useMeeting()` - Meeting control
   - `useParticipant()` - Participant data

4. ✅ MediaStream API
   - Audio via `<audio>` element
   - Video via `<video>` element
   - Manual track attachment

---

## 📖 Additional Resources

### Official Documentation

- VideoSDK Docs: https://docs.videosdk.live/
- React SDK: https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/getting-started
- API Reference: https://docs.videosdk.live/api-reference/realtime-communication/intro

### Support

- Dashboard: https://app.videosdk.live/
- Discord: https://discord.gg/videosdk
- Email: support@videosdk.live

---

## 🎓 Summary

### What You Learned:

1. ✅ How to use VideoSDK Core in React
2. ✅ Component structure for video calling
3. ✅ Using `useMeeting` and `useParticipant` hooks
4. ✅ MediaStream API for audio/video
5. ✅ localStorage for data persistence
6. ✅ No backend required approach

### Files Created:

```
src/
├── api/
│   └── api.js (Token + API)
├── components/
│   ├── JoinScreen.js
│   ├── MeetingView.js
│   ├── ParticipantView.js
│   └── Controls.js
├── App.js (Main)
└── App.css (Styling)
```

### Total Lines: ~200 lines of code! 🎉

---

Build amazing video calling apps with VideoSDK Core!
