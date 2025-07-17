import { z } from 'zod';
import { Response } from 'express';

export const handleApiResponse = <T extends z.ZodTypeAny>(
  schema: T,
  res: Response,
  data: z.infer<T>
) => {
  try {
    const parsed = schema.safeParse(data);
    if (parsed.success) {
      return parsed.data;
    } else {
      res
        .status(500)
        .json({ success: false, message: "Invalid response format", errors: parsed.error });
      return;
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Invalid response format" });
  }
};