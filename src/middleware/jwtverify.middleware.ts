import { NextFunction, Request, Response } from "express";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";
import { verifytoken } from "../utils/token";
import { User } from "../interfaces/user.interface";
import { getUserById } from "../services/user.service";

declare global {
    namespace Express {
      interface Request {
        userId?: string;
        username?: string;
        _user?: User;
      }
    }
  }

export const jwtVerify = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const getUser = await verifytoken(req.cookies["authToken"]) as User;
        if (!getUser) {
            res.status(responseStatusCode.unauthorized).json(translation.AUTH_TOKEN_REQUIRED);
            return;
        } else {
            req.userId = getUser.id;
            req.username = getUser.username;
            const user = await getUserById(getUser.id);
            if(user && user.username === getUser.username){
                req._user = user;
                next();
            }
            else{
                res.status(responseStatusCode.failure).json({ message: translation.USER_NOT_FOUND });
                return;
            }
        }
    } catch (error) {
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }
};
