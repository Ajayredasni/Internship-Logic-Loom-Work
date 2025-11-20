import React, { useEffect, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

function ParticipantView({ participantId }) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

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
