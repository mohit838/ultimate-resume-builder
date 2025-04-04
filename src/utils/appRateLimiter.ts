import redisClient from "@/config/redisClient"
import rateLimit from "express-rate-limit"

const appRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each user session to 100 requests per window
    handler: async (req, res) => {
        // Handler called when the rate limit is exceeded
        const token = req.headers.authorization?.split(" ")[1]

        if (token) {
            // Blacklist the token in Redis
            await redisClient.setEx(`blacklist:${token}`, 3600, "true") // Blacklist for an hour

            // Respond to the user with a logout message
            return res.status(429).json({
                message:
                    "Rate limit exceeded. You have been logged out. Please try again later.",
            })
        } else {
            return res
                .status(429)
                .json({ message: "Rate limit exceeded. Try again later." })
        }
    },
})

export default appRateLimiter
