import express from "express";
import { jwtVerify } from "../middleware/jwtverify.middleware";
import { createPost, getPosts, getPostsOfFollowing, likeDataList, toggleLike, likedPostByUser, createComment, getPostByPostId, getAllComments, getTagedPosts, getTagedPostsByPostId, getAllTagedPosts } from "../controllers/post.controller";
import { upload } from "../middleware/multer.middleware";
import { validateSchema } from "../utils/validation";
import { createPostValidate } from "../validator/post.validator";

const postRoutes = express.Router();

postRoutes.post("/create", jwtVerify, upload.single("content"), validateSchema(createPostValidate), createPost);

postRoutes.get("/getPosts/:userId", jwtVerify, getPosts);

postRoutes.get("/getPostByPostId/:postId", jwtVerify, getPostByPostId)

postRoutes.get("/getPostsOfFollowing", jwtVerify, getPostsOfFollowing);

postRoutes.post("/toggleLike", jwtVerify, toggleLike);

postRoutes.get("/likeDataList", jwtVerify, likeDataList);

postRoutes.post("/likedPostByUser", jwtVerify, likedPostByUser)

postRoutes.post("/createComment", jwtVerify, createComment);

postRoutes.post("/getAllComments", jwtVerify, getAllComments);

postRoutes.get("/getTagedPosts/:userId", jwtVerify, getTagedPosts);

postRoutes.get("/getTagedPostsByPostId/:postId", jwtVerify, getTagedPostsByPostId);

postRoutes.get("/getAllTagedPosts", jwtVerify,getAllTagedPosts);

export default postRoutes;