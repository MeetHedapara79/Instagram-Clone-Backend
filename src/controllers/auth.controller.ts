import { Request, Response } from "express";
import { translation } from "../language/translation";
import { checkPwd, setPwd } from "../utils/pwd";
import { createUser, getByUsername, getOneUser, updateUser } from "../services/user.service";
import { responseStatusCode } from "../language/constanat";
import { User } from "../interfaces/user.interface";
import 'dotenv/config';
import { redis } from "../redisClient";

declare global {
    namespace Express {
      interface Request {
        _user?: User;
      }
    }
  }

export const registerUser = async (req:Request, res:Response) => {
    try{
        const {emailphone, password, username, recoveryCode} = req.body;
        const user = await getOneUser({emailphone, username, password:"", recoveryCode:""});
        
        if(user?.userData){
            res.status(responseStatusCode.failure).json({ data: user.userData, message: user.message });
            return;
        }
        else{
            const encryptedPwd = await setPwd(password);
            const encryptedRecoveryCode = recoveryCode ? await setPwd(recoveryCode) : null;
            const create = await createUser({emailphone, password:encryptedPwd, username, recoveryCode:encryptedRecoveryCode});
            if(create){
                res.status(responseStatusCode.success).json({ message: translation.USER_CREATED_SUCCESSFULLY });
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({ message: translation.INTERNAL_SERVER_ERROR });
                return;
            }
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const signinUser = async (req:Request, res:Response) => {
    try{
        const getUser = req._user;
        const token = (req as any)._token;
        if(getUser){
            res.status(responseStatusCode.success).json({ data: getUser, authToken: token, message: translation.USER_SIGNIN_SUCCESSFULLY });
            return;
        }
        else{
            res.status(responseStatusCode.failure).json({ message: translation.USER_NOT_FOUND });
            return;
        }
    }
    catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const forgotPassword = async (req:Request, res:Response) => {
    try{
       const {username, recoveryCode} = req.body;

        const user = await getByUsername(username);

        if(user){
            const checkRecoveryCode = user.recoveryCode && await checkPwd(recoveryCode, user.recoveryCode);
            if(checkRecoveryCode){
                res.status(responseStatusCode.success).json({ message: translation.VALID_USER });
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({ message: translation.INVALID_RECOVERY_CODE });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({ message: translation.USER_NOT_FOUND });
            return;
        }
        
        
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const resetPassword = async (req:Request, res:Response) => {
    try{
        const {username, password, recoveryCode} = req.body;
        const user = await getByUsername(username);
        if(user){
            const encryptedPwd = await setPwd(password);
            const encryptedRecoveryCode = recoveryCode ? await setPwd(recoveryCode) : null;
            const updatePassword = await updateUser(user.id, {password: encryptedPwd, recoveryCode: encryptedRecoveryCode});
            if(updatePassword){
                res.status(responseStatusCode.success).json({ message: translation.USER_UPDATED_SUCCESSFULLY });
                return;
            }
            else{
                res.status(responseStatusCode.failure).json({ message: translation.INTERNAL_SERVER_ERROR });
                return;
            }
        }
        else{
            res.status(responseStatusCode.failure).json({ message: translation.USER_NOT_FOUND });
            return;
        }
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const user = req._user;
        if (user) {
            await redis.del(`user:${user.id}:signature`);

            res.clearCookie('authToken');

            res.status(responseStatusCode.success).json({ message: translation.LOGOUT_SUCCESS });
            return;
        } else {
            res.status(responseStatusCode.failure).json({ message: translation.USER_NOT_FOUND });
            return;
        }
    } catch (error) {
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
};
