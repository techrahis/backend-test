import asyncHandler from "express-async-handler";
import spotifyService from "../services/spotifyService.js";

// Controller to fetch the user's top tracks
const getTopTracks = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch top tracks from the Spotify service
    const topTracks = await spotifyService.getTopTracks(userId);

    // Send response with the top tracks
    res.status(200).json({
      success: true,
      message: "Top tracks fetched successfully",
      topTracks,
    });
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top tracks from Spotify",
      error: error.message,
    });
  }
});

// Controller to fetch the currently playing track
const getNowPlaying = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch currently playing track from Spotify service
    const nowPlaying = await spotifyService.getNowPlaying(userId);

    if (!nowPlaying) {
      return res.status(404).json({
        success: false,
        message: "No song is currently playing",
      });
    }

    // Send response with the currently playing track
    res.status(200).json({
      success: true,
      message: "Currently playing track fetched successfully",
      nowPlaying,
    });
  } catch (error) {
    console.error("Error fetching currently playing song:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch currently playing song from Spotify",
      error: error.message,
    });
  }
});

// Controller to start a song
const playSong = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { trackUri } = req.body;

  // Validate trackUri presence
  if (!trackUri) {
    return res.status(400).json({
      success: false,
      message: "Track URI is required to start a song.",
    });
  }

  // Start the song by calling the Spotify service
  await spotifyService.playSong(userId, trackUri);
  res.status(200).json({
    success: true,
    message: "Song started successfully.",
  });
});

// Controller to stop the currently playing song
const pauseCurrentSong = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await spotifyService.pauseCurrentSong(userId);
  res.status(200).json({
    success: true,
    message: "Song stopped successfully.",
  });
});

export default { getTopTracks, getNowPlaying, playSong, pauseCurrentSong };
