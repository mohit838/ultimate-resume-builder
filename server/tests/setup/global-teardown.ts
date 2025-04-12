// dont use path alias or '@/' this cause error
import Database from "../../src/config/dbConfig"
import redisClient from "../../src/config/redisClient"

export default async function globalTeardown() {
    const db = await Database.getInstance()
    await db.end?.() // safely end MySQL connection
    await redisClient.quit?.() // safely close Redis connection
}
