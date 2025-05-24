import { NextFunction, Request, Response } from "express"
import { ZodError, ZodSchema } from "zod"

import { CustomError } from "@/errors/CustomError"

export const validate =
    (schema: ZodSchema<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                const formattedErrors = err.errors.map((e) => ({
                    field: e.path[0],
                    msg: e.message,
                }))
                throw new CustomError("Validation failed", 400, formattedErrors)
            }
            next(err)
        }
    }
