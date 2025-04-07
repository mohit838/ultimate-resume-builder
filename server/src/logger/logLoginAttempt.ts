import logger from "@/logger/logger"

export function logLoginAttempt(
    userId: string,
    status: "successful" | "failed",
    ipAddress: string,
    deviceInfo: string = ""
) {
    logger.log("login", "Login Attempt", {
        meta: {
            type: "login_history",
            userId,
            status,
            ipAddress,
            deviceInfo,
            timestamp: new Date().toISOString(),
        },
    })
}
