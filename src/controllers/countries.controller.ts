import { Request, Response } from "express";
import { responseStatusCode } from "../language/constanat";
import { translation } from "../language/translation";
import { countries } from "../data/country";

export const getAllCountries = async (_req:Request, res:Response) => {
    try{
        res.status(responseStatusCode.success).json({ data: countries });
        return;
    } catch(error){
        const typedError = error as Error;
        res.status(responseStatusCode.internal).json({ message: typedError.message || translation.INTERNAL_SERVER_ERROR });
        return;
    }

}