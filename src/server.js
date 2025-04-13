import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDatabase } from "./config/databaseConfig.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  }
};

startServer();
