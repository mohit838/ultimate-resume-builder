import { Response } from "express"

export const successResponse = (
    res: Response,
    data: any = null,
    message: string = "Success",
    status: number = 200
) => {
    res.status(status).json({
        success: true,
        message,
        data,
    })
}

export const failureResponse = (
    res: Response,
    message: string = "Failed",
    status: number = 400
) => {
    res.status(status).json({
        success: false,
        message,
    })
}
