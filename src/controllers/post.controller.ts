import { Request, Response } from "express";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";
import { followingListService, getUserById } from "../services/user.service";
import { putImage } from "../utils/uploadPost";
import {
  create,
  createCommentService,
  getAllCommentsService,
  getAllTagedPostsService,
  getPostByPostIdService,
  getPostsByUserId,
  getPostsofFollowingService,
  getTagedPostsByPostIdService,
  getTagedPostService,
  likeDataListService,
  likedPostByUserService,
  toggleLikeService,
} from "../services/post.service";
import { Post } from "../interfaces/user.interface";
import { buildCommentTree } from "../utils/commentTree";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { userId, location, caption } = req.body;
    const content = req.file;

    const user = await getUserById(userId);

    if (user && content) {
      const contentUrl = await putImage(
        content.buffer,
        user.username,
        content.originalname,
        "POST"
      );
      const postData: Post = { content: contentUrl, location, caption, userId };
      const postCreate = await create(postData);
      if (postCreate) {
        res
          .status(responseStatusCode.success)
          .json({ data: postCreate, message: translation.POST_CREATED });
        return;
      } else {
        res
          .status(responseStatusCode.failure)
          .json({ data: null, message: translation.POST_NOT_CREATED });
        return;
      }
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.POST_NOT_CREATED });
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

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res
        .status(responseStatusCode.failure)
        .json({ message: translation.POST_NOT_FOUND });
      return;
    }
    const posts = await getPostsByUserId(userId);

    if (posts && posts.length > 0) {
      res.status(responseStatusCode.success).json(posts);
      return;
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ message: translation.POST_NOT_FOUND });
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

export const getPostsOfFollowing = async (req: Request, res: Response) => {
  try {
    const user = req._user;
    if (user) {
      const followingList = await followingListService(user?.id);
      if (followingList && followingList.length > 0) {
        const newFollowingList = followingList.map(
          (notification) => notification.id
        );
        const posts = await getPostsofFollowingService(newFollowingList);
        if (posts && posts.length > 0) {
          res
            .status(responseStatusCode.success)
            .json({ data: posts, message: translation.POSTS_OF_FOLLOWING });
          return;
        } else {
          res
            .status(responseStatusCode.failure)
            .json({ data: null, message: translation.POST_NOT_FOUND });
          return;
        }
      } else {
        res
          .status(responseStatusCode.failure)
          .json({ data: null, message: translation.POST_NOT_FOUND });
        return;
      }
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

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const user = req._user;
    const { postId } = req.body;
    console.log("🚀 ~ toggleLike ~ req.body:", req.body);
    if (user) {
      const likedPost = await toggleLikeService(postId, user.id);
      if (likedPost?.liked) {
        res
          .status(responseStatusCode.success)
          .json({ data: likedPost.liked, message: translation.POST_LIKE });
        return;
      } else {
        res
          .status(responseStatusCode.success)
          .json({ data: likedPost?.liked, message: translation.POST_UNLIKE });
        return;
      }
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

export const likeDataList = async (req: Request, res: Response) => {
  try {
    const user = req._user;
    if (user) {
      const likeList = await likeDataListService(user.id);
      if (likeList && likeList.length > 0) {
        res
          .status(responseStatusCode.success)
          .json({ data: likeList, message: translation.LIKE_LIST });
        return;
      } else {
        res
          .status(responseStatusCode.success)
          .json({ data: likeList, message: translation.LIKE_NOT_FOUND });
        return;
      }
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

export const likedPostByUser = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    if (postId) {
      const likedList = await likedPostByUserService(postId);
      if (likedList && likedList.length > 0) {
        res
          .status(responseStatusCode.success)
          .json({ data: likedList, message: translation.LIKE_LIST });
        return;
      } else {
        res
          .status(responseStatusCode.success)
          .json({ data: likedList, message: translation.LIKE_NOT_FOUND });
        return;
      }
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.POST_NOT_FOUND });
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

export const createComment = async (req: Request, res: Response) => {
  try {
    const user = req._user;
    const { postId, content, parentId } = req.body;
    if (user) {
      const newComment = await createCommentService(
        user.id,
        postId,
        content,
        parentId
      );
      if (newComment) {
        res
          .status(responseStatusCode.success)
          .json(translation.COMMENT_CREATED);
        return;
      } else {
        res
          .status(responseStatusCode.failure)
          .json(translation.COMMENT_NOT_CREATED);
        return;
      }
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

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.POST_NOT_FOUND });
      return;
    }

    const flatComments = await getAllCommentsService(postId);

    if (!flatComments) {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.COMMENT_NOT_FETCH });
      return;
    }

    const nestedComments = buildCommentTree(flatComments);

    res.status(responseStatusCode.success).json({
      data: nestedComments,
      message: translation.COMMENT_FETCH_SUCCESS,
    });
    return;
  } catch (error) {
    const typedError = error as Error;
    res.status(responseStatusCode.internal).json({
      message: typedError.message || translation.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const getPostByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (postId) {
      const getPost = await getPostByPostIdService(postId);
      if (getPost) {
        res
          .status(responseStatusCode.success)
          .json({ data: getPost, message: translation.POST_FETCH });
        return;
      } else {
        res
          .status(responseStatusCode.failure)
          .json({ data: null, message: translation.POST_NOT_FOUND });
        return;
      }
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.POST_NOT_FOUND });
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

export const getTagedPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (userId) {
      const tagedPosts = await getTagedPostService(userId);
      if (tagedPosts) {
        res
          .status(responseStatusCode.success)
          .json({ data: tagedPosts, message: translation.USER_FOUND });
        return;
      } else {
        res
          .status(responseStatusCode.failure)
          .json({ data: null, message: translation.USER_NOT_FOUND });
        return;
      }
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

export const getTagedPostsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (postId) {
      const tagedPosts = await getTagedPostsByPostIdService(postId);
      if (tagedPosts) {
        res
          .status(responseStatusCode.success)
          .json({ data: tagedPosts, message: translation.POST_FETCH });
        return;
      } else {
        res
          .status(responseStatusCode.failure)
          .json({ data: null, message: translation.POST_NOT_FOUND });
        return;
      }
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.POST_NOT_FOUND });
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

export const getAllTagedPosts = async (_req: Request, res: Response) => {
  try {
    const tagedPosts = await getAllTagedPostsService();
    if (tagedPosts) {
      res
        .status(responseStatusCode.success)
        .json({ data: tagedPosts, message: translation.POST_FETCH });
      return;
    } else {
      res
        .status(responseStatusCode.failure)
        .json({ data: null, message: translation.POST_NOT_FOUND });
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
