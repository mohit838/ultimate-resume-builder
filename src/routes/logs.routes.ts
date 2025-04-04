import { exportLogs, getLogs } from "@/controllers/logs.controller"
import { asyncHandler } from "@/helper/hof"
import express from "express"

const router = express.Router()

router.get("/", asyncHandler(getLogs))

router.get("/export", asyncHandler(exportLogs))

export default router
