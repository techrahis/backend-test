import { Router } from "express";
import spotifyController from "../controllers/spotifyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  generalLimiter,
  spotifyCurrentPlayingLimiter,
} from "../middlewares/rateLimiterMiddleware.js";

const router = Router();

router.get(
  "/top-tracks",
  generalLimiter,
  authMiddleware,
  spotifyController.getTopTracks
);
router.get(
  "/now-playing",
  spotifyCurrentPlayingLimiter,
  authMiddleware,
  spotifyController.getNowPlaying
);
router.post(
  "/play-song",
  generalLimiter,

  authMiddleware,
  spotifyController.playSong
);
router.put(
  "/pause-song",
  generalLimiter,
  authMiddleware,
  spotifyController.pauseCurrentSong
);

export default router;
