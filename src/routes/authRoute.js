import { Router } from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";
import {
  generalLimiter,
  registerLimiter,
  loginLimiter,
  otpLimiter,
  otpVerificationLimiter,
} from "../middlewares/rateLimiterMiddleware.js";

const router = Router();

router.post("/register", registerLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", generalLimiter, authMiddleware, authController.logout);
router.post("/refresh", generalLimiter, authController.refresh);
router.get("/me", generalLimiter, authMiddleware, authController.me);
router.put("/update", generalLimiter, authMiddleware, authController.update);
router.put(
  "/update-profile-picture",
  generalLimiter,
  authMiddleware,
  upload.single("profilePicture"),
  authController.updateProfilePicture
);
router.delete(
  "/remove-profile-picture",
  generalLimiter,
  authMiddleware,
  authController.removeProfilePicture
);
router.post(
  "/initiate-reset-password",
  otpLimiter,
  authController.initiateResetPassword
);
router.post(
  "/reset-password",
  otpVerificationLimiter,
  authController.resetPassword
);

export default router;
