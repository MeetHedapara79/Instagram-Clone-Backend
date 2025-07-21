import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { translation } from "../language/translation";
import { checkPwd } from "../utils/pwd";
import { responseStatusCode } from "../language/constanat";
import { signtoken } from "../utils/token";
import { redis } from "../redisClient";

const prisma = new PrismaClient();

export const verifyPwd = async (req:Request, res:Response, next:NextFunction) => {
    const { username, password } = req.body;
    try {
        const getUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: username,
                    },
                    {
                        email_phone: username,
                    },
                ],
            },
        });
        if (getUser) {
            const checkPassword = checkPwd(password, getUser.password);
            if(checkPassword) {
                const userData = await signtoken({username:getUser.username, id:getUser.id, email:getUser.email_phone});
                const parts = userData.split(".");
                const signature = parts[2];
                
                if (signature) {
                    await redis.set(`user:${getUser.id}:signature`, signature, 'EX', 86400);
                } else {
                    console.error('Signature is undefined');
                }
                
                res.cookie("authToken", userData, {
                    secure: process.env["NODE_ENV"] === "production",
                    sameSite: "none",
                    maxAge: 1000 * 60 * 60 * 24,
                });

                req._user = getUser;
                next();
            }
            else{
                res.status(responseStatusCode.failure).json({message:translation.INVALID_PASSWORD});
                return;
            }
        } else {
            res.status(responseStatusCode.failure).json({message:translation.USER_NOT_FOUND});
            return;
        }
    } catch (error) {
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;    
    }
};