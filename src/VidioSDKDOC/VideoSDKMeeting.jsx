import React, { useEffect, useRef, useState } from "react";

const VideoSDKMeeting = () => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.VideoSDKMeeting) {
      setSdkLoaded(true);
      return;
    }

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

    return () => {};
  }, []);

  useEffect(() => {
    if (sdkLoaded && window.VideoSDKMeeting && !meeting) {
      try {
        const config = {
          name: "Demo User",
          meetingId: "milkyway",
          apiKey: "48266ac5-5a37-41b0-a902-a515e7184f94",

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
          whiteboardEnabled: true, // ✨ NEW: Enable whiteboard feature

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
            drawOnWhiteboard: true, // ✨ NEW: Allow drawing on whiteboard
            toggleWhiteboard: true, // ✨ NEW: Allow starting/stopping whiteboard
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
