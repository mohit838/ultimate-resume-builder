import logger from "@/logger/logger"

/**
 * Log a login attempt.
 * @param userId - The ID of the user attempting to log in.
 * @param status - Status of the login attempt ("successful" or "failed").
 * @param ipAddress - The IP address of the user.
 * @param deviceInfo - Optional details about the user’s device or browser.
 */
export function logLoginAttempt(
    userId: string,
    status: "successful" | "failed",
    ipAddress: string,
    deviceInfo: string = ""
) {
    logger.info("Login History", {
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

// logLoginAttempt("user123", "successful", "192.168.1.1", "Chrome on Windows 10");
