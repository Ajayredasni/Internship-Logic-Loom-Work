// API Configuration
const API_BASE_URL = "https://api.videosdk.live/v2";

// Default Auth Token (No Backend Required)
export const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0ODI2NmFjNS01YTM3LTQxYjAtYTkwMi1hNTE1ZTcxODRmOTQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sInJvbGVzIjpbInJ0YyJdLCJpYXQiOjE3NjIzMTM3MjAsImV4cCI6MTc5Mzg0OTcyMH0.QR_QS_zaZHZrcDFnaqXhFEGjouPq9cZnfyIiUxfDFeE";

// LocalStorage keys
export const STORAGE_KEYS = {
  USER_NAME: "videosdk_user_name",
};

// Create Meeting API
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
