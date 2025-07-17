import { Request, Response } from "express";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";
import { findConversationIdService, getMessagesSrvices } from "../services/chat.service";

// export const createConversation = async (req:Request, res:Response) => {
//     try{
//         const { senderId, receiverId, content } = req.body; // Array of user IDs for the conversation
//         const participantIds = [senderId, receiverId];
//         if(participantIds){
//             const newId1 = `${participantIds[0]}_${participantIds[1]}`
//             const newId2 = `${participantIds[1]}_${participantIds[0]}`
//             const existingConversationId = await findConversationIdSevice([newId1, newId2]);
//             if(existingConversationId){
//                 const newMessage = await createMessageService(senderId, receiverId, content, existingConversationId.conversationId);
//                 if(newMessage){
//                     res.status(responseStatusCode.success).json({data:newMessage, message:translation.MESSAGE_CREATED});
//                     return;
//                 }
//                 else{
//                     res.status(responseStatusCode.failure).json({data:null, message:translation.MESSAGE_FAILED});
//                     return;
//                 } 
//             }
//             else{
//                 const newMessage = await createMessageService(senderId, receiverId, content, newId1);
//                 if(newMessage){
//                     res.status(responseStatusCode.success).json({data:newMessage, message:translation.MESSAGE_CREATED});
//                     return;
//                 }
//                 else{
//                     res.status(responseStatusCode.failure).json({data:null, message:translation.MESSAGE_FAILED});
//                     return;
//                 } 
//             }
//         }
//         else{
//             res.status(responseStatusCode.failure).json({data:null, message:translation.USER_NOT_FOUND});
//             return;
//         }
//     } catch(error){
//         const typedError = error as Error;
//         res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
//         return;
//     }
// }

// export const createMessage = async(req:Request, res:Response)=> {
//     try{
//         const { senderId, receiverId, content, conversationId } = req.body;

  
//         const newMessage = await createMessageService(senderId, receiverId, content, conversationId);
//         if(newMessage){
//             res.status(responseStatusCode.success).json({data:newMessage, message:translation.MESSAGE_CREATED});
//             return;
//         }
//         else{
//             res.status(responseStatusCode.failure).json({data:null, message:translation.MESSAGE_FAILED});
//             return;
//         } 
//     } catch(error){
//         const typedError = error as Error;
//         res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
//         return;
//     }
// }

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