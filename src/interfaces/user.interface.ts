import { JsonValue } from "../generated/prisma/runtime/library";

export interface User {
    password: string;
    username: string;
    id: string;
    email_phone: string;
    recoveryCode?: string | null;
    profilePic?: string | null;
    followers?: JsonValue;
    following?: JsonValue;
    bio?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Post{
    content: string;
    location?: string | null;
    caption?: string | null;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}