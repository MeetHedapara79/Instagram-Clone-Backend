import { Request, Response } from "express";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";
import { findConversationIdService, getMessagesSrvices } from "../services/chat.service";

export const findConversationId = async(req:Request, res:Response) => {
    try{
        const {userIds} = req.body;
        if(userIds){
            const conversationids = await findConversationIdService(userIds);
            if(conversationids){
                res.status(responseStatusCode.success).json({data:conversationids, message:translation.CONVERSATION_CREATED});
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({data:conversationids, message:translation.CONVERSATION_FAILED});
                return;
            }
        }
        else{
            res.status(responseStatusCode.success).json({data:null, message:translation.USER_NOT_FOUND});
            return;
        }

    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const getMessages = async (req:Request, res:Response) => {
    try{
        const {userIds} = req.body;
        if(userIds) {
            const messages = await getMessagesSrvices(userIds);
            if(messages && messages.length>0){
                res.status(responseStatusCode.success).json({data:messages, message:translation.MESSAGE_FETCHED});
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({data:messages, message:translation.MESSAGE_FAILED});
                return;
            }
        }
        else{
            res.status(responseStatusCode.success).json({data:null, message:translation.USER_NOT_FOUND});
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}