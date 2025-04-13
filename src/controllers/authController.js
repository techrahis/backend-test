import asyncHandler from "express-async-handler";
import authService from "../services/authService.js";
import {
  passwordValidator,
  emailValidator,
  phoneValidator,
} from "../utils/validator.js";

const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyClientId,
    spotifyClientSecret,
  } = req.body;

  // ✅ Validate request data
  if (!firstName || !lastName || !email || !phone || !password) {
    const error = new Error(
      "First name, last name, email, phone, and password are required."
    );
    error.status = 400;
    throw error;
  }

  // ✅ Check password strength
  if (!passwordValidator(password)) {
    const error = new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character."
    );
    error.status = 422;
    throw error;
  }

  // ✅ Check email format
  if (!emailValidator(email)) {
    const error = new Error("Invalid email format.");
    error.status = 422;
    throw error;
  }

  // ✅ Check phone format
  if (phone && !phoneValidator(phone)) {
    const error = new Error("Invalid phone number format. Must be 10 digits.");
    error.status = 422;
    throw error;
  }

  // ✅ Call service layer
  const authResponse = await authService.register(
    firstName,
    lastName,
    email,
    phone,
    password,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyClientId,
    spotifyClientSecret
  );

  // ✅ Send response from controller
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    accessToken: authResponse["accessToken"],
    refreshToken: authResponse["refreshToken"],
    user: authResponse["user"],
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  // ✅ Validate request data email or phone and password
  if ((!email && !phone) || !password) {
    const error = new Error("Email or phone and password are required.");
    error.status = 400;
    throw error;
  }

  // ✅ Check email format
  if (email && !emailValidator(email)) {
    const error = new Error("Invalid email format.");
    error.status = 422;
    throw error;
  }

  // ✅ Check phone format
  if (phone && !phoneValidator(phone)) {
    const error = new Error("Invalid phone number format. Must be 10 digits.");
    error.status = 422;
    throw error;
  }

  // ✅ Check password strength
  if (password && !passwordValidator(password)) {
    const error = new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character."
    );
    error.status = 422;
    throw error;
  }

  // ✅ Call service layer
  const keys = await authService.login(email || null, phone || null, password);

  // ✅ Send response from controller
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    accessToken: keys["accessToken"],
    refreshToken: keys["refreshToken"],
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // ✅ Validate request data
  if (!refreshToken) {
    const error = new Error("Refresh token is required.");
    error.status = 401;
    throw error;
  }

  // ✅ Call service layer
  await authService.logout(refreshToken);

  // ✅ Send response from controller
  res.status(200).json({
    success: true,
    message: "User logged out successfully.",
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // ✅ Validate request data
  if (!refreshToken) {
    const error = new Error("Refresh token is required.");
    error.status = 401;
    throw error;
  }

  // ✅ Call service layer
  const keys = await authService.refresh(refreshToken);

  // ✅ Send response from controller
  res.status(200).json({
    success: true,
    message: "Tokens refreshed successfully",
    accessToken: keys["accessToken"],
    refreshToken: keys["refreshToken"],
  });
});

const me = asyncHandler(async (req, res) => {
  const { user } = req; // Extract user info from request object

  // ✅ Validate request data
  if (!user) {
    const error = new Error("User info is required.");
    error.status = 401;
    throw error;
  }

  // ✅ Call service layer
  const userInfo = await authService.me(user.email, user.phone);

  // ✅ Send response from controller
  res.status(200).json({
    success: true,
    message: "User info retrieved successfully",
    user: userInfo,
  });
});

const update = asyncHandler(async (req, res) => {
  const { user } = req; // Extract user info from request object
  const {
    firstName,
    lastName,
    email,
    phone,
    spotifyAccessToken,
    spotifyClientSecret,
    spotifyClientId,
    spotifyRefreshToken,
  } = req.body;

  // ✅ Validate request data
  if (!user) {
    const error = new Error("User info is required.");
    error.status = 401;
    throw error;
  }

  // ✅ Check email format
  if (email && !emailValidator(email)) {
    const error = new Error("Invalid email format.");
    error.status = 422;
    throw error;
  }

  // ✅ Check phone format
  if (phone && !phoneValidator(phone)) {
    const error = new Error("Invalid phone number format. Must be 10 digits.");
    error.status = 422;
    throw error;
  }

  // ✅ Call service layer
  const updatedUser = await authService.update(user.id, {
    firstName: firstName || null,
    lastName: lastName || null,
    email: email || null,
    phone: phone || null,
    spotifyAccessToken: spotifyAccessToken || null,
    spotifyClientSecret: spotifyClientSecret || null,
    spotifyClientId: spotifyClientId || null,
    spotifyRefreshToken: spotifyRefreshToken || null,
  });

  // ✅ Send response from controller
  res.status(200).json({
    success: true,
    message: "User info updated successfully",
    user: updatedUser,
  });
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  const { user } = req;
  const profilePicture = req.file;

  // ✅ Validate user and image
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "User info is required." });
  }

  if (!profilePicture) {
    return res
      .status(400)
      .json({ success: false, message: "No image file uploaded." });
  }

  const updatedUser = await authService.updateProfilePicture(
    user.id,
    profilePicture
  );

  // ✅ Send response with the updated user data
  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    user: updatedUser,
  });
});

const removeProfilePicture = asyncHandler(async (req, res) => {
  const { user } = req;

  // ✅ Validate user
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "User info is required." });
  }

  const updatedUser = await authService.removeProfilePicture(user.id);

  // ✅ Send response with the updated user data
  res.status(200).json({
    success: true,
    message: "Profile picture removed successfully",
    user: updatedUser,
  });
});

const initiateResetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // ✅ Validate request data
  if (!email) {
    const error = new Error("Email is required.");
    error.status = 400;
    throw error;
  }

  // ✅ Check email format
  if (!emailValidator(email)) {
    const error = new Error("Invalid email format.");
    error.status = 422;
    throw error;
  }

  // ✅ Call service layer
  await authService.initiateResetPassword(email);

  // ✅ Send response from controller
  res.status(200).json({
    success: true,
    message: "OTP sent to your registered email address.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // ✅ Validate request data
  if (!email || !otp || !newPassword) {
    const error = new Error("Email, OTP, and new newPassword are required.");
    error.status = 400;
    throw error;
  }

  // ✅ Check password strength
  if (!passwordValidator(newPassword)) {
    const error = new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character."
    );
    error.status = 422;
    throw error;
  }

  // ✅ Check email format
  if (!emailValidator(email)) {
    const error = new Error("Invalid email format.");
    error.status = 422;
    throw error;
  }

  // ✅ Call service layer
  await authService.resetPassword(email, otp, newPassword);

  // ✅ Send response from controller
  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});

export default {
  register,
  login,
  logout,
  refresh,
  me,
  update,
  updateProfilePicture,
  removeProfilePicture,
  initiateResetPassword,
  resetPassword,
};
