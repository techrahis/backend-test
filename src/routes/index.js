import { Router } from "express";
import authRoutes from "./authRoute.js";
import spotifyRoute from "./spotifyRoute.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/spotify", spotifyRoute);

export default router;
