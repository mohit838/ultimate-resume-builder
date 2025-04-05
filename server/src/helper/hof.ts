import { NextFunction, Request, Response } from "express"

export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next)

// const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         return Promise.resolve(fn(req, res, next)).catch(next)
//     }
// }
// First () is the outer function that receives your controller
// Second () is the actual Express route handler
// Inside: it runs your controller and catches errors
