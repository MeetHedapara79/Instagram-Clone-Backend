import { Request, Response } from "express";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";
import {
  createStoryService,
  getAllActiveStoriesService,
  getUserStoriesService,
  viewerListService,
  viewStoryService,
} from "../services/story.service";
import { getUserById } from "../services/user.service";
import { putImage } from "../utils/uploadPost";

export const createStory = async (req: Request, res: Response) => {
  try {
    const { userId, type, caption } = req.body;
    const mediaUrl = req.file;

    const user = await getUserById(userId);

    if (user && mediaUrl) {
      const contentUrl = await putImage(
        mediaUrl.buffer,
        user.username,
        mediaUrl.originalname,
        "STORY"
      );
      const story = await createStoryService(userId, contentUrl, caption, type);
      if (story) {
        res
          .status(responseStatusCode.success)
          .json({ data: story, message: translation.STORY_CREATED });
        return;
      } else {
        res
          .status(responseStatusCode.failure)
          .json({ data: null, message: translation.STORY_NOT_CREATED });
        return;
      }
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.STORY_NOT_CREATED });
      return;
    }
  } catch (error) {
    const typedError = error as Error;
    res.status(responseStatusCode.internal).json({
      message: typedError.message || translation.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const getUserStories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (userId) {
      const stories = await getUserStoriesService(userId);
      res
        .status(responseStatusCode.success)
        .json({ data: stories, message: translation.STORY_FETCHED });
      return;
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.USER_NOT_FOUND });
      return;
    }
  } catch (error) {
    const typedError = error as Error;
    res.status(responseStatusCode.internal).json({
      message: typedError.message || translation.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const viewStory = async (req: Request, res: Response) => {
  try {
    const { storyId } = req.params;
    const { viewerId } = req.body;
    if (storyId && viewerId) {
      const view = await viewStoryService(storyId, viewerId);
      res
        .status(responseStatusCode.success)
        .json({ data: view, message: translation.STORY_VIEW_FETCHED });
      return;
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.STORY_NOT_FOUND });
      return;
    }
  } catch (error) {
    const typedError = error as Error;
    res.status(responseStatusCode.internal).json({
      message: typedError.message || translation.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const getAllActiveStories = async (_req: Request, res: Response) => {
  try {
    const stories = await getAllActiveStoriesService();
    res
      .status(responseStatusCode.success)
      .json({ data: stories, message: translation.ACTIVE_STORY_FETCHED });
    return;
  } catch (error) {
    const typedError = error as Error;
    res.status(responseStatusCode.internal).json({
      message: typedError.message || translation.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const viewerList = async (req: Request, res: Response) => {
  try {
    const storyId = req.params["storyId"];
    if (storyId) {
      const viewerList = await viewerListService(storyId);
      if (viewerList) {
        res
          .status(responseStatusCode.success)
          .json({ data: viewerList, message: translation.VIEWER_LIST_FETCHED });
        return;
      } else {
        res.status(responseStatusCode.failure).json({
          data: viewerList,
          message: translation.VIEWER_LIST_NOT_FETCHED,
        });
        return;
      }
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.STORY_NOT_FOUND });
      return;
    }
  } catch (error) {
    const typedError = error as Error;
    res.status(responseStatusCode.internal).json({
      message: typedError.message || translation.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};
