import { Response } from "express"

const successResponse = (
    res: Response,
    data: any = null,
    message: string = "Request successful",
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    })
}

const failureResponse = (
    res: Response,
    message: string = "Request failed",
    statusCode: number = 400
) => {
    return res.status(statusCode).json({
        success: false,
        message,
    })
}

export { failureResponse, successResponse }
