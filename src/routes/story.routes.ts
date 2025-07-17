import express from "express";
import { createStory, getAllActiveStories, getUserStories, viewStory, viewerList } from "../controllers/story.controller";
import { upload } from "../middleware/multer.middleware";

const storyRoutes = express.Router();

storyRoutes.post('/stories',upload.single("mediaUrl"), createStory);

storyRoutes.get('/stories/getAllActiveStories', getAllActiveStories);
storyRoutes.get('/stories/:userId', getUserStories);

storyRoutes.post('/stories/:storyId/views', viewStory);
storyRoutes.get('/stories/viewerList/:storyId', viewerList);


export default storyRoutes;