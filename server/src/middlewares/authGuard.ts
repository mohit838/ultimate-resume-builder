import { CustomError } from "@/errors/CustomError"
import { verifyAccessToken } from "@/utils/jwt"
import { NextFunction, Request, Response } from "express"

export const blockIfAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return next()

    const token = authHeader.split(" ")[1]
    try {
        verifyAccessToken(token)
        throw new CustomError("Already authenticated", 403)
    } catch {
        return next()
    }
}
