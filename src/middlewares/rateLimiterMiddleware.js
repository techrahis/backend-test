import rateLimit from "express-rate-limit";

// General purpose limiter (e.g. 100 requests per 15 mins)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Spotify current playing litter (uses pooling)
export const spotifyCurrentPlayingLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 3,
  message: "Too many requests from this IP, please try again later.",
});

// OTP specific limiter (e.g. 3 OTP requests per 10 mins)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: "Too many OTP requests, please wait before trying again.",
});

// OTP verification limiter (e.g. 3 attempts per 10 mins)
export const otpVerificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message:
    "Too many OTP verification attempts, please wait before trying again.",
});

// Login limiter (e.g. 5 attempts per 10 mins)
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});

// Register limiter (e.g. 5 attempts per 10 mins)
export const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many registration attempts, please try again later.",
});
