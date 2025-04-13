import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

export { sequelize };
