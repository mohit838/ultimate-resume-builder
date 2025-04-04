import { fetchLogs } from "@/repositories/logs.repository"

export const getLogsService = async (
    type: "audit" | "login" = "audit",
    limit = 50,
    skip = 0
) => {
    const collectionName = type === "audit" ? "audit_logs" : "login_history"
    return await fetchLogs(collectionName, limit, skip)
}
