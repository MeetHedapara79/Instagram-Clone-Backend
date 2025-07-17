import z from 'zod';

export const createPostValidate = z.object({
    userId: z.string(),
    location: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    content: z.unknown(),
});

export type CreatePostValidate = z.infer<typeof createPostValidate>;