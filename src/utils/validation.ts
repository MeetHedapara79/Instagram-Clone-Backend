import { Response, NextFunction, Request } from "express";
import { ZodSchema } from "zod";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";

export const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
	try {
		if(req.file?.fieldname == "content"){
			const payload = {...req.body, content: req.file.buffer };
			schema.parse(payload);
			next();
		}
		else{
			schema.parse(req.body);
			next();
		}
	} catch (error) {
		const typedError = error as Error;
		res.status(responseStatusCode.failure).json(typedError.message || translation.INTERNAL_SERVER_ERROR);
		return;
	}
};
