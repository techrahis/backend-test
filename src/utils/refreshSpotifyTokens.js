import axios from "axios";
import qs from "qs";

const SPOTIFY_API_URL = "https://accounts.spotify.com/api/token";

const refreshSpotifyAccessToken = async (user) => {
  try {
    // Encode client credentials
    const credentials = Buffer.from(
      `${user.spotifyClientId}:${user.spotifyClientSecret}`
    ).toString("base64");

    // Prepare request body
    const data = qs.stringify({
      grant_type: "refresh_token",
      refresh_token: user.spotifyRefreshToken,
    });

    // Send POST request to Spotify API
    const response = await axios.post(SPOTIFY_API_URL, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
    });

    const { access_token, expires_in } = response.data;

    // Update user with the new access token and expiration date
    user.spotifyAccessToken = access_token;
    user.spotifyAccessTokenExpiresAt = new Date(Date.now() + expires_in * 1000);
    await user.save();

    return access_token;
  } catch (error) {
    throw new Error("Error refreshing Spotify access token: " + error.message);
  }
};

export { refreshSpotifyAccessToken };
