import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { getAllCountries } from "./controllers/countries.controller";
import postRoutes from "./routes/post.routes";
import chatRoutes from "./routes/chat.routes";
import storyRoutes from "./routes/story.routes";

const router = express.Router();

router.use("/v1/auth", authRoutes);

router.use("/v1/user", userRoutes);

router.get("/v1/countries", getAllCountries);

router.use("/v1/posts", postRoutes);

router.use("/v1/chat", chatRoutes);

router.use("/v1/story", storyRoutes);

export default router;