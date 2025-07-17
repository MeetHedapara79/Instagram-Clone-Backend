import express from "express";
import { confirmFollow, followerList, followingList, followUser, getOneUser, getOneUserById, notificationList, suggestionUsers, uploadProfilePic, searchUser, tagUser } from "../controllers/user.controller";
import { jwtVerify } from "../middleware/jwtverify.middleware";
import { upload } from "../middleware/multer.middleware";

const userRoutes = express.Router();

userRoutes.get("/getOneUser", jwtVerify, getOneUser);

userRoutes.get("/getOneUserById/:userid", jwtVerify, getOneUserById);

userRoutes.get("/suggestionUsers", jwtVerify, suggestionUsers);

userRoutes.post("/uploadProfilePic", jwtVerify, upload.single("profilePic"), uploadProfilePic);

userRoutes.post("/followUser", jwtVerify, followUser);

userRoutes.post("/confirmFollow", jwtVerify, confirmFollow);

userRoutes.get("/notificationList", jwtVerify, notificationList);

userRoutes.get("/followingList/:userId", jwtVerify, followingList);

userRoutes.get("/followerList/:userId", jwtVerify, followerList);

userRoutes.get("/search", jwtVerify, searchUser);

userRoutes.post("/tagUser", jwtVerify, tagUser);

export default userRoutes;