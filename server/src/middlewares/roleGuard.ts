import { CustomError } from "@/errors/CustomError"
import { NextFunction, Request, Response } from "express"

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role
        if (!userRole || !allowedRoles.includes(userRole)) {
            throw new CustomError(
                "Forbidden: You are not allowed to access this resource",
                403
            )
        }
        next()
    }
}
