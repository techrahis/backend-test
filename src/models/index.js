// models/index.js
import { sequelize } from "../config/sequelizeConfig.js"; // Import sequelize instance
import { DataTypes } from "sequelize";
import UserModel from "./User.js"; // Import the User model

// Initialize models
const User = UserModel(sequelize, DataTypes);

// Define associations here (if any)

// Export sequelize and models
export { sequelize, User };
