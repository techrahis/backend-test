import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors()); // Enable cors
app.use(morgan("dev"));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Default health route
app.get("/", (req, res) => {
  res.json({ message: "API running ✅" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Use Global Error Handler
app.use(errorHandler);

export default app;
