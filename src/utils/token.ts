import jwt from "jsonwebtoken";
import 'dotenv/config';

const signtoken = async (payload: object) => {
    return jwt.sign(payload, `${process.env["JWT_SECRET"]}`, { algorithm:"HS256",expiresIn: `1 hr` })
}

const verifytoken = async (token: string) => {
    const data = jwt.decode(token)
    return data
}

export { signtoken, verifytoken }