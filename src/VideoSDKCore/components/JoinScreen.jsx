import React, { useState } from "react";
import { STORAGE_KEYS } from "../API";

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

    localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
    await getMeetingAndToken(meetingId || null, userName);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Your Name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={handleClick}>
        {meetingId ? "Join" : "Create Meeting"}
      </button>
    </div>
  );
}

export default JoinScreen;
