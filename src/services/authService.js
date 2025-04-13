import bcrypt from "bcryptjs";
import jwt from "../utils/jwt.js";
import { User } from "../models/index.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinaryConfig.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import redis from "../config/redisConfig.js";

const register = async (
  firstName,
  lastName,
  email,
  phone,
  password,
  spotifyAccessToken,
  spotifyRefreshToken,
  spotifyClientSecret,
  spotifyClientId
) => {
  // ✅ Check if user already exists by email or phone
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
  });

  if (existingUser) {
    const error = new Error("User already exists with this email or phone.");
    error.status = 409;
    throw error;
  }

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Create user in the database
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyClientSecret,
    spotifyClientId,
    spotifyAccessTokenExpiresAt: new Date(Date.now() + 2400 * 1000), // 40 minutes
  });

  // ✅ Convert Sequelize instance to plain object
  const userData = {
    id: newUser.id,
    email: newUser.email,
    phone: newUser.phone,
  };

  // ✅ Generate JWT tokens
  const accessToken = jwt.generateAccessToken(userData);
  const refreshToken = jwt.generateRefreshToken(userData);

  // ✅ Save refresh token in DB
  newUser.refreshToken = refreshToken;
  await newUser.save();

  // ✅ Return tokens and user info
  return {
    accessToken,
    refreshToken,
    user: userData,
  };
};

const login = async (email, phone, password) => {
  // ✅ Check if user exists
  const whereClause = email ? { email } : { phone };
  let user = await User.findOne({
    where: whereClause,
    attributes: ["id", "firstName", "lastName", "email", "phone", "password"],
  });

  if (!user) {
    const error = new Error("Invalid credentials.");
    error.status = 401;
    throw error;
  }

  // ✅ Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials.");
    error.status = 401;
    throw error;
  }

  // ✅ Convert Sequelize instance to plain object
  const userData = user.get({ plain: true });
  delete userData.password;

  // ✅ Generate JWT tokens
  const accessToken = jwt.generateAccessToken(userData);
  const refreshToken = jwt.generateRefreshToken(userData);

  // ✅ Store refresh token in the database
  user.refreshToken = refreshToken;
  await user.save();

  // ✅ Send new tokens to the user
  return {
    accessToken,
    refreshToken,
  };
};

const logout = async (refreshToken) => {
  // ✅ Check if refresh token is valid
  const decodedToken = jwt.verifyRefreshToken(refreshToken);
  if (!decodedToken) {
    const error = new Error("Invalid refresh token.");
    error.status = 401;
    throw error;
  }

  // ✅ Check if user exists with decoded token user data (email or phone) and refreshToken
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { email: decodedToken.user.email },
        { phone: decodedToken.user.phone },
      ],
      refreshToken,
    },
  });

  if (!user) {
    const error = new Error("User not found or refresh token mismatch.");
    error.status = 404;
    throw error;
  }

  // ✅ Remove refresh token from the database
  user.refreshToken = null;
  await user.save();

  // ✅ Send response to the user
  return true;
};

const refresh = async (refreshToken) => {
  // ✅ Validate and decode the refresh token
  const decodedToken = jwt.verifyRefreshToken(refreshToken);
  if (!decodedToken) {
    const error = new Error("Invalid refresh token.");
    error.status = 401;
    throw error;
  }

  // ✅ Find user by email or phone and validate refresh token
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: decodedToken.email }, { phone: decodedToken.phone }],
      refreshToken, // Check if the refresh token matches
    },
  });

  if (!user) {
    const error = new Error("Invalid refresh token.");
    error.status = 401;
    throw error;
  }

  // ✅ Generate new access token and refresh token
  const accessToken = jwt.generateAccessToken(user);
  const newRefreshToken = jwt.generateRefreshToken(user);

  // ✅ Store the new refresh token in the database
  await user.update({ refreshToken: newRefreshToken });

  // ✅ Return new tokens to the user
  return { accessToken, refreshToken: newRefreshToken };
};

const me = async (email, phone) => {
  // ✅ Check if user exists with either email or phone and select only required attributes
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
    attributes: ["id", "firstName", "lastName", "email", "phone"],
  });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  // ✅ Return plain user object without password or other unwanted fields
  return user.get({ plain: true });
};

const update = async (id, updatedData) => {
  // ✅ Check if user exists
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  // ✅ Validate unique fields (email, phone)
  if (updatedData.email) {
    const existingEmailUser = await User.findOne({
      where: { email: updatedData.email, id: { [Op.ne]: id } },
    });
    if (existingEmailUser) {
      const error = new Error("Email is already in use by another user.");
      error.status = 409;
      throw error;
    }
  }

  if (updatedData.phone) {
    const existingPhoneUser = await User.findOne({
      where: { phone: updatedData.phone, id: { [Op.ne]: id } },
    });
    if (existingPhoneUser) {
      const error = new Error(
        "Phone number is already in use by another user."
      );
      error.status = 409;
      throw error;
    }
  }

  // ✅ Update user fields
  await user.update(updatedData);

  // ✅ Return updated user data
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  };
};

const updateProfilePicture = async (id, profilePicture) => {
  // ✅ Check if user exists
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  // ✅ Check if profile picture exists then remove from Cloudinary
  if (user.profilePicture) {
    const publicId = user.profilePicture.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  }

  // ✅ Upload new profile picture to Cloudinary
  const uploadResult = await uploadToCloudinary(
    profilePicture.buffer,
    "backend_test/profile_pictures"
  );

  if (!uploadResult) {
    const error = new Error("Failed to upload profile picture.");
    error.status = 503;
    throw error;
  }

  // ✅ Update user profile picture in the database
  await user.update({ profilePicture: uploadResult });

  // ✅ Return updated user data
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    profilePicture: uploadResult,
  };
};

const removeProfilePicture = async (id) => {
  // ✅ Check if user exists
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  // ✅ Check if profile picture exists then remove from Cloudinary
  if (user.profilePicture) {
    const publicId = user.profilePicture.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
    await user.update({ profilePicture: null });
  }

  // ✅ Return updated user data
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    profilePicture: null,
  };
};

const initiateResetPassword = async (email) => {
  // ✅ Check if user exists
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  // ✅ Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ✅ Store OTP in Redis with expiry time
  await redis.set(`otp:${user.id}`, otp, "EX", 3 * 60); // 3 minutes expiry

  // ✅ Send OTP email
  await sendOtpEmail(email, otp);

  return true;
};

const resetPassword = async (email, otp, newPassword) => {
  // ✅ Check if user exists
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  // ✅ Validate OTP
  const storedOtp = await redis.get(`otp:${user.id}`);
  if (storedOtp !== otp) {
    const error = new Error("Invalid OTP.");
    error.status = 401;
    throw error;
  }

  // ✅ Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // ✅ Update password in the database
  await user.update({ password: hashedPassword });

  // ✅ Remove OTP from Redis
  await redis.del(`otp:${user.id}`);

  return true;
};

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
