import { nanoid } from "nanoid";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => nanoid(8),
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue("email", value.toLowerCase().trim());
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue("phone", value.replace(/\D/g, "").trim());
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      spotifyClientId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      spotifyClientSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      spotifyAccessToken: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      spotifyAccessTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      spotifyRefreshToken: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return User;
};
