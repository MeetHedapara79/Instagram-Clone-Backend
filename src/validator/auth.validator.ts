import z from "zod";

export const registerUserValidate = z.object({
    emailphone: z.string(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    username:z.string(),
    recoveryCode: z.string().optional().nullable(),
})

export const signinUserValidate = z.object({
    username:z.string(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})
export const forgotPasswordValidate = z.object({
    username:z.string(),
    recoveryCode: z.string().optional().nullable(),
})

export const resetPasswordValidate = z.object({
    username:z.string(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    recoveryCode: z.string().optional().nullable(),
})

export type RegisterUserValidate = z.infer<typeof registerUserValidate>;
export type SigninUserValidate = z.infer<typeof signinUserValidate>;