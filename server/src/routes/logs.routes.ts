import express from "express"

import { exportLogs, getLogs } from "@/controllers/logs.controller"
import { asyncHandler } from "@/helper/hof"

const router = express.Router()

router.get("/", asyncHandler(getLogs))

router.get("/export", asyncHandler(exportLogs))

export default router
