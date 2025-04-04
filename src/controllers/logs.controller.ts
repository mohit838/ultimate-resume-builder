import { successResponse } from "@/helper/ApiResponse"
import { getLogsService } from "@/services/logs.service"
import { Request, Response } from "express"

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    const { type = "audit", limit = "50", skip = "0" } = req.query

    const logs = await getLogsService(
        type as "audit" | "login",
        parseInt(limit as string),
        parseInt(skip as string)
    )

    successResponse(res, { logs }, "Logs fetched successfully")
}
