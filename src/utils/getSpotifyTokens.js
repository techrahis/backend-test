// This function retrieves the access and refresh tokens from Spotify using the authorization code flow.
// It uses the axios library to make a POST request to the Spotify API with the necessary parameters and headers.
// The function takes the authorization code as an argument and returns the response data containing the tokens.

import axios from "axios";

const getSpotifyTokens = async (code) => {
  const clientId = "48429b48aac64bab91b07d444b5fb317";
  const clientSecret = "4b191af43e0349988513af7a74754750";
  const redirectUri = "http://localhost:5678/api/v1/spotify/callback";

  const token = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${token}`,
        },
      }
    );

    console.log("Access Token:", res.data.access_token);
    console.log("Refresh Token:", res.data.refresh_token);
    return res.data;
  } catch (err) {
    console.error("Error getting tokens:", err.response?.data || err.message);
  }
};
