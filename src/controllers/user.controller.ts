import { Request, Response } from "express";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";
import { followerListService, followingListService, followUserService, getUserById, notificationListService, searchUsersService, suggestedUsers, tagUserService, updateConfirmStatus, updateUser } from "../services/user.service";
import { putImage } from "../utils/uploadPost";

export const getOneUser = async(req:Request, res:Response) => {
    try{
        const getUserId = req._user;
        const getUser = getUserId && await getUserById(getUserId?.id);
        if(getUser){
            res.status(responseStatusCode.success).json({ data: getUser, message: translation.USER_FOUND });
            return;
        }
        else{
            res.status(responseStatusCode.failure).json({ data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const getOneUserById = async(req:Request, res:Response) => {
    try{
        const getUserId = req.params["userid"];
        const getUser = getUserId && await getUserById(getUserId);
        if(getUser){
            res.status(responseStatusCode.success).json({ data: getUser, message: translation.USER_FOUND });
            return;
        }
        else{
            res.status(responseStatusCode.failure).json({ data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const suggestionUsers = async(req:Request, res:Response) => {
    try{
        const getUserId = req._user;
        const getUsers = getUserId && await suggestedUsers(getUserId?.id);
        if(getUsers){
            res.status(responseStatusCode.success).json({ data: getUsers, message: translation.SUGGESTION_USERS });
            return;
        }
        else{
            res.status(responseStatusCode.failure).json({ data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const uploadProfilePic = async(req:Request, res:Response) => {
    try{
        console.log("in controller");
        const {userId} = req.body;
        const profilePic = req.file;
        const user = await getUserById(userId);
        if(user && profilePic){
            const profileUrl = await putImage(profilePic?.buffer, user.username, "profilePic", "PROFILEPIC");
            const userData = await updateUser(userId, {profilePic: profileUrl});
            if(userData && profileUrl){
                res.status(responseStatusCode.success).json({data:profileUrl, message: translation.PROFILE_PIC_UPDATED });
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({data:null, message: translation.PROFILE_PIC_NOT_UPDATED });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({data:null, message: translation.USER_NOT_FOUND });
            return;
        }

    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const followUser = async(req:Request, res:Response) => {
    try{
        const {followerId, followingId} = req.body;

        const user1 = await getUserById(followerId);
        const user2 = await getUserById(followingId);
        if(user1 && user2){
            const user = await followUserService(followerId, followingId);
            if(user){
                res.status(responseStatusCode.success).json({data:user, message: translation.FOLLOW_REQUEST_SENT });
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({data:null, message: translation.FOLLOW_REQUEST_NOT_SENT });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const confirmFollow = async(req:Request, res:Response) => {
    try{
        const {followerId, followingId} = req.body;

        const user1 = await getUserById(followerId);
        const user2 = await getUserById(followingId);
        if(user1 && user2){
            const updateStatus = await updateConfirmStatus(followerId, followingId);
            if(updateStatus){
                // const updateFollowerList = await updateUser(user2.id, {followers: user1.id});
                // const updateFollowingList = await updateUser(user1.id, {following: user2.id});
                // if(updateFollowerList && updateFollowingList){
                    res.status(responseStatusCode.success).json({ message: translation.FOLLOW_REQUEST_ACCEPTED });
                    return;
                // }
            }
            else{
                res.status(responseStatusCode.failure).json({ message: translation.FOLLOW_REQUEST_NOT_ACCEPTED });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const notificationList = async(req:Request, res:Response) => {
    try{
        const getUserId = req._user;
        const getUser = getUserId && await getUserById(getUserId?.id);
        if(getUser){
            const notificationData = await notificationListService(getUserId?.id);
            if(notificationData?.length === 0){
                res.status(responseStatusCode.failure).json({data:null, message: translation.NOTIFICATION_NOT_FOUND });
                return;
            } else{
                res.status(responseStatusCode.success).json({ data: notificationData, message: translation.NOTIFICATION_LIST });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({ data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const followingList = async(req:Request, res:Response) => {
    try{
        const user = req.params["userId"];
        if(user){
            const followingUserData = await followingListService(user);
            if(followingUserData && followingUserData.length > 0){
                res.status(responseStatusCode.success).json({data:followingUserData, message: translation.FOLLOWING_LIST });
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({data:followingUserData, message: translation.FOLLOWING_LIST_NOT_FOUND });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({ data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const followerList = async(req:Request, res:Response) => {
    try{
        const user = req.params["userId"];
        if(user){
            const followerUserData = await followerListService(user);
            if(followerUserData && followerUserData.length > 0){
                res.status(responseStatusCode.success).json({data:followerUserData, message: translation.FOLLOWERS_LIST });
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({data:followerUserData, message: translation.FOLLOWERS_LIST_NOT_FOUND });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({ data:null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const searchUser = async(req:Request, res:Response) => {
    try{
        const { query } = req.query;

        if (!query || typeof query !== "string") {
            res.status(responseStatusCode.failure).json({ data: null, message: translation.QUERY_REQUIRED });
            return;
        }

        const users = await searchUsersService(query);
        if(users){
            res.status(responseStatusCode.success).json({data:users, message:translation.USER_FOUND})
            return;
        }
        else{
            res.status(responseStatusCode.failure).json({ data: null, message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const tagUser = async (req:Request, res:Response) => {
    try{
        const {userIds, postId} = req.body;
        const tag = await tagUserService(userIds, postId);
        if(tag){
            res.status(responseStatusCode.success).json({message:translation.TAG_SUCCESSFULL});
            return;
        }
        else{
            res.status(responseStatusCode.failure).json({ message:translation.TAG_UNSUCCESSFULL});
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}