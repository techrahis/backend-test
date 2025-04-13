import axios from "axios";

const SPOTIFY_API_URL = "https://accounts.spotify.com/api/token";

// Refresh Spotify Access Token using the refresh token
const refreshSpotifyAccessToken = async (user) => {
  try {
    const response = await axios.post(SPOTIFY_API_URL, null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken,
        client_id: user.spotifyClientId,
        client_secret: user.spotifyClientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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
