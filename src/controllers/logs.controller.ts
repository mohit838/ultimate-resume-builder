import { successResponse } from "@/helper/ApiResponse"
import { getLogsService } from "@/services/logs.service"
import { Request, Response } from "express"
import { Parser } from "json2csv"

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    const { type = "audit", limit = "50", skip = "0" } = req.query

    const logs = await getLogsService(
        type as "audit" | "login",
        parseInt(limit as string),
        parseInt(skip as string)
    )

    successResponse(res, { logs }, "Logs fetched successfully")
}

export const exportLogs = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { type = "audit", limit = "100", skip = "0" } = req.query

    const logs = await getLogsService(
        type as "audit" | "login",
        parseInt(limit as string),
        parseInt(skip as string)
    )

    if (!logs.length) {
        res.status(404).json({
            success: false,
            message: "No logs found to export.",
        })
        return
    }

    // Convert logs to CSV
    const parser = new Parser()
    const csv = parser.parse(logs)

    res.header("Content-Type", "text/csv")
    res.attachment(`${type}_logs.csv`)
    res.send(csv)
}
