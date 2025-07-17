import express from "express";
import { jwtVerify } from "../middleware/jwtverify.middleware";
import { findConversationId, getMessages } from "../controllers/chat.controller";
// import { createConversation } from "../controllers/chat.controller";

const chatRoutes = express.Router();

// chatRoutes.post("/createConversation", jwtVerify, createConversation);

// chatRoutes.post("/createMessage", jwtVerify, createMessage);

chatRoutes.post("/findConversationId", jwtVerify, findConversationId);

chatRoutes.post("/getMessages", jwtVerify, getMessages);

export default chatRoutes;