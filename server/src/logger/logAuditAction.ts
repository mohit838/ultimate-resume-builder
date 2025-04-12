import logger from "@/logger/logger"

/**
 * Log an audit action.
 * @param userId - The ID of the user who performed the action.
 * @param action - Description of the action (e.g., "role_assigned").
 * @param target - Target entity affected by the action (e.g., another user).
 * @param metadata - Additional metadata for the log entry.
 */
export function logAuditAction(
    userId: string,
    action: string,
    target: string,
    metadata: Record<string, any> = {}
) {
    logger.log("audit", "Audit Log", {
        meta: {
            type: "audit",
            userId,
            action,
            target,
            ...metadata,
            timestamp: new Date().toISOString(),
        },
    })
}

// logAuditAction("adminUserId", "role_assigned", "User ID 12345", { role: "Admin" });
