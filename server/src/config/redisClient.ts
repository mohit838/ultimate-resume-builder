import { createClient } from "redis"

import { DB_CONFIG } from "@/config/AppConstant"

let redisClientInstance: ReturnType<typeof createClient> | null = null

const getRedisClient = () => {
    if (!redisClientInstance) {
        redisClientInstance = createClient({ url: DB_CONFIG.redisUrl })
        redisClientInstance.on("error", (err) =>
            console.error("Redis Client Error:", err)
        )

        redisClientInstance.connect().then(() => {
            console.log("Connected to Redis successfully.")
        })
    }
    return redisClientInstance
}

export default getRedisClient()
