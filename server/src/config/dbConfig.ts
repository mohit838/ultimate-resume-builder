import mysql, { Pool } from "mysql2/promise"
import { DB_CONFIG } from "../config/AppConstant"

class Database {
    private static instance: Pool

    private constructor() {}

    public static async getInstance(): Promise<Pool> {
        if (!Database.instance) {
            Database.instance = mysql.createPool({
                host: DB_CONFIG.mysqlHost,
                port: DB_CONFIG.mysqlPort,
                user: DB_CONFIG.mysqlUser,
                password: DB_CONFIG.mysqlPassword,
                database: DB_CONFIG.mysqlDatabase,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            })

            try {
                const conn = await Database.instance.getConnection()
                console.log("MySQL connected successfully.")
                conn.release()
            } catch (err) {
                console.error("MySQL connection error:", err)
                process.exit(1)
            }
        }

        return Database.instance
    }

    public static async close(): Promise<void> {
        if (Database.instance) {
            await Database.instance.end()
            console.log("MySQL connection pool closed.")
        }
    }
}

export default Database
