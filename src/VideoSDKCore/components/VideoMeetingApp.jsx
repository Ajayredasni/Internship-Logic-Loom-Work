import React, { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import JoinScreen from "./JoinScreen";
import MeetingView from "./MeetingView";
import { AUTH_TOKEN, createMeeting } from "../API";
import "./VideoMeetingApp.css";

function VideoMeetingApp() {
  const [meetingId, setMeetingId] = useState(null);
  const [userName, setUserName] = useState(null);

  const getMeetingAndToken = async (id, name) => {
    try {
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

export default VideoMeetingApp;
