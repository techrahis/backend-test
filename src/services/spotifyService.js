import axios from "axios";
import { User } from "../models/index.js";
import { refreshSpotifyAccessToken } from "../utils/refreshSpotifyTokens.js";
import redis from "../config/redisConfig.js";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// Function to get Spotify access token and refresh it if expired
const getSpotifyAccessToken = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user || !user.spotifyAccessToken) {
    throw new Error("User's Spotify access token not found.");
  }

  // Check if the access token has expired
  const now = new Date();
  if (
    !user.spotifyAccessTokenExpiresAt ||
    user.spotifyAccessTokenExpiresAt < now
  ) {
    // Refresh the access token if expired
    const newAccessToken = await refreshSpotifyAccessToken(user);
    return newAccessToken; // Return the new access token
  }

  return user.spotifyAccessToken;
};

// Get top tracks from Spotify with 3hr Redis caching TTL
const getTopTracks = async (userId) => {
  const cacheKey = `${userId}:spotify:top-tracks`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const accessToken = await getSpotifyAccessToken(userId);
  const response = await axios.get(`${SPOTIFY_API_URL}/me/top/artists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const topItems = response.data.items.slice(0, 10);

  // Cache for 3 hours = 10800 seconds
  await redis.set(cacheKey, JSON.stringify(topItems), "EX", 10800);

  return topItems;
};

// Get currently playing song from Spotify
const getNowPlaying = async (userId) => {
  const cacheKey = `${userId}:spotify:now-playing`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const accessToken = await getSpotifyAccessToken(userId);
  const response = await axios.get(
    `${SPOTIFY_API_URL}/me/player/currently-playing`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = response.data;

  // Cache for 30 seconds
  await redis.set(cacheKey, JSON.stringify(data), "EX", 30);

  return data;
};

// Play a song on Spotify
const playSong = async (userId, trackUri) => {
  const accessToken = await getSpotifyAccessToken(userId);

  try {
    await axios.put(
      `${SPOTIFY_API_URL}/me/player/play`,
      {
        uris: [trackUri],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    if (error.response && error.response.status === 403) {
      // Specific handling for Spotify Premium required
      throw new Error(
        "Spotify Premium is required to play, pause, or skip songs."
      );
    }
    // Rethrow other errors
    throw new Error("Error stopping song on Spotify: " + error.message);
  }
};

// Stop the current song on Spotify
const pauseCurrentSong = async (userId) => {
  const accessToken = await getSpotifyAccessToken(userId);

  try {
    // Get the list of available devices
    const devicesResponse = await axios.get(
      `${SPOTIFY_API_URL}/me/player/devices`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const devices = devicesResponse.data.devices;

    // Check if there is an active device
    const activeDevice = devices.find((device) => device.is_active);

    if (!activeDevice) {
      throw new Error("No active device found to stop the song.");
    }

    // Pause the song on the active device
    await axios.put(
      `${SPOTIFY_API_URL}/me/player/pause?device_id=${activeDevice.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    if (error.response && error.response.status === 403) {
      // Specific handling for Spotify Premium required
      throw new Error(
        "Spotify Premium is required to play, pause, or skip songs."
      );
    }
    // Rethrow other errors
    throw new Error("Error stopping song on Spotify: " + error.message);
  }
};

const spotifyService = {
  getTopTracks,
  getNowPlaying,
  playSong,
  pauseCurrentSong,
};

export default spotifyService;
