import { createClient } from "redis"

import { DB_CONFIG } from "@/config/AppConstant"

let redisClientInstance: ReturnType<typeof createClient> | null = null

const getRedisClient = async () => {
    if (!redisClientInstance) {
        redisClientInstance = createClient({ url: DB_CONFIG.redisUrl })
        redisClientInstance.on("error", (err) =>
            console.error("Redis error:", err)
        )
        await redisClientInstance.connect()
        console.log("Connected to Redis successfully.")
    }
    return redisClientInstance
}

export default getRedisClient()
